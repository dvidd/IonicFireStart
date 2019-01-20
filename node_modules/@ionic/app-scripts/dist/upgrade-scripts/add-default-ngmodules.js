"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var util_1 = require("../deep-linking/util");
var config_1 = require("../util/config");
var Constants = require("../util/constants");
var glob_util_1 = require("../util/glob-util");
var helpers_1 = require("../util/helpers");
var typescript_utils_1 = require("../util/typescript-utils");
function getTsFilePaths(context) {
    var tsFileGlobString = path_1.join(context.srcDir, '**', '*.ts');
    return glob_util_1.globAll([tsFileGlobString]).then(function (results) {
        return results.map(function (result) { return result.absolutePath; });
    });
}
exports.getTsFilePaths = getTsFilePaths;
function readTsFiles(context, tsFilePaths) {
    var promises = tsFilePaths.map(function (tsFilePath) {
        var promise = helpers_1.readFileAsync(tsFilePath);
        promise.then(function (fileContent) {
            context.fileCache.set(tsFilePath, { path: tsFilePath, content: fileContent });
        });
        return promise;
    });
    return Promise.all(promises);
}
exports.readTsFiles = readTsFiles;
function generateAndWriteNgModules(fileCache) {
    fileCache.getAll().forEach(function (file) {
        var sourceFile = typescript_utils_1.getTypescriptSourceFile(file.path, file.content);
        var deepLinkDecoratorData = util_1.getDeepLinkDecoratorContentForSourceFile(sourceFile);
        if (deepLinkDecoratorData) {
            // we have a valid DeepLink decorator
            var correspondingNgModulePath = util_1.getNgModulePathFromCorrespondingPage(file.path);
            var ngModuleFile = fileCache.get(correspondingNgModulePath);
            if (!ngModuleFile) {
                // the ngModule file does not exist, so go ahead and create a default one
                var defaultNgModuleContent = util_1.generateDefaultDeepLinkNgModuleContent(file.path, deepLinkDecoratorData.className);
                var ngModuleFilePath = helpers_1.changeExtension(file.path, helpers_1.getStringPropertyValue(Constants.ENV_NG_MODULE_FILE_NAME_SUFFIX));
                fs_1.writeFileSync(ngModuleFilePath, defaultNgModuleContent);
            }
        }
    });
}
exports.generateAndWriteNgModules = generateAndWriteNgModules;
function run() {
    var context = config_1.generateContext();
    // find out what files to read
    return getTsFilePaths(context).then(function (filePaths) {
        // read the files
        return readTsFiles(context, filePaths);
    }).then(function () {
        generateAndWriteNgModules(context.fileCache);
    });
}
run();
