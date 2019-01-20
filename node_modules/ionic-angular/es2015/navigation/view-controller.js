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
export class ViewController {
    constructor(component, data, rootCssClass = DEFAULT_CSS_CLASS) {
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
    handleOrientationChange() {
        if (this.getContent()) {
            this.getContent().resize();
        }
    }
    /**
     * @hidden
     */
    init(componentRef) {
        (void 0) /* assert */;
        this._ts = Date.now();
        this._cmp = componentRef;
        this.instance = this.instance || componentRef.instance;
        this._detached = false;
    }
    _setNav(navCtrl) {
        this._nav = navCtrl;
    }
    _setInstance(instance) {
        this.instance = instance;
    }
    /**
     * @hidden
     */
    subscribe(generatorOrNext) {
        return this._emitter.subscribe(generatorOrNext);
    }
    /**
     * @hidden
     */
    emit(data) {
        this._emitter.emit(data);
    }
    /**
     * Called when the current viewController has be successfully dismissed
     */
    onDidDismiss(callback) {
        this._onDidDismiss = callback;
    }
    /**
     * Called when the current viewController will be dismissed
     */
    onWillDismiss(callback) {
        this._onWillDismiss = callback;
    }
    /**
     * Dismiss the current viewController
     * @param {any} [data] Data that you want to return when the viewController is dismissed.
     * @param {any} [role ]
     * @param {NavOptions} navOptions Options for the dismiss navigation.
     * @returns {any} data Returns the data passed in, if any.
     */
    dismiss(data, role, navOptions = {}) {
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
        const options = Object.assign({}, this._leavingOpts, navOptions);
        return this._nav.removeView(this, options).then(() => data);
    }
    /**
     * @hidden
     */
    getNav() {
        return this._nav;
    }
    /**
     * @hidden
     */
    getTransitionName(_direction) {
        return this._nav && this._nav.config.get('pageTransition');
    }
    /**
     * @hidden
     */
    getNavParams() {
        return new NavParams(this.data);
    }
    /**
     * @hidden
     */
    setLeavingOpts(opts) {
        this._leavingOpts = opts;
    }
    /**
     * Check to see if you can go back in the navigation stack.
     * @returns {boolean} Returns if it's possible to go back from this Page.
     */
    enableBack() {
        // update if it's possible to go back from this nav item
        if (!this._nav) {
            return false;
        }
        // the previous view may exist, but if it's about to be destroyed
        // it shouldn't be able to go back to
        const previousItem = this._nav.getPrevious(this);
        return !!(previousItem);
    }
    /**
     * @hidden
     */
    get name() {
        return (this.component ? this.component.name : '');
    }
    /**
     * Get the index of the current component in the current navigation stack.
     * @returns {number} Returns the index of this page within its `NavController`.
     */
    get index() {
        return (this._nav ? this._nav.indexOf(this) : -1);
    }
    /**
     * @returns {boolean} Returns if this Page is the first in the stack of pages within its NavController.
     */
    isFirst() {
        return (this._nav ? this._nav.first() === this : false);
    }
    /**
     * @returns {boolean} Returns if this Page is the last in the stack of pages within its NavController.
     */
    isLast() {
        return (this._nav ? this._nav.last() === this : false);
    }
    /**
     * @hidden
     * DOM WRITE
     */
    _domShow(shouldShow, renderer) {
        // using hidden element attribute to display:none and not render views
        // _hidden value of '' means the hidden attribute will be added
        // _hidden value of null means the hidden attribute will be removed
        // doing checks to make sure we only update the DOM when actually needed
        // if it should render, then the hidden attribute should not be on the element
        if (this._cmp && shouldShow === this._isHidden) {
            this._isHidden = !shouldShow;
            let value = (shouldShow ? null : '');
            // ******** DOM WRITE ****************
            renderer.setElementAttribute(this.pageRef().nativeElement, 'hidden', value);
        }
    }
    /**
     * @hidden
     */
    getZIndex() {
        return this._zIndex;
    }
    /**
     * @hidden
     * DOM WRITE
     */
    _setZIndex(zIndex, renderer) {
        if (zIndex !== this._zIndex) {
            this._zIndex = zIndex;
            const pageRef = this.pageRef();
            if (pageRef) {
                // ******** DOM WRITE ****************
                renderer.setElementStyle(pageRef.nativeElement, 'z-index', zIndex);
            }
        }
    }
    /**
     * @returns {ElementRef} Returns the Page's ElementRef.
     */
    pageRef() {
        return this._cmp && this._cmp.location;
    }
    _setContent(directive) {
        this._cntDir = directive;
    }
    /**
     * @returns {component} Returns the Page's Content component reference.
     */
    getContent() {
        return this._cntDir;
    }
    _setContentRef(elementRef) {
        this._cntRef = elementRef;
    }
    /**
     * @returns {ElementRef} Returns the Content's ElementRef.
     */
    contentRef() {
        return this._cntRef;
    }
    _setIONContent(content) {
        this._setContent(content);
        this._ionCntDir = content;
    }
    /**
     * @hidden
     */
    getIONContent() {
        return this._ionCntDir;
    }
    _setIONContentRef(elementRef) {
        this._setContentRef(elementRef);
        this._ionCntRef = elementRef;
    }
    /**
     * @hidden
     */
    getIONContentRef() {
        return this._ionCntRef;
    }
    _setHeader(directive) {
        this._hdrDir = directive;
    }
    /**
     * @hidden
     */
    getHeader() {
        return this._hdrDir;
    }
    _setFooter(directive) {
        this._ftrDir = directive;
    }
    /**
     * @hidden
     */
    getFooter() {
        return this._ftrDir;
    }
    _setNavbar(directive) {
        this._nb = directive;
    }
    /**
     * @hidden
     */
    getNavbar() {
        return this._nb;
    }
    /**
     * Find out if the current component has a NavBar or not. Be sure
     * to wrap this in an `ionViewWillEnter` method in order to make sure
     * the view has rendered fully.
     * @returns {boolean} Returns a boolean if this Page has a navbar or not.
     */
    hasNavbar() {
        return !!this._nb;
    }
    /**
     * Change the title of the back-button. Be sure to call this
     * after `ionViewWillEnter` to make sure the  DOM has been rendered.
     * @param {string} val Set the back button text.
     */
    setBackButtonText(val) {
        this._nb && this._nb.setBackButtonText(val);
    }
    /**
     * Set if the back button for the current view is visible or not. Be sure to call this
     * after `ionViewWillEnter` to make sure the  DOM has been rendered.
     * @param {boolean} Set if this Page's back button should show or not.
     */
    showBackButton(shouldShow) {
        if (this._nb) {
            this._nb.hideBackButton = !shouldShow;
        }
    }
    _preLoad() {
        (void 0) /* assert */;
        this._lifecycle('PreLoad');
    }
    /**
     * @hidden
     * The view has loaded. This event only happens once per view will be created.
     * This event is fired before the component and his children have been initialized.
     */
    _willLoad() {
        (void 0) /* assert */;
        this._lifecycle('WillLoad');
    }
    /**
     * @hidden
     * The view has loaded. This event only happens once per view being
     * created. If a view leaves but is cached, then this will not
     * fire again on a subsequent viewing. This method is a good place
     * to put your setup code for the view; however, it is not the
     * recommended method to use when a view becomes active.
     */
    _didLoad() {
        (void 0) /* assert */;
        this._lifecycle('DidLoad');
    }
    /**
     * @hidden
     * The view is about to enter and become the active view.
     */
    _willEnter() {
        this.handleOrientationChange();
        (void 0) /* assert */;
        if (this._detached && this._cmp) {
            // ensure this has been re-attached to the change detector
            this._cmp.changeDetectorRef.reattach();
            this._detached = false;
        }
        this.willEnter.emit(null);
        this._lifecycle('WillEnter');
    }
    /**
     * @hidden
     * The view has fully entered and is now the active view. This
     * will fire, whether it was the first load or loaded from the cache.
     */
    _didEnter() {
        (void 0) /* assert */;
        this._nb && this._nb.didEnter();
        this.didEnter.emit(null);
        this._lifecycle('DidEnter');
    }
    /**
     * @hidden
     * The view is about to leave and no longer be the active view.
     */
    _willLeave(willUnload) {
        this.willLeave.emit(null);
        this._lifecycle('WillLeave');
        if (willUnload && this._onWillDismiss) {
            this._onWillDismiss(this._dismissData, this._dismissRole);
            this._onWillDismiss = null;
        }
    }
    /**
     * @hidden
     * The view has finished leaving and is no longer the active view. This
     * will fire, whether it is cached or unloaded.
     */
    _didLeave() {
        this.didLeave.emit(null);
        this._lifecycle('DidLeave');
        // when this is not the active page
        // we no longer need to detect changes
        if (!this._detached && this._cmp) {
            this._cmp.changeDetectorRef.detach();
            this._detached = true;
        }
    }
    /**
     * @hidden
     */
    _willUnload() {
        this.willUnload.emit(null);
        this._lifecycle('WillUnload');
        this._onDidDismiss && this._onDidDismiss(this._dismissData, this._dismissRole);
        this._onDidDismiss = null;
        this._dismissData = null;
        this._dismissRole = null;
    }
    /**
     * @hidden
     * DOM WRITE
     */
    _destroy(renderer) {
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
    }
    /**
     * @hidden
     */
    _lifecycleTest(lifecycle) {
        const instance = this.instance;
        const methodName = 'ionViewCan' + lifecycle;
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
                return Promise.reject(`${this.name} ${methodName} error: ${e.message}`);
            }
        }
        return Promise.resolve(true);
    }
    /**
     * @hidden
     */
    _lifecycle(lifecycle) {
        const instance = this.instance;
        const methodName = 'ionView' + lifecycle;
        if (instance && instance[methodName]) {
            instance[methodName]();
        }
    }
}
ViewController.propDecorators = {
    '_emitter': [{ type: Output },],
};
export function isViewController(viewCtrl) {
    return !!(viewCtrl && viewCtrl._didLoad && viewCtrl._willUnload);
}
const DEFAULT_CSS_CLASS = 'ion-page';
//# sourceMappingURL=view-controller.js.map