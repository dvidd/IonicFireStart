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
import { Component, ElementRef, EventEmitter, Input, Optional, Output, Renderer, ViewChild, ViewContainerRef, ViewEncapsulation, forwardRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { Ion } from '../ion';
import { isBlank, isPresent } from '../../util/util';
import { Keyboard } from '../../platform/keyboard';
import { NavController } from '../../navigation/nav-controller';
import { DIRECTION_SWITCH, getComponent } from '../../navigation/nav-util';
import { formatUrlPart } from '../../navigation/url-serializer';
import { RootNode } from '../split-pane/split-pane';
import { Platform } from '../../platform/platform';
import { TabHighlight } from './tab-highlight';
import { ViewController } from '../../navigation/view-controller';
/**
 * @name Tabs
 * @description
 * Tabs make it easy to navigate between different pages or functional
 * aspects of an app. The Tabs component, written as `<ion-tabs>`, is
 * a container of individual [Tab](../Tab/) components. Each individual `ion-tab`
 * is a declarative component for a [NavController](../../../navigation/NavController/)
 *
 * For more information on using nav controllers like Tab or [Nav](../../nav/Nav/),
 * take a look at the [NavController API Docs](../../../navigation/NavController/).
 *
 * ### Placement
 *
 * The position of the tabs relative to the content varies based on
 * the mode. The tabs are placed at the bottom of the screen
 * for iOS and Android, and at the top for Windows by default. The position can
 * be configured using the `tabsPlacement` attribute on the `<ion-tabs>` component,
 * or in an app's [config](../../config/Config/).
 * See the [Input Properties](#input-properties) below for the available
 * values of `tabsPlacement`.
 *
 * ### Layout
 *
 * The layout for all of the tabs can be defined using the `tabsLayout`
 * property. If the individual tab has a title and icon, the icons will
 * show on top of the title by default. All tabs can be changed by setting
 * the value of `tabsLayout` on the `<ion-tabs>` element, or in your
 * app's [config](../../config/Config/). For example, this is useful if
 * you want to show tabs with a title only on Android, but show icons
 * and a title for iOS. See the [Input Properties](#input-properties)
 * below for the available values of `tabsLayout`.
 *
 * ### Selecting a Tab
 *
 * There are different ways you can select a specific tab from the tabs
 * component. You can use the `selectedIndex` property to set the index
 * on the `<ion-tabs>` element, or you can call `select()` from the `Tabs`
 * instance after creation. See [usage](#usage) below for more information.
 *
 * @usage
 *
 * You can add a basic tabs template to a `@Component` using the following
 * template:
 *
 * ```html
 * <ion-tabs>
 *   <ion-tab [root]="tab1Root"></ion-tab>
 *   <ion-tab [root]="tab2Root"></ion-tab>
 *   <ion-tab [root]="tab3Root"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * Where `tab1Root`, `tab2Root`, and `tab3Root` are each a page:
 *
 *```ts
 * @Component({
 *   templateUrl: 'build/pages/tabs/tabs.html'
 * })
 * export class TabsPage {
 *   // this tells the tabs component which Pages
 *   // should be each tab's root Page
 *   tab1Root = Page1;
 *   tab2Root = Page2;
 *   tab3Root = Page3;
 *
 *   constructor() {
 *
 *   }
 * }
 *```
 *
 * By default, the first tab will be selected upon navigation to the
 * Tabs page. We can change the selected tab by using `selectedIndex`
 * on the `<ion-tabs>` element:
 *
 * ```html
 * <ion-tabs selectedIndex="2">
 *   <ion-tab [root]="tab1Root"></ion-tab>
 *   <ion-tab [root]="tab2Root"></ion-tab>
 *   <ion-tab [root]="tab3Root"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * Since the index starts at `0`, this will select the 3rd tab which has
 * root set to `tab3Root`. If you wanted to change it dynamically from
 * your class, you could use [property binding](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#property-binding).
 *
 * Alternatively, you can grab the `Tabs` instance and call the `select()`
 * method. This requires the `<ion-tabs>` element to have an `id`. For
 * example, set the value of `id` to `myTabs`:
 *
 * ```html
 * <ion-tabs #myTabs>
 *   <ion-tab [root]="tab1Root"></ion-tab>
 *   <ion-tab [root]="tab2Root"></ion-tab>
 *   <ion-tab [root]="tab3Root"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * Then in your class you can grab the `Tabs` instance and call `select()`,
 * passing the index of the tab as the argument. Here we're grabbing the tabs
 * by using ViewChild.
 *
 *```ts
 * export class TabsPage {
 *
 * @ViewChild('myTabs') tabRef: Tabs;
 *
 * ionViewDidEnter() {
 *   this.tabRef.select(2);
 *  }
 *
 * }
 *```
 *
 * You can also switch tabs from a child component by calling `select()` on the
 * parent view using the `NavController` instance. For example, assuming you have
 * a `TabsPage` component, you could call the following from any of the child
 * components to switch to `TabsRoot3`:
 *
 *```ts
 * switchTabs() {
 *   this.navCtrl.parent.select(2);
 * }
 *```
 * @demo /docs/demos/src/tabs/
 *
 * @see {@link /docs/components#tabs Tabs Component Docs}
 * @see {@link ../Tab Tab API Docs}
 * @see {@link ../../config/Config Config API Docs}
 *
 */
var Tabs = (function (_super) {
    __extends(Tabs, _super);
    function Tabs(parent, viewCtrl, _app, config, elementRef, _plt, renderer, _linker, keyboard) {
        var _this = _super.call(this, config, elementRef, renderer, 'tabs') || this;
        _this.viewCtrl = viewCtrl;
        _this._app = _app;
        _this._plt = _plt;
        _this._linker = _linker;
        /** @internal */
        _this._ids = -1;
        /** @internal */
        _this._tabs = [];
        /** @internal */
        _this._selectHistory = [];
        /** @internal */
        _this._onDestroy = new Subject();
        /**
         * @output {any} Emitted when the tab changes.
         */
        _this.ionChange = new EventEmitter();
        _this.parent = parent;
        _this.id = 't' + (++tabIds);
        _this._sbPadding = config.getBoolean('statusbarPadding');
        _this.tabsHighlight = config.getBoolean('tabsHighlight');
        if (_this.parent) {
            // this Tabs has a parent Nav
            _this.parent.registerChildNav(_this);
        }
        else if (viewCtrl && viewCtrl.getNav()) {
            // this Nav was opened from a modal
            _this.parent = viewCtrl.getNav();
            _this.parent.registerChildNav(_this);
        }
        else if (_this._app) {
            // this is the root navcontroller for the entire app
            _this._app.registerRootNav(_this);
        }
        // Tabs may also be an actual ViewController which was navigated to
        // if Tabs is static and not navigated to within a NavController
        // then skip this and don't treat it as it's own ViewController
        if (viewCtrl) {
            viewCtrl._setContent(_this);
            viewCtrl._setContentRef(elementRef);
        }
        var keyboardResizes = config.getBoolean('keyboardResizes', false);
        if (keyboard && keyboardResizes) {
            keyboard.willHide
                .takeUntil(_this._onDestroy)
                .subscribe(function () {
                _this._plt.timeout(function () { return _this.setTabbarHidden(false); }, 50);
            });
            keyboard.willShow
                .takeUntil(_this._onDestroy)
                .subscribe(function () { return _this.setTabbarHidden(true); });
        }
        return _this;
    }
    /**
     * @internal
     */
    Tabs.prototype.setTabbarHidden = function (tabbarHidden) {
        this.setElementClass('tabbar-hidden', tabbarHidden);
        this.resize();
    };
    /**
     * @internal
     */
    Tabs.prototype.ngOnDestroy = function () {
        this._onDestroy.next();
        if (this.parent) {
            this.parent.unregisterChildNav(this);
        }
        else {
            this._app.unregisterRootNav(this);
        }
    };
    /**
     * @internal
     */
    Tabs.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._setConfig('tabsPlacement', 'bottom');
        this._setConfig('tabsLayout', 'icon-top');
        this._setConfig('tabsHighlight', this.tabsHighlight);
        if (this.tabsHighlight) {
            this._plt.resize
                .takeUntil(this._onDestroy)
                .subscribe(function () { return _this._highlight.select(_this.getSelected()); });
        }
        this.initTabs();
    };
    /**
     * @internal
     */
    Tabs.prototype.initTabs = function () {
        var _this = this;
        // get the selected index from the input
        // otherwise default it to use the first index
        var selectedIndex = (isBlank(this.selectedIndex) ? 0 : parseInt(this.selectedIndex, 10));
        // now see if the deep linker can find a tab index
        var tabsSegment = this._linker.getSegmentByNavIdOrName(this.id, this.name);
        if (tabsSegment) {
            // we found a segment which probably represents which tab to select
            selectedIndex = this._getSelectedTabIndex(tabsSegment.secondaryId, selectedIndex);
        }
        // get the selectedIndex and ensure it isn't hidden or disabled
        var selectedTab = this._tabs.find(function (t, i) { return i === selectedIndex && t.enabled && t.show; });
        if (!selectedTab) {
            // wasn't able to select the tab they wanted
            // try to find the first tab that's available
            selectedTab = this._tabs.find(function (t) { return t.enabled && t.show; });
        }
        var promise = Promise.resolve();
        if (selectedTab) {
            selectedTab._segment = tabsSegment;
            promise = this.select(selectedTab);
        }
        return promise.then(function () {
            // set the initial href attribute values for each tab
            _this._tabs.forEach(function (t) {
                t.updateHref(t.root, t.rootParams);
            });
        });
    };
    /**
     * @internal
     */
    Tabs.prototype._setConfig = function (attrKey, fallback) {
        var val = this[attrKey];
        if (isBlank(val)) {
            val = this._config.get(attrKey, fallback);
        }
        this.setElementAttribute(attrKey, val);
    };
    /**
     * @hidden
     */
    Tabs.prototype.add = function (tab) {
        this._tabs.push(tab);
        return this.id + '-' + (++this._ids);
    };
    /**
     * @param {number|Tab} tabOrIndex Index, or the Tab instance, of the tab to select.
     */
    Tabs.prototype.select = function (tabOrIndex, opts, fromUrl) {
        var _this = this;
        if (opts === void 0) { opts = {}; }
        if (fromUrl === void 0) { fromUrl = false; }
        var selectedTab = (typeof tabOrIndex === 'number' ? this.getByIndex(tabOrIndex) : tabOrIndex);
        if (isBlank(selectedTab)) {
            return Promise.resolve();
        }
        // If the selected tab is the current selected tab, we do not switch
        var currentTab = this.getSelected();
        if (selectedTab === currentTab && currentTab.getActive()) {
            return this._updateCurrentTab(selectedTab, fromUrl);
        }
        // If the selected tab does not have a root, we do not switch (#9392)
        // it's possible the tab is only for opening modal's or signing out
        // and doesn't actually have content. In the case there's no content
        // for a tab then do nothing and leave the current view as is
        if (selectedTab.root) {
            // At this point we are going to perform a page switch
            // Let's fire willLeave in the current tab page
            var currentPage;
            if (currentTab) {
                currentPage = currentTab.getActive();
                currentPage && currentPage._willLeave(false);
            }
            // Fire willEnter in the new selected tab
            var selectedPage_1 = selectedTab.getActive();
            selectedPage_1 && selectedPage_1._willEnter();
            // Let's start the transition
            opts.animate = false;
            return selectedTab.load(opts).then(function () {
                _this._tabSwitchEnd(selectedTab, selectedPage_1, currentPage);
                if (opts.updateUrl !== false) {
                    _this._linker.navChange(DIRECTION_SWITCH);
                }
                (void 0) /* assert */;
                _this._fireChangeEvent(selectedTab);
            });
        }
        else {
            this._fireChangeEvent(selectedTab);
            return Promise.resolve();
        }
    };
    Tabs.prototype._fireChangeEvent = function (selectedTab) {
        selectedTab.ionSelect.emit(selectedTab);
        this.ionChange.emit(selectedTab);
    };
    Tabs.prototype._tabSwitchEnd = function (selectedTab, selectedPage, currentPage) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        // Update tabs selection state
        var tabs = this._tabs;
        var tab;
        for (var i = 0; i < tabs.length; i++) {
            tab = tabs[i];
            tab.setSelected(tab === selectedTab);
        }
        if (this.tabsHighlight) {
            this._highlight.select(selectedTab);
        }
        // Fire didEnter/didLeave lifecycle events
        if (selectedPage) {
            selectedPage._didEnter();
            this._app.viewDidEnter.emit(selectedPage);
        }
        if (currentPage) {
            currentPage && currentPage._didLeave();
            this._app.viewDidLeave.emit(currentPage);
        }
        // track the order of which tabs have been selected, by their index
        // do not track if the tab index is the same as the previous
        if (this._selectHistory[this._selectHistory.length - 1] !== selectedTab.id) {
            this._selectHistory.push(selectedTab.id);
        }
    };
    /**
     * Get the previously selected Tab which is currently not disabled or hidden.
     * @param {boolean} trimHistory If the selection history should be trimmed up to the previous tab selection or not.
     * @returns {Tab}
     */
    Tabs.prototype.previousTab = function (trimHistory) {
        var _this = this;
        if (trimHistory === void 0) { trimHistory = true; }
        // walk backwards through the tab selection history
        // and find the first previous tab that is enabled and shown
        (void 0) /* console.debug */;
        for (var i = this._selectHistory.length - 2; i >= 0; i--) {
            var tab = this._tabs.find(function (t) { return t.id === _this._selectHistory[i]; });
            if (tab && tab.enabled && tab.show) {
                if (trimHistory) {
                    this._selectHistory.splice(i + 1);
                }
                return tab;
            }
        }
        return null;
    };
    /**
     * @param {number} index Index of the tab you want to get
     * @returns {Tab} Returns the tab who's index matches the one passed
     */
    Tabs.prototype.getByIndex = function (index) {
        return this._tabs[index];
    };
    /**
     * @return {Tab} Returns the currently selected tab
     */
    Tabs.prototype.getSelected = function () {
        var tabs = this._tabs;
        for (var i = 0; i < tabs.length; i++) {
            if (tabs[i].isSelected) {
                return tabs[i];
            }
        }
        return null;
    };
    /**
     * @internal
     */
    Tabs.prototype.getActiveChildNavs = function () {
        var selected = this.getSelected();
        return selected ? [selected] : [];
    };
    /**
     * @internal
     */
    Tabs.prototype.getAllChildNavs = function () {
        return this._tabs;
    };
    /**
     * @internal
     */
    Tabs.prototype.getIndex = function (tab) {
        return this._tabs.indexOf(tab);
    };
    /**
     * @internal
     */
    Tabs.prototype.length = function () {
        return this._tabs.length;
    };
    /**
     * "Touch" the active tab, going back to the root view of the tab
     * or optionally letting the tab handle the event
     */
    Tabs.prototype._updateCurrentTab = function (tab, fromUrl) {
        var active = tab.getActive();
        if (active) {
            if (fromUrl && tab._segment) {
                // see if the view controller exists
                var vc = tab.getViewById(tab._segment.name);
                if (vc) {
                    // the view is already in the stack
                    return tab.popTo(vc, {
                        animate: false,
                        updateUrl: false,
                    });
                }
                else if (tab._views.length === 0 && tab._segment.defaultHistory && tab._segment.defaultHistory.length) {
                    return this._linker.initViews(tab._segment).then(function (views) {
                        return tab.setPages(views, {
                            animate: false, updateUrl: false
                        });
                    }).then(function () {
                        tab._segment = null;
                    });
                }
                else {
                    return tab.setRoot(tab._segment.name, tab._segment.data, {
                        animate: false, updateUrl: false
                    }).then(function () {
                        tab._segment = null;
                    });
                }
            }
            else if (active._cmp && active._cmp.instance.ionSelected) {
                // if they have a custom tab selected handler, call it
                active._cmp.instance.ionSelected();
                return Promise.resolve();
            }
            else if (tab.length() > 1) {
                // if we're a few pages deep, pop to root
                return tab.popToRoot();
            }
            else {
                return getComponent(this._linker, tab.root).then(function (viewController) {
                    if (viewController.component !== active.component) {
                        // Otherwise, if the page we're on is not our real root
                        // reset it to our default root type
                        return tab.setRoot(tab.root);
                    }
                }).catch(function () {
                    (void 0) /* console.debug */;
                });
            }
        }
    };
    /**
     * @internal
     * DOM WRITE
     */
    Tabs.prototype.setTabbarPosition = function (top, bottom) {
        if (this._top !== top || this._bottom !== bottom) {
            var tabbarEle = this._tabbar.nativeElement;
            tabbarEle.style.top = (top > -1 ? top + 'px' : '');
            tabbarEle.style.bottom = (bottom > -1 ? bottom + 'px' : '');
            tabbarEle.classList.add('show-tabbar');
            this._top = top;
            this._bottom = bottom;
        }
    };
    /**
     * @internal
     */
    Tabs.prototype.resize = function () {
        var tab = this.getSelected();
        tab && tab.resize();
    };
    /**
     * @internal
     */
    Tabs.prototype.initPane = function () {
        var isMain = this._elementRef.nativeElement.hasAttribute('main');
        return isMain;
    };
    /**
     * @internal
     */
    Tabs.prototype.paneChanged = function (isPane) {
        if (isPane) {
            this.resize();
        }
    };
    Tabs.prototype.goToRoot = function (opts) {
        if (this._tabs.length) {
            return this.select(this._tabs[0], opts);
        }
    };
    /*
     * @private
     */
    Tabs.prototype.getType = function () {
        return 'tabs';
    };
    /*
     * @private
     */
    Tabs.prototype.getSecondaryIdentifier = function () {
        var tabs = this.getActiveChildNavs();
        if (tabs && tabs.length) {
            return this._linker._getTabSelector(tabs[0]);
        }
        return '';
    };
    /**
     * @private
     */
    Tabs.prototype._getSelectedTabIndex = function (secondaryId, fallbackIndex) {
        if (secondaryId === void 0) { secondaryId = ''; }
        if (fallbackIndex === void 0) { fallbackIndex = 0; }
        // we found a segment which probably represents which tab to select
        var indexMatch = secondaryId.match(/tab-(\d+)/);
        if (indexMatch) {
            // awesome, the segment name was something "tab-0", and
            // the numbe represents which tab to select
            return parseInt(indexMatch[1], 10);
        }
        // wasn't in the "tab-0" format so maybe it's using a word
        var tab = this._tabs.find(function (t) {
            return (isPresent(t.tabUrlPath) && t.tabUrlPath === secondaryId) ||
                (isPresent(t.tabTitle) && formatUrlPart(t.tabTitle) === secondaryId);
        });
        return isPresent(tab) ? tab.index : fallbackIndex;
    };
    Tabs.decorators = [
        { type: Component, args: [{
                    selector: 'ion-tabs',
                    template: '<div class="tabbar" role="tablist" #tabbar>' +
                        '<a *ngFor="let t of _tabs" [tab]="t" class="tab-button" role="tab" href="#" (ionSelect)="select(t)"></a>' +
                        '<div class="tab-highlight"></div>' +
                        '</div>' +
                        '<ng-content></ng-content>' +
                        '<div #portal tab-portal></div>',
                    encapsulation: ViewEncapsulation.None,
                    providers: [{ provide: RootNode, useExisting: forwardRef(function () { return Tabs; }) }]
                },] },
    ];
    /** @nocollapse */
    Tabs.ctorParameters = function () { return [
        { type: NavController, decorators: [{ type: Optional },] },
        { type: ViewController, decorators: [{ type: Optional },] },
        { type: App, },
        { type: Config, },
        { type: ElementRef, },
        { type: Platform, },
        { type: Renderer, },
        { type: DeepLinker, },
        { type: Keyboard, },
    ]; };
    Tabs.propDecorators = {
        'name': [{ type: Input },],
        'selectedIndex': [{ type: Input },],
        'tabsLayout': [{ type: Input },],
        'tabsPlacement': [{ type: Input },],
        'tabsHighlight': [{ type: Input },],
        'ionChange': [{ type: Output },],
        '_highlight': [{ type: ViewChild, args: [TabHighlight,] },],
        '_tabbar': [{ type: ViewChild, args: ['tabbar',] },],
        'portal': [{ type: ViewChild, args: ['portal', { read: ViewContainerRef },] },],
    };
    return Tabs;
}(Ion));
export { Tabs };
var tabIds = -1;
//# sourceMappingURL=tabs.js.map