import { Component, ElementRef, HostListener, Input, NgZone, Optional, Renderer, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Config } from '../../config/config';
import { DomController } from '../../platform/dom-controller';
import { Form } from '../../util/form';
import { GestureController } from '../../gestures/gesture-controller';
import { Haptic } from '../../tap-click/haptic';
import { isTrueProperty } from '../../util/util';
import { BaseInput } from '../../util/base-input';
import { Item } from '../item/item';
import { KEY_ENTER, KEY_SPACE } from '../../platform/key';
import { Platform } from '../../platform/platform';
import { ToggleGesture } from './toggle-gesture';
/**
 * @name Toggle
 * @description
 * A toggle technically is the same thing as an HTML checkbox input,
 * except it looks different and is easier to use on a touch device.
 * Toggles can also have colors assigned to them, by adding any color
 * attribute.
 *
 * See the [Angular Docs](https://angular.io/docs/ts/latest/guide/forms.html)
 * for more info on forms and inputs.
 *
 * @usage
 * ```html
 *
 *  <ion-list>
 *
 *    <ion-item>
 *      <ion-label>Pepperoni</ion-label>
 *      <ion-toggle [(ngModel)]="pepperoni"></ion-toggle>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Sausage</ion-label>
 *      <ion-toggle [(ngModel)]="sausage" disabled="true"></ion-toggle>
 *    </ion-item>
 *
 *    <ion-item>
 *      <ion-label>Mushrooms</ion-label>
 *      <ion-toggle [(ngModel)]="mushrooms"></ion-toggle>
 *    </ion-item>
 *
 *  </ion-list>
 * ```
 *
 * @demo /docs/demos/src/toggle/
 * @see {@link /docs/components#toggle Toggle Component Docs}
 */
export class Toggle extends BaseInput {
    constructor(form, config, _plt, elementRef, renderer, _haptic, item, _gestureCtrl, _domCtrl, _zone) {
        super(config, elementRef, renderer, 'toggle', false, form, item, null);
        this._plt = _plt;
        this._haptic = _haptic;
        this._gestureCtrl = _gestureCtrl;
        this._domCtrl = _domCtrl;
        this._zone = _zone;
        this._activated = false;
    }
    /**
     * @input {boolean} If true, the element is selected.
     */
    get checked() {
        return this.value;
    }
    set checked(val) {
        this.value = val;
    }
    /**
     * @hidden
     */
    ngAfterContentInit() {
        this._initialize();
        this._gesture = new ToggleGesture(this._plt, this, this._gestureCtrl, this._domCtrl);
        this._gesture.listen();
    }
    /**
     * @hidden
     */
    _inputUpdated() { }
    /**
     * @hidden
     */
    _inputNormalize(val) {
        return isTrueProperty(val);
    }
    /**
     * @hidden
     */
    _onDragStart(startX) {
        (void 0) /* assert */;
        (void 0) /* console.debug */;
        this._zone.run(() => {
            this._startX = startX;
            this._fireFocus();
            this._activated = true;
        });
    }
    /**
     * @hidden
     */
    _onDragMove(currentX) {
        if (!this._startX) {
            (void 0) /* assert */;
            return;
        }
        if (this._shouldToggle(currentX, -15)) {
            this._zone.run(() => {
                this.value = !this.value;
                this._startX = currentX;
                this._haptic.selection();
            });
        }
    }
    /**
     * @hidden
     */
    _onDragEnd(endX) {
        if (!this._startX) {
            (void 0) /* assert */;
            return;
        }
        (void 0) /* console.debug */;
        this._zone.run(() => {
            if (this._shouldToggle(endX, 4)) {
                this.value = !this.value;
                this._haptic.selection();
            }
            this._activated = false;
            this._fireBlur();
            this._startX = null;
        });
    }
    /**
     * @hidden
     */
    _shouldToggle(currentX, margin) {
        const isLTR = !this._plt.isRTL;
        const startX = this._startX;
        if (this._value) {
            return (isLTR && (startX + margin > currentX)) ||
                (!isLTR && (startX - margin < currentX));
        }
        else {
            return (isLTR && (startX - margin < currentX)) ||
                (!isLTR && (startX + margin > currentX));
        }
    }
    /**
     * @hidden
     */
    _keyup(ev) {
        if (ev.keyCode === KEY_SPACE || ev.keyCode === KEY_ENTER) {
            (void 0) /* console.debug */;
            ev.preventDefault();
            ev.stopPropagation();
            this.value = !this.value;
        }
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        super.ngOnDestroy();
        this._gesture && this._gesture.destroy();
    }
}
Toggle.decorators = [
    { type: Component, args: [{
                selector: 'ion-toggle',
                template: '<div class="toggle-icon">' +
                    '<div class="toggle-inner"></div>' +
                    '</div>' +
                    '<button role="checkbox" ' +
                    'type="button" ' +
                    'ion-button="item-cover" ' +
                    '[id]="id" ' +
                    '[attr.aria-checked]="_value" ' +
                    '[attr.aria-labelledby]="_labelId" ' +
                    '[attr.aria-disabled]="_disabled" ' +
                    'class="item-cover" disable-activated>' +
                    '</button>',
                host: {
                    '[class.toggle-disabled]': '_disabled',
                    '[class.toggle-checked]': '_value',
                    '[class.toggle-activated]': '_activated',
                },
                providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: Toggle, multi: true }],
                encapsulation: ViewEncapsulation.None,
            },] },
];
/** @nocollapse */
Toggle.ctorParameters = () => [
    { type: Form, },
    { type: Config, },
    { type: Platform, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: Haptic, },
    { type: Item, decorators: [{ type: Optional },] },
    { type: GestureController, },
    { type: DomController, },
    { type: NgZone, },
];
Toggle.propDecorators = {
    'checked': [{ type: Input },],
    '_keyup': [{ type: HostListener, args: ['keyup', ['$event'],] },],
};
//# sourceMappingURL=toggle.js.map