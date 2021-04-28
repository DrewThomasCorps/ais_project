import VesselDaoFactory from "../../../daos/factory/VesselDaoFactory";
import Vessel from "../../../models/Vessel";
import {Collection, Db, ObjectId} from "mongodb";
import {expect} from "chai";
import {readFileSync} from "fs";
import Mongo from "../../../daos/databases/Mongo";
import CrudDao from "../../../daos/interface/CrudDao";

describe('VesselDaoMongo', function () {
    let database: Db;
    let vesselDaoMongo: CrudDao<Vessel>;

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

    const insertTestVessels = async () => {
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
    }

    describe('insert()', function () {
        it('should insert a new document', async function () {
            const vesselToInsert = Vessel.fromJson(readFileSync('src/tests/resources/models/vessel_one.json').toString());
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
            expect(insertedVessel.id).to.not.be.equal(null)
        });
    });

    describe('update()', function () {
        it('should update an existing document', async function () {
            await insertTestVessels();
            const updatedVesselModel = Vessel.fromJson(JSON.stringify({IMO: 12, Name: 'after'}));
            const updatedVessel = await vesselDaoMongo.update('a1-b2-c3-d4z', updatedVesselModel);
            expect(updatedVessel.name).to.be.equal('after');
        });
    });

    describe('delete()', function () {
        it('should delete an existing document', async function () {
            await insertTestVessels();
            await vesselDaoMongo.delete('a1-b2-c3-d4z');
            const vesselCount = await database.collection('vessels').countDocuments();
            expect(vesselCount).to.be.equal(1);
        });
    });

    describe('findAll()', function () {
        it('should return all vessels in collection', async function () {
            await insertTestVessels();
            const vessels = await vesselDaoMongo.findAll();
            expect(vessels.length).to.be.equal(2);
            expect(vessels[0]?.name).to.equal('before');
            expect(vessels[1]?.imo).to.be.equal(101);
        });

        it('should return filtered vessels when filtered on 1 param', async function () {
            await insertTestVessels();
            let vessels = await vesselDaoMongo.findAll(Vessel.fromJson(
                JSON.stringify({IMO: 10})
            ));
            expect(vessels.length).to.be.equal(1);
            expect(vessels[0]?.name).to.equal('before');
            vessels = await vesselDaoMongo.findAll(Vessel.fromJson(
                JSON.stringify({Name: 'another'})
            ));
            expect(vessels.length).to.be.equal(1);
            expect(vessels[0]?.imo).to.equal(101);
        });

        it('should return filtered vessels when filtered on multiple params', async function () {
            await insertTestVessels();
            await database.collection('vessels').insertOne({
                '_id': new ObjectId('a1-c3-d4-e5z'),
                'IMO': 10,
                'Name': 'third'
            })
            let vessels = await vesselDaoMongo.findAll(Vessel.fromJson(
                JSON.stringify({IMO: 10, Name: 'third'})
            ));
            expect(vessels.length).to.be.equal(1);
            expect(vessels[0]?.name).to.equal('third');
            expect(vessels[0]?.id).to.equal(new ObjectId('a1-c3-d4-e5z').toHexString());
        });
    });

    describe('find()', function () {
        it('should return vessels in collection by id', async function () {
            await insertTestVessels();
            const vessel = await vesselDaoMongo.find('a1-b2-c3-d4z');
            expect(vessel.name).to.equal('before');
            expect(vessel.imo).to.be.equal(10);
        });

    });
});
