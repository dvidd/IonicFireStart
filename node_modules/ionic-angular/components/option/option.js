import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { isPresent, isTrueProperty } from '../../util/util';
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
        this.ionSelect = new EventEmitter();
    }
    Object.defineProperty(Option.prototype, "disabled", {
        /**
         * @input {boolean} If true, the user cannot interact with this element.
         */
        get: function () {
            return this._disabled;
        },
        set: function (val) {
            this._disabled = isTrueProperty(val);
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
            this._selected = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Option.prototype, "value", {
        /**
         * @input {any} The value of the option.
         */
        get: function () {
            if (isPresent(this._value)) {
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
        { type: Directive, args: [{
                    selector: 'ion-option'
                },] },
    ];
    /** @nocollapse */
    Option.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    Option.propDecorators = {
        'disabled': [{ type: Input },],
        'selected': [{ type: Input },],
        'value': [{ type: Input },],
        'ionSelect': [{ type: Output },],
    };
    return Option;
}());
export { Option };
//# sourceMappingURL=option.js.map