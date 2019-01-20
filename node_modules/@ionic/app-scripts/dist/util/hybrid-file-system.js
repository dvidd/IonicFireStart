"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var virtual_file_utils_1 = require("./virtual-file-utils");
var HybridFileSystem = (function () {
    function HybridFileSystem(fileCache) {
        this.fileCache = fileCache;
        this.filesStats = {};
        this.directoryStats = {};
    }
    HybridFileSystem.prototype.setInputFileSystem = function (fs) {
        this.inputFileSystem = fs;
    };
    HybridFileSystem.prototype.setOutputFileSystem = function (fs) {
        this.outputFileSystem = fs;
    };
    HybridFileSystem.prototype.setWriteToDisk = function (write) {
        this.writeToDisk = write;
    };
    HybridFileSystem.prototype.isSync = function () {
        return this.inputFileSystem.isSync();
    };
    HybridFileSystem.prototype.stat = function (path, callback) {
        // first check the fileStats
        var fileStat = this.filesStats[path];
        if (fileStat) {
            return callback(null, fileStat);
        }
        // then check the directory stats
        var directoryStat = this.directoryStats[path];
        if (directoryStat) {
            return callback(null, directoryStat);
        }
        // fallback to list
        return this.inputFileSystem.stat(path, callback);
    };
    HybridFileSystem.prototype.readdir = function (path, callback) {
        return this.inputFileSystem.readdir(path, callback);
    };
    HybridFileSystem.prototype.readJson = function (path, callback) {
        return this.inputFileSystem.readJson(path, callback);
    };
    HybridFileSystem.prototype.readlink = function (path, callback) {
        return this.inputFileSystem.readlink(path, function (err, response) {
            callback(err, response);
        });
    };
    HybridFileSystem.prototype.purge = function (pathsToPurge) {
        if (this.fileCache) {
            for (var _i = 0, pathsToPurge_1 = pathsToPurge; _i < pathsToPurge_1.length; _i++) {
                var path = pathsToPurge_1[_i];
                this.fileCache.remove(path);
            }
        }
    };
    HybridFileSystem.prototype.readFile = function (path, callback) {
        var file = this.fileCache.get(path);
        if (file) {
            callback(null, new Buffer(file.content));
            return;
        }
        return this.inputFileSystem.readFile(path, callback);
    };
    HybridFileSystem.prototype.addVirtualFile = function (filePath, fileContent) {
        this.fileCache.set(filePath, { path: filePath, content: fileContent });
        var fileStats = new virtual_file_utils_1.VirtualFileStats(filePath, fileContent);
        this.filesStats[filePath] = fileStats;
        var directoryPath = path_1.dirname(filePath);
        var directoryStats = new virtual_file_utils_1.VirtualDirStats(directoryPath);
        this.directoryStats[directoryPath] = directoryStats;
    };
    HybridFileSystem.prototype.getFileContent = function (filePath) {
        var file = this.fileCache.get(filePath);
        if (file) {
            return file.content;
        }
        return null;
    };
    HybridFileSystem.prototype.getDirectoryStats = function (path) {
        return this.directoryStats[path];
    };
    HybridFileSystem.prototype.getSubDirs = function (directoryPath) {
        return Object.keys(this.directoryStats)
            .filter(function (filePath) { return path_1.dirname(filePath) === directoryPath; })
            .map(function (filePath) { return path_1.basename(directoryPath); });
    };
    HybridFileSystem.prototype.getFileNamesInDirectory = function (directoryPath) {
        return Object.keys(this.filesStats).filter(function (filePath) { return path_1.dirname(filePath) === directoryPath; }).map(function (filePath) { return path_1.basename(filePath); });
    };
    HybridFileSystem.prototype.getAllFileStats = function () {
        return this.filesStats;
    };
    HybridFileSystem.prototype.getAllDirStats = function () {
        return this.directoryStats;
    };
    HybridFileSystem.prototype.mkdirp = function (filePath, callback) {
        if (this.writeToDisk) {
            return this.outputFileSystem.mkdirp(filePath, callback);
        }
        callback();
    };
    HybridFileSystem.prototype.mkdir = function (filePath, callback) {
        if (this.writeToDisk) {
            return this.outputFileSystem.mkdir(filePath, callback);
        }
        callback();
    };
    HybridFileSystem.prototype.rmdir = function (filePath, callback) {
        if (this.writeToDisk) {
            return this.outputFileSystem.rmdir(filePath, callback);
        }
        callback();
    };
    HybridFileSystem.prototype.unlink = function (filePath, callback) {
        if (this.writeToDisk) {
            return this.outputFileSystem.unlink(filePath, callback);
        }
        callback();
    };
    HybridFileSystem.prototype.join = function (dirPath, fileName) {
        return path_1.join(dirPath, fileName);
    };
    HybridFileSystem.prototype.writeFile = function (filePath, fileContent, callback) {
        var stringContent = fileContent.toString();
        this.addVirtualFile(filePath, stringContent);
        if (this.writeToDisk) {
            return this.outputFileSystem.writeFile(filePath, fileContent, callback);
        }
        callback();
    };
    return HybridFileSystem;
}());
exports.HybridFileSystem = HybridFileSystem;
