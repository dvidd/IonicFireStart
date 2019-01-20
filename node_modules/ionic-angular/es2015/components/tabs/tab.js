import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, ErrorHandler, EventEmitter, Input, NgZone, Optional, Output, Renderer, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { DeepLinker } from '../../navigation/deep-linker';
import { DomController } from '../../platform/dom-controller';
import { GestureController } from '../../gestures/gesture-controller';
import { isTrueProperty } from '../../util/util';
import { NavControllerBase } from '../../navigation/nav-controller-base';
import { Platform } from '../../platform/platform';
import { Tabs } from './tabs';
import { TransitionController } from '../../transitions/transition-controller';
/**
 * @name Tab
 * @description
 * The Tab component, written `<ion-tab>`, is styled based on the mode and should
 * be used in conjunction with the [Tabs](../Tabs/) component.
 *
 * Each `ion-tab` is a declarative component for a [NavController](../../../navigation/NavController/).
 * Basically, each tab is a `NavController`. For more information on using
 * navigation controllers take a look at the [NavController API Docs](../../../navigation/NavController/).
 *
 * See the [Tabs API Docs](../Tabs/) for more details on configuring Tabs.
 *
 * @usage
 *
 * To add a basic tab, you can use the following markup where the `root` property
 * is the page you want to load for that tab, `tabTitle` is the optional text to
 * display on the tab, and `tabIcon` is the optional [icon](../../icon/Icon/).
 *
 * ```html
 * <ion-tabs>
 *  <ion-tab [root]="chatRoot" tabTitle="Chat" tabIcon="chat"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * Then, in your class you can set `chatRoot` to an imported class:
 *
 * ```ts
 * import { ChatPage } from '../chat/chat';
 *
 * export class Tabs {
 *   // here we'll set the property of chatRoot to
 *   // the imported class of ChatPage
 *   chatRoot = ChatPage;
 *
 *   constructor() {
 *
 *   }
 * }
 * ```
 *
 * You can also pass some parameters to the root page of the tab through
 * `rootParams`. Below we pass `chatParams` to the Chat tab:
 *
 * ```html
 * <ion-tabs>
 *  <ion-tab [root]="chatRoot" [rootParams]="chatParams" tabTitle="Chat" tabIcon="chat"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * ```ts
 * export class Tabs {
 *   chatRoot = ChatPage;
 *
 *   // set some user information on chatParams
 *   chatParams = {
 *     user1: 'admin',
 *     user2: 'ionic'
 *   };
 *
 *   constructor() {
 *
 *   }
 * }
 * ```
 *
 * And in `ChatPage` you can get the data from `NavParams`:
 *
 * ```ts
 * export class ChatPage {
 *   constructor(navParams: NavParams) {
 *     console.log('Passed params', navParams.data);
 *   }
 * }
 * ```
 *
 * Sometimes you may want to call a method instead of navigating to a new
 * page. You can use the `(ionSelect)` event to call a method on your class when
 * the tab is selected. Below is an example of presenting a modal from one of
 * the tabs.
 *
 * ```html
 * <ion-tabs>
 *   <ion-tab (ionSelect)="chat()" tabTitle="Show Modal"></ion-tab>
 * </ion-tabs>pop
 * ```
 *
 * ```ts
 * export class Tabs {
 *   constructor(public modalCtrl: ModalController) {
 *
 *   }
 *
 *   chat() {
 *     let modal = this.modalCtrl.create(ChatPage);
 *     modal.present();
 *   }
 * }
 * ```
 *
 *
 * @demo /docs/demos/src/tabs/
 * @see {@link /docs/components#tabs Tabs Component Docs}
 * @see {@link ../../tabs/Tabs Tabs API Docs}
 * @see {@link ../../nav/Nav Nav API Docs}
 * @see {@link ../../nav/NavController NavController API Docs}
 */
export class Tab extends NavControllerBase {
    constructor(parent, app, config, plt, elementRef, zone, renderer, cfr, _cd, gestureCtrl, transCtrl, linker, _dom, errHandler) {
        // A Tab is a NavController for its child pages
        super(parent, app, config, plt, elementRef, zone, renderer, cfr, gestureCtrl, transCtrl, linker, _dom, errHandler);
        this._cd = _cd;
        this.linker = linker;
        this._dom = _dom;
        /**
         * @hidden
         */
        this._isEnabled = true;
        /**
         * @hidden
         */
        this._isShown = true;
        /**
         * @output {Tab} Emitted when the current tab is selected.
         */
        this.ionSelect = new EventEmitter();
        this.id = parent.add(this);
        this._tabsHideOnSubPages = config.getBoolean('tabsHideOnSubPages');
        this._tabId = 'tabpanel-' + this.id;
        this._btnId = 'tab-' + this.id;
    }
    /**
     * @input {boolean} If true, enable the tab. If false,
     * the user cannot interact with this element.
     * Default: `true`.
     */
    get enabled() {
        return this._isEnabled;
    }
    set enabled(val) {
        this._isEnabled = isTrueProperty(val);
    }
    /**
     * @input {boolean} If true, the tab button is visible within the
     * tabbar. Default: `true`.
     */
    get show() {
        return this._isShown;
    }
    set show(val) {
        this._isShown = isTrueProperty(val);
    }
    /**
     * @input {boolean} If true, hide the tabs on child pages.
     */
    get tabsHideOnSubPages() {
        return this._tabsHideOnSubPages;
    }
    set tabsHideOnSubPages(val) {
        this._tabsHideOnSubPages = isTrueProperty(val);
    }
    /**
     * @hidden
     */
    set _vp(val) {
        this.setViewport(val);
    }
    /**
     * @hidden
     */
    ngOnInit() {
        this.tabBadgeStyle = this.tabBadgeStyle ? this.tabBadgeStyle : 'default';
    }
    /**
     * @hidden
     */
    load(opts) {
        const segment = this._segment;
        if (segment || (!this._loaded && this.root)) {
            this.setElementClass('show-tab', true);
            // okay, first thing we need to do if check if the view already exists
            const nameToUse = segment && segment.name ? segment.name : this.root;
            const dataToUse = segment ? segment.data : this.rootParams;
            const numViews = this.length() - 1;
            for (let i = numViews; i >= 0; i--) {
                const viewController = this.getByIndex(i);
                if (viewController && (viewController.id === nameToUse || viewController.component === nameToUse)) {
                    if (i === numViews) {
                        // this is the last view in the stack and it's the same
                        // as the segment so there's no change needed
                        return Promise.resolve();
                    }
                    else {
                        // it's not the exact view as the end
                        // let's have this nav go back to this exact view
                        return this.popTo(viewController, {
                            animate: false,
                            updateUrl: false,
                        });
                    }
                }
            }
            let promise = null;
            if (segment && segment.defaultHistory && segment.defaultHistory.length && this._views.length === 0) {
                promise = this.linker.initViews(segment).then((views) => {
                    return this.setPages(views, opts);
                });
            }
            else {
                promise = this.push(nameToUse, dataToUse, opts);
            }
            return promise.then(() => {
                this._segment = null;
                this._loaded = true;
            });
        }
        else {
            // if this is not the Tab's initial load then we need
            // to refresh the tabbar and content dimensions to be sure
            // they're lined up correctly
            this._dom.read(() => {
                this.resize();
            });
            return Promise.resolve();
        }
    }
    /**
     * @hidden
     */
    resize() {
        const active = this.getActive();
        if (!active) {
            return;
        }
        const content = active.getIONContent();
        content && content.resize();
    }
    /**
     * @hidden
     */
    _viewAttachToDOM(viewCtrl, componentRef, viewport) {
        const isTabSubPage = (this._tabsHideOnSubPages && viewCtrl.index > 0);
        if (isTabSubPage) {
            viewport = this.parent.portal;
        }
        super._viewAttachToDOM(viewCtrl, componentRef, viewport);
        if (isTabSubPage) {
            // add the .tab-subpage css class to tabs pages that should act like subpages
            const pageEleRef = viewCtrl.pageRef();
            if (pageEleRef) {
                this._renderer.setElementClass(pageEleRef.nativeElement, 'tab-subpage', true);
            }
        }
    }
    /**
     * @hidden
     */
    setSelected(isSelected) {
        this.isSelected = isSelected;
        this.setElementClass('show-tab', isSelected);
        this.setElementAttribute('aria-hidden', (!isSelected).toString());
        if (isSelected) {
            // this is the selected tab, detect changes
            this._cd.reattach();
        }
        else {
            // this tab is not selected, do not detect changes
            this._cd.detach();
        }
    }
    /**
     * @hidden
     */
    get index() {
        return this.parent.getIndex(this);
    }
    /**
     * @hidden
     */
    updateHref(component, data) {
        if (this.btn && this.linker) {
            let href = this.linker.createUrl(this.parent, component, data) || '#';
            this.btn.updateHref(href);
        }
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        this.destroy();
    }
    /**
     * @hidden
     */
    getType() {
        return 'tab';
    }
    goToRoot(opts) {
        return this.setRoot(this.root, this.rootParams, opts, null);
    }
}
Tab.decorators = [
    { type: Component, args: [{
                selector: 'ion-tab',
                template: '<div #viewport></div><div class="nav-decor"></div>',
                host: {
                    '[attr.id]': '_tabId',
                    '[attr.aria-labelledby]': '_btnId',
                    'role': 'tabpanel'
                },
                encapsulation: ViewEncapsulation.None,
            },] },
];
/** @nocollapse */
Tab.ctorParameters = () => [
    { type: Tabs, },
    { type: App, },
    { type: Config, },
    { type: Platform, },
    { type: ElementRef, },
    { type: NgZone, },
    { type: Renderer, },
    { type: ComponentFactoryResolver, },
    { type: ChangeDetectorRef, },
    { type: GestureController, },
    { type: TransitionController, },
    { type: DeepLinker, decorators: [{ type: Optional },] },
    { type: DomController, },
    { type: ErrorHandler, },
];
Tab.propDecorators = {
    'root': [{ type: Input },],
    'rootParams': [{ type: Input },],
    'tabUrlPath': [{ type: Input },],
    'tabTitle': [{ type: Input },],
    'tabIcon': [{ type: Input },],
    'tabBadge': [{ type: Input },],
    'tabBadgeStyle': [{ type: Input },],
    'enabled': [{ type: Input },],
    'show': [{ type: Input },],
    'tabsHideOnSubPages': [{ type: Input },],
    'ionSelect': [{ type: Output },],
    '_vp': [{ type: ViewChild, args: ['viewport', { read: ViewContainerRef },] },],
};
//# sourceMappingURL=tab.js.map