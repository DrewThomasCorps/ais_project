"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var VesselDaoFactory_1 = __importDefault(require("../../../src/daos/factory/VesselDaoFactory"));
var Vessel_1 = __importDefault(require("../../../src/models/Vessel"));
var mongodb_1 = require("mongodb");
var chai_1 = require("chai");
var fs_1 = require("fs");
var Mongo_1 = __importDefault(require("../../../src/daos/databases/Mongo"));
describe('VesselDaoMongo', function () {
    var _this = this;
    var database;
    var vesselDaoMongo;
    var url = 'mongodb://localhost:27017';
    var databaseName = 'test_ais_project';
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            var databaseConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        databaseConfig = {
                            getType: function () {
                                return 'mongo';
                            },
                            getUrl: function () {
                                return url;
                            },
                            getName: function () {
                                return databaseName;
                            }
                        };
                        return [4 /*yield*/, Mongo_1.default.getDatabase(databaseConfig)];
                    case 1:
                        database = _a.sent();
                        return [4 /*yield*/, VesselDaoFactory_1.default.getVesselDao(databaseConfig)];
                    case 2:
                        vesselDaoMongo = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    beforeEach(function () {
        return __awaiter(this, void 0, void 0, function () {
            var collections;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, database.collections()];
                    case 1:
                        collections = _a.sent();
                        if (!collections.find(function (collection) {
                            return collection.collectionName === 'vessels';
                        })) return [3 /*break*/, 3];
                        return [4 /*yield*/, database.dropCollection('vessels')];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, database.createCollection('vessels')];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    after(function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Mongo_1.default.closeDatabase()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    });
    var insertTestVessels = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database.collection('vessels').insertMany([
                        {
                            '_id': new mongodb_1.ObjectId('a1-b2-c3-d4z'),
                            'IMO': 10,
                            'Name': 'before'
                        },
                        {
                            '_id': new mongodb_1.ObjectId('b2-c3-d4-e5z'),
                            'IMO': 101,
                            'Name': 'another'
                        }
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    describe('insert()', function () {
        it('should insert a new document', function () {
            return __awaiter(this, void 0, void 0, function () {
                var vesselToInsert, insertedVessel, vesselCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            vesselToInsert = Vessel_1.default.fromJson(fs_1.readFileSync('tests/resources/models/vessel_one.json').toString());
                            return [4 /*yield*/, vesselDaoMongo.insert(vesselToInsert)];
                        case 1:
                            insertedVessel = _a.sent();
                            return [4 /*yield*/, database.collection('vessels').countDocuments()];
                        case 2:
                            vesselCount = _a.sent();
                            chai_1.expect(vesselCount).to.be.equal(1);
                            chai_1.expect(insertedVessel.flag).to.be.equal('United Kingdom');
                            chai_1.expect(insertedVessel.imo).to.be.equal(1000019);
                            chai_1.expect(insertedVessel.name).to.be.equal("Lady K Ii");
                            chai_1.expect(insertedVessel.built).to.be.equal(1961);
                            chai_1.expect(insertedVessel.length).to.be.equal(57);
                            chai_1.expect(insertedVessel.breadth).to.be.equal(8);
                            chai_1.expect(insertedVessel.tonnage).to.be.equal(551);
                            chai_1.expect(insertedVessel.mmsi).to.be.equal(235095435);
                            chai_1.expect(insertedVessel.vessel_type).to.be.equal("Yacht");
                            chai_1.expect(insertedVessel.owner).to.be.equal(1);
                            chai_1.expect(insertedVessel.former_names).to.deep.equal(["LADY K II (2012, Panama)", "RADIANT II (2009)", "PRINCESS TANYA (1961)", "COLUMBINE"]);
                            chai_1.expect(insertedVessel.id).to.not.be.equal(null);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('update()', function () {
        it('should update an existing document', function () {
            return __awaiter(this, void 0, void 0, function () {
                var updatedVesselModel, updatedVessel;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestVessels()];
                        case 1:
                            _a.sent();
                            updatedVesselModel = Vessel_1.default.fromJson(JSON.stringify({ IMO: 12, Name: 'after' }));
                            return [4 /*yield*/, vesselDaoMongo.update('a1-b2-c3-d4z', updatedVesselModel)];
                        case 2:
                            updatedVessel = _a.sent();
                            chai_1.expect(updatedVessel.name).to.be.equal('after');
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('delete()', function () {
        it('should delete an existing document', function () {
            return __awaiter(this, void 0, void 0, function () {
                var vesselCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestVessels()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, vesselDaoMongo.delete('a1-b2-c3-d4z')];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, database.collection('vessels').countDocuments()];
                        case 3:
                            vesselCount = _a.sent();
                            chai_1.expect(vesselCount).to.be.equal(1);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('findAll()', function () {
        it('should return all vessels in collection', function () {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var vessels;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, insertTestVessels()];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, vesselDaoMongo.findAll()];
                        case 2:
                            vessels = _c.sent();
                            chai_1.expect(vessels.length).to.be.equal(2);
                            chai_1.expect((_a = vessels[0]) === null || _a === void 0 ? void 0 : _a.name).to.equal('before');
                            chai_1.expect((_b = vessels[1]) === null || _b === void 0 ? void 0 : _b.imo).to.be.equal(101);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should return filtered vessels when filtered on 1 param', function () {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var vessels;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, insertTestVessels()];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, vesselDaoMongo.findAll(Vessel_1.default.fromJson(JSON.stringify({ IMO: 10 })))];
                        case 2:
                            vessels = _c.sent();
                            chai_1.expect(vessels.length).to.be.equal(1);
                            chai_1.expect((_a = vessels[0]) === null || _a === void 0 ? void 0 : _a.name).to.equal('before');
                            return [4 /*yield*/, vesselDaoMongo.findAll(Vessel_1.default.fromJson(JSON.stringify({ Name: 'another' })))];
                        case 3:
                            vessels = _c.sent();
                            chai_1.expect(vessels.length).to.be.equal(1);
                            chai_1.expect((_b = vessels[0]) === null || _b === void 0 ? void 0 : _b.imo).to.equal(101);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should return filtered vessels when filtered on multiple params', function () {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var vessels;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, insertTestVessels()];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, database.collection('vessels').insertOne({
                                    '_id': new mongodb_1.ObjectId('a1-c3-d4-e5z'),
                                    'IMO': 10,
                                    'Name': 'third'
                                })];
                        case 2:
                            _c.sent();
                            return [4 /*yield*/, vesselDaoMongo.findAll(Vessel_1.default.fromJson(JSON.stringify({ IMO: 10, Name: 'third' })))];
                        case 3:
                            vessels = _c.sent();
                            chai_1.expect(vessels.length).to.be.equal(1);
                            chai_1.expect((_a = vessels[0]) === null || _a === void 0 ? void 0 : _a.name).to.equal('third');
                            chai_1.expect((_b = vessels[0]) === null || _b === void 0 ? void 0 : _b.id).to.equal(new mongodb_1.ObjectId('a1-c3-d4-e5z').toHexString());
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('find()', function () {
        it('should return vessels in collection by id', function () {
            return __awaiter(this, void 0, void 0, function () {
                var vessel;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestVessels()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, vesselDaoMongo.find('a1-b2-c3-d4z')];
                        case 2:
                            vessel = _a.sent();
                            chai_1.expect(vessel.name).to.equal('before');
                            chai_1.expect(vessel.imo).to.be.equal(10);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
