import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Platform } from '../../platform/platform';
import { isRightSide } from '../../util/util';
/**
 * @name ItemOptions
 * @description
 * The option buttons for an `ion-item-sliding`. These buttons can be placed either on the left or right side.
 * You can combine the `(ionSwipe)` event plus the `expandable` directive to create a full swipe action for the item.
 *
 * @usage
 *
 * ```html
 * <ion-item-sliding>
 *   <ion-item>
 *     Item 1
 *   </ion-item>
 *   <ion-item-options side="right" (ionSwipe)="saveItem(item)">
 *     <button ion-button expandable (click)="saveItem(item)">
 *       <ion-icon name="star"></ion-icon>
 *     </button>
 *   </ion-item-options>
 * </ion-item-sliding>
 *```
 */
var ItemOptions = (function () {
    function ItemOptions(_elementRef, _plt) {
        this._elementRef = _elementRef;
        this._plt = _plt;
        /**
         * @output {event} Emitted when the item has been fully swiped.
         */
        this.ionSwipe = new EventEmitter();
    }
    /**
     * @hidden
     */
    ItemOptions.prototype.isRightSide = function () {
        return isRightSide(this.side, this._plt.isRTL, true);
    };
    /**
     * @hidden
     */
    ItemOptions.prototype.width = function () {
        return this._elementRef.nativeElement.offsetWidth;
    };
    ItemOptions.decorators = [
        { type: Directive, args: [{
                    selector: 'ion-item-options',
                },] },
    ];
    /** @nocollapse */
    ItemOptions.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Platform, },
    ]; };
    ItemOptions.propDecorators = {
        'side': [{ type: Input },],
        'ionSwipe': [{ type: Output },],
    };
    return ItemOptions;
}());
export { ItemOptions };
//# sourceMappingURL=item-options.js.map