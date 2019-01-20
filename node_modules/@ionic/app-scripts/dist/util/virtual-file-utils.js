"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var dev = Math.floor(Math.random() * 10000);
var VirtualStats = (function () {
    function VirtualStats(_path) {
        this._path = _path;
        this._ctime = new Date();
        this._mtime = new Date();
        this._atime = new Date();
        this._btime = new Date();
        this._dev = dev;
        this._ino = Math.floor(Math.random() * 100000);
        this._mode = parseInt('777', 8); // RWX for everyone.
        this._uid = process.env['UID'] ? parseInt(process.env['UID'], 0) : 0;
        this._gid = process.env['GID'] ? parseInt(process.env['GID'], 0) : 0;
    }
    VirtualStats.prototype.isFile = function () { return false; };
    VirtualStats.prototype.isDirectory = function () { return false; };
    VirtualStats.prototype.isBlockDevice = function () { return false; };
    VirtualStats.prototype.isCharacterDevice = function () { return false; };
    VirtualStats.prototype.isSymbolicLink = function () { return false; };
    VirtualStats.prototype.isFIFO = function () { return false; };
    VirtualStats.prototype.isSocket = function () { return false; };
    Object.defineProperty(VirtualStats.prototype, "dev", {
        get: function () { return this._dev; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "ino", {
        get: function () { return this._ino; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "mode", {
        get: function () { return this._mode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "nlink", {
        get: function () { return 1; } // Default to 1 hard link.
        ,
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "uid", {
        get: function () { return this._uid; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "gid", {
        get: function () { return this._gid; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "rdev", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "size", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "blksize", {
        get: function () { return 512; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "blocks", {
        get: function () { return Math.ceil(this.size / this.blksize); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "atime", {
        get: function () { return this._atime; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "mtime", {
        get: function () { return this._mtime; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "ctime", {
        get: function () { return this._ctime; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VirtualStats.prototype, "birthtime", {
        get: function () { return this._btime; },
        enumerable: true,
        configurable: true
    });
    return VirtualStats;
}());
exports.VirtualStats = VirtualStats;
var VirtualDirStats = (function (_super) {
    __extends(VirtualDirStats, _super);
    function VirtualDirStats(_fileName) {
        return _super.call(this, _fileName) || this;
    }
    VirtualDirStats.prototype.isDirectory = function () { return true; };
    Object.defineProperty(VirtualDirStats.prototype, "size", {
        get: function () { return 1024; },
        enumerable: true,
        configurable: true
    });
    return VirtualDirStats;
}(VirtualStats));
exports.VirtualDirStats = VirtualDirStats;
var VirtualFileStats = (function (_super) {
    __extends(VirtualFileStats, _super);
    function VirtualFileStats(_fileName, _content) {
        var _this = _super.call(this, _fileName) || this;
        _this._content = _content;
        return _this;
    }
    Object.defineProperty(VirtualFileStats.prototype, "content", {
        get: function () { return this._content; },
        set: function (v) {
            this._content = v;
            this._mtime = new Date();
        },
        enumerable: true,
        configurable: true
    });
    VirtualFileStats.prototype.isFile = function () { return true; };
    Object.defineProperty(VirtualFileStats.prototype, "size", {
        get: function () { return this._content.length; },
        enumerable: true,
        configurable: true
    });
    return VirtualFileStats;
}(VirtualStats));
exports.VirtualFileStats = VirtualFileStats;
