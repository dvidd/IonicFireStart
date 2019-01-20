import { isActivatedDisabled } from './activator-base';
export class Activator {
    constructor(app, config, dom) {
        this.app = app;
        this.dom = dom;
        this._queue = [];
        this._active = [];
        this.activatedDelay = ADD_ACTIVATED_DEFERS;
        this.clearDelay = CLEAR_STATE_DEFERS;
        this._css = config.get('activatedClass', 'activated');
    }
    clickAction(ev, activatableEle, _startCoord) {
        if (isActivatedDisabled(ev, activatableEle)) {
            return;
        }
        // a click happened, so immediately deactive all activated elements
        this._scheduleClear();
        this._queue.length = 0;
        for (var i = 0; i < this._active.length; i++) {
            this._active[i].classList.remove(this._css);
        }
        this._active.length = 0;
        // then immediately activate this element
        if (activatableEle && activatableEle.parentNode) {
            this._active.push(activatableEle);
            activatableEle.classList.add(this._css);
        }
    }
    downAction(ev, activatableEle, _startCoord) {
        // the user just pressed down
        if (isActivatedDisabled(ev, activatableEle)) {
            return;
        }
        this.unscheduleClear();
        this.deactivate(true);
        // queue to have this element activated
        this._queue.push(activatableEle);
        this._activeDefer = this.dom.write(() => {
            this._activeDefer = null;
            let activatableEle;
            for (let i = 0; i < this._queue.length; i++) {
                activatableEle = this._queue[i];
                this._active.push(activatableEle);
                activatableEle.classList.add(this._css);
            }
            this._queue.length = 0;
        }, this.activatedDelay);
    }
    // the user was pressing down, then just let up
    upAction(_ev, _activatableEle, _startCoord) {
        this._scheduleClear();
    }
    _scheduleClear() {
        if (this._clearDefer) {
            return;
        }
        this._clearDefer = this.dom.write(() => {
            this.clearState(true);
            this._clearDefer = null;
        }, this.clearDelay);
    }
    unscheduleClear() {
        if (this._clearDefer) {
            this._clearDefer();
            this._clearDefer = null;
        }
    }
    // all states should return to normal
    clearState(animated) {
        if (!this.app.isEnabled()) {
            // the app is actively disabled, so don't bother deactivating anything.
            // this makes it easier on the GPU so it doesn't have to redraw any
            // buttons during a transition. This will retry in XX milliseconds.
            this.dom.write(() => {
                this.clearState(animated);
            }, 600);
        }
        else {
            // not actively transitioning, good to deactivate any elements
            this.deactivate(animated);
        }
    }
    // remove the active class from all active elements
    deactivate(animated) {
        this._clearDeferred();
        this._queue.length = 0;
        let ele;
        for (var i = 0; i < this._active.length; i++) {
            ele = this._active[i];
            ele.style[this.dom.plt.Css.transition] = animated ? '' : 'none';
            ele.classList.remove(this._css);
        }
        this._active.length = 0;
    }
    _clearDeferred() {
        // Clear any active deferral
        if (this._activeDefer) {
            this._activeDefer();
            this._activeDefer = null;
        }
    }
}
const ADD_ACTIVATED_DEFERS = 80;
const CLEAR_STATE_DEFERS = 80;
//# sourceMappingURL=activator.js.map