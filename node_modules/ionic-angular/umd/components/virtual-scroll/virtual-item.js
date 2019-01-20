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
    var VirtualItem = (function () {
        function VirtualItem(templateRef, viewContainer) {
            this.templateRef = templateRef;
            this.viewContainer = viewContainer;
        }
        VirtualItem.decorators = [
            { type: core_1.Directive, args: [{ selector: '[virtualItem]' },] },
        ];
        /** @nocollapse */
        VirtualItem.ctorParameters = function () { return [
            { type: core_1.TemplateRef, },
            { type: core_1.ViewContainerRef, },
        ]; };
        return VirtualItem;
    }());
    exports.VirtualItem = VirtualItem;
});
//# sourceMappingURL=virtual-item.js.map