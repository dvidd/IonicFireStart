(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./item-reorder-util", "../../util/dom", "../../gestures/ui-event-manager"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var item_reorder_util_1 = require("./item-reorder-util");
    var dom_1 = require("../../util/dom");
    var ui_event_manager_1 = require("../../gestures/ui-event-manager");
    /**
     * @hidden
     */
    var ItemReorderGesture = (function () {
        function ItemReorderGesture(plt, reorderList) {
            this.plt = plt;
            this.reorderList = reorderList;
            this.selectedItemEle = null;
            this.events = new ui_event_manager_1.UIEventManager(plt);
            this.events.pointerEvents({
                element: this.reorderList.getNativeElement(),
                pointerDown: this.onDragStart.bind(this),
                pointerMove: this.onDragMove.bind(this),
                pointerUp: this.onDragEnd.bind(this),
                zone: false
            });
        }
        ItemReorderGesture.prototype.onDragStart = function (ev) {
            if (this.selectedItemEle) {
                return false;
            }
            var reorderElement = ev.target;
            if (reorderElement.nodeName !== 'ION-REORDER') {
                return false;
            }
            var reorderMark = reorderElement['$ionComponent'];
            if (!reorderMark) {
                console.error('ion-reorder does not contain $ionComponent');
                return false;
            }
            this.reorderList._reorderPrepare();
            var item = reorderMark.getReorderNode();
            if (!item) {
                console.error('reorder node not found');
                return false;
            }
            ev.preventDefault();
            // Preparing state
            this.selectedItemEle = item;
            this.selectedItemHeight = item.offsetHeight;
            this.lastYcoord = -100;
            this.lastToIndex = item_reorder_util_1.indexForItem(item);
            this.windowHeight = this.plt.height() - AUTO_SCROLL_MARGIN;
            this.lastScrollPosition = this.reorderList._scrollContent(0);
            this.offset = dom_1.pointerCoord(ev);
            this.offset.y += this.lastScrollPosition;
            item.classList.add(ITEM_REORDER_ACTIVE);
            this.reorderList._reorderStart();
            return true;
        };
        ItemReorderGesture.prototype.onDragMove = function (ev) {
            var selectedItem = this.selectedItemEle;
            if (!selectedItem) {
                return;
            }
            ev.preventDefault();
            // Get coordinate
            var coord = dom_1.pointerCoord(ev);
            var posY = coord.y;
            // Scroll if we reach the scroll margins
            var scrollPosition = this.scroll(posY);
            // Only perform hit test if we moved at least 30px from previous position
            if (Math.abs(posY - this.lastYcoord) > 30) {
                var overItem = this.itemForCoord(coord);
                if (overItem) {
                    var toIndex = item_reorder_util_1.indexForItem(overItem);
                    if (toIndex !== undefined && (toIndex !== this.lastToIndex || this.emptyZone)) {
                        var fromIndex = item_reorder_util_1.indexForItem(selectedItem);
                        this.lastToIndex = toIndex;
                        this.lastYcoord = posY;
                        this.emptyZone = false;
                        this.reorderList._reorderMove(fromIndex, toIndex, this.selectedItemHeight);
                    }
                }
                else {
                    this.emptyZone = true;
                }
            }
            // Update selected item position
            var ydiff = Math.round(posY - this.offset.y + scrollPosition);
            selectedItem.style[this.plt.Css.transform] = "translateY(" + ydiff + "px)";
        };
        ItemReorderGesture.prototype.onDragEnd = function (ev) {
            var _this = this;
            var selectedItem = this.selectedItemEle;
            if (!selectedItem) {
                return;
            }
            if (ev) {
                ev.preventDefault();
                ev.stopPropagation();
            }
            var toIndex = this.lastToIndex;
            var fromIndex = item_reorder_util_1.indexForItem(selectedItem);
            var reorderInactive = function () {
                _this.selectedItemEle.style.transition = '';
                _this.selectedItemEle.classList.remove(ITEM_REORDER_ACTIVE);
                _this.selectedItemEle = null;
            };
            if (toIndex === fromIndex) {
                selectedItem.style.transition = 'transform 200ms ease-in-out';
                setTimeout(reorderInactive, 200);
            }
            else {
                reorderInactive();
            }
            this.reorderList._reorderEmit(fromIndex, toIndex);
        };
        ItemReorderGesture.prototype.itemForCoord = function (coord) {
            var sideOffset = this.reorderList._isStart === this.plt.isRTL ? -100 : 100;
            var x = this.offset.x + sideOffset;
            var y = coord.y;
            var element = this.plt.getElementFromPoint(x, y);
            return item_reorder_util_1.findReorderItem(element, this.reorderList.getNativeElement());
        };
        ItemReorderGesture.prototype.scroll = function (posY) {
            if (posY < AUTO_SCROLL_MARGIN) {
                this.lastScrollPosition = this.reorderList._scrollContent(-SCROLL_JUMP);
            }
            else if (posY > this.windowHeight) {
                this.lastScrollPosition = this.reorderList._scrollContent(SCROLL_JUMP);
            }
            return this.lastScrollPosition;
        };
        /**
         * @hidden
         */
        ItemReorderGesture.prototype.destroy = function () {
            this.onDragEnd(null);
            this.events.destroy();
            this.events = null;
            this.reorderList = null;
        };
        return ItemReorderGesture;
    }());
    exports.ItemReorderGesture = ItemReorderGesture;
    var AUTO_SCROLL_MARGIN = 60;
    var SCROLL_JUMP = 10;
    var ITEM_REORDER_ACTIVE = 'reorder-active';
});
//# sourceMappingURL=item-reorder-gesture.js.map