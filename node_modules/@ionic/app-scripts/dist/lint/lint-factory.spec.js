"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslint_1 = require("tslint");
var typescript_1 = require("typescript");
var ts = require("typescript");
var util_1 = require("util");
var lint_factory_1 = require("./lint-factory");
describe('lint factory', function () {
    describe('createProgram()', function () {
        it('should create a TS Program', function () {
            var context = { rootDir: '' };
            var program = lint_factory_1.createProgram(context, '');
            var fns = [
                'getSourceFiles',
                'getTypeChecker'
            ];
            expect(util_1.isObject(program)).toBeTruthy();
            for (var _i = 0, fns_1 = fns; _i < fns_1.length; _i++) {
                var fn = fns_1[_i];
                expect(typeof program[fn]).toEqual('function');
            }
        });
    });
    describe('getTsLintConfig()', function () {
        it('should fetch the TSLint configuration from file path', function () {
            var tsConfigFilePath = 'tsconfig.json';
            var mockConfig = { rulesDirectory: ['node_modules/@ionic'] };
            spyOn(tslint_1.Configuration, tslint_1.Configuration.loadConfigurationFromPath.name).and.returnValue(mockConfig);
            var config = lint_factory_1.getTsLintConfig(tsConfigFilePath);
            expect(util_1.isObject(config)).toBeTruthy();
            expect(tslint_1.Configuration.loadConfigurationFromPath).toHaveBeenLastCalledWith(tsConfigFilePath);
            expect(config).toEqual(mockConfig);
        });
        it('should extend configuration with {linterOptions} if provided', function () {
            var tsConfigFilePath = 'tsconfig.json';
            var mockConfig = { rulesDirectory: ['node_modules/@ionic'] };
            spyOn(tslint_1.Configuration, tslint_1.Configuration.loadConfigurationFromPath.name).and.returnValue(mockConfig);
            var config = lint_factory_1.getTsLintConfig(tsConfigFilePath, {
                typeCheck: true
            });
            expect(config.linterOptions).toEqual({
                typeCheck: true
            });
        });
    });
    describe('createLinter()', function () {
        it('should create a Linter', function () {
            var context = { rootDir: '' };
            var program = lint_factory_1.createProgram(context, '');
            var linter = lint_factory_1.createLinter(context, program);
            expect(linter instanceof tslint_1.Linter).toBeTruthy();
        });
    });
    describe('getFileNames()', function () {
        it('should get the file names referenced in the tsconfig.json', function () {
            var context = { rootDir: '' };
            var program = lint_factory_1.createProgram(context, '');
            var mockFiles = ['test.ts'];
            spyOn(tslint_1.Linter, 'getFileNames').and.returnValue(mockFiles);
            var files = lint_factory_1.getFileNames(context, program);
            expect(Array.isArray(files)).toBeTruthy();
            expect(files).toEqual(mockFiles);
        });
    });
    describe('typeCheck()', function () {
        it('should not be called if {typeCheck} is false', function (done) {
            var context = { rootDir: '' };
            var program = lint_factory_1.createProgram(context, '');
            spyOn(ts, ts.getPreEmitDiagnostics.name).and.returnValue([]);
            lint_factory_1.typeCheck(context, program, { typeCheck: false })
                .then(function (result) {
                expect(ts.getPreEmitDiagnostics).toHaveBeenCalledTimes(0);
                expect(result).toEqual([]);
                done();
            });
        });
        it('should type check if {typeCheck} is true', function (done) {
            var context = { rootDir: '' };
            var program = lint_factory_1.createProgram(context, '');
            var diagnostics = [{
                    file: {},
                    start: 2,
                    length: 10,
                    messageText: 'Oops',
                    category: typescript_1.DiagnosticCategory.Warning,
                    code: 120
                }];
            spyOn(ts, ts.getPreEmitDiagnostics.name).and.returnValue(diagnostics);
            lint_factory_1.typeCheck(context, program, { typeCheck: true })
                .then(function (result) {
                expect(ts.getPreEmitDiagnostics).toHaveBeenCalledWith(program);
                expect(result).toEqual(diagnostics);
                done();
            });
        });
    });
    describe('lint()', function () {
        it('should lint a file', function () {
            var context = { rootDir: '' };
            var program = lint_factory_1.createProgram(context, '');
            var linter = lint_factory_1.createLinter(context, program);
            spyOn(linter, 'lint').and.returnValue(undefined);
            var config = {};
            var filePath = 'test.ts';
            var fileContents = 'const test = true;';
            lint_factory_1.lint(linter, config, filePath, fileContents);
            expect(linter.lint).toHaveBeenCalledWith(filePath, fileContents, config);
        });
    });
    describe('getLintResult()', function () {
        it('should get the lint results after linting a file', function () {
            var context = { rootDir: '' };
            var program = lint_factory_1.createProgram(context, '');
            var linter = lint_factory_1.createLinter(context, program);
            spyOn(linter, 'lint').and.returnValue(undefined);
            var mockResult = {};
            spyOn(linter, 'getResult').and.returnValue(mockResult);
            var config = {
                jsRules: new Map(),
                rules: new Map()
            };
            var filePath = 'test.ts';
            var fileContents = 'const test = true;';
            lint_factory_1.lint(linter, config, filePath, fileContents);
            var result = lint_factory_1.getLintResult(linter);
            expect(util_1.isObject(result)).toBeTruthy();
            expect(result).toEqual(mockResult);
        });
    });
});
