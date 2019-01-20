"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bundle = require("./bundle");
var webpack = require("./webpack");
var Constants = require("./util/constants");
describe('bundle task', function () {
    describe('bundle', function () {
        it('should return the value webpack task returns', function () {
            // arrange
            spyOn(webpack, webpack.webpack.name).and.returnValue(Promise.resolve());
            var context = { bundler: Constants.BUNDLER_WEBPACK };
            // act
            return bundle.bundle(context).then(function () {
                // assert
                expect(webpack.webpack).toHaveBeenCalled();
            });
        });
        it('should throw when webpack throws', function () {
            var errorText = 'simulating an error';
            // arrange
            spyOn(webpack, webpack.webpack.name).and.returnValue(Promise.reject(new Error(errorText)));
            var context = { bundler: Constants.BUNDLER_WEBPACK };
            // act
            return bundle.bundle(context).then(function () {
                throw new Error('Should never happen');
            }).catch(function (err) {
                // assert
                expect(webpack.webpack).toHaveBeenCalled();
                expect(err.message).toBe(errorText);
            });
        });
    });
    describe('bundleUpdate', function () {
        it('should return the value webpack returns', function () {
            // arrange
            spyOn(webpack, webpack.webpackUpdate.name).and.returnValue(Promise.resolve());
            var context = { bundler: Constants.BUNDLER_WEBPACK };
            var changedFiles = [];
            // act
            return bundle.bundleUpdate(changedFiles, context).then(function () {
                // assert
                expect(webpack.webpackUpdate).toHaveBeenCalledWith(changedFiles, context);
            });
        });
        it('should throw when webpack throws', function () {
            var errorText = 'simulating an error';
            try {
                // arrange
                spyOn(webpack, webpack.webpackUpdate.name).and.returnValue(Promise.reject(new Error(errorText)));
                var context = { bundler: Constants.BUNDLER_WEBPACK };
                var changedFiles = [];
                // act
                return bundle.bundleUpdate(changedFiles, context).then(function () {
                    throw new Error('Should never happen');
                }).catch(function (err) {
                    // assert
                    expect(webpack.webpackUpdate).toHaveBeenCalled();
                    expect(err.message).toBe(errorText);
                });
            }
            catch (ex) {
            }
        });
    });
    describe('buildJsSourceMaps', function () {
        it('should get false when devtool is null for webpack', function () {
            // arrange
            var config = {};
            spyOn(webpack, webpack.getWebpackConfig.name).and.returnValue(config);
            var context = { bundler: Constants.BUNDLER_WEBPACK };
            // act
            var result = bundle.buildJsSourceMaps(context);
            // assert
            expect(webpack.getWebpackConfig).toHaveBeenCalledWith(context, null);
            expect(result).toEqual(false);
        });
        it('should get false when devtool is valid', function () {
            // arrange
            var config = { devtool: 'someValue' };
            spyOn(webpack, webpack.getWebpackConfig.name).and.returnValue(config);
            var context = { bundler: Constants.BUNDLER_WEBPACK };
            // act
            var result = bundle.buildJsSourceMaps(context);
            // assert
            expect(webpack.getWebpackConfig).toHaveBeenCalledWith(context, null);
            expect(result).toEqual(true);
        });
    });
    describe('getJsOutputDest', function () {
        it('should get the value from webpack', function () {
            // arrange
            var returnValue = 'someString';
            spyOn(webpack, webpack.getOutputDest.name).and.returnValue(returnValue);
            var context = { bundler: Constants.BUNDLER_WEBPACK };
            // act
            var result = bundle.getJsOutputDest(context);
            // assert
            expect(webpack.getOutputDest).toHaveBeenCalledWith(context);
            expect(result).toEqual(returnValue);
        });
    });
});
