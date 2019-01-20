import { Directive, TemplateRef } from '@angular/core';
/**
 * @hidden
 */
export class VirtualHeader {
    constructor(templateRef) {
        this.templateRef = templateRef;
    }
}
VirtualHeader.decorators = [
    { type: Directive, args: [{ selector: '[virtualHeader]' },] },
];
/** @nocollapse */
VirtualHeader.ctorParameters = () => [
    { type: TemplateRef, },
];
//# sourceMappingURL=virtual-header.js.map