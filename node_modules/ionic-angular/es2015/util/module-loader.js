import { Injectable, InjectionToken, Injector } from '@angular/core';
import { NgModuleLoader } from './ng-module-loader';
import { requestIonicCallback } from './util';
export const LAZY_LOADED_TOKEN = new InjectionToken('LZYCMP');
/**
 * @hidden
 */
export class ModuleLoader {
    constructor(_ngModuleLoader, _injector) {
        this._ngModuleLoader = _ngModuleLoader;
        this._injector = _injector;
        /** @internal */
        this._cfrMap = new Map();
        this._promiseMap = new Map();
    }
    load(modulePath) {
        (void 0) /* console.time */;
        const splitString = modulePath.split(SPLITTER);
        let promise = this._promiseMap.get(modulePath);
        if (!promise) {
            promise = this._ngModuleLoader.load(splitString[0], splitString[1]);
            this._promiseMap.set(modulePath, promise);
        }
        return promise.then(loadedModule => {
            (void 0) /* console.timeEnd */;
            const ref = loadedModule.create(this._injector);
            const component = ref.injector.get(LAZY_LOADED_TOKEN);
            this._cfrMap.set(component, ref.componentFactoryResolver);
            return {
                componentFactoryResolver: ref.componentFactoryResolver,
                component: component
            };
        });
    }
    getComponentFactoryResolver(component) {
        return this._cfrMap.get(component);
    }
}
ModuleLoader.decorators = [
    { type: Injectable },
];
/** @nocollapse */
ModuleLoader.ctorParameters = () => [
    { type: NgModuleLoader, },
    { type: Injector, },
];
const SPLITTER = '#';
/**
 * @hidden
 */
export function provideModuleLoader(ngModuleLoader, injector) {
    return new ModuleLoader(ngModuleLoader, injector);
}
/**
 * @hidden
 */
export function setupPreloadingImplementation(config, deepLinkConfig, moduleLoader) {
    if (!deepLinkConfig || !deepLinkConfig.links || !config.getBoolean('preloadModules')) {
        return Promise.resolve();
    }
    const linksToLoad = deepLinkConfig.links.filter(link => !!link.loadChildren && link.priority !== 'off');
    // Load the high priority modules first
    const highPriorityPromises = linksToLoad
        .filter(link => link.priority === 'high')
        .map(link => moduleLoader.load(link.loadChildren));
    return Promise.all(highPriorityPromises).then(() => {
        // Load the low priority modules after the high priority are done
        const lowPriorityPromises = linksToLoad
            .filter(link => link.priority === 'low')
            .map(link => moduleLoader.load(link.loadChildren));
        return Promise.all(lowPriorityPromises);
    }).catch(err => {
        console.error(err.message);
    });
}
/**
 * @hidden
 */
export function setupPreloading(config, deepLinkConfig, moduleLoader, ngZone) {
    return function () {
        requestIonicCallback(() => {
            ngZone.runOutsideAngular(() => {
                setupPreloadingImplementation(config, deepLinkConfig, moduleLoader);
            });
        });
    };
}
//# sourceMappingURL=module-loader.js.map