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
import { ActionSheetCmp } from './action-sheet-component';
import { ActionSheetMdSlideIn, ActionSheetMdSlideOut, ActionSheetSlideIn, ActionSheetSlideOut, ActionSheetWpSlideIn, ActionSheetWpSlideOut } from './action-sheet-transitions';
import { isPresent } from '../../util/util';
import { ViewController } from '../../navigation/view-controller';
/**
 * @hidden
 */
var ActionSheet = (function (_super) {
    __extends(ActionSheet, _super);
    function ActionSheet(app, opts, config) {
        var _this = this;
        opts.buttons = opts.buttons || [];
        opts.enableBackdropDismiss = isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
        _this = _super.call(this, ActionSheetCmp, opts, null) || this;
        _this._app = app;
        _this.isOverlay = true;
        config.setTransition('action-sheet-slide-in', ActionSheetSlideIn);
        config.setTransition('action-sheet-slide-out', ActionSheetSlideOut);
        config.setTransition('action-sheet-md-slide-in', ActionSheetMdSlideIn);
        config.setTransition('action-sheet-md-slide-out', ActionSheetMdSlideOut);
        config.setTransition('action-sheet-wp-slide-in', ActionSheetWpSlideIn);
        config.setTransition('action-sheet-wp-slide-out', ActionSheetWpSlideOut);
        return _this;
    }
    /**
     * @hidden
     */
    ActionSheet.prototype.getTransitionName = function (direction) {
        var key = 'actionSheet' + (direction === 'back' ? 'Leave' : 'Enter');
        return this._nav && this._nav.config.get(key);
    };
    /**
     * @param {string} title Action sheet title
     */
    ActionSheet.prototype.setTitle = function (title) {
        this.data.title = title;
        return this;
    };
    /**
     * @param {string} subTitle Action sheet subtitle
     */
    ActionSheet.prototype.setSubTitle = function (subTitle) {
        this.data.subTitle = subTitle;
        return this;
    };
    /**
     * @param {object} button Action sheet button
     */
    ActionSheet.prototype.addButton = function (button) {
        this.data.buttons.push(button);
        return this;
    };
    /**
     * Present the action sheet instance.
     *
     * @param {NavOptions} [navOptions={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    ActionSheet.prototype.present = function (navOptions) {
        if (navOptions === void 0) { navOptions = {}; }
        navOptions.minClickBlockDuration = navOptions.minClickBlockDuration || 400;
        return this._app.present(this, navOptions);
    };
    return ActionSheet;
}(ViewController));
export { ActionSheet };
//# sourceMappingURL=action-sheet.js.map