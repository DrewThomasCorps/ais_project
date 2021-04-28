import {expect} from 'chai';
import Vessel from "../../models/Vessel";
import {readFileSync} from "fs";

describe('Vessel', function() {
    describe('fromJson()', function() {
        it('set all present values', function() {
            const vessel = Vessel.fromJson(readFileSync('tests/resources/models/vessel_one.json').toString())
            expect(vessel.flag).to.be.equal('United Kingdom');
            expect(vessel.imo).to.be.equal(1000019);
            expect(vessel.name).to.be.equal("Lady K Ii");
            expect(vessel.built).to.be.equal(1961);
            expect(vessel.length).to.be.equal(57);
            expect(vessel.breadth).to.be.equal(8);
            expect(vessel.tonnage).to.be.equal(551);
            expect(vessel.mmsi).to.be.equal(235095435);
            expect(vessel.vessel_type).to.be.equal("Yacht");
            expect(vessel.owner).to.be.equal(1);
            expect(vessel.former_names).to.deep.equal(
                [ "LADY K II (2012, Panama)", "RADIANT II (2009)", "PRINCESS TANYA (1961)", "COLUMBINE" ]
            );
        });

        it('set all values when optional values are missing', function() {
            const vessel = Vessel.fromJson(readFileSync('tests/resources/models/vessel_only_required.json').toString())
            expect(vessel.flag).to.be.equal(null);
            expect(vessel.imo).to.be.equal(1000019);
            expect(vessel.name).to.be.equal(null);
            expect(vessel.built).to.be.equal(null);
            expect(vessel.length).to.be.equal(null);
            expect(vessel.breadth).to.be.equal(null);
            expect(vessel.tonnage).to.be.equal(null);
            expect(vessel.mmsi).to.be.equal(null);
            expect(vessel.vessel_type).to.be.equal(null);
            expect(vessel.owner).to.be.equal(null);
            expect(vessel.former_names).to.equal(null);
        });
    });
});
