(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../util/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require("../util/util");
    var OverlayProxy = (function () {
        function OverlayProxy(_app, _component, _config, _deepLinker) {
            this._app = _app;
            this._component = _component;
            this._config = _config;
            this._deepLinker = _deepLinker;
        }
        OverlayProxy.prototype.getImplementation = function () {
            throw new Error('Child class must implement "getImplementation" method');
        };
        /**
         * Present the modal instance.
         *
         * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
         * @returns {Promise} Returns a promise which is resolved when the transition has completed.
         */
        OverlayProxy.prototype.present = function (navOptions) {
            var _this = this;
            if (navOptions === void 0) { navOptions = {}; }
            // check if it's a lazy loaded component, or not
            var isLazyLoaded = util_1.isString(this._component);
            if (isLazyLoaded) {
                return this._deepLinker.getComponentFromName(this._component).then(function (loadedComponent) {
                    _this._component = loadedComponent;
                    return _this.createAndPresentOverlay(navOptions);
                });
            }
            else {
                return this.createAndPresentOverlay(navOptions);
            }
        };
        OverlayProxy.prototype.dismiss = function (data, role, navOptions) {
            if (this.overlay) {
                return this.overlay.dismiss(data, role, navOptions);
            }
        };
        /**
         * Called when the current viewController has be successfully dismissed
         */
        OverlayProxy.prototype.onDidDismiss = function (callback) {
            this._onDidDismiss = callback;
            if (this.overlay) {
                this.overlay.onDidDismiss(this._onDidDismiss);
            }
        };
        OverlayProxy.prototype.createAndPresentOverlay = function (navOptions) {
            this.overlay = this.getImplementation();
            this.overlay.onWillDismiss(this._onWillDismiss);
            this.overlay.onDidDismiss(this._onDidDismiss);
            return this.overlay.present(navOptions);
        };
        /**
         * Called when the current viewController will be dismissed
         */
        OverlayProxy.prototype.onWillDismiss = function (callback) {
            this._onWillDismiss = callback;
            if (this.overlay) {
                this.overlay.onWillDismiss(this._onWillDismiss);
            }
        };
        return OverlayProxy;
    }());
    exports.OverlayProxy = OverlayProxy;
});
//# sourceMappingURL=overlay-proxy.js.map