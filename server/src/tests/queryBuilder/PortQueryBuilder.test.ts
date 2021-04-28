import {expect} from 'chai';
import PortQueryBuilder from "../../queryBuilder/PortQueryBuilder";
import {URL, URLSearchParams} from "url";

describe('PortQueryBuilder', function() {
    describe('buildFilterModel()', function() {
        it('should build complete port', function() {
            const portQueryObject = {
                name: 'Middelfart',
                country: 'Denmark',
                mapview_1: '1',
                mapview_2: '5234',
                mapview_3: '52344'
            }
            const searchParams = new URLSearchParams(portQueryObject);
            const queryBuilder = new PortQueryBuilder(new URL("https://example.com/endpoint?" + searchParams.toString()));
            const port = queryBuilder.buildFilterModel();
            expect(port.port_location).to.be.equal('Middelfart');
            expect(port.country).to.be.equal('Denmark');
            expect(port.mapview_1).to.be.equal(1);
            expect(port.mapview_2).to.be.equal(5234);
            expect(port.mapview_3).to.be.equal(52344);
        });
        it('should build partial port', function() {
            const portQueryObject = {
                name: 'Middelfart',
                country: 'Denmark'
            }
            const searchParams = new URLSearchParams(portQueryObject);
            const queryBuilder = new PortQueryBuilder(new URL("https://example.com/endpoint?" + searchParams.toString()));
            const port = queryBuilder.buildFilterModel();
            expect(port.port_location).to.be.equal('Middelfart');
            expect(port.country).to.be.equal('Denmark');
            expect(port.mapview_1).to.be.equal(null);
            expect(port.mapview_2).to.be.equal(null);
            expect(port.mapview_3).to.be.equal(null);
        });
    });
});
