"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var events_1 = require("../util/events");
var logger_1 = require("../logger/logger");
var WatchMemorySystem = (function () {
    function WatchMemorySystem(fileCache, srcDir) {
        this.fileCache = fileCache;
        this.srcDir = srcDir;
        this.lastWatchEventTimestamp = Date.now();
    }
    WatchMemorySystem.prototype.close = function () {
        this.isListening = false;
    };
    WatchMemorySystem.prototype.pause = function () {
        this.isListening = false;
    };
    WatchMemorySystem.prototype.watch = function (filePathsBeingWatched, dirPaths, missing, startTime, options, aggregatedCallback, immediateCallback) {
        this.filePathsBeingWatched = filePathsBeingWatched;
        this.dirPaths = dirPaths;
        this.missing = missing;
        this.startTime = startTime;
        this.options = options;
        this.immediateCallback = immediateCallback;
        this.aggregatedCallback = aggregatedCallback;
        if (!this.isListening) {
            this.startListening();
        }
        return {
            pause: this.pause,
            close: this.close
        };
    };
    WatchMemorySystem.prototype.startListening = function () {
        var _this = this;
        this.isListening = true;
        events_1.on(events_1.EventType.WebpackFilesChanged, function () {
            _this.changes = new Set();
            var filePaths = _this.fileCache.getAll().filter(function (file) { return file.timestamp >= _this.lastWatchEventTimestamp && file.path.startsWith(_this.srcDir) && path_1.extname(file.path) === '.ts'; }).map(function (file) { return file.path; });
            logger_1.Logger.debug('filePaths: ', filePaths);
            _this.lastWatchEventTimestamp = Date.now();
            _this.processChanges(filePaths);
        });
    };
    WatchMemorySystem.prototype.processChanges = function (filePaths) {
        this.immediateCallback(filePaths[0], Date.now());
        for (var _i = 0, filePaths_1 = filePaths; _i < filePaths_1.length; _i++) {
            var path = filePaths_1[_i];
            this.changes.add(path);
        }
        // don't bother waiting around, just call doneAggregating right away.
        // keep it as a function in case we need to wait via setTimeout a bit in the future
        this.doneAggregating(this.changes);
    };
    WatchMemorySystem.prototype.doneAggregating = function (changes) {
        var _this = this;
        this.isAggregating = false;
        // process the changes
        var filePaths = Array.from(changes);
        var files = filePaths.filter(function (filePath) { return _this.filePathsBeingWatched.indexOf(filePath) >= 0; }).sort();
        var dirs = filePaths.filter(function (filePath) { return _this.dirPaths.indexOf(filePath) >= 0; }).sort();
        var missing = filePaths.filter(function (filePath) { return _this.missing.indexOf(filePath) >= 0; }).sort();
        var times = this.getTimes(this.filePathsBeingWatched, this.startTime, this.fileCache);
        this.aggregatedCallback(null, files, dirs, missing, times, times);
    };
    WatchMemorySystem.prototype.getTimes = function (allFiles, startTime, fileCache) {
        var times = {};
        for (var _i = 0, allFiles_1 = allFiles; _i < allFiles_1.length; _i++) {
            var filePath = allFiles_1[_i];
            var file = fileCache.get(filePath);
            if (file) {
                times[filePath] = file.timestamp;
            }
            else {
                times[filePath] = startTime;
            }
        }
        return times;
    };
    return WatchMemorySystem;
}());
exports.WatchMemorySystem = WatchMemorySystem;
