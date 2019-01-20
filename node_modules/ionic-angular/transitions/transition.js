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
import { Animation } from '../animations/animation';
/**
 * @hidden
 *
 * - play
 * - Add before classes - DOM WRITE
 * - Remove before classes - DOM WRITE
 * - Add before inline styles - DOM WRITE
 * - set inline FROM styles - DOM WRITE
 * - RAF
 * - read toolbar dimensions - DOM READ
 * - write content top/bottom padding - DOM WRITE
 * - set css transition duration/easing - DOM WRITE
 * - RAF
 * - set inline TO styles - DOM WRITE
 */
var Transition = (function (_super) {
    __extends(Transition, _super);
    function Transition(plt, enteringView, leavingView, opts) {
        var _this = _super.call(this, plt, null, opts) || this;
        _this.enteringView = enteringView;
        _this.leavingView = leavingView;
        return _this;
    }
    Transition.prototype.init = function () { };
    Transition.prototype.registerStart = function (trnsStart) {
        this._trnsStart = trnsStart;
    };
    Transition.prototype.start = function () {
        this._trnsStart && this._trnsStart();
        this._trnsStart = null;
        // bubble up start
        this.parent && this.parent.start();
    };
    Transition.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.parent = this.enteringView = this.leavingView = this._trnsStart = null;
    };
    return Transition;
}(Animation));
export { Transition };
//# sourceMappingURL=transition.js.map