"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Vessel_1 = __importDefault(require("../../src/models/Vessel"));
var fs_1 = require("fs");
describe('Vessel', function () {
    describe('fromJson()', function () {
        it('set all present values', function () {
            var vessel = Vessel_1.default.fromJson(fs_1.readFileSync('tests/resources/models/vessel_one.json').toString());
            chai_1.expect(vessel.flag).to.be.equal('United Kingdom');
            chai_1.expect(vessel.imo).to.be.equal(1000019);
            chai_1.expect(vessel.name).to.be.equal("Lady K Ii");
            chai_1.expect(vessel.built).to.be.equal(1961);
            chai_1.expect(vessel.length).to.be.equal(57);
            chai_1.expect(vessel.breadth).to.be.equal(8);
            chai_1.expect(vessel.tonnage).to.be.equal(551);
            chai_1.expect(vessel.mmsi).to.be.equal(235095435);
            chai_1.expect(vessel.vessel_type).to.be.equal("Yacht");
            chai_1.expect(vessel.owner).to.be.equal(1);
            chai_1.expect(vessel.former_names).to.deep.equal(["LADY K II (2012, Panama)", "RADIANT II (2009)", "PRINCESS TANYA (1961)", "COLUMBINE"]);
        });
        it('set all values when optional values are missing', function () {
            var vessel = Vessel_1.default.fromJson(fs_1.readFileSync('tests/resources/models/vessel_only_required.json').toString());
            chai_1.expect(vessel.flag).to.be.equal(null);
            chai_1.expect(vessel.imo).to.be.equal(1000019);
            chai_1.expect(vessel.name).to.be.equal(null);
            chai_1.expect(vessel.built).to.be.equal(null);
            chai_1.expect(vessel.length).to.be.equal(null);
            chai_1.expect(vessel.breadth).to.be.equal(null);
            chai_1.expect(vessel.tonnage).to.be.equal(null);
            chai_1.expect(vessel.mmsi).to.be.equal(null);
            chai_1.expect(vessel.vessel_type).to.be.equal(null);
            chai_1.expect(vessel.owner).to.be.equal(null);
            chai_1.expect(vessel.former_names).to.equal(null);
        });
    });
});
