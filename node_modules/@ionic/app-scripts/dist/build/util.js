"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var transpile_1 = require("../transpile");
var Constants = require("../util/constants");
var errors_1 = require("../util/errors");
var glob_util_1 = require("../util/glob-util");
var helpers_1 = require("../util/helpers");
function scanSrcTsFiles(context) {
    var srcGlob = path_1.join(context.srcDir, '**', '*.ts');
    var globs = [srcGlob];
    var deepLinkDir = helpers_1.getStringPropertyValue(Constants.ENV_VAR_DEEPLINKS_DIR);
    // these two will only not be equal in some weird cases like for building Ionic's demos with our current repository set-up
    if (deepLinkDir !== context.srcDir) {
        globs.push(path_1.join(deepLinkDir, '**', '*.ts'));
    }
    return glob_util_1.globAll(globs).then(function (results) {
        var promises = results.map(function (result) {
            var promise = helpers_1.readFileAsync(result.absolutePath);
            promise.then(function (fileContent) {
                context.fileCache.set(result.absolutePath, { path: result.absolutePath, content: fileContent });
            });
            return promise;
        });
        return Promise.all(promises);
    });
}
exports.scanSrcTsFiles = scanSrcTsFiles;
function validateTsConfigSettings(tsConfigFileContents) {
    return new Promise(function (resolve, reject) {
        try {
            var isValid = tsConfigFileContents.options &&
                tsConfigFileContents.options.sourceMap === true;
            if (!isValid) {
                var error = new errors_1.BuildError(['The "tsconfig.json" file must have compilerOptions.sourceMap set to true.',
                    'For more information please see the default Ionic project tsconfig.json file here:',
                    'https://github.com/ionic-team/ionic2-app-base/blob/master/tsconfig.json'].join('\n'));
                error.isFatal = true;
                return reject(error);
            }
            resolve();
        }
        catch (e) {
            var error = new errors_1.BuildError('The "tsconfig.json" file contains malformed JSON.');
            error.isFatal = true;
            return reject(error);
        }
    });
}
exports.validateTsConfigSettings = validateTsConfigSettings;
function validateRequiredFilesExist(context) {
    return Promise.all([
        helpers_1.readFileAsync(process.env[Constants.ENV_APP_ENTRY_POINT]),
        transpile_1.getTsConfigAsync(context, process.env[Constants.ENV_TS_CONFIG])
    ]).catch(function (error) {
        if (error.code === 'ENOENT' && error.path === process.env[Constants.ENV_APP_ENTRY_POINT]) {
            error = new errors_1.BuildError(error.path + " was not found. The \"main.dev.ts\" and \"main.prod.ts\" files have been deprecated. Please create a new file \"main.ts\" containing the content of \"main.dev.ts\", and then delete the deprecated files.\n                            For more information, please see the default Ionic project main.ts file here:\n                            https://github.com/ionic-team/ionic2-app-base/tree/master/src/app/main.ts");
            error.isFatal = true;
            throw error;
        }
        if (error.code === 'ENOENT' && error.path === process.env[Constants.ENV_TS_CONFIG]) {
            error = new errors_1.BuildError([error.path + " was not found. The \"tsconfig.json\" file is missing. This file is required.",
                'For more information please see the default Ionic project tsconfig.json file here:',
                'https://github.com/ionic-team/ionic2-app-base/blob/master/tsconfig.json'].join('\n'));
            error.isFatal = true;
            throw error;
        }
        error.isFatal = true;
        throw error;
    });
}
exports.validateRequiredFilesExist = validateRequiredFilesExist;
function readVersionOfDependencies(context) {
    return __awaiter(this, void 0, void 0, function () {
        var promises, versions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    promises = [];
                    promises.push(readPackageVersion(context.angularCoreDir));
                    if (!helpers_1.getBooleanPropertyValue(Constants.ENV_SKIP_IONIC_ANGULAR_VERSION)) {
                        promises.push(readPackageVersion(context.ionicAngularDir));
                    }
                    promises.push(readPackageVersion(context.typescriptDir));
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    versions = _a.sent();
                    context.angularVersion = helpers_1.semverStringToObject(versions[0]);
                    if (!helpers_1.getBooleanPropertyValue(Constants.ENV_SKIP_IONIC_ANGULAR_VERSION)) {
                        context.ionicAngularVersion = helpers_1.semverStringToObject(versions[1]);
                    }
                    // index could be 1 or 2 depending on if you read ionic-angular, its always the last one bro
                    context.typescriptVersion = helpers_1.semverStringToObject(versions[versions.length - 1]);
                    return [2 /*return*/];
            }
        });
    });
}
exports.readVersionOfDependencies = readVersionOfDependencies;
function readPackageVersion(packageDir) {
    return __awaiter(this, void 0, void 0, function () {
        var packageJsonPath, packageObject;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    packageJsonPath = path_1.join(packageDir, 'package.json');
                    return [4 /*yield*/, helpers_1.readJsonAsync(packageJsonPath)];
                case 1:
                    packageObject = _a.sent();
                    return [2 /*return*/, packageObject['version']];
            }
        });
    });
}
exports.readPackageVersion = readPackageVersion;
