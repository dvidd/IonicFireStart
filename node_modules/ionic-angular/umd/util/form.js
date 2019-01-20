(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var util_1 = require("./util");
    /**
     * @hidden
     */
    var Form = (function () {
        function Form() {
            this._focused = null;
            this._ids = -1;
            this._inputs = [];
        }
        Form.prototype.register = function (input) {
            this._inputs.push(input);
        };
        Form.prototype.deregister = function (input) {
            util_1.removeArrayItem(this._inputs, input);
            this.unsetAsFocused(input);
        };
        Form.prototype.setAsFocused = function (input) {
            this._focused = input;
        };
        Form.prototype.unsetAsFocused = function (input) {
            if (input === this._focused) {
                this._focused = null;
            }
        };
        /**
         * Focuses the next input element, if it exists.
         */
        Form.prototype.tabFocus = function (currentInput) {
            var inputs = this._inputs;
            var index = inputs.indexOf(currentInput) + 1;
            if (index > 0 && index < inputs.length) {
                var nextInput = inputs[index];
                if (nextInput !== this._focused) {
                    (void 0) /* console.debug */;
                    return nextInput.initFocus();
                }
            }
            index = inputs.indexOf(this._focused);
            if (index > 0) {
                var previousInput = inputs[index - 1];
                if (previousInput) {
                    (void 0) /* console.debug */;
                    previousInput.initFocus();
                }
            }
        };
        Form.prototype.nextId = function () {
            return ++this._ids;
        };
        Form.decorators = [
            { type: core_1.Injectable },
        ];
        /** @nocollapse */
        Form.ctorParameters = function () { return []; };
        return Form;
    }());
    exports.Form = Form;
    /**
     * @hidden
     */
    var IonicTapInput = (function () {
        function IonicTapInput() {
        }
        return IonicTapInput;
    }());
    exports.IonicTapInput = IonicTapInput;
    /**
     * @hidden
     */
    var IonicFormInput = (function () {
        function IonicFormInput() {
        }
        return IonicFormInput;
    }());
    exports.IonicFormInput = IonicFormInput;
});
//# sourceMappingURL=form.js.map