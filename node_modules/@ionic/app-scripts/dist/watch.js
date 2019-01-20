"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var chokidar = require("chokidar");
var buildTask = require("./build");
var copy_1 = require("./copy");
var logger_1 = require("./logger/logger");
var transpile_1 = require("./transpile");
var config_1 = require("./util/config");
var Constants = require("./util/constants");
var errors_1 = require("./util/errors");
var helpers_1 = require("./util/helpers");
var interfaces_1 = require("./util/interfaces");
// https://github.com/paulmillr/chokidar
function watch(context, configFile) {
    configFile = config_1.getUserConfigFile(context, taskInfo, configFile);
    // Override all build options if watch is ran.
    context.isProd = false;
    context.optimizeJs = false;
    context.runMinifyJs = false;
    context.runMinifyCss = false;
    context.runAot = false;
    // Ensure that watch is true in context
    context.isWatch = true;
    context.sassState = interfaces_1.BuildState.RequiresBuild;
    context.transpileState = interfaces_1.BuildState.RequiresBuild;
    context.bundleState = interfaces_1.BuildState.RequiresBuild;
    context.deepLinkState = interfaces_1.BuildState.RequiresBuild;
    var logger = new logger_1.Logger('watch');
    function buildDone() {
        return startWatchers(context, configFile).then(function () {
            logger.ready();
        });
    }
    return buildTask.build(context)
        .then(buildDone, function (err) {
        if (err && err.isFatal) {
            throw err;
        }
        else {
            buildDone();
        }
    })
        .catch(function (err) {
        throw logger.fail(err);
    });
}
exports.watch = watch;
function startWatchers(context, configFile) {
    var watchConfig = config_1.fillConfigDefaults(configFile, taskInfo.defaultConfigFile);
    var promises = [];
    Object.keys(watchConfig).forEach(function (key) {
        promises.push(startWatcher(key, watchConfig[key], context));
    });
    return Promise.all(promises);
}
function startWatcher(name, watcher, context) {
    return new Promise(function (resolve, reject) {
        // If a file isn't found (probably other scenarios too),
        // Chokidar watches don't always trigger the ready or error events
        // so set a timeout, and clear it if they do fire
        // otherwise, just reject the promise and log an error
        var timeoutId = setTimeout(function () {
            var filesWatchedString = null;
            if (typeof watcher.paths === 'string') {
                filesWatchedString = watcher.paths;
            }
            else if (Array.isArray(watcher.paths)) {
                filesWatchedString = watcher.paths.join(', ');
            }
            reject(new errors_1.BuildError("A watch configured to watch the following paths failed to start. It likely that a file referenced does not exist: " + filesWatchedString));
        }, helpers_1.getIntPropertyValue(Constants.ENV_START_WATCH_TIMEOUT));
        prepareWatcher(context, watcher);
        if (!watcher.paths) {
            logger_1.Logger.error("watcher config, entry " + name + ": missing \"paths\"");
            resolve();
            return;
        }
        if (!watcher.callback) {
            logger_1.Logger.error("watcher config, entry " + name + ": missing \"callback\"");
            resolve();
            return;
        }
        var chokidarWatcher = chokidar.watch(watcher.paths, watcher.options);
        var eventName = 'all';
        if (watcher.eventName) {
            eventName = watcher.eventName;
        }
        chokidarWatcher.on(eventName, function (event, filePath) {
            // if you're listening for a specific event vs 'all',
            // the event is not included and the first param is the filePath
            // go ahead and adjust it if filePath is null so it's uniform
            if (!filePath) {
                filePath = event;
                event = watcher.eventName;
            }
            filePath = path_1.normalize(path_1.resolve(path_1.join(context.rootDir, filePath)));
            logger_1.Logger.debug("watch callback start, id: " + watchCount + ", isProd: " + context.isProd + ", event: " + event + ", path: " + filePath);
            var callbackToExecute = function (event, filePath, context, watcher) {
                return watcher.callback(event, filePath, context);
            };
            callbackToExecute(event, filePath, context, watcher)
                .then(function () {
                logger_1.Logger.debug("watch callback complete, id: " + watchCount + ", isProd: " + context.isProd + ", event: " + event + ", path: " + filePath);
                watchCount++;
            })
                .catch(function (err) {
                logger_1.Logger.debug("watch callback error, id: " + watchCount + ", isProd: " + context.isProd + ", event: " + event + ", path: " + filePath);
                logger_1.Logger.debug("" + err);
                watchCount++;
            });
        });
        chokidarWatcher.on('ready', function () {
            clearTimeout(timeoutId);
            logger_1.Logger.debug("watcher ready: " + watcher.options.cwd + watcher.paths);
            resolve();
        });
        chokidarWatcher.on('error', function (err) {
            clearTimeout(timeoutId);
            reject(new errors_1.BuildError("watcher error: " + watcher.options.cwd + watcher.paths + ": " + err));
        });
    });
}
function prepareWatcher(context, watcher) {
    watcher.options = watcher.options || {};
    if (!watcher.options.cwd) {
        watcher.options.cwd = context.rootDir;
    }
    if (typeof watcher.options.ignoreInitial !== 'boolean') {
        watcher.options.ignoreInitial = true;
    }
    if (watcher.options.ignored) {
        if (Array.isArray(watcher.options.ignored)) {
            watcher.options.ignored = watcher.options.ignored.map(function (p) { return path_1.normalize(config_1.replacePathVars(context, p)); });
        }
        else if (typeof watcher.options.ignored === 'string') {
            // it's a string, so just do it once and leave it
            watcher.options.ignored = path_1.normalize(config_1.replacePathVars(context, watcher.options.ignored));
        }
    }
    if (watcher.paths) {
        if (Array.isArray(watcher.paths)) {
            watcher.paths = watcher.paths.map(function (p) { return path_1.normalize(config_1.replacePathVars(context, p)); });
        }
        else {
            watcher.paths = path_1.normalize(config_1.replacePathVars(context, watcher.paths));
        }
    }
}
exports.prepareWatcher = prepareWatcher;
var queuedWatchEventsMap = new Map();
var queuedWatchEventsTimerId;
function buildUpdate(event, filePath, context) {
    return queueWatchUpdatesForBuild(event, filePath, context);
}
exports.buildUpdate = buildUpdate;
function queueWatchUpdatesForBuild(event, filePath, context) {
    var changedFile = {
        event: event,
        filePath: filePath,
        ext: path_1.extname(filePath).toLowerCase()
    };
    queuedWatchEventsMap.set(filePath, changedFile);
    // debounce our build update incase there are multiple files
    clearTimeout(queuedWatchEventsTimerId);
    // run this code in a few milliseconds if another hasn't come in behind it
    queuedWatchEventsTimerId = setTimeout(function () {
        // figure out what actually needs to be rebuilt
        var queuedChangeFileList = [];
        queuedWatchEventsMap.forEach(function (changedFile) { return queuedChangeFileList.push(changedFile); });
        var changedFiles = runBuildUpdate(context, queuedChangeFileList);
        // clear out all the files that are queued up for the build update
        queuedWatchEventsMap.clear();
        if (changedFiles && changedFiles.length) {
            // cool, we've got some build updating to do ;)
            queueOrRunBuildUpdate(changedFiles, context);
        }
    }, BUILD_UPDATE_DEBOUNCE_MS);
    return Promise.resolve();
}
exports.queueWatchUpdatesForBuild = queueWatchUpdatesForBuild;
// exported just for use in unit testing
exports.buildUpdatePromise = null;
exports.queuedChangedFileMap = new Map();
function queueOrRunBuildUpdate(changedFiles, context) {
    if (exports.buildUpdatePromise) {
        // there is an active build going on, so queue our changes and run
        // another build when this one finishes
        // in the event this is called multiple times while queued, we are following a "last event wins" pattern
        // so if someone makes an edit, and then deletes a file, the last "ChangedFile" is the one we act upon
        changedFiles.forEach(function (changedFile) {
            exports.queuedChangedFileMap.set(changedFile.filePath, changedFile);
        });
        return exports.buildUpdatePromise;
    }
    else {
        // there is not an active build going going on
        // clear out any queued file changes, and run the build
        exports.queuedChangedFileMap.clear();
        var buildUpdateCompleteCallback_1 = function () {
            // the update is complete, so check if there are pending updates that need to be run
            exports.buildUpdatePromise = null;
            if (exports.queuedChangedFileMap.size > 0) {
                var queuedChangeFileList_1 = [];
                exports.queuedChangedFileMap.forEach(function (changedFile) {
                    queuedChangeFileList_1.push(changedFile);
                });
                return queueOrRunBuildUpdate(queuedChangeFileList_1, context);
            }
            return Promise.resolve();
        };
        exports.buildUpdatePromise = buildTask.buildUpdate(changedFiles, context);
        return exports.buildUpdatePromise.then(buildUpdateCompleteCallback_1).catch(function (err) {
            return buildUpdateCompleteCallback_1();
        });
    }
}
exports.queueOrRunBuildUpdate = queueOrRunBuildUpdate;
var queuedCopyChanges = [];
var queuedCopyTimerId;
function copyUpdate(event, filePath, context) {
    var changedFile = {
        event: event,
        filePath: filePath,
        ext: path_1.extname(filePath).toLowerCase()
    };
    // do not allow duplicates
    if (!queuedCopyChanges.some(function (f) { return f.filePath === filePath; })) {
        queuedCopyChanges.push(changedFile);
        // debounce our build update incase there are multiple files
        clearTimeout(queuedCopyTimerId);
        // run this code in a few milliseconds if another hasn't come in behind it
        queuedCopyTimerId = setTimeout(function () {
            var changedFiles = queuedCopyChanges.concat([]);
            // clear out all the files that are queued up for the build update
            queuedCopyChanges.length = 0;
            if (changedFiles && changedFiles.length) {
                // cool, we've got some build updating to do ;)
                copy_1.copyUpdate(changedFiles, context);
            }
        }, BUILD_UPDATE_DEBOUNCE_MS);
    }
    return Promise.resolve();
}
exports.copyUpdate = copyUpdate;
function runBuildUpdate(context, changedFiles) {
    if (!changedFiles || !changedFiles.length) {
        return null;
    }
    var jsFiles = changedFiles.filter(function (f) { return f.ext === '.js'; });
    if (jsFiles.length) {
        // this is mainly for linked modules
        // if a linked library has changed (which would have a js extention)
        // we should do a full transpile build because of this
        context.bundleState = interfaces_1.BuildState.RequiresUpdate;
    }
    var tsFiles = changedFiles.filter(function (f) { return f.ext === '.ts'; });
    if (tsFiles.length) {
        var requiresFullBuild = false;
        for (var _i = 0, tsFiles_1 = tsFiles; _i < tsFiles_1.length; _i++) {
            var tsFile = tsFiles_1[_i];
            if (!transpile_1.canRunTranspileUpdate(tsFile.event, tsFiles[0].filePath, context)) {
                requiresFullBuild = true;
                break;
            }
        }
        if (requiresFullBuild) {
            // .ts file was added or deleted, we need a full rebuild
            context.transpileState = interfaces_1.BuildState.RequiresBuild;
            context.deepLinkState = interfaces_1.BuildState.RequiresBuild;
        }
        else {
            // .ts files have changed, so we can get away with doing an update
            context.transpileState = interfaces_1.BuildState.RequiresUpdate;
            context.deepLinkState = interfaces_1.BuildState.RequiresUpdate;
        }
    }
    var sassFiles = changedFiles.filter(function (f) { return /^\.s(c|a)ss$/.test(f.ext); });
    if (sassFiles.length) {
        // .scss or .sass file was changed/added/deleted, lets do a sass update
        context.sassState = interfaces_1.BuildState.RequiresUpdate;
    }
    var sassFilesNotChanges = changedFiles.filter(function (f) { return f.ext === '.ts' && f.event !== 'change'; });
    if (sassFilesNotChanges.length) {
        // .ts file was either added or deleted, so we'll have to
        // run sass again to add/remove that .ts file's potential .scss file
        context.sassState = interfaces_1.BuildState.RequiresUpdate;
    }
    var htmlFiles = changedFiles.filter(function (f) { return f.ext === '.html'; });
    if (htmlFiles.length) {
        if (context.bundleState === interfaces_1.BuildState.SuccessfulBuild && htmlFiles.every(function (f) { return f.event === 'change'; })) {
            // .html file was changed
            // just doing a template update is fine
            context.templateState = interfaces_1.BuildState.RequiresUpdate;
        }
        else {
            // .html file was added/deleted
            // we should do a full transpile build because of this
            context.transpileState = interfaces_1.BuildState.RequiresBuild;
            context.deepLinkState = interfaces_1.BuildState.RequiresBuild;
        }
    }
    if (context.transpileState === interfaces_1.BuildState.RequiresUpdate || context.transpileState === interfaces_1.BuildState.RequiresBuild) {
        if (context.bundleState === interfaces_1.BuildState.SuccessfulBuild || context.bundleState === interfaces_1.BuildState.RequiresUpdate) {
            // transpiling needs to happen
            // and there has already been a successful bundle before
            // so let's just do a bundle update
            context.bundleState = interfaces_1.BuildState.RequiresUpdate;
        }
        else {
            // transpiling needs to happen
            // but we've never successfully bundled before
            // so let's do a full bundle build
            context.bundleState = interfaces_1.BuildState.RequiresBuild;
        }
    }
    return changedFiles.concat();
}
exports.runBuildUpdate = runBuildUpdate;
var taskInfo = {
    fullArg: '--watch',
    shortArg: null,
    envVar: 'IONIC_WATCH',
    packageConfig: 'ionic_watch',
    defaultConfigFile: 'watch.config'
};
var watchCount = 0;
var BUILD_UPDATE_DEBOUNCE_MS = 20;
