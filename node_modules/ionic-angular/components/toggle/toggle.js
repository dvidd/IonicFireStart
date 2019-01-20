var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Toggle = (function (_super) {
    __extends(Toggle, _super);
    function Toggle(form, config, _plt, elementRef, renderer, _haptic, item, _gestureCtrl, _domCtrl, _zone) {
        var _this = _super.call(this, config, elementRef, renderer, 'toggle', false, form, item, null) || this;
        _this._plt = _plt;
        _this._haptic = _haptic;
        _this._gestureCtrl = _gestureCtrl;
        _this._domCtrl = _domCtrl;
        _this._zone = _zone;
        _this._activated = false;
        return _this;
    }
    Object.defineProperty(Toggle.prototype, "checked", {
        /**
         * @input {boolean} If true, the element is selected.
         */
        get: function () {
            return this.value;
        },
        set: function (val) {
            this.value = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    Toggle.prototype.ngAfterContentInit = function () {
        this._initialize();
        this._gesture = new ToggleGesture(this._plt, this, this._gestureCtrl, this._domCtrl);
        this._gesture.listen();
    };
    /**
     * @hidden
     */
    Toggle.prototype._inputUpdated = function () { };
    /**
     * @hidden
     */
    Toggle.prototype._inputNormalize = function (val) {
        return isTrueProperty(val);
    };
    /**
     * @hidden
     */
    Toggle.prototype._onDragStart = function (startX) {
        var _this = this;
        (void 0) /* assert */;
        (void 0) /* console.debug */;
        this._zone.run(function () {
            _this._startX = startX;
            _this._fireFocus();
            _this._activated = true;
        });
    };
    /**
     * @hidden
     */
    Toggle.prototype._onDragMove = function (currentX) {
        var _this = this;
        if (!this._startX) {
            (void 0) /* assert */;
            return;
        }
        if (this._shouldToggle(currentX, -15)) {
            this._zone.run(function () {
                _this.value = !_this.value;
                _this._startX = currentX;
                _this._haptic.selection();
            });
        }
    };
    /**
     * @hidden
     */
    Toggle.prototype._onDragEnd = function (endX) {
        var _this = this;
        if (!this._startX) {
            (void 0) /* assert */;
            return;
        }
        (void 0) /* console.debug */;
        this._zone.run(function () {
            if (_this._shouldToggle(endX, 4)) {
                _this.value = !_this.value;
                _this._haptic.selection();
            }
            _this._activated = false;
            _this._fireBlur();
            _this._startX = null;
        });
    };
    /**
     * @hidden
     */
    Toggle.prototype._shouldToggle = function (currentX, margin) {
        var isLTR = !this._plt.isRTL;
        var startX = this._startX;
        if (this._value) {
            return (isLTR && (startX + margin > currentX)) ||
                (!isLTR && (startX - margin < currentX));
        }
        else {
            return (isLTR && (startX - margin < currentX)) ||
                (!isLTR && (startX + margin > currentX));
        }
    };
    /**
     * @hidden
     */
    Toggle.prototype._keyup = function (ev) {
        if (ev.keyCode === KEY_SPACE || ev.keyCode === KEY_ENTER) {
            (void 0) /* console.debug */;
            ev.preventDefault();
            ev.stopPropagation();
            this.value = !this.value;
        }
    };
    /**
     * @hidden
     */
    Toggle.prototype.ngOnDestroy = function () {
        _super.prototype.ngOnDestroy.call(this);
        this._gesture && this._gesture.destroy();
    };
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
    Toggle.ctorParameters = function () { return [
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
    ]; };
    Toggle.propDecorators = {
        'checked': [{ type: Input },],
        '_keyup': [{ type: HostListener, args: ['keyup', ['$event'],] },],
    };
    return Toggle;
}(BaseInput));
export { Toggle };
//# sourceMappingURL=toggle.js.map