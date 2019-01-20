import { Component, ElementRef, HostListener } from '@angular/core';
import { findReorderItem } from './item-reorder-util';
/**
 * @hidden
 */
export class Reorder {
    constructor(elementRef) {
        this.elementRef = elementRef;
        elementRef.nativeElement['$ionComponent'] = this;
    }
    getReorderNode() {
        return findReorderItem(this.elementRef.nativeElement, null);
    }
    onClick(ev) {
        // Stop propagation if click event reaches ion-reorder
        ev.preventDefault();
        ev.stopPropagation();
    }
}
Reorder.decorators = [
    { type: Component, args: [{
                selector: 'ion-reorder',
                template: `<ion-icon name="reorder"></ion-icon>`
            },] },
];
/** @nocollapse */
Reorder.ctorParameters = () => [
    { type: ElementRef, },
];
Reorder.propDecorators = {
    'onClick': [{ type: HostListener, args: ['click', ['$event'],] },],
};
//# sourceMappingURL=reorder.js.map