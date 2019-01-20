import { Directive, Host, Optional } from '@angular/core';
import { DeepLinker } from '../../navigation/deep-linker';
import { NavPush } from './nav-push';
/**
 * @hidden
 */
var NavPushAnchor = (function () {
    function NavPushAnchor(host, linker) {
        this.host = host;
        this.linker = linker;
    }
    NavPushAnchor.prototype.updateHref = function () {
        if (this.host && this.linker) {
            this._href = this.linker.createUrl(this.host._nav, this.host.navPush, this.host.navParams) || '#';
        }
        else {
            this._href = '#';
        }
    };
    NavPushAnchor.prototype.ngAfterContentInit = function () {
        this.updateHref();
    };
    NavPushAnchor.decorators = [
        { type: Directive, args: [{
                    selector: 'a[navPush]',
                    host: {
                        '[attr.href]': '_href'
                    }
                },] },
    ];
    /** @nocollapse */
    NavPushAnchor.ctorParameters = function () { return [
        { type: NavPush, decorators: [{ type: Host },] },
        { type: DeepLinker, decorators: [{ type: Optional },] },
    ]; };
    return NavPushAnchor;
}());
export { NavPushAnchor };
//# sourceMappingURL=nav-push-anchor.js.map