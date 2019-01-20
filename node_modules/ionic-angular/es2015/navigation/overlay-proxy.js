import { isString } from '../util/util';
export class OverlayProxy {
    constructor(_app, _component, _config, _deepLinker) {
        this._app = _app;
        this._component = _component;
        this._config = _config;
        this._deepLinker = _deepLinker;
    }
    getImplementation() {
        throw new Error('Child class must implement "getImplementation" method');
    }
    /**
     * Present the modal instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    present(navOptions = {}) {
        // check if it's a lazy loaded component, or not
        const isLazyLoaded = isString(this._component);
        if (isLazyLoaded) {
            return this._deepLinker.getComponentFromName(this._component).then((loadedComponent) => {
                this._component = loadedComponent;
                return this.createAndPresentOverlay(navOptions);
            });
        }
        else {
            return this.createAndPresentOverlay(navOptions);
        }
    }
    dismiss(data, role, navOptions) {
        if (this.overlay) {
            return this.overlay.dismiss(data, role, navOptions);
        }
    }
    /**
     * Called when the current viewController has be successfully dismissed
     */
    onDidDismiss(callback) {
        this._onDidDismiss = callback;
        if (this.overlay) {
            this.overlay.onDidDismiss(this._onDidDismiss);
        }
    }
    createAndPresentOverlay(navOptions) {
        this.overlay = this.getImplementation();
        this.overlay.onWillDismiss(this._onWillDismiss);
        this.overlay.onDidDismiss(this._onDidDismiss);
        return this.overlay.present(navOptions);
    }
    /**
     * Called when the current viewController will be dismissed
     */
    onWillDismiss(callback) {
        this._onWillDismiss = callback;
        if (this.overlay) {
            this.overlay.onWillDismiss(this._onWillDismiss);
        }
    }
}
//# sourceMappingURL=overlay-proxy.js.map