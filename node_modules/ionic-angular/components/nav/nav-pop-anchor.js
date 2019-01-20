import { Directive, Optional } from '@angular/core';
import { DeepLinker } from '../../navigation/deep-linker';
import { ViewController } from '../../navigation/view-controller';
import { NavPop } from './nav-pop';
/**
 * @hidden
 */
var NavPopAnchor = (function () {
    function NavPopAnchor(host, linker, viewCtrl) {
        this.host = host;
        this.linker = linker;
        this.viewCtrl = viewCtrl;
    }
    NavPopAnchor.prototype.updateHref = function () {
        if (this.host && this.viewCtrl) {
            var previousView = this.host._nav.getPrevious(this.viewCtrl);
            this._href = (previousView && this.linker.createUrl(this.host._nav, this.viewCtrl.component, this.viewCtrl.data)) || '#';
        }
        else {
            this._href = '#';
        }
    };
    NavPopAnchor.prototype.ngAfterContentInit = function () {
        this.updateHref();
    };
    NavPopAnchor.decorators = [
        { type: Directive, args: [{
                    selector: 'a[navPop]',
                    host: {
                        '[attr.href]': '_href'
                    }
                },] },
    ];
    /** @nocollapse */
    NavPopAnchor.ctorParameters = function () { return [
        { type: NavPop, decorators: [{ type: Optional },] },
        { type: DeepLinker, },
        { type: ViewController, decorators: [{ type: Optional },] },
    ]; };
    return NavPopAnchor;
}());
export { NavPopAnchor };
//# sourceMappingURL=nav-pop-anchor.js.map