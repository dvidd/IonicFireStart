import { Injectable } from '@angular/core';
import { Platform } from '../platform/platform';
/**
 * @name Haptic
 * @description
 * The `Haptic` class interacts with a haptic engine on the device, if
 * available. Generally, Ionic components use this under the hood, but you're
 * welcome to get a bit crazy with it if you fancy.
 *
 * Currently, this uses the Taptic engine on iOS.
 *
 * @usage
 * ```ts
 * export class MyClass {
 *
 *  constructor(haptic: Haptic) {
 *    haptic.selection();
 *  }
 * }
 *
 * ```
 */
var Haptic = (function () {
    function Haptic(plt) {
        var _this = this;
        if (plt) {
            plt.ready().then(function () {
                _this._p = plt.win().TapticEngine;
            });
        }
    }
    /**
     * Check to see if the Haptic Plugin is available
     * @return {boolean} Returns true or false if the plugin is available
     *
     */
    Haptic.prototype.available = function () {
        return !!this._p;
    };
    /**
     * Trigger a selection changed haptic event. Good for one-time events
     * (not for gestures)
     */
    Haptic.prototype.selection = function () {
        this._p && this._p.selection();
    };
    /**
     * Tell the haptic engine that a gesture for a selection change is starting.
     */
    Haptic.prototype.gestureSelectionStart = function () {
        this._p && this._p.gestureSelectionStart();
    };
    /**
     * Tell the haptic engine that a selection changed during a gesture.
     */
    Haptic.prototype.gestureSelectionChanged = function () {
        this._p && this._p.gestureSelectionChanged();
    };
    /**
     * Tell the haptic engine we are done with a gesture. This needs to be
     * called lest resources are not properly recycled.
     */
    Haptic.prototype.gestureSelectionEnd = function () {
        this._p && this._p.gestureSelectionEnd();
    };
    /**
     * Use this to indicate success/failure/warning to the user.
     * options should be of the type `{ type: 'success' }` (or `warning`/`error`)
     */
    Haptic.prototype.notification = function (options) {
        this._p && this._p.notification(options);
    };
    /**
     * Use this to indicate success/failure/warning to the user.
     * options should be of the type `{ style: 'light' }` (or `medium`/`heavy`)
     */
    Haptic.prototype.impact = function (options) {
        this._p && this._p.impact(options);
    };
    Haptic.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    Haptic.ctorParameters = function () { return [
        { type: Platform, },
    ]; };
    return Haptic;
}());
export { Haptic };
//# sourceMappingURL=haptic.js.map