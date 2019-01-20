var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../animations/animation", "../util/util", "./page-transition"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var animation_1 = require("../animations/animation");
    var util_1 = require("../util/util");
    var page_transition_1 = require("./page-transition");
    var TRANSLATEY = 'translateY';
    var OFF_BOTTOM = '40px';
    var CENTER = '0px';
    var SHOW_BACK_BTN_CSS = 'show-back-button';
    var MDTransition = (function (_super) {
        __extends(MDTransition, _super);
        function MDTransition() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MDTransition.prototype.init = function () {
            _super.prototype.init.call(this);
            var plt = this.plt;
            var enteringView = this.enteringView;
            var leavingView = this.leavingView;
            var opts = this.opts;
            // what direction is the transition going
            var backDirection = (opts.direction === 'back');
            if (enteringView) {
                if (backDirection) {
                    this.duration(util_1.isPresent(opts.duration) ? opts.duration : 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
                }
                else {
                    this.duration(util_1.isPresent(opts.duration) ? opts.duration : 280).easing('cubic-bezier(0.36,0.66,0.04,1)');
                    this.enteringPage
                        .fromTo(TRANSLATEY, OFF_BOTTOM, CENTER, true)
                        .fromTo('opacity', 0.01, 1, true);
                }
                if (enteringView.hasNavbar()) {
                    var enteringPageEle = enteringView.pageRef().nativeElement;
                    var enteringNavbarEle = enteringPageEle.querySelector('ion-navbar');
                    var enteringNavBar = new animation_1.Animation(plt, enteringNavbarEle);
                    this.add(enteringNavBar);
                    var enteringBackButton = new animation_1.Animation(plt, enteringNavbarEle.querySelector('.back-button'));
                    this.add(enteringBackButton);
                    if (enteringView.enableBack()) {
                        enteringBackButton.beforeAddClass(SHOW_BACK_BTN_CSS);
                    }
                    else {
                        enteringBackButton.beforeRemoveClass(SHOW_BACK_BTN_CSS);
                    }
                }
            }
            // setup leaving view
            if (leavingView && backDirection) {
                // leaving content
                this.duration(opts.duration || 200).easing('cubic-bezier(0.47,0,0.745,0.715)');
                var leavingPage = new animation_1.Animation(plt, leavingView.pageRef());
                this.add(leavingPage.fromTo(TRANSLATEY, CENTER, OFF_BOTTOM).fromTo('opacity', 1, 0));
            }
        };
        return MDTransition;
    }(page_transition_1.PageTransition));
    exports.MDTransition = MDTransition;
});
//# sourceMappingURL=transition-md.js.map