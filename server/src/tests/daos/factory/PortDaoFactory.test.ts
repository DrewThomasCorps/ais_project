import PortDaoFactory from "../../../daos/factory/PortDaoFactory";
import {expect} from "chai";

describe('PortDaoFactory', function () {
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

    describe('getPortDoa()', function () {
        it('should throw an exception for undefined config', async function () {
            try {
                await PortDaoFactory.getPortDao(databaseConfig);
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
