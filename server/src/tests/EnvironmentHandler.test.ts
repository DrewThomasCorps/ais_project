import {expect} from 'chai';
import EnvironmentHandler from "../EnvironmentHandler";

describe('EnvironmentHandler', function() {
    describe('setUp()', function() {
        it('should set environment variables', function() {
            const environmentHandler = new EnvironmentHandler("src/tests/resources/.env.test");
            environmentHandler.setUp();
            expect(process.env['KEY']).to.be.equal('VALUE');
            expect(process.env['KEY_2']).to.be.equal('VALUE_2');
        });
        it('should not override existing environment variables', function () {
            process.env['KEY'] = 'Different value'
            const environmentHandler = new EnvironmentHandler("src/tests/resources/.env.test");
            environmentHandler.setUp();
            expect(process.env['KEY']).to.be.equal('Different value');
        })
    });
});
