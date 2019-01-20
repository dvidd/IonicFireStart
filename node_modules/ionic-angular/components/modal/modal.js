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
import { OverlayProxy } from '../../navigation/overlay-proxy';
import { ModalImpl } from './modal-impl';
/**
 * @hidden
 */
var Modal = (function (_super) {
    __extends(Modal, _super);
    function Modal(app, component, data, opts, config, deepLinker) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this, app, component, config, deepLinker) || this;
        _this.data = data;
        _this.opts = opts;
        _this.isOverlay = true;
        return _this;
    }
    Modal.prototype.getImplementation = function () {
        return new ModalImpl(this._app, this._component, this.data, this.opts, this._config);
    };
    return Modal;
}(OverlayProxy));
export { Modal };
//# sourceMappingURL=modal.js.map