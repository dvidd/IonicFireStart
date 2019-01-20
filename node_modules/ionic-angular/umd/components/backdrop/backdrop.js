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
     * @hidden
     */
    var Backdrop = (function () {
        function Backdrop(_elementRef, _renderer) {
            this._elementRef = _elementRef;
            this._renderer = _renderer;
        }
        Backdrop.prototype.getNativeElement = function () {
            return this._elementRef.nativeElement;
        };
        Backdrop.prototype.setElementClass = function (className, add) {
            this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
        };
        Backdrop.decorators = [
            { type: core_1.Directive, args: [{
                        selector: 'ion-backdrop',
                        host: {
                            'role': 'presentation',
                            'tappable': '',
                            'disable-activated': ''
                        },
                    },] },
        ];
        /** @nocollapse */
        Backdrop.ctorParameters = function () { return [
            { type: core_1.ElementRef, },
            { type: core_1.Renderer, },
        ]; };
        return Backdrop;
    }());
    exports.Backdrop = Backdrop;
});
//# sourceMappingURL=backdrop.js.map