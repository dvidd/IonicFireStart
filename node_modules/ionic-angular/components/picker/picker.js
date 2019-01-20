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
import { EventEmitter, Output } from '@angular/core';
import { isPresent } from '../../util/util';
import { PickerCmp } from './picker-component';
import { PickerSlideIn, PickerSlideOut } from './picker-transitions';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
var Picker = (function (_super) {
    __extends(Picker, _super);
    function Picker(app, opts, config) {
        if (opts === void 0) { opts = {}; }
        var _this = this;
        if (!opts) {
            opts = {};
        }
        opts.columns = opts.columns || [];
        opts.buttons = opts.buttons || [];
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? Boolean(opts.enableBackdropDismiss) : true;
        _this = _super.call(this, PickerCmp, opts, null) || this;
        _this._app = app;
        _this.isOverlay = true;
        _this.ionChange = new EventEmitter();
        config.setTransition('picker-slide-in', PickerSlideIn);
        config.setTransition('picker-slide-out', PickerSlideOut);
        return _this;
    }
    /**
    * @hidden
    */
    Picker.prototype.getTransitionName = function (direction) {
        var key = (direction === 'back' ? 'pickerLeave' : 'pickerEnter');
        return this._nav && this._nav.config.get(key);
    };
    /**
     * @param {any} button Picker toolbar button
     */
    Picker.prototype.addButton = function (button) {
        this.data.buttons.push(button);
    };
    /**
     * @param {PickerColumn} column Picker toolbar button
     */
    Picker.prototype.addColumn = function (column) {
        this.data.columns.push(column);
    };
    Picker.prototype.getColumns = function () {
        return this.data.columns;
    };
    Picker.prototype.getColumn = function (name) {
        return this.getColumns().find(function (column) { return column.name === name; });
    };
    Picker.prototype.refresh = function () {
        (void 0) /* assert */;
        (void 0) /* assert */;
        this._cmp && this._cmp.instance.refresh && this._cmp.instance.refresh();
    };
    /**
     * @param {string} cssClass CSS class name to add to the picker's outer wrapper.
     */
    Picker.prototype.setCssClass = function (cssClass) {
        this.data.cssClass = cssClass;
    };
    /**
     * Present the picker instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    Picker.prototype.present = function (navOptions) {
        if (navOptions === void 0) { navOptions = {}; }
        return this._app.present(this, navOptions);
    };
    Picker.propDecorators = {
        'ionChange': [{ type: Output },],
    };
    return Picker;
}(ViewController));
export { Picker };
//# sourceMappingURL=picker.js.map