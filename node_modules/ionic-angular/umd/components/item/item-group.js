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
    var ItemGroup = (function () {
        function ItemGroup() {
        }
        ItemGroup.decorators = [
            { type: core_1.Directive, args: [{
                        selector: 'ion-item-group'
                    },] },
        ];
        /** @nocollapse */
        ItemGroup.ctorParameters = function () { return []; };
        return ItemGroup;
    }());
    exports.ItemGroup = ItemGroup;
});
//# sourceMappingURL=item-group.js.map