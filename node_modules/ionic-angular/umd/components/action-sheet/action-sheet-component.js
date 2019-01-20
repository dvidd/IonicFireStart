(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../gestures/gesture-controller", "../../config/config", "../../platform/key", "../../navigation/nav-params", "../../navigation/view-controller"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var gesture_controller_1 = require("../../gestures/gesture-controller");
    var config_1 = require("../../config/config");
    var key_1 = require("../../platform/key");
    var nav_params_1 = require("../../navigation/nav-params");
    var view_controller_1 = require("../../navigation/view-controller");
    /**
     * @hidden
     */
    var ActionSheetCmp = (function () {
        function ActionSheetCmp(_viewCtrl, config, _elementRef, gestureCtrl, params, renderer) {
            this._viewCtrl = _viewCtrl;
            this._elementRef = _elementRef;
            this.gestureBlocker = gestureCtrl.createBlocker(gesture_controller_1.BLOCK_ALL);
            this.d = params.data;
            this.mode = config.get('mode');
            renderer.setElementClass(_elementRef.nativeElement, "action-sheet-" + this.mode, true);
            if (this.d.cssClass) {
                this.d.cssClass.split(' ').forEach(function (cssClass) {
                    // Make sure the class isn't whitespace, otherwise it throws exceptions
                    if (cssClass.trim() !== '')
                        renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
                });
            }
            this.id = (++actionSheetIds);
            if (this.d.title) {
                this.hdrId = 'acst-hdr-' + this.id;
            }
            if (this.d.subTitle) {
                this.descId = 'acst-subhdr-' + this.id;
            }
        }
        ActionSheetCmp.prototype.ionViewDidLoad = function () {
            var _this = this;
            // normalize the data
            this.d.buttons = this.d.buttons.map(function (button) {
                if (typeof button === 'string') {
                    button = { text: button };
                }
                if (!button.cssClass) {
                    button.cssClass = '';
                }
                switch (button.role) {
                    case 'cancel':
                        _this.cancelButton = button;
                        return null;
                    case 'destructive':
                        button.cssClass = (button.cssClass + ' ' || '') + 'action-sheet-destructive';
                        break;
                    case 'selected':
                        button.cssClass = (button.cssClass + ' ' || '') + 'action-sheet-selected';
                        break;
                }
                return button;
            }).filter(function (button) { return button !== null; });
        };
        ActionSheetCmp.prototype.ionViewWillEnter = function () {
            this.gestureBlocker.block();
        };
        ActionSheetCmp.prototype.ionViewDidLeave = function () {
            this.gestureBlocker.unblock();
        };
        ActionSheetCmp.prototype.ionViewDidEnter = function () {
            var focusableEle = this._elementRef.nativeElement.querySelector('button');
            if (focusableEle) {
                focusableEle.focus();
            }
            this.enabled = true;
        };
        ActionSheetCmp.prototype.keyUp = function (ev) {
            if (this.enabled && ev.keyCode === key_1.KEY_ESCAPE && this._viewCtrl.isLast()) {
                (void 0) /* console.debug */;
                this.bdClick();
            }
        };
        ActionSheetCmp.prototype.click = function (button) {
            if (!this.enabled) {
                return;
            }
            var shouldDismiss = true;
            if (button.handler) {
                // a handler has been provided, execute it
                if (button.handler() === false) {
                    // if the return value of the handler is false then do not dismiss
                    shouldDismiss = false;
                }
            }
            if (shouldDismiss) {
                this.dismiss(button.role);
            }
        };
        ActionSheetCmp.prototype.bdClick = function () {
            if (this.enabled && this.d.enableBackdropDismiss) {
                if (this.cancelButton) {
                    this.click(this.cancelButton);
                }
                else {
                    this.dismiss('backdrop');
                }
            }
        };
        ActionSheetCmp.prototype.dismiss = function (role) {
            var opts = {
                minClickBlockDuration: 400
            };
            return this._viewCtrl.dismiss(null, role, opts);
        };
        ActionSheetCmp.prototype.ngOnDestroy = function () {
            (void 0) /* assert */;
            this.d = this.cancelButton = null;
            this.gestureBlocker.destroy();
        };
        ActionSheetCmp.decorators = [
            { type: core_1.Component, args: [{
                        selector: 'ion-action-sheet',
                        template: '<ion-backdrop (click)="bdClick()" [class.backdrop-no-tappable]="!d.enableBackdropDismiss"></ion-backdrop>' +
                            '<div class="action-sheet-wrapper">' +
                            '<div class="action-sheet-container">' +
                            '<div class="action-sheet-group">' +
                            '<div class="action-sheet-title" id="{{hdrId}}" *ngIf="d.title">{{d.title}}</div>' +
                            '<div class="action-sheet-sub-title" id="{{descId}}" *ngIf="d.subTitle">{{d.subTitle}}</div>' +
                            '<button ion-button="action-sheet-button" (click)="click(b)" *ngFor="let b of d.buttons" class="disable-hover" [attr.icon-start]="b.icon ? \'\' : null" [ngClass]="b.cssClass">' +
                            '<ion-icon [name]="b.icon" *ngIf="b.icon" class="action-sheet-icon"></ion-icon>' +
                            '{{b.text}}' +
                            '</button>' +
                            '</div>' +
                            '<div class="action-sheet-group action-sheet-group-cancel" *ngIf="cancelButton">' +
                            '<button ion-button="action-sheet-button" (click)="click(cancelButton)" class="action-sheet-cancel disable-hover" [attr.icon-start]="cancelButton.icon ? \'\' : null" [ngClass]="cancelButton.cssClass">' +
                            '<ion-icon [name]="cancelButton.icon" *ngIf="cancelButton.icon" class="action-sheet-icon"></ion-icon>' +
                            '{{cancelButton.text}}' +
                            '</button>' +
                            '</div>' +
                            '</div>' +
                            '</div>',
                        host: {
                            'role': 'dialog',
                            '[attr.aria-labelledby]': 'hdrId',
                            '[attr.aria-describedby]': 'descId'
                        },
                        encapsulation: core_1.ViewEncapsulation.None,
                    },] },
        ];
        /** @nocollapse */
        ActionSheetCmp.ctorParameters = function () { return [
            { type: view_controller_1.ViewController, },
            { type: config_1.Config, },
            { type: core_1.ElementRef, },
            { type: gesture_controller_1.GestureController, },
            { type: nav_params_1.NavParams, },
            { type: core_1.Renderer, },
        ]; };
        ActionSheetCmp.propDecorators = {
            'keyUp': [{ type: core_1.HostListener, args: ['body:keyup', ['$event'],] },],
        };
        return ActionSheetCmp;
    }());
    exports.ActionSheetCmp = ActionSheetCmp;
    var actionSheetIds = -1;
});
//# sourceMappingURL=action-sheet-component.js.map