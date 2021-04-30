import {Collection, Db, ObjectId} from "mongodb";
import {expect} from "chai";
import {readFileSync} from "fs";
import Mongo from "../../../daos/databases/Mongo";
import AisMessageDaoFactory from "../../../daos/factory/AisMessageDaoFactory";
import AisMessage from "../../../models/AisMessage";
import AisMessageDao from "../../../daos/interface/AisMessageDao";

describe('AisMessageDaoMongo', function () {
    let database: Db;
    let aisMessageDaoMongo: AisMessageDao;

    const url = 'mongodb://localhost:27017';
    const databaseName = 'test_ais_project';

    before(async function () {
        const databaseConfig = {
            getType() {
                return 'mongo';
            },
            getUrl() {
                return url
            },
            getName() {
                return databaseName
            }
        }
        database = await Mongo.getDatabase(databaseConfig);
        aisMessageDaoMongo = await AisMessageDaoFactory.getAisMessageDao(databaseConfig);

    })

    beforeEach(async function () {
        const collections = await database.collections();
        if (collections.find((collection: Collection) => {
            return collection.collectionName === 'aisdk_20201118';
        })) {
            await database.dropCollection('aisdk_20201118');
        }
        await database.createCollection('aisdk_20201118');
    })

    after(async function () {
        await Mongo.closeDatabase();
    })

    const insertTestAisMessages = async () => {
        await database.collection('aisdk_20201118').insertMany([
            {
                '_id': new ObjectId('a1-b2-c3-d4z'),
                'Timestamp': new Date("2020-11-18T00:00:00Z"),
                'Class': 'Class A',
                'MsgType': 'position_report',
                'MMSI': 219024175,
                'Position': {'type': "Point", "coordinates": [55.516188, 10.56997]},
                'Status': 'Under way using engine',
                'Rot': 0,
                'SoG': 0,
                'CoG': 159,
                'Heading': 214,
            },
            {
                '_id': new ObjectId('b2-c3-d4-e5z'),
                'Timestamp': new Date("2020-11-18T00:00:01Z"),
                'Class': 'AtoN',
                'MMSI': 992191518,
                'Position': {'type': "Point", "coordinates": [55.767517, 4.648298]},
                'Status': 'Unknown Value',
                'Rot': 0,
                'SoG': 0,
                'CoG': 159,
                'Heading': 214,
            },
            {
                '_id': new ObjectId('c3-d4-e5-f6z'),
                "Timestamp": "2020-11-18T00:00:00.000Z",
                "Class": "AtoN",
                "MMSI": 992111840,
                "MsgType": "static_data",
                "IMO": "Unknown",
                "Name": "WIND FARM BALTIC1NW",
                "CallSign": "XPH3948",
                "Destination": "HVIDE-SANDE",
                "ETA": "2020-11-03T17:30:00Z",
                "VesselType": "Undefined",
                "Length": 60,
                "Breadth": 61,
                "Draught": 62,
                "A": 31,
                "B": 32,
                "C": 33,
                "D": 34
            }

        ])
    }

    describe('insert()', function () {
        it('should insert a new position report', async function () {
            const positionReportToInsert = AisMessage.fromJson(readFileSync('src/tests/resources/models/position_report_one.json').toString());
            const insertedPositionReport = await aisMessageDaoMongo.insert(positionReportToInsert);
            const aisMessageCount = await database.collection('aisdk_20201118').countDocuments();
            expect(aisMessageCount).to.be.equal(1);
            expect(insertedPositionReport.id).to.not.be.equal(null);
            expect(insertedPositionReport.timestamp?.toISOString()).to.be.equal("2020-11-18T00:00:00.000Z");
            expect(insertedPositionReport.position?.latitude).to.be.equal(55.219403);
        });

        it('should insert a new static data ais message', async function () {
            const staticDataToInsert = AisMessage.fromJson(readFileSync('src/tests/resources/models/static_data_one.json').toString());
            const insertedStaticData = await aisMessageDaoMongo.insert(staticDataToInsert);
            const aisMessageCount = await database.collection('aisdk_20201118').countDocuments();
            expect(aisMessageCount).to.be.equal(1);
            expect(insertedStaticData.id).to.not.be.equal(null);
            expect(insertedStaticData.timestamp?.toISOString()).to.be.equal("2020-11-18T00:00:00.000Z");
            expect(insertedStaticData.position).to.be.null;
            expect(insertedStaticData.eta?.toISOString()).to.be.equal("2020-11-03T17:30:00.000Z")
        });
    });

    describe('update()', function () {
        it('should update an existing document', async function () {
            await insertTestAisMessages();
            const updatedPositionReportModel = AisMessage.fromJson(JSON.stringify({Class: 'Class B', RoT: 1}));
            const updatedPositionReport = await aisMessageDaoMongo.update('a1-b2-c3-d4z', updatedPositionReportModel);
            expect(updatedPositionReport.shipClass).to.be.equal('Class B');
            expect(updatedPositionReport.rate_of_turn).to.be.equal(1);
            expect(updatedPositionReport.mmsi).to.be.equal(219024175);
        });
    });

    describe('delete()', function () {
        it('should delete an existing document', async function () {
            await insertTestAisMessages();
            await aisMessageDaoMongo.delete('a1-b2-c3-d4z');
            const aisMessageCount = await database.collection('aisdk_20201118').countDocuments();
            expect(aisMessageCount).to.be.equal(2);
        });
    });

    describe('findAll()', function () {
        it('should return all ais messages in collection', async function () {
            await insertTestAisMessages();
            const aisMessages = await aisMessageDaoMongo.findAll();
            expect(aisMessages.length).to.be.equal(3);
            expect(aisMessages[0]?.mmsi).to.equal(219024175);
            expect(aisMessages[1]?.status).to.be.equal('Unknown Value');
            expect(aisMessages[2]?.draught).to.be.equal(62);
        });

        it('should return filtered ais message when filtered on 1 param', async function () {
            await insertTestAisMessages();
            let aisMessage = await aisMessageDaoMongo.findAll(AisMessage.fromJson(
                JSON.stringify({MMSI: 992111840})
            ));
            expect(aisMessage.length).to.be.equal(1);
            expect(aisMessage[0]?.imo).to.equal('Unknown');
        });
    });

    describe('find()', function () {
        it('should return aisMessage in collection by id', async function () {
            await insertTestAisMessages();
            const aisMessage = await aisMessageDaoMongo.find('a1-b2-c3-d4z');
            expect(aisMessage.course_over_ground).to.equal(159);
            expect(aisMessage.heading).to.be.equal(214);
        });
    });

    describe('insertBatch()', function () {
        it('should insert AIS messages of different types', async function () {
            const messageJson = JSON.parse(readFileSync('src/tests/resources/models/ais_messages_500_batch.json').toString())
            messageJson.map((message: any) => {
                AisMessage.fromJson(JSON.stringify(message));
            })
            const insertedAisMessageCount = await aisMessageDaoMongo.insertBatch(messageJson);
            expect(insertedAisMessageCount).to.be.equal(500);
        });
    });

    describe('findMostRecentShipPositions()', function () {
        it('should find the most recent ship positions', async function () {
            const positionOne = {Position: {'type': "Point", "coordinates": [1, 2]}};
            const positionTwo = {Position: {'type': "Point", "coordinates": [3, 4]}};
            const positionThree = {Position: {'type': "Point", "coordinates": [5, 6]}};
            const minuteZero = {Timestamp: new Date('2020-11-18T00:00:00Z')};
            const minuteOne = {Timestamp: new Date('2020-11-18T00:00:01Z')};
            const minuteTwo = {Timestamp: new Date('2020-11-18T00:00:02Z')};
            const shipOne = {MMSI: 1, MsgType: 'position_report'};
            const shipTwo = {MMSI: 2, MsgType: 'position_report'};
            const shipThree = {MMSI: 3, MsgType: 'position_report'};


            await database.collection('aisdk_20201118').insertMany([
                {
                    ...shipOne,
                    ...positionOne,
                    ...minuteZero
                },
                {
                    ...shipOne,
                    ...positionTwo,
                    ...minuteOne
                },
                {
                    ...shipThree,
                    ...minuteZero,
                    ...positionTwo
                },
                {
                    ...shipOne,
                    ...positionThree,
                    ...minuteTwo
                },
                {
                    ...shipTwo,
                    ...minuteTwo,
                    ...positionTwo
                },
                {
                    ...shipTwo,
                    ...minuteOne,
                    ...positionOne
                }
            ]);

            const mostRecentPositions = await aisMessageDaoMongo.findMostRecentShipPositions();
            expect(mostRecentPositions.length).to.be.equal(3);
            expect(mostRecentPositions[0]?.MMSI).to.be.equal(1);
            expect(mostRecentPositions[0]?.Position).to.deep.equal(positionThree.Position);
            expect(mostRecentPositions[1]?.MMSI).to.be.equal(2);
            expect(mostRecentPositions[1]?.Position).to.deep.equal(positionTwo.Position);
            expect(mostRecentPositions[2]?.MMSI).to.be.equal(3);
            expect(mostRecentPositions[2]?.Position).to.deep.equal(positionTwo.Position);
        });
    });
});
