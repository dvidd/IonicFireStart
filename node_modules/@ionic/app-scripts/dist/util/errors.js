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
var BuildError = (function (_super) {
    __extends(BuildError, _super);
    function BuildError(error) {
        var _this = _super.call(this, error instanceof Error ? error.message : error) || this;
        _this.hasBeenLogged = false;
        _this.isFatal = false;
        if (error instanceof Error) {
            _this.message = error.message;
            _this.stack = error.stack;
            _this.name = error.name;
            _this.hasBeenLogged = error.hasBeenLogged;
            _this.isFatal = error.isFatal;
        }
        return _this;
    }
    return BuildError;
}(Error));
exports.BuildError = BuildError;
/* There are special cases where strange things happen where we don't want any logging, etc.
 * For our sake, it is much easier to get off the happy path of code and just throw an exception
 * and do nothing with it
 */
var IgnorableError = (function (_super) {
    __extends(IgnorableError, _super);
    function IgnorableError(msg) {
        return _super.call(this, msg) || this;
    }
    return IgnorableError;
}(Error));
exports.IgnorableError = IgnorableError;
