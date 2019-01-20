import { Injectable } from '@angular/core';
import { removeArrayItem } from './util';
/**
 * @hidden
 */
export class Form {
    constructor() {
        this._focused = null;
        this._ids = -1;
        this._inputs = [];
    }
    register(input) {
        this._inputs.push(input);
    }
    deregister(input) {
        removeArrayItem(this._inputs, input);
        this.unsetAsFocused(input);
    }
    setAsFocused(input) {
        this._focused = input;
    }
    unsetAsFocused(input) {
        if (input === this._focused) {
            this._focused = null;
        }
    }
    /**
     * Focuses the next input element, if it exists.
     */
    tabFocus(currentInput) {
        const inputs = this._inputs;
        let index = inputs.indexOf(currentInput) + 1;
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
    }
    nextId() {
        return ++this._ids;
    }
}
Form.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Form.ctorParameters = () => [];
/**
 * @hidden
 */
export class IonicTapInput {
}
/**
 * @hidden
 */
export class IonicFormInput {
}
//# sourceMappingURL=form.js.map