import { Directive, HostListener, Input, Optional } from '@angular/core';
import { NavController } from '../../navigation/nav-controller';
/**
 * @name NavPush
 * @description
 * Directive to declaratively push a new page to the current nav
 * stack.
 *
 * @usage
 * ```html
 * <button ion-button [navPush]="pushPage"></button>
 * ```
 *
 * To specify parameters you can use array syntax or the `navParams`
 * property:
 *
 * ```html
 * <button ion-button [navPush]="pushPage" [navParams]="params">Go</button>
 * ```
 *
 * Where `pushPage` and `params` are specified in your component,
 * and `pushPage` contains a reference to a
 * component you would like to push:
 *
 * ```ts
 * import { LoginPage } from './login';
 *
 * @Component({
 *   template: `<button ion-button [navPush]="pushPage" [navParams]="params">Go</button>`
 * })
 * class MyPage {
 *   pushPage: any;
 *   params: Object;
 *   constructor(){
 *     this.pushPage = LoginPage;
 *     this.params = { id: 42 };
 *   }
 * }
 * ```
 *
 * @demo /docs/demos/src/navigation/
 * @see {@link /docs/components#navigation Navigation Component Docs}
 * @see {@link ../NavPop NavPop API Docs}
 *
 */
var NavPush = (function () {
    function NavPush(_nav) {
        this._nav = _nav;
        if (!_nav) {
            console.error('navPush must be within a NavController');
        }
    }
    /**
     * @hidden
     */
    NavPush.prototype.onClick = function () {
        if (this._nav && this.navPush) {
            this._nav.push(this.navPush, this.navParams);
            return false;
        }
        return true;
    };
    NavPush.decorators = [
        { type: Directive, args: [{
                    selector: '[navPush]'
                },] },
    ];
    /** @nocollapse */
    NavPush.ctorParameters = function () { return [
        { type: NavController, decorators: [{ type: Optional },] },
    ]; };
    NavPush.propDecorators = {
        'navPush': [{ type: Input },],
        'navParams': [{ type: Input },],
        'onClick': [{ type: HostListener, args: ['click',] },],
    };
    return NavPush;
}());
export { NavPush };
//# sourceMappingURL=nav-push.js.map