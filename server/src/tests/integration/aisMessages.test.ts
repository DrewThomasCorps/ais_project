import chai, {expect} from 'chai';
import chaiHttp from 'chai-http'
import {Collection, Db} from "mongodb";
import Mongo from "../../daos/databases/Mongo";
import app from '../../index';
import {DatabaseConfig} from "../../config/DatabaseConfig";
import {readFileSync} from "fs";

describe('AisMessageIntegration', function () {
    let database: Db;

    const url = 'mongodb://localhost:27017';
    const databaseName = 'test_ais_project';

    before(async function () {
        process.env["DATABASE_NAME"] = databaseName;
        process.env["DATABASE_URL"] = url;
        process.env["DATABASE_TYPE"] = 'mongo';
        const databaseConfig = DatabaseConfig.Config;
        database = await Mongo.getDatabase(databaseConfig);
        chai.use(chaiHttp);
    })

    beforeEach(async function () {
        const collections = await database.collections();
        if (collections.find((collection: Collection) => {
            return collection.collectionName === 'aisdk_20201118';
        })) {
            await database.dropCollection('aisdk_20201118');
        }
        await database.createCollection('aisdk_20201118');
        if (collections.find((collection: Collection) => {
            return collection.collectionName === 'mapviews';
        })) {
            await database.dropCollection('mapviews');
        }
        await database.createCollection('mapviews');
    })

    after(async function () {
        await Mongo.closeDatabase();
    })

    describe('getPositions()', function () {
        it('should get array of postions', async function () {
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
                {...shipOne, ...positionOne, ...minuteZero},
                {...shipOne, ...positionTwo, ...minuteOne},
                {...shipThree, ...minuteZero, ...positionTwo},
                {...shipOne, ...positionThree, ...minuteTwo},
                {...shipTwo, ...minuteTwo, ...positionTwo},
                {...shipTwo, ...minuteOne, ...positionOne}
            ]);
            const response = await chai.request(app).get('/recent-ship-positions');
            const mostRecentPositions = response.body;
            expect(mostRecentPositions.length).to.be.equal(3);
            expect(mostRecentPositions[0]?.MMSI).to.be.equal(1);
            expect(mostRecentPositions[0]?.Position).to.deep.equal(positionThree.Position);
            expect(mostRecentPositions[1]?.MMSI).to.be.equal(2);
            expect(mostRecentPositions[1]?.Position).to.deep.equal(positionTwo.Position);
            expect(mostRecentPositions[2]?.MMSI).to.be.equal(3);
            expect(mostRecentPositions[2]?.Position).to.deep.equal(positionTwo.Position);
            expect(response.status).to.be.equal(200);
        });

        it('should get most recent position for MMSI', async function () {
            const positionOne = {Position: {'type': "Point", "coordinates": [1, 2]}};
            const positionTwo = {Position: {'type': "Point", "coordinates": [3, 4]}};
            const positionThree = {Position: {'type': "Point", "coordinates": [5, 6]}};
            const minuteZero = {Timestamp: new Date('2020-11-18T00:00:00Z')};
            const minuteOne = {Timestamp: new Date('2020-11-18T00:00:01Z')};
            const minuteTwo = {Timestamp: new Date('2020-11-18T00:00:02Z')};
            const shipOne = {MMSI: 1, MsgType: 'position_report', IMO: 11};
            const shipTwo = {MMSI: 2, MsgType: 'position_report', IMO: 22};
            const shipThree = {MMSI: 3, MsgType: 'position_report', IMO: 33};


            await database.collection('aisdk_20201118').insertMany([
                {...shipOne, ...positionOne, ...minuteZero},
                {...shipOne, ...positionTwo, ...minuteOne},
                {...shipOne, ...positionThree, ...minuteTwo},
                {...shipThree, ...minuteZero, ...positionTwo},
                {...shipTwo, ...minuteTwo, ...positionTwo},
                {...shipTwo, ...minuteOne, ...positionOne}
            ]);

            const response = await chai.request(app).get('/recent-ship-positions?mmsi=' + shipOne.MMSI);
            expect(response.body.MMSI).to.be.equal(shipOne.MMSI);
            expect(response.body.lat).to.be.equal(positionThree.Position.coordinates[0]);
            expect(response.body.long).to.be.equal(positionThree.Position.coordinates[1]);
            expect(response.body.IMO).to.be.equal(shipOne.IMO);
        });

        it('should find the most recent ship positions within a tile', async function () {
            const positionOneInTileOne = {Position: {'type': "Point", "coordinates": [30, 20]}};
            const positionTwoInTileOne = {Position: {'type': "Point", "coordinates": [31, 21]}};
            const positionThreeInTileTwo = {Position: {'type': "Point", "coordinates": [39, 30]}};
            const minuteZero = {Timestamp: new Date('2020-11-18T00:00:00Z')};
            const minuteOne = {Timestamp: new Date('2020-11-18T00:00:01Z')};
            const minuteTwo = {Timestamp: new Date('2020-11-18T00:00:02Z')};
            const shipOne = {MMSI: 1, MsgType: 'position_report', IMO: 11};
            const shipTwo = {MMSI: 2, MsgType: 'position_report', IMO: 22};
            const shipThree = {MMSI: 3, MsgType: 'position_report', IMO: 33};

            await database.collection('mapviews').insertMany([
                {id: 1, image_north: 35, image_south: 25, image_east: 25, image_west: 15},
                {id: 2, image_north: 45, image_south: 36, image_east: 35, image_west: 26}
            ])

            await database.collection('aisdk_20201118').insertMany([
                {...shipOne, ...positionOneInTileOne, ...minuteZero},
                {...shipOne, ...positionTwoInTileOne, ...minuteOne},
                {...shipOne, ...positionThreeInTileTwo, ...minuteTwo},
                {...shipThree, ...minuteZero, ...positionTwoInTileOne},
                {...shipTwo, ...minuteTwo, ...positionTwoInTileOne},
                {...shipTwo, ...minuteOne, ...positionOneInTileOne}
            ]);
            const response = await chai.request(app).get('/recent-ship-positions?tile_id=1');
            expect(response.body.length).to.be.equal(2);
            expect(response.body[0]?.MMSI).to.be.equal(2);
            expect(response.body[0]?.Position).to.deep.equal(positionTwoInTileOne.Position);
            expect(response.body[1]?.MMSI).to.be.equal(3);
            expect(response.body[1]?.Position).to.deep.equal(positionTwoInTileOne.Position);
        });
    });

    describe('createAisMessages()', function () {
        it('should create a batch of messages if array is posted', async function () {
            const response = await chai.request(app).post('/ais-messages')
                .send(readFileSync('src/tests/resources/models/ais_messages_500_batch.json').toString());
            expect(response.body.insertedCount).to.be.equal(500);
            expect(await database.collection('aisdk_20201118').countDocuments()).to.be.equal(500);
        });

        it('should create a single position report', async function () {
            const response = await chai.request(app).post('/ais-messages')
                .send(readFileSync('src/tests/resources/models/position_report_one.json').toString());
            expect(response.body.insertedCount).to.be.equal(1);
            expect(await database.collection('aisdk_20201118').countDocuments()).to.be.equal(1);
        });

        it('should create a single static data message', async function () {
            const response = await chai.request(app).post('/ais-messages')
                .send(readFileSync('src/tests/resources/models/static_data_one.json').toString());
            expect(response.body.insertedCount).to.be.equal(1);
            expect(await database.collection('aisdk_20201118').countDocuments()).to.be.equal(1);
        });
    });

    describe('deleteAisMessagesFiveMinutesOlderThanTime()', function () {
        it('should delete messages more than five minutes older than passed time', async function () {
            const currentTime = {Timestamp: new Date('2020-11-18T00:10:00Z')};
            // Expect to keep exactly five minute older messages
            const fiveMinutesOlder = {Timestamp: new Date('2020-11-18T00:05:00Z')};
            const sixMinutesOlder = {Timestamp: new Date('2020-11-18T00:04:00Z')};
            const shipOne = {MMSI: 1, MsgType: 'position_report'};
            const shipTwo = {MMSI: 2, MsgType: 'position_report'};
            const shipThree = {MMSI: 3, MsgType: 'position_report'};
            await database.collection('aisdk_20201118').insertMany([
                {...shipOne, ...currentTime},
                {...shipThree, ...currentTime},
                {...shipOne, ...fiveMinutesOlder},
                {...shipTwo, ...sixMinutesOlder},
                {...shipOne, ...sixMinutesOlder},
                {...shipTwo, ...fiveMinutesOlder}
            ]);
            const response = await chai.request(app).delete('/ais-messages?time=' + currentTime.Timestamp.toISOString());
            expect(response.body.deletedMessages).to.be.equal(2);
            expect(await database.collection('aisdk_20201118').countDocuments()).to.be.equal(4);
        });
    });


});
