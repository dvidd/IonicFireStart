(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    /**
     * NgModuleFactoryLoader that uses SystemJS to load NgModuleFactory
     */
    var NgModuleLoader = (function () {
        function NgModuleLoader(_compiler) {
            this._compiler = _compiler;
        }
        NgModuleLoader.prototype.load = function (modulePath, ngModuleExport) {
            var offlineMode = this._compiler instanceof core_1.Compiler;
            return offlineMode ? loadPrecompiledFactory(modulePath, ngModuleExport) : loadAndCompile(this._compiler, modulePath, ngModuleExport);
        };
        NgModuleLoader.decorators = [
            { type: core_1.Injectable },
        ];
        /** @nocollapse */
        NgModuleLoader.ctorParameters = function () { return [
            { type: core_1.Compiler, },
        ]; };
        return NgModuleLoader;
    }());
    exports.NgModuleLoader = NgModuleLoader;
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
});
//# sourceMappingURL=ng-module-loader.js.map