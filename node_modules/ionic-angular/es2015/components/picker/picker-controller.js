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
export class PickerController {
    constructor(_app, config) {
        this._app = _app;
        this.config = config;
    }
    /**
     * Open a picker.
     */
    create(opts = {}) {
        return new Picker(this._app, opts, this.config);
    }
}
PickerController.decorators = [
    { type: Injectable },
];
/** @nocollapse */
PickerController.ctorParameters = () => [
    { type: App, },
    { type: Config, },
];
//# sourceMappingURL=picker-controller.js.map