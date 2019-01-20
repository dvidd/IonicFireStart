import { Component, ElementRef, HostListener } from '@angular/core';
import { findReorderItem } from './item-reorder-util';
/**
 * @hidden
 */
var Reorder = (function () {
    function Reorder(elementRef) {
        this.elementRef = elementRef;
        elementRef.nativeElement['$ionComponent'] = this;
    }
    Reorder.prototype.getReorderNode = function () {
        return findReorderItem(this.elementRef.nativeElement, null);
    };
    Reorder.prototype.onClick = function (ev) {
        // Stop propagation if click event reaches ion-reorder
        ev.preventDefault();
        ev.stopPropagation();
    };
    Reorder.decorators = [
        { type: Component, args: [{
                    selector: 'ion-reorder',
                    template: "<ion-icon name=\"reorder\"></ion-icon>"
                },] },
    ];
    /** @nocollapse */
    Reorder.ctorParameters = function () { return [
        { type: ElementRef, },
    ]; };
    Reorder.propDecorators = {
        'onClick': [{ type: HostListener, args: ['click', ['$event'],] },],
    };
    return Reorder;
}());
export { Reorder };
//# sourceMappingURL=reorder.js.map