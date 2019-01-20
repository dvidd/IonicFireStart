import { GESTURE_ITEM_SWIPE, GESTURE_PRIORITY_SLIDING_ITEM } from '../../gestures/gesture-controller';
import { PanGesture } from '../../gestures/pan-gesture';
import { pointerCoord } from '../../util/dom';
/**
 * @hidden
 */
export class ItemSlidingGesture extends PanGesture {
    constructor(plt, list, gestureCtrl, domCtrl) {
        super(plt, list.getNativeElement(), {
            maxAngle: 20,
            threshold: 5,
            zone: false,
            domController: domCtrl,
            gesture: gestureCtrl.createGesture({
                name: GESTURE_ITEM_SWIPE,
                priority: GESTURE_PRIORITY_SLIDING_ITEM,
                disableScroll: true
            })
        });
        this.list = list;
        this.preSelectedContainer = null;
        this.selectedContainer = null;
        this.openContainer = null;
    }
    canStart(ev) {
        if (this.selectedContainer) {
            return false;
        }
        // Get swiped sliding container
        let container = getContainer(ev);
        if (!container) {
            this.closeOpened();
            return false;
        }
        // Close open container if it is not the selected one.
        if (container !== this.openContainer) {
            this.closeOpened();
        }
        let coord = pointerCoord(ev);
        this.preSelectedContainer = container;
        this.firstCoordX = coord.x;
        this.firstTimestamp = Date.now();
        return true;
    }
    onDragStart(ev) {
        ev.preventDefault();
        let coord = pointerCoord(ev);
        this.selectedContainer = this.openContainer = this.preSelectedContainer;
        this.selectedContainer.startSliding(coord.x);
    }
    onDragMove(ev) {
        ev.preventDefault();
        this.selectedContainer.moveSliding(pointerCoord(ev).x);
    }
    onDragEnd(ev) {
        ev.preventDefault();
        let coordX = pointerCoord(ev).x;
        let deltaX = (coordX - this.firstCoordX);
        let deltaT = (Date.now() - this.firstTimestamp);
        this.selectedContainer.endSliding(deltaX / deltaT);
        this.selectedContainer = null;
        this.preSelectedContainer = null;
    }
    notCaptured(ev) {
        if (!clickedOptionButton(ev)) {
            this.closeOpened();
        }
    }
    closeOpened() {
        this.selectedContainer = null;
        if (this.openContainer) {
            this.openContainer.close();
            this.openContainer = null;
            return true;
        }
        return false;
    }
    destroy() {
        super.destroy();
        this.closeOpened();
        this.list = null;
        this.preSelectedContainer = null;
        this.selectedContainer = null;
        this.openContainer = null;
    }
}
function getContainer(ev) {
    let ele = ev.target.closest('ion-item-sliding');
    if (ele) {
        return ele['$ionComponent'];
    }
    return null;
}
function clickedOptionButton(ev) {
    let ele = ev.target.closest('ion-item-options>button');
    return !!ele;
}
//# sourceMappingURL=item-sliding-gesture.js.map