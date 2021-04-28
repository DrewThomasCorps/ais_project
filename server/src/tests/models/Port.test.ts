import {expect} from 'chai';
import Port from "../../models/Port";
import {readFileSync} from "fs";

describe('Port', function() {
    describe('fromJson()', function() {
        it('set all present values', function() {
            const port = Port.fromJson(readFileSync('src/tests/resources/models/port_one.json').toString())
            expect(port.id).to.be.equal(2978);
            expect(port.un_locode).to.be.equal('DKKTD');
            expect(port.port_location).to.be.equal('Kerteminde');
            expect(port.country).to.be.equal('Denmark');
            expect(port.longitude).to.be.equal(10.665278);
            expect(port.latitude).to.be.equal(55.451389);
            expect(port.website).to.be.equal('www.kerteminde.dk');
            expect(port.mapview_1).to.be.equal(1);
            expect(port.mapview_2).to.be.equal(5331);
            expect(port.mapview_3).to.be.equal(53312);
        });
    });
});
