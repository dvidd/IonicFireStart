import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { isTrueProperty } from '../../util/util';
/**
 * @name Scroll
 * @description
 * Scroll is a non-flexboxed scroll area that can scroll horizontally or vertically. `ion-Scroll` Can be used in places where you may not need a full page scroller, but a highly customized one, such as image scubber or comment scroller.
 * @usage
 * ```html
 * <ion-scroll scrollX="true">
 * </ion-scroll>
 *
 * <ion-scroll scrollY="true">
 * </ion-scroll>
 *
 * <ion-scroll scrollX="true" scrollY="true">
 * </ion-scroll>
 * ```
 * @demo /docs/demos/src/scroll/
 */
export class Scroll {
    constructor() {
        this._scrollX = false;
        this._scrollY = false;
        this._zoom = false;
        this._maxZoom = 1;
        /**
         * @hidden
         */
        this.maxScale = 3;
        /**
         * @hidden
         */
        this.zoomDuration = 250;
    }
    /**
     * @input {boolean} If true, scrolling along the X axis is enabled.
     */
    get scrollX() {
        return this._scrollX;
    }
    set scrollX(val) {
        this._scrollX = isTrueProperty(val);
    }
    /**
     * @input {boolean} If true, scrolling along the Y axis is enabled; requires the following CSS declaration: ion-scroll { white-space: nowrap; }
     */
    get scrollY() {
        return this._scrollY;
    }
    set scrollY(val) {
        this._scrollY = isTrueProperty(val);
    }
    /**
     * @input {boolean} If true, zooming is enabled.
     */
    get zoom() {
        return this._zoom;
    }
    set zoom(val) {
        this._zoom = isTrueProperty(val);
    }
    /**
     * @input {number} Set the max zoom amount.
     */
    get maxZoom() {
        return this._maxZoom;
    }
    set maxZoom(val) {
        this._maxZoom = val;
    }
    /**
     * @hidden
     * Add a scroll event handler to the scroll element if it exists.
     * @param {Function} handler  The scroll handler to add to the scroll element.
     * @returns {?Function} a function to remove the specified handler, otherwise
     * undefined if the scroll element doesn't exist.
     */
    addScrollEventListener(handler) {
        (void 0) /* assert */;
        const ele = this._scrollContent.nativeElement;
        ele.addEventListener('scroll', handler);
        return () => {
            ele.removeEventListener('scroll', handler);
        };
    }
}
Scroll.decorators = [
    { type: Component, args: [{
                selector: 'ion-scroll',
                template: '<div class="scroll-content" #scrollContent>' +
                    '<div class="scroll-zoom-wrapper">' +
                    '<ng-content></ng-content>' +
                    '</div>' +
                    '</div>',
                host: {
                    '[class.scroll-x]': 'scrollX',
                    '[class.scroll-y]': 'scrollY'
                },
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/** @nocollapse */
Scroll.ctorParameters = () => [];
Scroll.propDecorators = {
    'scrollX': [{ type: Input },],
    'scrollY': [{ type: Input },],
    'zoom': [{ type: Input },],
    'maxZoom': [{ type: Input },],
    '_scrollContent': [{ type: ViewChild, args: ['scrollContent', { read: ElementRef },] },],
};
//# sourceMappingURL=scroll.js.map