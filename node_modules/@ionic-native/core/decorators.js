import { instanceAvailability, checkAvailability, wrap, wrapInstance, overrideFunction } from './plugin';
import { getPlugin, getPromise } from './util';
import { Observable } from 'rxjs/Observable';
import 'rxjs/observable/throw';
/**
 * @private
 */
export function InstanceCheck(opts) {
    if (opts === void 0) { opts = {}; }
    return function (pluginObj, methodName, descriptor) {
        return {
            value: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                if (instanceAvailability(this)) {
                    return descriptor.value.apply(this, args);
                }
                else {
                    if (opts.sync) {
                        return;
                    }
                    else if (opts.observable) {
                        return new Observable(function () { });
                    }
                    return getPromise(function () { });
                }
            },
            enumerable: true
        };
    };
}
/**
 * Executes function only if plugin is available
 * @private
 */
export function CordovaCheck(opts) {
    if (opts === void 0) { opts = {}; }
    return function (pluginObj, methodName, descriptor) {
        return {
            value: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var check = checkAvailability(pluginObj);
                if (check === true) {
                    return descriptor.value.apply(this, args);
                }
                else {
                    if (opts.sync) {
                        return null;
                    }
                    else if (opts.observable) {
                        return Observable.throw(new Error(check && check.error));
                    }
                    return Promise.reject(check && check.error);
                }
            },
            enumerable: true
        };
    };
}
/**
 * @private
 *
 * Class decorator specifying Plugin metadata. Required for all plugins.
 *
 * @usage
 * ```typescript
 * @Plugin({
 *  pluginName: 'MyPlugin',
 *  plugin: 'cordova-plugin-myplugin',
 *  pluginRef: 'window.myplugin'
 *  })
 *  export class MyPlugin {
 *
 *    // Plugin wrappers, properties, and functions go here ...
 *
 *  }
 * ```
 */
export function Plugin(config) {
    return function (cls) {
        // Add these fields to the class
        for (var prop in config) {
            cls[prop] = config[prop];
        }
        cls['installed'] = function (printWarning) {
            return !!getPlugin(config.pluginRef);
        };
        cls['getPlugin'] = function () {
            return getPlugin(config.pluginRef);
        };
        cls['checkInstall'] = function () {
            return checkAvailability(cls) === true;
        };
        cls['getPluginName'] = function () {
            return config.pluginName;
        };
        cls['getPluginRef'] = function () {
            return config.pluginRef;
        };
        cls['getPluginInstallName'] = function () {
            return config.plugin;
        };
        cls['getPluginRepo'] = function () {
            return config.repo;
        };
        cls['getSupportedPlatforms'] = function () {
            return config.platforms;
        };
        return cls;
    };
}
/**
 * @private
 *
 * Wrap a stub function in a call to a Cordova plugin, checking if both Cordova
 * and the required plugin are installed.
 */
export function Cordova(opts) {
    if (opts === void 0) { opts = {}; }
    return function (target, methodName, descriptor) {
        return {
            value: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return wrap(this, methodName, opts).apply(this, args);
            },
            enumerable: true
        };
    };
}
/**
 * @private
 *
 * Wrap an instance method
 */
export function CordovaInstance(opts) {
    if (opts === void 0) { opts = {}; }
    return function (target, methodName) {
        return {
            value: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return wrapInstance(this, methodName, opts).apply(this, args);
            },
            enumerable: true
        };
    };
}
/**
 * @private
 *
 *
 * Before calling the original method, ensure Cordova and the plugin are installed.
 */
export function CordovaProperty(target, key) {
    Object.defineProperty(target, key, {
        enumerable: true,
        get: function () {
            if (checkAvailability(target, key) === true) {
                return getPlugin(target.constructor.getPluginRef())[key];
            }
            else {
                return null;
            }
        },
        set: function (value) {
            if (checkAvailability(target, key) === true) {
                getPlugin(target.constructor.getPluginRef())[key] = value;
            }
        }
    });
}
/**
 * @private
 * @param target
 * @param key
 * @constructor
 */
export function InstanceProperty(target, key) {
    Object.defineProperty(target, key, {
        enumerable: true,
        get: function () {
            return this._objectInstance[key];
        },
        set: function (value) {
            this._objectInstance[key] = value;
        }
    });
}
/**
 * @private
 *
 * Wrap a stub function in a call to a Cordova plugin, checking if both Cordova
 * and the required plugin are installed.
 */
export function CordovaFunctionOverride(opts) {
    if (opts === void 0) { opts = {}; }
    return function (target, methodName, descriptor) {
        return {
            value: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return overrideFunction(this, methodName, opts);
            },
            enumerable: true
        };
    };
}
//# sourceMappingURL=decorators.js.map