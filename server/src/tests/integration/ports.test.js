"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var chai_1 = __importStar(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
var mongodb_1 = require("mongodb");
var Mongo_1 = __importDefault(require("../../src/daos/databases/Mongo"));
var src_1 = __importDefault(require("../../src"));
var DatabaseConfig_1 = require("../../src/config/DatabaseConfig");
describe('PortIntegration', function () {
    var _this = this;
    var database;
    var url = 'mongodb://localhost:27017';
    var databaseName = 'test_ais_project';
    before(function () {
        return __awaiter(this, void 0, void 0, function () {
            var databaseConfig;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        process.env["DATABASE_NAME"] = databaseName;
                        process.env["DATABASE_URL"] = url;
                        process.env["DATABASE_TYPE"] = 'mongo';
                        databaseConfig = DatabaseConfig_1.DatabaseConfig.Config;
                        return [4 /*yield*/, Mongo_1.default.getDatabase(databaseConfig)];
                    case 1:
                        database = _a.sent();
                        chai_1.default.use(chai_http_1.default);
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
    describe('getPorts', function () {
        it('should get empty array when there are no ports', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, chai_1.default.request(src_1.default).get('/ports')];
                        case 1:
                            response = _a.sent();
                            chai_1.expect(response.body).to.deep.equal([]);
                            chai_1.expect(response.status).to.be.equal(200);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should get array of ports', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestPorts()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, chai_1.default.request(src_1.default).get('/ports')];
                        case 2:
                            response = _a.sent();
                            chai_1.expect(response.body).to.deep.equal([
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
                            chai_1.expect(response.status).to.be.equal(200);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('createPort', function () {
        it('should get inserted port from database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, chai_1.default.request(src_1.default).post('/ports').send(JSON.stringify({ id: 5678 }))];
                        case 1:
                            response = _a.sent();
                            chai_1.expect(response.body.id).to.be.equal(5678);
                            chai_1.expect(response.status).to.be.equal(201);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('findPort', function () {
        it('should get inserted port from database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestPorts()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, chai_1.default.request(src_1.default).get('/ports/' + new mongodb_1.ObjectId('a1-b2-c3-d4z').toHexString())];
                        case 2:
                            response = _a.sent();
                            chai_1.expect(response.body.id).to.be.equal(1234);
                            chai_1.expect(response.body.port_location).to.be.equal('Portone');
                            chai_1.expect(response.body.id).to.not.be.null;
                            chai_1.expect(response.status).to.be.equal(200);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('updatePort', function () {
        it('should update port in the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestPorts()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, chai_1.default.request(src_1.default).put('/ports/' + new mongodb_1.ObjectId('a1-b2-c3-d4z').toHexString())
                                    .send(JSON.stringify({ port_location: 'Gothenburg', country: 'Sweden' }))];
                        case 2:
                            response = _a.sent();
                            chai_1.expect(response.body.id).to.be.equal(1234);
                            chai_1.expect(response.body.port_location).to.be.equal('Gothenburg');
                            chai_1.expect(response.body.country).to.be.equal('Sweden');
                            chai_1.expect(response.status).to.be.equal(200);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('deletePort', function () {
        it('should delete port in the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, portsInDatabase;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestPorts()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, chai_1.default.request(src_1.default).delete('/ports/' + new mongodb_1.ObjectId('a1-b2-c3-d4z').toHexString())];
                        case 2:
                            response = _a.sent();
                            chai_1.expect(response.status).to.be.equal(204);
                            return [4 /*yield*/, database.collection('ports').countDocuments()];
                        case 3:
                            portsInDatabase = _a.sent();
                            chai_1.expect(portsInDatabase).to.be.equal(1);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('notFound', function () {
        it('should return not found', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, chai_1.default.request(src_1.default).post('/undefined-route').send(JSON.stringify({ country: 'Denmark' }))];
                        case 1:
                            response = _a.sent();
                            chai_1.expect(response.status).to.be.equal(404);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
