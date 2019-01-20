import { EventEmitter, Input, Output } from '@angular/core';
import { deepCopy, isArray, isPresent, isString, isTrueProperty, isUndefined } from './util';
import { Ion } from '../components/ion';
import { TimeoutDebouncer } from './debouncer';
export class BaseInput extends Ion {
    constructor(config, elementRef, renderer, name, _defaultValue, _form, _item, _ngControl) {
        super(config, elementRef, renderer, name);
        this._defaultValue = _defaultValue;
        this._form = _form;
        this._item = _item;
        this._ngControl = _ngControl;
        this._isFocus = false;
        this._disabled = false;
        this._debouncer = new TimeoutDebouncer(0);
        this._init = false;
        this._initModel = false;
        /**
         * @output {Range} Emitted when the range selector drag starts.
         */
        this.ionFocus = new EventEmitter();
        /**
         * @output {Range} Emitted when the range value changes.
         */
        this.ionChange = new EventEmitter();
        /**
         * @output {Range} Emitted when the range selector drag ends.
         */
        this.ionBlur = new EventEmitter();
        _form && _form.register(this);
        this._value = deepCopy(this._defaultValue);
        if (_item) {
            (void 0) /* assert */;
            this.id = name + '-' + _item.registerInput(name);
            this._labelId = _item.labelId;
            this._item.setElementClass('item-' + name, true);
        }
        // If the user passed a ngControl we need to set the valueAccessor
        if (_ngControl) {
            _ngControl.valueAccessor = this;
        }
    }
    /**
     * @input {boolean} If true, the user cannot interact with this element.
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(val) {
        this.setDisabledState(val);
    }
    get value() {
        return this._value;
    }
    set value(val) {
        if (this._writeValue(val)) {
            this.onChange();
            this._fireIonChange();
        }
    }
    // 1. Updates the value
    // 2. Calls _inputUpdated()
    // 3. Dispatch onChange events
    setValue(val) {
        this.value = val;
    }
    /**
     * @hidden
     */
    setDisabledState(isDisabled) {
        this._disabled = isDisabled = isTrueProperty(isDisabled);
        this._item && this._item.setElementClass(`item-${this._componentName}-disabled`, isDisabled);
    }
    /**
     * @hidden
     */
    writeValue(val) {
        if (this._writeValue(val)) {
            if (this._initModel) {
                this._fireIonChange();
            }
            else if (this._init) {
                // ngModel fires the first time too late, we need to skip the first ngModel update
                this._initModel = true;
            }
        }
    }
    /**
     * @hidden
     */
    _writeValue(val) {
        (void 0) /* assert */;
        if (isUndefined(val)) {
            return false;
        }
        const normalized = (val === null)
            ? deepCopy(this._defaultValue)
            : this._inputNormalize(val);
        const notUpdate = isUndefined(normalized) || !this._inputShouldChange(normalized);
        if (notUpdate) {
            return false;
        }
        (void 0) /* console.debug */;
        this._value = normalized;
        if (this._init) {
            this._inputUpdated();
        }
        return true;
    }
    /**
     * @hidden
     */
    _fireIonChange() {
        if (this._init) {
            this._debouncer.debounce(() => {
                (void 0) /* assert */;
                this.ionChange.emit(this._inputChangeEvent());
                this._initModel = true;
            });
        }
    }
    /**
     * @hidden
     */
    registerOnChange(fn) {
        this._onChanged = fn;
    }
    /**
     * @hidden
     */
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    /**
     * @hidden
     */
    _initialize() {
        if (this._init) {
            (void 0) /* assert */;
            return;
        }
        this._init = true;
        if (isPresent(this._value)) {
            this._inputUpdated();
        }
    }
    /**
     * @hidden
     */
    _fireFocus() {
        if (this._isFocus) {
            return;
        }
        (void 0) /* console.debug */;
        this._form && this._form.setAsFocused(this);
        this._setFocus(true);
        this.ionFocus.emit(this);
    }
    /**
     * @hidden
     */
    _fireBlur() {
        if (!this._isFocus) {
            return;
        }
        (void 0) /* console.debug */;
        this._form && this._form.unsetAsFocused(this);
        this._setFocus(false);
        this._fireTouched();
        this.ionBlur.emit(this);
    }
    /**
     * @hidden
     */
    _fireTouched() {
        this._onTouched && this._onTouched();
    }
    /**
     * @hidden
     */
    _setFocus(isFocused) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        (void 0) /* assert */;
        this._isFocus = isFocused;
        const item = this._item;
        if (item) {
            item.setElementClass('input-has-focus', isFocused);
            item.setElementClass('item-input-has-focus', isFocused);
        }
        this._inputUpdated();
    }
    /**
     * @hidden
     */
    onChange() {
        this._onChanged && this._onChanged(this._inputNgModelEvent());
    }
    /**
     * @hidden
     */
    isFocus() {
        return this._isFocus;
    }
    /**
     * @hidden
     */
    hasValue() {
        const val = this._value;
        if (!isPresent(val)) {
            return false;
        }
        if (isArray(val) || isString(val)) {
            return val.length > 0;
        }
        return true;
    }
    /**
     * @hidden
     */
    focusNext() {
        this._form && this._form.tabFocus(this);
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        (void 0) /* assert */;
        const form = this._form;
        form && form.deregister(this);
        this._init = false;
    }
    /**
     * @hidden
     */
    ngAfterContentInit() {
        this._initialize();
    }
    /**
     * @hidden
     */
    initFocus() {
        const ele = this._elementRef.nativeElement.querySelector('button');
        ele && ele.focus();
    }
    /**
     * @hidden
     */
    _inputNormalize(val) {
        return val;
    }
    /**
     * @hidden
     */
    _inputShouldChange(val) {
        return this._value !== val;
    }
    /**
     * @hidden
     */
    _inputChangeEvent() {
        return this;
    }
    /**
     * @hidden
     */
    _inputNgModelEvent() {
        return this._value;
    }
    /**
     * @hidden
     */
    _inputUpdated() {
        (void 0) /* assert */;
        const item = this._item;
        if (item) {
            setControlCss(item, this._ngControl);
            // TODO remove all uses of input-has-value in v4
            let hasValue = this.hasValue();
            item.setElementClass('input-has-value', hasValue);
            item.setElementClass('item-input-has-value', hasValue);
        }
    }
}
BaseInput.propDecorators = {
    'ionFocus': [{ type: Output },],
    'ionChange': [{ type: Output },],
    'ionBlur': [{ type: Output },],
    'disabled': [{ type: Input },],
};
function setControlCss(element, control) {
    if (!control) {
        return;
    }
    element.setElementClass('ng-untouched', control.untouched);
    element.setElementClass('ng-touched', control.touched);
    element.setElementClass('ng-pristine', control.pristine);
    element.setElementClass('ng-dirty', control.dirty);
    element.setElementClass('ng-valid', control.valid);
    element.setElementClass('ng-invalid', !control.valid);
}
//# sourceMappingURL=base-input.js.map