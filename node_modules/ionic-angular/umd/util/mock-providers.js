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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../components/app/app", "../config/config", "../components/content/content", "../navigation/deep-linker", "../platform/dom-controller", "../gestures/gesture-controller", "../tap-click/haptic", "../components/app/app-root", "../components/menu/menu", "../navigation/nav-controller-base", "../components/app/overlay-portal", "../transitions/page-transition", "../platform/platform", "../platform/query-params", "../components/tabs/tab", "../components/tabs/tabs", "../transitions/transition-controller", "../navigation/url-serializer", "../navigation/view-controller", "./module-loader", "./ng-module-loader", "../navigation/nav-util", "../components/ion", "../components/item/item", "./form"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var app_1 = require("../components/app/app");
    var config_1 = require("../config/config");
    var content_1 = require("../components/content/content");
    var deep_linker_1 = require("../navigation/deep-linker");
    var dom_controller_1 = require("../platform/dom-controller");
    var gesture_controller_1 = require("../gestures/gesture-controller");
    var haptic_1 = require("../tap-click/haptic");
    var app_root_1 = require("../components/app/app-root");
    var menu_1 = require("../components/menu/menu");
    var nav_controller_base_1 = require("../navigation/nav-controller-base");
    var overlay_portal_1 = require("../components/app/overlay-portal");
    var page_transition_1 = require("../transitions/page-transition");
    var platform_1 = require("../platform/platform");
    var query_params_1 = require("../platform/query-params");
    var tab_1 = require("../components/tabs/tab");
    var tabs_1 = require("../components/tabs/tabs");
    var transition_controller_1 = require("../transitions/transition-controller");
    var url_serializer_1 = require("../navigation/url-serializer");
    var view_controller_1 = require("../navigation/view-controller");
    var module_loader_1 = require("./module-loader");
    var ng_module_loader_1 = require("./ng-module-loader");
    var nav_util_1 = require("../navigation/nav-util");
    var ion_1 = require("../components/ion");
    var item_1 = require("../components/item/item");
    var form_1 = require("./form");
    function mockConfig(config, _url, platform) {
        if (_url === void 0) { _url = '/'; }
        var c = new config_1.Config();
        var p = platform || mockPlatform();
        c.init(config, p);
        return c;
    }
    exports.mockConfig = mockConfig;
    function mockQueryParams(url) {
        if (url === void 0) { url = '/'; }
        var qp = new query_params_1.QueryParams();
        qp.parseUrl(url);
        return qp;
    }
    exports.mockQueryParams = mockQueryParams;
    function mockPlatform() {
        return new MockPlatform();
    }
    exports.mockPlatform = mockPlatform;
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
    }(platform_1.Platform));
    exports.MockPlatform = MockPlatform;
    function mockDomController(platform) {
        platform = platform || mockPlatform();
        return new MockDomController(platform);
    }
    exports.mockDomController = mockDomController;
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
    }(dom_controller_1.DomController));
    exports.MockDomController = MockDomController;
    function mockApp(config, platform) {
        platform = platform || mockPlatform();
        config = config || mockConfig(null, '/', platform);
        var app = new app_1.App(config, platform);
        mockIonicApp(app, config, platform);
        return app;
    }
    exports.mockApp = mockApp;
    function mockIonicApp(app, config, plt) {
        var appRoot = new app_root_1.IonicApp(null, null, mockElementRef(), mockRenderer(), config, plt, app);
        appRoot._loadingPortal = mockOverlayPortal(app, config, plt);
        appRoot._toastPortal = mockOverlayPortal(app, config, plt);
        appRoot._overlayPortal = mockOverlayPortal(app, config, plt);
        appRoot._modalPortal = mockOverlayPortal(app, config, plt);
        return appRoot;
    }
    exports.mockIonicApp = mockIonicApp;
    exports.mockTrasitionController = function (config) {
        var platform = mockPlatform();
        platform.raf = function (callback) {
            callback();
        };
        var trnsCtrl = new transition_controller_1.TransitionController(platform, config);
        trnsCtrl.get = function (trnsId, enteringView, leavingView, opts) {
            var trns = new page_transition_1.PageTransition(platform, enteringView, leavingView, opts);
            trns.trnsId = trnsId;
            return trns;
        };
        return trnsCtrl;
    };
    function mockContent() {
        var platform = mockPlatform();
        return new content_1.Content(mockConfig(), platform, mockDomController(platform), mockElementRef(), mockRenderer(), null, null, mockZone(), null, null);
    }
    exports.mockContent = mockContent;
    function mockZone() {
        return new core_1.NgZone({ enableLongStackTrace: false });
    }
    exports.mockZone = mockZone;
    function mockChangeDetectorRef() {
        var cd = {
            reattach: function () { },
            detach: function () { },
            detectChanges: function () { }
        };
        return cd;
    }
    exports.mockChangeDetectorRef = mockChangeDetectorRef;
    function mockGestureController(app) {
        if (!app) {
            app = mockApp();
        }
        return new gesture_controller_1.GestureController(app);
    }
    exports.mockGestureController = mockGestureController;
    var MockElementRef = (function () {
        function MockElementRef(ele) {
            this.nativeElement = ele;
        }
        return MockElementRef;
    }());
    exports.MockElementRef = MockElementRef;
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
    exports.MockElement = MockElement;
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
    exports.ClassList = ClassList;
    function mockElementRef() {
        return new MockElementRef(new MockElement());
    }
    exports.mockElementRef = mockElementRef;
    function mockElementRefEle(ele) {
        return new MockElementRef(ele);
    }
    exports.mockElementRefEle = mockElementRefEle;
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
    exports.MockRenderer = MockRenderer;
    function mockRenderer() {
        var renderer = new MockRenderer();
        return renderer;
    }
    exports.mockRenderer = mockRenderer;
    function mockLocation() {
        var location = {
            path: function () { return ''; },
            subscribe: function () { },
            go: function () { },
            back: function () { },
            prepareExternalUrl: function () { }
        };
        return location;
    }
    exports.mockLocation = mockLocation;
    function mockView(component, data) {
        if (!component) {
            component = MockView;
        }
        var view = new view_controller_1.ViewController(component, data);
        view.init(mockComponentRef());
        return view;
    }
    exports.mockView = mockView;
    function mockViews(nav, views) {
        nav._views = views;
        views.forEach(function (v) {
            v._setNav(nav);
        });
    }
    exports.mockViews = mockViews;
    function mockComponentRef() {
        var componentRef = {
            location: mockElementRef(),
            changeDetectorRef: mockChangeDetectorRef(),
            destroy: function () { }
        };
        return componentRef;
    }
    exports.mockComponentRef = mockComponentRef;
    function mockDeepLinker(linkConfig, app) {
        if (linkConfig === void 0) { linkConfig = null; }
        app = app || mockApp(mockConfig(), mockPlatform());
        var serializer = new url_serializer_1.UrlSerializer(app, linkConfig);
        var location = mockLocation();
        return new deep_linker_1.DeepLinker(app || mockApp(), serializer, location, null, null);
    }
    exports.mockDeepLinker = mockDeepLinker;
    function mockNavController() {
        var platform = mockPlatform();
        var config = mockConfig(null, '/', platform);
        var app = mockApp(config, platform);
        var zone = mockZone();
        var dom = mockDomController(platform);
        var elementRef = mockElementRef();
        var renderer = mockRenderer();
        var componentFactoryResolver = null;
        var gestureCtrl = new gesture_controller_1.GestureController(app);
        var linker = mockDeepLinker(null, app);
        var trnsCtrl = exports.mockTrasitionController(config);
        var nav = new nav_controller_base_1.NavControllerBase(null, app, config, platform, elementRef, zone, renderer, componentFactoryResolver, gestureCtrl, trnsCtrl, linker, dom, null);
        nav._viewInit = function (enteringView) {
            enteringView.init(mockComponentRef());
            enteringView._state = nav_util_1.STATE_INITIALIZED;
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
    exports.mockNavController = mockNavController;
    function mockOverlayPortal(app, config, plt) {
        var zone = mockZone();
        var dom = mockDomController(plt);
        var elementRef = mockElementRef();
        var renderer = mockRenderer();
        var componentFactoryResolver = null;
        var gestureCtrl = new gesture_controller_1.GestureController(app);
        var serializer = new url_serializer_1.UrlSerializer(app, null);
        var location = mockLocation();
        var deepLinker = new deep_linker_1.DeepLinker(app, serializer, location, null, null);
        return new overlay_portal_1.OverlayPortal(app, config, plt, elementRef, zone, renderer, componentFactoryResolver, gestureCtrl, null, deepLinker, null, dom, null);
    }
    exports.mockOverlayPortal = mockOverlayPortal;
    function mockTab(parentTabs, overrideLoad) {
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
        var gestureCtrl = new gesture_controller_1.GestureController(app);
        var linker = mockDeepLinker(null, app);
        var tab = new tab_1.Tab(parentTabs, app, config, platform, elementRef, zone, renderer, compiler, changeDetectorRef, gestureCtrl, null, linker, dom, null);
        if (overrideLoad) {
            tab.load = function (_opts) {
                return Promise.resolve();
            };
        }
        return tab;
    }
    exports.mockTab = mockTab;
    function mockForm() {
        return new form_1.Form();
    }
    exports.mockForm = mockForm;
    function mockIon() {
        var config = mockConfig();
        var elementRef = mockElementRef();
        var renderer = mockRenderer();
        return new ion_1.Ion(config, elementRef, renderer, 'ion');
    }
    exports.mockIon = mockIon;
    function mockItem() {
        var form = mockForm();
        var config = mockConfig();
        var elementRef = mockElementRef();
        var renderer = mockRenderer();
        return new item_1.Item(form, config, elementRef, renderer, null);
    }
    exports.mockItem = mockItem;
    function mockTabs(app) {
        var platform = mockPlatform();
        var config = mockConfig(null, '/', platform);
        app = app || mockApp(config, platform);
        var elementRef = mockElementRef();
        var renderer = mockRenderer();
        var linker = mockDeepLinker();
        return new tabs_1.Tabs(null, null, app, config, elementRef, platform, renderer, linker);
    }
    exports.mockTabs = mockTabs;
    function mockMenu(platform) {
        if (platform === void 0) { platform = null; }
        var app = mockApp();
        var gestureCtrl = new gesture_controller_1.GestureController(app);
        var dom = mockDomController();
        var elementRef = mockElementRef();
        var renderer = mockRenderer();
        var plt = platform === null ? mockPlatform() : platform;
        return new menu_1.Menu(null, elementRef, null, plt, renderer, null, gestureCtrl, dom, app);
    }
    exports.mockMenu = mockMenu;
    function mockDeepLinkConfig(links) {
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
    exports.mockDeepLinkConfig = mockDeepLinkConfig;
    function mockHaptic() {
        return new haptic_1.Haptic(mockPlatform());
    }
    exports.mockHaptic = mockHaptic;
    var MockView = (function () {
        function MockView() {
        }
        return MockView;
    }());
    exports.MockView = MockView;
    var MockView1 = (function () {
        function MockView1() {
        }
        return MockView1;
    }());
    exports.MockView1 = MockView1;
    var MockView2 = (function () {
        function MockView2() {
        }
        return MockView2;
    }());
    exports.MockView2 = MockView2;
    var MockView3 = (function () {
        function MockView3() {
        }
        return MockView3;
    }());
    exports.MockView3 = MockView3;
    var MockView4 = (function () {
        function MockView4() {
        }
        return MockView4;
    }());
    exports.MockView4 = MockView4;
    var MockView5 = (function () {
        function MockView5() {
        }
        return MockView5;
    }());
    exports.MockView5 = MockView5;
    function noop() { return 'noop'; }
    exports.noop = noop;
    function mockModuleLoader(ngModuleLoader) {
        ngModuleLoader = ngModuleLoader || mockNgModuleLoader();
        return new module_loader_1.ModuleLoader(ngModuleLoader, null);
    }
    exports.mockModuleLoader = mockModuleLoader;
    function mockNgModuleLoader() {
        return new ng_module_loader_1.NgModuleLoader(null);
    }
    exports.mockNgModuleLoader = mockNgModuleLoader;
    function mockOverlay() {
        return {
            present: function (_opts) { return Promise.resolve(); },
            dismiss: function (_data, _role, _navOptions) { return Promise.resolve(); },
            onDidDismiss: function (_callback) { },
            onWillDismiss: function (_callback) { }
        };
    }
    exports.mockOverlay = mockOverlay;
});
//# sourceMappingURL=mock-providers.js.map