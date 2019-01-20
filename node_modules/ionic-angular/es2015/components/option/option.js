import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { isPresent, isTrueProperty } from '../../util/util';
/**
 * @name Option
 * @description
 * `ion-option` is a child component of `ion-select`. Similar to the native option element, `ion-option` can take a value and a selected property.
 *
 * @demo /docs/demos/src/select/
 */
export class Option {
    constructor(_elementRef) {
        this._elementRef = _elementRef;
        this._selected = false;
        this._disabled = false;
        /**
         * @output {any} Event to evaluate when option is selected.
         */
        this.ionSelect = new EventEmitter();
    }
    /**
     * @input {boolean} If true, the user cannot interact with this element.
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(val) {
        this._disabled = isTrueProperty(val);
    }
    /**
     * @input {boolean} If true, the element is selected.
     */
    get selected() {
        return this._selected;
    }
    set selected(val) {
        this._selected = isTrueProperty(val);
    }
    /**
     * @input {any} The value of the option.
     */
    get value() {
        if (isPresent(this._value)) {
            return this._value;
        }
        return this.text;
    }
    set value(val) {
        this._value = val;
    }
    /**
     * @hidden
     */
    get text() {
        return this._elementRef.nativeElement.textContent;
    }
}
Option.decorators = [
    { type: Directive, args: [{
                selector: 'ion-option'
            },] },
];
/** @nocollapse */
Option.ctorParameters = () => [
    { type: ElementRef, },
];
Option.propDecorators = {
    'disabled': [{ type: Input },],
    'selected': [{ type: Input },],
    'value': [{ type: Input },],
    'ionSelect': [{ type: Output },],
};
//# sourceMappingURL=option.js.map