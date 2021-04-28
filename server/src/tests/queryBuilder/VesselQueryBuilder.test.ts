import {expect} from 'chai';
import VesselQueryBuilder from "../../queryBuilder/VesselQueryBuilder";
import {URL, URLSearchParams} from "url";

describe('VesselQueryBuilder', function() {
    describe('buildFilterModel()', function() {
        it('should build complete vessel', function() {
            const vesselQueryObject = {
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
            }
            const searchParams = new URLSearchParams(vesselQueryObject);
            const queryBuilder = new VesselQueryBuilder(new URL("https://example.com/endpoint?" + searchParams.toString()));
            const vessel = queryBuilder.buildFilterModel();
            expect(vessel.imo).to.be.equal(2)
            expect(vessel.flag).to.be.equal('3');
            expect(vessel.name).to.be.equal('4');
            expect(vessel.built).to.be.equal(5);
            expect(vessel.length).to.be.equal(6);
            expect(vessel.breadth).to.be.equal(7);
            expect(vessel.tonnage).to.be.equal(8);
            expect(vessel.mmsi).to.be.equal(9);
            expect(vessel.vessel_type).to.be.equal('10');
            expect(vessel.owner).to.be.equal(11);
            expect(vessel.former_names).to.be.equal(null);
        });
        it('should build partial vessel', function() {
            const vesselQueryObject = {
                imo: '2',
            }
            const searchParams = new URLSearchParams(vesselQueryObject);
            const queryBuilder = new VesselQueryBuilder(new URL("https://example.com/endpoint?" + searchParams.toString()));
            const vessel = queryBuilder.buildFilterModel();
            expect(vessel.imo).to.be.equal(2)
            expect(vessel.flag).to.be.equal(null);
            expect(vessel.name).to.be.equal(null);
            expect(vessel.built).to.be.equal(null);
            expect(vessel.length).to.be.equal(null);
            expect(vessel.breadth).to.be.equal(null);
            expect(vessel.tonnage).to.be.equal(null);
            expect(vessel.mmsi).to.be.equal(null);
            expect(vessel.vessel_type).to.be.equal(null);
            expect(vessel.owner).to.be.equal(null);
            expect(vessel.former_names).to.be.equal(null);
        });
    });
});
