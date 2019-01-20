(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./activator", "../components/app/app", "../config/config", "../platform/dom-controller", "../gestures/gesture-controller", "../platform/platform", "../util/dom", "../gestures/pointer-events", "./ripple", "../gestures/ui-event-manager"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var activator_1 = require("./activator");
    var app_1 = require("../components/app/app");
    var config_1 = require("../config/config");
    var dom_controller_1 = require("../platform/dom-controller");
    var gesture_controller_1 = require("../gestures/gesture-controller");
    var platform_1 = require("../platform/platform");
    var dom_1 = require("../util/dom");
    var pointer_events_1 = require("../gestures/pointer-events");
    var ripple_1 = require("./ripple");
    var ui_event_manager_1 = require("../gestures/ui-event-manager");
    /**
     * @hidden
     */
    var TapClick = (function () {
        function TapClick(config, plt, dom, app, gestureCtrl) {
            this.plt = plt;
            this.app = app;
            this.gestureCtrl = gestureCtrl;
            this.disableClick = 0;
            this.events = new ui_event_manager_1.UIEventManager(plt);
            var activator = config.get('activator');
            if (activator === 'ripple') {
                this.activator = new ripple_1.RippleActivator(app, config, dom);
            }
            else if (activator === 'highlight') {
                this.activator = new activator_1.Activator(app, config, dom);
            }
            this.usePolyfill = config.getBoolean('tapPolyfill');
            (void 0) /* console.debug */;
            var doc = plt.doc();
            this.events.listen(doc, 'click', this.click.bind(this), { passive: false, capture: true });
            this.pointerEvents = this.events.pointerEvents({
                element: doc,
                pointerDown: this.pointerStart.bind(this),
                pointerMove: this.pointerMove.bind(this),
                pointerUp: this.pointerEnd.bind(this),
                passive: true
            });
            this.pointerEvents.mouseWait = DISABLE_NATIVE_CLICK_AMOUNT;
        }
        TapClick.prototype.pointerStart = function (ev) {
            if (this.startCoord) {
                return false;
            }
            if (!this.app.isEnabled()) {
                return false;
            }
            this.lastTouchEnd = 0;
            this.dispatchClick = true;
            if (this.plt.doc() === ev.target) {
                this.startCoord = dom_1.pointerCoord(ev);
                return true;
            }
            this.activatableEle = getActivatableTarget(ev.target);
            if (!this.activatableEle) {
                this.startCoord = null;
                return false;
            }
            this.startCoord = dom_1.pointerCoord(ev);
            this.activator && this.activator.downAction(ev, this.activatableEle, this.startCoord);
            return true;
        };
        TapClick.prototype.pointerMove = function (ev) {
            if (this.startCoord && this.shouldCancelEvent(ev)) {
                this.pointerCancel(ev);
            }
        };
        TapClick.prototype.pointerEnd = function (ev, pointerEventType) {
            if (!this.dispatchClick)
                return;
            (void 0) /* runInDev */;
            if (!this.startCoord) {
                return;
            }
            if (this.activator && ev.target !== this.plt.doc()) {
                var activatableEle = getActivatableTarget(ev.target) || this.activatableEle;
                if (activatableEle) {
                    this.activator.upAction(ev, activatableEle, this.startCoord);
                }
            }
            if (this.usePolyfill && pointerEventType === pointer_events_1.POINTER_EVENT_TYPE_TOUCH && this.app.isEnabled()) {
                this.handleTapPolyfill(ev);
            }
            this.startCoord = null;
            this.activatableEle = null;
        };
        TapClick.prototype.pointerCancel = function (ev) {
            (void 0) /* console.debug */;
            this.startCoord = null;
            this.activatableEle = null;
            this.dispatchClick = false;
            this.activator && this.activator.clearState(false);
            this.pointerEvents.stop();
        };
        TapClick.prototype.shouldCancelEvent = function (ev) {
            return (this.app.isScrolling() ||
                this.gestureCtrl.isCaptured() ||
                dom_1.hasPointerMoved(POINTER_TOLERANCE, this.startCoord, dom_1.pointerCoord(ev)));
        };
        TapClick.prototype.click = function (ev) {
            if (this.shouldCancelClick(ev)) {
                ev.preventDefault();
                ev.stopPropagation();
                return;
            }
            if (this.activator && this.plt.doc() !== ev.target) {
                // cool, a click is gonna happen, let's tell the activator
                // so the element can get the given "active" style
                var activatableEle = getActivatableTarget(ev.target);
                if (activatableEle) {
                    this.activator.clickAction(ev, activatableEle, this.startCoord);
                }
            }
            (void 0) /* runInDev */;
        };
        TapClick.prototype.shouldCancelClick = function (ev) {
            if (this.usePolyfill) {
                if (!ev.isIonicTap && this.isDisabledNativeClick()) {
                    (void 0) /* console.debug */;
                    return true;
                }
            }
            else if (!this.dispatchClick) {
                (void 0) /* console.debug */;
                return true;
            }
            if (!this.app.isEnabled()) {
                (void 0) /* console.debug */;
                return true;
            }
            if (this.gestureCtrl.isCaptured()) {
                (void 0) /* console.debug */;
                return true;
            }
            return false;
        };
        TapClick.prototype.profileClickDelay = function (ev) {
            if (this.lastTouchEnd) {
                var diff = Date.now() - this.lastTouchEnd;
                if (diff < 100) {
                    (void 0) /* console.debug */;
                }
                else {
                    console.warn("SLOW click dispatched. Delay(ms):", diff, ev);
                }
                this.lastTouchEnd = null;
            }
            else {
                (void 0) /* console.debug */;
            }
        };
        TapClick.prototype.handleTapPolyfill = function (ev) {
            (void 0) /* assert */;
            // only dispatch mouse click events from a touchend event
            // when tapPolyfill config is true, and the startCoordand endCoord
            // are not too far off from each other
            var endCoord = dom_1.pointerCoord(ev);
            if (dom_1.hasPointerMoved(POINTER_TOLERANCE, this.startCoord, endCoord)) {
                (void 0) /* console.debug */;
                return;
            }
            // prevent native mouse click events for XX amount of time
            this.disableClick = Date.now() + DISABLE_NATIVE_CLICK_AMOUNT;
            if (this.app.isScrolling()) {
                // do not fire off a click event while the app was scrolling
                (void 0) /* console.debug */;
            }
            else {
                // dispatch a mouse click event
                (void 0) /* console.debug */;
                var clickEvent = this.plt.doc().createEvent('MouseEvents');
                clickEvent.initMouseEvent('click', true, true, this.plt.win(), 1, 0, 0, endCoord.x, endCoord.y, false, false, false, false, 0, null);
                clickEvent.isIonicTap = true;
                ev.target.dispatchEvent(clickEvent);
            }
        };
        TapClick.prototype.isDisabledNativeClick = function () {
            return this.disableClick > Date.now();
        };
        TapClick.decorators = [
            { type: core_1.Injectable },
        ];
        /** @nocollapse */
        TapClick.ctorParameters = function () { return [
            { type: config_1.Config, },
            { type: platform_1.Platform, },
            { type: dom_controller_1.DomController, },
            { type: app_1.App, },
            { type: gesture_controller_1.GestureController, },
        ]; };
        return TapClick;
    }());
    exports.TapClick = TapClick;
    function getActivatableTarget(ele) {
        var targetEle = ele;
        for (var x = 0; x < 10; x++) {
            if (!targetEle)
                break;
            if (isActivatable(targetEle)) {
                return targetEle;
            }
            targetEle = targetEle.parentElement;
        }
        return null;
    }
    /**
     * @hidden
     */
    function isActivatable(ele) {
        if (ACTIVATABLE_ELEMENTS.indexOf(ele.tagName) > -1) {
            return true;
        }
        for (var i = 0, l = ACTIVATABLE_ATTRIBUTES.length; i < l; i++) {
            if (ele.hasAttribute && ele.hasAttribute(ACTIVATABLE_ATTRIBUTES[i])) {
                return true;
            }
        }
        return false;
    }
    exports.isActivatable = isActivatable;
    var ACTIVATABLE_ELEMENTS = ['A', 'BUTTON'];
    var ACTIVATABLE_ATTRIBUTES = ['tappable', 'ion-button'];
    var POINTER_TOLERANCE = 100;
    var DISABLE_NATIVE_CLICK_AMOUNT = 2500;
    /**
     * @hidden
     */
    function setupTapClick(config, plt, dom, app, gestureCtrl) {
        return function () {
            return new TapClick(config, plt, dom, app, gestureCtrl);
        };
    }
    exports.setupTapClick = setupTapClick;
});
//# sourceMappingURL=tap-click.js.map