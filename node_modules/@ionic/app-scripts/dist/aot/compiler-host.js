"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var typescript_1 = require("typescript");
var typescript_utils_1 = require("../util/typescript-utils");
var logger_1 = require("../logger/logger");
var InMemoryCompilerHost = (function () {
    function InMemoryCompilerHost(options, fileSystem, setParentNodes) {
        if (setParentNodes === void 0) { setParentNodes = true; }
        this.options = options;
        this.fileSystem = fileSystem;
        this.setParentNodes = setParentNodes;
        this.diskCompilerHost = typescript_1.createCompilerHost(this.options, this.setParentNodes);
        this.sourceFileMap = new Map();
    }
    InMemoryCompilerHost.prototype.fileExists = function (filePath) {
        filePath = path_1.normalize(filePath);
        var fileContent = this.fileSystem.getFileContent(filePath);
        if (fileContent) {
            return true;
        }
        return this.diskCompilerHost.fileExists(filePath);
    };
    InMemoryCompilerHost.prototype.readFile = function (filePath) {
        filePath = path_1.normalize(filePath);
        var fileContent = this.fileSystem.getFileContent(filePath);
        if (fileContent) {
            return fileContent;
        }
        return this.diskCompilerHost.readFile(filePath);
    };
    InMemoryCompilerHost.prototype.directoryExists = function (directoryPath) {
        directoryPath = path_1.normalize(directoryPath);
        var stats = this.fileSystem.getDirectoryStats(directoryPath);
        if (stats) {
            return true;
        }
        return this.diskCompilerHost.directoryExists(directoryPath);
    };
    InMemoryCompilerHost.prototype.getFiles = function (directoryPath) {
        directoryPath = path_1.normalize(directoryPath);
        return this.fileSystem.getFileNamesInDirectory(directoryPath);
    };
    InMemoryCompilerHost.prototype.getDirectories = function (directoryPath) {
        directoryPath = path_1.normalize(directoryPath);
        var subdirs = this.fileSystem.getSubDirs(directoryPath);
        var delegated;
        try {
            delegated = this.diskCompilerHost.getDirectories(directoryPath);
        }
        catch (e) {
            delegated = [];
        }
        return delegated.concat(subdirs);
    };
    InMemoryCompilerHost.prototype.getSourceFile = function (filePath, languageVersion, onError) {
        filePath = path_1.normalize(filePath);
        var existingSourceFile = this.sourceFileMap.get(filePath);
        if (existingSourceFile) {
            return existingSourceFile;
        }
        // we haven't created a source file for this yet, so try to use what's in memory
        var fileContentFromMemory = this.fileSystem.getFileContent(filePath);
        if (fileContentFromMemory) {
            var typescriptSourceFile = typescript_utils_1.getTypescriptSourceFile(filePath, fileContentFromMemory, languageVersion, this.setParentNodes);
            this.sourceFileMap.set(filePath, typescriptSourceFile);
            return typescriptSourceFile;
        }
        var diskSourceFile = this.diskCompilerHost.getSourceFile(filePath, languageVersion, onError);
        this.sourceFileMap.set(filePath, diskSourceFile);
        return diskSourceFile;
    };
    InMemoryCompilerHost.prototype.getCancellationToken = function () {
        return this.diskCompilerHost.getCancellationToken();
    };
    InMemoryCompilerHost.prototype.getDefaultLibFileName = function (options) {
        return this.diskCompilerHost.getDefaultLibFileName(options);
    };
    InMemoryCompilerHost.prototype.writeFile = function (fileName, data, writeByteOrderMark, onError) {
        fileName = path_1.normalize(fileName);
        logger_1.Logger.debug("[NgcCompilerHost] writeFile: adding " + fileName + " to virtual file system");
        this.fileSystem.addVirtualFile(fileName, data);
    };
    InMemoryCompilerHost.prototype.getCurrentDirectory = function () {
        return this.diskCompilerHost.getCurrentDirectory();
    };
    InMemoryCompilerHost.prototype.getCanonicalFileName = function (fileName) {
        return this.diskCompilerHost.getCanonicalFileName(fileName);
    };
    InMemoryCompilerHost.prototype.useCaseSensitiveFileNames = function () {
        return this.diskCompilerHost.useCaseSensitiveFileNames();
    };
    InMemoryCompilerHost.prototype.getNewLine = function () {
        return this.diskCompilerHost.getNewLine();
    };
    return InMemoryCompilerHost;
}());
exports.InMemoryCompilerHost = InMemoryCompilerHost;
