import { GESTURE_PRIORITY_TOGGLE, GESTURE_TOGGLE } from '../../gestures/gesture-controller';
import { PanGesture } from '../../gestures/pan-gesture';
import { pointerCoord } from '../../util/dom';
/**
 * @hidden
 */
export class ToggleGesture extends PanGesture {
    constructor(plt, toggle, gestureCtrl, domCtrl) {
        super(plt, toggle.getNativeElement(), {
            threshold: 0,
            zone: false,
            domController: domCtrl,
            gesture: gestureCtrl.createGesture({
                name: GESTURE_TOGGLE,
                priority: GESTURE_PRIORITY_TOGGLE
            })
        });
        this.toggle = toggle;
    }
    canStart() {
        return true;
    }
    onDragStart(ev) {
        ev.preventDefault();
        this.toggle._onDragStart(pointerCoord(ev).x);
    }
    onDragMove(ev) {
        ev.preventDefault();
        this.toggle._onDragMove(pointerCoord(ev).x);
    }
    onDragEnd(ev) {
        ev.preventDefault();
        this.toggle._onDragEnd(pointerCoord(ev).x);
    }
}
//# sourceMappingURL=toggle-gesture.js.map