(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../app/menu-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var menu_controller_1 = require("../app/menu-controller");
    /**
     * @name MenuClose
     * @description
     * The `menuClose` directive can be placed on any button to close an open menu.
     *
     * @usage
     *
     * A simple `menuClose` button can be added using the following markup:
     *
     * ```html
     * <button ion-button menuClose>Close Menu</button>
     * ```
     *
     * To close a certain menu by its id or side, give the `menuClose`
     * directive a value.
     *
     * ```html
     * <button ion-button menuClose="left">Close Left Menu</button>
     * ```
     *
     * @demo /docs/demos/src/menu/
     * @see {@link /docs/components#menus Menu Component Docs}
     * @see {@link ../../menu/Menu Menu API Docs}
     */
    var MenuClose = (function () {
        function MenuClose(_menu) {
            this._menu = _menu;
        }
        /**
        * @hidden
        */
        MenuClose.prototype.close = function () {
            var menu = this._menu.get(this.menuClose);
            menu && menu.close();
        };
        MenuClose.decorators = [
            { type: core_1.Directive, args: [{
                        selector: '[menuClose]'
                    },] },
        ];
        /** @nocollapse */
        MenuClose.ctorParameters = function () { return [
            { type: menu_controller_1.MenuController, },
        ]; };
        MenuClose.propDecorators = {
            'menuClose': [{ type: core_1.Input },],
            'close': [{ type: core_1.HostListener, args: ['click',] },],
        };
        return MenuClose;
    }());
    exports.MenuClose = MenuClose;
});
//# sourceMappingURL=menu-close.js.map