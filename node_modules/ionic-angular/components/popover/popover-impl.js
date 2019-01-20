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
import { isPresent } from '../../util/util';
import { PopoverCmp } from './popover-component';
import { PopoverMdPopIn, PopoverMdPopOut, PopoverPopIn, PopoverPopOut } from './popover-transitions';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
var PopoverImpl = (function (_super) {
    __extends(PopoverImpl, _super);
    function PopoverImpl(app, component, data, opts, config) {
        if (data === void 0) { data = {}; }
        if (opts === void 0) { opts = {}; }
        var _this = this;
        opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
        data.component = component;
        data.opts = opts;
        _this = _super.call(this, PopoverCmp, data, null) || this;
        _this._app = app;
        _this.isOverlay = true;
        config.setTransition('popover-pop-in', PopoverPopIn);
        config.setTransition('popover-pop-out', PopoverPopOut);
        config.setTransition('popover-md-pop-in', PopoverMdPopIn);
        config.setTransition('popover-md-pop-out', PopoverMdPopOut);
        return _this;
    }
    /**
     * @hidden
     */
    PopoverImpl.prototype.getTransitionName = function (direction) {
        var key = (direction === 'back' ? 'popoverLeave' : 'popoverEnter');
        return this._nav && this._nav.config.get(key);
    };
    /**
     * Present the popover instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    PopoverImpl.prototype.present = function (navOptions) {
        if (navOptions === void 0) { navOptions = {}; }
        return this._app.present(this, navOptions);
    };
    return PopoverImpl;
}(ViewController));
export { PopoverImpl };
//# sourceMappingURL=popover-impl.js.map