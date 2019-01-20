import { NgZone } from '@angular/core';
import { App } from '../components/app/app';
import { Config } from '../config/config';
import { Content } from '../components/content/content';
import { DeepLinker } from '../navigation/deep-linker';
import { DomController } from '../platform/dom-controller';
import { GestureController } from '../gestures/gesture-controller';
import { Haptic } from '../tap-click/haptic';
import { IonicApp } from '../components/app/app-root';
import { Menu } from '../components/menu/menu';
import { NavControllerBase } from '../navigation/nav-controller-base';
import { OverlayPortal } from '../components/app/overlay-portal';
import { PageTransition } from '../transitions/page-transition';
import { Platform } from '../platform/platform';
import { QueryParams } from '../platform/query-params';
import { Tab } from '../components/tabs/tab';
import { Tabs } from '../components/tabs/tabs';
import { TransitionController } from '../transitions/transition-controller';
import { UrlSerializer } from '../navigation/url-serializer';
import { ViewController } from '../navigation/view-controller';
import { ModuleLoader } from './module-loader';
import { NgModuleLoader } from './ng-module-loader';
import { STATE_INITIALIZED } from '../navigation/nav-util';
import { Ion } from '../components/ion';
import { Item } from '../components/item/item';
import { Form } from './form';
export function mockConfig(config, _url = '/', platform) {
    const c = new Config();
    const p = platform || mockPlatform();
    c.init(config, p);
    return c;
}
export function mockQueryParams(url = '/') {
    const qp = new QueryParams();
    qp.parseUrl(url);
    return qp;
}
export function mockPlatform() {
    return new MockPlatform();
}
export class MockPlatform extends Platform {
    constructor() {
        super();
        this.timeoutIds = 0;
        this.timeouts = [];
        this.rafIds = 0;
        this.timeStamps = 0;
        this.rafs = [];
        const doc = document.implementation.createHTMLDocument('');
        this.setWindow(window);
        this.setDocument(doc);
        this.setCssProps(doc.documentElement);
    }
    timeout(callback, timeout) {
        const timeoutId = ++this.timeoutIds;
        this.timeouts.push({
            callback: callback,
            timeout: timeout,
            timeoutId: timeoutId
        });
        return timeoutId;
    }
    cancelTimeout(timeoutId) {
        for (var i = 0; i < this.timeouts.length; i++) {
            if (timeoutId === this.timeouts[i].timeoutId) {
                this.timeouts.splice(i, 1);
                break;
            }
        }
    }
    flushTimeouts(done) {
        setTimeout(() => {
            this.timeouts.sort(function (a, b) {
                if (a.timeout < b.timeout)
                    return -1;
                if (a.timeout > b.timeout)
                    return 1;
                return 0;
            }).forEach(t => {
                t.callback();
            });
            this.timeouts.length = 0;
            done();
        });
    }
    flushTimeoutsUntil(timeout, done) {
        setTimeout(() => {
            this.timeouts.sort(function (a, b) {
                if (a.timeout < b.timeout)
                    return -1;
                if (a.timeout > b.timeout)
                    return 1;
                return 0;
            });
            const keepers = [];
            this.timeouts.forEach(t => {
                if (t.timeout < timeout) {
                    t.callback();
                }
                else {
                    keepers.push(t);
                }
            });
            this.timeouts = keepers;
            done();
        });
    }
    raf(callback) {
        const rafId = ++this.rafIds;
        this.rafs.push({
            callback: callback,
            rafId: rafId
        });
        return rafId;
    }
    cancelRaf(rafId) {
        for (var i = 0; i < this.rafs.length; i++) {
            if (rafId === this.rafs[i].rafId) {
                this.rafs.splice(i, 1);
                break;
            }
        }
    }
    flushRafs(done) {
        const timestamp = ++this.timeStamps;
        setTimeout(() => {
            this.rafs.forEach(raf => {
                raf.callback(timestamp);
            });
            this.rafs.length = 0;
            done(timestamp);
        });
    }
}
export function mockDomController(platform) {
    platform = platform || mockPlatform();
    return new MockDomController(platform);
}
export class MockDomController extends DomController {
    constructor(mockedPlatform) {
        super(mockedPlatform);
        this.mockedPlatform = mockedPlatform;
    }
    flush(done) {
        this.mockedPlatform.flushTimeouts(() => {
            this.mockedPlatform.flushRafs((timeStamp) => {
                done(timeStamp);
            });
        });
    }
    flushUntil(timeout, done) {
        this.mockedPlatform.flushTimeoutsUntil(timeout, () => {
            this.mockedPlatform.flushRafs((timeStamp) => {
                done(timeStamp);
            });
        });
    }
}
export function mockApp(config, platform) {
    platform = platform || mockPlatform();
    config = config || mockConfig(null, '/', platform);
    let app = new App(config, platform);
    mockIonicApp(app, config, platform);
    return app;
}
export function mockIonicApp(app, config, plt) {
    let appRoot = new IonicApp(null, null, mockElementRef(), mockRenderer(), config, plt, app);
    appRoot._loadingPortal = mockOverlayPortal(app, config, plt);
    appRoot._toastPortal = mockOverlayPortal(app, config, plt);
    appRoot._overlayPortal = mockOverlayPortal(app, config, plt);
    appRoot._modalPortal = mockOverlayPortal(app, config, plt);
    return appRoot;
}
export const mockTrasitionController = function (config) {
    let platform = mockPlatform();
    platform.raf = function (callback) {
        callback();
    };
    let trnsCtrl = new TransitionController(platform, config);
    trnsCtrl.get = (trnsId, enteringView, leavingView, opts) => {
        let trns = new PageTransition(platform, enteringView, leavingView, opts);
        trns.trnsId = trnsId;
        return trns;
    };
    return trnsCtrl;
};
export function mockContent() {
    const platform = mockPlatform();
    return new Content(mockConfig(), platform, mockDomController(platform), mockElementRef(), mockRenderer(), null, null, mockZone(), null, null);
}
export function mockZone() {
    return new NgZone({ enableLongStackTrace: false });
}
export function mockChangeDetectorRef() {
    let cd = {
        reattach: () => { },
        detach: () => { },
        detectChanges: () => { }
    };
    return cd;
}
export function mockGestureController(app) {
    if (!app) {
        app = mockApp();
    }
    return new GestureController(app);
}
export class MockElementRef {
    constructor(ele) {
        this.nativeElement = ele;
    }
}
export class MockElement {
    constructor() {
        this.children = [];
        this.classList = new ClassList();
        this.attributes = {};
        this.style = {};
        this.nodeName = 'ION-MOCK';
        this.clientWidth = 0;
        this.clientHeight = 0;
        this.clientTop = 0;
        this.clientLeft = 0;
        this.offsetWidth = 0;
        this.offsetHeight = 0;
        this.offsetTop = 0;
        this.offsetLeft = 0;
        this.scrollTop = 0;
        this.scrollHeight = 0;
    }
    get className() {
        return this.classList.classes.join(' ');
    }
    set className(val) {
        this.classList.classes = val.split(' ');
    }
    hasAttribute(name) {
        return !!this.attributes[name];
    }
    getAttribute(name) {
        return this.attributes[name];
    }
    setAttribute(name, val) {
        this.attributes[name] = val;
    }
    addEventListener(_type, _listener, _options) { }
    removeEventListener(_type, _listener, _options) { }
    removeAttribute(name) {
        delete this.attributes[name];
    }
}
export class ClassList {
    constructor() {
        this.classes = [];
    }
    add(className) {
        if (!this.contains(className)) {
            this.classes.push(className);
        }
    }
    remove(className) {
        const index = this.classes.indexOf(className);
        if (index > -1) {
            this.classes.splice(index, 1);
        }
    }
    toggle(className) {
        if (this.contains(className)) {
            this.remove(className);
        }
        else {
            this.add(className);
        }
    }
    contains(className) {
        return this.classes.indexOf(className) > -1;
    }
}
export function mockElementRef() {
    return new MockElementRef(new MockElement());
}
export function mockElementRefEle(ele) {
    return new MockElementRef(ele);
}
export class MockRenderer {
    setElementAttribute(renderElement, name, val) {
        if (name === null) {
            renderElement.removeAttribute(name);
        }
        else {
            renderElement.setAttribute(name, val);
        }
    }
    setElementClass(renderElement, className, isAdd) {
        if (isAdd) {
            renderElement.classList.add(className);
        }
        else {
            renderElement.classList.remove(className);
        }
    }
    setElementStyle(renderElement, styleName, styleValue) {
        renderElement.style[styleName] = styleValue;
    }
}
export function mockRenderer() {
    const renderer = new MockRenderer();
    return renderer;
}
export function mockLocation() {
    let location = {
        path: () => { return ''; },
        subscribe: () => { },
        go: () => { },
        back: () => { },
        prepareExternalUrl: () => { }
    };
    return location;
}
export function mockView(component, data) {
    if (!component) {
        component = MockView;
    }
    let view = new ViewController(component, data);
    view.init(mockComponentRef());
    return view;
}
export function mockViews(nav, views) {
    nav._views = views;
    views.forEach(v => {
        v._setNav(nav);
    });
}
export function mockComponentRef() {
    let componentRef = {
        location: mockElementRef(),
        changeDetectorRef: mockChangeDetectorRef(),
        destroy: () => { }
    };
    return componentRef;
}
export function mockDeepLinker(linkConfig = null, app) {
    app = app || mockApp(mockConfig(), mockPlatform());
    let serializer = new UrlSerializer(app, linkConfig);
    let location = mockLocation();
    return new DeepLinker(app || mockApp(), serializer, location, null, null);
}
export function mockNavController() {
    let platform = mockPlatform();
    let config = mockConfig(null, '/', platform);
    let app = mockApp(config, platform);
    let zone = mockZone();
    let dom = mockDomController(platform);
    let elementRef = mockElementRef();
    let renderer = mockRenderer();
    let componentFactoryResolver = null;
    let gestureCtrl = new GestureController(app);
    let linker = mockDeepLinker(null, app);
    let trnsCtrl = mockTrasitionController(config);
    let nav = new NavControllerBase(null, app, config, platform, elementRef, zone, renderer, componentFactoryResolver, gestureCtrl, trnsCtrl, linker, dom, null);
    nav._viewInit = function (enteringView) {
        enteringView.init(mockComponentRef());
        enteringView._state = STATE_INITIALIZED;
    };
    nav._orgViewInsert = nav._viewAttachToDOM;
    nav._viewAttachToDOM = function (view, componentRef, _viewport) {
        let mockedViewport = {
            insert: () => { }
        };
        nav._orgViewInsert(view, componentRef, mockedViewport);
    };
    return nav;
}
export function mockOverlayPortal(app, config, plt) {
    let zone = mockZone();
    let dom = mockDomController(plt);
    let elementRef = mockElementRef();
    let renderer = mockRenderer();
    let componentFactoryResolver = null;
    let gestureCtrl = new GestureController(app);
    let serializer = new UrlSerializer(app, null);
    let location = mockLocation();
    let deepLinker = new DeepLinker(app, serializer, location, null, null);
    return new OverlayPortal(app, config, plt, elementRef, zone, renderer, componentFactoryResolver, gestureCtrl, null, deepLinker, null, dom, null);
}
export function mockTab(parentTabs, overrideLoad = true) {
    let platform = mockPlatform();
    let config = mockConfig(null, '/', platform);
    let app = parentTabs._app || mockApp(config, platform);
    let zone = mockZone();
    let dom = mockDomController(platform);
    let elementRef = mockElementRef();
    let renderer = mockRenderer();
    let changeDetectorRef = mockChangeDetectorRef();
    let compiler = null;
    let gestureCtrl = new GestureController(app);
    let linker = mockDeepLinker(null, app);
    let tab = new Tab(parentTabs, app, config, platform, elementRef, zone, renderer, compiler, changeDetectorRef, gestureCtrl, null, linker, dom, null);
    if (overrideLoad) {
        tab.load = (_opts) => {
            return Promise.resolve();
        };
    }
    return tab;
}
export function mockForm() {
    return new Form();
}
export function mockIon() {
    const config = mockConfig();
    const elementRef = mockElementRef();
    const renderer = mockRenderer();
    return new Ion(config, elementRef, renderer, 'ion');
}
export function mockItem() {
    const form = mockForm();
    const config = mockConfig();
    const elementRef = mockElementRef();
    const renderer = mockRenderer();
    return new Item(form, config, elementRef, renderer, null);
}
export function mockTabs(app) {
    let platform = mockPlatform();
    let config = mockConfig(null, '/', platform);
    app = app || mockApp(config, platform);
    let elementRef = mockElementRef();
    let renderer = mockRenderer();
    let linker = mockDeepLinker();
    return new Tabs(null, null, app, config, elementRef, platform, renderer, linker);
}
export function mockMenu(platform = null) {
    let app = mockApp();
    let gestureCtrl = new GestureController(app);
    let dom = mockDomController();
    let elementRef = mockElementRef();
    let renderer = mockRenderer();
    let plt = platform === null ? mockPlatform() : platform;
    return new Menu(null, elementRef, null, plt, renderer, null, gestureCtrl, dom, app);
}
export function mockDeepLinkConfig(links) {
    return {
        links: links || [
            { component: MockView1, name: 'viewone' },
            { component: MockView2, name: 'viewtwo' },
            { component: MockView3, name: 'viewthree' },
            { component: MockView4, name: 'viewfour' },
            { component: MockView5, name: 'viewfive' }
        ]
    };
}
export function mockHaptic() {
    return new Haptic(mockPlatform());
}
export class MockView {
}
export class MockView1 {
}
export class MockView2 {
}
export class MockView3 {
}
export class MockView4 {
}
export class MockView5 {
}
export function noop() { return 'noop'; }
export function mockModuleLoader(ngModuleLoader) {
    ngModuleLoader = ngModuleLoader || mockNgModuleLoader();
    return new ModuleLoader(ngModuleLoader, null);
}
export function mockNgModuleLoader() {
    return new NgModuleLoader(null);
}
export function mockOverlay() {
    return {
        present: (_opts) => { return Promise.resolve(); },
        dismiss: (_data, _role, _navOptions) => { return Promise.resolve(); },
        onDidDismiss: (_callback) => { },
        onWillDismiss: (_callback) => { }
    };
}
//# sourceMappingURL=mock-providers.js.map