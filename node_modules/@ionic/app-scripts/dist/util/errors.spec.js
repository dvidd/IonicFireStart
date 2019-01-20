"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./errors");
describe('Errors', function () {
    describe('BuildError', function () {
        it('should create BuildError from err object in constructor', function () {
            var buildError = new errors_1.BuildError('message1');
            buildError.name = 'name1';
            buildError.stack = 'stack1';
            buildError.isFatal = true;
            buildError.hasBeenLogged = true;
            var buildErrorCopy = new errors_1.BuildError(buildError);
            expect(buildErrorCopy.message).toEqual(buildError.message);
            expect(buildErrorCopy.message).toEqual('message1');
            expect(buildErrorCopy.name).toEqual(buildError.name);
            expect(buildErrorCopy.stack).toEqual(buildError.stack);
            expect(buildErrorCopy.isFatal).toEqual(buildError.isFatal);
            expect(buildErrorCopy.hasBeenLogged).toEqual(buildError.hasBeenLogged);
        });
        it('should create a default object', function () {
            var buildError = new errors_1.BuildError('message1');
            expect(buildError.isFatal).toBeFalsy();
            expect(buildError.hasBeenLogged).toBeFalsy();
        });
    });
});
