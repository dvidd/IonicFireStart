"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var deepLinking = require("./deep-linking");
var deeplinkUtils = require("./deep-linking/util");
var file_cache_1 = require("./util/file-cache");
var helpers = require("./util/helpers");
describe('Deep Linking task', function () {
    describe('deepLinkingWorkerImpl', function () {
        it('should not update app ngmodule when it has an existing deeplink config', function () {
            var appNgModulePath = path_1.join('some', 'fake', 'path', 'myApp', 'src', 'app', 'app.module.ts');
            var context = {
                fileCache: new file_cache_1.FileCache()
            };
            var knownFileContent = 'someFileContent';
            var knownDeepLinkString = 'someDeepLinkString';
            context.fileCache.set(appNgModulePath, { path: appNgModulePath, content: knownFileContent });
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue(appNgModulePath);
            spyOn(helpers, helpers.readAndCacheFile.name).and.returnValue(Promise.resolve(knownFileContent));
            spyOn(deeplinkUtils, deeplinkUtils.hasExistingDeepLinkConfig.name).and.returnValue(true);
            var promise = deepLinking.deepLinkingWorkerImpl(context, null);
            return promise.then(function (results) {
                expect(deeplinkUtils.hasExistingDeepLinkConfig).toHaveBeenCalled();
                expect(results.size).toEqual(0);
            });
        });
    });
});
