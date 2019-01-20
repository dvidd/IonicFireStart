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
        define(["require", "exports", "../../util/util", "../app/app-constants", "./loading-component", "./loading-transitions", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require("../../util/util");
    var app_constants_1 = require("../app/app-constants");
    var loading_component_1 = require("./loading-component");
    var loading_transitions_1 = require("./loading-transitions");
    var view_controller_1 = require("../../navigation/view-controller");
    /**
     * @hidden
     */
    var Loading = (function (_super) {
        __extends(Loading, _super);
        function Loading(app, opts, config) {
            if (opts === void 0) { opts = {}; }
            var _this = this;
            opts.showBackdrop = util_1.isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
            opts.enableBackdropDismiss = util_1.isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : false;
            opts.dismissOnPageChange = util_1.isPresent(opts.dismissOnPageChange) ? !!opts.dismissOnPageChange : false;
            _this = _super.call(this, loading_component_1.LoadingCmp, opts, null) || this;
            _this._app = app;
            _this.isOverlay = true;
            config.setTransition('loading-pop-in', loading_transitions_1.LoadingPopIn);
            config.setTransition('loading-pop-out', loading_transitions_1.LoadingPopOut);
            config.setTransition('loading-md-pop-in', loading_transitions_1.LoadingMdPopIn);
            config.setTransition('loading-md-pop-out', loading_transitions_1.LoadingMdPopOut);
            config.setTransition('loading-wp-pop-in', loading_transitions_1.LoadingWpPopIn);
            config.setTransition('loading-wp-pop-out', loading_transitions_1.LoadingWpPopOut);
            return _this;
        }
        /**
         * @hidden
         */
        Loading.prototype.getTransitionName = function (direction) {
            var key = (direction === 'back' ? 'loadingLeave' : 'loadingEnter');
            return this._nav && this._nav.config.get(key);
        };
        /**
         * @param {string} content sets the html content for the loading indicator.
         */
        Loading.prototype.setContent = function (content) {
            this.data.content = content;
            return this;
        };
        /**
         * @param {string} spinner sets the name of the SVG spinner for the loading indicator.
         */
        Loading.prototype.setSpinner = function (spinner) {
            this.data.spinner = spinner;
            return this;
        };
        /**
         * @param {string} cssClass sets additional classes for custom styles, separated by spaces.
         */
        Loading.prototype.setCssClass = function (cssClass) {
            this.data.cssClass = cssClass;
            return this;
        };
        /**
         * @param {boolean} showBackdrop sets whether to show the backdrop.
         */
        Loading.prototype.setShowBackdrop = function (showBackdrop) {
            this.data.showBackdrop = showBackdrop;
            return this;
        };
        /**
         * @param {number} dur how many milliseconds to wait before hiding the indicator.
         */
        Loading.prototype.setDuration = function (dur) {
            this.data.duration = dur;
            return this;
        };
        /**
         * Present the loading instance.
         *
         * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
         * @returns {Promise} Returns a promise which is resolved when the transition has completed.
         */
        Loading.prototype.present = function (navOptions) {
            if (navOptions === void 0) { navOptions = {}; }
            return this._app.present(this, navOptions, app_constants_1.PORTAL_LOADING);
        };
        /**
         * Dismiss all loading components which have been presented.
         */
        Loading.prototype.dismissAll = function () {
            this._nav && this._nav.popAll();
        };
        return Loading;
    }(view_controller_1.ViewController));
    exports.Loading = Loading;
});
//# sourceMappingURL=loading.js.map