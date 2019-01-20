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
    /**
     * @hidden
     * Given a min and max, restrict the given number
     * to the range.
     * @param min the minimum
     * @param n the value
     * @param max the maximum
     */
    function clamp(min, n, max) {
        return Math.max(min, Math.min(n, max));
    }
    exports.clamp = clamp;
    /** @hidden */
    function deepCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }
    exports.deepCopy = deepCopy;
    /** @hidden */
    function deepEqual(a, b) {
        if (a === b) {
            return true;
        }
        return JSON.stringify(a) === JSON.stringify(b);
    }
    exports.deepEqual = deepEqual;
    /** @hidden */
    function debounce(fn, wait, immediate) {
        if (immediate === void 0) { immediate = false; }
        var timeout, args, context, timestamp, result;
        return function () {
            context = this;
            args = arguments;
            timestamp = Date.now();
            var later = function () {
                var last = Date.now() - timestamp;
                if (last < wait) {
                    timeout = setTimeout(later, wait - last);
                }
                else {
                    timeout = null;
                    if (!immediate)
                        result = fn.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow)
                result = fn.apply(context, args);
            return result;
        };
    }
    exports.debounce = debounce;
    /**
     * @hidden
     * Rewrites an absolute URL so it works across file and http based engines
     */
    function normalizeURL(url) {
        var ionic = window['Ionic'];
        if (ionic && ionic.normalizeURL) {
            return ionic.normalizeURL(url);
        }
        return url;
    }
    exports.normalizeURL = normalizeURL;
    /**
     * @hidden
     * Apply default arguments if they don't exist in
     * the first object.
     * @param {any} dest the destination to apply defaults to.
     */
    function defaults(dest) {
        var _args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _args[_i - 1] = arguments[_i];
        }
        for (var i = arguments.length - 1; i >= 1; i--) {
            var source = arguments[i];
            if (source) {
                for (var key in source) {
                    if (source.hasOwnProperty(key) && !dest.hasOwnProperty(key)) {
                        dest[key] = source[key];
                    }
                }
            }
        }
        return dest;
    }
    exports.defaults = defaults;
    /** @hidden */
    function isBoolean(val) { return typeof val === 'boolean'; }
    exports.isBoolean = isBoolean;
    /** @hidden */
    function isString(val) { return typeof val === 'string'; }
    exports.isString = isString;
    /** @hidden */
    function isNumber(val) { return typeof val === 'number'; }
    exports.isNumber = isNumber;
    /** @hidden */
    function isFunction(val) { return typeof val === 'function'; }
    exports.isFunction = isFunction;
    /** @hidden */
    function isDefined(val) { return typeof val !== 'undefined'; }
    exports.isDefined = isDefined;
    /** @hidden */
    function isUndefined(val) { return typeof val === 'undefined'; }
    exports.isUndefined = isUndefined;
    /** @hidden */
    function isPresent(val) { return val !== undefined && val !== null; }
    exports.isPresent = isPresent;
    /** @hidden */
    function isBlank(val) { return val === undefined || val === null; }
    exports.isBlank = isBlank;
    /** @hidden */
    function isObject(val) { return typeof val === 'object'; }
    exports.isObject = isObject;
    /** @hidden */
    function isArray(val) { return Array.isArray(val); }
    exports.isArray = isArray;
    /** @hidden */
    function isPrimitive(val) {
        return isString(val) || isBoolean(val) || (isNumber(val) && !isNaN(val));
    }
    exports.isPrimitive = isPrimitive;
    /** @hidden */
    function isTrueProperty(val) {
        if (typeof val === 'string') {
            val = val.toLowerCase().trim();
            return (val === 'true' || val === 'on' || val === '');
        }
        return !!val;
    }
    exports.isTrueProperty = isTrueProperty;
    /** @hidden */
    function isCheckedProperty(a, b) {
        if (a === undefined || a === null || a === '') {
            return (b === undefined || b === null || b === '');
        }
        else if (a === true || a === 'true') {
            return (b === true || b === 'true');
        }
        else if (a === false || a === 'false') {
            return (b === false || b === 'false');
        }
        else if (a === 0 || a === '0') {
            return (b === 0 || b === '0');
        }
        // not using strict comparison on purpose
        return (a == b); // tslint:disable-line
    }
    exports.isCheckedProperty = isCheckedProperty;
    /**
     * @hidden
     * Given a side, return if it should be on the right
     * based on the value of dir
     * @param side the side
     * @param isRTL whether the application dir is rtl
     * @param defaultRight whether the default side is right
     */
    function isRightSide(side, isRTL, defaultRight) {
        if (defaultRight === void 0) { defaultRight = false; }
        switch (side) {
            case 'right': return true;
            case 'left': return false;
            case 'end': return !isRTL;
            case 'start': return isRTL;
            default: return defaultRight ? !isRTL : isRTL;
        }
    }
    exports.isRightSide = isRightSide;
    /** @hidden */
    function reorderArray(array, indexes) {
        var element = array[indexes.from];
        array.splice(indexes.from, 1);
        array.splice(indexes.to, 0, element);
        return array;
    }
    exports.reorderArray = reorderArray;
    /** @hidden */
    function removeArrayItem(array, item) {
        var index = array.indexOf(item);
        return !!~index && !!array.splice(index, 1);
    }
    exports.removeArrayItem = removeArrayItem;
    /** @hidden */
    function swipeShouldReset(isResetDirection, isMovingFast, isOnResetZone) {
        // The logic required to know when the sliding item should close (openAmount=0)
        // depends on three booleans (isCloseDirection, isMovingFast, isOnCloseZone)
        // and it ended up being too complicated to be written manually without errors
        // so the truth table is attached below: (0=false, 1=true)
        // isCloseDirection | isMovingFast | isOnCloseZone || shouldClose
        //         0        |       0      |       0       ||    0
        //         0        |       0      |       1       ||    1
        //         0        |       1      |       0       ||    0
        //         0        |       1      |       1       ||    0
        //         1        |       0      |       0       ||    0
        //         1        |       0      |       1       ||    1
        //         1        |       1      |       0       ||    1
        //         1        |       1      |       1       ||    1
        // The resulting expression was generated by resolving the K-map (Karnaugh map):
        var shouldClose = (!isMovingFast && isOnResetZone) || (isResetDirection && isMovingFast);
        return shouldClose;
    }
    exports.swipeShouldReset = swipeShouldReset;
    /** @hidden */
    var ASSERT_ENABLED = true;
    /** @hidden */
    function _runInDev(fn) {
        if (ASSERT_ENABLED === true) {
            return fn();
        }
    }
    exports.runInDev = _runInDev;
    /** @hidden */
    function _assert(actual, reason) {
        if (!actual && ASSERT_ENABLED === true) {
            var message = 'IONIC ASSERT: ' + reason;
            console.error(message);
            debugger; // tslint:disable-line
            throw new Error(message);
        }
    }
    exports.assert = _assert;
    /** @hidden */
    function requestIonicCallback(functionToLazy) {
        if ('requestIdleCallback' in window) {
            return window.requestIdleCallback(functionToLazy);
        }
        else {
            return setTimeout(functionToLazy, 500);
        }
    }
    exports.requestIonicCallback = requestIonicCallback;
});
//# sourceMappingURL=util.js.map