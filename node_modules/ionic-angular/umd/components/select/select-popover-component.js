(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../navigation/nav-params", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var nav_params_1 = require("../../navigation/nav-params");
    var view_controller_1 = require("../../navigation/view-controller");
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
            { type: core_1.Component, args: [{
                        template: "\n    <ion-list radio-group [(ngModel)]=\"value\">\n      <ion-item *ngFor=\"let option of options\">\n        <ion-label>{{option.text}}</ion-label>\n        <ion-radio [checked]=\"option.checked\" [value]=\"option.value\" [disabled]=\"option.disabled\"></ion-radio>\n      </ion-item>\n    </ion-list>\n  "
                    },] },
        ];
        /** @nocollapse */
        SelectPopover.ctorParameters = function () { return [
            { type: nav_params_1.NavParams, },
            { type: view_controller_1.ViewController, },
        ]; };
        return SelectPopover;
    }());
    exports.SelectPopover = SelectPopover;
});
//# sourceMappingURL=select-popover-component.js.map