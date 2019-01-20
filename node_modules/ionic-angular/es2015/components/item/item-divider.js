import { Directive, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { Ion } from '../ion';
/**
 * @hidden
 */
export class ItemDivider extends Ion {
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer, 'item-divider');
    }
}
ItemDivider.decorators = [
    { type: Directive, args: [{
                selector: 'ion-item-divider',
                host: {
                    'class': 'item-divider'
                }
            },] },
];
/** @nocollapse */
ItemDivider.ctorParameters = () => [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
];
//# sourceMappingURL=item-divider.js.map