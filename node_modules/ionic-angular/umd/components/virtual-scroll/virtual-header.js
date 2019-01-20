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
    var VirtualHeader = (function () {
        function VirtualHeader(templateRef) {
            this.templateRef = templateRef;
        }
        VirtualHeader.decorators = [
            { type: core_1.Directive, args: [{ selector: '[virtualHeader]' },] },
        ];
        /** @nocollapse */
        VirtualHeader.ctorParameters = function () { return [
            { type: core_1.TemplateRef, },
        ]; };
        return VirtualHeader;
    }());
    exports.VirtualHeader = VirtualHeader;
});
//# sourceMappingURL=virtual-header.js.map