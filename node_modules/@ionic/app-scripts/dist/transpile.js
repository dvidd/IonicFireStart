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
var child_process_1 = require("child_process");
var events_1 = require("events");
var fs_1 = require("fs");
var path = require("path");
var ts = require("typescript");
var compiler_host_factory_1 = require("./aot/compiler-host-factory");
var bundle_1 = require("./bundle");
var util_1 = require("./deep-linking/util");
var logger_1 = require("./logger/logger");
var logger_diagnostics_1 = require("./logger/logger-diagnostics");
var logger_typescript_1 = require("./logger/logger-typescript");
var template_1 = require("./template");
var Constants = require("./util/constants");
var errors_1 = require("./util/errors");
var helpers_1 = require("./util/helpers");
var interfaces_1 = require("./util/interfaces");
function transpile(context) {
    var workerConfig = {
        configFile: getTsConfigPath(context),
        writeInMemory: true,
        sourceMaps: true,
        cache: true,
        inlineTemplate: context.inlineTemplates,
        useTransforms: true
    };
    var logger = new logger_1.Logger('transpile');
    return transpileWorker(context, workerConfig)
        .then(function () {
        context.transpileState = interfaces_1.BuildState.SuccessfulBuild;
        logger.finish();
    })
        .catch(function (err) {
        context.transpileState = interfaces_1.BuildState.RequiresBuild;
        throw logger.fail(err);
    });
}
exports.transpile = transpile;
function transpileUpdate(changedFiles, context) {
    var workerConfig = {
        configFile: getTsConfigPath(context),
        writeInMemory: true,
        sourceMaps: true,
        cache: false,
        inlineTemplate: context.inlineTemplates,
        useTransforms: true
    };
    var logger = new logger_1.Logger('transpile update');
    var changedTypescriptFiles = changedFiles.filter(function (changedFile) { return changedFile.ext === '.ts'; });
    var promises = [];
    for (var _i = 0, changedTypescriptFiles_1 = changedTypescriptFiles; _i < changedTypescriptFiles_1.length; _i++) {
        var changedTypescriptFile = changedTypescriptFiles_1[_i];
        promises.push(transpileUpdateWorker(changedTypescriptFile.event, changedTypescriptFile.filePath, context, workerConfig));
    }
    return Promise.all(promises)
        .then(function () {
        context.transpileState = interfaces_1.BuildState.SuccessfulBuild;
        logger.finish();
    })
        .catch(function (err) {
        context.transpileState = interfaces_1.BuildState.RequiresBuild;
        throw logger.fail(err);
    });
}
exports.transpileUpdate = transpileUpdate;
/**
 * The full TS build for all app files.
 */
function transpileWorker(context, workerConfig) {
    // let's do this
    return new Promise(function (resolve, reject) {
        logger_diagnostics_1.clearDiagnostics(context, logger_diagnostics_1.DiagnosticsType.TypeScript);
        // get the tsconfig data
        var tsConfig = getTsConfig(context, workerConfig.configFile);
        if (workerConfig.sourceMaps === false) {
            // the worker config say, "hey, don't ever bother making a source map, because."
            tsConfig.options.sourceMap = false;
        }
        else {
            // build the ts source maps if the bundler is going to use source maps
            tsConfig.options.sourceMap = bundle_1.buildJsSourceMaps(context);
        }
        // collect up all the files we need to transpile, tsConfig itself does all this for us
        var tsFileNames = cleanFileNames(context, tsConfig.fileNames);
        // for dev builds let's not create d.ts files
        tsConfig.options.declaration = undefined;
        // let's start a new tsFiles object to cache all the transpiled files in
        var host = compiler_host_factory_1.getInMemoryCompilerHostInstance(tsConfig.options);
        if (workerConfig.useTransforms && helpers_1.getBooleanPropertyValue(Constants.ENV_PARSE_DEEPLINKS)) {
            // beforeArray.push(purgeDeepLinkDecoratorTSTransform());
            // beforeArray.push(getInjectDeepLinkConfigTypescriptTransform());
            // temporarily copy the files to a new location
            copyOriginalSourceFiles(context.fileCache);
            // okay, purge the deep link files NOT using a transform
            var deepLinkFiles = util_1.filterTypescriptFilesForDeepLinks(context.fileCache);
            deepLinkFiles.forEach(function (file) {
                file.content = util_1.purgeDeepLinkDecorator(file.content);
            });
            var file = context.fileCache.get(helpers_1.getStringPropertyValue(Constants.ENV_APP_NG_MODULE_PATH));
            var hasExisting = util_1.hasExistingDeepLinkConfig(file.path, file.content);
            if (!hasExisting) {
                var deepLinkString = util_1.convertDeepLinkConfigEntriesToString(helpers_1.getParsedDeepLinkConfig());
                file.content = util_1.getUpdatedAppNgModuleContentWithDeepLinkConfig(file.path, file.content, deepLinkString);
            }
        }
        var program = ts.createProgram(tsFileNames, tsConfig.options, host, cachedProgram);
        resetSourceFiles(context.fileCache);
        var beforeArray = [];
        program.emit(undefined, function (path, data, writeByteOrderMark, onError, sourceFiles) {
            if (workerConfig.writeInMemory) {
                writeTranspiledFilesCallback(context.fileCache, path, data, workerConfig.inlineTemplate);
            }
        });
        // cache the typescript program for later use
        cachedProgram = program;
        var tsDiagnostics = program.getSyntacticDiagnostics()
            .concat(program.getSemanticDiagnostics())
            .concat(program.getOptionsDiagnostics());
        var diagnostics = logger_typescript_1.runTypeScriptDiagnostics(context, tsDiagnostics);
        if (diagnostics.length) {
            // darn, we've got some things wrong, transpile failed :(
            logger_diagnostics_1.printDiagnostics(context, logger_diagnostics_1.DiagnosticsType.TypeScript, diagnostics, true, true);
            reject(new errors_1.BuildError('Failed to transpile program'));
        }
        else {
            // transpile success :)
            resolve();
        }
    });
}
exports.transpileWorker = transpileWorker;
function canRunTranspileUpdate(event, filePath, context) {
    if (event === 'change' && context.fileCache) {
        return context.fileCache.has(path.resolve(filePath));
    }
    return false;
}
exports.canRunTranspileUpdate = canRunTranspileUpdate;
/**
 * Iterative build for one TS file. If it's not an existing file change, or
 * something errors out then it falls back to do the full build.
 */
function transpileUpdateWorker(event, filePath, context, workerConfig) {
    try {
        logger_diagnostics_1.clearDiagnostics(context, logger_diagnostics_1.DiagnosticsType.TypeScript);
        filePath = path.normalize(path.resolve(filePath));
        // an existing ts file we already know about has changed
        // let's "TRY" to do a single module build for this one file
        if (!cachedTsConfig) {
            cachedTsConfig = getTsConfig(context, workerConfig.configFile);
        }
        // build the ts source maps if the bundler is going to use source maps
        cachedTsConfig.options.sourceMap = bundle_1.buildJsSourceMaps(context);
        var beforeArray = [];
        var transpileOptions = {
            compilerOptions: cachedTsConfig.options,
            fileName: filePath,
            reportDiagnostics: true,
        };
        // let's manually transpile just this one ts file
        // since it is an update, it's in memory already
        var sourceText = context.fileCache.get(filePath).content;
        var textToTranspile = workerConfig.useTransforms && helpers_1.getBooleanPropertyValue(Constants.ENV_PARSE_DEEPLINKS) ? transformSource(filePath, sourceText) : sourceText;
        // transpile this one module
        var transpileOutput = ts.transpileModule(textToTranspile, transpileOptions);
        var diagnostics = logger_typescript_1.runTypeScriptDiagnostics(context, transpileOutput.diagnostics);
        if (diagnostics.length) {
            logger_diagnostics_1.printDiagnostics(context, logger_diagnostics_1.DiagnosticsType.TypeScript, diagnostics, false, true);
            // darn, we've got some errors with this transpiling :(
            // but at least we reported the errors like really really fast, so there's that
            logger_1.Logger.debug("transpileUpdateWorker: transpileModule, diagnostics: " + diagnostics.length);
            throw new errors_1.BuildError("Failed to transpile file - " + filePath);
        }
        else {
            // convert the path to have a .js file extension for consistency
            var newPath = helpers_1.changeExtension(filePath, '.js');
            var sourceMapFile = { path: newPath + '.map', content: transpileOutput.sourceMapText };
            var jsContent = transpileOutput.outputText;
            if (workerConfig.inlineTemplate) {
                // use original path for template inlining
                jsContent = template_1.inlineTemplate(transpileOutput.outputText, filePath);
            }
            var jsFile = { path: newPath, content: jsContent };
            var tsFile = { path: filePath, content: sourceText };
            context.fileCache.set(sourceMapFile.path, sourceMapFile);
            context.fileCache.set(jsFile.path, jsFile);
            context.fileCache.set(tsFile.path, tsFile);
        }
        return Promise.resolve();
    }
    catch (ex) {
        return Promise.reject(ex);
    }
}
function transpileDiagnosticsOnly(context) {
    return new Promise(function (resolve) {
        workerEvent.once('DiagnosticsWorkerDone', function () {
            resolve();
        });
        runDiagnosticsWorker(context);
    });
}
exports.transpileDiagnosticsOnly = transpileDiagnosticsOnly;
var workerEvent = new events_1.EventEmitter();
var diagnosticsWorker = null;
function runDiagnosticsWorker(context) {
    if (!diagnosticsWorker) {
        var workerModule = path.join(__dirname, 'transpile-worker.js');
        diagnosticsWorker = child_process_1.fork(workerModule, [], { env: { FORCE_COLOR: true } });
        logger_1.Logger.debug("diagnosticsWorker created, pid: " + diagnosticsWorker.pid);
        diagnosticsWorker.on('error', function (err) {
            logger_1.Logger.error("diagnosticsWorker error, pid: " + diagnosticsWorker.pid + ", error: " + err);
            workerEvent.emit('DiagnosticsWorkerDone');
        });
        diagnosticsWorker.on('exit', function (code) {
            logger_1.Logger.debug("diagnosticsWorker exited, pid: " + diagnosticsWorker.pid);
            diagnosticsWorker = null;
        });
        diagnosticsWorker.on('message', function (msg) {
            workerEvent.emit('DiagnosticsWorkerDone');
        });
    }
    var msg = {
        rootDir: context.rootDir,
        buildDir: context.buildDir,
        configFile: getTsConfigPath(context)
    };
    diagnosticsWorker.send(msg);
}
function cleanFileNames(context, fileNames) {
    // make sure we're not transpiling the prod when dev and stuff
    return fileNames;
}
function writeTranspiledFilesCallback(fileCache, sourcePath, data, shouldInlineTemplate) {
    sourcePath = path.normalize(path.resolve(sourcePath));
    if (sourcePath.endsWith('.js')) {
        var file = fileCache.get(sourcePath);
        if (!file) {
            file = { content: '', path: sourcePath };
        }
        if (shouldInlineTemplate) {
            file.content = template_1.inlineTemplate(data, sourcePath);
        }
        else {
            file.content = data;
        }
        fileCache.set(sourcePath, file);
    }
    else if (sourcePath.endsWith('.js.map')) {
        var file = fileCache.get(sourcePath);
        if (!file) {
            file = { content: '', path: sourcePath };
        }
        file.content = data;
        fileCache.set(sourcePath, file);
    }
}
function getTsConfigAsync(context, tsConfigPath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTsConfig(context, tsConfigPath)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getTsConfigAsync = getTsConfigAsync;
function getTsConfig(context, tsConfigPath) {
    var config = null;
    tsConfigPath = tsConfigPath || getTsConfigPath(context);
    var tsConfigFile = ts.readConfigFile(tsConfigPath, function (path) { return fs_1.readFileSync(path, 'utf8'); });
    if (!tsConfigFile) {
        throw new errors_1.BuildError("tsconfig: invalid tsconfig file, \"" + tsConfigPath + "\"");
    }
    else if (tsConfigFile.error && tsConfigFile.error.messageText) {
        throw new errors_1.BuildError("tsconfig: " + tsConfigFile.error.messageText);
    }
    else if (!tsConfigFile.config) {
        throw new errors_1.BuildError("tsconfig: invalid config, \"" + tsConfigPath + "\"\"");
    }
    else {
        var parsedConfig = ts.parseJsonConfigFileContent(tsConfigFile.config, ts.sys, context.rootDir, {}, tsConfigPath);
        var diagnostics = logger_typescript_1.runTypeScriptDiagnostics(context, parsedConfig.errors);
        if (diagnostics.length) {
            logger_diagnostics_1.printDiagnostics(context, logger_diagnostics_1.DiagnosticsType.TypeScript, diagnostics, true, true);
            throw new errors_1.BuildError("tsconfig: invalid config, \"" + tsConfigPath + "\"\"");
        }
        config = {
            options: parsedConfig.options,
            fileNames: parsedConfig.fileNames,
            raw: parsedConfig.raw
        };
    }
    return config;
}
exports.getTsConfig = getTsConfig;
function transpileTsString(context, filePath, stringToTranspile) {
    if (!cachedTsConfig) {
        cachedTsConfig = getTsConfig(context);
    }
    var transpileOptions = {
        compilerOptions: cachedTsConfig.options,
        fileName: filePath,
        reportDiagnostics: true,
    };
    transpileOptions.compilerOptions.allowJs = true;
    transpileOptions.compilerOptions.sourceMap = true;
    // transpile this one module
    return ts.transpileModule(stringToTranspile, transpileOptions);
}
exports.transpileTsString = transpileTsString;
function transformSource(filePath, input) {
    if (util_1.isDeepLinkingFile(filePath)) {
        input = util_1.purgeDeepLinkDecorator(input);
    }
    else if (filePath === helpers_1.getStringPropertyValue(Constants.ENV_APP_NG_MODULE_PATH) && !util_1.hasExistingDeepLinkConfig(filePath, input)) {
        var deepLinkString = util_1.convertDeepLinkConfigEntriesToString(helpers_1.getParsedDeepLinkConfig());
        input = util_1.getUpdatedAppNgModuleContentWithDeepLinkConfig(filePath, input, deepLinkString);
    }
    return input;
}
exports.transformSource = transformSource;
function copyOriginalSourceFiles(fileCache) {
    var deepLinkFiles = util_1.filterTypescriptFilesForDeepLinks(fileCache);
    var appNgModule = fileCache.get(helpers_1.getStringPropertyValue(Constants.ENV_APP_NG_MODULE_PATH));
    deepLinkFiles.push(appNgModule);
    deepLinkFiles.forEach(function (deepLinkFile) {
        fileCache.set(deepLinkFile.path + exports.inMemoryFileCopySuffix, {
            path: deepLinkFile.path + exports.inMemoryFileCopySuffix,
            content: deepLinkFile.content
        });
    });
}
exports.copyOriginalSourceFiles = copyOriginalSourceFiles;
function resetSourceFiles(fileCache) {
    fileCache.getAll().forEach(function (file) {
        if (path.extname(file.path) === ".ts" + exports.inMemoryFileCopySuffix) {
            var originalExtension = helpers_1.changeExtension(file.path, '.ts');
            fileCache.set(originalExtension, {
                path: originalExtension,
                content: file.content
            });
            fileCache.getRawStore().delete(file.path);
        }
    });
}
exports.resetSourceFiles = resetSourceFiles;
exports.inMemoryFileCopySuffix = 'original';
var cachedProgram = null;
var cachedTsConfig = null;
function getTsConfigPath(context) {
    return process.env[Constants.ENV_TS_CONFIG];
}
exports.getTsConfigPath = getTsConfigPath;
