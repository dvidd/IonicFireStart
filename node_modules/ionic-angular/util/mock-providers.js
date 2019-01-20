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
export function mockConfig(config, _url, platform) {
    if (_url === void 0) { _url = '/'; }
    var c = new Config();
    var p = platform || mockPlatform();
    c.init(config, p);
    return c;
}
export function mockQueryParams(url) {
    if (url === void 0) { url = '/'; }
    var qp = new QueryParams();
    qp.parseUrl(url);
    return qp;
}
export function mockPlatform() {
    return new MockPlatform();
}
var MockPlatform = (function (_super) {
    __extends(MockPlatform, _super);
    function MockPlatform() {
        var _this = _super.call(this) || this;
        _this.timeoutIds = 0;
        _this.timeouts = [];
        _this.rafIds = 0;
        _this.timeStamps = 0;
        _this.rafs = [];
        var doc = document.implementation.createHTMLDocument('');
        _this.setWindow(window);
        _this.setDocument(doc);
        _this.setCssProps(doc.documentElement);
        return _this;
    }
    MockPlatform.prototype.timeout = function (callback, timeout) {
        var timeoutId = ++this.timeoutIds;
        this.timeouts.push({
            callback: callback,
            timeout: timeout,
            timeoutId: timeoutId
        });
        return timeoutId;
    };
    MockPlatform.prototype.cancelTimeout = function (timeoutId) {
        for (var i = 0; i < this.timeouts.length; i++) {
            if (timeoutId === this.timeouts[i].timeoutId) {
                this.timeouts.splice(i, 1);
                break;
            }
        }
    };
    MockPlatform.prototype.flushTimeouts = function (done) {
        var _this = this;
        setTimeout(function () {
            _this.timeouts.sort(function (a, b) {
                if (a.timeout < b.timeout)
                    return -1;
                if (a.timeout > b.timeout)
                    return 1;
                return 0;
            }).forEach(function (t) {
                t.callback();
            });
            _this.timeouts.length = 0;
            done();
        });
    };
    MockPlatform.prototype.flushTimeoutsUntil = function (timeout, done) {
        var _this = this;
        setTimeout(function () {
            _this.timeouts.sort(function (a, b) {
                if (a.timeout < b.timeout)
                    return -1;
                if (a.timeout > b.timeout)
                    return 1;
                return 0;
            });
            var keepers = [];
            _this.timeouts.forEach(function (t) {
                if (t.timeout < timeout) {
                    t.callback();
                }
                else {
                    keepers.push(t);
                }
            });
            _this.timeouts = keepers;
            done();
        });
    };
    MockPlatform.prototype.raf = function (callback) {
        var rafId = ++this.rafIds;
        this.rafs.push({
            callback: callback,
            rafId: rafId
        });
        return rafId;
    };
    MockPlatform.prototype.cancelRaf = function (rafId) {
        for (var i = 0; i < this.rafs.length; i++) {
            if (rafId === this.rafs[i].rafId) {
                this.rafs.splice(i, 1);
                break;
            }
        }
    };
    MockPlatform.prototype.flushRafs = function (done) {
        var _this = this;
        var timestamp = ++this.timeStamps;
        setTimeout(function () {
            _this.rafs.forEach(function (raf) {
                raf.callback(timestamp);
            });
            _this.rafs.length = 0;
            done(timestamp);
        });
    };
    return MockPlatform;
}(Platform));
export { MockPlatform };
export function mockDomController(platform) {
    platform = platform || mockPlatform();
    return new MockDomController(platform);
}
var MockDomController = (function (_super) {
    __extends(MockDomController, _super);
    function MockDomController(mockedPlatform) {
        var _this = _super.call(this, mockedPlatform) || this;
        _this.mockedPlatform = mockedPlatform;
        return _this;
    }
    MockDomController.prototype.flush = function (done) {
        var _this = this;
        this.mockedPlatform.flushTimeouts(function () {
            _this.mockedPlatform.flushRafs(function (timeStamp) {
                done(timeStamp);
            });
        });
    };
    MockDomController.prototype.flushUntil = function (timeout, done) {
        var _this = this;
        this.mockedPlatform.flushTimeoutsUntil(timeout, function () {
            _this.mockedPlatform.flushRafs(function (timeStamp) {
                done(timeStamp);
            });
        });
    };
    return MockDomController;
}(DomController));
export { MockDomController };
export function mockApp(config, platform) {
    platform = platform || mockPlatform();
    config = config || mockConfig(null, '/', platform);
    var app = new App(config, platform);
    mockIonicApp(app, config, platform);
    return app;
}
export function mockIonicApp(app, config, plt) {
    var appRoot = new IonicApp(null, null, mockElementRef(), mockRenderer(), config, plt, app);
    appRoot._loadingPortal = mockOverlayPortal(app, config, plt);
    appRoot._toastPortal = mockOverlayPortal(app, config, plt);
    appRoot._overlayPortal = mockOverlayPortal(app, config, plt);
    appRoot._modalPortal = mockOverlayPortal(app, config, plt);
    return appRoot;
}
export var mockTrasitionController = function (config) {
    var platform = mockPlatform();
    platform.raf = function (callback) {
        callback();
    };
    var trnsCtrl = new TransitionController(platform, config);
    trnsCtrl.get = function (trnsId, enteringView, leavingView, opts) {
        var trns = new PageTransition(platform, enteringView, leavingView, opts);
        trns.trnsId = trnsId;
        return trns;
    };
    return trnsCtrl;
};
export function mockContent() {
    var platform = mockPlatform();
    return new Content(mockConfig(), platform, mockDomController(platform), mockElementRef(), mockRenderer(), null, null, mockZone(), null, null);
}
export function mockZone() {
    return new NgZone({ enableLongStackTrace: false });
}
export function mockChangeDetectorRef() {
    var cd = {
        reattach: function () { },
        detach: function () { },
        detectChanges: function () { }
    };
    return cd;
}
export function mockGestureController(app) {
    if (!app) {
        app = mockApp();
    }
    return new GestureController(app);
}
var MockElementRef = (function () {
    function MockElementRef(ele) {
        this.nativeElement = ele;
    }
    return MockElementRef;
}());
export { MockElementRef };
var MockElement = (function () {
    function MockElement() {
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
    Object.defineProperty(MockElement.prototype, "className", {
        get: function () {
            return this.classList.classes.join(' ');
        },
        set: function (val) {
            this.classList.classes = val.split(' ');
        },
        enumerable: true,
        configurable: true
    });
    MockElement.prototype.hasAttribute = function (name) {
        return !!this.attributes[name];
    };
    MockElement.prototype.getAttribute = function (name) {
        return this.attributes[name];
    };
    MockElement.prototype.setAttribute = function (name, val) {
        this.attributes[name] = val;
    };
    MockElement.prototype.addEventListener = function (_type, _listener, _options) { };
    MockElement.prototype.removeEventListener = function (_type, _listener, _options) { };
    MockElement.prototype.removeAttribute = function (name) {
        delete this.attributes[name];
    };
    return MockElement;
}());
export { MockElement };
var ClassList = (function () {
    function ClassList() {
        this.classes = [];
    }
    ClassList.prototype.add = function (className) {
        if (!this.contains(className)) {
            this.classes.push(className);
        }
    };
    ClassList.prototype.remove = function (className) {
        var index = this.classes.indexOf(className);
        if (index > -1) {
            this.classes.splice(index, 1);
        }
    };
    ClassList.prototype.toggle = function (className) {
        if (this.contains(className)) {
            this.remove(className);
        }
        else {
            this.add(className);
        }
    };
    ClassList.prototype.contains = function (className) {
        return this.classes.indexOf(className) > -1;
    };
    return ClassList;
}());
export { ClassList };
export function mockElementRef() {
    return new MockElementRef(new MockElement());
}
export function mockElementRefEle(ele) {
    return new MockElementRef(ele);
}
var MockRenderer = (function () {
    function MockRenderer() {
    }
    MockRenderer.prototype.setElementAttribute = function (renderElement, name, val) {
        if (name === null) {
            renderElement.removeAttribute(name);
        }
        else {
            renderElement.setAttribute(name, val);
        }
    };
    MockRenderer.prototype.setElementClass = function (renderElement, className, isAdd) {
        if (isAdd) {
            renderElement.classList.add(className);
        }
        else {
            renderElement.classList.remove(className);
        }
    };
    MockRenderer.prototype.setElementStyle = function (renderElement, styleName, styleValue) {
        renderElement.style[styleName] = styleValue;
    };
    return MockRenderer;
}());
export { MockRenderer };
export function mockRenderer() {
    var renderer = new MockRenderer();
    return renderer;
}
export function mockLocation() {
    var location = {
        path: function () { return ''; },
        subscribe: function () { },
        go: function () { },
        back: function () { },
        prepareExternalUrl: function () { }
    };
    return location;
}
export function mockView(component, data) {
    if (!component) {
        component = MockView;
    }
    var view = new ViewController(component, data);
    view.init(mockComponentRef());
    return view;
}
export function mockViews(nav, views) {
    nav._views = views;
    views.forEach(function (v) {
        v._setNav(nav);
    });
}
export function mockComponentRef() {
    var componentRef = {
        location: mockElementRef(),
        changeDetectorRef: mockChangeDetectorRef(),
        destroy: function () { }
    };
    return componentRef;
}
export function mockDeepLinker(linkConfig, app) {
    if (linkConfig === void 0) { linkConfig = null; }
    app = app || mockApp(mockConfig(), mockPlatform());
    var serializer = new UrlSerializer(app, linkConfig);
    var location = mockLocation();
    return new DeepLinker(app || mockApp(), serializer, location, null, null);
}
export function mockNavController() {
    var platform = mockPlatform();
    var config = mockConfig(null, '/', platform);
    var app = mockApp(config, platform);
    var zone = mockZone();
    var dom = mockDomController(platform);
    var elementRef = mockElementRef();
    var renderer = mockRenderer();
    var componentFactoryResolver = null;
    var gestureCtrl = new GestureController(app);
    var linker = mockDeepLinker(null, app);
    var trnsCtrl = mockTrasitionController(config);
    var nav = new NavControllerBase(null, app, config, platform, elementRef, zone, renderer, componentFactoryResolver, gestureCtrl, trnsCtrl, linker, dom, null);
    nav._viewInit = function (enteringView) {
        enteringView.init(mockComponentRef());
        enteringView._state = STATE_INITIALIZED;
    };
    nav._orgViewInsert = nav._viewAttachToDOM;
    nav._viewAttachToDOM = function (view, componentRef, _viewport) {
        var mockedViewport = {
            insert: function () { }
        };
        nav._orgViewInsert(view, componentRef, mockedViewport);
    };
    return nav;
}
export function mockOverlayPortal(app, config, plt) {
    var zone = mockZone();
    var dom = mockDomController(plt);
    var elementRef = mockElementRef();
    var renderer = mockRenderer();
    var componentFactoryResolver = null;
    var gestureCtrl = new GestureController(app);
    var serializer = new UrlSerializer(app, null);
    var location = mockLocation();
    var deepLinker = new DeepLinker(app, serializer, location, null, null);
    return new OverlayPortal(app, config, plt, elementRef, zone, renderer, componentFactoryResolver, gestureCtrl, null, deepLinker, null, dom, null);
}
export function mockTab(parentTabs, overrideLoad) {
    if (overrideLoad === void 0) { overrideLoad = true; }
    var platform = mockPlatform();
    var config = mockConfig(null, '/', platform);
    var app = parentTabs._app || mockApp(config, platform);
    var zone = mockZone();
    var dom = mockDomController(platform);
    var elementRef = mockElementRef();
    var renderer = mockRenderer();
    var changeDetectorRef = mockChangeDetectorRef();
    var compiler = null;
    var gestureCtrl = new GestureController(app);
    var linker = mockDeepLinker(null, app);
    var tab = new Tab(parentTabs, app, config, platform, elementRef, zone, renderer, compiler, changeDetectorRef, gestureCtrl, null, linker, dom, null);
    if (overrideLoad) {
        tab.load = function (_opts) {
            return Promise.resolve();
        };
    }
    return tab;
}
export function mockForm() {
    return new Form();
}
export function mockIon() {
    var config = mockConfig();
    var elementRef = mockElementRef();
    var renderer = mockRenderer();
    return new Ion(config, elementRef, renderer, 'ion');
}
export function mockItem() {
    var form = mockForm();
    var config = mockConfig();
    var elementRef = mockElementRef();
    var renderer = mockRenderer();
    return new Item(form, config, elementRef, renderer, null);
}
export function mockTabs(app) {
    var platform = mockPlatform();
    var config = mockConfig(null, '/', platform);
    app = app || mockApp(config, platform);
    var elementRef = mockElementRef();
    var renderer = mockRenderer();
    var linker = mockDeepLinker();
    return new Tabs(null, null, app, config, elementRef, platform, renderer, linker);
}
export function mockMenu(platform) {
    if (platform === void 0) { platform = null; }
    var app = mockApp();
    var gestureCtrl = new GestureController(app);
    var dom = mockDomController();
    var elementRef = mockElementRef();
    var renderer = mockRenderer();
    var plt = platform === null ? mockPlatform() : platform;
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
var MockView = (function () {
    function MockView() {
    }
    return MockView;
}());
export { MockView };
var MockView1 = (function () {
    function MockView1() {
    }
    return MockView1;
}());
export { MockView1 };
var MockView2 = (function () {
    function MockView2() {
    }
    return MockView2;
}());
export { MockView2 };
var MockView3 = (function () {
    function MockView3() {
    }
    return MockView3;
}());
export { MockView3 };
var MockView4 = (function () {
    function MockView4() {
    }
    return MockView4;
}());
export { MockView4 };
var MockView5 = (function () {
    function MockView5() {
    }
    return MockView5;
}());
export { MockView5 };
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
        present: function (_opts) { return Promise.resolve(); },
        dismiss: function (_data, _role, _navOptions) { return Promise.resolve(); },
        onDidDismiss: function (_callback) { },
        onWillDismiss: function (_callback) { }
    };
}
//# sourceMappingURL=mock-providers.js.map