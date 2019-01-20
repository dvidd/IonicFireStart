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
var logger_1 = require("./logger/logger");
var Constants = require("./util/constants");
var errors_1 = require("./util/errors");
var helpers_1 = require("./util/helpers");
var interfaces_1 = require("./util/interfaces");
var util_1 = require("./deep-linking/util");
exports.existingDeepLinkConfigString = null;
function setExistingDeepLinkConfig(newString) {
    exports.existingDeepLinkConfigString = newString;
}
exports.setExistingDeepLinkConfig = setExistingDeepLinkConfig;
function deepLinking(context) {
    var logger = new logger_1.Logger("deeplinks");
    return deepLinkingWorker(context).then(function (map) {
        helpers_1.setParsedDeepLinkConfig(map);
        logger.finish();
    })
        .catch(function (err) {
        var error = new errors_1.BuildError(err.message);
        error.isFatal = true;
        throw logger.fail(error);
    });
}
exports.deepLinking = deepLinking;
function deepLinkingWorker(context) {
    return deepLinkingWorkerImpl(context, []);
}
function deepLinkingWorkerImpl(context, changedFiles) {
    return __awaiter(this, void 0, void 0, function () {
        var appNgModulePath, appNgModuleFileContent, hasExisting, results, newDeepLinkString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    appNgModulePath = helpers_1.getStringPropertyValue(Constants.ENV_APP_NG_MODULE_PATH);
                    return [4 /*yield*/, getAppMainNgModuleFile(appNgModulePath)];
                case 1:
                    appNgModuleFileContent = _a.sent();
                    hasExisting = util_1.hasExistingDeepLinkConfig(appNgModulePath, appNgModuleFileContent);
                    if (hasExisting) {
                        return [2 /*return*/, new Map()];
                    }
                    results = util_1.getDeepLinkData(appNgModulePath, context.fileCache, context.runAot) || new Map();
                    newDeepLinkString = util_1.convertDeepLinkConfigEntriesToString(results);
                    if (!exports.existingDeepLinkConfigString || newDeepLinkString !== exports.existingDeepLinkConfigString || hasAppModuleChanged(changedFiles, appNgModulePath)) {
                        exports.existingDeepLinkConfigString = newDeepLinkString;
                        if (changedFiles) {
                            changedFiles.push({
                                event: 'change',
                                filePath: appNgModulePath,
                                ext: path_1.extname(appNgModulePath).toLowerCase()
                            });
                        }
                    }
                    return [2 /*return*/, results];
            }
        });
    });
}
exports.deepLinkingWorkerImpl = deepLinkingWorkerImpl;
function deepLinkingUpdate(changedFiles, context) {
    if (context.deepLinkState === interfaces_1.BuildState.RequiresBuild) {
        return deepLinkingWorkerFullUpdate(context);
    }
    else {
        return deepLinkingUpdateImpl(changedFiles, context);
    }
}
exports.deepLinkingUpdate = deepLinkingUpdate;
function deepLinkingUpdateImpl(changedFiles, context) {
    var tsFiles = changedFiles.filter(function (changedFile) { return changedFile.ext === '.ts'; });
    if (tsFiles.length === 0) {
        return Promise.resolve();
    }
    var logger = new logger_1.Logger('deeplinks update');
    return deepLinkingWorkerImpl(context, changedFiles).then(function (map) {
        // okay, now that the existing config is updated, go ahead and reset it
        helpers_1.setParsedDeepLinkConfig(map);
        logger.finish();
    }).catch(function (err) {
        logger_1.Logger.warn(err.message);
        var error = new errors_1.BuildError(err.message);
        throw logger.fail(error);
    });
}
exports.deepLinkingUpdateImpl = deepLinkingUpdateImpl;
function deepLinkingWorkerFullUpdate(context) {
    var logger = new logger_1.Logger("deeplinks update");
    return deepLinkingWorker(context).then(function (map) {
        helpers_1.setParsedDeepLinkConfig(map);
        logger.finish();
    })
        .catch(function (err) {
        logger_1.Logger.warn(err.message);
        var error = new errors_1.BuildError(err.message);
        throw logger.fail(error);
    });
}
exports.deepLinkingWorkerFullUpdate = deepLinkingWorkerFullUpdate;
function getAppMainNgModuleFile(appNgModulePath) {
    return __awaiter(this, void 0, void 0, function () {
        var ex_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, helpers_1.readAndCacheFile(appNgModulePath)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    ex_1 = _a.sent();
                    throw new Error("The main app NgModule was not found at the following path: " + appNgModulePath);
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getAppMainNgModuleFile = getAppMainNgModuleFile;
function hasAppModuleChanged(changedFiles, appNgModulePath) {
    if (!changedFiles) {
        changedFiles = [];
    }
    for (var _i = 0, changedFiles_1 = changedFiles; _i < changedFiles_1.length; _i++) {
        var changedFile = changedFiles_1[_i];
        if (changedFile.filePath === appNgModulePath) {
            return true;
        }
    }
    return false;
}
exports.hasAppModuleChanged = hasAppModuleChanged;
