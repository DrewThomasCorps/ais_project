import chai, {expect} from 'chai';
import chaiHttp from 'chai-http'
import {Collection, Db, ObjectId} from "mongodb";
import Mongo from "../../daos/databases/Mongo";
import app from '../../index';
import {DatabaseConfig} from "../../config/DatabaseConfig";

describe('PortIntegration', function () {
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
            return collection.collectionName === 'ports';
        })) {
            await database.dropCollection('ports');
        }
        await database.createCollection('ports');
    })

    after(async function () {
        await Mongo.closeDatabase();
    })

    const insertTestPorts = async () => {
        await database.collection('ports').insertMany([
            {
                '_id': new ObjectId('a1-b2-c3-d4z'),
                'id': 1234,
                'un/locode': 'PPPPP',
                'port_location': 'Portone',
                'country': 'Denmark',
                'longitude': 10.665278,
                'latitude': 55.451389,
                'website': 'www.portone.dk',
                'mapview_1': 1,
                'mapview_2': 1111,
                'mapview_3': 11112
            },
            {
                '_id': new ObjectId('b2-c3-d4-e5z'),
                'id': 5678,
                'un/locode': 'OOOOO',
                'port_location': 'Porttwo',
                'country': 'Denmark',
                'longitude': 11.665278,
                'latitude': 56.451389,
                'website': 'www.porttwo.dk',
                'mapview_1': 1,
                'mapview_2': 2221,
                'mapview_3': 22212
            }
        ])
    }

    describe('getPorts', function () {
        it('should get empty array when there are no ports', async function () {
            const response = await chai.request(app).get('/ports');
            expect(response.body).to.deep.equal([]);
            expect(response.status).to.be.equal(200);
        });
        it('should get array of ports', async function () {
            await insertTestPorts();
            const response = await chai.request(app).get('/ports');
            expect(response.body).to.deep.equal([
                {
                    id: 1234,
                    un_locode: 'PPPPP',
                    port_location: 'Portone',
                    country: 'Denmark',
                    longitude: 10.665278,
                    latitude: 55.451389,
                    website: 'www.portone.dk',
                    mapview_1: 1,
                    mapview_2: 1111,
                    mapview_3: 11112
                },
                {
                    id: 5678,
                    un_locode: 'OOOOO',
                    port_location: 'Porttwo',
                    country: 'Denmark',
                    longitude: 11.665278,
                    latitude: 56.451389,
                    website: 'www.porttwo.dk',
                    mapview_1: 1,
                    mapview_2: 2221,
                    mapview_3: 22212
                },
            ]);
            expect(response.status).to.be.equal(200);
        });
    });

    describe('createPort', function () {
        it('should get inserted port from database', async function () {
            const response = await chai.request(app).post('/ports').send(JSON.stringify({id: 5678}));
            expect(response.body.id).to.be.equal(5678);
            expect(response.status).to.be.equal(201);
        });
    });

    describe('findPort', function () {
        it('should get inserted port from database', async function () {
            await insertTestPorts();
            const response = await chai.request(app).get('/ports/' + new ObjectId('a1-b2-c3-d4z').toHexString());
            expect(response.body.id).to.be.equal(1234);
            expect(response.body.port_location).to.be.equal('Portone');
            expect(response.body.id).to.not.be.null;
            expect(response.status).to.be.equal(200);
        });
    });

    describe('updatePort', function () {
        it('should update port in the database', async function () {
            await insertTestPorts();
            const response = await chai.request(app).put('/ports/' + new ObjectId('a1-b2-c3-d4z').toHexString())
                .send(JSON.stringify({port_location: 'Gothenburg', country: 'Sweden'}));
            expect(response.body.id).to.be.equal(1234);
            expect(response.body.port_location).to.be.equal('Gothenburg');
            expect(response.body.country).to.be.equal('Sweden');
            expect(response.status).to.be.equal(200);
        });
    });

    describe('deletePort', function () {
        it('should delete port in the database', async function () {
            await insertTestPorts();
            const response = await chai.request(app).delete('/ports/' + new ObjectId('a1-b2-c3-d4z').toHexString());
            expect(response.status).to.be.equal(204);
            const portsInDatabase = await database.collection('ports').countDocuments();
            expect(portsInDatabase).to.be.equal(1);
        });
    });

    describe('notFound', function () {
        it('should return not found', async function () {
            const response = await chai.request(app).post('/undefined-route').send(JSON.stringify({country: 'Denmark'}));
            expect(response.status).to.be.equal(404);
        });
    });

});
