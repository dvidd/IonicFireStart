/**
 * Adopted from FastDom
 * https://github.com/wilsonpage/fastdom
 * MIT License
 */
import { Injectable } from '@angular/core';
import { Platform } from './platform';
import { removeArrayItem } from '../util/util';
/**
 * @hidden
 */
var DomDebouncer = (function () {
    function DomDebouncer(dom) {
        this.dom = dom;
        this.writeTask = null;
        this.readTask = null;
    }
    DomDebouncer.prototype.read = function (fn) {
        var _this = this;
        if (this.readTask) {
            return;
        }
        return this.readTask = this.dom.read(function (t) {
            _this.readTask = null;
            fn(t);
        });
    };
    DomDebouncer.prototype.write = function (fn) {
        var _this = this;
        if (this.writeTask) {
            return;
        }
        return this.writeTask = this.dom.write(function (t) {
            _this.writeTask = null;
            fn(t);
        });
    };
    DomDebouncer.prototype.cancel = function () {
        var writeTask = this.writeTask;
        writeTask && this.dom.cancel(writeTask);
        var readTask = this.readTask;
        readTask && this.dom.cancel(readTask);
        this.readTask = this.writeTask = null;
    };
    return DomDebouncer;
}());
export { DomDebouncer };
/**
 * @hidden
 */
var DomController = (function () {
    function DomController(plt) {
        this.plt = plt;
        this.r = [];
        this.w = [];
    }
    DomController.prototype.debouncer = function () {
        return new DomDebouncer(this);
    };
    DomController.prototype.read = function (fn, timeout) {
        var _this = this;
        if (timeout) {
            fn.timeoutId = this.plt.timeout(function () {
                _this.r.push(fn);
                _this._queue();
            }, timeout);
        }
        else {
            this.r.push(fn);
            this._queue();
        }
        return fn;
    };
    DomController.prototype.write = function (fn, timeout) {
        var _this = this;
        if (timeout) {
            fn.timeoutId = this.plt.timeout(function () {
                _this.w.push(fn);
                _this._queue();
            }, timeout);
        }
        else {
            this.w.push(fn);
            this._queue();
        }
        return fn;
    };
    DomController.prototype.cancel = function (fn) {
        if (fn) {
            if (fn.timeoutId) {
                this.plt.cancelTimeout(fn.timeoutId);
            }
            removeArrayItem(this.r, fn) || removeArrayItem(this.w, fn);
        }
    };
    DomController.prototype._queue = function () {
        var self = this;
        if (!self.q) {
            self.q = true;
            self.plt.raf(function rafCallback(timeStamp) {
                self._flush(timeStamp);
            });
        }
    };
    DomController.prototype._flush = function (timeStamp) {
        var err;
        try {
            dispatch(timeStamp, this.r, this.w);
        }
        catch (e) {
            err = e;
        }
        this.q = false;
        if (this.r.length || this.w.length) {
            this._queue();
        }
        if (err) {
            throw err;
        }
    };
    DomController.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DomController.ctorParameters = function () { return [
        { type: Platform, },
    ]; };
    return DomController;
}());
export { DomController };
function dispatch(timeStamp, r, w) {
    var fn;
    // ******** DOM READS ****************
    while (fn = r.shift()) {
        fn(timeStamp);
    }
    // ******** DOM WRITES ****************
    while (fn = w.shift()) {
        fn(timeStamp);
    }
}
//# sourceMappingURL=dom-controller.js.map