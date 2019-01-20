import { EventEmitter, Output } from '@angular/core';
import { isPresent } from '../../util/util';
import { PickerCmp } from './picker-component';
import { PickerSlideIn, PickerSlideOut } from './picker-transitions';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export class Picker extends ViewController {
    constructor(app, opts = {}, config) {
        if (!opts) {
            opts = {};
        }
        opts.columns = opts.columns || [];
        opts.buttons = opts.buttons || [];
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? Boolean(opts.enableBackdropDismiss) : true;
        super(PickerCmp, opts, null);
        this._app = app;
        this.isOverlay = true;
        this.ionChange = new EventEmitter();
        config.setTransition('picker-slide-in', PickerSlideIn);
        config.setTransition('picker-slide-out', PickerSlideOut);
    }
    /**
    * @hidden
    */
    getTransitionName(direction) {
        let key = (direction === 'back' ? 'pickerLeave' : 'pickerEnter');
        return this._nav && this._nav.config.get(key);
    }
    /**
     * @param {any} button Picker toolbar button
     */
    addButton(button) {
        this.data.buttons.push(button);
    }
    /**
     * @param {PickerColumn} column Picker toolbar button
     */
    addColumn(column) {
        this.data.columns.push(column);
    }
    getColumns() {
        return this.data.columns;
    }
    getColumn(name) {
        return this.getColumns().find(column => column.name === name);
    }
    refresh() {
        (void 0) /* assert */;
        (void 0) /* assert */;
        this._cmp && this._cmp.instance.refresh && this._cmp.instance.refresh();
    }
    /**
     * @param {string} cssClass CSS class name to add to the picker's outer wrapper.
     */
    setCssClass(cssClass) {
        this.data.cssClass = cssClass;
    }
    /**
     * Present the picker instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    present(navOptions = {}) {
        return this._app.present(this, navOptions);
    }
}
Picker.propDecorators = {
    'ionChange': [{ type: Output },],
};
//# sourceMappingURL=picker.js.map