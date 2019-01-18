/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngtsc/util/src/path", ["require", "exports", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <reference types="node" />
    var path = require("path");
    var TS_DTS_JS_EXTENSION = /(?:\.d)?\.ts$|\.js$/;
    function relativePathBetween(from, to) {
        var relative = path.posix.relative(path.dirname(from), to).replace(TS_DTS_JS_EXTENSION, '');
        if (relative === '') {
            return null;
        }
        // path.relative() does not include the leading './'.
        if (!relative.startsWith('.')) {
            relative = "./" + relative;
        }
        return relative;
    }
    exports.relativePathBetween = relativePathBetween;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLi8uLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvdXRpbC9zcmMvcGF0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztJQUVILDhCQUE4QjtJQUU5QiwyQkFBNkI7SUFFN0IsSUFBTSxtQkFBbUIsR0FBRyxxQkFBcUIsQ0FBQztJQUVsRCxTQUFnQixtQkFBbUIsQ0FBQyxJQUFZLEVBQUUsRUFBVTtRQUMxRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUU1RixJQUFJLFFBQVEsS0FBSyxFQUFFLEVBQUU7WUFDbkIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELHFEQUFxRDtRQUNyRCxJQUFJLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM3QixRQUFRLEdBQUcsT0FBSyxRQUFVLENBQUM7U0FDNUI7UUFFRCxPQUFPLFFBQVEsQ0FBQztJQUNsQixDQUFDO0lBYkQsa0RBYUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwibm9kZVwiIC8+XG5cbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IFRTX0RUU19KU19FWFRFTlNJT04gPSAvKD86XFwuZCk/XFwudHMkfFxcLmpzJC87XG5cbmV4cG9ydCBmdW5jdGlvbiByZWxhdGl2ZVBhdGhCZXR3ZWVuKGZyb206IHN0cmluZywgdG86IHN0cmluZyk6IHN0cmluZ3xudWxsIHtcbiAgbGV0IHJlbGF0aXZlID0gcGF0aC5wb3NpeC5yZWxhdGl2ZShwYXRoLmRpcm5hbWUoZnJvbSksIHRvKS5yZXBsYWNlKFRTX0RUU19KU19FWFRFTlNJT04sICcnKTtcblxuICBpZiAocmVsYXRpdmUgPT09ICcnKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAvLyBwYXRoLnJlbGF0aXZlKCkgZG9lcyBub3QgaW5jbHVkZSB0aGUgbGVhZGluZyAnLi8nLlxuICBpZiAoIXJlbGF0aXZlLnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgIHJlbGF0aXZlID0gYC4vJHtyZWxhdGl2ZX1gO1xuICB9XG5cbiAgcmV0dXJuIHJlbGF0aXZlO1xufVxuIl19