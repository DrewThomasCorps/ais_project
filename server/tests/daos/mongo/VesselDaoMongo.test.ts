import VesselDaoFactory from "../../../src/daos/factory/VesselDaoFactory";
import Vessel from "../../../src/models/Vessel";
import {Collection, Db, ObjectId} from "mongodb";
import {expect} from "chai";
import {readFileSync} from "fs";
import Mongo from "../../../src/daos/databases/Mongo";
import CrudDao from "../../../src/daos/interface/CrudDao";

describe('VesselDaoMongo', function () {
    let database: Db;
    let vesselDaoMongo: CrudDao<Vessel>;

    const url = 'mongodb://localhost:27017';
    const databaseName = 'test_ais_project';

    before(async function () {
        const databaseConfig = {
            type: 'mongo',
            getUrl() {
                return url
            },
            getName() {
                return databaseName
            }
        }
        database = await Mongo.getDatabase(databaseConfig);
        vesselDaoMongo = await VesselDaoFactory.getVesselDao(databaseConfig);

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

    describe('insert()', function () {
        it('should insert a new document', async function () {
            const vesselToInsert = Vessel.fromJson(readFileSync('tests/resources/models/vessel_one.json').toString());
            const insertedVessel = await vesselDaoMongo.insert(vesselToInsert);
            const vesselCount = await database.collection('vessels').countDocuments();
            expect(vesselCount).to.be.equal(1);
            expect(insertedVessel.flag).to.be.equal('United Kingdom');
            expect(insertedVessel.imo).to.be.equal(1000019);
            expect(insertedVessel.name).to.be.equal("Lady K Ii");
            expect(insertedVessel.built).to.be.equal(1961);
            expect(insertedVessel.length).to.be.equal(57);
            expect(insertedVessel.breadth).to.be.equal(8);
            expect(insertedVessel.tonnage).to.be.equal(551);
            expect(insertedVessel.mmsi).to.be.equal(235095435);
            expect(insertedVessel.vessel_type).to.be.equal("Yacht");
            expect(insertedVessel.owner).to.be.equal(1);
            expect(insertedVessel.former_names).to.deep.equal(
                ["LADY K II (2012, Panama)", "RADIANT II (2009)", "PRINCESS TANYA (1961)", "COLUMBINE"]
            );
        });
    });

    describe('update()', function () {
        it('should update an existing document', async function () {
            await database.collection('vessels').insertOne({
                '_id': new ObjectId('a1-b2-c3-d4z'),
                'IMO': 10,
                'Name': 'before'
            })
            const updatedVesselModel = Vessel.fromJson(JSON.stringify({IMO: 12, Name: 'after'}));
            const updatedVessel = await vesselDaoMongo.update('a1-b2-c3-d4z', updatedVesselModel);
            expect(updatedVessel.name).to.be.equal('after');
        });
    });

    describe('delete()', function () {
        it('should delete an existing document', async function () {
            await database.collection('vessels').insertMany([
                {
                    '_id': new ObjectId('a1-b2-c3-d4z'),
                    'IMO': 10,
                    'Name': 'before'
                },
                {
                    '_id': new ObjectId('b2-c3-d4-e5z'),
                    'IMO': 101,
                    'Name': 'another'
                }
            ])
            await vesselDaoMongo.delete('a1-b2-c3-d4z');
            const vesselCount = await database.collection('vessels').countDocuments();
            expect(vesselCount).to.be.equal(1);
        });
    });

    describe('findAll()', function () {
        it('should return all vessels in collection', async function () {
            await database.collection('vessels').insertMany([
                {
                    'IMO': 10,
                    'Name': 'before'
                },
                {
                    'IMO': 101,
                    'Name': 'another'
                }
            ])
            const vessels = await vesselDaoMongo.findAll();
            expect(vessels.length).to.be.equal(2);
            expect(vessels[0]?.name).to.equal('before');
            expect(vessels[1]?.imo).to.be.equal(101);
        });
    });
});
