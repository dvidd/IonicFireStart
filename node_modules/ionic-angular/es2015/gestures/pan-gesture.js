import { defaults } from '../util/util';
import { PanRecognizer } from './recognizers';
import { pointerCoord } from '../util/dom';
import { UIEventManager } from './ui-event-manager';
/**
 * @hidden
 */
export class PanGesture {
    constructor(plt, element, opts = {}) {
        this.plt = plt;
        this.element = element;
        defaults(opts, {
            threshold: 20,
            maxAngle: 40,
            direction: 'x',
            zone: true,
            capture: false,
            passive: false,
        });
        this.events = new UIEventManager(plt);
        if (opts.domController) {
            this.debouncer = opts.domController.debouncer();
        }
        this.gestute = opts.gesture;
        this.direction = opts.direction;
        this.eventsConfig = {
            element: this.element,
            pointerDown: this.pointerDown.bind(this),
            pointerMove: this.pointerMove.bind(this),
            pointerUp: this.pointerUp.bind(this),
            zone: opts.zone,
            capture: opts.capture,
            passive: opts.passive
        };
        if (opts.threshold > 0) {
            this.detector = new PanRecognizer(opts.direction, opts.threshold, opts.maxAngle);
        }
    }
    listen() {
        if (!this.isListening) {
            this.pointerEvents = this.events.pointerEvents(this.eventsConfig);
            this.isListening = true;
        }
    }
    unlisten() {
        if (this.isListening) {
            this.gestute && this.gestute.release();
            this.events.unlistenAll();
            this.isListening = false;
        }
    }
    destroy() {
        this.gestute && this.gestute.destroy();
        this.gestute = null;
        this.unlisten();
        this.events.destroy();
        this.events = this.element = this.gestute = null;
    }
    pointerDown(ev) {
        if (this.started) {
            return;
        }
        if (!this.canStart(ev)) {
            return false;
        }
        if (this.gestute) {
            // Release fallback
            this.gestute.release();
            // Start gesture
            if (!this.gestute.start()) {
                return false;
            }
        }
        this.started = true;
        this.captured = false;
        const coord = pointerCoord(ev);
        if (this.detector) {
            this.detector.start(coord);
        }
        else {
            if (!this.tryToCapture(ev)) {
                this.started = false;
                this.captured = false;
                this.gestute.release();
                return false;
            }
        }
        return true;
    }
    pointerMove(ev) {
        (void 0) /* assert */;
        if (this.captured) {
            this.debouncer.write(() => {
                this.onDragMove(ev);
            });
            return;
        }
        (void 0) /* assert */;
        const coord = pointerCoord(ev);
        if (this.detector.detect(coord)) {
            if (this.detector.pan() !== 0) {
                if (!this.tryToCapture(ev)) {
                    this.abort(ev);
                }
            }
        }
    }
    pointerUp(ev) {
        (void 0) /* assert */;
        this.debouncer.cancel();
        this.gestute && this.gestute.release();
        if (this.captured) {
            this.onDragEnd(ev);
        }
        else {
            this.notCaptured(ev);
        }
        this.captured = false;
        this.started = false;
    }
    tryToCapture(ev) {
        (void 0) /* assert */;
        (void 0) /* assert */;
        if (this.gestute && !this.gestute.capture()) {
            return false;
        }
        this.onDragStart(ev);
        this.captured = true;
        return true;
    }
    abort(ev) {
        this.started = false;
        this.captured = false;
        this.gestute.release();
        this.pointerEvents.stop();
        this.notCaptured(ev);
    }
    getNativeElement() {
        return this.element;
    }
    // Implemented in a subclass
    canStart(_ev) { return true; }
    onDragStart(_ev) { }
    onDragMove(_ev) { }
    onDragEnd(_ev) { }
    notCaptured(_ev) { }
}
//# sourceMappingURL=pan-gesture.js.map