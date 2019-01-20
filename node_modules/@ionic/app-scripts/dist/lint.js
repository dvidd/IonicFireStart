"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var lint_utils_1 = require("./lint/lint-utils");
var lint_factory_1 = require("./lint/lint-factory");
var logger_1 = require("./logger/logger");
var config_1 = require("./util/config");
var constants_1 = require("./util/constants");
var helpers_1 = require("./util/helpers");
var transpile_1 = require("./transpile");
var worker_client_1 = require("./worker-client");
var taskInfo = {
    fullArg: '--tslint',
    shortArg: '-i',
    envVar: 'ionic_tslint',
    packageConfig: 'IONIC_TSLINT',
    defaultConfigFile: '../tslint'
};
function lint(context, tsLintConfig, typeCheck) {
    var logger = new logger_1.Logger('lint');
    return worker_client_1.runWorker('lint', 'lintWorker', context, { tsLintConfig: tsLintConfig, tsConfig: transpile_1.getTsConfigPath(context), typeCheck: typeCheck || helpers_1.getBooleanPropertyValue(constants_1.ENV_TYPE_CHECK_ON_LINT) })
        .then(function () {
        logger.finish();
    })
        .catch(function (err) {
        if (helpers_1.getBooleanPropertyValue(constants_1.ENV_BAIL_ON_LINT_ERROR)) {
            throw logger.fail(err);
        }
        logger.finish();
    });
}
exports.lint = lint;
function lintWorker(context, _a) {
    var tsConfig = _a.tsConfig, tsLintConfig = _a.tsLintConfig, typeCheck = _a.typeCheck;
    return getLintConfig(context, tsLintConfig)
        .then(function (tsLintConfig) { return lintApp(context, {
        tsConfig: tsConfig,
        tsLintConfig: tsLintConfig,
        typeCheck: typeCheck
    }); });
}
exports.lintWorker = lintWorker;
function lintUpdate(changedFiles, context, typeCheck) {
    var changedTypescriptFiles = changedFiles.filter(function (changedFile) { return changedFile.ext === '.ts'; });
    return worker_client_1.runWorker('lint', 'lintUpdateWorker', context, {
        typeCheck: typeCheck,
        tsConfig: transpile_1.getTsConfigPath(context),
        tsLintConfig: config_1.getUserConfigFile(context, taskInfo, null),
        filePaths: changedTypescriptFiles.map(function (changedTypescriptFile) { return changedTypescriptFile.filePath; })
    });
}
exports.lintUpdate = lintUpdate;
function lintUpdateWorker(context, _a) {
    var tsConfig = _a.tsConfig, tsLintConfig = _a.tsLintConfig, filePaths = _a.filePaths, typeCheck = _a.typeCheck;
    var program = lint_factory_1.createProgram(context, tsConfig);
    return getLintConfig(context, tsLintConfig)
        .then(function (tsLintConfig) { return lint_utils_1.lintFiles(context, program, tsLintConfig, filePaths, { typeCheck: typeCheck }); })
        .catch(function () { });
}
exports.lintUpdateWorker = lintUpdateWorker;
function lintApp(context, _a) {
    var tsConfig = _a.tsConfig, tsLintConfig = _a.tsLintConfig, typeCheck = _a.typeCheck;
    var program = lint_factory_1.createProgram(context, tsConfig);
    var files = lint_factory_1.getFileNames(context, program);
    return lint_utils_1.lintFiles(context, program, tsLintConfig, files, { typeCheck: typeCheck });
}
function getLintConfig(context, tsLintConfig) {
    return new Promise(function (resolve, reject) {
        tsLintConfig = config_1.getUserConfigFile(context, taskInfo, tsLintConfig);
        if (!tsLintConfig) {
            tsLintConfig = path_1.join(context.rootDir, 'tslint.json');
        }
        logger_1.Logger.debug("tslint config: " + tsLintConfig);
        fs_1.access(tsLintConfig, function (err) {
            if (err) {
                // if the tslint.json file cannot be found that's fine, the
                // dev may not want to run tslint at all and to do that they
                // just don't have the file
                reject(err);
                return;
            }
            resolve(tsLintConfig);
        });
    });
}
