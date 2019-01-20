var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { GESTURE_MENU_SWIPE, GESTURE_PRIORITY_MENU_SWIPE } from '../../gestures/gesture-controller';
import { SlideEdgeGesture } from '../../gestures/slide-edge-gesture';
/**
 * Gesture attached to the content which the menu is assigned to
 */
var MenuContentGesture = (function (_super) {
    __extends(MenuContentGesture, _super);
    function MenuContentGesture(plt, menu, gestureCtrl, domCtrl) {
        var _this = _super.call(this, plt, plt.doc().body, {
            direction: 'x',
            edge: menu.side,
            threshold: 5,
            maxEdgeStart: menu.maxEdgeStart || 50,
            zone: false,
            passive: true,
            domController: domCtrl,
            gesture: gestureCtrl.createGesture({
                name: GESTURE_MENU_SWIPE,
                priority: GESTURE_PRIORITY_MENU_SWIPE,
                disableScroll: true
            })
        }) || this;
        _this.menu = menu;
        return _this;
    }
    MenuContentGesture.prototype.canStart = function (ev) {
        var menu = this.menu;
        if (!menu.canSwipe()) {
            return false;
        }
        if (menu.isOpen) {
            return true;
        }
        else if (menu.getMenuController().getOpen()) {
            return false;
        }
        return _super.prototype.canStart.call(this, ev);
    };
    // Set CSS, then wait one frame for it to apply before sliding starts
    MenuContentGesture.prototype.onSlideBeforeStart = function () {
        (void 0) /* console.debug */;
        this.menu._swipeBeforeStart();
    };
    MenuContentGesture.prototype.onSlideStart = function () {
        (void 0) /* console.debug */;
        this.menu._swipeStart();
    };
    MenuContentGesture.prototype.onSlide = function (slide) {
        var z = (this.menu.isRightSide !== this.plt.isRTL ? slide.min : slide.max);
        var stepValue = (slide.distance / z);
        this.menu._swipeProgress(stepValue);
    };
    MenuContentGesture.prototype.onSlideEnd = function (slide) {
        var z = (this.menu.isRightSide !== this.plt.isRTL ? slide.min : slide.max);
        var currentStepValue = (slide.distance / z);
        var velocity = slide.velocity;
        z = Math.abs(z * 0.5);
        var shouldCompleteRight = (velocity >= 0)
            && (velocity > 0.2 || slide.delta > z);
        var shouldCompleteLeft = (velocity <= 0)
            && (velocity < -0.2 || slide.delta < -z);
        (void 0) /* console.debug */;
        this.menu._swipeEnd(shouldCompleteLeft, shouldCompleteRight, currentStepValue, velocity);
    };
    MenuContentGesture.prototype.getElementStartPos = function (slide) {
        var menu = this.menu;
        if (menu.isRightSide !== this.plt.isRTL) {
            return menu.isOpen ? slide.min : slide.max;
        }
        // left menu
        return menu.isOpen ? slide.max : slide.min;
    };
    MenuContentGesture.prototype.getSlideBoundaries = function () {
        var menu = this.menu;
        if (menu.isRightSide !== this.plt.isRTL) {
            return {
                min: -menu.width(),
                max: 0
            };
        }
        // left menu
        return {
            min: 0,
            max: menu.width()
        };
    };
    return MenuContentGesture;
}(SlideEdgeGesture));
export { MenuContentGesture };
//# sourceMappingURL=menu-gestures.js.map