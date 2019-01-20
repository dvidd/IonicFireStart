import { EventEmitter, Injectable, Optional } from '@angular/core';
import { DOCUMENT, Title } from '@angular/platform-browser';
import * as Constants from './app-constants';
import { Config } from '../../config/config';
import { DIRECTION_BACK, DIRECTION_FORWARD, isTabs } from '../../navigation/nav-util';
import { MenuController } from './menu-controller';
import { Platform } from '../../platform/platform';
import { IOSTransition } from '../../transitions/transition-ios';
import { MDTransition } from '../../transitions/transition-md';
import { WPTransition } from '../../transitions/transition-wp';
/**
 * @name App
 * @description
 * App is a utility class used in Ionic to get information about various aspects of an app
 */
var App = (function () {
    function App(_config, _plt, _menuCtrl) {
        this._config = _config;
        this._plt = _plt;
        this._menuCtrl = _menuCtrl;
        this._disTime = 0;
        this._scrollTime = 0;
        this._title = '';
        this._titleSrv = new Title(DOCUMENT);
        this._rootNavs = new Map();
        this._didScroll = false;
        /**
         * Observable that emits whenever a view loads in the app.
         * @returns {Observable} Returns an observable
         */
        this.viewDidLoad = new EventEmitter();
        /**
         * Observable that emits before any view is entered in the app.
         * @returns {Observable} Returns an observable
         */
        this.viewWillEnter = new EventEmitter();
        /**
         * Observable that emits after any view is entered in the app.
         * @returns {Observable} Returns an observable
         */
        this.viewDidEnter = new EventEmitter();
        /**
         * Observable that emits before any view is exited in the app.
         * @returns {Observable} Returns an observable
         */
        this.viewWillLeave = new EventEmitter();
        /**
         * Observable that emits after any view is exited in the app.
         * @returns {Observable} Returns an observable
         */
        this.viewDidLeave = new EventEmitter();
        /**
         * Observable that emits before any view unloads in the app.
         * @returns {Observable} Returns an observable
         */
        this.viewWillUnload = new EventEmitter();
        // listen for hardware back button events
        // register this back button action with a default priority
        _plt.registerBackButtonAction(this.goBack.bind(this));
        this._disableScrollAssist = _config.getBoolean('disableScrollAssist', false);
        var blurring = _config.getBoolean('inputBlurring', false);
        if (blurring) {
            this._enableInputBlurring();
        }
        (void 0) /* runInDev */;
        _config.setTransition('ios-transition', IOSTransition);
        _config.setTransition('md-transition', MDTransition);
        _config.setTransition('wp-transition', WPTransition);
    }
    /**
     * Sets the document title.
     * @param {string} val  Value to set the document title to.
     */
    App.prototype.setTitle = function (val) {
        if (val !== this._title) {
            this._title = val;
            this._titleSrv.setTitle(val);
        }
    };
    /**
     * @hidden
     */
    App.prototype.setElementClass = function (className, isAdd) {
        this._appRoot.setElementClass(className, isAdd);
    };
    /**
     * @hidden
     * Sets if the app is currently enabled or not, meaning if it's
     * available to accept new user commands. For example, this is set to `false`
     * while views transition, a modal slides up, an action-sheet
     * slides up, etc. After the transition completes it is set back to `true`.
     * @param {boolean} isEnabled `true` for enabled, `false` for disabled
     * @param {number} duration  When `isEnabled` is set to `false`, this argument
     * is used to set the maximum number of milliseconds that app will wait until
     * it will automatically enable the app again. It's basically a fallback incase
     * something goes wrong during a transition and the app wasn't re-enabled correctly.
     */
    App.prototype.setEnabled = function (isEnabled, duration, minDuration) {
        if (duration === void 0) { duration = 700; }
        if (minDuration === void 0) { minDuration = 0; }
        this._disTime = (isEnabled ? 0 : Date.now() + duration);
        if (this._clickBlock) {
            if (isEnabled) {
                // disable the click block if it's enabled, or the duration is tiny
                this._clickBlock.activate(false, CLICK_BLOCK_BUFFER_IN_MILLIS, minDuration);
            }
            else {
                // show the click block for duration + some number
                this._clickBlock.activate(true, duration + CLICK_BLOCK_BUFFER_IN_MILLIS, minDuration);
            }
        }
    };
    /**
     * @hidden
     * Toggles whether an application can be scrolled
     * @param {boolean} disableScroll when set to `false`, the application's
     * scrolling is enabled. When set to `true`, scrolling is disabled.
     */
    App.prototype._setDisableScroll = function (disableScroll) {
        if (this._disableScrollAssist) {
            this._appRoot._disableScroll(disableScroll);
        }
    };
    /**
     * @hidden
     * Boolean if the app is actively enabled or not.
     * @return {boolean}
     */
    App.prototype.isEnabled = function () {
        var disTime = this._disTime;
        if (disTime === 0) {
            return true;
        }
        return (disTime < Date.now());
    };
    /**
     * @hidden
     */
    App.prototype.setScrolling = function () {
        this._scrollTime = Date.now() + ACTIVE_SCROLLING_TIME;
        this._didScroll = true;
    };
    /**
     * Boolean if the app is actively scrolling or not.
     * @return {boolean} returns true or false
     */
    App.prototype.isScrolling = function () {
        var scrollTime = this._scrollTime;
        if (scrollTime === 0) {
            return false;
        }
        if (scrollTime < Date.now()) {
            this._scrollTime = 0;
            return false;
        }
        return true;
    };
    /**
     * @return {NavController} Returns the first Active Nav Controller from the list. This method is deprecated
     */
    App.prototype.getActiveNav = function () {
        console.warn('(getActiveNav) is deprecated and will be removed in the next major release. Use getActiveNavs instead.');
        var navs = this.getActiveNavs();
        if (navs && navs.length) {
            return navs[0];
        }
        return null;
    };
    /**
     * @return {NavController[]} Returns the active NavControllers. Using this method is preferred when we need access to the top-level navigation controller while on the outside views and handlers like `registerBackButtonAction()`
     */
    App.prototype.getActiveNavs = function (rootNavId) {
        var portal = this._appRoot._getPortal(Constants.PORTAL_MODAL);
        if (portal.length() > 0) {
            return findTopNavs(portal);
        }
        if (!this._rootNavs || !this._rootNavs.size) {
            return [];
        }
        if (this._rootNavs.size === 1) {
            return findTopNavs(this._rootNavs.values().next().value);
        }
        if (rootNavId) {
            return findTopNavs(this._rootNavs.get(rootNavId));
        }
        // fallback to just using all root names
        var activeNavs = [];
        this._rootNavs.forEach(function (nav) {
            var topNavs = findTopNavs(nav);
            activeNavs = activeNavs.concat(topNavs);
        });
        return activeNavs;
    };
    App.prototype.getRootNav = function () {
        console.warn('(getRootNav) is deprecated and will be removed in the next major release. Use getRootNavById instead.');
        var rootNavs = this.getRootNavs();
        if (rootNavs.length === 0) {
            return null;
        }
        else if (rootNavs.length > 1) {
            console.warn('(getRootNav) there are multiple root navs, use getRootNavs instead');
        }
        return rootNavs[0];
    };
    App.prototype.getRootNavs = function () {
        var navs = [];
        this._rootNavs.forEach(function (nav) { return navs.push(nav); });
        return navs;
    };
    /**
     * @return {NavController} Returns the root NavController
     */
    App.prototype.getRootNavById = function (navId) {
        return this._rootNavs.get(navId);
    };
    /**
     * @hidden
     */
    App.prototype.registerRootNav = function (nav) {
        this._rootNavs.set(nav.id, nav);
    };
    /**
     * @hidden
     */
    App.prototype.unregisterRootNav = function (nav) {
        this._rootNavs.delete(nav.id);
    };
    App.prototype.getActiveNavContainers = function () {
        // for each root nav container, get it's active nav
        var list = [];
        this._rootNavs.forEach(function (container) {
            list = list.concat(findTopNavs(container));
        });
        return list;
    };
    /**
     * @hidden
     */
    App.prototype.present = function (enteringView, opts, appPortal) {
        (void 0) /* assert */;
        var portal = this._appRoot._getPortal(appPortal);
        // Set Nav must be set here in order to dimiss() work synchnously.
        // TODO: move _setNav() to the earlier stages of NavController. _queueTrns()
        enteringView._setNav(portal);
        opts.direction = DIRECTION_FORWARD;
        if (!opts.animation) {
            opts.animation = enteringView.getTransitionName(DIRECTION_FORWARD);
        }
        enteringView.setLeavingOpts({
            keyboardClose: opts.keyboardClose,
            direction: DIRECTION_BACK,
            animation: enteringView.getTransitionName(DIRECTION_BACK),
            ev: opts.ev
        });
        return portal.insertPages(-1, [enteringView], opts);
    };
    /**
     * @hidden
     */
    App.prototype.goBack = function () {
        if (this._menuCtrl && this._menuCtrl.isOpen()) {
            return this._menuCtrl.close();
        }
        var navPromise = this.navPop();
        if (!navPromise) {
            // no views to go back to
            // let's exit the app
            if (this._config.getBoolean('navExitApp', true)) {
                (void 0) /* console.debug */;
                this._plt.exitApp();
            }
        }
        return navPromise;
    };
    /**
     * @hidden
     */
    App.prototype.navPop = function () {
        var _this = this;
        if (!this._rootNavs || this._rootNavs.size === 0 || !this.isEnabled()) {
            return Promise.resolve();
        }
        // If there are any alert/actionsheet open, let's do nothing
        var portal = this._appRoot._getPortal(Constants.PORTAL_DEFAULT);
        if (portal.length() > 0) {
            return Promise.resolve();
        }
        var navToPop = null;
        var mostRecentVC = null;
        this._rootNavs.forEach(function (navContainer) {
            var activeNavs = _this.getActiveNavs(navContainer.id);
            var poppableNavs = activeNavs.map(function (activeNav) { return getPoppableNav(activeNav); }).filter(function (nav) { return !!nav; });
            poppableNavs.forEach(function (poppable) {
                var topViewController = poppable.last();
                if (poppable._isPortal || (topViewController && poppable.length() > 1 && (!mostRecentVC || topViewController._ts >= mostRecentVC._ts))) {
                    mostRecentVC = topViewController;
                    navToPop = poppable;
                }
            });
        });
        if (navToPop) {
            return navToPop.pop();
        }
    };
    /**
     * @hidden
     */
    App.prototype._enableInputBlurring = function () {
        (void 0) /* console.debug */;
        var focused = true;
        var self = this;
        var platform = this._plt;
        platform.registerListener(platform.doc(), 'focusin', onFocusin, { capture: true, zone: false, passive: true });
        platform.registerListener(platform.doc(), 'touchend', onTouchend, { capture: false, zone: false, passive: true });
        function onFocusin() {
            focused = true;
        }
        function onTouchend(ev) {
            // if app did scroll return early
            if (self._didScroll) {
                self._didScroll = false;
                return;
            }
            var active = self._plt.getActiveElement();
            if (!active) {
                return;
            }
            // only blur if the active element is a text-input or a textarea
            if (SKIP_BLURRING.indexOf(active.tagName) === -1) {
                return;
            }
            // if the selected target is the active element, do not blur
            var tapped = ev.target;
            if (tapped === active) {
                return;
            }
            if (SKIP_BLURRING.indexOf(tapped.tagName) >= 0) {
                return;
            }
            // skip if div is a cover
            if (tapped.classList.contains('input-cover')) {
                return;
            }
            focused = false;
            // TODO: find a better way, why 50ms?
            platform.timeout(function () {
                if (!focused) {
                    active.blur();
                }
            }, 50);
        }
    };
    App.prototype.getNavByIdOrName = function (id) {
        var navs = Array.from(this._rootNavs.values());
        for (var _i = 0, navs_1 = navs; _i < navs_1.length; _i++) {
            var navContainer = navs_1[_i];
            var match = getNavByIdOrName(navContainer, id);
            if (match) {
                return match;
            }
        }
        return null;
    };
    App.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    App.ctorParameters = function () { return [
        { type: Config, },
        { type: Platform, },
        { type: MenuController, decorators: [{ type: Optional },] },
    ]; };
    return App;
}());
export { App };
export function getNavByIdOrName(nav, id) {
    if (nav.id === id || nav.name === id) {
        return nav;
    }
    for (var _i = 0, _a = nav.getAllChildNavs(); _i < _a.length; _i++) {
        var child = _a[_i];
        var tmp = getNavByIdOrName(child, id);
        if (tmp) {
            return tmp;
        }
    }
    return null;
}
function getPoppableNav(nav) {
    if (!nav) {
        return null;
    }
    if (isTabs(nav)) {
        // tabs aren't a nav, so just call this function again immediately on the parent on tabs
        return getPoppableNav(nav.parent);
    }
    var len = nav.length();
    if (len > 1 || (nav._isPortal && len > 0)) {
        // this nav controller has more than one view
        // use this nav!
        return nav;
    }
    // try again using the parent nav (if there is one)
    return getPoppableNav(nav.parent);
}
export function findTopNavs(nav) {
    var containers = [];
    var childNavs = nav.getActiveChildNavs();
    if (!childNavs || !childNavs.length) {
        containers.push(nav);
    }
    else {
        childNavs.forEach(function (childNav) {
            var topNavs = findTopNavs(childNav);
            containers = containers.concat(topNavs);
        });
    }
    return containers;
}
var SKIP_BLURRING = ['INPUT', 'TEXTAREA', 'ION-INPUT', 'ION-TEXTAREA'];
var ACTIVE_SCROLLING_TIME = 100;
var CLICK_BLOCK_BUFFER_IN_MILLIS = 64;
//# sourceMappingURL=app.js.map