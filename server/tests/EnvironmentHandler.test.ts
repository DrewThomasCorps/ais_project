import {expect} from 'chai';
import EnvironmentHandler from "../src/EnvironmentHandler";

describe('EnvironmentHandler', function() {
    describe('setUp()', function() {
        it('should set environment variables', function() {
            const environmentHandler = new EnvironmentHandler("tests/resources/.env.test");
            environmentHandler.setUp();
            expect(process.env['KEY']).to.be.equal('VALUE');
            expect(process.env['KEY_2']).to.be.equal('VALUE_2');
        });
        it('should fail', () => {
            expect(2).to.be.equal(3);
        })
    });
});
