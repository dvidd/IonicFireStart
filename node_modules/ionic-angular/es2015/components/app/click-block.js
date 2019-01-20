import { Directive, ElementRef, Inject, Renderer, forwardRef } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { Platform } from '../../platform/platform';
/**
 * @hidden
 */
export class ClickBlock {
    constructor(app, config, plt, elementRef, renderer) {
        this.plt = plt;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this._showing = false;
        app._clickBlock = this;
        const enabled = this.isEnabled = config.getBoolean('clickBlock', true);
        if (enabled) {
            this._setElementClass('click-block-enabled', true);
        }
    }
    activate(shouldShow, expire = 100, minDuration = 0) {
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
    }
    /** @internal */
    _activate(shouldShow) {
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
    }
    _setElementClass(className, add) {
        this.renderer.setElementClass(this.elementRef.nativeElement, className, add);
    }
}
ClickBlock.decorators = [
    { type: Directive, args: [{
                selector: '.click-block'
            },] },
];
/** @nocollapse */
ClickBlock.ctorParameters = () => [
    { type: App, decorators: [{ type: Inject, args: [forwardRef(() => App),] },] },
    { type: Config, },
    { type: Platform, },
    { type: ElementRef, },
    { type: Renderer, },
];
//# sourceMappingURL=click-block.js.map