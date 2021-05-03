import {expect} from 'chai';
import AisMessageQueryBuilder from "../../queryBuilder/AisMessageQueryBuilder";
import {URL, URLSearchParams} from "url";

describe('AisMessageQueryBuilder', function() {
    describe('buildFilterModel()', function() {
        it('should build complete ais message filter model', function() {
            const aisMessageQueryObject = {
                name: 'Peter Pan',
                mmsi: '265866000',
                imo: '9217242',
                callSign: 'SGUH'
            }
            const searchParams = new URLSearchParams(aisMessageQueryObject);
            const queryBuilder = new AisMessageQueryBuilder(new URL("https://example.com/endpoint?" + searchParams.toString()));
            const vesselData = queryBuilder.buildFilterModel();
            expect(vesselData.name).to.be.equal('Peter Pan');
            expect(vesselData.mmsi).to.be.equal(265866000);
            expect(vesselData.imo).to.be.equal(9217242);
            expect(vesselData.callSign).to.be.equal('SGUH');
        });

        it('should build partial ais message filter model', function() {
            const aisMessageQueryObject = {
                mmsi: '265866000'
            }
            const searchParams = new URLSearchParams(aisMessageQueryObject);
            const queryBuilder = new AisMessageQueryBuilder(new URL("https://example.com/endpoint?" + searchParams.toString()));
            const vesselData = queryBuilder.buildFilterModel();
            expect(vesselData.mmsi).to.be.equal(265866000);
        });
    });
});
