"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs = require("fs");
var Constants = require("../util/constants");
var helpers = require("../util/helpers");
var globUtils = require("../util/glob-util");
var util = require("./util");
var GeneratorConstants = require("./constants");
describe('util', function () {
    describe('hydrateRequest', function () {
        it('should take a component request and return a hydrated component request', function () {
            // arrange
            var baseDir = path_1.join(process.cwd(), 'someDir', 'project');
            var componentsDir = path_1.join(baseDir, 'src', 'components');
            var context = {
                componentsDir: componentsDir
            };
            var request = {
                type: Constants.COMPONENT,
                name: 'settings view',
                includeSpec: true,
                includeNgModule: true
            };
            var templateDir = path_1.join(baseDir, 'node_modules', 'ionic-angular', 'templates');
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue(templateDir);
            // act
            var hydratedRequest = util.hydrateRequest(context, request);
            // assert
            expect(hydratedRequest).toEqual({
                className: 'SettingsViewComponent',
                dirToRead: path_1.join(templateDir, 'component'),
                dirToWrite: path_1.join(componentsDir, 'settings-view'),
                fileName: 'settings-view',
                importStatement: 'import { IonicPage, NavController, NavParams } from \'ionic-angular\';',
                includeNgModule: true,
                includeSpec: true,
                ionicPage: '\n@IonicPage()',
                name: 'settings view',
                type: 'component'
            });
            expect(hydratedRequest.type).toEqual(Constants.COMPONENT);
            expect(hydratedRequest.name).toEqual(request.name);
            expect(hydratedRequest.includeNgModule).toBeTruthy();
            expect(hydratedRequest.includeSpec).toBeTruthy();
            expect(hydratedRequest.className).toEqual('SettingsViewComponent');
            expect(hydratedRequest.fileName).toEqual('settings-view');
            expect(hydratedRequest.dirToRead).toEqual(path_1.join(templateDir, Constants.COMPONENT));
            expect(hydratedRequest.dirToWrite).toEqual(path_1.join(componentsDir, hydratedRequest.fileName));
        });
        it('should take a page request and return a hydrated page request', function () {
            // arrange
            var baseDir = path_1.join(process.cwd(), 'someDir', 'project');
            var pagesDir = path_1.join(baseDir, 'src', 'pages');
            var context = {
                pagesDir: pagesDir
            };
            var request = {
                type: Constants.PAGE,
                name: 'settings view',
                includeSpec: true,
                includeNgModule: true
            };
            var templateDir = path_1.join(baseDir, 'node_modules', 'ionic-angular', 'templates');
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue(templateDir);
            // act
            var hydratedRequest = util.hydrateRequest(context, request);
            // assert
            expect(hydratedRequest).toEqual({
                className: 'SettingsViewPage',
                dirToRead: path_1.join(templateDir, 'page'),
                dirToWrite: path_1.join(pagesDir, 'settings-view'),
                fileName: 'settings-view',
                importStatement: 'import { IonicPage, NavController, NavParams } from \'ionic-angular\';',
                includeNgModule: true,
                includeSpec: true,
                ionicPage: '\n@IonicPage()',
                name: 'settings view',
                type: 'page'
            });
            expect(hydratedRequest.type).toEqual(Constants.PAGE);
            expect(hydratedRequest.name).toEqual(request.name);
            expect(hydratedRequest.includeNgModule).toBeTruthy();
            expect(hydratedRequest.includeSpec).toBeTruthy();
            expect(hydratedRequest.className).toEqual('SettingsViewPage');
            expect(hydratedRequest.fileName).toEqual('settings-view');
            expect(hydratedRequest.dirToRead).toEqual(path_1.join(templateDir, Constants.PAGE));
            expect(hydratedRequest.dirToWrite).toEqual(path_1.join(pagesDir, hydratedRequest.fileName));
        });
        it('should take a page with no module request and return a hydrated page request', function () {
            // arrange
            var baseDir = path_1.join(process.cwd(), 'someDir', 'project');
            var pagesDir = path_1.join(baseDir, 'src', 'pages');
            var context = {
                pagesDir: pagesDir
            };
            var includeNgModule = false;
            var request = {
                type: Constants.PAGE,
                name: 'about',
                includeSpec: true,
                includeNgModule: false
            };
            var templateDir = path_1.join(baseDir, 'node_modules', 'ionic-angular', 'templates');
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue(templateDir);
            // act
            var hydratedRequest = util.hydrateRequest(context, request);
            // assert
            expect(hydratedRequest).toEqual({
                className: 'AboutPage',
                dirToRead: path_1.join(templateDir, 'page'),
                dirToWrite: path_1.join(pagesDir, 'about'),
                fileName: 'about',
                importStatement: 'import { NavController, NavParams } from \'ionic-angular\';',
                includeNgModule: false,
                includeSpec: true,
                ionicPage: null,
                name: 'about',
                type: 'page'
            });
            expect(hydratedRequest.ionicPage).toEqual(null);
            expect(hydratedRequest.importStatement).toEqual('import { NavController, NavParams } from \'ionic-angular\';');
            expect(hydratedRequest.type).toEqual(Constants.PAGE);
            expect(hydratedRequest.name).toEqual(request.name);
            expect(hydratedRequest.includeNgModule).toBeFalsy();
            expect(hydratedRequest.includeSpec).toBeTruthy();
            expect(hydratedRequest.className).toEqual('AboutPage');
            expect(hydratedRequest.fileName).toEqual('about');
            expect(hydratedRequest.dirToRead).toEqual(path_1.join(templateDir, Constants.PAGE));
            expect(hydratedRequest.dirToWrite).toEqual(path_1.join(pagesDir, hydratedRequest.fileName));
        });
    });
    describe('hydrateTabRequest', function () {
        it('should take a lazy loaded page set the tab root to a string', function () {
            // arrange
            var baseDir = path_1.join(process.cwd(), 'someDir', 'project');
            var pagesDir = path_1.join(baseDir, 'src', 'pages');
            var templateDir = path_1.join(baseDir, 'node_modules', 'ionic-angular', 'templates');
            var context = { pagesDir: pagesDir };
            var request = {
                type: 'tabs',
                name: 'stooges',
                includeNgModule: true,
                tabs: [
                    {
                        includeNgModule: true,
                        type: 'page',
                        name: 'moe',
                        className: 'MoePage',
                        fileName: 'moe',
                        dirToRead: path_1.join(templateDir, 'page'),
                        dirToWrite: path_1.join(pagesDir, 'moe')
                    }
                ]
            };
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue(templateDir);
            // act
            var hydatedTabRequest = util.hydrateTabRequest(context, request);
            // assert
            expect(hydatedTabRequest.tabVariables).toEqual("  moeRoot = 'MoePage'\n");
        });
        it('should take a page set the tab root to a component ref', function () {
            // arrange
            var baseDir = path_1.join(process.cwd(), 'someDir', 'project');
            var pagesDir = path_1.join(baseDir, 'src', 'pages');
            var templateDir = path_1.join(baseDir, 'node_modules', 'ionic-angular', 'templates');
            var context = { pagesDir: pagesDir };
            var request = {
                type: 'tabs',
                name: 'stooges',
                includeNgModule: false,
                tabs: [
                    {
                        includeNgModule: false,
                        type: 'page',
                        name: 'moe',
                        className: 'MoePage',
                        fileName: 'moe',
                        dirToRead: path_1.join(templateDir, 'page'),
                        dirToWrite: path_1.join(pagesDir, 'moe')
                    }
                ]
            };
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue(templateDir);
            // act
            var hydatedTabRequest = util.hydrateTabRequest(context, request);
            // assert
            expect(hydatedTabRequest.tabVariables).toEqual('  moeRoot = MoePage\n');
        });
    });
    describe('readTemplates', function () {
        it('should get a map of templates and their content back', function () {
            // arrange
            var templateDir = '/Users/noone/project/node_modules/ionic-angular/templates/component';
            var knownValues = [
                'html.tmpl',
                'scss.tmpl',
                'spec.ts.tmpl',
                'ts.tmpl',
                'module.tmpl'
            ];
            var fileContent = 'SomeContent';
            spyOn(fs, 'readdirSync').and.returnValue(knownValues);
            spyOn(helpers, helpers.readFileAsync.name).and.returnValue(Promise.resolve(fileContent));
            // act
            var promise = util.readTemplates(templateDir);
            // assert
            return promise.then(function (map) {
                expect(map.get(path_1.join(templateDir, knownValues[0]))).toEqual(fileContent);
                expect(map.get(path_1.join(templateDir, knownValues[1]))).toEqual(fileContent);
                expect(map.get(path_1.join(templateDir, knownValues[2]))).toEqual(fileContent);
                expect(map.get(path_1.join(templateDir, knownValues[3]))).toEqual(fileContent);
                expect(map.get(path_1.join(templateDir, knownValues[4]))).toEqual(fileContent);
            });
        });
    });
    describe('filterOutTemplates', function () {
        it('should preserve all templates', function () {
            var map = new Map();
            var templateDir = '/Users/noone/project/node_modules/ionic-angular/templates/component';
            var fileContent = 'SomeContent';
            var knownValues = [
                'html.tmpl',
                'scss.tmpl',
                'spec.ts.tmpl',
                'ts.tmpl',
                'module.tmpl'
            ];
            map.set(path_1.join(templateDir, knownValues[0]), fileContent);
            map.set(path_1.join(templateDir, knownValues[1]), fileContent);
            map.set(path_1.join(templateDir, knownValues[2]), fileContent);
            map.set(path_1.join(templateDir, knownValues[3]), fileContent);
            map.set(path_1.join(templateDir, knownValues[4]), fileContent);
            var newMap = util.filterOutTemplates({ includeNgModule: true, includeSpec: true }, map);
            expect(newMap.size).toEqual(knownValues.length);
        });
        it('should remove spec', function () {
            var map = new Map();
            var templateDir = '/Users/noone/project/node_modules/ionic-angular/templates/component';
            var fileContent = 'SomeContent';
            var knownValues = [
                'html.tmpl',
                'scss.tmpl',
                'spec.ts.tmpl',
                'ts.tmpl',
                'module.tmpl'
            ];
            map.set(path_1.join(templateDir, knownValues[0]), fileContent);
            map.set(path_1.join(templateDir, knownValues[1]), fileContent);
            map.set(path_1.join(templateDir, knownValues[2]), fileContent);
            map.set(path_1.join(templateDir, knownValues[3]), fileContent);
            map.set(path_1.join(templateDir, knownValues[4]), fileContent);
            var newMap = util.filterOutTemplates({ includeNgModule: true, includeSpec: false }, map);
            expect(newMap.size).toEqual(4);
            expect(newMap.get(path_1.join(templateDir, knownValues[0]))).toBeTruthy();
            expect(newMap.get(path_1.join(templateDir, knownValues[1]))).toBeTruthy();
            expect(newMap.get(path_1.join(templateDir, knownValues[2]))).toBeFalsy();
            expect(newMap.get(path_1.join(templateDir, knownValues[3]))).toBeTruthy();
            expect(newMap.get(path_1.join(templateDir, knownValues[4]))).toBeTruthy();
        });
        it('should remove spec and module', function () {
            var map = new Map();
            var templateDir = '/Users/noone/project/node_modules/ionic-angular/templates/component';
            var fileContent = 'SomeContent';
            var knownValues = [
                'html.tmpl',
                'scss.tmpl',
                'spec.ts.tmpl',
                'ts.tmpl',
                'module.ts.tmpl'
            ];
            map.set(path_1.join(templateDir, knownValues[0]), fileContent);
            map.set(path_1.join(templateDir, knownValues[1]), fileContent);
            map.set(path_1.join(templateDir, knownValues[2]), fileContent);
            map.set(path_1.join(templateDir, knownValues[3]), fileContent);
            map.set(path_1.join(templateDir, knownValues[4]), fileContent);
            var newMap = util.filterOutTemplates({ includeNgModule: false, includeSpec: false }, map);
            expect(newMap.size).toEqual(3);
            expect(newMap.get(path_1.join(templateDir, knownValues[0]))).toBeTruthy();
            expect(newMap.get(path_1.join(templateDir, knownValues[1]))).toBeTruthy();
            expect(newMap.get(path_1.join(templateDir, knownValues[2]))).toBeFalsy();
            expect(newMap.get(path_1.join(templateDir, knownValues[3]))).toBeTruthy();
            expect(newMap.get(path_1.join(templateDir, knownValues[4]))).toBeFalsy();
        });
    });
    describe('applyTemplates', function () {
        it('should replace the template content', function () {
            var fileOne = '/Users/noone/fileOne';
            var fileOneContent = "\n<!--\n  Generated template for the $CLASSNAME component.\n\n  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html\n  for more info on Angular 2 Components.\n-->\n\n{{text}}\n\n      ";
            var fileTwo = '/Users/noone/fileTwo';
            var fileTwoContent = "\n$FILENAME {\n\n}\n      ";
            var fileThree = '/Users/noone/fileThree';
            var fileThreeContent = "\ndescribe('$CLASSNAME', () => {\n  it('should do something', () => {\n    expect(true).toEqual(true);\n  });\n});\n      ";
            var fileFour = '/Users/noone/fileFour';
            var fileFourContent = "\nimport { Component } from '@angular/core';\n\n/*\n  Generated class for the $CLASSNAME component.\n\n  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html\n  for more info on Angular 2 Components.\n*/\n@Component({\n  selector: '$FILENAME',\n  templateUrl: '$FILENAME.html'\n})\nexport class $CLASSNAMEComponent {\n\n  text: string;\n\n  constructor() {\n    console.log('Hello $CLASSNAME Component');\n    this.text = 'Hello World';\n  }\n\n}\n\n      ";
            var fileFive = '/Users/noone/fileFive';
            var fileFiveContent = "\nimport { NgModule } from '@angular/core';\nimport { $CLASSNAME } from './$FILENAME';\nimport { IonicModule } from 'ionic-angular';\n\n@NgModule({\n  declarations: [\n    $CLASSNAME,\n  ],\n  imports: [\n    IonicModule.forChild($CLASSNAME)\n  ],\n  entryComponents: [\n    $CLASSNAME\n  ],\n  providers: []\n})\nexport class $CLASSNAMEModule {}\n      ";
            var fileSix = '/Users/noone/fileSix';
            var fileSixContent = "\n<!--\n  Generated template for the $CLASSNAME page.\n\n  See http://ionicframework.com/docs/v2/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>$SUPPLIEDNAME</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n\n</ion-content>\n      ";
            var fileSeven = '/Users/noone/fileSeven';
            var fileSevenContent = "\n<ion-tabs>\n$TAB_CONTENT\n</ion-tabs>\n      ";
            var map = new Map();
            map.set(fileOne, fileOneContent);
            map.set(fileTwo, fileTwoContent);
            map.set(fileThree, fileThreeContent);
            map.set(fileFour, fileFourContent);
            map.set(fileFive, fileFiveContent);
            map.set(fileSix, fileSixContent);
            map.set(fileSeven, fileSevenContent);
            var className = 'SettingsView';
            var fileName = 'settings-view';
            var suppliedName = 'settings view';
            var results = util.applyTemplates({ name: suppliedName, className: className, fileName: fileName }, map);
            var modifiedContentOne = results.get(fileOne);
            var modifiedContentTwo = results.get(fileTwo);
            var modifiedContentThree = results.get(fileThree);
            var modifiedContentFour = results.get(fileFour);
            var modifiedContentFive = results.get(fileFive);
            var modifiedContentSix = results.get(fileSix);
            var modifiedContentSeven = results.get(fileSeven);
            var nonExistentVars = [
                GeneratorConstants.CLASSNAME_VARIABLE,
                GeneratorConstants.FILENAME_VARIABLE,
                GeneratorConstants.SUPPLIEDNAME_VARIABLE,
                GeneratorConstants.TAB_CONTENT_VARIABLE,
                GeneratorConstants.TAB_VARIABLES_VARIABLE
            ];
            for (var _i = 0, nonExistentVars_1 = nonExistentVars; _i < nonExistentVars_1.length; _i++) {
                var v = nonExistentVars_1[_i];
                expect(modifiedContentOne.indexOf(v)).toEqual(-1);
                expect(modifiedContentTwo.indexOf(v)).toEqual(-1);
                expect(modifiedContentThree.indexOf(v)).toEqual(-1);
                expect(modifiedContentFour.indexOf(v)).toEqual(-1);
                expect(modifiedContentFive.indexOf(v)).toEqual(-1);
                expect(modifiedContentSix.indexOf(v)).toEqual(-1);
                expect(modifiedContentSeven.indexOf(v)).toEqual(-1);
            }
        });
    });
    describe('writeGeneratedFiles', function () {
        it('should return the list of files generated', function () {
            var map = new Map();
            var templateDir = '/Users/noone/project/node_modules/ionic-angular/templates/component';
            var fileContent = 'SomeContent';
            var knownValues = [
                'html.tmpl',
                'scss.tmpl',
                'spec.ts.tmpl',
                'ts.tmpl',
                'module.tmpl'
            ];
            var fileName = 'settings-view';
            var dirToWrite = path_1.join('/Users/noone/project/src/components', fileName);
            map.set(path_1.join(templateDir, knownValues[0]), fileContent);
            map.set(path_1.join(templateDir, knownValues[1]), fileContent);
            map.set(path_1.join(templateDir, knownValues[2]), fileContent);
            map.set(path_1.join(templateDir, knownValues[3]), fileContent);
            map.set(path_1.join(templateDir, knownValues[4]), fileContent);
            spyOn(helpers, helpers.mkDirpAsync.name).and.returnValue(Promise.resolve());
            spyOn(helpers, helpers.writeFileAsync.name).and.returnValue(Promise.resolve());
            var promise = util.writeGeneratedFiles({ dirToWrite: dirToWrite, fileName: fileName }, map);
            return promise.then(function (filesCreated) {
                var fileExtensions = knownValues.map(function (knownValue) {
                    return path_1.basename(knownValue, GeneratorConstants.KNOWN_FILE_EXTENSION);
                });
                expect(filesCreated[0]).toEqual(path_1.join(dirToWrite, fileName + "." + fileExtensions[0]));
                expect(filesCreated[1]).toEqual(path_1.join(dirToWrite, fileName + "." + fileExtensions[1]));
                expect(filesCreated[2]).toEqual(path_1.join(dirToWrite, fileName + "." + fileExtensions[2]));
                expect(filesCreated[3]).toEqual(path_1.join(dirToWrite, fileName + "." + fileExtensions[3]));
                expect(filesCreated[4]).toEqual(path_1.join(dirToWrite, fileName + "." + fileExtensions[4]));
            });
        });
    });
    describe('getDirToWriteToByType', function () {
        var context;
        var componentsDir = '/path/to/components';
        var directivesDir = '/path/to/directives';
        var pagesDir = '/path/to/pages';
        var pipesDir = '/path/to/pipes';
        var providersDir = '/path/to/providers';
        beforeEach(function () {
            context = {
                componentsDir: componentsDir,
                directivesDir: directivesDir,
                pagesDir: pagesDir,
                pipesDir: pipesDir,
                providersDir: providersDir
            };
        });
        it('should return the appropriate components directory', function () {
            expect(util.getDirToWriteToByType(context, 'component')).toEqual(componentsDir);
        });
        it('should return the appropriate directives directory', function () {
            expect(util.getDirToWriteToByType(context, 'directive')).toEqual(directivesDir);
        });
        it('should return the appropriate pages directory', function () {
            expect(util.getDirToWriteToByType(context, 'page')).toEqual(pagesDir);
        });
        it('should return the appropriate pipes directory', function () {
            expect(util.getDirToWriteToByType(context, 'pipe')).toEqual(pipesDir);
        });
        it('should return the appropriate providers directory', function () {
            expect(util.getDirToWriteToByType(context, 'provider')).toEqual(providersDir);
        });
        it('should throw error upon unknown generator type', function () {
            expect(function () { return util.getDirToWriteToByType(context, 'dan'); }).toThrowError('Unknown Generator Type: dan');
        });
    });
    describe('getNgModules', function () {
        var context;
        var componentsDir = path_1.join(process.cwd(), 'path', 'to', 'components');
        var directivesDir = path_1.join(process.cwd(), 'path', 'to', 'directives');
        var pagesDir = path_1.join(process.cwd(), 'path', 'to', 'pages');
        var pipesDir = path_1.join(process.cwd(), 'path', 'to', 'pipes');
        var providersDir = path_1.join(process.cwd(), 'path', 'to', 'providers');
        beforeEach(function () {
            context = {
                componentsDir: componentsDir,
                directivesDir: directivesDir,
                pagesDir: pagesDir,
                pipesDir: pipesDir,
                providersDir: providersDir
            };
        });
        it('should return an empty list of glob results', function () {
            var globAllSpy = spyOn(globUtils, globUtils.globAll.name);
            util.getNgModules(context, []);
            expect(globAllSpy).toHaveBeenCalledWith([]);
        });
        it('should return a list of glob results for components', function () {
            var globAllSpy = spyOn(globUtils, globUtils.globAll.name);
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue('.module.ts');
            util.getNgModules(context, ['component']);
            expect(globAllSpy).toHaveBeenCalledWith([
                path_1.join(componentsDir, '**', '*.module.ts')
            ]);
        });
        it('should return a list of glob results for pages and components', function () {
            var globAllSpy = spyOn(globUtils, globUtils.globAll.name);
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue('.module.ts');
            util.getNgModules(context, ['page', 'component']);
            expect(globAllSpy).toHaveBeenCalledWith([
                path_1.join(pagesDir, '**', '*.module.ts'),
                path_1.join(componentsDir, '**', '*.module.ts')
            ]);
        });
    });
});
