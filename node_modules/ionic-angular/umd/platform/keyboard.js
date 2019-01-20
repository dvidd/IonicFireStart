(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "../config/config", "./dom-controller", "../util/dom", "./key", "./platform"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var config_1 = require("../config/config");
    var dom_controller_1 = require("./dom-controller");
    var dom_1 = require("../util/dom");
    var key_1 = require("./key");
    var platform_1 = require("./platform");
    /**
     * @name Keyboard
     * @description
     * The `Keyboard` class allows you to work with the keyboard events provided
     * by the Ionic keyboard plugin.
     *
     * @usage
     * ```ts
     * export class MyClass {
     *
     *   constructor(public keyboard: Keyboard) { }
     *
     * }
     * ```
     */
    var Keyboard = (function () {
        function Keyboard(config, _plt, _zone, _dom) {
            this._plt = _plt;
            this._zone = _zone;
            this._dom = _dom;
            this.willShow = new core_1.EventEmitter();
            this.willHide = new core_1.EventEmitter();
            this.didShow = new core_1.EventEmitter();
            this.didHide = new core_1.EventEmitter();
            this.eventsAvailable = false;
            this.focusOutline(config.get('focusOutline'));
            var win = _plt.win();
            if (win.Ionic && win.Ionic.keyboardPlugin) {
                this.listenV2(win);
            }
            else {
                this.listenV1(win);
            }
        }
        Keyboard.prototype.listenV2 = function (win) {
            var _this = this;
            var platform = this._plt;
            platform.registerListener(win, 'keyboardWillShow', function (ev) {
                _this._zone.run(function () {
                    _this.willShow.emit(ev.keyboardHeight);
                });
            }, { zone: false, passive: true });
            platform.registerListener(win, 'keyboardWillHide', function () {
                _this._zone.run(function () {
                    _this.willHide.emit();
                });
            }, { zone: false, passive: true });
            platform.registerListener(win, 'keyboardDidShow', function (ev) {
                _this._zone.run(function () {
                    _this.didShow.emit(ev.keyboardHeight);
                });
            }, { zone: false, passive: true });
            platform.registerListener(win, 'keyboardDidHide', function () {
                _this._zone.run(function () {
                    _this.didHide.emit();
                });
            }, { zone: false, passive: true });
            this.eventsAvailable = true;
        };
        Keyboard.prototype.listenV1 = function (win) {
            var _this = this;
            var platform = this._plt;
            platform.registerListener(win, 'native.keyboardhide', function () {
                _this.blurActiveInput(true);
            }, { zone: false, passive: true });
            platform.registerListener(win, 'native.keyboardshow', function () {
                _this.blurActiveInput(false);
            }, { zone: false, passive: true });
        };
        Keyboard.prototype.blurActiveInput = function (shouldBlur) {
            var _this = this;
            var platform = this._plt;
            platform.cancelTimeout(this._tmr);
            if (shouldBlur) {
                this._tmr = platform.timeout(function () {
                    // this custom cordova plugin event fires when the keyboard will hide
                    // useful when the virtual keyboard is closed natively
                    // https://github.com/ionic-team/ionic-plugin-keyboard
                    if (_this.isOpen()) {
                        platform.focusOutActiveElement();
                    }
                }, 80);
            }
        };
        /**
         * Check to see if the keyboard is open or not.
         *
         * ```ts
         * export class MyClass {
         *   constructor(public keyboard: Keyboard) {
         *
         *   }
         *
         *   keyboardCheck() {
         *     console.log('The keyboard is open:', this.keyboard.isOpen());
         *   }
         * }
         * ```
         *
         * @return {boolean} returns a true or false value if the keyboard is open or not.
         */
        Keyboard.prototype.isOpen = function () {
            return this.hasFocusedTextInput();
        };
        /**
         * When the keyboard is closed, call any methods you want.
         *
         * ```ts
         * export class MyClass {
         *   constructor(public keyboard: Keyboard) {
         *     this.keyboard.onClose(this.closeCallback);
         *   }
         *   closeCallback() {
         *     // call what ever functionality you want on keyboard close
         *     console.log('Closing time');
         *   }
         * }
         * ```
         *
         * @param {function} callback method you want to call when the keyboard has been closed.
         * @return {function} returns a callback that gets fired when the keyboard is closed.
         */
        Keyboard.prototype.onClose = function (callback, pollingInternval, pollingChecksMax) {
            if (pollingInternval === void 0) { pollingInternval = KEYBOARD_CLOSE_POLLING; }
            if (pollingChecksMax === void 0) { pollingChecksMax = KEYBOARD_POLLING_CHECKS_MAX; }
            (void 0) /* console.debug */;
            var self = this;
            var checks = 0;
            var promise = null;
            if (!callback) {
                // a callback wasn't provided, so let's return a promise instead
                promise = new Promise(function (resolve) { callback = resolve; });
            }
            function checkKeyboard() {
                (void 0) /* console.debug */;
                if (!self.isOpen() || checks > pollingChecksMax) {
                    self._plt.timeout(function () {
                        self._zone.run(function () {
                            (void 0) /* console.debug */;
                            callback();
                        });
                    }, 400);
                }
                else {
                    self._plt.timeout(checkKeyboard, pollingInternval);
                }
                checks++;
            }
            self._plt.timeout(checkKeyboard, pollingInternval);
            return promise;
        };
        /**
         * Programmatically close the keyboard.
         */
        Keyboard.prototype.close = function () {
            var _this = this;
            this._dom.read(function () {
                if (_this.isOpen()) {
                    // only focus out when a text input has focus
                    (void 0) /* console.debug */;
                    _this._dom.write(function () {
                        _this._plt.focusOutActiveElement();
                    });
                }
            });
        };
        /**
         * @hidden
         */
        Keyboard.prototype.focusOutline = function (setting) {
            /* Focus Outline
             * --------------------------------------------------
             * By default, when a keydown event happens from a tab key, then
             * the 'focus-outline' css class is added to the body element
             * so focusable elements have an outline. On a mousedown or
             * touchstart event, then the 'focus-outline' css class is removed.
             *
             * Config default overrides:
             * focusOutline: true     - Always add the focus-outline
             * focusOutline: false    - Do not add the focus-outline
             */
            var self = this;
            var platform = self._plt;
            var doc = platform.doc();
            var isKeyInputEnabled = false;
            var unRegMouse;
            var unRegTouch;
            var evOpts = { passive: true, zone: false };
            function cssClass() {
                self._dom.write(function () {
                    platform.doc().body.classList[isKeyInputEnabled ? 'add' : 'remove']('focus-outline');
                });
            }
            if (setting === true) {
                isKeyInputEnabled = true;
                return cssClass();
            }
            else if (setting === false) {
                return;
            }
            // default is to add the focus-outline when the tab key is used
            function keyDown(ev) {
                if (!isKeyInputEnabled && ev.keyCode === key_1.KEY_TAB) {
                    isKeyInputEnabled = true;
                    enableKeyInput();
                }
            }
            function pointerDown() {
                isKeyInputEnabled = false;
                enableKeyInput();
            }
            function enableKeyInput() {
                cssClass();
                unRegMouse && unRegMouse();
                unRegTouch && unRegTouch();
                if (isKeyInputEnabled) {
                    // listen for when a mousedown or touchstart event happens
                    unRegMouse = platform.registerListener(doc, 'mousedown', pointerDown, evOpts);
                    unRegTouch = platform.registerListener(doc, 'touchstart', pointerDown, evOpts);
                }
            }
            // always listen for tab keydown events
            platform.registerListener(platform.doc(), 'keydown', keyDown, evOpts);
        };
        Keyboard.prototype.hasFocusedTextInput = function () {
            var activeEle = this._plt.getActiveElement();
            if (dom_1.isTextInput(activeEle)) {
                return (activeEle.parentElement.querySelector(':focus') === activeEle);
            }
            return false;
        };
        /**
         * Set to true to hide the additional toolbar that is on top of the keyboard.
         * This toolbar features the Prev, Next, and Done buttons.
         * @param hidden
         */
        Keyboard.prototype.hideFormAccessoryBar = function (hidden) {
            var win = this._plt.win();
            if (win && win.Keyboard && win.Keyboard.hideFormAccessoryBar) {
                win.Keyboard.hideFormAccessoryBar(hidden);
            }
        };
        Keyboard.decorators = [
            { type: core_1.Injectable },
        ];
        /** @nocollapse */
        Keyboard.ctorParameters = function () { return [
            { type: config_1.Config, },
            { type: platform_1.Platform, },
            { type: core_1.NgZone, },
            { type: dom_controller_1.DomController, },
        ]; };
        return Keyboard;
    }());
    exports.Keyboard = Keyboard;
    var KEYBOARD_CLOSE_POLLING = 150;
    var KEYBOARD_POLLING_CHECKS_MAX = 100;
});
//# sourceMappingURL=keyboard.js.map