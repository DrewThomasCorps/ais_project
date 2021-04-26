import PortDaoFactory from "../../../src/daos/factory/PortDaoFactory";
import Port from "../../../src/models/Port";
import {Collection, Db, ObjectId} from "mongodb";
import {expect} from "chai";
import {readFileSync} from "fs";
import Mongo from "../../../src/daos/databases/Mongo";
import CrudDao from "../../../src/daos/interface/CrudDao";

describe('PortDaoMongo', function () {
    let database: Db;
    let portDaoMongo: CrudDao<Port>;

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
        portDaoMongo = await PortDaoFactory.getPortDao(databaseConfig);

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

    describe('insert()', function () {
        it('should insert a new document', async function () {
            const portToInsert = Port.fromJson(readFileSync('tests/resources/models/port_one.json').toString());
            const insertedPort = await portDaoMongo.insert(portToInsert);
            const portCount = await database.collection('ports').countDocuments();
            expect(portCount).to.be.equal(1);
            expect(insertedPort.id).to.not.be.equal(null);
        });
    });

    describe('update()', function () {
        it('should update an existing document', async function () {
            await insertTestPorts();
            const updatedPortModel = Port.fromJson(JSON.stringify({port_location: 'Gothenburg', country: 'Sweden'}));
            const updatedPort = await portDaoMongo.update('a1-b2-c3-d4z', updatedPortModel);
            const portCount = await database.collection('ports').countDocuments();
            expect(portCount).to.be.equal(2);
            expect(updatedPort.port_location).to.be.equal('Gothenburg');
            expect(updatedPort.country).to.be.equal('Sweden');
        });
    });

    describe('delete()', function () {
        it('should delete an existing document', async function () {
            await insertTestPorts();
            await portDaoMongo.delete('a1-b2-c3-d4z');
            const portCount = await database.collection('ports').countDocuments();
            expect(portCount).to.be.equal(1);
        });
    });

    describe('findAll()', function () {
        it('should return all ports in collection', async function () {
            await insertTestPorts();
            const ports = await portDaoMongo.findAll();
            expect(ports.length).to.be.equal(2);
            expect(ports[0]?.port_location).to.equal('Portone');
            expect(ports[1]?.country).to.be.equal('Denmark');
        });

        it('should return filtered ports when filtered on 1 param', async function () {
            await insertTestPorts();
            let ports = await portDaoMongo.findAll(Port.fromJson(
                JSON.stringify({port_location: 'Portone'})
            ));
            expect(ports.length).to.be.equal(1);
            expect(ports[0]?.country).to.equal('Denmark');
            ports = await portDaoMongo.findAll(Port.fromJson(
                JSON.stringify({port_location: 'Porttwo'})
            ));
            expect(ports.length).to.be.equal(1);
            expect(ports[0]?.country).to.equal('Denmark');
        });
    });

    describe('find()', function () {
        it('should return ports in collection by id', async function () {
            await insertTestPorts();
            const port = await portDaoMongo.find('a1-b2-c3-d4z');
            expect(port.port_location).to.equal('Portone');
            expect(port.country).to.be.equal('Denmark');
        });

    });
});
