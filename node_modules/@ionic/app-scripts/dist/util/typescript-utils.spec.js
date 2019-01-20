"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsUtils = require("./typescript-utils");
describe('typescript-utils', function () {
    describe('getNgModuleClassName', function () {
        it('should return the NgModule class name', function () {
            var knownContent = "\nimport { NgModule } from '@angular/core';\nimport { DeepLinkModule } from 'ionic-angular';\n\nimport { HomePage } from './home';\n\n@NgModule({\n  declarations: [\n    HomePage,\n  ],\n  imports: [\n    DeepLinkModule.forChild(HomePage),\n  ]\n})\nexport class HomePageModule {}\n      ";
            var knownPath = '/Users/noone/idk/some-path.module.ts';
            var result = tsUtils.getNgModuleClassName(knownPath, knownContent);
            expect(result).toEqual('HomePageModule');
        });
        it('should return the NgModule class name when there are multiple class declarations but only one is decorated', function () {
            var knownContent = "\nimport { NgModule } from '@angular/core';\nimport { DeepLinkModule } from 'ionic-angular';\n\nimport { HomePage } from './home';\n\n@NgModule({\n  declarations: [\n    HomePage,\n  ],\n  imports: [\n    DeepLinkModule.forChild(HomePage),\n  ]\n})\nexport class HomePageModule {}\n\nexport class TacoBell {\n  constructor() {\n  }\n\n  ionViewDidEnter() {\n    console.log('tacos yo');\n  }\n}\n      ";
            var knownPath = '/Users/noone/idk/some-path.module.ts';
            var result = tsUtils.getNgModuleClassName(knownPath, knownContent);
            expect(result).toEqual('HomePageModule');
        });
        it('should throw an error an NgModule isn\'t found', function () {
            var knownContent = "\nimport { NgModule } from '@angular/core';\nimport { DeepLinkModule } from 'ionic-angular';\n\nimport { HomePage } from './home';\n\nexport class HomePageModule {}\n\n      ";
            var knownPath = '/Users/noone/idk/some-path.module.ts';
            var knownError = 'Should never happen';
            try {
                tsUtils.getNgModuleClassName(knownPath, knownContent);
                throw new Error(knownError);
            }
            catch (ex) {
                expect(ex.message).not.toEqual(knownError);
            }
        });
        it('should throw an error an multiple NgModules are found', function () {
            var knownContent = "\nimport { NgModule } from '@angular/core';\nimport { DeepLinkModule } from 'ionic-angular';\n\nimport { HomePage } from './home';\n\n@NgModule({\n  declarations: [\n    HomePage,\n  ],\n  imports: [\n    DeepLinkModule.forChild(HomePage),\n  ]\n})\nexport class HomePageModule {}\n\n@NgModule({\n  declarations: [\n    HomePage,\n  ],\n  imports: [\n    DeepLinkModule.forChild(HomePage),\n  ]\n})\nexport class TacoBellModule {}\n\n      ";
            var knownPath = '/Users/noone/idk/some-path.module.ts';
            var knownError = 'Should never happen';
            try {
                tsUtils.getNgModuleClassName(knownPath, knownContent);
                throw new Error(knownError);
            }
            catch (ex) {
                expect(ex.message).not.toEqual(knownError);
            }
        });
    });
    describe('insertNamedImportIfNeeded', function () {
        it('should return modified file content, which is a string', function () {
            var filePath = '/path/to/my/file';
            var fileContent = 'import {A, B, C} from modulePath';
            var namedImport = 'NamedImport';
            var fromModule = 'CoolModule';
            var result = tsUtils.insertNamedImportIfNeeded(filePath, fileContent, namedImport, fromModule);
            // TODO: figure out how to match the exact string
            expect(result).toEqual(jasmine.any(String));
        });
        it('should return the same file content as the import is already in the file', function () {
            var filePath = '/path/to/my/file';
            var fileContent = 'import { A } from "modulePath"';
            var namedImport = 'A';
            var fromModule = "modulePath";
            var result = tsUtils.insertNamedImportIfNeeded(filePath, fileContent, namedImport, fromModule);
            expect(result).toEqual(fileContent);
        });
    });
    describe('getNgModuleDecorator', function () {
        it('should return an object', function () {
            var knownContent = "\nimport { NgModule } from '@angular/core';\nimport { BrowserModule } from '@angular/platform-browser';\nimport { IonicApp, IonicModule } from '../../../../..';\n\nimport { AppComponent } from './app.component';\nimport { RootPageModule } from '../pages/root-page/root-page.module';\n\n@NgModule({\n  declarations: [\n    AppComponent\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(AppComponent),\n    RootPageModule\n  ],\n  bootstrap: [IonicApp],\n})\nexport class AppModule {}\n\n      ";
            var knownPath = '/some/fake/path';
            var sourceFile = tsUtils.getTypescriptSourceFile(knownPath, knownContent);
            var result = tsUtils.getNgModuleDecorator('coolFile.ts', sourceFile);
            expect(result).toEqual(jasmine.any(Object));
        });
        it('should throw an error', function () {
            var messedUpContent = "\nimport { NgModule } from '@angular/core';\nimport { BrowserModule } from '@angular/platform-browser';\nimport { IonicApp, IonicModule } from '../../../../..';\n\nimport { AppComponent } from './app.component';\nimport { RootPageModule } from '../pages/root-page/root-page.module';\n\n({\n  declarations: [\n    AppComponent\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(AppComponent),\n    RootPageModule\n  ],\n  bootstrap: [IonicApp],\n})\nexport class AppModule {}\n\n      ";
            var knownPath = '/some/fake/path';
            var sourceFile = tsUtils.getTypescriptSourceFile(knownPath, messedUpContent);
            expect(function () { return tsUtils.getNgModuleDecorator('coolFile.ts', sourceFile); }).toThrowError('Could not find an "NgModule" decorator in coolFile.ts');
        });
    });
});
describe('appendNgModuleDeclaration', function () {
    it('should return a modified file content', function () {
        var knownContent = "\nimport { NgModule } from '@angular/core';\nimport { BrowserModule } from '@angular/platform-browser';\nimport { IonicApp, IonicModule } from '../../../../..';\n\nimport { AppComponent } from './app.component';\nimport { RootPageModule } from '../pages/root-page/root-page.module';\n\n@NgModule({\n  declarations: [\n    AppComponent\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(AppComponent),\n    RootPageModule\n  ],\n  bootstrap: [IonicApp],\n})\nexport class AppModule {}\n";
        var knownPath = '/some/fake/path';
        var expectedContent = "\nimport { NgModule } from '@angular/core';\nimport { BrowserModule } from '@angular/platform-browser';\nimport { IonicApp, IonicModule } from '../../../../..';\n\nimport { AppComponent } from './app.component';\nimport { RootPageModule } from '../pages/root-page/root-page.module';\n\n@NgModule({\n  declarations: [\n    AppComponent,\n    CoolComponent\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(AppComponent),\n    RootPageModule\n  ],\n  bootstrap: [IonicApp],\n})\nexport class AppModule {}\n";
        var result = tsUtils.appendNgModuleDeclaration(knownPath, knownContent, 'CoolComponent');
        expect(result).toEqual(expectedContent);
    });
    it('should return a modified file content for providers', function () {
        var knownContent = "\nimport { NgModule } from '@angular/core';\nimport { BrowserModule } from '@angular/platform-browser';\nimport { IonicApp, IonicModule } from '../../../../..';\n\nimport { AppComponent } from './app.component';\nimport { RootPageModule } from '../pages/root-page/root-page.module';\n\n@NgModule({\n  declarations: [\n    AppComponent\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(AppComponent),\n    RootPageModule\n  ],\n  bootstrap: [IonicApp],\n  providers: []\n})\nexport class AppModule {}\n";
        var knownPath = '/some/fake/path';
        var expectedContent = "\nimport { NgModule } from '@angular/core';\nimport { BrowserModule } from '@angular/platform-browser';\nimport { IonicApp, IonicModule } from '../../../../..';\n\nimport { AppComponent } from './app.component';\nimport { RootPageModule } from '../pages/root-page/root-page.module';\n\n@NgModule({\n  declarations: [\n    AppComponent\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(AppComponent),\n    RootPageModule\n  ],\n  bootstrap: [IonicApp],\n  providers: [CoolProvider]\n})\nexport class AppModule {}\n";
        var result = tsUtils.appendNgModuleProvider(knownPath, knownContent, 'CoolProvider');
        expect(result).toEqual(expectedContent);
    });
    it('should return a modified file content for providers that already has one provider', function () {
        var knownContent = "\nimport { NgModule } from '@angular/core';\nimport { BrowserModule } from '@angular/platform-browser';\nimport { IonicApp, IonicModule } from '../../../../..';\n\nimport { AppComponent } from './app.component';\nimport { RootPageModule } from '../pages/root-page/root-page.module';\n\n@NgModule({\n  declarations: [\n    AppComponent\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(AppComponent),\n    RootPageModule\n  ],\n  bootstrap: [IonicApp],\n  providers: [AwesomeProvider]\n})\nexport class AppModule {}\n";
        var knownPath = '/some/fake/path';
        var expectedContent = "\nimport { NgModule } from '@angular/core';\nimport { BrowserModule } from '@angular/platform-browser';\nimport { IonicApp, IonicModule } from '../../../../..';\n\nimport { AppComponent } from './app.component';\nimport { RootPageModule } from '../pages/root-page/root-page.module';\n\n@NgModule({\n  declarations: [\n    AppComponent\n  ],\n  imports: [\n    BrowserModule,\n    IonicModule.forRoot(AppComponent),\n    RootPageModule\n  ],\n  bootstrap: [IonicApp],\n  providers: [AwesomeProvider,\n    CoolProvider]\n})\nexport class AppModule {}\n";
        var result = tsUtils.appendNgModuleProvider(knownPath, knownContent, 'CoolProvider');
        expect(result).toEqual(expectedContent);
    });
});
