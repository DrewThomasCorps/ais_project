// import {expect} from 'chai';
// import VesselDaoMongo from "../../../src/daos/mongo/VesselDaoMongo";
// import VesselDaoFactory from "../../../src/daos/factory/VesselDaoFactory";
// import {VesselDao} from "../../../src/daos/interface/VesselDao";
// import Vessel from "../../../src/models/Vessel";
//
// describe('VesselDaoMongo', function() {
//     let vesselDaoMongo: VesselDao;
//
//     before(async function () {
//         vesselDaoMongo = await VesselDaoFactory.getVesselDao({
//             type: 'mongo',
//             getUrl() {return 'mongodb://localhost:27017'},
//             getName() {return 'test_ais_project'}
//         });
//
//     })
//
//     describe('insert()', function() {
//         it('should insert a new document', async function() {
//             const vesselToInsert = Vessel.fromJson('tests/resources/models/vessel_one.json');
//             const insertedVessel = await vesselDaoMongo.insert(vesselToInsert);
//         });
//         it('should not override existing environment variables', function () {
//
//         })
//     });
// });
