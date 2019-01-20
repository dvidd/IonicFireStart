(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../platform/platform", "../../util/util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var platform_1 = require("../../platform/platform");
    var util_1 = require("../../util/util");
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
            this.ionSwipe = new core_1.EventEmitter();
        }
        /**
         * @hidden
         */
        ItemOptions.prototype.isRightSide = function () {
            return util_1.isRightSide(this.side, this._plt.isRTL, true);
        };
        /**
         * @hidden
         */
        ItemOptions.prototype.width = function () {
            return this._elementRef.nativeElement.offsetWidth;
        };
        ItemOptions.decorators = [
            { type: core_1.Directive, args: [{
                        selector: 'ion-item-options',
                    },] },
        ];
        /** @nocollapse */
        ItemOptions.ctorParameters = function () { return [
            { type: core_1.ElementRef, },
            { type: platform_1.Platform, },
        ]; };
        ItemOptions.propDecorators = {
            'side': [{ type: core_1.Input },],
            'ionSwipe': [{ type: core_1.Output },],
        };
        return ItemOptions;
    }());
    exports.ItemOptions = ItemOptions;
});
//# sourceMappingURL=item-options.js.map