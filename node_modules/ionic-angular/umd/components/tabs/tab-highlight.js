(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../platform/dom-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var dom_controller_1 = require("../../platform/dom-controller");
    /**
     * @hidden
     */
    var TabHighlight = (function () {
        function TabHighlight(_elementRef, _dom) {
            this._elementRef = _elementRef;
            this._dom = _dom;
        }
        TabHighlight.prototype.select = function (tab) {
            var _this = this;
            if (!tab) {
                return;
            }
            var dom = this._dom;
            dom.read(function () {
                var btnEle = tab.btn.getNativeElement();
                var transform = "translate3d(" + btnEle.offsetLeft + "px,0,0) scaleX(" + btnEle.offsetWidth + ")";
                dom.write(function () {
                    var ele = _this._elementRef.nativeElement;
                    ele.style[dom.plt.Css.transform] = transform;
                    if (!_this._init) {
                        _this._init = true;
                        dom.write(function () {
                            ele.classList.add('animate');
                        }, 80);
                    }
                });
            }, 32);
        };
        TabHighlight.decorators = [
            { type: core_1.Directive, args: [{
                        selector: '.tab-highlight'
                    },] },
        ];
        /** @nocollapse */
        TabHighlight.ctorParameters = function () { return [
            { type: core_1.ElementRef, },
            { type: dom_controller_1.DomController, },
        ]; };
        return TabHighlight;
    }());
    exports.TabHighlight = TabHighlight;
});
//# sourceMappingURL=tab-highlight.js.map