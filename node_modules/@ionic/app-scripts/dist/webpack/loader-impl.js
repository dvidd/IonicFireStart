"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var helpers_1 = require("../util/helpers");
var logger_1 = require("../logger/logger");
function webpackLoader(source, map, webpackContex) {
    webpackContex.cacheable();
    var callback = webpackContex.async();
    var context = helpers_1.getContext();
    var absolutePath = path_1.resolve(path_1.normalize(webpackContex.resourcePath));
    logger_1.Logger.debug("[Webpack] webpackLoader: processing the following file: " + absolutePath);
    var javascriptPath = helpers_1.changeExtension(absolutePath, '.js');
    var sourceMapPath = javascriptPath + '.map';
    Promise.all([
        readFile(context.fileCache, javascriptPath),
        readFile(context.fileCache, sourceMapPath)
    ]).then(function (_a) {
        var javascriptFile = _a[0], mapFile = _a[1];
        var sourceMapObject = map;
        if (mapFile) {
            try {
                sourceMapObject = JSON.parse(mapFile.content);
            }
            catch (ex) {
                logger_1.Logger.debug("[Webpack] loader: Attempted to parse the JSON sourcemap for " + mapFile.path + " and failed -\n          using the original, webpack provided source map");
            }
            if (sourceMapObject) {
                sourceMapObject.sources = [absolutePath];
                if (!sourceMapObject.sourcesContent || sourceMapObject.sourcesContent.length === 0) {
                    sourceMapObject.sourcesContent = [source];
                }
            }
        }
        callback(null, javascriptFile.content, sourceMapObject);
    }).catch(function (err) {
        logger_1.Logger.debug("[Webpack] loader: Encountered an unexpected error: " + err.message);
        callback(err);
    });
}
exports.webpackLoader = webpackLoader;
function readFile(fileCache, filePath) {
    return helpers_1.readAndCacheFile(filePath).then(function (fileContent) {
        logger_1.Logger.debug("[Webpack] loader: Loaded " + filePath + " successfully from disk");
        return fileCache.get(filePath);
    }).catch(function (err) {
        logger_1.Logger.debug("[Webpack] loader: Failed to load " + filePath + " from disk");
        throw err;
    });
}
