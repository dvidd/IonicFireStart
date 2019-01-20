import { Component } from '@angular/core';
import { NavParams } from '../../navigation/nav-params';
import { ViewController } from '../../navigation/view-controller';
/** @hidden */
export class SelectPopover {
    constructor(navParams, viewController) {
        this.navParams = navParams;
        this.viewController = viewController;
    }
    get value() {
        let checkedOption = this.options.find(option => option.checked);
        return checkedOption ? checkedOption.value : undefined;
    }
    set value(value) {
        let checkedOption = this.options.find(option => option.value === value);
        if (checkedOption && checkedOption.handler) {
            checkedOption.handler();
        }
        this.viewController.dismiss(value);
    }
    ngOnInit() {
        this.options = this.navParams.data.options;
    }
}
SelectPopover.decorators = [
    { type: Component, args: [{
                template: `
    <ion-list radio-group [(ngModel)]="value">
      <ion-item *ngFor="let option of options">
        <ion-label>{{option.text}}</ion-label>
        <ion-radio [checked]="option.checked" [value]="option.value" [disabled]="option.disabled"></ion-radio>
      </ion-item>
    </ion-list>
  `
            },] },
];
/** @nocollapse */
SelectPopover.ctorParameters = () => [
    { type: NavParams, },
    { type: ViewController, },
];
//# sourceMappingURL=select-popover-component.js.map