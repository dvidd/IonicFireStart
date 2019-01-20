"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var ts = require("typescript");
var util = require("./util");
var Constants = require("../util/constants");
var file_cache_1 = require("../util/file-cache");
var helpers = require("../util/helpers");
var tsUtils = require("../util/typescript-utils");
describe('util', function () {
    describe('filterTypescriptFilesForDeepLinks', function () {
        it('should return a list of files that are in the directory specified for deeplinking', function () {
            var pagesDir = path_1.join(process.cwd(), 'myApp', 'src', 'pages');
            var knownFileContent = 'Some string';
            var pageOneTs = path_1.join(pagesDir, 'page-one', 'page-one.ts');
            var pageOneHtml = path_1.join(pagesDir, 'page-one', 'page-one.html');
            var pageOneModule = path_1.join(pagesDir, 'page-one', 'page-one.module.ts');
            var pageTwoTs = path_1.join(pagesDir, 'page-two', 'page-two.ts');
            var pageTwoHtml = path_1.join(pagesDir, 'page-two', 'page-two.html');
            var pageTwoModule = path_1.join(pagesDir, 'page-two', 'page-two.module.ts');
            var pageThreeTs = path_1.join(pagesDir, 'page-three', 'page-three.ts');
            var pageThreeHtml = path_1.join(pagesDir, 'page-three', 'page-three.html');
            var pageThreeModule = path_1.join(pagesDir, 'page-three', 'page-three.module.ts');
            var someOtherFile = path_1.join('Users', 'hans-gruber', 'test.ts');
            var fileCache = new file_cache_1.FileCache();
            fileCache.set(pageOneTs, { path: pageOneTs, content: knownFileContent });
            fileCache.set(pageOneHtml, { path: pageOneHtml, content: knownFileContent });
            fileCache.set(pageOneModule, { path: pageOneModule, content: knownFileContent });
            fileCache.set(pageTwoTs, { path: pageTwoTs, content: knownFileContent });
            fileCache.set(pageTwoHtml, { path: pageTwoHtml, content: knownFileContent });
            fileCache.set(pageTwoModule, { path: pageTwoModule, content: knownFileContent });
            fileCache.set(pageThreeTs, { path: pageThreeTs, content: knownFileContent });
            fileCache.set(pageThreeHtml, { path: pageThreeHtml, content: knownFileContent });
            fileCache.set(pageThreeModule, { path: pageThreeModule, content: knownFileContent });
            fileCache.set(someOtherFile, { path: someOtherFile, content: knownFileContent });
            spyOn(helpers, helpers.getStringPropertyValue.name).and.callFake(function (input) {
                if (input === Constants.ENV_VAR_DEEPLINKS_DIR) {
                    return pagesDir;
                }
                return '.module.ts';
            });
            var results = util.filterTypescriptFilesForDeepLinks(fileCache);
            expect(results.length).toEqual(3);
            expect(results[0].path).toEqual(pageOneTs);
            expect(results[1].path).toEqual(pageTwoTs);
            expect(results[2].path).toEqual(pageThreeTs);
        });
    });
    describe('parseDeepLinkDecorator', function () {
        it('should return the decorator content from fully hydrated decorator', function () {
            var knownContent = "\nimport { Component } from '@angular/core';\n\nimport { IonicPage, NavController } from 'ionic-angular';\n\n@IonicPage({\n  name: 'someName',\n  segment: 'someSegmentBro',\n  defaultHistory: ['page-one', 'page-two'],\n  priority: 'high'\n})\n@Component({\n  selector: 'page-home',\n  template: `\n  <ion-header>\n    <ion-navbar>\n      <ion-title>\n        Ionic Blank\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n\n  <ion-content padding>\n    The world is your oyster.\n    <p>\n      If you get lost, the <a href=\"http://ionicframework.com/docs/v2\">docs</a> will be your guide.\n    </p>\n    <button ion-button (click)=\"nextPage()\">Next Page</button>\n  </ion-content>\n  `\n})\nexport class HomePage {\n\n  constructor(public navCtrl: NavController) {\n  }\n\n  nextPage() {\n    this.navCtrl.push('PageOne');\n    console.log()\n  }\n}\n\n      ";
            var knownPath = path_1.join(process.cwd(), 'some', 'fake', 'path');
            var sourceFile = tsUtils.getTypescriptSourceFile(knownPath, knownContent);
            var result = util.getDeepLinkDecoratorContentForSourceFile(sourceFile);
            expect(result.name).toEqual('someName');
            expect(result.segment).toEqual('someSegmentBro');
            expect(result.defaultHistory[0]).toEqual('page-one');
            expect(result.defaultHistory[1]).toEqual('page-two');
            expect(result.priority).toEqual('high');
            expect(knownContent.indexOf(result.rawString)).toBeGreaterThan(-1);
        });
        it('should default to using class name when name is missing', function () {
            var knownContent = "\nimport { Component } from '@angular/core';\n\nimport { IonicPage, NavController } from 'ionic-angular';\n\n@IonicPage({\n  segment: 'someSegmentBro',\n  defaultHistory: ['page-one', 'page-two'],\n  priority: 'high'\n})\n@Component({\n  selector: 'page-home',\n  template: `\n  <ion-header>\n    <ion-navbar>\n      <ion-title>\n        Ionic Blank\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n\n  <ion-content padding>\n    The world is your oyster.\n    <p>\n      If you get lost, the <a href=\"http://ionicframework.com/docs/v2\">docs</a> will be your guide.\n    </p>\n    <button ion-button (click)=\"nextPage()\">Next Page</button>\n  </ion-content>\n  `\n})\nexport class HomePage {\n\n  constructor(public navCtrl: NavController) {\n  }\n\n  nextPage() {\n    this.navCtrl.push('PageOne');\n    console.log()\n  }\n}\n\n      ";
            var knownPath = path_1.join(process.cwd(), 'some', 'fake', 'path');
            var sourceFile = tsUtils.getTypescriptSourceFile(knownPath, knownContent);
            var result = util.getDeepLinkDecoratorContentForSourceFile(sourceFile);
            expect(result.name).toEqual('HomePage');
            expect(result.segment).toEqual('someSegmentBro');
            expect(result.defaultHistory[0]).toEqual('page-one');
            expect(result.defaultHistory[1]).toEqual('page-two');
            expect(result.priority).toEqual('high');
            expect(knownContent.indexOf(result.rawString)).toBeGreaterThan(-1);
        });
        it('should return null segment when not in decorator', function () {
            var knownContent = "\nimport { Component } from '@angular/core';\n\nimport { IonicPage, NavController } from 'ionic-angular';\n\n@IonicPage({\n  defaultHistory: ['page-one', 'page-two'],\n  priority: 'high'\n})\n@Component({\n  selector: 'page-home',\n  template: `\n  <ion-header>\n    <ion-navbar>\n      <ion-title>\n        Ionic Blank\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n\n  <ion-content padding>\n    The world is your oyster.\n    <p>\n      If you get lost, the <a href=\"http://ionicframework.com/docs/v2\">docs</a> will be your guide.\n    </p>\n    <button ion-button (click)=\"nextPage()\">Next Page</button>\n  </ion-content>\n  `\n})\nexport class HomePage {\n\n  constructor(public navCtrl: NavController) {\n  }\n\n  nextPage() {\n    this.navCtrl.push('PageOne');\n    console.log()\n  }\n}\n\n      ";
            var knownPath = path_1.join(process.cwd(), 'some', 'fake', 'path');
            var sourceFile = tsUtils.getTypescriptSourceFile(knownPath, knownContent);
            var result = util.getDeepLinkDecoratorContentForSourceFile(sourceFile);
            expect(result.name).toEqual('HomePage');
            expect(result.segment).toEqual('path');
            expect(result.defaultHistory[0]).toEqual('page-one');
            expect(result.defaultHistory[1]).toEqual('page-two');
            expect(result.priority).toEqual('high');
            expect(knownContent.indexOf(result.rawString)).toBeGreaterThan(-1);
        });
        it('should return empty array for defaultHistory when not in decorator', function () {
            var knownContent = "\nimport { Component } from '@angular/core';\n\nimport { IonicPage, NavController } from 'ionic-angular';\n\n@IonicPage({\n  priority: 'high'\n})\n@Component({\n  selector: 'page-home',\n  template: `\n  <ion-header>\n    <ion-navbar>\n      <ion-title>\n        Ionic Blank\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n\n  <ion-content padding>\n    The world is your oyster.\n    <p>\n      If you get lost, the <a href=\"http://ionicframework.com/docs/v2\">docs</a> will be your guide.\n    </p>\n    <button ion-button (click)=\"nextPage()\">Next Page</button>\n  </ion-content>\n  `\n})\nexport class HomePage {\n\n  constructor(public navCtrl: NavController) {\n  }\n\n  nextPage() {\n    this.navCtrl.push('PageOne');\n    console.log()\n  }\n}\n\n      ";
            var knownPath = path_1.join(process.cwd(), 'myApp', 'src', 'pages', 'about.ts');
            var sourceFile = tsUtils.getTypescriptSourceFile(knownPath, knownContent);
            var result = util.getDeepLinkDecoratorContentForSourceFile(sourceFile);
            expect(result.name).toEqual('HomePage');
            expect(result.segment).toEqual('about');
            expect(result.defaultHistory).toBeTruthy();
            expect(result.defaultHistory.length).toEqual(0);
            expect(result.priority).toEqual('high');
            expect(knownContent.indexOf(result.rawString)).toBeGreaterThan(-1);
        });
        it('should return priority of low when not in decorator', function () {
            var knownContent = "\nimport { Component } from '@angular/core';\n\nimport { IonicPage, NavController } from 'ionic-angular';\n\n@IonicPage({\n})\n@Component({\n  selector: 'page-home',\n  template: `\n  <ion-header>\n    <ion-navbar>\n      <ion-title>\n        Ionic Blank\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n\n  <ion-content padding>\n    The world is your oyster.\n    <p>\n      If you get lost, the <a href=\"http://ionicframework.com/docs/v2\">docs</a> will be your guide.\n    </p>\n    <button ion-button (click)=\"nextPage()\">Next Page</button>\n  </ion-content>\n  `\n})\nexport class HomePage {\n\n  constructor(public navCtrl: NavController) {\n  }\n\n  nextPage() {\n    this.navCtrl.push('PageOne');\n    console.log()\n  }\n}\n\n      ";
            var knownPath = path_1.join(process.cwd(), 'some', 'fake', 'path');
            var sourceFile = tsUtils.getTypescriptSourceFile(knownPath, knownContent);
            var result = util.getDeepLinkDecoratorContentForSourceFile(sourceFile);
            expect(result.name).toEqual('HomePage');
            expect(result.segment).toEqual('path');
            expect(result.defaultHistory).toBeTruthy();
            expect(result.defaultHistory.length).toEqual(0);
            expect(result.priority).toEqual('low');
            expect(knownContent.indexOf(result.rawString)).toBeGreaterThan(-1);
        });
        it('should return correct defaults when no param passed to decorator', function () {
            var knownContent = "\nimport { Component } from '@angular/core';\n\nimport { IonicPage, NavController } from 'ionic-angular';\n\n@IonicPage()\n@Component({\n  selector: 'page-home',\n  template: `\n  <ion-header>\n    <ion-navbar>\n      <ion-title>\n        Ionic Blank\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n\n  <ion-content padding>\n    The world is your oyster.\n    <p>\n      If you get lost, the <a href=\"http://ionicframework.com/docs/v2\">docs</a> will be your guide.\n    </p>\n    <button ion-button (click)=\"nextPage()\">Next Page</button>\n  </ion-content>\n  `\n})\nexport class HomePage {\n\n  constructor(public navCtrl: NavController) {\n  }\n\n  nextPage() {\n    this.navCtrl.push('PageOne');\n    console.log()\n  }\n}\n\n      ";
            var knownPath = path_1.join(process.cwd(), 'some', 'fake', 'path.ts');
            var sourceFile = tsUtils.getTypescriptSourceFile(knownPath, knownContent);
            var result = util.getDeepLinkDecoratorContentForSourceFile(sourceFile);
            expect(result.name).toEqual('HomePage');
            expect(result.segment).toEqual('path');
            expect(result.defaultHistory).toBeTruthy();
            expect(result.defaultHistory.length).toEqual(0);
            expect(result.priority).toEqual('low');
            expect(knownContent.indexOf(result.rawString)).toBeGreaterThan(-1);
        });
        it('should throw an error when multiple deeplink decorators are found', function () {
            var knownContent = "\nimport { Component } from '@angular/core';\n\nimport { IonicPage, NavController } from 'ionic-angular';\n\n@IonicPage({\n})\n@IonicPage({\n})\n@Component({\n  selector: 'page-home',\n  template: `\n  <ion-header>\n    <ion-navbar>\n      <ion-title>\n        Ionic Blank\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n\n  <ion-content padding>\n    The world is your oyster.\n    <p>\n      If you get lost, the <a href=\"http://ionicframework.com/docs/v2\">docs</a> will be your guide.\n    </p>\n    <button ion-button (click)=\"nextPage()\">Next Page</button>\n  </ion-content>\n  `\n})\nexport class HomePage {\n\n  constructor(public navCtrl: NavController) {\n  }\n\n  nextPage() {\n    this.navCtrl.push('PageOne');\n    console.log()\n  }\n}\n\n      ";
            var knownPath = path_1.join(process.cwd(), 'some', 'fake', 'path');
            var sourceFile = tsUtils.getTypescriptSourceFile(knownPath, knownContent);
            var knownErrorMsg = 'Should never get here';
            try {
                util.getDeepLinkDecoratorContentForSourceFile(sourceFile);
                throw new Error(knownErrorMsg);
            }
            catch (ex) {
                expect(ex.message).not.toEqual(knownErrorMsg);
            }
        });
        it('should return null when no deeplink decorator is found', function () {
            var knownContent = "\nimport { Component } from '@angular/core';\n\nimport { IonicPage, NavController } from 'ionic-angular';\n\n@Component({\n  selector: 'page-home',\n  template: `\n  <ion-header>\n    <ion-navbar>\n      <ion-title>\n        Ionic Blank\n      </ion-title>\n    </ion-navbar>\n  </ion-header>\n\n  <ion-content padding>\n    The world is your oyster.\n    <p>\n      If you get lost, the <a href=\"http://ionicframework.com/docs/v2\">docs</a> will be your guide.\n    </p>\n    <button ion-button (click)=\"nextPage()\">Next Page</button>\n  </ion-content>\n  `\n})\nexport class HomePage {\n\n  constructor(public navCtrl: NavController) {\n  }\n\n  nextPage() {\n    this.navCtrl.push('PageOne');\n    console.log()\n  }\n}\n\n      ";
            var knownPath = path_1.join(process.cwd(), 'some', 'fake', 'path');
            var sourceFile = tsUtils.getTypescriptSourceFile(knownPath, knownContent);
            var result = util.getDeepLinkDecoratorContentForSourceFile(sourceFile);
            expect(result).toEqual(null);
        });
        it('should return null when there isn\'t a class declaration', function () {
            var knownContent = "\nimport {\n  CallExpression,\n  createSourceFile,\n  Identifier,\n  ImportClause,\n  ImportDeclaration,\n  ImportSpecifier,\n  NamedImports,\n  Node,\n  ScriptTarget,\n  SourceFile,\n  StringLiteral,\n  SyntaxKind\n} from 'typescript';\n\nimport { rangeReplace, stringSplice } from './helpers';\n\nexport function getTypescriptSourceFile(filePath: string, fileContent: string, languageVersion: ScriptTarget = ScriptTarget.Latest, setParentNodes: boolean = false): SourceFile {\n  return createSourceFile(filePath, fileContent, languageVersion, setParentNodes);\n}\n\nexport function removeDecorators(fileName: string, source: string): string {\n  const sourceFile = createSourceFile(fileName, source, ScriptTarget.Latest);\n  const decorators = findNodes(sourceFile, sourceFile, SyntaxKind.Decorator, true);\n  decorators.sort((a, b) => b.pos - a.pos);\n  decorators.forEach(d => {\n    source = source.slice(0, d.pos) + source.slice(d.end);\n  });\n\n  return source;\n}\n\n      ";
            var knownPath = path_1.join(process.cwd(), 'some', 'fake', 'path');
            var sourceFile = tsUtils.getTypescriptSourceFile(knownPath, knownContent);
            var result = util.getDeepLinkDecoratorContentForSourceFile(sourceFile);
            expect(result).toEqual(null);
        });
    });
    describe('getNgModuleDataFromCorrespondingPage', function () {
        it('should call the file cache with the path to an ngmodule', function () {
            var basePath = path_1.join(process.cwd(), 'some', 'fake', 'path');
            var pagePath = path_1.join(basePath, 'my-page', 'my-page.ts');
            var ngModulePath = path_1.join(basePath, 'my-page', 'my-page.module.ts');
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue('.module.ts');
            var result = util.getNgModulePathFromCorrespondingPage(pagePath);
            expect(result).toEqual(ngModulePath);
        });
    });
    describe('getRelativePathToPageNgModuleFromAppNgModule', function () {
        it('should return the relative path', function () {
            var prefix = path_1.join(process.cwd(), 'myApp', 'src');
            var appNgModulePath = path_1.join(prefix, 'app', 'app.module.ts');
            var pageNgModulePath = path_1.join(prefix, 'pages', 'page-one', 'page-one.module.ts');
            var result = util.getRelativePathToPageNgModuleFromAppNgModule(appNgModulePath, pageNgModulePath);
            expect(result).toEqual(path_1.join('..', 'pages', 'page-one', 'page-one.module.ts'));
        });
    });
    describe('getNgModuleDataFromPage', function () {
        it('should throw when NgModule is not in cache and create default ngModule flag is off', function () {
            var prefix = path_1.join(process.cwd(), 'myApp', 'src');
            var appNgModulePath = path_1.join(prefix, 'app', 'app.module.ts');
            var pagePath = path_1.join(prefix, 'pages', 'page-one', 'page-one.ts');
            var knownClassName = 'PageOne';
            var fileCache = new file_cache_1.FileCache();
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue('.module.ts');
            var knownErrorMsg = 'Should never happen';
            try {
                util.getNgModuleDataFromPage(appNgModulePath, pagePath, knownClassName, fileCache, false);
                throw new Error(knownErrorMsg);
            }
            catch (ex) {
                expect(ex.message).not.toEqual(knownErrorMsg);
            }
        });
        it('should return non-aot adjusted paths when not in AoT', function () {
            var pageNgModuleContent = "\nimport { NgModule } from '@angular/core';\nimport { IonicPageModule } from 'ionic-angular';\n\nimport { HomePage } from './home';\n\n@NgModule({\n  declarations: [\n    HomePage,\n  ],\n  imports: [\n    IonicPageModule.forChild(HomePage),\n  ]\n})\nexport class HomePageModule {}\n      ";
            var prefix = path_1.join(process.cwd(), 'myApp', 'src');
            var appNgModulePath = path_1.join(prefix, 'app', 'app.module.ts');
            var pageNgModulePath = path_1.join(prefix, 'pages', 'page-one', 'page-one.module.ts');
            var pagePath = path_1.join(prefix, 'pages', 'page-one', 'page-one.ts');
            var knownClassName = 'PageOne';
            var fileCache = new file_cache_1.FileCache();
            fileCache.set(pageNgModulePath, { path: pageNgModulePath, content: pageNgModuleContent });
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue('.module.ts');
            var result = util.getNgModuleDataFromPage(appNgModulePath, pagePath, knownClassName, fileCache, false);
            expect(result.absolutePath).toEqual(pageNgModulePath);
            expect(result.userlandModulePath).toEqual('../pages/page-one/page-one.module');
            expect(result.className).toEqual('HomePageModule');
        });
        it('should return adjusted paths to account for AoT', function () {
            var pageNgModuleContent = "\nimport { NgModule } from '@angular/core';\nimport { IonicPageModule } from 'ionic-angular';\n\nimport { HomePage } from './home';\n\n@NgModule({\n  declarations: [\n    HomePage,\n  ],\n  imports: [\n    IonicPageModule.forChild(HomePage),\n  ]\n})\nexport class HomePageModule {}\n      ";
            var prefix = path_1.join(process.cwd(), 'myApp', 'src');
            var appNgModulePath = path_1.join(prefix, 'app', 'app.module.ts');
            var pageNgModulePath = path_1.join(prefix, 'pages', 'page-one', 'page-one.module.ts');
            var pagePath = path_1.join(prefix, 'pages', 'page-one', 'page-one.ts');
            var knownClassName = 'PageOne';
            var fileCache = new file_cache_1.FileCache();
            fileCache.set(pageNgModulePath, { path: pageNgModulePath, content: pageNgModuleContent });
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue('.module.ts');
            var result = util.getNgModuleDataFromPage(appNgModulePath, pagePath, knownClassName, fileCache, true);
            expect(result.absolutePath).toEqual(helpers.changeExtension(pageNgModulePath, '.ngfactory.js'));
            expect(result.userlandModulePath).toEqual('../pages/page-one/page-one.module.ngfactory');
            expect(result.className).toEqual('HomePageModuleNgFactory');
        });
    });
    describe('getDeepLinkData', function () {
        it('should return an empty list when no deep link decorators are found', function () {
            var pageOneContent = "\nimport { Component } from '@angular/core';\nimport { IonicPage, NavController } from 'ionic-angular';\n\n\n@Component({\n  selector: 'page-page-one',\n  templateUrl: './page-one.html'\n})\nexport class PageOne {\n\n  constructor(public navCtrl: NavController) {}\n\n  ionViewDidLoad() {\n  }\n\n  nextPage() {\n    this.navCtrl.push('PageTwo');\n  }\n\n  previousPage() {\n    this.navCtrl.pop();\n  }\n\n}\n      ";
            var pageOneNgModuleContent = "\nimport { NgModule } from '@angular/core';\nimport { PageOne } from './page-one';\nimport { IonicPageModule } from 'ionic-angular';\n\n@NgModule({\n  declarations: [\n    PageOne,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageOne)\n  ],\n  entryComponents: [\n    PageOne\n  ]\n})\nexport class PageOneModule {}\n\n      ";
            var pageTwoContent = "\nimport { Component } from '@angular/core';\nimport { LoadingController, ModalController, NavController, PopoverController } from 'ionic-angular';\n\n\n@Component({\n  selector: 'page-page-two',\n  templateUrl: './page-two.html'\n})\nexport class PageTwo {\n\n  constructor(public loadingController: LoadingController, public modalController: ModalController, public navCtrl: NavController, public popoverCtrl: PopoverController) {}\n\n  ionViewDidLoad() {\n  }\n\n  goBack() {\n    this.navCtrl.pop();\n  }\n\n  showLoader() {\n    const viewController = this.loadingController.create({\n      duration: 2000\n    });\n\n    viewController.present();\n  }\n\n  openModal() {\n    /*const viewController = this.modalController.create('PageThree');\n    viewController.present();\n    */\n\n    const viewController = this.popoverCtrl.create('PageThree');\n    viewController.present();\n\n\n    //this.navCtrl.push('PageThree');\n  }\n}\n\n      ";
            var pageTwoNgModuleContent = "\nimport { NgModule } from '@angular/core';\nimport { PageTwo } from './page-two';\nimport { IonicPageModule } from 'ionic-angular';\n\n@NgModule({\n  declarations: [\n    PageTwo,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageTwo)\n  ]\n})\nexport class PageTwoModule {\n\n}\n      ";
            var pageSettingsContent = "\nimport { Component } from '@angular/core';\nimport { IonicPage, NavController } from 'ionic-angular';\n\n/*\n  Generated class for the PageTwo page.\n\n  See http://ionicframework.com/docs/v2/components/#navigation for more info on\n  Ionic pages and navigation.\n*/\n@Component({\n  selector: 'page-three',\n  templateUrl: './page-three.html'\n})\nexport class PageThree {\n\n  constructor(public navCtrl: NavController) {}\n\n  ionViewDidLoad() {\n  }\n\n  goBack() {\n    this.navCtrl.pop();\n  }\n\n}\n\n      ";
            var pageSettingsNgModuleContent = "\nimport { NgModule } from '@angular/core';\nimport { PageThree } from './page-three';\nimport { IonicPageModule } from 'ionic-angular';\n\n@NgModule({\n  declarations: [\n    PageThree,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageThree)\n  ]\n})\nexport class PageThreeModule {\n\n}\n\n      ";
            var prefix = path_1.join(process.cwd(), 'myApp', 'src');
            var appNgModulePath = path_1.join(prefix, 'app', 'app.module.ts');
            var pageOneNgModulePath = path_1.join(prefix, 'pages', 'page-one', 'page-one.module.ts');
            var pageOnePath = path_1.join(prefix, 'pages', 'page-one', 'page-one.ts');
            var pageTwoNgModulePath = path_1.join(prefix, 'pages', 'page-two', 'page-two.module.ts');
            var pageTwoPath = path_1.join(prefix, 'pages', 'page-two', 'page-two.ts');
            var pageSettingsNgModulePath = path_1.join(prefix, 'pages', 'settings-page', 'settings-page.module.ts');
            var pageSettingsPath = path_1.join(prefix, 'pages', 'settings-page', 'settings-page.ts');
            var fileCache = new file_cache_1.FileCache();
            fileCache.set(pageOnePath, { path: pageOnePath, content: pageOneContent });
            fileCache.set(pageOneNgModulePath, { path: pageOneNgModulePath, content: pageOneNgModuleContent });
            fileCache.set(pageTwoPath, { path: pageTwoPath, content: pageTwoContent });
            fileCache.set(pageTwoNgModulePath, { path: pageTwoNgModulePath, content: pageTwoNgModuleContent });
            fileCache.set(pageTwoPath, { path: pageTwoPath, content: pageTwoContent });
            fileCache.set(pageTwoNgModulePath, { path: pageTwoNgModulePath, content: pageTwoNgModuleContent });
            fileCache.set(pageSettingsPath, { path: pageSettingsPath, content: pageSettingsContent });
            fileCache.set(pageSettingsNgModulePath, { path: pageSettingsNgModulePath, content: pageSettingsNgModuleContent });
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue('.module.ts');
            var map = util.getDeepLinkData(appNgModulePath, fileCache, false);
            expect(map.size).toEqual(0);
        });
        it('should return an a list of deeplink configs from all pages that have them, and not include pages that dont', function () {
            var pageOneContent = "\nimport { Component } from '@angular/core';\nimport { IonicPage, NavController } from 'ionic-angular';\n\n\n@IonicPage({\n  name: 'SomeOtherName'\n})\n@Component({\n  selector: 'page-page-one',\n  templateUrl: './page-one.html'\n})\nexport class PageOne {\n\n  constructor(public navCtrl: NavController) {}\n\n  ionViewDidLoad() {\n  }\n\n  nextPage() {\n    this.navCtrl.push('PageTwo');\n  }\n\n  previousPage() {\n    this.navCtrl.pop();\n  }\n\n}\n      ";
            var pageOneNgModuleContent = "\nimport { NgModule } from '@angular/core';\nimport { PageOne } from './page-one';\nimport { IonicPageModule } from 'ionic-angular';\n\n@NgModule({\n  declarations: [\n    PageOne,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageOne)\n  ],\n  entryComponents: [\n    PageOne\n  ]\n})\nexport class PageOneModule {}\n\n      ";
            var pageTwoContent = "\nimport { Component } from '@angular/core';\nimport { LoadingController, ModalController, NavController, PopoverController } from 'ionic-angular';\n\n\n@Component({\n  selector: 'page-page-two',\n  templateUrl: './page-two.html'\n})\nexport class PageTwo {\n\n  constructor(public loadingController: LoadingController, public modalController: ModalController, public navCtrl: NavController, public popoverCtrl: PopoverController) {}\n\n  ionViewDidLoad() {\n  }\n\n  goBack() {\n    this.navCtrl.pop();\n  }\n\n  showLoader() {\n    const viewController = this.loadingController.create({\n      duration: 2000\n    });\n\n    viewController.present();\n  }\n\n  openModal() {\n    /*const viewController = this.modalController.create('PageThree');\n    viewController.present();\n    */\n\n    const viewController = this.popoverCtrl.create('PageThree');\n    viewController.present();\n\n\n    //this.navCtrl.push('PageThree');\n  }\n}\n\n      ";
            var pageTwoNgModuleContent = "\nimport { NgModule } from '@angular/core';\nimport { PageTwo } from './page-two';\nimport { IonicPageModule } from 'ionic-angular';\n\n@NgModule({\n  declarations: [\n    PageTwo,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageTwo)\n  ]\n})\nexport class PageTwoModule {\n\n}\n      ";
            var pageSettingsContent = "\nimport { Component } from '@angular/core';\nimport { IonicPage, NavController } from 'ionic-angular';\n\n@IonicPage({\n  segment: 'someSegmentBro',\n  defaultHistory: ['page-one', 'page-two'],\n  priority: 'high'\n})\n@Component({\n  selector: 'page-three',\n  templateUrl: './page-three.html'\n})\nexport class PageThree {\n\n  constructor(public navCtrl: NavController) {}\n\n  ionViewDidLoad() {\n  }\n\n  goBack() {\n    this.navCtrl.pop();\n  }\n\n}\n\n      ";
            var pageSettingsNgModuleContent = "\nimport { NgModule } from '@angular/core';\nimport { PageThree } from './page-three';\nimport { IonicPageModule } from 'ionic-angular';\n\n@NgModule({\n  declarations: [\n    PageThree,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageThree)\n  ]\n})\nexport class PageThreeModule {\n\n}\n\n      ";
            var srcDir = path_1.join(process.cwd(), 'myApp', 'src');
            var appNgModulePath = path_1.join(srcDir, 'app', 'app.module.ts');
            var pageOneNgModulePath = path_1.join(srcDir, 'pages', 'page-one', 'page-one.module.ts');
            var pageOnePath = path_1.join(srcDir, 'pages', 'page-one', 'page-one.ts');
            var pageTwoNgModulePath = path_1.join(srcDir, 'pages', 'page-two', 'page-two.module.ts');
            var pageTwoPath = path_1.join(srcDir, 'pages', 'page-two', 'page-two.ts');
            var pageSettingsNgModulePath = path_1.join(srcDir, 'pages', 'settings-page', 'settings-page.module.ts');
            var pageSettingsPath = path_1.join(srcDir, 'pages', 'settings-page', 'settings-page.ts');
            var fileCache = new file_cache_1.FileCache();
            fileCache.set(pageOnePath, { path: pageOnePath, content: pageOneContent });
            fileCache.set(pageOneNgModulePath, { path: pageOneNgModulePath, content: pageOneNgModuleContent });
            fileCache.set(pageTwoPath, { path: pageTwoPath, content: pageTwoContent });
            fileCache.set(pageTwoNgModulePath, { path: pageTwoNgModulePath, content: pageTwoNgModuleContent });
            fileCache.set(pageTwoPath, { path: pageTwoPath, content: pageTwoContent });
            fileCache.set(pageTwoNgModulePath, { path: pageTwoNgModulePath, content: pageTwoNgModuleContent });
            fileCache.set(pageSettingsPath, { path: pageSettingsPath, content: pageSettingsContent });
            fileCache.set(pageSettingsNgModulePath, { path: pageSettingsNgModulePath, content: pageSettingsNgModuleContent });
            spyOn(helpers, helpers.getStringPropertyValue.name).and.callFake(function (input) {
                if (input === Constants.ENV_VAR_DEEPLINKS_DIR) {
                    return srcDir;
                }
                else {
                    return '.module.ts';
                }
            });
            var map = util.getDeepLinkData(appNgModulePath, fileCache, false);
            expect(map.size).toEqual(2);
        });
        it('should return an a list of deeplink configs from all pages that have them', function () {
            var pageOneContent = "\nimport { Component } from '@angular/core';\nimport { IonicPage, NavController } from 'ionic-angular';\n\n\n@IonicPage({\n  name: 'SomeOtherName'\n})\n@Component({\n  selector: 'page-page-one',\n  templateUrl: './page-one.html'\n})\nexport class PageOne {\n\n  constructor(public navCtrl: NavController) {}\n\n  ionViewDidLoad() {\n  }\n\n  nextPage() {\n    this.navCtrl.push('PageTwo');\n  }\n\n  previousPage() {\n    this.navCtrl.pop();\n  }\n\n}\n      ";
            var pageOneNgModuleContent = "\nimport { NgModule } from '@angular/core';\nimport { PageOne } from './page-one';\nimport { IonicPageModule } from 'ionic-angular';\n\n@NgModule({\n  declarations: [\n    PageOne,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageOne)\n  ],\n  entryComponents: [\n    PageOne\n  ]\n})\nexport class PageOneModule {}\n\n      ";
            var pageTwoContent = "\nimport { Component } from '@angular/core';\nimport { LoadingController, ModalController, NavController, PopoverController } from 'ionic-angular';\n\n\n\n@Component({\n  selector: 'page-page-two',\n  templateUrl: './page-two.html'\n})\n@IonicPage()\nexport class PageTwo {\n\n  constructor(public loadingController: LoadingController, public modalController: ModalController, public navCtrl: NavController, public popoverCtrl: PopoverController) {}\n\n  ionViewDidLoad() {\n  }\n\n  goBack() {\n    this.navCtrl.pop();\n  }\n\n  showLoader() {\n    const viewController = this.loadingController.create({\n      duration: 2000\n    });\n\n    viewController.present();\n  }\n\n  openModal() {\n    /*const viewController = this.modalController.create('PageThree');\n    viewController.present();\n    */\n\n    const viewController = this.popoverCtrl.create('PageThree');\n    viewController.present();\n\n\n    //this.navCtrl.push('PageThree');\n  }\n}\n\n      ";
            var pageTwoNgModuleContent = "\nimport { NgModule } from '@angular/core';\nimport { PageTwo } from './page-two';\nimport { IonicPageModule } from 'ionic-angular';\n\n@NgModule({\n  declarations: [\n    PageTwo,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageTwo)\n  ]\n})\nexport class PageTwoModule {\n\n}\n      ";
            var pageSettingsContent = "\nimport { Component } from '@angular/core';\nimport { IonicPage, NavController } from 'ionic-angular';\n\n@IonicPage({\n  segment: 'someSegmentBro',\n  defaultHistory: ['page-one', 'page-two'],\n  priority: 'high'\n})\n@Component({\n  selector: 'page-three',\n  templateUrl: './page-three.html'\n})\nexport class PageThree {\n\n  constructor(public navCtrl: NavController) {}\n\n  ionViewDidLoad() {\n  }\n\n  goBack() {\n    this.navCtrl.pop();\n  }\n\n}\n\n      ";
            var pageSettingsNgModuleContent = "\nimport { NgModule } from '@angular/core';\nimport { PageThree } from './page-three';\nimport { IonicPageModule } from 'ionic-angular';\n\n@NgModule({\n  declarations: [\n    PageThree,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageThree)\n  ]\n})\nexport class PageThreeModule {\n\n}\n\n      ";
            var srcDir = path_1.join(process.cwd(), 'myApp', 'src');
            var appNgModulePath = path_1.join(srcDir, 'app', 'app.module.ts');
            var pageOneNgModulePath = path_1.join(srcDir, 'pages', 'page-one', 'page-one.module.ts');
            var pageOnePath = path_1.join(srcDir, 'pages', 'page-one', 'page-one.ts');
            var pageTwoNgModulePath = path_1.join(srcDir, 'pages', 'page-two', 'page-two.module.ts');
            var pageTwoPath = path_1.join(srcDir, 'pages', 'page-two', 'page-two.ts');
            var pageSettingsNgModulePath = path_1.join(srcDir, 'pages', 'settings-page', 'fake-dir', 'settings-page.module.ts');
            var pageSettingsPath = path_1.join(srcDir, 'pages', 'settings-page', 'fake-dir', 'settings-page.ts');
            var fileCache = new file_cache_1.FileCache();
            fileCache.set(pageOnePath, { path: pageOnePath, content: pageOneContent });
            fileCache.set(pageOneNgModulePath, { path: pageOneNgModulePath, content: pageOneNgModuleContent });
            fileCache.set(pageTwoPath, { path: pageTwoPath, content: pageTwoContent });
            fileCache.set(pageTwoNgModulePath, { path: pageTwoNgModulePath, content: pageTwoNgModuleContent });
            fileCache.set(pageTwoPath, { path: pageTwoPath, content: pageTwoContent });
            fileCache.set(pageTwoNgModulePath, { path: pageTwoNgModulePath, content: pageTwoNgModuleContent });
            fileCache.set(pageSettingsPath, { path: pageSettingsPath, content: pageSettingsContent });
            fileCache.set(pageSettingsNgModulePath, { path: pageSettingsNgModulePath, content: pageSettingsNgModuleContent });
            spyOn(helpers, helpers.getStringPropertyValue.name).and.callFake(function (input) {
                if (input === Constants.ENV_VAR_DEEPLINKS_DIR) {
                    return srcDir;
                }
                else {
                    return '.module.ts';
                }
            });
            var map = util.getDeepLinkData(appNgModulePath, fileCache, false);
            expect(map.size).toEqual(3);
            var entryOne = map.get('SomeOtherName');
            expect(entryOne.name).toEqual('SomeOtherName');
            expect(entryOne.segment).toEqual('page-one');
            expect(entryOne.priority).toEqual('low');
            expect(entryOne.defaultHistory.length).toEqual(0);
            expect(entryOne.absolutePath).toEqual(path_1.join(srcDir, 'pages', 'page-one', 'page-one.module.ts'));
            expect(entryOne.userlandModulePath).toEqual('../pages/page-one/page-one.module');
            expect(entryOne.className).toEqual('PageOneModule');
            var entryTwo = map.get('PageTwo');
            expect(entryTwo.name).toEqual('PageTwo');
            expect(entryTwo.segment).toEqual('page-two');
            expect(entryTwo.priority).toEqual('low');
            expect(entryTwo.defaultHistory.length).toEqual(0);
            expect(entryTwo.absolutePath).toEqual(path_1.join(srcDir, 'pages', 'page-two', 'page-two.module.ts'));
            expect(entryTwo.userlandModulePath).toEqual('../pages/page-two/page-two.module');
            expect(entryTwo.className).toEqual('PageTwoModule');
            var entryThree = map.get('PageThree');
            expect(entryThree.name).toEqual('PageThree');
            expect(entryThree.segment).toEqual('someSegmentBro');
            expect(entryThree.priority).toEqual('high');
            expect(entryThree.defaultHistory.length).toEqual(2);
            expect(entryThree.defaultHistory[0]).toEqual('page-one');
            expect(entryThree.defaultHistory[1]).toEqual('page-two');
            expect(entryThree.absolutePath).toEqual(path_1.join(srcDir, 'pages', 'settings-page', 'fake-dir', 'settings-page.module.ts'));
            expect(entryThree.userlandModulePath).toEqual('../pages/settings-page/fake-dir/settings-page.module');
            expect(entryThree.className).toEqual('PageThreeModule');
        });
        it('should throw when it cant find an NgModule as a peer to the page with a deep link config', function () {
            var pageOneContent = "\nimport { Component } from '@angular/core';\nimport { IonicPage, NavController } from 'ionic-angular';\n\n\n@IonicPage({\n  name: 'SomeOtherName'\n})\n@Component({\n  selector: 'page-page-one',\n  templateUrl: './page-one.html'\n})\nexport class PageOne {\n\n  constructor(public navCtrl: NavController) {}\n\n  ionViewDidLoad() {\n  }\n\n  nextPage() {\n    this.navCtrl.push('PageTwo');\n  }\n\n  previousPage() {\n    this.navCtrl.pop();\n  }\n\n}\n      ";
            var pageOneNgModuleContent = "\nimport { NgModule } from '@angular/core';\nimport { PageOne } from './page-one';\nimport { IonicPageModule } from 'ionic-angular';\n\n@NgModule({\n  declarations: [\n    PageOne,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageOne)\n  ],\n  entryComponents: [\n    PageOne\n  ]\n})\nexport class PageOneModule {}\n\n      ";
            var pageTwoContent = "\nimport { Component } from '@angular/core';\nimport { LoadingController, ModalController, NavController, PopoverController } from 'ionic-angular';\n\n\n\n@Component({\n  selector: 'page-page-two',\n  templateUrl: './page-two.html'\n})\n@IonicPage()\nexport class PageTwo {\n\n  constructor(public loadingController: LoadingController, public modalController: ModalController, public navCtrl: NavController, public popoverCtrl: PopoverController) {}\n\n  ionViewDidLoad() {\n  }\n\n  goBack() {\n    this.navCtrl.pop();\n  }\n\n  showLoader() {\n    const viewController = this.loadingController.create({\n      duration: 2000\n    });\n\n    viewController.present();\n  }\n\n  openModal() {\n    /*const viewController = this.modalController.create('PageThree');\n    viewController.present();\n    */\n\n    const viewController = this.popoverCtrl.create('PageThree');\n    viewController.present();\n\n\n    //this.navCtrl.push('PageThree');\n  }\n}\n\n      ";
            var pageTwoNgModuleContent = "\nimport { NgModule } from '@angular/core';\nimport { PageTwo } from './page-two';\nimport { IonicPageModule } from 'ionic-angular';\n\n@NgModule({\n  declarations: [\n    PageTwo,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageTwo)\n  ]\n})\nexport class PageTwoModule {\n\n}\n      ";
            var pageSettingsContent = "\nimport { Component } from '@angular/core';\nimport { IonicPage, NavController } from 'ionic-angular';\n\n@IonicPage({\n  segment: 'someSegmentBro',\n  defaultHistory: ['page-one', 'page-two'],\n  priority: 'high'\n})\n@Component({\n  selector: 'page-three',\n  templateUrl: './page-three.html'\n})\nexport class PageThree {\n\n  constructor(public navCtrl: NavController) {}\n\n  ionViewDidLoad() {\n  }\n\n  goBack() {\n    this.navCtrl.pop();\n  }\n\n}\n\n      ";
            var pageSettingsNgModuleContent = "\nimport { NgModule } from '@angular/core';\nimport { PageThree } from './page-three';\nimport { IonicPageModule } from 'ionic-angular';\n\n@NgModule({\n  declarations: [\n    PageThree,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageThree)\n  ]\n})\nexport class PageThreeModule {\n\n}\n\n      ";
            var srcDir = path_1.join(process.cwd(), 'myApp', 'src');
            var appNgModulePath = path_1.join(srcDir, 'app', 'app.module.ts');
            var pageOneNgModulePath = path_1.join(srcDir, 'pages', 'page-one', 'page-one.not-module.ts');
            var pageOnePath = path_1.join(srcDir, 'pages', 'page-one', 'page-one.ts');
            var pageTwoNgModulePath = path_1.join(srcDir, 'pages', 'page-two', 'page-two.module.ts');
            var pageTwoPath = path_1.join(srcDir, 'pages', 'page-two', 'page-two.ts');
            var pageSettingsNgModulePath = path_1.join(srcDir, 'pages', 'settings-page', 'fake-dir', 'settings-page.module.ts');
            var pageSettingsPath = path_1.join(srcDir, 'pages', 'settings-page', 'fake-dir', 'settings-page.ts');
            var fileCache = new file_cache_1.FileCache();
            fileCache.set(pageOnePath, { path: pageOnePath, content: pageOneContent });
            fileCache.set(pageOneNgModulePath, { path: pageOneNgModulePath, content: pageOneNgModuleContent });
            fileCache.set(pageTwoPath, { path: pageTwoPath, content: pageTwoContent });
            fileCache.set(pageTwoNgModulePath, { path: pageTwoNgModulePath, content: pageTwoNgModuleContent });
            fileCache.set(pageTwoPath, { path: pageTwoPath, content: pageTwoContent });
            fileCache.set(pageTwoNgModulePath, { path: pageTwoNgModulePath, content: pageTwoNgModuleContent });
            fileCache.set(pageSettingsPath, { path: pageSettingsPath, content: pageSettingsContent });
            fileCache.set(pageSettingsNgModulePath, { path: pageSettingsNgModulePath, content: pageSettingsNgModuleContent });
            spyOn(helpers, helpers.getStringPropertyValue.name).and.callFake(function (input) {
                if (input === Constants.ENV_VAR_DEEPLINKS_DIR) {
                    return srcDir;
                }
                else {
                    return '.module.ts';
                }
            });
            var knownError = 'should never get here';
            try {
                util.getDeepLinkData(appNgModulePath, fileCache, false);
                throw new Error(knownError);
            }
            catch (ex) {
                expect(ex.message).not.toEqual(knownError);
            }
        });
    });
    describe('hasExistingDeepLinkConfig', function () {
        it('should return true when there is an existing deep link config', function () {
            var knownContent = "\nimport { BrowserModule } from '@angular/platform-browser';\nimport { NgModule } from '@angular/core';\nimport { IonicApp, IonicModule } from 'ionic-angular';\nimport { MyApp } from './app.component';\n\nimport { HomePageModule } from '../pages/home/home.module';\n\n@NgModule({\n  declarations: [\n    MyApp,\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(MyApp, {}, {\n      links: [\n        { loadChildren: '../pages/page-one/page-one.module#PageOneModule', name: 'PageOne' },\n        { loadChildren: '../pages/page-two/page-two.module#PageTwoModule', name: 'PageTwo' },\n        { loadChildren: '../pages/page-three/page-three.module#PageThreeModule', name: 'PageThree' }\n      ]\n    }),\n    HomePageModule,\n  ],\n  bootstrap: [IonicApp],\n  providers: []\n})\nexport class AppModule {}\n      ";
            var knownPath = '/idk/yo/some/path';
            var result = util.hasExistingDeepLinkConfig(knownPath, knownContent);
            expect(result).toEqual(true);
        });
        it('should return false when there isnt a deeplink config', function () {
            var knownContent = "\nimport { BrowserModule } from '@angular/platform-browser';\nimport { NgModule } from '@angular/core';\nimport { IonicApp, IonicModule } from 'ionic-angular';\nimport { MyApp } from './app.component';\n\nimport { HomePageModule } from '../pages/home/home.module';\n\n@NgModule({\n  declarations: [\n    MyApp,\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(MyApp, {}),\n    HomePageModule,\n  ],\n  bootstrap: [IonicApp],\n  providers: []\n})\nexport class AppModule {}\n      ";
            var knownPath = path_1.join(process.cwd(), 'idk', 'some', 'fake', 'path');
            var result = util.hasExistingDeepLinkConfig(knownPath, knownContent);
            expect(result).toEqual(false);
        });
        it('should return false when null/undefined is passed in place on deeplink config', function () {
            var knownContent = "\nimport { BrowserModule } from '@angular/platform-browser';\nimport { NgModule } from '@angular/core';\nimport { IonicApp, IonicModule } from 'ionic-angular';\nimport { MyApp } from './app.component';\n\nimport { HomePageModule } from '../pages/home/home.module';\n\n@NgModule({\n  declarations: [\n    MyApp,\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(MyApp, {}, null),\n    HomePageModule,\n  ],\n  bootstrap: [IonicApp],\n  providers: []\n})\nexport class AppModule {}\n      ";
            var knownPath = path_1.join(process.cwd(), 'idk', 'some', 'fake', 'path');
            var result = util.hasExistingDeepLinkConfig(knownPath, knownContent);
            expect(result).toEqual(false);
        });
        it('should return true where there is an existing deep link config associated with a variable', function () {
            var knownContent = "\nimport { BrowserModule } from '@angular/platform-browser';\nimport { NgModule } from '@angular/core';\nimport { IonicApp, IonicModule } from 'ionic-angular';\nimport { MyApp } from './app.component';\n\nimport { HomePageModule } from '../pages/home/home.module';\n\nconst deepLinkConfig = {\n  links: [\n    { loadChildren: '../pages/page-one/page-one.module#PageOneModule', name: 'PageOne' },\n    { loadChildren: '../pages/page-two/page-two.module#PageTwoModule', name: 'PageTwo' },\n    { loadChildren: '../pages/page-three/page-three.module#PageThreeModule', name: 'PageThree' }\n  ]\n};\n\n@NgModule({\n  declarations: [\n    MyApp,\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(MyApp, {}, deepLinkConfig),\n    HomePageModule,\n  ],\n  bootstrap: [IonicApp],\n  providers: []\n})\nexport class AppModule {}\n      ";
            var knownPath = path_1.join(process.cwd(), 'idk', 'some', 'fake', 'path');
            var result = util.hasExistingDeepLinkConfig(knownPath, knownContent);
            expect(result).toEqual(true);
        });
    });
    describe('convertDeepLinkEntryToJsObjectString', function () {
        it('should convert to a flat string format', function () {
            var entry = {
                name: 'HomePage',
                segment: null,
                defaultHistory: [],
                priority: 'low',
                rawString: 'irrelevant for this test',
                absolutePath: path_1.join(process.cwd(), 'myApp', 'pages', 'home-page', 'home-page.module.ts'),
                userlandModulePath: '../pages/home-page/home-page.module',
                className: 'HomePageModule'
            };
            var result = util.convertDeepLinkEntryToJsObjectString(entry);
            expect(result).toEqual("{ loadChildren: '../pages/home-page/home-page.module#HomePageModule', name: 'HomePage', segment: null, priority: 'low', defaultHistory: [] }");
        });
        it('should handle defaultHistory entries and segment', function () {
            var entry = {
                name: 'HomePage',
                segment: 'idkMan',
                defaultHistory: ['page-two', 'page-three', 'page-four'],
                priority: 'low',
                rawString: 'irrelevant for this test',
                absolutePath: path_1.join(process.cwd(), 'myApp', 'pages', 'home-page', 'home-page.module.ts'),
                userlandModulePath: '../pages/home-page/home-page.module',
                className: 'HomePageModule'
            };
            var result = util.convertDeepLinkEntryToJsObjectString(entry);
            expect(result).toEqual("{ loadChildren: '../pages/home-page/home-page.module#HomePageModule', name: 'HomePage', segment: 'idkMan', priority: 'low', defaultHistory: ['page-two', 'page-three', 'page-four'] }");
        });
    });
    describe('convertDeepLinkConfigEntriesToString', function () {
        it('should convert list of decorator data to legacy ionic data structure as a string', function () {
            var map = new Map();
            map.set('HomePage', {
                name: 'HomePage',
                segment: 'idkMan',
                defaultHistory: ['page-two', 'page-three', 'page-four'],
                priority: 'low',
                rawString: 'irrelevant for this test',
                absolutePath: path_1.join(process.cwd(), 'myApp', 'pages', 'home-page', 'home-page.module.ts'),
                userlandModulePath: '../pages/home-page/home-page.module',
                className: 'HomePageModule'
            });
            map.set('PageTwo', {
                name: 'PageTwo',
                segment: null,
                defaultHistory: [],
                priority: 'low',
                rawString: 'irrelevant for this test',
                absolutePath: path_1.join(process.cwd(), 'myApp', 'pages', 'home-page', 'home-page.module.ts'),
                userlandModulePath: '../pages/page-two/page-two.module',
                className: 'PageTwoModule'
            });
            map.set('SettingsPage', {
                name: 'SettingsPage',
                segment: null,
                defaultHistory: [],
                priority: 'low',
                rawString: 'irrelevant for this test',
                absolutePath: path_1.join(process.cwd(), 'myApp', 'pages', 'home-page', 'home-page.module.ts'),
                userlandModulePath: '../pages/settings-page/setting-page.module',
                className: 'SettingsPageModule'
            });
            var result = util.convertDeepLinkConfigEntriesToString(map);
            expect(result.indexOf('links: [')).toBeGreaterThanOrEqual(0);
            expect(result.indexOf("{ loadChildren: '../pages/home-page/home-page.module#HomePageModule', name: 'HomePage', segment: 'idkMan', priority: 'low', defaultHistory: ['page-two', 'page-three', 'page-four'] },")).toBeGreaterThanOrEqual(0);
            expect(result.indexOf("{ loadChildren: '../pages/page-two/page-two.module#PageTwoModule', name: 'PageTwo', segment: null, priority: 'low', defaultHistory: [] },")).toBeGreaterThanOrEqual(0);
            expect(result.indexOf("{ loadChildren: '../pages/settings-page/setting-page.module#SettingsPageModule', name: 'SettingsPage', segment: null, priority: 'low', defaultHistory: [] }")).toBeGreaterThanOrEqual(0);
        });
    });
    describe('getUpdatedAppNgModuleContentWithDeepLinkConfig', function () {
        it('should add a default argument for the second param of forRoot, then add the deeplink config', function () {
            var knownStringToInject = "{\n  links: [\n    { loadChildren: '../pages/home-page/home-page.module#HomePageModule', name: 'HomePage', segment: 'idkMan', priority: 'low', defaultHistory: ['page-two', 'page-three', 'page-four'] },\n    { loadChildren: '../pages/page-two/page-two.module#PageTwoModule', name: 'PageTwo', segment: null, priority: 'low', defaultHistory: [] },\n    { loadChildren: '../pages/settings-page/setting-page.module#SettingsPageModule', name: 'SettingsPage', segment: null, priority: 'low', defaultHistory: [] }\n  ]\n}\n";
            var knownContent = "\nimport { BrowserModule } from '@angular/platform-browser';\nimport { NgModule } from '@angular/core';\nimport { IonicApp, IonicModule } from 'ionic-angular';\nimport { MyApp } from './app.component';\n\nimport { HomePageModule } from '../pages/home/home.module';\n\n@NgModule({\n  declarations: [\n    MyApp,\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(MyApp),\n    HomePageModule,\n  ],\n  bootstrap: [IonicApp],\n  providers: []\n})\nexport class AppModule {}\n      ";
            var expectedResult = "\nimport { BrowserModule } from '@angular/platform-browser';\nimport { NgModule } from '@angular/core';\nimport { IonicApp, IonicModule } from 'ionic-angular';\nimport { MyApp } from './app.component';\n\nimport { HomePageModule } from '../pages/home/home.module';\n\n@NgModule({\n  declarations: [\n    MyApp,\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(MyApp, {}, {\n  links: [\n    { loadChildren: '../pages/home-page/home-page.module#HomePageModule', name: 'HomePage', segment: 'idkMan', priority: 'low', defaultHistory: ['page-two', 'page-three', 'page-four'] },\n    { loadChildren: '../pages/page-two/page-two.module#PageTwoModule', name: 'PageTwo', segment: null, priority: 'low', defaultHistory: [] },\n    { loadChildren: '../pages/settings-page/setting-page.module#SettingsPageModule', name: 'SettingsPage', segment: null, priority: 'low', defaultHistory: [] }\n  ]\n}\n),\n    HomePageModule,\n  ],\n  bootstrap: [IonicApp],\n  providers: []\n})\nexport class AppModule {}\n      ";
            var knownPath = path_1.join('some', 'fake', 'path');
            var result = util.getUpdatedAppNgModuleContentWithDeepLinkConfig(knownPath, knownContent, knownStringToInject);
            expect(result).toEqual(expectedResult);
        });
        it('should append the deeplink config as the third argument when second arg is null', function () {
            var knownStringToInject = "{\n  links: [\n    { loadChildren: '../pages/home-page/home-page.module#HomePageModule', name: 'HomePage', segment: 'idkMan', priority: 'low', defaultHistory: ['page-two', 'page-three', 'page-four'] },\n    { loadChildren: '../pages/page-two/page-two.module#PageTwoModule', name: 'PageTwo', segment: null, priority: 'low', defaultHistory: [] },\n    { loadChildren: '../pages/settings-page/setting-page.module#SettingsPageModule', name: 'SettingsPage', segment: null, priority: 'low', defaultHistory: [] }\n  ]\n}\n";
            var knownContent = "\nimport { BrowserModule } from '@angular/platform-browser';\nimport { NgModule } from '@angular/core';\nimport { IonicApp, IonicModule } from 'ionic-angular';\nimport { MyApp } from './app.component';\n\nimport { HomePageModule } from '../pages/home/home.module';\n\n@NgModule({\n  declarations: [\n    MyApp,\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(MyApp, null),\n    HomePageModule,\n  ],\n  bootstrap: [IonicApp],\n  providers: []\n})\nexport class AppModule {}\n      ";
            var expectedResult = "\nimport { BrowserModule } from '@angular/platform-browser';\nimport { NgModule } from '@angular/core';\nimport { IonicApp, IonicModule } from 'ionic-angular';\nimport { MyApp } from './app.component';\n\nimport { HomePageModule } from '../pages/home/home.module';\n\n@NgModule({\n  declarations: [\n    MyApp,\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(MyApp, null, {\n  links: [\n    { loadChildren: '../pages/home-page/home-page.module#HomePageModule', name: 'HomePage', segment: 'idkMan', priority: 'low', defaultHistory: ['page-two', 'page-three', 'page-four'] },\n    { loadChildren: '../pages/page-two/page-two.module#PageTwoModule', name: 'PageTwo', segment: null, priority: 'low', defaultHistory: [] },\n    { loadChildren: '../pages/settings-page/setting-page.module#SettingsPageModule', name: 'SettingsPage', segment: null, priority: 'low', defaultHistory: [] }\n  ]\n}\n),\n    HomePageModule,\n  ],\n  bootstrap: [IonicApp],\n  providers: []\n})\nexport class AppModule {}\n      ";
            var knownPath = path_1.join('some', 'fake', 'path');
            var result = util.getUpdatedAppNgModuleContentWithDeepLinkConfig(knownPath, knownContent, knownStringToInject);
            expect(result).toEqual(expectedResult);
        });
        it('should append the deeplink config as the third argument when second arg is object', function () {
            var knownStringToInject = "{\n  links: [\n    { loadChildren: '../pages/home-page/home-page.module#HomePageModule', name: 'HomePage', segment: 'idkMan', priority: 'low', defaultHistory: ['page-two', 'page-three', 'page-four'] },\n    { loadChildren: '../pages/page-two/page-two.module#PageTwoModule', name: 'PageTwo', segment: null, priority: 'low', defaultHistory: [] },\n    { loadChildren: '../pages/settings-page/setting-page.module#SettingsPageModule', name: 'SettingsPage', segment: null, priority: 'low', defaultHistory: [] }\n  ]\n}\n";
            var knownContent = "\nimport { BrowserModule } from '@angular/platform-browser';\nimport { NgModule } from '@angular/core';\nimport { IonicApp, IonicModule } from 'ionic-angular';\nimport { MyApp } from './app.component';\n\nimport { HomePageModule } from '../pages/home/home.module';\n\n@NgModule({\n  declarations: [\n    MyApp,\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(MyApp, {}),\n    HomePageModule,\n  ],\n  bootstrap: [IonicApp],\n  providers: []\n})\nexport class AppModule {}\n      ";
            var expectedResult = "\nimport { BrowserModule } from '@angular/platform-browser';\nimport { NgModule } from '@angular/core';\nimport { IonicApp, IonicModule } from 'ionic-angular';\nimport { MyApp } from './app.component';\n\nimport { HomePageModule } from '../pages/home/home.module';\n\n@NgModule({\n  declarations: [\n    MyApp,\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(MyApp, {}, {\n  links: [\n    { loadChildren: '../pages/home-page/home-page.module#HomePageModule', name: 'HomePage', segment: 'idkMan', priority: 'low', defaultHistory: ['page-two', 'page-three', 'page-four'] },\n    { loadChildren: '../pages/page-two/page-two.module#PageTwoModule', name: 'PageTwo', segment: null, priority: 'low', defaultHistory: [] },\n    { loadChildren: '../pages/settings-page/setting-page.module#SettingsPageModule', name: 'SettingsPage', segment: null, priority: 'low', defaultHistory: [] }\n  ]\n}\n),\n    HomePageModule,\n  ],\n  bootstrap: [IonicApp],\n  providers: []\n})\nexport class AppModule {}\n      ";
            var knownPath = path_1.join('some', 'fake', 'path');
            var result = util.getUpdatedAppNgModuleContentWithDeepLinkConfig(knownPath, knownContent, knownStringToInject);
            expect(result).toEqual(expectedResult);
        });
        it('should replace the third argument with deeplink config', function () {
            var knownStringToInject = "{\n  links: [\n    { loadChildren: '../pages/home-page/home-page.module#HomePageModule', name: 'HomePage', segment: 'idkMan', priority: 'low', defaultHistory: ['page-two', 'page-three', 'page-four'] },\n    { loadChildren: '../pages/page-two/page-two.module#PageTwoModule', name: 'PageTwo', segment: null, priority: 'low', defaultHistory: [] },\n    { loadChildren: '../pages/settings-page/setting-page.module#SettingsPageModule', name: 'SettingsPage', segment: null, priority: 'low', defaultHistory: [] }\n  ]\n}\n";
            var knownContent = "\nimport { BrowserModule } from '@angular/platform-browser';\nimport { NgModule } from '@angular/core';\nimport { IonicApp, IonicModule } from 'ionic-angular';\nimport { MyApp } from './app.component';\n\nimport { HomePageModule } from '../pages/home/home.module';\n\n@NgModule({\n  declarations: [\n    MyApp,\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(MyApp, {}, null),\n    HomePageModule,\n  ],\n  bootstrap: [IonicApp],\n  providers: []\n})\nexport class AppModule {}\n      ";
            var expectedResult = "\nimport { BrowserModule } from '@angular/platform-browser';\nimport { NgModule } from '@angular/core';\nimport { IonicApp, IonicModule } from 'ionic-angular';\nimport { MyApp } from './app.component';\n\nimport { HomePageModule } from '../pages/home/home.module';\n\n@NgModule({\n  declarations: [\n    MyApp,\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(MyApp, {}, {\n  links: [\n    { loadChildren: '../pages/home-page/home-page.module#HomePageModule', name: 'HomePage', segment: 'idkMan', priority: 'low', defaultHistory: ['page-two', 'page-three', 'page-four'] },\n    { loadChildren: '../pages/page-two/page-two.module#PageTwoModule', name: 'PageTwo', segment: null, priority: 'low', defaultHistory: [] },\n    { loadChildren: '../pages/settings-page/setting-page.module#SettingsPageModule', name: 'SettingsPage', segment: null, priority: 'low', defaultHistory: [] }\n  ]\n}\n),\n    HomePageModule,\n  ],\n  bootstrap: [IonicApp],\n  providers: []\n})\nexport class AppModule {}\n      ";
            var knownPath = path_1.join('some', 'fake', 'path');
            var result = util.getUpdatedAppNgModuleContentWithDeepLinkConfig(knownPath, knownContent, knownStringToInject);
            expect(result).toEqual(expectedResult);
        });
    });
    describe('generateDefaultDeepLinkNgModuleContent', function () {
        it('should generate a default NgModule for a DeepLinked component', function () {
            var knownFileContent = "\nimport { NgModule } from '@angular/core';\nimport { IonicPageModule } from 'ionic-angular';\nimport { PageOne } from './page-one';\n\n@NgModule({\n  declarations: [\n    PageOne,\n  ],\n  imports: [\n    IonicPageModule.forChild(PageOne)\n  ]\n})\nexport class PageOneModule {}\n\n";
            var knownFilePath = path_1.join(process.cwd(), 'myApp', 'src', 'pages', 'page-one', 'page-one.ts');
            var knownClassName = 'PageOne';
            var fileContent = util.generateDefaultDeepLinkNgModuleContent(knownFilePath, knownClassName);
            expect(fileContent).toEqual(knownFileContent);
        });
    });
    describe('updateAppNgModuleWithDeepLinkConfig', function () {
        it('should throw when app ng module is not in cache', function () {
            var fileCache = new file_cache_1.FileCache();
            var knownContext = {
                fileCache: fileCache
            };
            var knownDeepLinkString = "{\n  links: [\n    { loadChildren: '../pages/home-page/home-page.module#HomePageModule', name: 'HomePage', segment: 'idkMan', priority: 'low', defaultHistory: ['page-two', 'page-three', 'page-four'] },\n    { loadChildren: '../pages/page-two/page-two.module#PageTwoModule', name: 'PageTwo', segment: null, priority: 'low', defaultHistory: [] },\n    { loadChildren: '../pages/settings-page/setting-page.module#SettingsPageModule', name: 'SettingsPage', segment: null, priority: 'low', defaultHistory: [] }\n  ]\n}\n";
            var knownAppNgModulePath = path_1.join(process.cwd(), 'myApp', 'src', 'app.module.ts');
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue(knownAppNgModulePath);
            spyOn(fileCache, 'get').and.callThrough();
            var knownErrorMsg = 'should never get here';
            try {
                util.updateAppNgModuleWithDeepLinkConfig(knownContext, knownDeepLinkString, null);
                throw new Error(knownErrorMsg);
            }
            catch (ex) {
                expect(ex.message).not.toEqual(knownErrorMsg);
                expect(fileCache.get).toHaveBeenCalledWith(knownAppNgModulePath);
            }
        });
        it('should update the cache with updated ts file', function () {
            var fileCache = new file_cache_1.FileCache();
            var knownContext = {
                fileCache: fileCache
            };
            var knownDeepLinkString = "{\n  links: [\n    { loadChildren: '../pages/home-page/home-page.module#HomePageModule', name: 'HomePage', segment: 'idkMan', priority: 'low', defaultHistory: ['page-two', 'page-three', 'page-four'] },\n    { loadChildren: '../pages/page-two/page-two.module#PageTwoModule', name: 'PageTwo', segment: null, priority: 'low', defaultHistory: [] },\n    { loadChildren: '../pages/settings-page/setting-page.module#SettingsPageModule', name: 'SettingsPage', segment: null, priority: 'low', defaultHistory: [] }\n  ]\n}\n";
            var ngModuleContent = "\nimport { BrowserModule } from '@angular/platform-browser';\nimport { NgModule } from '@angular/core';\nimport { IonicApp, IonicModule } from 'ionic-angular';\nimport { MyApp } from './app.component';\n\nimport { HomePageModule } from '../pages/home/home.module';\n\n@NgModule({\n  declarations: [\n    MyApp,\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(MyApp, {}, null),\n    HomePageModule,\n  ],\n  bootstrap: [IonicApp],\n  providers: []\n})\nexport class AppModule {}\n";
            var knownAppNgModulePath = path_1.join(process.cwd(), 'myApp', 'src', 'app.module.ts');
            fileCache.set(knownAppNgModulePath, { path: knownAppNgModulePath, content: ngModuleContent });
            spyOn(helpers, helpers.getStringPropertyValue.name).and.returnValue(knownAppNgModulePath);
            var changedFiles = [];
            util.updateAppNgModuleWithDeepLinkConfig(knownContext, knownDeepLinkString, changedFiles);
            expect(fileCache.getAll().length).toEqual(1);
            expect(fileCache.get(knownAppNgModulePath).content.indexOf(knownDeepLinkString)).toBeGreaterThanOrEqual(0);
            expect(changedFiles.length).toEqual(1);
            expect(changedFiles[0].event).toEqual('change');
            expect(changedFiles[0].ext).toEqual('.ts');
            expect(changedFiles[0].filePath).toEqual(knownAppNgModulePath);
        });
    });
    describe('purgeDeepLinkDecorator', function () {
        it('should remove the IonicPage decorator from the ts source', function () {
            var input = "\nimport { Component } from '@angular/core';\n\nimport { IonicPage, PopoverController } from 'ionic-angular';\n\n@IonicPage()\n@Component({\n  selector: 'page-about',\n  templateUrl: 'about.html'\n})\nexport class AboutPage {\n  conferenceDate = '2047-05-17';\n\n  constructor(public popoverCtrl: PopoverController) { }\n\n  presentPopover(event: Event) {\n    let popover = this.popoverCtrl.create('PopoverPage');\n    popover.present({ ev: event });\n  }\n}\n";
            var expectedContent = "\nimport { Component } from '@angular/core';\n\nimport { PopoverController } from 'ionic-angular';\n\n\n@Component({\n  selector: 'page-about',\n  templateUrl: 'about.html'\n})\nexport class AboutPage {\n  conferenceDate = '2047-05-17';\n\n  constructor(public popoverCtrl: PopoverController) { }\n\n  presentPopover(event: Event) {\n    let popover = this.popoverCtrl.create('PopoverPage');\n    popover.present({ ev: event });\n  }\n}\n";
            var result = util.purgeDeepLinkDecorator(input);
            expect(result).toEqual(expectedContent);
        });
    });
    describe('purgeDeepLinkImport', function () {
        it('should remove the IonicPage decorator but preserve others', function () {
            var input = "\nimport { Component } from '@angular/core';\n\nimport { IonicPage, PopoverController } from 'ionic-angular';\n\n@IonicPage()\n@Component({\n  selector: 'page-about',\n  templateUrl: 'about.html'\n})\nexport class AboutPage {\n  conferenceDate = '2047-05-17';\n\n  constructor(public popoverCtrl: PopoverController) { }\n\n  presentPopover(event: Event) {\n    let popover = this.popoverCtrl.create('PopoverPage');\n    popover.present({ ev: event });\n  }\n}\n";
            var expectedText = "\nimport { Component } from '@angular/core';\n\nimport { PopoverController } from 'ionic-angular';\n\n@IonicPage()\n@Component({\n  selector: 'page-about',\n  templateUrl: 'about.html'\n})\nexport class AboutPage {\n  conferenceDate = '2047-05-17';\n\n  constructor(public popoverCtrl: PopoverController) { }\n\n  presentPopover(event: Event) {\n    let popover = this.popoverCtrl.create('PopoverPage');\n    popover.present({ ev: event });\n  }\n}\n";
            var result = util.purgeDeepLinkImport(input);
            expect(result).toEqual(expectedText);
        });
        it('should remove the entire import statement', function () {
            var input = "\nimport { Component } from '@angular/core';\n\nimport { IonicPage } from 'ionic-angular';\n\n@IonicPage()\n@Component({\n  selector: 'page-about',\n  templateUrl: 'about.html'\n})\nexport class AboutPage {\n  conferenceDate = '2047-05-17';\n\n  constructor(public popoverCtrl: PopoverController) { }\n\n  presentPopover(event: Event) {\n    let popover = this.popoverCtrl.create('PopoverPage');\n    popover.present({ ev: event });\n  }\n}\n";
            var expectedText = "\nimport { Component } from '@angular/core';\n\n\n\n@IonicPage()\n@Component({\n  selector: 'page-about',\n  templateUrl: 'about.html'\n})\nexport class AboutPage {\n  conferenceDate = '2047-05-17';\n\n  constructor(public popoverCtrl: PopoverController) { }\n\n  presentPopover(event: Event) {\n    let popover = this.popoverCtrl.create('PopoverPage');\n    popover.present({ ev: event });\n  }\n}\n";
            var result = util.purgeDeepLinkImport(input);
            expect(result).toEqual(expectedText);
        });
    });
    describe('purgeDeepLinkDecoratorTSTransform', function () {
        it('should do something', function () {
            var input = "\nimport { Component } from '@angular/core';\n\nimport { IonicPage } from 'ionic-angular';\n\n@IonicPage()\n@Component({\n  selector: 'page-about',\n  templateUrl: 'about.html'\n})\nexport class AboutPage {\n  conferenceDate = '2047-05-17';\n\n  constructor(public popoverCtrl: PopoverController) { }\n\n  presentPopover(event: Event) {\n    let popover = this.popoverCtrl.create('PopoverPage');\n    popover.present({ ev: event });\n  }\n}\n";
            var expected = "import { Component } from \"@angular/core\";\nimport { } from \"ionic-angular\";\n@Component({\n    selector: \"page-about\",\n    templateUrl: \"about.html\"\n})\nexport class AboutPage {\n    conferenceDate = \"2047-05-17\";\n    constructor(public popoverCtrl: PopoverController) { }\n    presentPopover(event: Event) {\n        let popover = this.popoverCtrl.create(\"PopoverPage\");\n        popover.present({ ev: event });\n    }\n}\n";
            var result = transformSourceFile(input, [util.purgeDeepLinkDecoratorTSTransformImpl]);
            expect(result).toEqual(expected);
        });
    });
});
function transformSourceFile(sourceText, transformers) {
    var transformed = ts.transform(ts.createSourceFile('source.ts', sourceText, ts.ScriptTarget.ES2015), transformers);
    var printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed }, {
        onEmitNode: transformed.emitNodeWithNotification,
        substituteNode: transformed.substituteNode
    });
    var result = printer.printBundle(ts.createBundle(transformed.transformed));
    transformed.dispose();
    return result;
}
exports.transformSourceFile = transformSourceFile;
