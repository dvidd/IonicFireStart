import { Directive, TemplateRef } from '@angular/core';
/**
 * @hidden
 */
export class VirtualFooter {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
VirtualFooter.decorators = [
    { type: Directive, args: [{ selector: '[virtualFooter]' },] },
];
/** @nocollapse */
VirtualFooter.ctorParameters = () => [
    { type: TemplateRef, },
];
//# sourceMappingURL=virtual-footer.js.map