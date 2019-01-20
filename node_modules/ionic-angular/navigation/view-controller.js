import { EventEmitter, Output } from '@angular/core';
import { isPresent } from '../util/util';
import { STATE_DESTROYED, STATE_NEW } from './nav-util';
import { NavParams } from './nav-params';
/**
 * @name ViewController
 * @description
 * Access various features and information about the current view.
 * @usage
 *  ```ts
 * import { Component } from '@angular/core';
 * import { ViewController } from 'ionic-angular';
 *
 * @Component({...})
 * export class MyPage{
 *
 *   constructor(public viewCtrl: ViewController) {}
 *
 * }
 * ```
 */
var ViewController = (function () {
    function ViewController(component, data, rootCssClass) {
        if (rootCssClass === void 0) { rootCssClass = DEFAULT_CSS_CLASS; }
        this.component = component;
        this._isHidden = false;
        this._state = STATE_NEW;
        /**
         * Observable to be subscribed to when the current component will become active
         * @returns {Observable} Returns an observable
         */
        this.willEnter = new EventEmitter();
        /**
         * Observable to be subscribed to when the current component has become active
         * @returns {Observable} Returns an observable
         */
        this.didEnter = new EventEmitter();
        /**
         * Observable to be subscribed to when the current component will no longer be active
         * @returns {Observable} Returns an observable
         */
        this.willLeave = new EventEmitter();
        /**
         * Observable to be subscribed to when the current component is no long active
         * @returns {Observable} Returns an observable
         */
        this.didLeave = new EventEmitter();
        /**
         * Observable to be subscribed to when the current component has been destroyed
         * @returns {Observable} Returns an observable
         */
        this.willUnload = new EventEmitter();
        /**
         * @hidden
         */
        this.readReady = new EventEmitter();
        /**
         * @hidden
         */
        this.writeReady = new EventEmitter();
        /** @hidden */
        this.isOverlay = false;
        /** @hidden */
        this._emitter = new EventEmitter();
        // passed in data could be NavParams, but all we care about is its data object
        this.data = (data instanceof NavParams ? data.data : (isPresent(data) ? data : {}));
        this._cssClass = rootCssClass;
        this._ts = Date.now();
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    }
    ViewController.prototype.handleOrientationChange = function () {
        if (this.getContent()) {
            this.getContent().resize();
        }
    };
    /**
     * @hidden
     */
    ViewController.prototype.init = function (componentRef) {
        (void 0) /* assert */;
        this._ts = Date.now();
        this._cmp = componentRef;
        this.instance = this.instance || componentRef.instance;
        this._detached = false;
    };
    ViewController.prototype._setNav = function (navCtrl) {
        this._nav = navCtrl;
    };
    ViewController.prototype._setInstance = function (instance) {
        this.instance = instance;
    };
    /**
     * @hidden
     */
    ViewController.prototype.subscribe = function (generatorOrNext) {
        return this._emitter.subscribe(generatorOrNext);
    };
    /**
     * @hidden
     */
    ViewController.prototype.emit = function (data) {
        this._emitter.emit(data);
    };
    /**
     * Called when the current viewController has be successfully dismissed
     */
    ViewController.prototype.onDidDismiss = function (callback) {
        this._onDidDismiss = callback;
    };
    /**
     * Called when the current viewController will be dismissed
     */
    ViewController.prototype.onWillDismiss = function (callback) {
        this._onWillDismiss = callback;
    };
    /**
     * Dismiss the current viewController
     * @param {any} [data] Data that you want to return when the viewController is dismissed.
     * @param {any} [role ]
     * @param {NavOptions} navOptions Options for the dismiss navigation.
     * @returns {any} data Returns the data passed in, if any.
     */
    ViewController.prototype.dismiss = function (data, role, navOptions) {
        if (navOptions === void 0) { navOptions = {}; }
        if (!this._nav) {
            (void 0) /* assert */;
            return Promise.resolve(false);
        }
        if (this.isOverlay && !navOptions.minClickBlockDuration) {
            // This is a Modal being dismissed so we need
            // to add the minClickBlockDuration option
            // for UIWebView
            navOptions.minClickBlockDuration = 400;
        }
        this._dismissData = data;
        this._dismissRole = role;
        var options = Object.assign({}, this._leavingOpts, navOptions);
        return this._nav.removeView(this, options).then(function () { return data; });
    };
    /**
     * @hidden
     */
    ViewController.prototype.getNav = function () {
        return this._nav;
    };
    /**
     * @hidden
     */
    ViewController.prototype.getTransitionName = function (_direction) {
        return this._nav && this._nav.config.get('pageTransition');
    };
    /**
     * @hidden
     */
    ViewController.prototype.getNavParams = function () {
        return new NavParams(this.data);
    };
    /**
     * @hidden
     */
    ViewController.prototype.setLeavingOpts = function (opts) {
        this._leavingOpts = opts;
    };
    /**
     * Check to see if you can go back in the navigation stack.
     * @returns {boolean} Returns if it's possible to go back from this Page.
     */
    ViewController.prototype.enableBack = function () {
        // update if it's possible to go back from this nav item
        if (!this._nav) {
            return false;
        }
        // the previous view may exist, but if it's about to be destroyed
        // it shouldn't be able to go back to
        var previousItem = this._nav.getPrevious(this);
        return !!(previousItem);
    };
    Object.defineProperty(ViewController.prototype, "name", {
        /**
         * @hidden
         */
        get: function () {
            return (this.component ? this.component.name : '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewController.prototype, "index", {
        /**
         * Get the index of the current component in the current navigation stack.
         * @returns {number} Returns the index of this page within its `NavController`.
         */
        get: function () {
            return (this._nav ? this._nav.indexOf(this) : -1);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @returns {boolean} Returns if this Page is the first in the stack of pages within its NavController.
     */
    ViewController.prototype.isFirst = function () {
        return (this._nav ? this._nav.first() === this : false);
    };
    /**
     * @returns {boolean} Returns if this Page is the last in the stack of pages within its NavController.
     */
    ViewController.prototype.isLast = function () {
        return (this._nav ? this._nav.last() === this : false);
    };
    /**
     * @hidden
     * DOM WRITE
     */
    ViewController.prototype._domShow = function (shouldShow, renderer) {
        // using hidden element attribute to display:none and not render views
        // _hidden value of '' means the hidden attribute will be added
        // _hidden value of null means the hidden attribute will be removed
        // doing checks to make sure we only update the DOM when actually needed
        // if it should render, then the hidden attribute should not be on the element
        if (this._cmp && shouldShow === this._isHidden) {
            this._isHidden = !shouldShow;
            var value = (shouldShow ? null : '');
            // ******** DOM WRITE ****************
            renderer.setElementAttribute(this.pageRef().nativeElement, 'hidden', value);
        }
    };
    /**
     * @hidden
     */
    ViewController.prototype.getZIndex = function () {
        return this._zIndex;
    };
    /**
     * @hidden
     * DOM WRITE
     */
    ViewController.prototype._setZIndex = function (zIndex, renderer) {
        if (zIndex !== this._zIndex) {
            this._zIndex = zIndex;
            var pageRef = this.pageRef();
            if (pageRef) {
                // ******** DOM WRITE ****************
                renderer.setElementStyle(pageRef.nativeElement, 'z-index', zIndex);
            }
        }
    };
    /**
     * @returns {ElementRef} Returns the Page's ElementRef.
     */
    ViewController.prototype.pageRef = function () {
        return this._cmp && this._cmp.location;
    };
    ViewController.prototype._setContent = function (directive) {
        this._cntDir = directive;
    };
    /**
     * @returns {component} Returns the Page's Content component reference.
     */
    ViewController.prototype.getContent = function () {
        return this._cntDir;
    };
    ViewController.prototype._setContentRef = function (elementRef) {
        this._cntRef = elementRef;
    };
    /**
     * @returns {ElementRef} Returns the Content's ElementRef.
     */
    ViewController.prototype.contentRef = function () {
        return this._cntRef;
    };
    ViewController.prototype._setIONContent = function (content) {
        this._setContent(content);
        this._ionCntDir = content;
    };
    /**
     * @hidden
     */
    ViewController.prototype.getIONContent = function () {
        return this._ionCntDir;
    };
    ViewController.prototype._setIONContentRef = function (elementRef) {
        this._setContentRef(elementRef);
        this._ionCntRef = elementRef;
    };
    /**
     * @hidden
     */
    ViewController.prototype.getIONContentRef = function () {
        return this._ionCntRef;
    };
    ViewController.prototype._setHeader = function (directive) {
        this._hdrDir = directive;
    };
    /**
     * @hidden
     */
    ViewController.prototype.getHeader = function () {
        return this._hdrDir;
    };
    ViewController.prototype._setFooter = function (directive) {
        this._ftrDir = directive;
    };
    /**
     * @hidden
     */
    ViewController.prototype.getFooter = function () {
        return this._ftrDir;
    };
    ViewController.prototype._setNavbar = function (directive) {
        this._nb = directive;
    };
    /**
     * @hidden
     */
    ViewController.prototype.getNavbar = function () {
        return this._nb;
    };
    /**
     * Find out if the current component has a NavBar or not. Be sure
     * to wrap this in an `ionViewWillEnter` method in order to make sure
     * the view has rendered fully.
     * @returns {boolean} Returns a boolean if this Page has a navbar or not.
     */
    ViewController.prototype.hasNavbar = function () {
        return !!this._nb;
    };
    /**
     * Change the title of the back-button. Be sure to call this
     * after `ionViewWillEnter` to make sure the  DOM has been rendered.
     * @param {string} val Set the back button text.
     */
    ViewController.prototype.setBackButtonText = function (val) {
        this._nb && this._nb.setBackButtonText(val);
    };
    /**
     * Set if the back button for the current view is visible or not. Be sure to call this
     * after `ionViewWillEnter` to make sure the  DOM has been rendered.
     * @param {boolean} Set if this Page's back button should show or not.
     */
    ViewController.prototype.showBackButton = function (shouldShow) {
        if (this._nb) {
            this._nb.hideBackButton = !shouldShow;
        }
    };
    ViewController.prototype._preLoad = function () {
        (void 0) /* assert */;
        this._lifecycle('PreLoad');
    };
    /**
     * @hidden
     * The view has loaded. This event only happens once per view will be created.
     * This event is fired before the component and his children have been initialized.
     */
    ViewController.prototype._willLoad = function () {
        (void 0) /* assert */;
        this._lifecycle('WillLoad');
    };
    /**
     * @hidden
     * The view has loaded. This event only happens once per view being
     * created. If a view leaves but is cached, then this will not
     * fire again on a subsequent viewing. This method is a good place
     * to put your setup code for the view; however, it is not the
     * recommended method to use when a view becomes active.
     */
    ViewController.prototype._didLoad = function () {
        (void 0) /* assert */;
        this._lifecycle('DidLoad');
    };
    /**
     * @hidden
     * The view is about to enter and become the active view.
     */
    ViewController.prototype._willEnter = function () {
        this.handleOrientationChange();
        (void 0) /* assert */;
        if (this._detached && this._cmp) {
            // ensure this has been re-attached to the change detector
            this._cmp.changeDetectorRef.reattach();
            this._detached = false;
        }
        this.willEnter.emit(null);
        this._lifecycle('WillEnter');
    };
    /**
     * @hidden
     * The view has fully entered and is now the active view. This
     * will fire, whether it was the first load or loaded from the cache.
     */
    ViewController.prototype._didEnter = function () {
        (void 0) /* assert */;
        this._nb && this._nb.didEnter();
        this.didEnter.emit(null);
        this._lifecycle('DidEnter');
    };
    /**
     * @hidden
     * The view is about to leave and no longer be the active view.
     */
    ViewController.prototype._willLeave = function (willUnload) {
        this.willLeave.emit(null);
        this._lifecycle('WillLeave');
        if (willUnload && this._onWillDismiss) {
            this._onWillDismiss(this._dismissData, this._dismissRole);
            this._onWillDismiss = null;
        }
    };
    /**
     * @hidden
     * The view has finished leaving and is no longer the active view. This
     * will fire, whether it is cached or unloaded.
     */
    ViewController.prototype._didLeave = function () {
        this.didLeave.emit(null);
        this._lifecycle('DidLeave');
        // when this is not the active page
        // we no longer need to detect changes
        if (!this._detached && this._cmp) {
            this._cmp.changeDetectorRef.detach();
            this._detached = true;
        }
    };
    /**
     * @hidden
     */
    ViewController.prototype._willUnload = function () {
        this.willUnload.emit(null);
        this._lifecycle('WillUnload');
        this._onDidDismiss && this._onDidDismiss(this._dismissData, this._dismissRole);
        this._onDidDismiss = null;
        this._dismissData = null;
        this._dismissRole = null;
    };
    /**
     * @hidden
     * DOM WRITE
     */
    ViewController.prototype._destroy = function (renderer) {
        (void 0) /* assert */;
        if (this._cmp) {
            if (renderer) {
                // ensure the element is cleaned up for when the view pool reuses this element
                // ******** DOM WRITE ****************
                var cmpEle = this._cmp.location.nativeElement;
                renderer.setElementAttribute(cmpEle, 'class', null);
                renderer.setElementAttribute(cmpEle, 'style', null);
            }
            window.removeEventListener('orientationchange', this.handleOrientationChange.bind(this));
            // completely destroy this component. boom.
            this._cmp.destroy();
        }
        this._nav = this._cmp = this.instance = this._cntDir = this._cntRef = this._leavingOpts = this._hdrDir = this._ftrDir = this._nb = this._onDidDismiss = this._onWillDismiss = null;
        this._state = STATE_DESTROYED;
    };
    /**
     * @hidden
     */
    ViewController.prototype._lifecycleTest = function (lifecycle) {
        var instance = this.instance;
        var methodName = 'ionViewCan' + lifecycle;
        if (instance && instance[methodName]) {
            try {
                var result = instance[methodName]();
                if (result instanceof Promise) {
                    return result;
                }
                else {
                    // Any value but explitic false, should be true
                    return Promise.resolve(result !== false);
                }
            }
            catch (e) {
                return Promise.reject(this.name + " " + methodName + " error: " + e.message);
            }
        }
        return Promise.resolve(true);
    };
    /**
     * @hidden
     */
    ViewController.prototype._lifecycle = function (lifecycle) {
        var instance = this.instance;
        var methodName = 'ionView' + lifecycle;
        if (instance && instance[methodName]) {
            instance[methodName]();
        }
    };
    ViewController.propDecorators = {
        '_emitter': [{ type: Output },],
    };
    return ViewController;
}());
export { ViewController };
export function isViewController(viewCtrl) {
    return !!(viewCtrl && viewCtrl._didLoad && viewCtrl._willUnload);
}
var DEFAULT_CSS_CLASS = 'ion-page';
//# sourceMappingURL=view-controller.js.map