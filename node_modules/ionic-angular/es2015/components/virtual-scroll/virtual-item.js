import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
/**
 * @hidden
 */
export class VirtualItem {
    constructor(templateRef, viewContainer) {
        this.templateRef = templateRef;
        this.viewContainer = viewContainer;
    }
}
VirtualItem.decorators = [
    { type: Directive, args: [{ selector: '[virtualItem]' },] },
];
/** @nocollapse */
VirtualItem.ctorParameters = () => [
    { type: TemplateRef, },
    { type: ViewContainerRef, },
];
//# sourceMappingURL=virtual-item.js.map