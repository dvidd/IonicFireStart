import { Inject, Injectable, forwardRef } from '@angular/core';
import { App } from '../components/app/app';
/** @hidden */
export const GESTURE_GO_BACK_SWIPE = 'goback-swipe';
/** @hidden */
export const GESTURE_MENU_SWIPE = 'menu-swipe';
/** @hidden */
export const GESTURE_ITEM_SWIPE = 'item-swipe';
/** @hidden */
export const GESTURE_REFRESHER = 'refresher';
/** @hidden */
export const GESTURE_TOGGLE = 'toggle';
/** @hidden */
export const GESTURE_PRIORITY_SLIDING_ITEM = -10;
/** @hidden */
export const GESTURE_PRIORITY_REFRESHER = 0;
/** @hidden */
export const GESTURE_PRIORITY_MENU_SWIPE = 10;
/** @hidden */
export const GESTURE_PRIORITY_GO_BACK_SWIPE = 20;
/** @hidden */
export const GESTURE_PRIORITY_TOGGLE = 30;
/**
* @hidden
*/
export const BLOCK_ALL = {
    disable: [GESTURE_MENU_SWIPE, GESTURE_GO_BACK_SWIPE],
    disableScroll: true
};
/**
* @hidden
*/
export class GestureController {
    constructor(_app) {
        this._app = _app;
        this.id = 1;
        this.requestedStart = {};
        this.disabledGestures = {};
        this.disabledScroll = new Set();
        this.capturedID = null;
    }
    createGesture(opts) {
        if (!opts.name) {
            throw new Error('name is undefined');
        }
        return new GestureDelegate(opts.name, this.newID(), this, opts.priority || 0, !!opts.disableScroll);
    }
    createBlocker(opts = {}) {
        return new BlockerDelegate(this.newID(), this, opts.disable, !!opts.disableScroll);
    }
    newID() {
        let id = this.id;
        this.id++;
        return id;
    }
    start(gestureName, id, priority) {
        if (!this.canStart(gestureName)) {
            delete this.requestedStart[id];
            return false;
        }
        this.requestedStart[id] = priority;
        return true;
    }
    capture(gestureName, id, priority) {
        if (!this.start(gestureName, id, priority)) {
            return false;
        }
        let requestedStart = this.requestedStart;
        let maxPriority = -10000;
        for (let gestureID in requestedStart) {
            maxPriority = Math.max(maxPriority, requestedStart[gestureID]);
        }
        if (maxPriority === priority) {
            this.capturedID = id;
            this.requestedStart = {};
            (void 0) /* console.debug */;
            return true;
        }
        delete requestedStart[id];
        (void 0) /* console.debug */;
        return false;
    }
    release(id) {
        delete this.requestedStart[id];
        if (this.capturedID && id === this.capturedID) {
            this.capturedID = null;
        }
    }
    disableGesture(gestureName, id) {
        let set = this.disabledGestures[gestureName];
        if (!set) {
            set = new Set();
            this.disabledGestures[gestureName] = set;
        }
        set.add(id);
    }
    enableGesture(gestureName, id) {
        let set = this.disabledGestures[gestureName];
        if (set) {
            set.delete(id);
        }
    }
    disableScroll(id) {
        let isEnabled = !this.isScrollDisabled();
        this.disabledScroll.add(id);
        if (this._app && isEnabled && this.isScrollDisabled()) {
            (void 0) /* console.debug */;
            this._app._setDisableScroll(true);
        }
    }
    enableScroll(id) {
        let isDisabled = this.isScrollDisabled();
        this.disabledScroll.delete(id);
        if (this._app && isDisabled && !this.isScrollDisabled()) {
            (void 0) /* console.debug */;
            this._app._setDisableScroll(false);
        }
    }
    canStart(gestureName) {
        if (this.capturedID) {
            (void 0) /* console.debug */;
            // a gesture already captured
            return false;
        }
        if (this.isDisabled(gestureName)) {
            (void 0) /* console.debug */;
            return false;
        }
        return true;
    }
    isCaptured() {
        return !!this.capturedID;
    }
    isScrollDisabled() {
        return this.disabledScroll.size > 0;
    }
    isDisabled(gestureName) {
        let disabled = this.disabledGestures[gestureName];
        return !!(disabled && disabled.size > 0);
    }
}
GestureController.decorators = [
    { type: Injectable },
];
/** @nocollapse */
GestureController.ctorParameters = () => [
    { type: App, decorators: [{ type: Inject, args: [forwardRef(() => App),] },] },
];
/**
* @hidden
*/
export class GestureDelegate {
    constructor(name, id, controller, priority, disableScroll) {
        this.name = name;
        this.id = id;
        this.controller = controller;
        this.priority = priority;
        this.disableScroll = disableScroll;
    }
    canStart() {
        if (!this.controller) {
            (void 0) /* assert */;
            return false;
        }
        return this.controller.canStart(this.name);
    }
    start() {
        if (!this.controller) {
            (void 0) /* assert */;
            return false;
        }
        return this.controller.start(this.name, this.id, this.priority);
    }
    capture() {
        if (!this.controller) {
            (void 0) /* assert */;
            return false;
        }
        let captured = this.controller.capture(this.name, this.id, this.priority);
        if (captured && this.disableScroll) {
            this.controller.disableScroll(this.id);
        }
        return captured;
    }
    release() {
        if (!this.controller) {
            (void 0) /* assert */;
            return;
        }
        this.controller.release(this.id);
        if (this.disableScroll) {
            this.controller.enableScroll(this.id);
        }
    }
    destroy() {
        this.release();
        this.controller = null;
    }
}
/**
* @hidden
*/
export class BlockerDelegate {
    constructor(id, controller, disable, disableScroll) {
        this.id = id;
        this.controller = controller;
        this.disable = disable;
        this.disableScroll = disableScroll;
        this.blocked = false;
    }
    block() {
        if (!this.controller) {
            (void 0) /* assert */;
            return;
        }
        if (this.disable) {
            this.disable.forEach(gesture => {
                this.controller.disableGesture(gesture, this.id);
            });
        }
        if (this.disableScroll) {
            this.controller.disableScroll(this.id);
        }
        this.blocked = true;
    }
    unblock() {
        if (!this.controller) {
            (void 0) /* assert */;
            return;
        }
        if (this.disable) {
            this.disable.forEach(gesture => {
                this.controller.enableGesture(gesture, this.id);
            });
        }
        if (this.disableScroll) {
            this.controller.enableScroll(this.id);
        }
        this.blocked = false;
    }
    destroy() {
        this.unblock();
        this.controller = null;
    }
}
//# sourceMappingURL=gesture-controller.js.map