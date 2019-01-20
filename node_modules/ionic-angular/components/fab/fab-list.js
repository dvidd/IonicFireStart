import { ContentChildren, Directive, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { isTrueProperty } from '../../util/util';
import { Platform } from '../../platform/platform';
import { FabButton } from './fab';
/**
  * @name FabList
  * @description
  * `ion-fab-list` is a container for multiple FAB buttons. They are components of `ion-fab` and allow you to specificy the buttons position, left, right, top, bottom.
  * @usage
  *
  * ```html
  *  <ion-fab bottom right >
  *    <button ion-fab>Share</button>
  *    <ion-fab-list side="top">
  *      <button ion-fab>Facebook</button>
  *      <button ion-fab>Twitter</button>
  *      <button ion-fab>Youtube</button>
  *    </ion-fab-list>
  *    <ion-fab-list side="left">
  *      <button ion-fab>Vimeo</button>
  *    </ion-fab-list>
  *  </ion-fab>
  * ```
  * @module ionic
  *
  * @demo /docs/demos/src/fab/
  * @see {@link /docs/components#fab Fab Component Docs}
 */
var FabList = (function () {
    function FabList(_elementRef, _renderer, config, _plt) {
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._plt = _plt;
        this._visible = false;
        this._fabs = [];
        this._mode = config.get('mode');
    }
    Object.defineProperty(FabList.prototype, "_setbuttons", {
        set: function (query) {
            var fabs = this._fabs = query.toArray();
            var className = "fab-" + this._mode + "-in-list";
            for (var _i = 0, fabs_1 = fabs; _i < fabs_1.length; _i++) {
                var fab = fabs_1[_i];
                fab.setElementClass('fab-in-list', true);
                fab.setElementClass(className, true);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    FabList.prototype.setVisible = function (val) {
        var _this = this;
        var visible = isTrueProperty(val);
        if (visible === this._visible) {
            return;
        }
        this._visible = visible;
        var fabs = this._fabs;
        var i = 1;
        if (visible) {
            fabs.forEach(function (fab) {
                _this._plt.timeout(function () { return fab.setElementClass('show', true); }, i * 30);
                i++;
            });
        }
        else {
            fabs.forEach(function (fab) { return fab.setElementClass('show', false); });
        }
        this.setElementClass('fab-list-active', visible);
    };
    /**
     * @internal
     */
    FabList.prototype.setElementClass = function (className, add) {
        this._renderer.setElementClass(this._elementRef.nativeElement, className, add);
    };
    FabList.decorators = [
        { type: Directive, args: [{
                    selector: 'ion-fab-list',
                },] },
    ];
    /** @nocollapse */
    FabList.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Renderer, },
        { type: Config, },
        { type: Platform, },
    ]; };
    FabList.propDecorators = {
        '_setbuttons': [{ type: ContentChildren, args: [FabButton,] },],
    };
    return FabList;
}());
export { FabList };
//# sourceMappingURL=fab-list.js.map