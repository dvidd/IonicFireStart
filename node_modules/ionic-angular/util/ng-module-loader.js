import { Compiler, Injectable } from '@angular/core';
/**
 * NgModuleFactoryLoader that uses SystemJS to load NgModuleFactory
 */
var NgModuleLoader = (function () {
    function NgModuleLoader(_compiler) {
        this._compiler = _compiler;
    }
    NgModuleLoader.prototype.load = function (modulePath, ngModuleExport) {
        var offlineMode = this._compiler instanceof Compiler;
        return offlineMode ? loadPrecompiledFactory(modulePath, ngModuleExport) : loadAndCompile(this._compiler, modulePath, ngModuleExport);
    };
    NgModuleLoader.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    NgModuleLoader.ctorParameters = function () { return [
        { type: Compiler, },
    ]; };
    return NgModuleLoader;
}());
export { NgModuleLoader };
function loadAndCompile(compiler, modulePath, ngModuleExport) {
    if (!ngModuleExport) {
        ngModuleExport = 'default';
    }
    return System.import(modulePath)
        .then(function (rawModule) {
        var module = rawModule[ngModuleExport];
        if (!module) {
            throw new Error("Module " + modulePath + " does not export " + ngModuleExport);
        }
        return compiler.compileModuleAsync(module);
    });
}
function loadPrecompiledFactory(modulePath, ngModuleExport) {
    return System.import(modulePath)
        .then(function (rawModule) {
        var ngModuleFactory = rawModule[ngModuleExport];
        if (!ngModuleFactory) {
            throw new Error("Module " + modulePath + " does not export " + ngModuleExport);
        }
        return ngModuleFactory;
    });
}
//# sourceMappingURL=ng-module-loader.js.map