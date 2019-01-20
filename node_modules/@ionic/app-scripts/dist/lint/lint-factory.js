"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslint_1 = require("tslint");
var typescript_1 = require("typescript");
var util_1 = require("util");
/**
 * Lint a file according to config
 * @param {Linter} linter
 * @param {LinterConfig} config
 * @param {string} filePath
 * @param {string} fileContents
 */
function lint(linter, config, filePath, fileContents) {
    linter.lint(filePath, fileContents, config);
}
exports.lint = lint;
/**
 * Get the linter result
 * @param {Linter} linter
 * @return {LintResult}
 */
function getLintResult(linter) {
    return linter.getResult();
}
exports.getLintResult = getLintResult;
/**
 * Type check a TS program
 * @param {BuildContext} context
 * @param {Program} program
 * @param {LinterOptions} linterOptions
 * @return {Promise<Diagnostic[]>}
 */
function typeCheck(context, program, linterOptions) {
    if (util_1.isObject(linterOptions) && linterOptions.typeCheck) {
        return Promise.resolve(typescript_1.getPreEmitDiagnostics(program));
    }
    return Promise.resolve([]);
}
exports.typeCheck = typeCheck;
/**
 * Create a TS program based on the BuildContext {rootDir} or TS config file path (if provided)
 * @param {BuildContext} context
 * @param {string} tsConfig
 * @return {Program}
 */
function createProgram(context, tsConfig) {
    return tslint_1.Linter.createProgram(tsConfig, context.rootDir);
}
exports.createProgram = createProgram;
/**
 * Get all files that are sourced in TS config
 * @param {BuildContext} context
 * @param {Program} program
 * @return {Array<string>}
 */
function getFileNames(context, program) {
    return tslint_1.Linter.getFileNames(program);
}
exports.getFileNames = getFileNames;
/**
 * Get lint configuration
 * @param {string} tsLintConfig
 * @param {LinterOptions} linterOptions
 * @return {Linter}
 */
function getTsLintConfig(tsLintConfig, linterOptions) {
    var config = tslint_1.Configuration.loadConfigurationFromPath(tsLintConfig);
    Object.assign(config, util_1.isObject(linterOptions) ? { linterOptions: linterOptions } : {});
    return config;
}
exports.getTsLintConfig = getTsLintConfig;
/**
 * Create a TS linter
 * @param {BuildContext} context
 * @param {Program} program
 * @return {Linter}
 */
function createLinter(context, program) {
    return new tslint_1.Linter({
        fix: false
    }, program);
}
exports.createLinter = createLinter;
