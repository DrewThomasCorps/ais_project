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
describe('TileIntegration', function () {
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
                            return collection.collectionName === 'tiles';
                        })) return [3 /*break*/, 3];
                        return [4 /*yield*/, database.dropCollection('tiles')];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, database.createCollection('tiles')];
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
    var insertTestTiles = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database.collection('tiles').insertMany([
                        {
                            '_id': new mongodb_1.ObjectId('a1-b2-c3-d4z'),
                            'id': 1,
                            'ICESName': '43F9',
                            'filename': '43F9.png'
                        },
                        {
                            '_id': new mongodb_1.ObjectId('b2-c3-d4-e5z'),
                            'id': 2,
                            'ICESName': '43F91',
                            'filename': '43F91.png',
                            'contained_by': 1
                        }
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    describe('getTiles', function () {
        it('should get empty array when there are no tiles', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, chai_1.default.request(src_1.default).get('/tiles')];
                        case 1:
                            response = _a.sent();
                            chai_1.expect(response.body).to.deep.equal([]);
                            chai_1.expect(response.status).to.be.equal(200);
                            return [2 /*return*/];
                    }
                });
            });
        });
        it('should get array of tiles', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestTiles()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, chai_1.default.request(src_1.default).get('/tiles')];
                        case 2:
                            response = _a.sent();
                            chai_1.expect(response.body).to.deep.equal([
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
                            chai_1.expect(response.status).to.be.equal(200);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('createTile', function () {
        it('should get inserted tile from database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, chai_1.default.request(src_1.default).post('/tiles').send(JSON.stringify({
                                ICESName: '43F92',
                                id: 52372
                            }))];
                        case 1:
                            response = _a.sent();
                            chai_1.expect(response.body.ICESName).to.be.equal('43F92');
                            chai_1.expect(response.body.id).to.be.equal(52372);
                            chai_1.expect(response.status).to.be.equal(201);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('findTile', function () {
        it('should get inserted tile from database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestTiles()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, chai_1.default.request(src_1.default).get('/tiles/' + new mongodb_1.ObjectId('a1-b2-c3-d4z').toHexString())];
                        case 2:
                            response = _a.sent();
                            chai_1.expect(response.body.ICESName).to.be.equal('43F9');
                            chai_1.expect(response.body.filename).to.be.equal('43F9.png');
                            chai_1.expect(response.body.id).to.not.be.null;
                            chai_1.expect(response.status).to.be.equal(200);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('updateTile', function () {
        it('should update tile in the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestTiles()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, chai_1.default.request(src_1.default).put('/tiles/' + new mongodb_1.ObjectId('a1-b2-c3-d4z').toHexString())
                                    .send(JSON.stringify({ filename: '43F9-new.png', ICESName: '43F9-new' }))];
                        case 2:
                            response = _a.sent();
                            chai_1.expect(response.body.filename).to.be.equal('43F9-new.png');
                            chai_1.expect(response.body.ICESName).to.be.equal('43F9-new');
                            chai_1.expect(response.status).to.be.equal(200);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('deleteTile', function () {
        it('should delete tile in the database', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, tilesInDatabase;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestTiles()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, chai_1.default.request(src_1.default).delete('/tiles/' + new mongodb_1.ObjectId('a1-b2-c3-d4z').toHexString())];
                        case 2:
                            response = _a.sent();
                            chai_1.expect(response.status).to.be.equal(204);
                            return [4 /*yield*/, database.collection('tiles').countDocuments()];
                        case 3:
                            tilesInDatabase = _a.sent();
                            chai_1.expect(tilesInDatabase).to.be.equal(1);
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
                        case 0: return [4 /*yield*/, chai_1.default.request(src_1.default).post('/undefined-route').send(JSON.stringify({ ICESName: '43F9-new' }))];
                        case 1:
                            response = _a.sent();
                            chai_1.expect(response.status).to.be.equal(404);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('findTilesByCoordinates', function () {
        it('should get array of tiles by coordinates', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestTiles()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, chai_1.default.request(src_1.default).put('/tiles/' + new mongodb_1.ObjectId('a1-b2-c3-d4z').toHexString())
                                    .send(JSON.stringify({
                                    image_east: 10.0,
                                    image_west: 9.0,
                                    image_north: 57.5,
                                    image_south: 57,
                                    scale: 3
                                }))];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, chai_1.default.request(src_1.default).put('/tiles/' + new mongodb_1.ObjectId('b2-c3-d4-e5z').toHexString())
                                    .send(JSON.stringify({
                                    image_east: 10.0,
                                    image_west: 9.0,
                                    image_north: 57.5,
                                    image_south: 57,
                                    scale: 2
                                }))];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, chai_1.default.request(src_1.default).get('/tiles?longitude=9.494252873563218&scale=3&latitude=57.04808806488992')];
                        case 4:
                            response = _a.sent();
                            chai_1.expect(response.body).to.deep.equal([
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
                            ]);
                            chai_1.expect(response.status).to.be.equal(200);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
    describe('findContainedTiles', function () {
        it('should get array of tiles contained in given tile id', function () {
            return __awaiter(this, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, insertTestTiles()];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, chai_1.default.request(src_1.default).get('/tile-data/1')];
                        case 2:
                            response = _a.sent();
                            chai_1.expect(response.body).to.deep.equal([
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
                            chai_1.expect(response.status).to.be.equal(200);
                            return [2 /*return*/];
                    }
                });
            });
        });
    });
});
