(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./ng-module-loader", "./util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var ng_module_loader_1 = require("./ng-module-loader");
    var util_1 = require("./util");
    exports.LAZY_LOADED_TOKEN = new core_1.InjectionToken('LZYCMP');
    /**
     * @hidden
     */
    var ModuleLoader = (function () {
        function ModuleLoader(_ngModuleLoader, _injector) {
            this._ngModuleLoader = _ngModuleLoader;
            this._injector = _injector;
            /** @internal */
            this._cfrMap = new Map();
            this._promiseMap = new Map();
        }
        ModuleLoader.prototype.load = function (modulePath) {
            var _this = this;
            (void 0) /* console.time */;
            var splitString = modulePath.split(SPLITTER);
            var promise = this._promiseMap.get(modulePath);
            if (!promise) {
                promise = this._ngModuleLoader.load(splitString[0], splitString[1]);
                this._promiseMap.set(modulePath, promise);
            }
            return promise.then(function (loadedModule) {
                (void 0) /* console.timeEnd */;
                var ref = loadedModule.create(_this._injector);
                var component = ref.injector.get(exports.LAZY_LOADED_TOKEN);
                _this._cfrMap.set(component, ref.componentFactoryResolver);
                return {
                    componentFactoryResolver: ref.componentFactoryResolver,
                    component: component
                };
            });
        };
        ModuleLoader.prototype.getComponentFactoryResolver = function (component) {
            return this._cfrMap.get(component);
        };
        ModuleLoader.decorators = [
            { type: core_1.Injectable },
        ];
        /** @nocollapse */
        ModuleLoader.ctorParameters = function () { return [
            { type: ng_module_loader_1.NgModuleLoader, },
            { type: core_1.Injector, },
        ]; };
        return ModuleLoader;
    }());
    exports.ModuleLoader = ModuleLoader;
    var SPLITTER = '#';
    /**
     * @hidden
     */
    function provideModuleLoader(ngModuleLoader, injector) {
        return new ModuleLoader(ngModuleLoader, injector);
    }
    exports.provideModuleLoader = provideModuleLoader;
    /**
     * @hidden
     */
    function setupPreloadingImplementation(config, deepLinkConfig, moduleLoader) {
        if (!deepLinkConfig || !deepLinkConfig.links || !config.getBoolean('preloadModules')) {
            return Promise.resolve();
        }
        var linksToLoad = deepLinkConfig.links.filter(function (link) { return !!link.loadChildren && link.priority !== 'off'; });
        // Load the high priority modules first
        var highPriorityPromises = linksToLoad
            .filter(function (link) { return link.priority === 'high'; })
            .map(function (link) { return moduleLoader.load(link.loadChildren); });
        return Promise.all(highPriorityPromises).then(function () {
            // Load the low priority modules after the high priority are done
            var lowPriorityPromises = linksToLoad
                .filter(function (link) { return link.priority === 'low'; })
                .map(function (link) { return moduleLoader.load(link.loadChildren); });
            return Promise.all(lowPriorityPromises);
        }).catch(function (err) {
            console.error(err.message);
        });
    }
    exports.setupPreloadingImplementation = setupPreloadingImplementation;
    /**
     * @hidden
     */
    function setupPreloading(config, deepLinkConfig, moduleLoader, ngZone) {
        return function () {
            util_1.requestIonicCallback(function () {
                ngZone.runOutsideAngular(function () {
                    setupPreloadingImplementation(config, deepLinkConfig, moduleLoader);
                });
            });
        };
    }
    exports.setupPreloading = setupPreloading;
});
//# sourceMappingURL=module-loader.js.map