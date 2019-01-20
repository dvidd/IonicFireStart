"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var cleanCss = require("./cleancss");
var cleanCssFactory = require("./util/clean-css-factory");
var config = require("./util/config");
var helpers = require("./util/helpers");
var workerClient = require("./worker-client");
describe('clean css task', function () {
    describe('cleancss', function () {
        it('should return when the worker returns', function () {
            // arrange
            var context = {};
            var configFile = null;
            var spy = spyOn(workerClient, workerClient.runWorker.name).and.returnValue(Promise.resolve());
            // act
            return cleanCss.cleancss(context, null).then(function () {
                // assert
                expect(spy).toHaveBeenCalledWith('cleancss', 'cleancssWorker', context, configFile);
            });
        });
        it('should throw when the worker throws', function () {
            // arrange
            var context = {};
            var errorMessage = 'Simulating an error';
            spyOn(workerClient, workerClient.runWorker.name).and.returnValue(Promise.reject(new Error(errorMessage)));
            // act
            return cleanCss.cleancss(context, null).then(function () {
                throw new Error('Should never get here');
            }).catch(function (err) {
                // assert
                expect(err.message).toEqual(errorMessage);
            });
        });
    });
    describe('cleancssworker', function () {
        it('should throw when reading the file throws', function () {
            var errorMessage = 'simulating an error';
            // arrange
            var context = { buildDir: 'www' };
            var cleanCssConfig = { sourceFileName: 'sourceFileName', destFileName: 'destFileName' };
            spyOn(config, config.generateContext.name).and.returnValue(context);
            spyOn(config, config.fillConfigDefaults.name).and.returnValue(cleanCssConfig);
            spyOn(helpers, helpers.readFileAsync.name).and.returnValue(Promise.reject(new Error(errorMessage)));
            // act
            return cleanCss.cleancssWorker(context, null).then(function () {
                throw new Error('Should never get here');
            }).catch(function (err) {
                expect(err.message).toEqual(errorMessage);
            });
        });
        it('should return what writeFileAsync returns', function () {
            // arrange
            var context = { buildDir: 'www' };
            var cleanCssConfig = { sourceFileName: 'sourceFileName', destFileName: 'destFileName' };
            var fileContent = 'content';
            var minifiedContent = 'someContent';
            spyOn(config, config.generateContext.name).and.returnValue(context);
            spyOn(config, config.fillConfigDefaults.name).and.returnValue(cleanCssConfig);
            spyOn(helpers, helpers.readFileAsync.name).and.returnValue(Promise.resolve(fileContent));
            spyOn(helpers, helpers.writeFileAsync.name).and.returnValue(Promise.resolve());
            spyOn(cleanCssFactory, cleanCssFactory.getCleanCssInstance.name).and.returnValue({
                minify: function (content, cb) {
                    cb(null, { styles: minifiedContent });
                }
            });
            // act
            return cleanCss.cleancssWorker(context, null).then(function () {
                // assert
                expect(config.generateContext).toHaveBeenCalledWith(context);
                expect(config.fillConfigDefaults).toHaveBeenCalledWith(null, cleanCss.taskInfo.defaultConfigFile);
                expect(helpers.readFileAsync).toHaveBeenCalledWith(path_1.join(context.buildDir, cleanCssConfig.sourceFileName));
                expect(helpers.writeFileAsync).toHaveBeenCalledWith(path_1.join(context.buildDir, cleanCssConfig.destFileName), minifiedContent);
            });
        });
    });
    describe('runCleanCss', function () {
        it('should reject when minification errors out', function () {
            // arrange
            var errorMessage = 'simulating an error';
            var configFile = { options: {} };
            var fileContent = 'fileContent';
            var destinationFilePath = 'filePath';
            var mockMinifier = {
                minify: function () { }
            };
            var minifySpy = spyOn(mockMinifier, mockMinifier.minify.name);
            spyOn(cleanCssFactory, cleanCssFactory.getCleanCssInstance.name).and.returnValue(mockMinifier);
            // act
            var promise = cleanCss.runCleanCss(configFile, fileContent, destinationFilePath);
            // call the callback from the spy's args
            var callback = minifySpy.calls.mostRecent().args[1];
            callback(new Error(errorMessage), null);
            return promise.then(function () {
                throw new Error('Should never get here');
            }).catch(function (err) {
                // assert
                expect(err.message).toEqual(errorMessage);
            });
        });
        it('should reject when minification has one or more errors', function () {
            // arrange
            var configFile = { options: {} };
            var fileContent = 'fileContent';
            var minificationResponse = {
                errors: ['some error']
            };
            var destinationFilePath = 'filePath';
            var mockMinifier = {
                minify: function () { }
            };
            var minifySpy = spyOn(mockMinifier, mockMinifier.minify.name);
            spyOn(cleanCssFactory, cleanCssFactory.getCleanCssInstance.name).and.returnValue(mockMinifier);
            // act
            var promise = cleanCss.runCleanCss(configFile, fileContent, destinationFilePath);
            // call the callback from the spy's args
            var callback = minifySpy.calls.mostRecent().args[1];
            callback(null, minificationResponse);
            return promise.then(function () {
                throw new Error('Should never get here');
            }).catch(function (err) {
                // assert
                expect(err.message).toEqual(minificationResponse.errors[0]);
            });
        });
        it('should return minified content', function () {
            var configFile = { options: {} };
            var fileContent = 'fileContent';
            var minifySpy = null;
            var minificationResponse = {
                styles: 'minifiedContent'
            };
            var destinationFilePath = 'filePath';
            var mockMinifier = {
                minify: function () { }
            };
            minifySpy = spyOn(mockMinifier, mockMinifier.minify.name);
            spyOn(cleanCssFactory, cleanCssFactory.getCleanCssInstance.name).and.returnValue(mockMinifier);
            // act
            var promise = cleanCss.runCleanCss(configFile, fileContent, destinationFilePath);
            // call the callback from the spy's args
            var callback = minifySpy.calls.mostRecent().args[1];
            callback(null, minificationResponse);
            return promise.then(function (result) {
                expect(result).toEqual(minificationResponse.styles);
                expect(cleanCssFactory.getCleanCssInstance).toHaveBeenCalledWith(configFile.options);
                expect(minifySpy.calls.mostRecent().args[0]).toEqual(fileContent);
            });
        });
    });
});
