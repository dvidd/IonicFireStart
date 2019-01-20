"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path_1 = require("path");
var upgradeScript = require("./add-default-ngmodules");
var deeplinkUtils = require("../deep-linking/util");
var file_cache_1 = require("../util/file-cache");
var globUtil = require("../util/glob-util");
var helpers = require("../util/helpers");
describe('add default ngmodules upgrade script', function () {
    describe('getTsFilePaths', function () {
        it('should return a list of absolute file paths', function () {
            var srcDirectory = path_1.join('Users', 'noone', 'this', 'path', 'is', 'fake', 'src');
            var context = {
                srcDir: srcDirectory
            };
            var knownFileOne = path_1.join(srcDirectory, 'pages', 'page-one', 'page-one.ts');
            var knownFileTwo = path_1.join(srcDirectory, 'pages', 'page-two', 'page-two.ts');
            var knownFileThree = path_1.join(srcDirectory, 'pages', 'page-three', 'page-three.ts');
            var knownFileFour = path_1.join(srcDirectory, 'util', 'some-util.ts');
            var globResults = [
                { absolutePath: knownFileOne },
                { absolutePath: knownFileTwo },
                { absolutePath: knownFileThree },
                { absolutePath: knownFileFour },
            ];
            spyOn(globUtil, globUtil.globAll.name).and.returnValue(Promise.resolve(globResults));
            var promise = upgradeScript.getTsFilePaths(context);
            return promise.then(function (filePaths) {
                expect(filePaths.length).toEqual(4);
                expect(filePaths[0]).toEqual(knownFileOne);
                expect(filePaths[1]).toEqual(knownFileTwo);
                expect(filePaths[2]).toEqual(knownFileThree);
                expect(filePaths[3]).toEqual(knownFileFour);
            });
        });
    });
    describe('readTsFiles', function () {
        it('should read the ts files', function () {
            var context = {
                fileCache: new file_cache_1.FileCache()
            };
            var srcDirectory = path_1.join('Users', 'noone', 'this', 'path', 'is', 'fake', 'src');
            var knownFileOne = path_1.join(srcDirectory, 'pages', 'page-one', 'page-one.ts');
            var knownFileTwo = path_1.join(srcDirectory, 'pages', 'page-two', 'page-two.ts');
            var knownFileThree = path_1.join(srcDirectory, 'pages', 'page-three', 'page-three.ts');
            var knownFileFour = path_1.join(srcDirectory, 'util', 'some-util.ts');
            var fileList = [knownFileOne, knownFileTwo, knownFileThree, knownFileFour];
            spyOn(helpers, helpers.readFileAsync.name).and.callFake(function (filePath) {
                // just set the file content to the path name + 'content' to keep things simple
                return Promise.resolve(filePath + 'content');
            });
            var promise = upgradeScript.readTsFiles(context, fileList);
            return promise.then(function () {
                // the files should be cached now
                var fileOne = context.fileCache.get(knownFileOne);
                expect(fileOne.content).toEqual(knownFileOne + 'content');
                var fileTwo = context.fileCache.get(knownFileTwo);
                expect(fileTwo.content).toEqual(knownFileTwo + 'content');
                var fileThree = context.fileCache.get(knownFileThree);
                expect(fileThree.content).toEqual(knownFileThree + 'content');
                var fileFour = context.fileCache.get(knownFileFour);
                expect(fileFour.content).toEqual(knownFileFour + 'content');
            });
        });
    });
    describe('generateAndWriteNgModules', function () {
        it('should generate NgModules for only the pages with deeplink decorator AND if the module.ts file doesnt exist', function () {
            var srcDirectory = path_1.join('Users', 'noone', 'this', 'path', 'is', 'fake', 'src');
            var knownFileOne = path_1.join(srcDirectory, 'pages', 'page-one', 'page-one.ts');
            var knownFileTwo = path_1.join(srcDirectory, 'pages', 'page-two', 'page-two.ts');
            var knownFileThree = path_1.join(srcDirectory, 'pages', 'page-three', 'page-three.ts');
            var knownFileThreeModule = path_1.join(srcDirectory, 'pages', 'page-three', 'page-three.module.ts');
            var knownFileFour = path_1.join(srcDirectory, 'util', 'some-util.ts');
            var knownFileFive = path_1.join(srcDirectory, 'pages', 'page-three', 'provider.ts');
            var knownFileSix = path_1.join(srcDirectory, 'modals', 'modal-one', 'modal-one.ts');
            var context = {
                fileCache: new file_cache_1.FileCache()
            };
            context.fileCache.set(knownFileOne, { path: knownFileOne, content: getClassContent('PageOne', 'page-one') });
            context.fileCache.set(knownFileTwo, { path: knownFileTwo, content: getClassContent('PageTwo', 'page-two') });
            context.fileCache.set(knownFileThree, { path: knownFileThree, content: getClassContent('PageThree', 'page-three') });
            context.fileCache.set(knownFileThreeModule, { path: knownFileThreeModule, content: deeplinkUtils.generateDefaultDeepLinkNgModuleContent(knownFileThree, 'PageThree') });
            context.fileCache.set(knownFileFour, { path: knownFileFour, content: knownFileFour + " content" });
            context.fileCache.set(knownFileFive, { path: knownFileFive, content: knownFileFive + " content" });
            context.fileCache.set(knownFileSix, { path: knownFileSix, content: getClassContent('ModalOne', 'modal-one') });
            var ngModuleFileExtension = '.module.ts';
            var knownNgModulePageOne = "\nimport { NgModule } from '@angular/core';\nimport { IonicPageModule } from 'ionic-angular';\nimport { PageOne } from './page-one';\n\n@NgModule({\n  declarations: [\n    PageOne,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageOne)\n  ]\n})\nexport class PageOneModule {}\n\n";
            var knownNgModulePageTwo = "\nimport { NgModule } from '@angular/core';\nimport { IonicPageModule } from 'ionic-angular';\nimport { PageTwo } from './page-two';\n\n@NgModule({\n  declarations: [\n    PageTwo,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageTwo)\n  ]\n})\nexport class PageTwoModule {}\n\n";
            var knownNgModuleModalPage = "\nimport { NgModule } from '@angular/core';\nimport { IonicPageModule } from 'ionic-angular';\nimport { ModalOne } from './modal-one';\n\n@NgModule({\n  declarations: [\n    ModalOne,\n  ],\n  imports: [\n    IonicPageModule.forChild(ModalOne)\n  ]\n})\nexport class ModalOneModule {}\n\n";
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue(ngModuleFileExtension);
            var fsSpy = spyOn(fs, 'writeFileSync');
            upgradeScript.generateAndWriteNgModules(context.fileCache);
            expect(fsSpy.calls.count()).toEqual(3);
            expect(fsSpy.calls.argsFor(0)[0]).toEqual(helpers.changeExtension(knownFileOne, ngModuleFileExtension));
            expect(fsSpy.calls.argsFor(0)[1]).toEqual(knownNgModulePageOne);
            expect(fsSpy.calls.argsFor(1)[0]).toEqual(helpers.changeExtension(knownFileTwo, ngModuleFileExtension));
            expect(fsSpy.calls.argsFor(1)[1]).toEqual(knownNgModulePageTwo);
            expect(fsSpy.calls.argsFor(2)[0]).toEqual(helpers.changeExtension(knownFileSix, ngModuleFileExtension));
            expect(fsSpy.calls.argsFor(2)[1]).toEqual(knownNgModuleModalPage);
        });
    });
});
function getClassContent(className, folderName) {
    return "\nimport { Component } from '@angular/core';\nimport { IonicPage, NavController } from 'ionic-angular';\n\n@IonicPage()\n@Component({\n  selector: '" + folderName + "',\n  templateUrl: './" + folderName + ".html'\n})\nexport class " + className + " {\n\n  constructor(public navCtrl: NavController) {}\n\n}\n";
}
