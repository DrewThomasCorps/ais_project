import DaoMongoCrud from "./DaoMongoCrud";
import {Db} from "mongodb";
import CrudDao from "../interface/CrudDao";
import AisMessage from "../../models/AisMessage";
import TileDaoFactory from "../factory/TileDaoFactory";
import {DatabaseConfig} from "../../config/DatabaseConfig";

export default class AisMessageDaoMongo extends DaoMongoCrud<AisMessage> implements CrudDao<AisMessage> {

    constructor(database: Db) {
        super(database);
        this.collectionName = 'aisdk_20201118';
        this.mongoModel = AisMessage.prototype;
    }

    async insertBatch(models: AisMessage[]): Promise<number> {
        models.map((model) => {
            this.toDocument(model)
        })
        const insertWriteOpResult = await this.database.collection(this.collectionName).insertMany(models);
        return insertWriteOpResult.insertedCount;
    }

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

    async deleteMessagesFiveMinutesOlderThanTime(time: Date): Promise<number> {
        time.setMinutes(time.getMinutes() - 5);
        const deleteWriteOpResultObject = await this.database.collection(this.collectionName).deleteMany({
            Timestamp: {$lt: time}
        })
        return deleteWriteOpResultObject.deletedCount ?? 0;
    }

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
        const aisMessage = AisMessage.fromJson(JSON.stringify(recentPosition[0]))
        return {
            MMSI: aisMessage.mmsi,
            lat: aisMessage.position?.latitude,
            long: aisMessage.position?.longitude,
            IMO: aisMessage.imo
        }
    }

    async findMostRecentPositionsInTile(tileId: number): Promise<any[]> {
        const tileDaoMongo = await TileDaoFactory.getTileDao(DatabaseConfig.Config);
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
                    {'Position.coordinates.1': {$gte: tile.image_east}},
                    {'Position.coordinates.1': {$lt: tile.image_west}}
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
