import { Directive, TemplateRef } from '@angular/core';
/**
 * @hidden
 */
var VirtualFooter = (function () {
    function VirtualFooter(templateRef) {
        this.templateRef = templateRef;
    }
    VirtualFooter.decorators = [
        { type: Directive, args: [{ selector: '[virtualFooter]' },] },
    ];
    /** @nocollapse */
    VirtualFooter.ctorParameters = function () { return [
        { type: TemplateRef, },
    ]; };
    return VirtualFooter;
}());
export { VirtualFooter };
//# sourceMappingURL=virtual-footer.js.map