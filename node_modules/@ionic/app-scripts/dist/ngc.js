"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aot_compiler_1 = require("./aot/aot-compiler");
var util_1 = require("./deep-linking/util");
var logger_1 = require("./logger/logger");
var config_1 = require("./util/config");
var Constants = require("./util/constants");
var helpers_1 = require("./util/helpers");
function ngc(context, configFile) {
    configFile = config_1.getUserConfigFile(context, taskInfo, configFile);
    var logger = new logger_1.Logger('ngc');
    return ngcWorker(context, configFile)
        .then(function () {
        logger.finish();
    })
        .catch(function (err) {
        throw logger.fail(err);
    });
}
exports.ngc = ngc;
function ngcWorker(context, configFile) {
    return transformTsForDeepLinking(context).then(function () {
        return runNgc(context, configFile);
    });
}
exports.ngcWorker = ngcWorker;
function runNgc(context, configFile) {
    return aot_compiler_1.runAot(context, { entryPoint: process.env[Constants.ENV_APP_ENTRY_POINT],
        rootDir: context.rootDir,
        tsConfigPath: process.env[Constants.ENV_TS_CONFIG],
        appNgModuleClass: process.env[Constants.ENV_APP_NG_MODULE_CLASS],
        appNgModulePath: process.env[Constants.ENV_APP_NG_MODULE_PATH]
    });
}
exports.runNgc = runNgc;
function transformTsForDeepLinking(context) {
    if (helpers_1.getBooleanPropertyValue(Constants.ENV_PARSE_DEEPLINKS)) {
        var tsFiles = util_1.filterTypescriptFilesForDeepLinks(context.fileCache);
        tsFiles.forEach(function (tsFile) {
            tsFile.content = util_1.purgeDeepLinkDecorator(tsFile.content);
        });
        var tsFile = context.fileCache.get(helpers_1.getStringPropertyValue(Constants.ENV_APP_NG_MODULE_PATH));
        if (!util_1.hasExistingDeepLinkConfig(tsFile.path, tsFile.content)) {
            var deepLinkString = util_1.convertDeepLinkConfigEntriesToString(helpers_1.getParsedDeepLinkConfig());
            tsFile.content = util_1.getUpdatedAppNgModuleContentWithDeepLinkConfig(tsFile.path, tsFile.content, deepLinkString);
        }
    }
    return Promise.resolve();
}
exports.transformTsForDeepLinking = transformTsForDeepLinking;
var taskInfo = {
    fullArg: '--ngc',
    shortArg: '-n',
    envVar: 'IONIC_NGC',
    packageConfig: 'ionic_ngc',
    defaultConfigFile: null
};
