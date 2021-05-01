import DaoFactory from "../../../daos/factory/DaoFactory";
import Tile from "../../../models/Tile";
import {Collection, Db, ObjectId} from "mongodb";
import {expect} from "chai";
import {readFileSync} from "fs";
import Mongo from "../../../daos/databases/Mongo";
import CrudDao from "../../../daos/interface/CrudDao";

describe('TileDaoMongo', function () {
    let database: Db;
    let tileDaoMongo: CrudDao<Tile>;

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
        tileDaoMongo = await DaoFactory.getTileDao(databaseConfig);

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
                'ices_name': '43F9',
                'filename': '43F9.png',
                'id': 1
            },
            {
                '_id': new ObjectId('b2-c3-d4-e5z'),
                'ices_name': '43F91',
                'filename': '43F91.png',
                'id': 2
            }
        ])
    }

    describe('insert()', function () {
        it('should insert a new document', async function () {
            const tileToInsert = Tile.fromJson(readFileSync('src/tests/resources/models/tile_one.json').toString());
            const insertedTile = await tileDaoMongo.insert(tileToInsert);
            const tileCount = await database.collection('mapviews').countDocuments();

            expect(tileCount).to.be.equal(1);
            expect(insertedTile.id).to.be.equal(1);
            expect(insertedTile.ICESName).to.be.equal("-1");
            expect(insertedTile.west).to.be.equal(7.0);
            expect(insertedTile.south).to.be.equal(54.5);
            expect(insertedTile.east).to.be.equal(13.0);
            expect(insertedTile.north).to.be.equal(57.5);
            expect(insertedTile.scale).to.be.equal(1);
            expect(insertedTile.filename).to.be.equal("ROOT.png");
            expect(insertedTile.image_width).to.be.equal(2000);
            expect(insertedTile.image_height).to.be.equal(2000);
            expect(insertedTile.image_west).to.be.equal(7.0);
            expect(insertedTile.image_south).to.be.equal(54.31614);
            expect(insertedTile.image_east).to.be.equal(13.0);
            expect(insertedTile.image_north).to.be.equal(57.669343);
            expect(insertedTile.contained_by).to.be.equal(-1);
        });
    });

    describe('update()', function () {
        it('should update an existing document', async function () {
            await insertTestTiles();
            const updatedTileModel = Tile.fromJson(JSON.stringify({ICESName: '43F9-after', filename: '43F9-after.png'}));
            const updatedTile = await tileDaoMongo.update('a1-b2-c3-d4z', updatedTileModel);
            expect(updatedTile.filename).to.be.equal('43F9-after.png');
        });
    });

    describe('delete()', function () {
        it('should delete an existing document', async function () {
            await insertTestTiles();
            await tileDaoMongo.delete('a1-b2-c3-d4z');
            const tileCount = await database.collection('mapviews').countDocuments();
            expect(tileCount).to.be.equal(1);
        });
    });

    describe('findAll()', function () {
        it('should return all mapviews in collection', async function () {
            await insertTestTiles();
            const mapviews = await tileDaoMongo.findAll();
            expect(mapviews.length).to.be.equal(2);
            expect(mapviews[0]?.filename).to.equal('43F9.png');
            expect(mapviews[1]?.id).to.be.equal(2);
        });
    });

    describe('find()', function () {
        it('should return mapviews in collection by id', async function () {
            await insertTestTiles();
            const tile = await tileDaoMongo.find('a1-b2-c3-d4z');
            expect(tile.filename).to.equal('43F9.png');
            expect(tile.id).to.be.equal(1);
        });
    });
});
