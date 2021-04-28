"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var EnvironmentHandler_1 = __importDefault(require("../src/EnvironmentHandler"));
describe('EnvironmentHandler', function () {
    describe('setUp()', function () {
        it('should set environment variables', function () {
            var environmentHandler = new EnvironmentHandler_1.default("tests/resources/.env.test");
            environmentHandler.setUp();
            chai_1.expect(process.env['KEY']).to.be.equal('VALUE');
            chai_1.expect(process.env['KEY_2']).to.be.equal('VALUE_2');
        });
        it('should not override existing environment variables', function () {
            process.env['KEY'] = 'Different value';
            var environmentHandler = new EnvironmentHandler_1.default("tests/resources/.env.test");
            environmentHandler.setUp();
            chai_1.expect(process.env['KEY']).to.be.equal('Different value');
        });
    });
});
