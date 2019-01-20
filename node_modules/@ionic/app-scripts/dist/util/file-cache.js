"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileCache = (function () {
    function FileCache() {
        this.map = new Map();
    }
    FileCache.prototype.set = function (key, file) {
        file.timestamp = Date.now();
        this.map.set(key, file);
    };
    FileCache.prototype.get = function (key) {
        return this.map.get(key);
    };
    FileCache.prototype.has = function (key) {
        return this.map.has(key);
    };
    FileCache.prototype.remove = function (key) {
        var result = this.map.delete(key);
        return result;
    };
    FileCache.prototype.getAll = function () {
        var list = [];
        this.map.forEach(function (file) {
            list.push(file);
        });
        return list;
    };
    FileCache.prototype.getRawStore = function () {
        return this.map;
    };
    return FileCache;
}());
exports.FileCache = FileCache;
