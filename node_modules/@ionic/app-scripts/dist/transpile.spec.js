"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var transpile = require("./transpile");
var file_cache_1 = require("./util/file-cache");
describe('transpile', function () {
    describe('resetSourceFiles', function () {
        it('should remove any files with temporary suffix, and reset content to the original, non-modified value', function () {
            var context = {
                fileCache: new file_cache_1.FileCache()
            };
            var aboutFilePath = 'about.ts';
            var aboutFile = { path: aboutFilePath, content: 'modifiedContent' };
            var originalAboutFilePath = aboutFilePath + transpile.inMemoryFileCopySuffix;
            var originalAboutFile = { path: originalAboutFilePath, content: 'originalContent' };
            context.fileCache.set(aboutFilePath, aboutFile);
            context.fileCache.set(originalAboutFilePath, originalAboutFile);
            transpile.resetSourceFiles(context.fileCache);
            expect(context.fileCache.get(originalAboutFilePath)).toBeFalsy();
            expect(context.fileCache.get(aboutFilePath).content).toEqual(originalAboutFile.content);
        });
    });
});
