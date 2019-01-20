import { Directive, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * @hidden
 */
export class CardHeader extends Ion {
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer, 'card-header');
    }
}
CardHeader.decorators = [
    { type: Directive, args: [{
                selector: 'ion-card-header'
            },] },
];
/** @nocollapse */
CardHeader.ctorParameters = () => [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
//# sourceMappingURL=card-header.js.map