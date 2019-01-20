(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../../platform/key"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var key_1 = require("../../platform/key");
    /**
     * @hidden
     */
    var RangeKnob = (function () {
        function RangeKnob() {
            this.ionIncrease = new core_1.EventEmitter();
            this.ionDecrease = new core_1.EventEmitter();
        }
        Object.defineProperty(RangeKnob.prototype, "ratio", {
            set: function (r) {
                this._x = r * 100 + "%";
            },
            enumerable: true,
            configurable: true
        });
        RangeKnob.prototype._keyup = function (ev) {
            var keyCode = ev.keyCode;
            if (keyCode === key_1.KEY_LEFT || keyCode === key_1.KEY_DOWN) {
                (void 0) /* console.debug */;
                this.ionDecrease.emit();
                ev.preventDefault();
                ev.stopPropagation();
            }
            else if (keyCode === key_1.KEY_RIGHT || keyCode === key_1.KEY_UP) {
                (void 0) /* console.debug */;
                this.ionIncrease.emit();
                ev.preventDefault();
                ev.stopPropagation();
            }
        };
        RangeKnob.decorators = [
            { type: core_1.Component, args: [{
                        selector: '.range-knob-handle',
                        template: '<div class="range-pin" *ngIf="pin" role="presentation">{{val}}</div>' +
                            '<div class="range-knob" role="presentation"></div>',
                        host: {
                            '[class.range-knob-pressed]': 'pressed',
                            '[class.range-knob-min]': 'val===min||val===undefined',
                            '[class.range-knob-max]': 'val===max',
                            '[style.left]': '_x',
                            '[attr.aria-valuenow]': 'val',
                            '[attr.aria-valuemin]': 'min',
                            '[attr.aria-valuemax]': 'max',
                            '[attr.aria-disabled]': 'disabled',
                            '[attr.aria-labelledby]': 'labelId',
                            '[tabindex]': 'disabled?-1:0',
                            'role': 'slider'
                        }
                    },] },
        ];
        /** @nocollapse */
        RangeKnob.ctorParameters = function () { return []; };
        RangeKnob.propDecorators = {
            'ratio': [{ type: core_1.Input },],
            'pressed': [{ type: core_1.Input },],
            'pin': [{ type: core_1.Input },],
            'min': [{ type: core_1.Input },],
            'max': [{ type: core_1.Input },],
            'val': [{ type: core_1.Input },],
            'disabled': [{ type: core_1.Input },],
            'labelId': [{ type: core_1.Input },],
            'ionIncrease': [{ type: core_1.Output },],
            'ionDecrease': [{ type: core_1.Output },],
            '_keyup': [{ type: core_1.HostListener, args: ['keydown', ['$event'],] },],
        };
        return RangeKnob;
    }());
    exports.RangeKnob = RangeKnob;
});
//# sourceMappingURL=range-knob.js.map