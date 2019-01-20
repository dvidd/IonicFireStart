import { Directive, Optional } from '@angular/core';
import { DeepLinker } from '../../navigation/deep-linker';
import { ViewController } from '../../navigation/view-controller';
import { NavPop } from './nav-pop';
/**
 * @hidden
 */
export class NavPopAnchor {
    constructor(host, linker, viewCtrl) {
        this.host = host;
        this.linker = linker;
        this.viewCtrl = viewCtrl;
    }
    updateHref() {
        if (this.host && this.viewCtrl) {
            const previousView = this.host._nav.getPrevious(this.viewCtrl);
            this._href = (previousView && this.linker.createUrl(this.host._nav, this.viewCtrl.component, this.viewCtrl.data)) || '#';
        }
        else {
            this._href = '#';
        }
    }
    ngAfterContentInit() {
        this.updateHref();
    }
}
NavPopAnchor.decorators = [
    { type: Directive, args: [{
                selector: 'a[navPop]',
                host: {
                    '[attr.href]': '_href'
                }
            },] },
];
/** @nocollapse */
NavPopAnchor.ctorParameters = () => [
    { type: NavPop, decorators: [{ type: Optional },] },
    { type: DeepLinker, },
    { type: ViewController, decorators: [{ type: Optional },] },
];
//# sourceMappingURL=nav-pop-anchor.js.map