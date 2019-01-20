import { ChangeDetectorRef, ContentChild, Directive, ElementRef, EventEmitter, Input, Output, Renderer } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListHeader } from '../list/list-header';
import { isCheckedProperty, isTrueProperty } from '../../util/util';
/**
 * @name RadioGroup
 * @description
 * A radio group is a group of [radio buttons](../RadioButton). It allows
 * a user to select at most one radio button from a set. Checking one radio
 * button that belongs to a radio group unchecks any previous checked
 * radio button within the same group.
 *
 * See the [Angular Forms Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more information on forms and inputs.
 *
 * @usage
 * ```html
 * <ion-list radio-group [(ngModel)]="autoManufacturers">
 *
 *   <ion-list-header>
 *     Auto Manufacturers
 *   </ion-list-header>
 *
 *   <ion-item>
 *     <ion-label>Cord</ion-label>
 *     <ion-radio value="cord"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Duesenberg</ion-label>
 *     <ion-radio value="duesenberg"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Hudson</ion-label>
 *     <ion-radio value="hudson"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Packard</ion-label>
 *     <ion-radio value="packard"></ion-radio>
 *   </ion-item>
 *
 *   <ion-item>
 *     <ion-label>Studebaker</ion-label>
 *     <ion-radio value="studebaker"></ion-radio>
 *   </ion-item>
 *
 * </ion-list>
 * ```
 *
 * @demo /docs/demos/src/radio/
 * @see {@link /docs/components#radio Radio Component Docs}
 * @see {@link ../RadioButton RadioButton API Docs}
*/
export class RadioGroup {
    constructor(_renderer, _elementRef, _cd) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
        this._cd = _cd;
        /**
         * @internal
         */
        this._disabled = false;
        /**
         * @hidden
         */
        this._btns = [];
        /**
         * @hidden
         */
        this._ids = -1;
        /**
         * @hidden
         */
        this._init = false;
        /**
         * @output {any} Emitted when the selected button has changed.
         */
        this.ionChange = new EventEmitter();
        this.id = ++radioGroupIds;
    }
    /**
     * @input {boolean} If true, the user cannot interact with any of the buttons in the group.
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(val) {
        this._disabled = isTrueProperty(val);
    }
    /**
     * @hidden
     */
    ngAfterContentInit() {
        let activeButton = this._btns.find(b => b.checked);
        if (activeButton) {
            this._setActive(activeButton);
        }
    }
    /**
     * @hidden
     */
    writeValue(val) {
        (void 0) /* console.debug */;
        this.value = val;
        if (this._init) {
            this._update();
            this.onTouched();
            this.ionChange.emit(val);
        }
        this._init = true;
    }
    /**
     * @hidden
     */
    registerOnChange(fn) {
        this._fn = fn;
        this.onChange = (val) => {
            // onChange used when there's an formControlName
            (void 0) /* console.debug */;
            fn(val);
            this.value = val;
            this._update();
            this.onTouched();
            this.ionChange.emit(val);
        };
    }
    /**
     * @hidden
     */
    registerOnTouched(fn) { this.onTouched = fn; }
    /**
     * @hidden
     */
    _update() {
        // loop through each of the radiobuttons
        let hasChecked = false;
        this._btns.forEach(radioButton => {
            // check this radiobutton if its value is
            // the same as the radiogroups value
            radioButton.checked = isCheckedProperty(this.value, radioButton.value) && !hasChecked;
            if (radioButton.checked) {
                // if this button is checked, then set it as
                // the radiogroup's active descendant
                this._setActive(radioButton);
                hasChecked = true;
            }
        });
    }
    /**
     * @hidden
     */
    _setActive(radioButton) {
        this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-activedescendant', radioButton.id);
    }
    /**
     * @hidden
     */
    add(button) {
        this._btns.push(button);
        // listen for radiobutton select events
        button.ionSelect.subscribe((val) => {
            // this radiobutton has been selected
            this.onChange(val);
        });
        return this.id + '-' + (++this._ids);
    }
    /**
     * @hidden
     */
    remove(button) {
        let index = this._btns.indexOf(button);
        if (index > -1) {
            if (button.value === this.value) {
                this.value = null;
            }
            this._btns.splice(index, 1);
        }
    }
    /**
     * @hidden
     */
    set _header(header) {
        if (header) {
            if (!header.id) {
                header.id = 'rg-hdr-' + this.id;
            }
            this._renderer.setElementAttribute(this._elementRef.nativeElement, 'aria-describedby', header.id);
        }
    }
    /**
     * @hidden
     */
    onChange(val) {
        // onChange used when there is not an formControlName
        (void 0) /* console.debug */;
        this.value = val;
        this._update();
        this.onTouched();
        this.ionChange.emit(val);
        this._cd.detectChanges();
    }
    /**
     * @hidden
     */
    onTouched() { }
    /**
     * @hidden
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
}
RadioGroup.decorators = [
    { type: Directive, args: [{
                selector: '[radio-group]',
                host: {
                    'role': 'radiogroup'
                },
                providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: RadioGroup, multi: true }],
            },] },
];
/** @nocollapse */
RadioGroup.ctorParameters = () => [
    { type: Renderer, },
    { type: ElementRef, },
    { type: ChangeDetectorRef, },
];
RadioGroup.propDecorators = {
    'disabled': [{ type: Input },],
    'ionChange': [{ type: Output },],
    '_header': [{ type: ContentChild, args: [ListHeader,] },],
};
let radioGroupIds = -1;
//# sourceMappingURL=radio-group.js.map