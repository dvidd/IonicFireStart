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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../util/util", "./popover-component", "./popover-transitions", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require("../../util/util");
    var popover_component_1 = require("./popover-component");
    var popover_transitions_1 = require("./popover-transitions");
    var view_controller_1 = require("../../navigation/view-controller");
    /**
     * @hidden
     */
    var PopoverImpl = (function (_super) {
        __extends(PopoverImpl, _super);
        function PopoverImpl(app, component, data, opts, config) {
            if (data === void 0) { data = {}; }
            if (opts === void 0) { opts = {}; }
            var _this = this;
            opts.showBackdrop = util_1.isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
            opts.enableBackdropDismiss = util_1.isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
            data.component = component;
            data.opts = opts;
            _this = _super.call(this, popover_component_1.PopoverCmp, data, null) || this;
            _this._app = app;
            _this.isOverlay = true;
            config.setTransition('popover-pop-in', popover_transitions_1.PopoverPopIn);
            config.setTransition('popover-pop-out', popover_transitions_1.PopoverPopOut);
            config.setTransition('popover-md-pop-in', popover_transitions_1.PopoverMdPopIn);
            config.setTransition('popover-md-pop-out', popover_transitions_1.PopoverMdPopOut);
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
    }(view_controller_1.ViewController));
    exports.PopoverImpl = PopoverImpl;
});
//# sourceMappingURL=popover-impl.js.map