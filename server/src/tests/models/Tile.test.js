"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Tile_1 = __importDefault(require("../../src/models/Tile"));
var fs_1 = require("fs");
describe('Tile', function () {
    describe('fromJson()', function () {
        it('set all present values', function () {
            var tile = Tile_1.default.fromJson(fs_1.readFileSync('tests/resources/models/tile_one.json').toString());
            chai_1.expect(tile.id).to.be.equal(1);
            chai_1.expect(tile.ICESName).to.be.equal('-1');
            chai_1.expect(tile.west).to.be.equal(7.0);
            chai_1.expect(tile.east).to.be.equal(13.0);
            chai_1.expect(tile.north).to.be.equal(57.5);
            chai_1.expect(tile.south).to.be.equal(54.5);
            chai_1.expect(tile.scale).to.be.equal(1);
            chai_1.expect(tile.filename).to.be.equal("ROOT.png");
            chai_1.expect(tile.image_width).to.be.equal(2000);
            chai_1.expect(tile.image_height).to.be.equal(2000);
            chai_1.expect(tile.image_west).to.be.equal(7.0);
            chai_1.expect(tile.image_south).to.be.equal(54.31614);
            chai_1.expect(tile.image_east).to.be.equal(13.0);
            chai_1.expect(tile.image_north).to.be.equal(57.669343);
            chai_1.expect(tile.contained_by).to.be.equal(-1);
        });
    });
});
