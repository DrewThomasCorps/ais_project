import VesselDaoFactory from "../../../src/daos/factory/VesselDaoFactory";
import {expect} from "chai";

describe('VesselDaoFactory', function () {
    const databaseConfig = {
        getType() {
            return 'undefined';
        },
        getUrl() {
            return ''
        },
        getName() {
            return ''
        }
    }

    describe('getVesselDoa()', function () {
        it('should throw an exception for undefined config', async function () {
            try {
                await VesselDaoFactory.getVesselDao(databaseConfig);
                // Throw exception to force catch block to run if no exception thrown in await.
                // noinspection ExceptionCaughtLocallyJS
                throw new Error('Throw error to force catch to run')
            } catch (error) {
                expect(error.message).to.be.equal('undefined is not a valid database type.');
                expect(error.name).to.be.equal('InvalidDatabaseConfigException');
            }
        });
    });

});
