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
var PortDaoFactory_1 = __importDefault(require("../../../src/daos/factory/PortDaoFactory"));
var Port_1 = __importDefault(require("../../../src/models/Port"));
var mongodb_1 = require("mongodb");
var chai_1 = require("chai");
var fs_1 = require("fs");
var Mongo_1 = __importDefault(require("../../../src/daos/databases/Mongo"));
describe('PortDaoMongo', function () {
    var _this = this;
    var database;
    var portDaoMongo;
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
                        return [4 /*yield*/, PortDaoFactory_1.default.getPortDao(databaseConfig)];
                    case 2:
                        portDaoMongo = _a.sent();
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
                            return collection.collectionName === 'ports';
                        })) return [3 /*break*/, 3];
                        return [4 /*yield*/, database.dropCollection('ports')];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, database.createCollection('ports')];
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
    var insertTestPorts = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database.collection('ports').insertMany([
                        {
                            '_id': new mongodb_1.ObjectId('a1-b2-c3-d4z'),
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
                            '_id': new mongodb_1.ObjectId('b2-c3-d4-e5z'),
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
                var portToInsert, insertedPort, portCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            portToInsert = Port_1.default.fromJson(fs_1.readFileSync('tests/resources/models/port_one.json').toString());
                            return [4 /*yield*/, portDaoMongo.insert(portToInsert)];
                        case 1:
                            insertedPort = _a.sent();
                            return [4 /*yield*/, database.collection('ports').countDocuments()];
                        case 2:
                            portCount = _a.sent();
                            chai_1.expect(portCount).to.be.equal(1);
                            chai_1.expect(insertedPort.id).to.not.be.equal(null);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('update()', function () {
        it('should update an existing document', function () {
            return __awaiter(this, void 0, void 0, function () {
                var updatedPortModel, updatedPort, portCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestPorts()];
                        case 1:
                            _a.sent();
                            updatedPortModel = Port_1.default.fromJson(JSON.stringify({ port_location: 'Gothenburg', country: 'Sweden' }));
                            return [4 /*yield*/, portDaoMongo.update('a1-b2-c3-d4z', updatedPortModel)];
                        case 2:
                            updatedPort = _a.sent();
                            return [4 /*yield*/, database.collection('ports').countDocuments()];
                        case 3:
                            portCount = _a.sent();
                            chai_1.expect(portCount).to.be.equal(2);
                            chai_1.expect(updatedPort.port_location).to.be.equal('Gothenburg');
                            chai_1.expect(updatedPort.country).to.be.equal('Sweden');
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('delete()', function () {
        it('should delete an existing document', function () {
            return __awaiter(this, void 0, void 0, function () {
                var portCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestPorts()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, portDaoMongo.delete('a1-b2-c3-d4z')];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, database.collection('ports').countDocuments()];
                        case 3:
                            portCount = _a.sent();
                            chai_1.expect(portCount).to.be.equal(1);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('findAll()', function () {
        it('should return all ports in collection', function () {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var ports;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, insertTestPorts()];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, portDaoMongo.findAll()];
                        case 2:
                            ports = _c.sent();
                            chai_1.expect(ports.length).to.be.equal(2);
                            chai_1.expect((_a = ports[0]) === null || _a === void 0 ? void 0 : _a.port_location).to.equal('Portone');
                            chai_1.expect((_b = ports[1]) === null || _b === void 0 ? void 0 : _b.country).to.be.equal('Denmark');
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should return filtered ports when filtered on 1 param', function () {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var ports;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0: return [4 /*yield*/, insertTestPorts()];
                        case 1:
                            _c.sent();
                            return [4 /*yield*/, portDaoMongo.findAll(Port_1.default.fromJson(JSON.stringify({ port_location: 'Portone' })))];
                        case 2:
                            ports = _c.sent();
                            chai_1.expect(ports.length).to.be.equal(1);
                            chai_1.expect((_a = ports[0]) === null || _a === void 0 ? void 0 : _a.country).to.equal('Denmark');
                            return [4 /*yield*/, portDaoMongo.findAll(Port_1.default.fromJson(JSON.stringify({ port_location: 'Porttwo' })))];
                        case 3:
                            ports = _c.sent();
                            chai_1.expect(ports.length).to.be.equal(1);
                            chai_1.expect((_b = ports[0]) === null || _b === void 0 ? void 0 : _b.country).to.equal('Denmark');
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('find()', function () {
        it('should return ports in collection by id', function () {
            return __awaiter(this, void 0, void 0, function () {
                var port;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestPorts()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, portDaoMongo.find('a1-b2-c3-d4z')];
                        case 2:
                            port = _a.sent();
                            chai_1.expect(port.port_location).to.equal('Portone');
                            chai_1.expect(port.country).to.be.equal('Denmark');
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
