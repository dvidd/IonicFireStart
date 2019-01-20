import { GESTURE_MENU_SWIPE, GESTURE_PRIORITY_MENU_SWIPE } from '../../gestures/gesture-controller';
import { SlideEdgeGesture } from '../../gestures/slide-edge-gesture';
/**
 * Gesture attached to the content which the menu is assigned to
 */
export class MenuContentGesture extends SlideEdgeGesture {
    constructor(plt, menu, gestureCtrl, domCtrl) {
        super(plt, plt.doc().body, {
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
        });
        this.menu = menu;
    }
    canStart(ev) {
        const menu = this.menu;
        if (!menu.canSwipe()) {
            return false;
        }
        if (menu.isOpen) {
            return true;
        }
        else if (menu.getMenuController().getOpen()) {
            return false;
        }
        return super.canStart(ev);
    }
    // Set CSS, then wait one frame for it to apply before sliding starts
    onSlideBeforeStart() {
        (void 0) /* console.debug */;
        this.menu._swipeBeforeStart();
    }
    onSlideStart() {
        (void 0) /* console.debug */;
        this.menu._swipeStart();
    }
    onSlide(slide) {
        const z = (this.menu.isRightSide !== this.plt.isRTL ? slide.min : slide.max);
        const stepValue = (slide.distance / z);
        this.menu._swipeProgress(stepValue);
    }
    onSlideEnd(slide) {
        let z = (this.menu.isRightSide !== this.plt.isRTL ? slide.min : slide.max);
        const currentStepValue = (slide.distance / z);
        const velocity = slide.velocity;
        z = Math.abs(z * 0.5);
        const shouldCompleteRight = (velocity >= 0)
            && (velocity > 0.2 || slide.delta > z);
        const shouldCompleteLeft = (velocity <= 0)
            && (velocity < -0.2 || slide.delta < -z);
        (void 0) /* console.debug */;
        this.menu._swipeEnd(shouldCompleteLeft, shouldCompleteRight, currentStepValue, velocity);
    }
    getElementStartPos(slide) {
        const menu = this.menu;
        if (menu.isRightSide !== this.plt.isRTL) {
            return menu.isOpen ? slide.min : slide.max;
        }
        // left menu
        return menu.isOpen ? slide.max : slide.min;
    }
    getSlideBoundaries() {
        const menu = this.menu;
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
    }
}
//# sourceMappingURL=menu-gestures.js.map