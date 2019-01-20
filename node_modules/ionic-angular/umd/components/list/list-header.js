var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../config/config", "../ion"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var ion_1 = require("../ion");
    /**
     * @hidden
     */
    var ListHeader = (function (_super) {
        __extends(ListHeader, _super);
        function ListHeader(config, renderer, elementRef, _id) {
            var _this = _super.call(this, config, elementRef, renderer, 'list-header') || this;
            _this._id = _id;
            return _this;
        }
        Object.defineProperty(ListHeader.prototype, "id", {
            get: function () {
                return this._id;
            },
            set: function (val) {
                this._id = val;
                this.setElementAttribute('id', val);
            },
            enumerable: true,
            configurable: true
        });
        ListHeader.decorators = [
            { type: core_1.Directive, args: [{
                        selector: 'ion-list-header'
                    },] },
        ];
        /** @nocollapse */
        ListHeader.ctorParameters = function () { return [
            { type: config_1.Config, },
            { type: core_1.Renderer, },
            { type: core_1.ElementRef, },
            { type: undefined, decorators: [{ type: core_1.Attribute, args: ['id',] },] },
        ]; };
        return ListHeader;
    }(ion_1.Ion));
    exports.ListHeader = ListHeader;
});
//# sourceMappingURL=list-header.js.map