import { Input } from '@angular/core';
/**
 * Base class for all Ionic components. Exposes some common functionality
 * that all Ionic components need, such as accessing underlying native elements and
 * sending/receiving app-level events.
 */
/** @hidden */
var Ion = (function () {
    function Ion(config, elementRef, renderer, componentName) {
        this._config = config;
        this._elementRef = elementRef;
        this._renderer = renderer;
        this._componentName = componentName;
        if (componentName) {
            this._setComponentName();
            this._setMode(config.get('mode'));
        }
    }
    Object.defineProperty(Ion.prototype, "color", {
        get: function () {
            return this._color;
        },
        /**
         * @input {string} The color to use from your Sass `$colors` map.
         * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
         * For more information, see [Theming your App](/docs/theming/theming-your-app).
         */
        set: function (val) {
            this._setColor(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Ion.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        /**
         * @input {string} The mode determines which platform styles to use.
         * Possible values are: `"ios"`, `"md"`, or `"wp"`.
         * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
         */
        set: function (val) {
            this._setMode(val);
        },
        enumerable: true,
        configurable: true
    });
    /** @hidden */
    Ion.prototype.setElementClass = function (className, isAdd) {
        this._renderer.setElementClass(this._elementRef.nativeElement, className, isAdd);
    };
    /** @hidden */
    Ion.prototype.setElementAttribute = function (attributeName, attributeValue) {
        this._renderer.setElementAttribute(this._elementRef.nativeElement, attributeName, attributeValue);
    };
    /** @hidden */
    Ion.prototype.setElementStyle = function (property, value) {
        this._renderer.setElementStyle(this._elementRef.nativeElement, property, value);
    };
    /** @hidden */
    Ion.prototype._setColor = function (newColor, componentName) {
        if (componentName) {
            // This is needed for the item-radio
            this._componentName = componentName;
        }
        if (this._color) {
            this.setElementClass(this._componentName + "-" + this._mode + "-" + this._color, false);
        }
        if (newColor) {
            this.setElementClass(this._componentName + "-" + this._mode + "-" + newColor, true);
            this._color = newColor;
        }
    };
    /** @hidden */
    Ion.prototype._setMode = function (newMode) {
        if (this._mode) {
            this.setElementClass(this._componentName + "-" + this._mode, false);
        }
        if (newMode) {
            this.setElementClass(this._componentName + "-" + newMode, true);
            // Remove the color class associated with the previous mode,
            // change the mode, then add the new color class
            this._setColor(null);
            this._mode = newMode;
            this._setColor(this._color);
        }
    };
    /** @hidden */
    Ion.prototype._setComponentName = function () {
        this.setElementClass(this._componentName, true);
    };
    /** @hidden */
    Ion.prototype.getElementRef = function () {
        return this._elementRef;
    };
    /** @hidden */
    Ion.prototype.getNativeElement = function () {
        return this._elementRef.nativeElement;
    };
    Ion.propDecorators = {
        'color': [{ type: Input },],
        'mode': [{ type: Input },],
    };
    return Ion;
}());
export { Ion };
//# sourceMappingURL=ion.js.map