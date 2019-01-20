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
import { ContentChildren, Directive, ElementRef, Inject, Optional, Renderer, forwardRef } from '@angular/core';
import { Button } from '../button/button';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { Navbar } from './navbar';
import { Toolbar } from './toolbar';
/**
 * @hidden
 */
var ToolbarItem = (function (_super) {
    __extends(ToolbarItem, _super);
    function ToolbarItem(config, elementRef, renderer, toolbar, navbar) {
        var _this = _super.call(this, config, elementRef, renderer, 'bar-buttons') || this;
        _this.inToolbar = !!(toolbar || navbar);
        return _this;
    }
    Object.defineProperty(ToolbarItem.prototype, "_buttons", {
        set: function (buttons) {
            if (this.inToolbar) {
                buttons.forEach(function (button) {
                    button.setRole('bar-button');
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    ToolbarItem.decorators = [
        { type: Directive, args: [{
                    selector: 'ion-buttons,[menuToggle]'
                },] },
    ];
    /** @nocollapse */
    ToolbarItem.ctorParameters = function () { return [
        { type: Config, },
        { type: ElementRef, },
        { type: Renderer, },
        { type: Toolbar, decorators: [{ type: Optional },] },
        { type: Navbar, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(function () { return Navbar; }),] },] },
    ]; };
    ToolbarItem.propDecorators = {
        '_buttons': [{ type: ContentChildren, args: [Button,] },],
    };
    return ToolbarItem;
}(Ion));
export { ToolbarItem };
//# sourceMappingURL=toolbar-item.js.map