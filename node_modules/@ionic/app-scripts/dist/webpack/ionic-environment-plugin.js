"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var Constants = require("../util/constants");
var helpers_1 = require("../util/helpers");
var logger_1 = require("../logger/logger");
var hybrid_file_system_factory_1 = require("../util/hybrid-file-system-factory");
var watch_memory_system_1 = require("./watch-memory-system");
var ContextElementDependency = require('webpack/lib/dependencies/ContextElementDependency');
var IonicEnvironmentPlugin = (function () {
    function IonicEnvironmentPlugin(context, writeToDisk) {
        this.context = context;
        this.writeToDisk = writeToDisk;
    }
    IonicEnvironmentPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.plugin('context-module-factory', function (contextModuleFactory) {
            contextModuleFactory.plugin('after-resolve', function (result, callback) {
                if (!result) {
                    return callback();
                }
                var deepLinkConfig = helpers_1.getParsedDeepLinkConfig();
                var webpackDeepLinkModuleDictionary = convertDeepLinkConfigToWebpackFormat(deepLinkConfig);
                var ionicAngularDir = helpers_1.getStringPropertyValue(Constants.ENV_VAR_IONIC_ANGULAR_DIR);
                var ngModuleLoaderDirectory = path_1.join(ionicAngularDir, 'util');
                if (!result.resource.endsWith(ngModuleLoaderDirectory)) {
                    return callback(null, result);
                }
                result.resource = _this.context.srcDir;
                result.recursive = true;
                result.dependencies.forEach(function (dependency) { return dependency.critical = false; });
                result.resolveDependencies = function (p1, p2, p3, p4, cb) {
                    var dependencies = Object.keys(webpackDeepLinkModuleDictionary)
                        .map(function (key) {
                        var value = webpackDeepLinkModuleDictionary[key];
                        if (value) {
                            return new ContextElementDependency(value, key);
                        }
                        return null;
                    }).filter(function (dependency) { return !!dependency; });
                    cb(null, dependencies);
                };
                return callback(null, result);
            });
        });
        compiler.plugin('environment', function (otherCompiler, callback) {
            logger_1.Logger.debug('[IonicEnvironmentPlugin] apply: creating environment plugin');
            var hybridFileSystem = hybrid_file_system_factory_1.getInstance(_this.writeToDisk);
            hybridFileSystem.setInputFileSystem(compiler.inputFileSystem);
            hybridFileSystem.setOutputFileSystem(compiler.outputFileSystem);
            compiler.inputFileSystem = hybridFileSystem;
            compiler.outputFileSystem = hybridFileSystem;
            compiler.watchFileSystem = new watch_memory_system_1.WatchMemorySystem(_this.context.fileCache, _this.context.srcDir);
            // do a bunch of webpack specific stuff here, so cast to an any
            // populate the content of the file system with any virtual files
            // inspired by populateWebpackResolver method in Angular's webpack plugin
            var webpackFileSystem = hybridFileSystem;
            var fileStatsDictionary = hybridFileSystem.getAllFileStats();
            var dirStatsDictionary = hybridFileSystem.getAllDirStats();
            _this.initializeWebpackFileSystemCaches(webpackFileSystem);
            for (var _i = 0, _a = Object.keys(fileStatsDictionary); _i < _a.length; _i++) {
                var filePath = _a[_i];
                var stats = fileStatsDictionary[filePath];
                webpackFileSystem._statStorage.data[filePath] = [null, stats];
                webpackFileSystem._readFileStorage.data[filePath] = [null, stats.content];
            }
            for (var _b = 0, _c = Object.keys(dirStatsDictionary); _b < _c.length; _b++) {
                var dirPath = _c[_b];
                var stats = dirStatsDictionary[dirPath];
                var fileNames = hybridFileSystem.getFileNamesInDirectory(dirPath);
                var dirNames = hybridFileSystem.getSubDirs(dirPath);
                webpackFileSystem._statStorage.data[dirPath] = [null, stats];
                webpackFileSystem._readdirStorage.data[dirPath] = [null, fileNames.concat(dirNames)];
            }
        });
    };
    IonicEnvironmentPlugin.prototype.initializeWebpackFileSystemCaches = function (webpackFileSystem) {
        if (!webpackFileSystem._statStorage) {
            webpackFileSystem._statStorage = {};
        }
        if (!webpackFileSystem._statStorage.data) {
            webpackFileSystem._statStorage.data = [];
        }
        if (!webpackFileSystem._readFileStorage) {
            webpackFileSystem._readFileStorage = {};
        }
        if (!webpackFileSystem._readFileStorage.data) {
            webpackFileSystem._readFileStorage.data = [];
        }
        if (!webpackFileSystem._readdirStorage) {
            webpackFileSystem._readdirStorage = {};
        }
        if (!webpackFileSystem._readdirStorage.data) {
            webpackFileSystem._readdirStorage.data = [];
        }
    };
    return IonicEnvironmentPlugin;
}());
exports.IonicEnvironmentPlugin = IonicEnvironmentPlugin;
function convertDeepLinkConfigToWebpackFormat(parsedDeepLinkConfigs) {
    var dictionary = {};
    if (!parsedDeepLinkConfigs) {
        parsedDeepLinkConfigs = new Map();
    }
    parsedDeepLinkConfigs.forEach(function (parsedDeepLinkConfig) {
        if (parsedDeepLinkConfig.userlandModulePath && parsedDeepLinkConfig.absolutePath) {
            dictionary[parsedDeepLinkConfig.userlandModulePath] = parsedDeepLinkConfig.absolutePath;
        }
    });
    return dictionary;
}
exports.convertDeepLinkConfigToWebpackFormat = convertDeepLinkConfigToWebpackFormat;
