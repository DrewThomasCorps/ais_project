import chai, {expect} from 'chai';
import chaiHttp from 'chai-http'
import {Collection, Db} from "mongodb";
import Mongo from "../../daos/databases/Mongo";
import app from '../../index';
import {DatabaseConfig} from "../../config/DatabaseConfig";

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
            return collection.collectionName === 'vessels';
        })) {
            await database.dropCollection('vessels');
        }
        await database.createCollection('vessels');
    })

    after(async function () {
        await Mongo.closeDatabase();
    })

    describe('getRecentShipPositions()', function () {
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
    });


});
