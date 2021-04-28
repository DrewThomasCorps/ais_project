"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var VesselQueryBuilder_1 = __importDefault(require("../../src/queryBuilder/VesselQueryBuilder"));
var url_1 = require("url");
describe('VesselQueryBuilder', function () {
    describe('buildFilterModel()', function () {
        it('should build complete vessel', function () {
            var vesselQueryObject = {
                imo: '2',
                flag: '3',
                name: '4',
                built: '5',
                length: '6',
                breadth: '7',
                tonnage: '8',
                mmsi: '9',
                'vessel-type': '10',
                owner: '11',
            };
            var searchParams = new url_1.URLSearchParams(vesselQueryObject);
            var queryBuilder = new VesselQueryBuilder_1.default(new url_1.URL("https://example.com/endpoint?" + searchParams.toString()));
            var vessel = queryBuilder.buildFilterModel();
            chai_1.expect(vessel.imo).to.be.equal(2);
            chai_1.expect(vessel.flag).to.be.equal('3');
            chai_1.expect(vessel.name).to.be.equal('4');
            chai_1.expect(vessel.built).to.be.equal(5);
            chai_1.expect(vessel.length).to.be.equal(6);
            chai_1.expect(vessel.breadth).to.be.equal(7);
            chai_1.expect(vessel.tonnage).to.be.equal(8);
            chai_1.expect(vessel.mmsi).to.be.equal(9);
            chai_1.expect(vessel.vessel_type).to.be.equal('10');
            chai_1.expect(vessel.owner).to.be.equal(11);
            chai_1.expect(vessel.former_names).to.be.equal(null);
        });
        it('should build partial vessel', function () {
            var vesselQueryObject = {
                imo: '2',
            };
            var searchParams = new url_1.URLSearchParams(vesselQueryObject);
            var queryBuilder = new VesselQueryBuilder_1.default(new url_1.URL("https://example.com/endpoint?" + searchParams.toString()));
            var vessel = queryBuilder.buildFilterModel();
            chai_1.expect(vessel.imo).to.be.equal(2);
            chai_1.expect(vessel.flag).to.be.equal(null);
            chai_1.expect(vessel.name).to.be.equal(null);
            chai_1.expect(vessel.built).to.be.equal(null);
            chai_1.expect(vessel.length).to.be.equal(null);
            chai_1.expect(vessel.breadth).to.be.equal(null);
            chai_1.expect(vessel.tonnage).to.be.equal(null);
            chai_1.expect(vessel.mmsi).to.be.equal(null);
            chai_1.expect(vessel.vessel_type).to.be.equal(null);
            chai_1.expect(vessel.owner).to.be.equal(null);
            chai_1.expect(vessel.former_names).to.be.equal(null);
        });
    });
});
