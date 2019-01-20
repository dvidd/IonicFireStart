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
import { Attribute, Directive, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
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
        { type: Directive, args: [{
                    selector: 'ion-list-header'
                },] },
    ];
    /** @nocollapse */
    ListHeader.ctorParameters = function () { return [
        { type: Config, },
        { type: Renderer, },
        { type: ElementRef, },
        { type: undefined, decorators: [{ type: Attribute, args: ['id',] },] },
    ]; };
    return ListHeader;
}(Ion));
export { ListHeader };
//# sourceMappingURL=list-header.js.map