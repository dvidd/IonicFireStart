"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var preprocess = require("./preprocess");
var deeplink = require("./deep-linking");
var helpers = require("./util/helpers");
var globUtil = require("./util/glob-util");
describe('Preprocess Task', function () {
    describe('preprocess', function () {
        it('should call deepLink but not write files to disk', function () {
            // arrange
            var context = {
                optimizeJs: false
            };
            var mockDirName = path_1.join('some', 'fake', 'dir');
            var mockGlobResults = [];
            mockGlobResults.push({ absolutePath: mockDirName });
            mockGlobResults.push({ absolutePath: mockDirName + '2' });
            spyOn(deeplink, deeplink.deepLinking.name).and.returnValue(Promise.resolve());
            spyOn(helpers, helpers.getBooleanPropertyValue.name).and.returnValue(false);
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue(mockDirName);
            spyOn(globUtil, globUtil.globAll.name).and.returnValue(Promise.resolve(mockGlobResults));
            // act
            return preprocess.preprocess(context);
        });
    });
});
