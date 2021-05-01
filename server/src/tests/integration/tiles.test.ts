import chai, {expect} from 'chai';
import chaiHttp from 'chai-http'
import {Collection, Db, ObjectId} from "mongodb";
import Mongo from "../../daos/databases/Mongo";
import app from '../../index';
import {DatabaseConfig} from "../../config/DatabaseConfig";

describe('TileIntegration', function () {
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
            return collection.collectionName === 'mapviews';
        })) {
            await database.dropCollection('mapviews');
        }
        await database.createCollection('mapviews');
    })

    after(async function () {
        await Mongo.closeDatabase();
    })

    const insertTestTiles = async () => {
        await database.collection('mapviews').insertMany([
            {
                '_id': new ObjectId('a1-b2-c3-d4z'),
                'id': 1,
                'ICESName': '43F9',
                'filename': '43F9.png'
            },
            {
                '_id': new ObjectId('b2-c3-d4-e5z'),
                'id': 2,
                'ICESName': '43F91',
                'filename': '43F91.png',
                'contained_by': 1
            }
        ])
    }

    describe('getTiles', function () {
        it('should get empty array when there are no mapviews', async function () {
            const response = await chai.request(app).get('/tiles');
            expect(response.body).to.deep.equal([]);
            expect(response.status).to.be.equal(200);
        });

        it('should get array of mapviews', async function () {
            await insertTestTiles();
            const response = await chai.request(app).get('/tiles');

            expect(response.body).to.deep.equal([
                {
                    id: 1,
                    ICESName: '43F9',
                    west: null,
                    image_east: null,
                    image_file: null,
                    image_height: null,
                    image_north: null,
                    image_south: null,
                    image_west: null,
                    image_width: null,
                    north: null,
                    scale: null,
                    south: null,
                    contained_by: null,
                    east: null,
                    filename: '43F9.png'

                }, {
                    id: 2,
                    ICESName: '43F91',
                    west: null,
                    image_east: null,
                    image_file: null,
                    image_height: null,
                    image_north: null,
                    image_south: null,
                    image_west: null,
                    image_width: null,
                    north: null,
                    scale: null,
                    south: null,
                    contained_by: 1,
                    east: null,
                    filename: '43F91.png'

                }
            ]);
            expect(response.status).to.be.equal(200);
        });
    });

    describe('createTile', function () {
        it('should get inserted tile from database', async function () {
            const response = await chai.request(app).post('/tiles').send(JSON.stringify({
                ICESName: '43F92',
                id: 52372
            }));

            expect(response.body.ICESName).to.be.equal('43F92');
            expect(response.body.id).to.be.equal(52372);
            expect(response.status).to.be.equal(201);
        });
    });

    describe('findTile', function () {
        it('should get inserted tile from database', async function () {
            await insertTestTiles();
            const response = await chai.request(app).get('/tiles/' + new ObjectId('a1-b2-c3-d4z').toHexString());

            expect(response.body.ICESName).to.be.equal('43F9');
            expect(response.body.filename).to.be.equal('43F9.png');
            expect(response.body.id).to.not.be.null;
            expect(response.status).to.be.equal(200);
        });
    });

    describe('updateTile', function () {
        it('should update tile in the database', async function () {
            await insertTestTiles();
            const response = await chai.request(app).put('/tiles/' + new ObjectId('a1-b2-c3-d4z').toHexString())
                .send(JSON.stringify({filename: '43F9-new.png', ICESName: '43F9-new'}));
            expect(response.body.filename).to.be.equal('43F9-new.png');
            expect(response.body.ICESName).to.be.equal('43F9-new');
            expect(response.status).to.be.equal(200);
        });
    });

    describe('deleteTile', function () {
        it('should delete tile in the database', async function () {
            await insertTestTiles();
            const response = await chai.request(app).delete('/tiles/' + new ObjectId('a1-b2-c3-d4z').toHexString());
            expect(response.status).to.be.equal(204);
            const mapviewsInDatabase = await database.collection('mapviews').countDocuments();
            expect(mapviewsInDatabase).to.be.equal(1);
        });
    });

    describe('notFound', function () {
        it('should return not found', async function () {
            const response = await chai.request(app).post('/undefined-route').send(JSON.stringify({ICESName: '43F9-new'}));
            expect(response.status).to.be.equal(404);
        });
    })

    describe('findTileByCoordinates', function () {
        it('should get a mapview tile by coordinates', async function () {
            await insertTestTiles();

            await chai.request(app).put('/tiles/' + new ObjectId('a1-b2-c3-d4z').toHexString())
                .send(JSON.stringify({
                    image_east: 10.0,
                    image_west: 9.0,
                    image_north: 57.5,
                    image_south: 57,
                    scale: 3
                }));

            await chai.request(app).put('/tiles/' + new ObjectId('b2-c3-d4-e5z').toHexString())
                .send(JSON.stringify({
                    image_east: 10.0,
                    image_west: 9.0,
                    image_north: 57.5,
                    image_south: 57,
                    scale: 2
                }));

            const response = await chai.request(app).get('/tiles?longitude=9.494252873563218&scale=3&latitude=57.04808806488992');

            expect(response.body).to.deep.equal(
                {
                    id: 1,
                    ICESName: '43F9',
                    image_east: 10.0,
                    image_west: 9.0,
                    image_north: 57.5,
                    image_south: 57,
                    image_width: null,
                    image_height: null,
                    north: null,
                    scale: 3,
                    south: null,
                    west: null,
                    east: null,
                    contained_by: null,
                    filename: '43F9.png',
                    image_file: null

                }
            );
            expect(response.status).to.be.equal(200);
        });
    })


    describe('findContainedTiles', function () {
        it('should get array of mapviews contained in given tile id', async function () {
            await insertTestTiles();

            const response = await chai.request(app).get('/tile-data/1');

            expect(response.body).to.deep.equal([
                {
                    id: 2,
                    ICESName: '43F91',
                    filename: '43F91.png',
                    contained_by: 1,
                    image_east: null,
                    image_file: null,
                    image_height: null,
                    image_north: null,
                    image_south: null,
                    image_west: null,
                    image_width: null,
                    north: null,
                    east: null,
                    scale: null,
                    south: null,
                    west: null,
                }
            ]);
            expect(response.status).to.be.equal(200);
        });
    });
});
