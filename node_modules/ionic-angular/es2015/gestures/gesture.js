import { defaults } from '../util/util';
import { DIRECTION_HORIZONTAL, DIRECTION_VERTICAL, Hammer } from './hammer';
/**
 * @hidden
 * A gesture recognizer class.
 *
 * TODO(mlynch): Re-enable the DOM event simulation that was causing issues (or verify hammer does this already, it might);
 */
export class Gesture {
    constructor(element, opts = {}) {
        this._callbacks = {};
        this.isListening = false;
        defaults(opts, {
            domEvents: true
        });
        this.element = element;
        // Map 'x' or 'y' string to hammerjs opts
        this.direction = opts.direction || 'x';
        opts.direction = this.direction === 'x' ?
            DIRECTION_HORIZONTAL :
            DIRECTION_VERTICAL;
        this._options = opts;
    }
    options(opts) {
        Object.assign(this._options, opts);
    }
    on(type, cb) {
        if (type === 'pinch' || type === 'rotate') {
            this._hammer.get(type).set({ enable: true });
        }
        this._hammer.on(type, cb);
        (this._callbacks[type] || (this._callbacks[type] = [])).push(cb);
    }
    off(type, cb) {
        this._hammer.off(type, this._callbacks[type] ? cb : null);
    }
    listen() {
        if (!this.isListening) {
            this._hammer = Hammer(this.element, this._options);
        }
        this.isListening = true;
    }
    unlisten() {
        let eventType;
        let i;
        if (this._hammer && this.isListening) {
            for (eventType in this._callbacks) {
                for (i = 0; i < this._callbacks[eventType].length; i++) {
                    this._hammer.off(eventType, this._callbacks[eventType]);
                }
            }
            this._hammer.destroy();
        }
        this._callbacks = {};
        this._hammer = null;
        this.isListening = false;
    }
    destroy() {
        this.unlisten();
        this.element = this._options = null;
    }
}
//# sourceMappingURL=gesture.js.map