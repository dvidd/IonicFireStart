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
        define(["require", "exports", "./alert-component", "./alert-transitions", "../../util/util", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var alert_component_1 = require("./alert-component");
    var alert_transitions_1 = require("./alert-transitions");
    var util_1 = require("../../util/util");
    var view_controller_1 = require("../../navigation/view-controller");
    /**
     * @hidden
     */
    var Alert = (function (_super) {
        __extends(Alert, _super);
        function Alert(app, opts, config) {
            if (opts === void 0) { opts = {}; }
            var _this = this;
            opts.inputs = opts.inputs || [];
            opts.buttons = opts.buttons || [];
            opts.enableBackdropDismiss = util_1.isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
            _this = _super.call(this, alert_component_1.AlertCmp, opts, null) || this;
            _this._app = app;
            _this.isOverlay = true;
            config.setTransition('alert-pop-in', alert_transitions_1.AlertPopIn);
            config.setTransition('alert-pop-out', alert_transitions_1.AlertPopOut);
            config.setTransition('alert-md-pop-in', alert_transitions_1.AlertMdPopIn);
            config.setTransition('alert-md-pop-out', alert_transitions_1.AlertMdPopOut);
            config.setTransition('alert-wp-pop-in', alert_transitions_1.AlertWpPopIn);
            config.setTransition('alert-wp-pop-out', alert_transitions_1.AlertWpPopOut);
            return _this;
        }
        /**
        * @hidden
        */
        Alert.prototype.getTransitionName = function (direction) {
            var key = (direction === 'back' ? 'alertLeave' : 'alertEnter');
            return this._nav && this._nav.config.get(key);
        };
        /**
         * @param {string} title Alert title
         */
        Alert.prototype.setTitle = function (title) {
            this.data.title = title;
            return this;
        };
        /**
         * @param {string} subTitle Alert subtitle
         */
        Alert.prototype.setSubTitle = function (subTitle) {
            this.data.subTitle = subTitle;
            return this;
        };
        /**
         * @param {string} message  Alert message content
         */
        Alert.prototype.setMessage = function (message) {
            this.data.message = message;
            return this;
        };
        /**
         * @param {object} input Alert input
         */
        Alert.prototype.addInput = function (input) {
            this.data.inputs.push(input);
            return this;
        };
        /**
         * @param {any} button Alert button
         */
        Alert.prototype.addButton = function (button) {
            this.data.buttons.push(button);
            return this;
        };
        /**
         * @param {string} cssClass Set the CSS class names on the alert's outer wrapper.
         */
        Alert.prototype.setCssClass = function (cssClass) {
            this.data.cssClass = cssClass;
            return this;
        };
        /**
         * @param {string} mode Set the mode of the alert (ios, md, wp).
         */
        Alert.prototype.setMode = function (mode) {
            this.data.mode = mode;
        };
        /**
         * Present the alert instance.
         *
         * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
         * @returns {Promise} Returns a promise which is resolved when the transition has completed.
         */
        Alert.prototype.present = function (navOptions) {
            if (navOptions === void 0) { navOptions = {}; }
            navOptions.minClickBlockDuration = navOptions.minClickBlockDuration || 400;
            return this._app.present(this, navOptions);
        };
        return Alert;
    }(view_controller_1.ViewController));
    exports.Alert = Alert;
});
//# sourceMappingURL=alert.js.map