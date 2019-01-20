"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants = require("./util/constants");
var workerClient = require("./worker-client");
var lint_1 = require("./lint");
var originalEnv = process.env;
describe('lint task', function () {
    describe('lint', function () {
        beforeEach(function () {
            originalEnv = process.env;
            process.env = {};
        });
        afterEach(function () {
            process.env = originalEnv;
        });
        it('should return a resolved promise', function (done) {
            spyOn(workerClient, workerClient.runWorker.name).and.returnValue(Promise.resolve());
            lint_1.lint(null).then(function () {
                done();
            });
        });
        it('should return resolved promise when bailOnLintError is not set', function (done) {
            spyOn(workerClient, workerClient.runWorker.name).and.returnValue(Promise.reject(new Error('Simulating an error')));
            lint_1.lint(null).then(function () {
                done();
            });
        });
        it('should return rejected promise when bailOnLintError is set', function (done) {
            spyOn(workerClient, workerClient.runWorker.name).and.returnValue(Promise.reject(new Error('Simulating an error')));
            process.env[Constants.ENV_BAIL_ON_LINT_ERROR] = 'true';
            lint_1.lint(null).catch(function () {
                done();
            });
        });
    });
});
