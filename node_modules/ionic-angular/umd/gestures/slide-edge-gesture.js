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
        define(["require", "exports", "./slide-gesture", "../util/util", "../util/dom"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var slide_gesture_1 = require("./slide-gesture");
    var util_1 = require("../util/util");
    var dom_1 = require("../util/dom");
    /**
     * @hidden
     */
    var SlideEdgeGesture = (function (_super) {
        __extends(SlideEdgeGesture, _super);
        function SlideEdgeGesture(plt, element, opts) {
            if (opts === void 0) { opts = {}; }
            var _this = this;
            util_1.defaults(opts, {
                edge: 'start',
                maxEdgeStart: 50
            });
            _this = _super.call(this, plt, element, opts) || this;
            // Can check corners through use of eg 'left top'
            _this.setEdges(opts.edge);
            _this.maxEdgeStart = opts.maxEdgeStart;
            return _this;
        }
        SlideEdgeGesture.prototype.setEdges = function (edges) {
            var isRTL = this.plt.isRTL;
            this.edges = edges.split(' ').map(function (value) {
                switch (value) {
                    case 'start': return isRTL ? 'right' : 'left';
                    case 'end': return isRTL ? 'left' : 'right';
                    default: return value;
                }
            });
        };
        SlideEdgeGesture.prototype.canStart = function (ev) {
            var _this = this;
            var coord = dom_1.pointerCoord(ev);
            this._d = this.getContainerDimensions();
            return this.edges.every(function (edge) { return _this._checkEdge(edge, coord); });
        };
        SlideEdgeGesture.prototype.getContainerDimensions = function () {
            var plt = this.plt;
            return {
                left: 0,
                top: 0,
                width: plt.width(),
                height: plt.height()
            };
        };
        SlideEdgeGesture.prototype._checkEdge = function (edge, pos) {
            var data = this._d;
            var maxEdgeStart = this.maxEdgeStart;
            switch (edge) {
                case 'left': return pos.x <= data.left + maxEdgeStart;
                case 'right': return pos.x >= data.width - maxEdgeStart;
                case 'top': return pos.y <= data.top + maxEdgeStart;
                case 'bottom': return pos.y >= data.height - maxEdgeStart;
            }
            return false;
        };
        return SlideEdgeGesture;
    }(slide_gesture_1.SlideGesture));
    exports.SlideEdgeGesture = SlideEdgeGesture;
});
//# sourceMappingURL=slide-edge-gesture.js.map