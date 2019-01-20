import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
/**
 * @hidden
 */
var VirtualItem = (function () {
    function VirtualItem(templateRef, viewContainer) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
    }
    VirtualItem.decorators = [
        { type: Directive, args: [{ selector: '[virtualItem]' },] },
    ];
    /** @nocollapse */
    VirtualItem.ctorParameters = function () { return [
        { type: TemplateRef, },
        { type: ViewContainerRef, },
    ]; };
    return VirtualItem;
}());
export { VirtualItem };
//# sourceMappingURL=virtual-item.js.map