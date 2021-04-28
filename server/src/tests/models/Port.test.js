"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var Port_1 = __importDefault(require("../../src/models/Port"));
var fs_1 = require("fs");
describe('Port', function () {
    describe('fromJson()', function () {
        it('set all present values', function () {
            var port = Port_1.default.fromJson(fs_1.readFileSync('tests/resources/models/port_one.json').toString());
            chai_1.expect(port.id).to.be.equal(2978);
            chai_1.expect(port.un_locode).to.be.equal('DKKTD');
            chai_1.expect(port.port_location).to.be.equal('Kerteminde');
            chai_1.expect(port.country).to.be.equal('Denmark');
            chai_1.expect(port.longitude).to.be.equal(10.665278);
            chai_1.expect(port.latitude).to.be.equal(55.451389);
            chai_1.expect(port.website).to.be.equal('www.kerteminde.dk');
            chai_1.expect(port.mapview_1).to.be.equal(1);
            chai_1.expect(port.mapview_2).to.be.equal(5331);
            chai_1.expect(port.mapview_3).to.be.equal(53312);
        });
    });
});
