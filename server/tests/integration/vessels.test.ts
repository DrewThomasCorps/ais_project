import chai, {expect} from 'chai';
import chaiHttp from 'chai-http'
import {Collection, Db, ObjectId} from "mongodb";
import Mongo from "../../src/daos/databases/Mongo";
import app from '../../src';
import {DatabaseConfig} from "../../src/config/DatabaseConfig";

describe('VesselIntegration', function () {
    let database: Db;

    const url = 'mongodb://localhost:27017';
    const databaseName = 'test_ais_project';

    before(async function () {
        process.env["MONGO_DATABASE_NAME"] = databaseName;
        process.env["MONGO_DATABASE_URL"] = url;
        const databaseConfig = DatabaseConfig.Mongo;
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

    const insertTestVessels = async () => {
        await database.collection('vessels').insertMany([
            {
                _id: new ObjectId('a1-b2-c3-d4z'),
                IMO: 1,
                Name: 'One'
            },
            {
                _id: new ObjectId('b1-b2-c3-d4z'),
                IMO: 2,
                Name: 'Two'
            },
        ])
    }

    describe('getVessels', function () {
        it('should get empty array when there are no vessels', async function () {
            const response = await chai.request(app).get('/vessels');
            expect(response.body).to.deep.equal([]);
            expect(response.status).to.be.equal(200);
        });
        it('should get array of vessels', async function () {
            await insertTestVessels();
            const response = await chai.request(app).get('/vessels');
            expect(response.body).to.deep.equal([
                {
                    id: new ObjectId('a1-b2-c3-d4z').toHexString(),
                    imo: 1,
                    name: 'One',
                    flag: null,
                    built: null,
                    length: null,
                    breadth: null,
                    tonnage: null,
                    mmsi: null,
                    vessel_type: null,
                    owner: null,
                    former_names: null,
                },
                {
                    id: new ObjectId('b1-b2-c3-d4z').toHexString(),
                    imo: 2,
                    name: 'Two',
                    flag: null,
                    built: null,
                    length: null,
                    breadth: null,
                    tonnage: null,
                    mmsi: null,
                    vessel_type: null,
                    owner: null,
                    former_names: null,
                },
            ]);
            expect(response.status).to.be.equal(200);
        });
    });

    describe('createVessel', function () {
        it('should get inserted vessel from database', async function () {
            const response = await chai.request(app).post('/vessels').send(JSON.stringify({IMO: 12}));
            expect(response.body.imo).to.be.equal(12);
            expect(response.body.id).to.not.be.null;
            expect(response.status).to.be.equal(201);
        });
    });

    describe('findVessel', function () {
        it('should get inserted vessel from database', async function () {
            await insertTestVessels();
            const response = await chai.request(app).get('/vessels/' + new ObjectId('a1-b2-c3-d4z').toHexString());
            expect(response.body.imo).to.be.equal(1);
            expect(response.body.name).to.be.equal('One');
            expect(response.body.id).to.not.be.null;
            expect(response.status).to.be.equal(200);
        });
    });

    describe('updateVessel', function () {
        it('should update vessel in the database', async function () {
            await insertTestVessels();
            const response = await chai.request(app).put('/vessels/' + new ObjectId('a1-b2-c3-d4z').toHexString())
                .send(JSON.stringify({IMO: 3, Breadth: 120}));
            expect(response.body.imo).to.be.equal(3);
            expect(response.body.name).to.be.equal('One');
            expect(response.body.breadth).to.be.equal(120);
            expect(response.body.id).to.be.equal(new ObjectId('a1-b2-c3-d4z').toHexString());
            expect(response.status).to.be.equal(200);
        });
    });

    describe('deleteVessel', function () {
        it('should delete vessel in the database', async function () {
            await insertTestVessels();
            const response = await chai.request(app).delete('/vessels/' + new ObjectId('a1-b2-c3-d4z').toHexString());
            expect(response.status).to.be.equal(204);
            const vesselsInDatabase = await database.collection('vessels').countDocuments();
            expect(vesselsInDatabase).to.be.equal(1);
        });
    });

    describe('notFound', function () {
        it('should return not found', async function () {
            const response = await chai.request(app).post('/undefined-route').send(JSON.stringify({IMO: 12}));
            expect(response.status).to.be.equal(404);
        });
    })

});
