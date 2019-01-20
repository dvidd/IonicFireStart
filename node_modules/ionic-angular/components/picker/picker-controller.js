import { Injectable } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { Picker } from './picker';
/**
 * @hidden
 * @name PickerController
 * @description
 *
 */
var PickerController = (function () {
    function PickerController(_app, config) {
        this._app = _app;
        this.config = config;
    }
    /**
     * Open a picker.
     */
    PickerController.prototype.create = function (opts) {
        if (opts === void 0) { opts = {}; }
        return new Picker(this._app, opts, this.config);
    };
    PickerController.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    PickerController.ctorParameters = function () { return [
        { type: App, },
        { type: Config, },
    ]; };
    return PickerController;
}());
export { PickerController };
//# sourceMappingURL=picker-controller.js.map