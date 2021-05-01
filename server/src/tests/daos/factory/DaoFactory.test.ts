import {expect} from "chai";
import DaoFactory from "../../../daos/factory/DaoFactory";

describe('DaoFactory', function () {
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

    describe('getAisMessageDoa()', function () {
        it('should throw an exception for undefined config', async function () {
            try {
                await DaoFactory.getAisMessageDao(databaseConfig);
                // Throw exception to force catch block to run if no exception thrown in await.
                // noinspection ExceptionCaughtLocallyJS
                throw new Error('Throw error to force catch to run')
            } catch (error) {
                expect(error.message).to.be.equal('undefined is not a valid database type.');
                expect(error.name).to.be.equal('InvalidDatabaseConfigException');
            }
        });
    });

    describe('getPortDoa()', function () {
        it('should throw an exception for undefined config', async function () {
            try {
                await DaoFactory.getPortDao(databaseConfig);
                // Throw exception to force catch block to run if no exception thrown in await.
                // noinspection ExceptionCaughtLocallyJS
                throw new Error('Throw error to force catch to run')
            } catch (error) {
                expect(error.message).to.be.equal('undefined is not a valid database type.');
                expect(error.name).to.be.equal('InvalidDatabaseConfigException');
            }
        });
    });

    describe('getTileDoa()', function () {
        it('should throw an exception for undefined config', async function () {
            try {
                await DaoFactory.getTileDao(databaseConfig);
                // Throw exception to force catch block to run if no exception thrown in await.
                // noinspection ExceptionCaughtLocallyJS
                throw new Error('Throw error to force catch to run')
            } catch (error) {
                expect(error.message).to.be.equal('undefined is not a valid database type.');
                expect(error.name).to.be.equal('InvalidDatabaseConfigException');
            }
        });
    });

    describe('getVesselDoa()', function () {
        it('should throw an exception for undefined config', async function () {
            try {
                await DaoFactory.getVesselDao(databaseConfig);
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
