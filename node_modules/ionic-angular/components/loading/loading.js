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
import { PORTAL_LOADING } from '../app/app-constants';
import { LoadingCmp } from './loading-component';
import { LoadingMdPopIn, LoadingMdPopOut, LoadingPopIn, LoadingPopOut, LoadingWpPopIn, LoadingWpPopOut } from './loading-transitions';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
var Loading = (function (_super) {
    __extends(Loading, _super);
    function Loading(app, opts, config) {
        if (opts === void 0) { opts = {}; }
        var _this = this;
        opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : false;
        opts.dismissOnPageChange = isPresent(opts.dismissOnPageChange) ? !!opts.dismissOnPageChange : false;
        _this = _super.call(this, LoadingCmp, opts, null) || this;
        _this._app = app;
        _this.isOverlay = true;
        config.setTransition('loading-pop-in', LoadingPopIn);
        config.setTransition('loading-pop-out', LoadingPopOut);
        config.setTransition('loading-md-pop-in', LoadingMdPopIn);
        config.setTransition('loading-md-pop-out', LoadingMdPopOut);
        config.setTransition('loading-wp-pop-in', LoadingWpPopIn);
        config.setTransition('loading-wp-pop-out', LoadingWpPopOut);
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
        return this._app.present(this, navOptions, PORTAL_LOADING);
    };
    /**
     * Dismiss all loading components which have been presented.
     */
    Loading.prototype.dismissAll = function () {
        this._nav && this._nav.popAll();
    };
    return Loading;
}(ViewController));
export { Loading };
//# sourceMappingURL=loading.js.map