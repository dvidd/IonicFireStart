import { Directive, TemplateRef } from '@angular/core';
/**
 * @hidden
 */
var VirtualHeader = (function () {
    function VirtualHeader(templateRef) {
        this.templateRef = templateRef;
    }
    VirtualHeader.decorators = [
        { type: Directive, args: [{ selector: '[virtualHeader]' },] },
    ];
    /** @nocollapse */
    VirtualHeader.ctorParameters = function () { return [
        { type: TemplateRef, },
    ]; };
    return VirtualHeader;
}());
export { VirtualHeader };
//# sourceMappingURL=virtual-header.js.map