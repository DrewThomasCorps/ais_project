import {expect} from 'chai';
import {readFileSync} from "fs";
import PositionReport from "../../models/PositionReport";

describe('PositionReport', function() {
    describe('fromJson()', function() {
        it('set all present values', async function() {
            process.env['DATABASE_TYPE'] = 'testing';
            const positionReport = await PositionReport.fromJson(readFileSync('src/tests/resources/models/position_report_one.json').toString())
            expect(positionReport.timestamp.toISOString()).to.be.equal('2020-11-18T00:00:00.000Z');
            expect(positionReport.class).to.be.equal('Class A');
            expect(positionReport.mmsi).to.be.equal(257385000);
            expect(positionReport.position.type).to.be.equal('Point');
            expect(positionReport.position.latitude).to.be.equal(55.219403);
            expect(positionReport.position.longitude).to.be.equal(13.127725);
            expect(positionReport.status).to.be.equal('Under way using engine');
            expect(positionReport.rate_of_turn).to.be.equal(25.7);
            expect(positionReport.speed_over_ground).to.be.equal(12.3);
            expect(positionReport.course_over_ground).to.be.equal(96.5);
            expect(positionReport.heading).to.be.equal(101);
        });

    });
});
