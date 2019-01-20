(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../util/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var util_1 = require("../../util/util");
    /**
     * @name Option
     * @description
     * `ion-option` is a child component of `ion-select`. Similar to the native option element, `ion-option` can take a value and a selected property.
     *
     * @demo /docs/demos/src/select/
     */
    var Option = (function () {
        function Option(_elementRef) {
            this._elementRef = _elementRef;
            this._selected = false;
            this._disabled = false;
            /**
             * @output {any} Event to evaluate when option is selected.
             */
            this.ionSelect = new core_1.EventEmitter();
        }
        Object.defineProperty(Option.prototype, "disabled", {
            /**
             * @input {boolean} If true, the user cannot interact with this element.
             */
            get: function () {
                return this._disabled;
            },
            set: function (val) {
                this._disabled = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Option.prototype, "selected", {
            /**
             * @input {boolean} If true, the element is selected.
             */
            get: function () {
                return this._selected;
            },
            set: function (val) {
                this._selected = util_1.isTrueProperty(val);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Option.prototype, "value", {
            /**
             * @input {any} The value of the option.
             */
            get: function () {
                if (util_1.isPresent(this._value)) {
                    return this._value;
                }
                return this.text;
            },
            set: function (val) {
                this._value = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Option.prototype, "text", {
            /**
             * @hidden
             */
            get: function () {
                return this._elementRef.nativeElement.textContent;
            },
            enumerable: true,
            configurable: true
        });
        Option.decorators = [
            { type: core_1.Directive, args: [{
                        selector: 'ion-option'
                    },] },
        ];
        /** @nocollapse */
        Option.ctorParameters = function () { return [
            { type: core_1.ElementRef, },
        ]; };
        Option.propDecorators = {
            'disabled': [{ type: core_1.Input },],
            'selected': [{ type: core_1.Input },],
            'value': [{ type: core_1.Input },],
            'ionSelect': [{ type: core_1.Output },],
        };
        return Option;
    }());
    exports.Option = Option;
});
//# sourceMappingURL=option.js.map