import { isPresent } from '../../util/util';
import { PORTAL_LOADING } from '../app/app-constants';
import { LoadingCmp } from './loading-component';
import { LoadingMdPopIn, LoadingMdPopOut, LoadingPopIn, LoadingPopOut, LoadingWpPopIn, LoadingWpPopOut } from './loading-transitions';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
export class Loading extends ViewController {
    constructor(app, opts = {}, config) {
        opts.showBackdrop = isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : false;
        opts.dismissOnPageChange = isPresent(opts.dismissOnPageChange) ? !!opts.dismissOnPageChange : false;
        super(LoadingCmp, opts, null);
        this._app = app;
        this.isOverlay = true;
        config.setTransition('loading-pop-in', LoadingPopIn);
        config.setTransition('loading-pop-out', LoadingPopOut);
        config.setTransition('loading-md-pop-in', LoadingMdPopIn);
        config.setTransition('loading-md-pop-out', LoadingMdPopOut);
        config.setTransition('loading-wp-pop-in', LoadingWpPopIn);
        config.setTransition('loading-wp-pop-out', LoadingWpPopOut);
    }
    /**
     * @hidden
     */
    getTransitionName(direction) {
        let key = (direction === 'back' ? 'loadingLeave' : 'loadingEnter');
        return this._nav && this._nav.config.get(key);
    }
    /**
     * @param {string} content sets the html content for the loading indicator.
     */
    setContent(content) {
        this.data.content = content;
        return this;
    }
    /**
     * @param {string} spinner sets the name of the SVG spinner for the loading indicator.
     */
    setSpinner(spinner) {
        this.data.spinner = spinner;
        return this;
    }
    /**
     * @param {string} cssClass sets additional classes for custom styles, separated by spaces.
     */
    setCssClass(cssClass) {
        this.data.cssClass = cssClass;
        return this;
    }
    /**
     * @param {boolean} showBackdrop sets whether to show the backdrop.
     */
    setShowBackdrop(showBackdrop) {
        this.data.showBackdrop = showBackdrop;
        return this;
    }
    /**
     * @param {number} dur how many milliseconds to wait before hiding the indicator.
     */
    setDuration(dur) {
        this.data.duration = dur;
        return this;
    }
    /**
     * Present the loading instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    present(navOptions = {}) {
        return this._app.present(this, navOptions, PORTAL_LOADING);
    }
    /**
     * Dismiss all loading components which have been presented.
     */
    dismissAll() {
        this._nav && this._nav.popAll();
    }
}
//# sourceMappingURL=loading.js.map