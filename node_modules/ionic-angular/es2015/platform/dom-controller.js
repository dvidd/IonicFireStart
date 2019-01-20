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
export class DomDebouncer {
    constructor(dom) {
        this.dom = dom;
        this.writeTask = null;
        this.readTask = null;
    }
    read(fn) {
        if (this.readTask) {
            return;
        }
        return this.readTask = this.dom.read((t) => {
            this.readTask = null;
            fn(t);
        });
    }
    write(fn) {
        if (this.writeTask) {
            return;
        }
        return this.writeTask = this.dom.write((t) => {
            this.writeTask = null;
            fn(t);
        });
    }
    cancel() {
        const writeTask = this.writeTask;
        writeTask && this.dom.cancel(writeTask);
        const readTask = this.readTask;
        readTask && this.dom.cancel(readTask);
        this.readTask = this.writeTask = null;
    }
}
/**
 * @hidden
 */
export class DomController {
    constructor(plt) {
        this.plt = plt;
        this.r = [];
        this.w = [];
    }
    debouncer() {
        return new DomDebouncer(this);
    }
    read(fn, timeout) {
        if (timeout) {
            fn.timeoutId = this.plt.timeout(() => {
                this.r.push(fn);
                this._queue();
            }, timeout);
        }
        else {
            this.r.push(fn);
            this._queue();
        }
        return fn;
    }
    write(fn, timeout) {
        if (timeout) {
            fn.timeoutId = this.plt.timeout(() => {
                this.w.push(fn);
                this._queue();
            }, timeout);
        }
        else {
            this.w.push(fn);
            this._queue();
        }
        return fn;
    }
    cancel(fn) {
        if (fn) {
            if (fn.timeoutId) {
                this.plt.cancelTimeout(fn.timeoutId);
            }
            removeArrayItem(this.r, fn) || removeArrayItem(this.w, fn);
        }
    }
    _queue() {
        const self = this;
        if (!self.q) {
            self.q = true;
            self.plt.raf(function rafCallback(timeStamp) {
                self._flush(timeStamp);
            });
        }
    }
    _flush(timeStamp) {
        let err;
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
    }
}
DomController.decorators = [
    { type: Injectable },
];
/** @nocollapse */
DomController.ctorParameters = () => [
    { type: Platform, },
];
function dispatch(timeStamp, r, w) {
    let fn;
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