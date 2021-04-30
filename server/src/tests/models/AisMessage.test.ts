import {expect} from 'chai';
import {readFileSync} from "fs";
import AisMessage from "../../models/AisMessage";

describe('AisMessage', function() {
    describe('fromJson()', function() {
        it('should set position report values', async function() {
            const positionReport = await AisMessage.fromJson(readFileSync('src/tests/resources/models/position_report_one.json').toString())
            expect(positionReport.timestamp?.toISOString()).to.be.equal('2020-11-18T00:00:00.000Z');
            expect(positionReport.shipClass).to.be.equal('Class A');
            expect(positionReport.mmsi).to.be.equal(257385000);
            expect(positionReport.messageType).to.be.equal('position_report')
            expect(positionReport.position?.type).to.be.equal('Point');
            expect(positionReport.position?.latitude).to.be.equal(55.219403);
            expect(positionReport.position?.longitude).to.be.equal(13.127725);
            expect(positionReport.status).to.be.equal('Under way using engine');
            expect(positionReport.rate_of_turn).to.be.equal(25.7);
            expect(positionReport.speed_over_ground).to.be.equal(12.3);
            expect(positionReport.course_over_ground).to.be.equal(96.5);
            expect(positionReport.heading).to.be.equal(101);
        });

        it('should set static data values', async function() {
            const positionReport = await AisMessage.fromJson(readFileSync('src/tests/resources/models/static_data_one.json').toString())
            expect(positionReport.timestamp?.toISOString()).to.be.equal('2020-11-18T00:00:00.000Z');
            expect(positionReport.shipClass).to.be.equal('AtoN');
            expect(positionReport.mmsi).to.be.equal(992111840);
            expect(positionReport.messageType).to.be.equal('static_data');
            expect(positionReport.imo).to.be.equal('Unknown');
            expect(positionReport.name).to.be.equal('WIND FARM BALTIC1NW');
            expect(positionReport.destination).to.be.equal('HVIDE-SANDE');
            expect(positionReport.callSign).to.be.equal('XPH3948');
            expect(positionReport.eta?.toISOString()).to.be.equal('2020-11-03T17:30:00.000Z');
            expect(positionReport.vesselType).to.be.equal('Undefined');
            expect(positionReport.length).to.be.equal(60);
            expect(positionReport.breadth).to.be.equal(61);
            expect(positionReport.draught).to.be.equal(62);
            expect(positionReport.a).to.be.equal(31);
            expect(positionReport.b).to.be.equal(32);
            expect(positionReport.c).to.be.equal(33);
            expect(positionReport.d).to.be.equal(34);
        });

    });
});
