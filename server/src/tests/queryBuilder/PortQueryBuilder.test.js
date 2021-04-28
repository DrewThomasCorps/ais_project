"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var PortQueryBuilder_1 = __importDefault(require("../../src/queryBuilder/PortQueryBuilder"));
var url_1 = require("url");
describe('PortQueryBuilder', function () {
    describe('buildFilterModel()', function () {
        it('should build complete port', function () {
            var portQueryObject = {
                name: 'Middelfart',
                country: 'Denmark',
                mapview_1: '1',
                mapview_2: '5234',
                mapview_3: '52344'
            };
            var searchParams = new url_1.URLSearchParams(portQueryObject);
            var queryBuilder = new PortQueryBuilder_1.default(new url_1.URL("https://example.com/endpoint?" + searchParams.toString()));
            var port = queryBuilder.buildFilterModel();
            chai_1.expect(port.port_location).to.be.equal('Middelfart');
            chai_1.expect(port.country).to.be.equal('Denmark');
            chai_1.expect(port.mapview_1).to.be.equal(1);
            chai_1.expect(port.mapview_2).to.be.equal(5234);
            chai_1.expect(port.mapview_3).to.be.equal(52344);
        });
        it('should build partial port', function () {
            var portQueryObject = {
                name: 'Middelfart',
                country: 'Denmark'
            };
            var searchParams = new url_1.URLSearchParams(portQueryObject);
            var queryBuilder = new PortQueryBuilder_1.default(new url_1.URL("https://example.com/endpoint?" + searchParams.toString()));
            var port = queryBuilder.buildFilterModel();
            chai_1.expect(port.port_location).to.be.equal('Middelfart');
            chai_1.expect(port.country).to.be.equal('Denmark');
            chai_1.expect(port.mapview_1).to.be.equal(null);
            chai_1.expect(port.mapview_2).to.be.equal(null);
            chai_1.expect(port.mapview_3).to.be.equal(null);
        });
    });
});
