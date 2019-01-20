(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TimeoutDebouncer = (function () {
        function TimeoutDebouncer(wait) {
            this.wait = wait;
            this.timer = null;
        }
        TimeoutDebouncer.prototype.debounce = function (callback) {
            this.callback = callback;
            this.schedule();
        };
        TimeoutDebouncer.prototype.schedule = function () {
            this.cancel();
            if (this.wait <= 0) {
                this.callback();
            }
            else {
                this.timer = setTimeout(this.callback, this.wait);
            }
        };
        TimeoutDebouncer.prototype.cancel = function () {
            if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        };
        return TimeoutDebouncer;
    }());
    exports.TimeoutDebouncer = TimeoutDebouncer;
});
//# sourceMappingURL=debouncer.js.map