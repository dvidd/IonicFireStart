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
import { swipeShouldReset } from '../util/util';
import { GESTURE_GO_BACK_SWIPE, GESTURE_PRIORITY_GO_BACK_SWIPE } from '../gestures/gesture-controller';
import { SlideEdgeGesture } from '../gestures/slide-edge-gesture';
/**
 * @hidden
 */
var SwipeBackGesture = (function (_super) {
    __extends(SwipeBackGesture, _super);
    function SwipeBackGesture(plt, _nav, gestureCtlr, domCtrl) {
        var _this = _super.call(this, plt, plt.doc().body, {
            direction: 'x',
            edge: 'start',
            maxEdgeStart: 75,
            threshold: 5,
            zone: false,
            domController: domCtrl,
            gesture: gestureCtlr.createGesture({
                name: GESTURE_GO_BACK_SWIPE,
                priority: GESTURE_PRIORITY_GO_BACK_SWIPE,
                disableScroll: true
            })
        }) || this;
        _this._nav = _nav;
        return _this;
    }
    SwipeBackGesture.prototype.canStart = function (ev) {
        // the gesture swipe angle must be mainly horizontal and the
        // gesture distance would be relatively short for a swipe back
        // and swipe back must be possible on this nav controller
        return (this._nav.canSwipeBack() &&
            _super.prototype.canStart.call(this, ev));
    };
    SwipeBackGesture.prototype.onSlideBeforeStart = function (_ev) {
        this._nav.swipeBackStart();
    };
    SwipeBackGesture.prototype.onSlide = function (slide, ev) {
        ev.preventDefault();
        ev.stopPropagation();
        var stepValue = (slide.distance / slide.max);
        this._nav.swipeBackProgress(stepValue);
    };
    SwipeBackGesture.prototype.onSlideEnd = function (slide, _ev) {
        var velocity = slide.velocity;
        var currentStepValue = (slide.distance / slide.max);
        var isResetDirecction = velocity < 0;
        var isMovingFast = Math.abs(slide.velocity) > 0.4;
        var isInResetZone = Math.abs(slide.delta) < Math.abs(slide.max) * 0.5;
        var shouldComplete = !swipeShouldReset(isResetDirecction, isMovingFast, isInResetZone);
        this._nav.swipeBackEnd(shouldComplete, currentStepValue, velocity);
    };
    return SwipeBackGesture;
}(SlideEdgeGesture));
export { SwipeBackGesture };
//# sourceMappingURL=swipe-back.js.map