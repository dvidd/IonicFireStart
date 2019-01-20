(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../components/app/app"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var app_1 = require("../components/app/app");
    /** @hidden */
    exports.GESTURE_GO_BACK_SWIPE = 'goback-swipe';
    /** @hidden */
    exports.GESTURE_MENU_SWIPE = 'menu-swipe';
    /** @hidden */
    exports.GESTURE_ITEM_SWIPE = 'item-swipe';
    /** @hidden */
    exports.GESTURE_REFRESHER = 'refresher';
    /** @hidden */
    exports.GESTURE_TOGGLE = 'toggle';
    /** @hidden */
    exports.GESTURE_PRIORITY_SLIDING_ITEM = -10;
    /** @hidden */
    exports.GESTURE_PRIORITY_REFRESHER = 0;
    /** @hidden */
    exports.GESTURE_PRIORITY_MENU_SWIPE = 10;
    /** @hidden */
    exports.GESTURE_PRIORITY_GO_BACK_SWIPE = 20;
    /** @hidden */
    exports.GESTURE_PRIORITY_TOGGLE = 30;
    /**
    * @hidden
    */
    exports.BLOCK_ALL = {
        disable: [exports.GESTURE_MENU_SWIPE, exports.GESTURE_GO_BACK_SWIPE],
        disableScroll: true
    };
    /**
    * @hidden
    */
    var GestureController = (function () {
        function GestureController(_app) {
            this._app = _app;
            this.id = 1;
            this.requestedStart = {};
            this.disabledGestures = {};
            this.disabledScroll = new Set();
            this.capturedID = null;
        }
        GestureController.prototype.createGesture = function (opts) {
            if (!opts.name) {
                throw new Error('name is undefined');
            }
            return new GestureDelegate(opts.name, this.newID(), this, opts.priority || 0, !!opts.disableScroll);
        };
        GestureController.prototype.createBlocker = function (opts) {
            if (opts === void 0) { opts = {}; }
            return new BlockerDelegate(this.newID(), this, opts.disable, !!opts.disableScroll);
        };
        GestureController.prototype.newID = function () {
            var id = this.id;
            this.id++;
            return id;
        };
        GestureController.prototype.start = function (gestureName, id, priority) {
            if (!this.canStart(gestureName)) {
                delete this.requestedStart[id];
                return false;
            }
            this.requestedStart[id] = priority;
            return true;
        };
        GestureController.prototype.capture = function (gestureName, id, priority) {
            if (!this.start(gestureName, id, priority)) {
                return false;
            }
            var requestedStart = this.requestedStart;
            var maxPriority = -10000;
            for (var gestureID in requestedStart) {
                maxPriority = Math.max(maxPriority, requestedStart[gestureID]);
            }
            if (maxPriority === priority) {
                this.capturedID = id;
                this.requestedStart = {};
                (void 0) /* console.debug */;
                return true;
            }
            delete requestedStart[id];
            (void 0) /* console.debug */;
            return false;
        };
        GestureController.prototype.release = function (id) {
            delete this.requestedStart[id];
            if (this.capturedID && id === this.capturedID) {
                this.capturedID = null;
            }
        };
        GestureController.prototype.disableGesture = function (gestureName, id) {
            var set = this.disabledGestures[gestureName];
            if (!set) {
                set = new Set();
                this.disabledGestures[gestureName] = set;
            }
            set.add(id);
        };
        GestureController.prototype.enableGesture = function (gestureName, id) {
            var set = this.disabledGestures[gestureName];
            if (set) {
                set.delete(id);
            }
        };
        GestureController.prototype.disableScroll = function (id) {
            var isEnabled = !this.isScrollDisabled();
            this.disabledScroll.add(id);
            if (this._app && isEnabled && this.isScrollDisabled()) {
                (void 0) /* console.debug */;
                this._app._setDisableScroll(true);
            }
        };
        GestureController.prototype.enableScroll = function (id) {
            var isDisabled = this.isScrollDisabled();
            this.disabledScroll.delete(id);
            if (this._app && isDisabled && !this.isScrollDisabled()) {
                (void 0) /* console.debug */;
                this._app._setDisableScroll(false);
            }
        };
        GestureController.prototype.canStart = function (gestureName) {
            if (this.capturedID) {
                (void 0) /* console.debug */;
                // a gesture already captured
                return false;
            }
            if (this.isDisabled(gestureName)) {
                (void 0) /* console.debug */;
                return false;
            }
            return true;
        };
        GestureController.prototype.isCaptured = function () {
            return !!this.capturedID;
        };
        GestureController.prototype.isScrollDisabled = function () {
            return this.disabledScroll.size > 0;
        };
        GestureController.prototype.isDisabled = function (gestureName) {
            var disabled = this.disabledGestures[gestureName];
            return !!(disabled && disabled.size > 0);
        };
        GestureController.decorators = [
            { type: core_1.Injectable },
        ];
        /** @nocollapse */
        GestureController.ctorParameters = function () { return [
            { type: app_1.App, decorators: [{ type: core_1.Inject, args: [core_1.forwardRef(function () { return app_1.App; }),] },] },
        ]; };
        return GestureController;
    }());
    exports.GestureController = GestureController;
    /**
    * @hidden
    */
    var GestureDelegate = (function () {
        function GestureDelegate(name, id, controller, priority, disableScroll) {
            this.name = name;
            this.id = id;
            this.controller = controller;
            this.priority = priority;
            this.disableScroll = disableScroll;
        }
        GestureDelegate.prototype.canStart = function () {
            if (!this.controller) {
                (void 0) /* assert */;
                return false;
            }
            return this.controller.canStart(this.name);
        };
        GestureDelegate.prototype.start = function () {
            if (!this.controller) {
                (void 0) /* assert */;
                return false;
            }
            return this.controller.start(this.name, this.id, this.priority);
        };
        GestureDelegate.prototype.capture = function () {
            if (!this.controller) {
                (void 0) /* assert */;
                return false;
            }
            var captured = this.controller.capture(this.name, this.id, this.priority);
            if (captured && this.disableScroll) {
                this.controller.disableScroll(this.id);
            }
            return captured;
        };
        GestureDelegate.prototype.release = function () {
            if (!this.controller) {
                (void 0) /* assert */;
                return;
            }
            this.controller.release(this.id);
            if (this.disableScroll) {
                this.controller.enableScroll(this.id);
            }
        };
        GestureDelegate.prototype.destroy = function () {
            this.release();
            this.controller = null;
        };
        return GestureDelegate;
    }());
    exports.GestureDelegate = GestureDelegate;
    /**
    * @hidden
    */
    var BlockerDelegate = (function () {
        function BlockerDelegate(id, controller, disable, disableScroll) {
            this.id = id;
            this.controller = controller;
            this.disable = disable;
            this.disableScroll = disableScroll;
            this.blocked = false;
        }
        BlockerDelegate.prototype.block = function () {
            var _this = this;
            if (!this.controller) {
                (void 0) /* assert */;
                return;
            }
            if (this.disable) {
                this.disable.forEach(function (gesture) {
                    _this.controller.disableGesture(gesture, _this.id);
                });
            }
            if (this.disableScroll) {
                this.controller.disableScroll(this.id);
            }
            this.blocked = true;
        };
        BlockerDelegate.prototype.unblock = function () {
            var _this = this;
            if (!this.controller) {
                (void 0) /* assert */;
                return;
            }
            if (this.disable) {
                this.disable.forEach(function (gesture) {
                    _this.controller.enableGesture(gesture, _this.id);
                });
            }
            if (this.disableScroll) {
                this.controller.enableScroll(this.id);
            }
            this.blocked = false;
        };
        BlockerDelegate.prototype.destroy = function () {
            this.unblock();
            this.controller = null;
        };
        return BlockerDelegate;
    }());
    exports.BlockerDelegate = BlockerDelegate;
});
//# sourceMappingURL=gesture-controller.js.map