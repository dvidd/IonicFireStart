import { Directive, ElementRef, Renderer } from '@angular/core';
/**
 * @hidden
 */
export class Backdrop {
    constructor(_elementRef, _renderer) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
    }
    getNativeElement() {
        return this._elementRef.nativeElement;
    }
    setElementClass(className, add) {
        this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
    }
}
Backdrop.decorators = [
    { type: Directive, args: [{
                selector: 'ion-backdrop',
                host: {
                    'role': 'presentation',
                    'tappable': '',
                    'disable-activated': ''
                },
            },] },
];
/** @nocollapse */
Backdrop.ctorParameters = () => [
    { type: ElementRef, },
    { type: Renderer, },
];
//# sourceMappingURL=backdrop.js.map