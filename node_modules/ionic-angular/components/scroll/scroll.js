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
var Scroll = (function () {
    function Scroll() {
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
    Object.defineProperty(Scroll.prototype, "scrollX", {
        /**
         * @input {boolean} If true, scrolling along the X axis is enabled.
         */
        get: function () {
            return this._scrollX;
        },
        set: function (val) {
            this._scrollX = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scroll.prototype, "scrollY", {
        /**
         * @input {boolean} If true, scrolling along the Y axis is enabled; requires the following CSS declaration: ion-scroll { white-space: nowrap; }
         */
        get: function () {
            return this._scrollY;
        },
        set: function (val) {
            this._scrollY = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scroll.prototype, "zoom", {
        /**
         * @input {boolean} If true, zooming is enabled.
         */
        get: function () {
            return this._zoom;
        },
        set: function (val) {
            this._zoom = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Scroll.prototype, "maxZoom", {
        /**
         * @input {number} Set the max zoom amount.
         */
        get: function () {
            return this._maxZoom;
        },
        set: function (val) {
            this._maxZoom = val;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     * Add a scroll event handler to the scroll element if it exists.
     * @param {Function} handler  The scroll handler to add to the scroll element.
     * @returns {?Function} a function to remove the specified handler, otherwise
     * undefined if the scroll element doesn't exist.
     */
    Scroll.prototype.addScrollEventListener = function (handler) {
        (void 0) /* assert */;
        var ele = this._scrollContent.nativeElement;
        ele.addEventListener('scroll', handler);
        return function () {
            ele.removeEventListener('scroll', handler);
        };
    };
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
    Scroll.ctorParameters = function () { return []; };
    Scroll.propDecorators = {
        'scrollX': [{ type: Input },],
        'scrollY': [{ type: Input },],
        'zoom': [{ type: Input },],
        'maxZoom': [{ type: Input },],
        '_scrollContent': [{ type: ViewChild, args: ['scrollContent', { read: ElementRef },] },],
    };
    return Scroll;
}());
export { Scroll };
//# sourceMappingURL=scroll.js.map