import DaoMongoCrud from "./DaoMongoCrud";
import {Db} from "mongodb";
import AisMessage from "../../models/AisMessage";
import DaoFactory from "../factory/DaoFactory";
import {DatabaseConfig} from "../../config/DatabaseConfig";
import AisMessageDao from "../interface/AisMessageDao";
import Port from "../../models/Port";

/**
 * Mongo implementation of the `AisMessageDao` interface
 */
export default class AisMessageDaoMongo extends DaoMongoCrud<AisMessage> implements AisMessageDao {

    /**
     * Constructs an AisMessageDaoMongo with a connection to the Db injected.
     * @param database
     */
    constructor(database: Db) {
        super(database);
        this.collectionName = 'aisdk_20201118';
        this.mongoModel = AisMessage.prototype;
    }

    /**
     * Inserts a batch of AisMessages into the database.
     *
     * @param models to be created
     * @return Promise<number> of number of models inserted
     */
    async insertBatch(models: AisMessage[]): Promise<number> {
        models.map((model) => {
            this.toDocument(model)
        })
        const insertWriteOpResult = await this.database.collection(this.collectionName).insertMany(models);
        return insertWriteOpResult.insertedCount;
    }

    /**
     * Finds the latest ship positions as reported in positions_reports.
     *
     * Returns array of documents in the following format:
     * ```
     * [{'MMSI': 1234567890, 'Timestamp': 2020-11-18T00:00:00.000Z, 'Position': {'type': 'Point', 'coordinates': [30, 20]}}]
     * ```
     *
     * @return Promise<any[]> of latest ship positions.
     */
    async findMostRecentShipPositions(): Promise<any[]> {
        return await this.database.collection(this.collectionName).aggregate([
            {
                $match: {
                    "MsgType": "position_report"
                }
            },
            {
                $sort: {
                    'Timestamp': -1
                }
            },
            {
                $group: {
                    _id: "$MMSI",
                    'Timestamp': {$first: '$Timestamp'},
                    'Position': {$first: '$Position'}
                }
            },
            {
                $project: {
                    _id: 0,
                    'MMSI': '$_id',
                    'Timestamp': 1,
                    'Position': 1
                },
            },
            {
                $sort: {
                    'MMSI': 1,
                }
            }
        ], {allowDiskUse: true}).toArray();
    }

    /**
     * Deletes all messages older than five minutes of given time.
     * If a message is exactly 5 minutes older, the message is not deleted.
     *
     * @param time that messages five minutes older than should be deleted.
     * @return Promise<number> of number of messages deleted
     */
    async deleteMessagesFiveMinutesOlderThanTime(time: Date): Promise<number> {
        time.setMinutes(time.getMinutes() - 5);
        const deleteWriteOpResultObject = await this.database.collection(this.collectionName).deleteMany({
            Timestamp: {$lt: time}
        })
        return deleteWriteOpResultObject.deletedCount ?? 0;
    }

    /**
     * Finds the latest ship position for the ship with the given MMSI.
     *
     * Returns document in the following format:
     * ```
     * {'MMSI': 1234567890, 'Timestamp': '2020-11-18T00:00:00.000Z', 'lat': 30, 'long': 20, IMO: 103212331}
     * ```
     *
     * @param mmsi
     * @return Promise<any> of the last position for the given ship.
     */
    async findMostRecentPositionForMmsi(mmsi: number): Promise<any> {
        const recentPosition = await this.database.collection(this.collectionName).aggregate([{
            $match: {
                "MsgType": "position_report",
                'MMSI': mmsi
            }
        }, {
            $sort: {
                'Timestamp': -1
            }
        },
            {$limit: 1}
        ]).toArray()
        const aisMessage = AisMessage.fromJson(JSON.stringify(recentPosition[0] ?? ''));
        return {
            MMSI: aisMessage.mmsi,
            lat: aisMessage.position?.latitude,
            long: aisMessage.position?.longitude,
            IMO: aisMessage.imo
        }
    }

    /**
     * Finds the latest ship positions as reported in positions_reports within the given tile.
     *
     * Returns array of documents in the following format:
     * ```
     * [{'MMSI': 1234567890, 'Timestamp': 2020-11-18T00:00:00.000Z, 'Position': {'type': 'Point', 'coordinates': [30, 20]}}]
     * ```
     *
     * @param tileId id of tile to find ship positions within.
     * @return Promise<any[]> of latest ship positions within given tile.
     */
    async findMostRecentPositionsInTile(tileId: number): Promise<any[]> {
        const tileDaoMongo = await DaoFactory.getTileDao(DatabaseConfig.Config);
        const tile = await tileDaoMongo.getTileImage(tileId);
        return await this.database.collection(this.collectionName).aggregate([{
            $match: {
                'MsgType': "position_report"
            }
        }, {
            $sort: {
                'MMSI': 1,
                'Timestamp': -1
            }
        }, {
            $group: {
                _id: "$MMSI",
                'Timestamp': {$first: '$Timestamp'},
                'Position': {$first: '$Position'},
            }
        }, {
            $match: {
                $and: [
                    {'Position.coordinates.0': {$lte: tile.image_north}},
                    {'Position.coordinates.0': {$gt: tile.image_south}},
                    {'Position.coordinates.1': {$lte: tile.image_east}},
                    {'Position.coordinates.1': {$gt: tile.image_west}}
                ]
            }
        }, {
            $project: {
                _id: 0, 'MMSI': '$_id', 'Timestamp': 1, 'Position': 1
            }
        }, {
            $sort: {
                'MMSI': 1,
            }
        }
        ], {allowDiskUse: true}).toArray();
    }

    /**
     * Finds the latest ship positions, static data; and vessel data given an MMSI, Name, Call Sign, or IMO.
     * @param filterModel
     * @return array
     */
    async findStaticAndTransientData(filterModel: AisMessage): Promise<any> {
        let vessel_static_data: any;
        let queryObject = {...this.toDocument(filterModel), "MsgType": "static_data"};

        vessel_static_data = await this.database.collection(this.collectionName).aggregate([
            {$match: queryObject},
            {$sort: {'Timestamp': -1}}, {$limit: 1},
            {$lookup: {from: 'vessels', localField: 'MMSI', foreignField: 'MMSI', as: 'Vessel_Data'}}
        ]).toArray();

        const vessel = vessel_static_data[0];

        if (filterModel.mmsi !== null && vessel) {
            vessel['PositionData'] = await this.findMostRecentPositionForMmsi(filterModel.mmsi);
        }

        return vessel;
    }

    /**
     * Finds the most recent ship positions in tile of scall 3 containing the port specified. If the specified port matches multiple ports,
     * then each of the matched ports is returned.
     * @param portName
     * @param country
     */
    async findAllShipPositionsInTileContainingPort(portName: string, country: string): Promise<any> {
        const portsAndTiles = await this.database.collection('ports').aggregate([{
            $match: {
                port_location: portName,
                country: country
            }
        }]).toArray();
        if (portsAndTiles.length > 1) {
            return portsAndTiles.map((port) => Port.fromJson(JSON.stringify(port)))
        } else {
            return this.findMostRecentPositionsInTile(portsAndTiles[0]?.mapview_3)
        }
    }

    /**
     * Converts an `AisMessage` instance into a document to be stored in the database.
     * @param model
     * @return object to be used as document inside a Mongo database.
     */
    toDocument(model?: AisMessage): object {
        if (model === undefined) {
            return {};
        }

        let document: any = {};

        if (model.timestamp) {
            document.Timestamp = model.timestamp.toISOString();
        }
        if (model.shipClass) {
            document.Class = model.shipClass;
        }
        if (model.mmsi) {
            document.MMSI = model.mmsi;
        }
        if (model.messageType) {
            document.MsgType = model.messageType;
        }

        // Position Report Fields
        if (model.position) {
            document.Position = {type: model.position.type, coordinates: [model.position.latitude, model.position.longitude]};
        }
        if (model.status) {
            document.Status = model.status;
        }
        if (model.rate_of_turn) {
            document.RoT = model.rate_of_turn;
        }
        if (model.speed_over_ground) {
            document.SoG = model.speed_over_ground;
        }
        if (model.course_over_ground) {
            document.CoG = model.course_over_ground;
        }
        if (model.heading) {
            document.Heading = model.heading;
        }

        // Static Data Fields
        if (model.imo) {
            document.IMO = model.imo
        }
        if (model.callSign) {
            document.CallSign = model.callSign
        }
        if (model.name) {
            document.Name = model.name
        }
        if (model.vesselType) {
            document.VesselType = model.vesselType
        }
        if (model.length) {
            document.Length = model.length
        }
        if (model.breadth) {
            document.Breadth = model.breadth
        }
        if (model.draught) {
            document.Draught = model.draught
        }
        if (model.destination) {
            document.Destination = model.destination
        }
        if (model.eta) {
            document.ETA = model.eta
        }
        if (model.a) {
            document.A = model.a
        }
        if (model.b) {
            document.B = model.b
        }
        if (model.c) {
            document.C = model.c
        }
        if (model.d) {
            document.D = model.d
        }
        return document;
    }

}
