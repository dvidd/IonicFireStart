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
        define(["require", "exports", "./pan-gesture", "../util/util", "../util/dom"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var pan_gesture_1 = require("./pan-gesture");
    var util_1 = require("../util/util");
    var dom_1 = require("../util/dom");
    /**
     * @hidden
     */
    var SlideGesture = (function (_super) {
        __extends(SlideGesture, _super);
        function SlideGesture(plt, element, opts) {
            if (opts === void 0) { opts = {}; }
            var _this = _super.call(this, plt, element, opts) || this;
            _this.slide = null;
            return _this;
        }
        /*
         * Get the min and max for the slide. pageX/pageY.
         * Only called on dragstart.
         */
        SlideGesture.prototype.getSlideBoundaries = function (_slide, _ev) {
            return {
                min: 0,
                max: this.getNativeElement().offsetWidth
            };
        };
        /*
         * Get the element's pos when the drag starts.
         * For example, an open side menu starts at 100% and a closed
         * sidemenu starts at 0%.
         */
        SlideGesture.prototype.getElementStartPos = function (_slide, _ev) {
            return 0;
        };
        SlideGesture.prototype.onDragStart = function (ev) {
            this.onSlideBeforeStart(ev);
            var coord = dom_1.pointerCoord(ev);
            var pos = coord[this.direction];
            this.slide = {
                min: 0,
                max: 0,
                pointerStartPos: pos,
                pos: pos,
                timestamp: Date.now(),
                elementStartPos: 0,
                started: true,
                delta: 0,
                distance: 0,
                velocity: 0,
            };
            // TODO: we should run this in the next frame
            var _a = this.getSlideBoundaries(this.slide, ev), min = _a.min, max = _a.max;
            this.slide.min = min;
            this.slide.max = max;
            this.slide.elementStartPos = this.getElementStartPos(this.slide, ev);
            this.onSlideStart(this.slide, ev);
        };
        SlideGesture.prototype.onDragMove = function (ev) {
            var slide = this.slide;
            (void 0) /* assert */;
            var coord = dom_1.pointerCoord(ev);
            var newPos = coord[this.direction];
            var newTimestamp = Date.now();
            var velocity = (this.plt.isRTL ? (slide.pos - newPos) : (newPos - slide.pos)) / (newTimestamp - slide.timestamp);
            slide.pos = newPos;
            slide.timestamp = newTimestamp;
            slide.distance = util_1.clamp(slide.min, (this.plt.isRTL ? slide.pointerStartPos - newPos : newPos - slide.pointerStartPos) + slide.elementStartPos, slide.max);
            slide.velocity = velocity;
            slide.delta = (this.plt.isRTL ? slide.pointerStartPos - newPos : newPos - slide.pointerStartPos);
            this.onSlide(slide, ev);
        };
        SlideGesture.prototype.onDragEnd = function (ev) {
            this.onSlideEnd(this.slide, ev);
            this.slide = null;
        };
        SlideGesture.prototype.onSlideBeforeStart = function (_ev) { };
        SlideGesture.prototype.onSlideStart = function (_slide, _ev) { };
        SlideGesture.prototype.onSlide = function (_slide, _ev) { };
        SlideGesture.prototype.onSlideEnd = function (_slide, _ev) { };
        return SlideGesture;
    }(pan_gesture_1.PanGesture));
    exports.SlideGesture = SlideGesture;
});
//# sourceMappingURL=slide-gesture.js.map