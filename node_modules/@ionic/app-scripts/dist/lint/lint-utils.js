"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var errors_1 = require("../util/errors");
var lint_factory_1 = require("./lint-factory");
var helpers_1 = require("../util/helpers");
var logger_1 = require("../logger/logger");
var logger_diagnostics_1 = require("../logger/logger-diagnostics");
var logger_typescript_1 = require("../logger/logger-typescript");
var logger_tslint_1 = require("../logger/logger-tslint");
/**
 * Lint files
 * @param {BuildContext} context
 * @param {Program} program
 * @param {string} tsLintConfig - TSLint config file path
 * @param {Array<string>} filePaths
 * @param {LinterOptions} linterOptions
 */
function lintFiles(context, program, tsLintConfig, filePaths, linterOptions) {
    var linter = lint_factory_1.createLinter(context, program);
    var config = lint_factory_1.getTsLintConfig(tsLintConfig, linterOptions);
    return lint_factory_1.typeCheck(context, program, linterOptions)
        .then(function (diagnostics) { return processTypeCheckDiagnostics(context, diagnostics); })
        .then(function () { return Promise.all(filePaths.map(function (filePath) { return lintFile(linter, config, filePath); }))
        .then(function () { return lint_factory_1.getLintResult(linter); })
        .then(function (result) { return processLintResult(context, result); }); });
}
exports.lintFiles = lintFiles;
function lintFile(linter, config, filePath) {
    if (isMpegFile(filePath)) {
        return Promise.reject(filePath + " is not a valid TypeScript file");
    }
    return helpers_1.readFileAsync(filePath)
        .then(function (fileContents) { return lint_factory_1.lint(linter, config, filePath, fileContents); });
}
exports.lintFile = lintFile;
/**
 * Process typescript diagnostics after type checking
 * NOTE: This will throw a BuildError if there were any type errors.
 * @param {BuildContext} context
 * @param {Array<Diagnostic>} tsDiagnostics
 */
function processTypeCheckDiagnostics(context, tsDiagnostics) {
    if (tsDiagnostics.length > 0) {
        var diagnostics = logger_typescript_1.runTypeScriptDiagnostics(context, tsDiagnostics);
        logger_diagnostics_1.printDiagnostics(context, logger_diagnostics_1.DiagnosticsType.TypeScript, diagnostics, true, false);
        var files = removeDuplicateFileNames(diagnostics.map(function (diagnostic) { return diagnostic.relFileName; }));
        var errorMessage = generateErrorMessageForFiles(files, 'The following files failed type checking:');
        throw new errors_1.BuildError(errorMessage);
    }
}
exports.processTypeCheckDiagnostics = processTypeCheckDiagnostics;
/**
 * Process lint results
 * NOTE: This will throw a BuildError if there were any warnings or errors in any of the lint results.
 * @param {BuildContext} context
 * @param {LintResult} result
 */
function processLintResult(context, result) {
    var files = [];
    // Only process the lint result if there are errors or warnings (there's no point otherwise)
    if (result.errorCount !== 0 || result.warningCount !== 0) {
        var diagnostics = logger_tslint_1.runTsLintDiagnostics(context, result.failures);
        logger_diagnostics_1.printDiagnostics(context, logger_diagnostics_1.DiagnosticsType.TsLint, diagnostics, true, false);
        files.push.apply(files, getFileNames(context, result.failures));
    }
    if (files.length > 0) {
        var errorMessage = generateErrorMessageForFiles(files);
        throw new errors_1.BuildError(errorMessage);
    }
}
exports.processLintResult = processLintResult;
function generateErrorMessageForFiles(failingFiles, message) {
    return (message || 'The following files did not pass tslint:') + "\n" + failingFiles.join('\n');
}
exports.generateErrorMessageForFiles = generateErrorMessageForFiles;
function getFileNames(context, failures) {
    return failures.map(function (failure) { return failure.getFileName()
        .replace(context.rootDir, '')
        .replace(/^\//g, ''); });
}
exports.getFileNames = getFileNames;
function removeDuplicateFileNames(fileNames) {
    return Array.from(new Set(fileNames));
}
exports.removeDuplicateFileNames = removeDuplicateFileNames;
function isMpegFile(file) {
    var buffer = new Buffer(256);
    buffer.fill(0);
    var fd = fs.openSync(file, 'r');
    try {
        fs.readSync(fd, buffer, 0, 256, null);
        if (buffer.readInt8(0) === 0x47 && buffer.readInt8(188) === 0x47) {
            logger_1.Logger.debug("tslint: " + file + ": ignoring MPEG transport stream");
            return true;
        }
    }
    finally {
        fs.closeSync(fd);
    }
    return false;
}
