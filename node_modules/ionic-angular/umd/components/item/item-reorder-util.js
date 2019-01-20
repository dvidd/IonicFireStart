(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @hidden
     */
    function indexForItem(element) {
        return element['$ionIndex'];
    }
    exports.indexForItem = indexForItem;
    /**
     * @hidden
     */
    function reorderListForItem(element) {
        return element['$ionReorderList'];
    }
    exports.reorderListForItem = reorderListForItem;
    /**
     * @hidden
     */
    function findReorderItem(node, listNode) {
        var nested = 0;
        while (node && nested < 4) {
            if (indexForItem(node) !== undefined) {
                if (listNode && node.parentNode !== listNode) {
                    return null;
                }
                return node;
            }
            node = node.parentNode;
            nested++;
        }
        return null;
    }
    exports.findReorderItem = findReorderItem;
});
//# sourceMappingURL=item-reorder-util.js.map