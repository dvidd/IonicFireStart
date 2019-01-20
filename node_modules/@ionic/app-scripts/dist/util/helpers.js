"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var path_1 = require("path");
var fs_extra_1 = require("fs-extra");
var osName = require("os-name");
var Constants = require("./constants");
var errors_1 = require("./errors");
var logger_1 = require("../logger/logger");
var camel_case_regexp_1 = require("./helpers/camel-case-regexp");
var camel_case_upper_regexp_1 = require("./helpers/camel-case-upper-regexp");
var non_word_regexp_1 = require("./helpers/non-word-regexp");
var _context;
var _deepLinkConfigEntriesMap;
var cachedAppScriptsPackageJson;
function getAppScriptsPackageJson() {
    if (!cachedAppScriptsPackageJson) {
        try {
            cachedAppScriptsPackageJson = fs_extra_1.readJsonSync(path_1.join(__dirname, '..', '..', 'package.json'));
        }
        catch (e) { }
    }
    return cachedAppScriptsPackageJson;
}
exports.getAppScriptsPackageJson = getAppScriptsPackageJson;
function getAppScriptsVersion() {
    var appScriptsPackageJson = getAppScriptsPackageJson();
    return (appScriptsPackageJson && appScriptsPackageJson.version) ? appScriptsPackageJson.version : '';
}
exports.getAppScriptsVersion = getAppScriptsVersion;
function getUserPackageJson(userRootDir) {
    try {
        return fs_extra_1.readJsonSync(path_1.join(userRootDir, 'package.json'));
    }
    catch (e) { }
    return null;
}
function getSystemText(userRootDir) {
    var systemData = getSystemData(userRootDir);
    var d = [];
    d.push("Ionic Framework: " + systemData.ionicFramework);
    if (systemData.ionicNative) {
        d.push("Ionic Native: " + systemData.ionicNative);
    }
    d.push("Ionic App Scripts: " + systemData.ionicAppScripts);
    d.push("Angular Core: " + systemData.angularCore);
    d.push("Angular Compiler CLI: " + systemData.angularCompilerCli);
    d.push("Node: " + systemData.node);
    d.push("OS Platform: " + systemData.osName);
    return d;
}
exports.getSystemText = getSystemText;
function getSystemData(userRootDir) {
    var d = {
        ionicAppScripts: getAppScriptsVersion(),
        ionicFramework: '',
        ionicNative: '',
        angularCore: '',
        angularCompilerCli: '',
        node: process.version.replace('v', ''),
        osName: osName()
    };
    try {
        var userPackageJson = getUserPackageJson(userRootDir);
        if (userPackageJson) {
            var userDependencies = userPackageJson.dependencies;
            if (userDependencies) {
                d.ionicFramework = userDependencies['ionic-angular'];
                d.ionicNative = userDependencies['ionic-native'];
                d.angularCore = userDependencies['@angular/core'];
                d.angularCompilerCli = userDependencies['@angular/compiler-cli'];
            }
        }
    }
    catch (e) { }
    return d;
}
exports.getSystemData = getSystemData;
function splitLineBreaks(sourceText) {
    if (!sourceText)
        return [];
    sourceText = sourceText.replace(/\\r/g, '\n');
    return sourceText.split('\n');
}
exports.splitLineBreaks = splitLineBreaks;
exports.objectAssign = (Object.assign) ? Object.assign : function (target, source) {
    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
        source = arguments[index];
        if (source !== undefined && source !== null) {
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    output[key] = source[key];
                }
            }
        }
    }
    return output;
};
function titleCase(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
}
exports.titleCase = titleCase;
function writeFileAsync(filePath, content) {
    return new Promise(function (resolve, reject) {
        fs_extra_1.writeFile(filePath, content, function (err) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}
exports.writeFileAsync = writeFileAsync;
function readFileAsync(filePath) {
    return new Promise(function (resolve, reject) {
        fs_extra_1.readFile(filePath, 'utf-8', function (err, buffer) {
            if (err) {
                return reject(err);
            }
            return resolve(buffer);
        });
    });
}
exports.readFileAsync = readFileAsync;
function readJsonAsync(filePath) {
    return new Promise(function (resolve, reject) {
        fs_extra_1.readJson(filePath, {}, function (err, object) {
            if (err) {
                return reject(err);
            }
            return resolve(object);
        });
    });
}
exports.readJsonAsync = readJsonAsync;
function readAndCacheFile(filePath, purge) {
    if (purge === void 0) { purge = false; }
    var file = _context.fileCache.get(filePath);
    if (file && !purge) {
        return Promise.resolve(file.content);
    }
    return readFileAsync(filePath).then(function (fileContent) {
        _context.fileCache.set(filePath, { path: filePath, content: fileContent });
        return fileContent;
    });
}
exports.readAndCacheFile = readAndCacheFile;
function unlinkAsync(filePath) {
    var filePaths;
    if (typeof filePath === 'string') {
        filePaths = [filePath];
    }
    else if (Array.isArray(filePath)) {
        filePaths = filePath;
    }
    else {
        return Promise.reject('unlinkAsync, invalid filePath type');
    }
    var promises = filePaths.map(function (filePath) {
        return new Promise(function (resolve, reject) {
            fs_extra_1.unlink(filePath, function (err) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        });
    });
    return Promise.all(promises);
}
exports.unlinkAsync = unlinkAsync;
function rimRafAsync(directoryPath) {
    return new Promise(function (resolve, reject) {
        fs_extra_1.remove(directoryPath, function (err) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}
exports.rimRafAsync = rimRafAsync;
function copyFileAsync(srcPath, destPath) {
    return new Promise(function (resolve, reject) {
        var writeStream = fs_extra_1.createWriteStream(destPath);
        writeStream.on('error', function (err) {
            reject(err);
        });
        writeStream.on('close', function () {
            resolve();
        });
        fs_extra_1.createReadStream(srcPath).pipe(writeStream);
    });
}
exports.copyFileAsync = copyFileAsync;
function mkDirpAsync(directoryPath) {
    return new Promise(function (resolve, reject) {
        fs_extra_1.ensureDir(directoryPath, function (err) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}
exports.mkDirpAsync = mkDirpAsync;
function readDirAsync(pathToDir) {
    return new Promise(function (resolve, reject) {
        fs_extra_1.readdir(pathToDir, function (err, fileNames) {
            if (err) {
                return reject(err);
            }
            resolve(fileNames);
        });
    });
}
exports.readDirAsync = readDirAsync;
function setContext(context) {
    _context = context;
}
exports.setContext = setContext;
function getContext() {
    return _context;
}
exports.getContext = getContext;
function setParsedDeepLinkConfig(map) {
    _deepLinkConfigEntriesMap = map;
}
exports.setParsedDeepLinkConfig = setParsedDeepLinkConfig;
function getParsedDeepLinkConfig() {
    return _deepLinkConfigEntriesMap;
}
exports.getParsedDeepLinkConfig = getParsedDeepLinkConfig;
function transformSrcPathToTmpPath(originalPath, context) {
    return originalPath.replace(context.srcDir, context.tmpDir);
}
exports.transformSrcPathToTmpPath = transformSrcPathToTmpPath;
function transformTmpPathToSrcPath(originalPath, context) {
    return originalPath.replace(context.tmpDir, context.srcDir);
}
exports.transformTmpPathToSrcPath = transformTmpPathToSrcPath;
function changeExtension(filePath, newExtension) {
    var dir = path_1.dirname(filePath);
    var extension = path_1.extname(filePath);
    var extensionlessfileName = path_1.basename(filePath, extension);
    var newFileName = extensionlessfileName + newExtension;
    return path_1.join(dir, newFileName);
}
exports.changeExtension = changeExtension;
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
exports.escapeHtml = escapeHtml;
function escapeStringForRegex(input) {
    return input.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}
exports.escapeStringForRegex = escapeStringForRegex;
function rangeReplace(source, startIndex, endIndex, newContent) {
    return source.substring(0, startIndex) + newContent + source.substring(endIndex);
}
exports.rangeReplace = rangeReplace;
function stringSplice(source, startIndex, numToDelete, newContent) {
    return source.slice(0, startIndex) + newContent + source.slice(startIndex + Math.abs(numToDelete));
}
exports.stringSplice = stringSplice;
function toUnixPath(filePath) {
    return filePath.replace(/\\/g, '/');
}
exports.toUnixPath = toUnixPath;
function generateRandomHexString(numCharacters) {
    return crypto_1.randomBytes(Math.ceil(numCharacters / 2)).toString('hex').slice(0, numCharacters);
}
exports.generateRandomHexString = generateRandomHexString;
function getStringPropertyValue(propertyName) {
    var result = process.env[propertyName];
    return result;
}
exports.getStringPropertyValue = getStringPropertyValue;
function getIntPropertyValue(propertyName) {
    var result = process.env[propertyName];
    return parseInt(result, 0);
}
exports.getIntPropertyValue = getIntPropertyValue;
function getBooleanPropertyValue(propertyName) {
    var result = process.env[propertyName];
    return result === 'true';
}
exports.getBooleanPropertyValue = getBooleanPropertyValue;
function convertFilePathToNgFactoryPath(filePath) {
    var directory = path_1.dirname(filePath);
    var extension = path_1.extname(filePath);
    var extensionlessFileName = path_1.basename(filePath, extension);
    var ngFactoryFileName = extensionlessFileName + '.ngfactory' + extension;
    return path_1.join(directory, ngFactoryFileName);
}
exports.convertFilePathToNgFactoryPath = convertFilePathToNgFactoryPath;
function printDependencyMap(map) {
    map.forEach(function (dependencySet, filePath) {
        logger_1.Logger.unformattedDebug('\n\n');
        logger_1.Logger.unformattedDebug(filePath + " is imported by the following files:");
        dependencySet.forEach(function (importeePath) {
            logger_1.Logger.unformattedDebug("   " + importeePath);
        });
    });
}
exports.printDependencyMap = printDependencyMap;
function webpackStatsToDependencyMap(context, stats) {
    var statsObj = stats.toJson({
        source: false,
        timings: false,
        version: false,
        errorDetails: false,
        chunks: false,
        chunkModules: false
    });
    return processStatsImpl(statsObj);
}
exports.webpackStatsToDependencyMap = webpackStatsToDependencyMap;
function processStatsImpl(webpackStats) {
    var dependencyMap = new Map();
    if (webpackStats && webpackStats.modules) {
        webpackStats.modules.forEach(function (webpackModule) {
            var moduleId = purgeWebpackPrefixFromPath(webpackModule.identifier);
            var dependencySet = new Set();
            webpackModule.reasons.forEach(function (webpackDependency) {
                var depId = purgeWebpackPrefixFromPath(webpackDependency.moduleIdentifier);
                dependencySet.add(depId);
            });
            dependencyMap.set(moduleId, dependencySet);
        });
    }
    return dependencyMap;
}
exports.processStatsImpl = processStatsImpl;
function purgeWebpackPrefixFromPath(filePath) {
    return filePath.replace(process.env[Constants.ENV_WEBPACK_LOADER], '').replace('!', '');
}
exports.purgeWebpackPrefixFromPath = purgeWebpackPrefixFromPath;
function replaceAll(input, toReplace, replacement) {
    if (!replacement) {
        replacement = '';
    }
    return input.split(toReplace).join(replacement);
}
exports.replaceAll = replaceAll;
function ensureSuffix(input, suffix) {
    if (!input.endsWith(suffix)) {
        input += suffix;
    }
    return input;
}
exports.ensureSuffix = ensureSuffix;
function removeSuffix(input, suffix) {
    if (input.endsWith(suffix)) {
        input = input.substring(0, input.length - suffix.length);
    }
    return input;
}
exports.removeSuffix = removeSuffix;
function buildErrorToJson(buildError) {
    return {
        message: buildError.message,
        name: buildError.name,
        stack: buildError.stack,
        hasBeenLogged: buildError.hasBeenLogged,
        isFatal: buildError.isFatal
    };
}
exports.buildErrorToJson = buildErrorToJson;
function jsonToBuildError(nonTypedBuildError) {
    var error = new errors_1.BuildError(new Error(nonTypedBuildError.message));
    error.name = nonTypedBuildError.name;
    error.stack = nonTypedBuildError.stack;
    error.hasBeenLogged = nonTypedBuildError.hasBeenLogged;
    error.isFatal = nonTypedBuildError.isFatal;
    return error;
}
exports.jsonToBuildError = jsonToBuildError;
function upperCaseFirst(input) {
    if (input.length > 1) {
        return input.charAt(0).toUpperCase() + input.substr(1);
    }
    return input.toUpperCase();
}
exports.upperCaseFirst = upperCaseFirst;
function sentenceCase(input) {
    var noCase = removeCaseFromString(input);
    return upperCaseFirst(noCase);
}
exports.sentenceCase = sentenceCase;
function snakeCase(input) {
    return removeCaseFromString(input, '_');
}
exports.snakeCase = snakeCase;
function constantCase(input) {
    return snakeCase(input).toUpperCase();
}
exports.constantCase = constantCase;
function camelCase(input) {
    input = removeCaseFromString(input);
    input = input.replace(/ (?=\d)/g, '_');
    return input.replace(/ (.)/g, function (m, arg) {
        return arg.toUpperCase();
    });
}
exports.camelCase = camelCase;
function paramCase(input) {
    return removeCaseFromString(input, '-');
}
exports.paramCase = paramCase;
function pascalCase(input) {
    return upperCaseFirst(camelCase(input));
}
exports.pascalCase = pascalCase;
function removeCaseFromString(input, inReplacement) {
    var replacement = inReplacement && inReplacement.length > 0 ? inReplacement : ' ';
    function replace(match, index, value) {
        if (index === 0 || index === (value.length - match.length)) {
            return '';
        }
        return replacement;
    }
    var modified = input
        .replace(camel_case_regexp_1.CAMEL_CASE_REGEXP, '$1 $2')
        .replace(camel_case_upper_regexp_1.CAMEL_CASE_UPPER_REGEXP, '$1 $2')
        .replace(non_word_regexp_1.NON_WORD_REGEXP, replace);
    return modified.toLowerCase();
}
exports.removeCaseFromString = removeCaseFromString;
function semverStringToObject(semverString) {
    var versionArray = semverString.split('.');
    return {
        major: parseInt(versionArray[0], 10),
        minor: parseInt(versionArray[1], 10),
        patch: parseInt(versionArray[2], 10)
    };
}
exports.semverStringToObject = semverStringToObject;
