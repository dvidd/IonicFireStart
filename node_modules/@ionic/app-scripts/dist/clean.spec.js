"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs-extra");
var clean = require("./clean");
describe('clean task', function () {
    describe('clean', function () {
        it('should empty the build directory', function () {
            // arrage
            spyOn(fs, fs.emptyDirSync.name).and.returnValue('things');
            var context = { buildDir: 'something' };
            // act
            return clean.clean(context).then(function () {
                // assert
                expect(fs.emptyDirSync).toHaveBeenCalledWith(context.buildDir);
            });
        });
        it('should throw when failing to empty dir', function () {
            // arrage
            spyOn(fs, fs.emptyDirSync.name).and.throwError('Simulating an error');
            var context = { buildDir: 'something' };
            // act
            return clean.clean(context).catch(function (ex) {
                expect(ex instanceof Error).toBe(true);
                expect(typeof ex.message).toBe('string');
            });
        });
    });
});
