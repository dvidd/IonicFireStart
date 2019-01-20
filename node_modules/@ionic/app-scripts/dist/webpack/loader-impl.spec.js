"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var loader = require("./loader-impl");
var helpers = require("../util/helpers");
function getMockContext() {
    return {
        fileCache: getMockFileCache()
    };
}
function getMockFileCache() {
    return {
        get: function () { },
        set: function () { }
    };
}
function getMockWebpackObject(resourcePath) {
    return {
        cacheable: function () { },
        async: function () { },
        resourcePath: resourcePath
    };
}
describe('webpack loader', function () {
    it('should callback with file and original source map provided', function (done) {
        // arrange
        var mockContext = getMockContext();
        var mockSourceMap = {};
        var sourceString = 'sourceString';
        var fakePath = path_1.join(process.cwd(), 'some', 'path', 'content.js');
        var fakeContent = 'SomeFileContent';
        var mockWebpackObject = getMockWebpackObject(fakePath);
        var spy = jasmine.createSpy('mock webpack callback');
        spy.and.callFake(function () {
            assertFunction();
        });
        spyOn(mockWebpackObject, mockWebpackObject.cacheable.name);
        spyOn(mockWebpackObject, mockWebpackObject.async.name).and.returnValue(spy);
        spyOn(helpers, helpers.getContext.name).and.returnValue(mockContext);
        spyOn(helpers, helpers.readAndCacheFile.name).and.returnValue(Promise.resolve(fakeContent));
        spyOn(mockContext.fileCache, mockContext.fileCache.get.name).and.returnValue({
            path: fakePath,
            content: fakeContent
        });
        // act
        loader.webpackLoader(sourceString, mockSourceMap, mockWebpackObject);
        // assert
        var assertFunction = function () {
            expect(helpers.readAndCacheFile).toHaveBeenCalledTimes(2);
            expect(spy).toHaveBeenCalledWith(null, fakeContent, mockSourceMap);
            done();
        };
    });
    it('should callback with file and map loaded from file cache', function (done) {
        // arrange
        var mockContext = getMockContext();
        var mockSourceMap = {};
        var sourceString = 'sourceString';
        var fakePath = path_1.join(process.cwd(), 'some', 'path', 'content.js');
        var fakeContent = "{\"test\": \"test\"}";
        var mockWebpackObject = getMockWebpackObject(fakePath);
        var spy = jasmine.createSpy('mock webpack callback');
        spy.and.callFake(function () {
            assertFunction();
        });
        spyOn(mockWebpackObject, mockWebpackObject.cacheable.name);
        spyOn(mockWebpackObject, mockWebpackObject.async.name).and.returnValue(spy);
        spyOn(helpers, helpers.getContext.name).and.returnValue(mockContext);
        spyOn(helpers, helpers.readAndCacheFile.name).and.returnValue(Promise.resolve(fakeContent));
        var fileCacheSpy = spyOn(mockContext.fileCache, mockContext.fileCache.get.name).and.returnValue({
            path: fakePath,
            content: fakeContent
        });
        // act
        loader.webpackLoader(sourceString, mockSourceMap, mockWebpackObject);
        // assert
        var assertFunction = function () {
            expect(fileCacheSpy).toHaveBeenCalledTimes(2);
            expect(fileCacheSpy.calls.first().args[0]).toEqual(fakePath);
            expect(fileCacheSpy.calls.mostRecent().args[0]).toEqual(fakePath + '.map');
            expect(spy.calls.mostRecent().args[0]).toEqual(null);
            expect(spy.calls.mostRecent().args[1]).toEqual(fakeContent);
            expect(spy.calls.mostRecent().args[2]).not.toEqual(mockSourceMap);
            done();
        };
    });
    it('should callback with error when can\'t load file from disk', function (done) {
        // arrange
        var cantReadFileError = 'Failed to read file from disk';
        var mockContext = getMockContext();
        var mockSourceMap = {};
        var sourceString = 'sourceString';
        var fakePath = path_1.join(process.cwd(), 'some', 'path', 'content.js');
        var mockWebpackObject = getMockWebpackObject(fakePath);
        var spy = jasmine.createSpy('mock webpack callback');
        spy.and.callFake(function () {
            assertFunction();
        });
        spyOn(mockWebpackObject, mockWebpackObject.cacheable.name);
        spyOn(mockWebpackObject, mockWebpackObject.async.name).and.returnValue(spy);
        spyOn(helpers, helpers.getContext.name).and.returnValue(mockContext);
        spyOn(mockContext.fileCache, mockContext.fileCache.get.name).and.returnValue(null);
        spyOn(mockContext.fileCache, mockContext.fileCache.set.name);
        spyOn(helpers, helpers.readAndCacheFile.name).and.returnValue(Promise.reject(new Error(cantReadFileError)));
        // assert
        var assertFunction = function () {
            expect(spy.calls.mostRecent().args[0]).toBeTruthy();
            expect(spy.calls.mostRecent().args[0].message).toEqual(cantReadFileError);
            done();
        };
        // act
        return loader.webpackLoader(sourceString, mockSourceMap, mockWebpackObject);
    });
    it('should callback with content from disk', function (done) {
        // arrange
        var mockContext = getMockContext();
        var mockSourceMap = {};
        var sourceString = 'sourceString';
        var fakePath = path_1.join(process.cwd(), 'some', 'path', 'content.js');
        var fakeContent = "{\"test\": \"test\"}";
        var mockWebpackObject = getMockWebpackObject(fakePath);
        var callbackSpy = jasmine.createSpy('mock webpack callback');
        callbackSpy.and.callFake(function () {
            assertFunction();
        });
        spyOn(mockWebpackObject, mockWebpackObject.cacheable.name);
        spyOn(mockWebpackObject, mockWebpackObject.async.name).and.returnValue(callbackSpy);
        spyOn(helpers, helpers.getContext.name).and.returnValue(mockContext);
        spyOn(mockContext.fileCache, mockContext.fileCache.set.name);
        var readFileSpy = spyOn(helpers, helpers.readAndCacheFile.name).and.returnValue(Promise.resolve(fakeContent));
        spyOn(mockContext.fileCache, mockContext.fileCache.get.name).and.returnValue({
            path: fakePath,
            content: fakeContent
        });
        // act
        loader.webpackLoader(sourceString, mockSourceMap, mockWebpackObject);
        // assert
        var assertFunction = function () {
            expect(readFileSpy).toHaveBeenCalledTimes(2);
            expect(readFileSpy.calls.first().args[0]).toEqual(fakePath);
            expect(readFileSpy.calls.mostRecent().args[0]).toEqual(fakePath + '.map');
            expect(callbackSpy.calls.mostRecent().args[0]).toEqual(null);
            expect(callbackSpy.calls.mostRecent().args[1]).toEqual(fakeContent);
            expect(callbackSpy.calls.mostRecent().args[2]).toBeTruthy();
            done();
        };
    });
});
