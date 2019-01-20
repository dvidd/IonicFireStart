import { OverlayProxy } from '../../navigation/overlay-proxy';
import { PopoverImpl } from './popover-impl';
/**
 * @hidden
 */
export class Popover extends OverlayProxy {
    constructor(app, component, data, opts = {}, config, deepLinker) {
        super(app, component, config, deepLinker);
        this.data = data;
        this.opts = opts;
        this.isOverlay = true;
    }
    getImplementation() {
        return new PopoverImpl(this._app, this._component, this.data, this.opts, this._config);
    }
}
//# sourceMappingURL=popover.js.map