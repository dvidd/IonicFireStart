import { OverlayProxy } from '../../navigation/overlay-proxy';
import { ModalImpl } from './modal-impl';
/**
 * @hidden
 */
export class Modal extends OverlayProxy {
    constructor(app, component, data, opts = {}, config, deepLinker) {
        super(app, component, config, deepLinker);
        this.data = data;
        this.opts = opts;
        this.isOverlay = true;
    }
    getImplementation() {
        return new ModalImpl(this._app, this._component, this.data, this.opts, this._config);
    }
}
//# sourceMappingURL=modal.js.map