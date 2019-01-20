import { Component, ComponentFactoryResolver, ElementRef, Inject, InjectionToken, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { App } from './app';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { OverlayPortal } from './overlay-portal';
import { Platform } from '../../platform/platform';
import * as Constants from './app-constants';
export const AppRootToken = new InjectionToken('USERROOT');
/**
 * @hidden
 */
export class IonicApp extends Ion {
    constructor(_userCmp, _cfr, elementRef, renderer, config, _plt, app) {
        super(config, elementRef, renderer, 'app-root');
        this._userCmp = _userCmp;
        this._cfr = _cfr;
        this._plt = _plt;
        // register with App that this is Ionic's appRoot component. tada!
        app._appRoot = this;
        this._stopScrollPlugin = window['IonicStopScroll'];
    }
    ngOnInit() {
        // load the user root component
        // into Ionic's root component
        const factory = this._cfr.resolveComponentFactory(this._userCmp);
        const componentRef = this._viewport.createComponent(factory);
        this._renderer.setElementClass(componentRef.location.nativeElement, 'app-root', true);
        componentRef.changeDetectorRef.detectChanges();
        // set the mode class name
        // ios/md/wp
        this.setElementClass(this._config.get('mode'), true);
        const versions = this._plt.versions();
        this._plt.platforms().forEach(platformName => {
            // platform-ios
            let platformClass = 'platform-' + platformName;
            this.setElementClass(platformClass, true);
            let platformVersion = versions[platformName];
            if (platformVersion) {
                // platform-ios9
                platformClass += platformVersion.major;
                this.setElementClass(platformClass, true);
                // platform-ios9_3
                this.setElementClass(platformClass + '_' + platformVersion.minor, true);
            }
        });
        // touch devices should not use :hover CSS pseudo
        // enable :hover CSS when the "hoverCSS" setting is not false
        if (this._config.getBoolean('hoverCSS', true)) {
            this.setElementClass('enable-hover', true);
        }
        // sweet, the app root has loaded!
        // which means angular and ionic has fully loaded!
        // fire off the platform prepare ready, which could
        // have been switched out by any of the platform engines
        this._plt.prepareReady();
    }
    /**
     * @hidden
     */
    _getPortal(portal) {
        if (portal === Constants.PORTAL_LOADING) {
            return this._loadingPortal;
        }
        if (portal === Constants.PORTAL_TOAST) {
            return this._toastPortal;
        }
        // Modals need their own overlay becuase we don't want an ActionSheet
        // or Alert to trigger lifecycle events inside a modal
        if (portal === Constants.PORTAL_MODAL) {
            return this._modalPortal;
        }
        return this._overlayPortal;
    }
    _getActivePortal() {
        const defaultPortal = this._overlayPortal;
        const modalPortal = this._modalPortal;
        const hasModal = modalPortal.length() > 0;
        const hasDefault = defaultPortal.length() > 0;
        if (!hasModal && !hasDefault) {
            return null;
        }
        else if (hasModal && hasDefault) {
            var defaultIndex = defaultPortal.getActive().getZIndex();
            var modalIndex = modalPortal.getActive().getZIndex();
            if (defaultIndex > modalIndex) {
                return defaultPortal;
            }
            else {
                (void 0) /* assert */;
                return modalPortal;
            }
        }
        if (hasModal) {
            return modalPortal;
        }
        else if (hasDefault) {
            return defaultPortal;
        }
    }
    _disableScroll(shouldDisableScroll) {
        if (shouldDisableScroll) {
            this.stopScroll().then(() => {
                this._tmr = this._plt.timeout(() => {
                    (void 0) /* console.debug */;
                    this.setElementClass('disable-scroll', true);
                }, 32);
            });
        }
        else {
            let plugin = this._stopScrollPlugin;
            if (plugin && plugin.cancel) {
                plugin.cancel();
            }
            clearTimeout(this._tmr);
            (void 0) /* console.debug */;
            this.setElementClass('disable-scroll', false);
        }
    }
    stopScroll() {
        if (this._stopScrollPlugin) {
            return new Promise((resolve) => {
                this._stopScrollPlugin.stop(() => resolve(true));
            });
        }
        else {
            return Promise.resolve(false);
        }
    }
}
IonicApp.decorators = [
    { type: Component, args: [{
                selector: 'ion-app',
                template: '<div #viewport app-viewport></div>' +
                    '<div #modalPortal overlay-portal></div>' +
                    '<div #overlayPortal overlay-portal></div>' +
                    '<div #loadingPortal class="loading-portal" overlay-portal></div>' +
                    '<div #toastPortal class="toast-portal" [overlay-portal]="10000"></div>' +
                    '<div class="click-block"></div>'
            },] },
];
/** @nocollapse */
IonicApp.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [AppRootToken,] },] },
    { type: ComponentFactoryResolver, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: Config, },
    { type: Platform, },
    { type: App, },
];
IonicApp.propDecorators = {
    '_viewport': [{ type: ViewChild, args: ['viewport', { read: ViewContainerRef },] },],
    '_modalPortal': [{ type: ViewChild, args: ['modalPortal', { read: OverlayPortal },] },],
    '_overlayPortal': [{ type: ViewChild, args: ['overlayPortal', { read: OverlayPortal },] },],
    '_loadingPortal': [{ type: ViewChild, args: ['loadingPortal', { read: OverlayPortal },] },],
    '_toastPortal': [{ type: ViewChild, args: ['toastPortal', { read: OverlayPortal },] },],
};
//# sourceMappingURL=app-root.js.map