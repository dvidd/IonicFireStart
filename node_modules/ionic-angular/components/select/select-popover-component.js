import { Component } from '@angular/core';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
/** @hidden */
var SelectPopover = (function () {
    function SelectPopover(navParams, viewController) {
        this.navParams = navParams;
        this.viewController = viewController;
    }
    Object.defineProperty(SelectPopover.prototype, "value", {
        get: function () {
            var checkedOption = this.options.find(function (option) { return option.checked; });
            return checkedOption ? checkedOption.value : undefined;
        },
        set: function (value) {
            var checkedOption = this.options.find(function (option) { return option.value === value; });
            if (checkedOption && checkedOption.handler) {
                checkedOption.handler();
            }
            this.viewController.dismiss(value);
        },
        enumerable: true,
        configurable: true
    });
    SelectPopover.prototype.ngOnInit = function () {
        this.options = this.navParams.data.options;
    };
    SelectPopover.decorators = [
        { type: Component, args: [{
                    template: "\n    <ion-list radio-group [(ngModel)]=\"value\">\n      <ion-item *ngFor=\"let option of options\">\n        <ion-label>{{option.text}}</ion-label>\n        <ion-radio [checked]=\"option.checked\" [value]=\"option.value\" [disabled]=\"option.disabled\"></ion-radio>\n      </ion-item>\n    </ion-list>\n  "
                },] },
    ];
    /** @nocollapse */
    SelectPopover.ctorParameters = function () { return [
        { type: NavParams, },
        { type: ViewController, },
    ]; };
    return SelectPopover;
}());
export { SelectPopover };
//# sourceMappingURL=select-popover-component.js.map