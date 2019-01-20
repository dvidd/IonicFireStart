import { Directive, ElementRef, Inject, Renderer, forwardRef } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { Platform } from '../../platform/platform';
/**
 * @hidden
 */
var ClickBlock = (function () {
    function ClickBlock(app, config, plt, elementRef, renderer) {
        this.plt = plt;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this._showing = false;
        app._clickBlock = this;
        var enabled = this.isEnabled = config.getBoolean('clickBlock', true);
        if (enabled) {
            this._setElementClass('click-block-enabled', true);
        }
    }
    ClickBlock.prototype.activate = function (shouldShow, expire, minDuration) {
        if (expire === void 0) { expire = 100; }
        if (minDuration === void 0) { minDuration = 0; }
        if (this.isEnabled) {
            this.plt.cancelTimeout(this._tmr);
            if (shouldShow) {
                // remember when we started the click block
                this._start = Date.now();
                // figure out the minimum time it should be showing until
                // this is useful for transitions that are less than 300ms
                this._minEnd = this._start + (minDuration || 0);
                this._activate(true);
            }
            this._tmr = this.plt.timeout(this._activate.bind(this, false), expire);
        }
    };
    /** @internal */
    ClickBlock.prototype._activate = function (shouldShow) {
        if (this._showing !== shouldShow) {
            if (!shouldShow) {
                // check if it was enabled before the minimum duration
                // this is useful for transitions that are less than 300ms
                var now = Date.now();
                if (now < this._minEnd) {
                    this._tmr = this.plt.timeout(this._activate.bind(this, false), this._minEnd - now);
                    return;
                }
            }
            this._setElementClass('click-block-active', shouldShow);
            this._showing = shouldShow;
        }
    };
    ClickBlock.prototype._setElementClass = function (className, add) {
        this.renderer.setElementClass(this.elementRef.nativeElement, className, add);
    };
    ClickBlock.decorators = [
        { type: Directive, args: [{
                    selector: '.click-block'
                },] },
    ];
    /** @nocollapse */
    ClickBlock.ctorParameters = function () { return [
        { type: App, decorators: [{ type: Inject, args: [forwardRef(function () { return App; }),] },] },
        { type: Config, },
        { type: Platform, },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
    return ClickBlock;
}());
export { ClickBlock };
//# sourceMappingURL=click-block.js.map