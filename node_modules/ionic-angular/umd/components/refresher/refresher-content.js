(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../config/config", "./refresher"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../../config/config");
    var refresher_1 = require("./refresher");
    /**
     * @hidden
     */
    var RefresherContent = (function () {
        function RefresherContent(r, _config) {
            this.r = r;
            this._config = _config;
        }
        /**
         * @hidden
         */
        RefresherContent.prototype.ngOnInit = function () {
            if (!this.pullingIcon) {
                this.pullingIcon = this._config.get('ionPullIcon', 'arrow-down');
            }
            if (!this.refreshingSpinner) {
                this.refreshingSpinner = this._config.get('ionRefreshingSpinner', this._config.get('spinner', 'ios'));
            }
        };
        RefresherContent.decorators = [
            { type: core_1.Component, args: [{
                        selector: 'ion-refresher-content',
                        template: '<div class="refresher-pulling">' +
                            '<div class="refresher-pulling-icon" *ngIf="pullingIcon">' +
                            '<ion-icon [name]="pullingIcon"></ion-icon>' +
                            '</div>' +
                            '<div class="refresher-pulling-text" [innerHTML]="pullingText" *ngIf="pullingText"></div>' +
                            '</div>' +
                            '<div class="refresher-refreshing">' +
                            '<div class="refresher-refreshing-icon">' +
                            '<ion-spinner [name]="refreshingSpinner"></ion-spinner>' +
                            '</div>' +
                            '<div class="refresher-refreshing-text" [innerHTML]="refreshingText" *ngIf="refreshingText"></div>' +
                            '</div>',
                        host: {
                            '[attr.state]': 'r.state'
                        },
                        encapsulation: core_1.ViewEncapsulation.None,
                    },] },
        ];
        /** @nocollapse */
        RefresherContent.ctorParameters = function () { return [
            { type: refresher_1.Refresher, },
            { type: config_1.Config, },
        ]; };
        RefresherContent.propDecorators = {
            'pullingIcon': [{ type: core_1.Input },],
            'pullingText': [{ type: core_1.Input },],
            'refreshingSpinner': [{ type: core_1.Input },],
            'refreshingText': [{ type: core_1.Input },],
        };
        return RefresherContent;
    }());
    exports.RefresherContent = RefresherContent;
});
//# sourceMappingURL=refresher-content.js.map