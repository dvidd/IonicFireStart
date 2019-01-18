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
        define("@angular/compiler-cli/src/ngtsc/shims/src/util", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TS_FILE = /\.tsx?$/;
    var D_TS_FILE = /\.d\.ts$/;
    function isNonDeclarationTsFile(file) {
        return TS_FILE.exec(file) !== null && D_TS_FILE.exec(file) === null;
    }
    exports.isNonDeclarationTsFile = isNonDeclarationTsFile;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLi8uLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2Mvc2hpbXMvc3JjL3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCxJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7SUFDMUIsSUFBTSxTQUFTLEdBQUcsVUFBVSxDQUFDO0lBRTdCLFNBQWdCLHNCQUFzQixDQUFDLElBQVk7UUFDakQsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQztJQUN0RSxDQUFDO0lBRkQsd0RBRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmNvbnN0IFRTX0ZJTEUgPSAvXFwudHN4PyQvO1xuY29uc3QgRF9UU19GSUxFID0gL1xcLmRcXC50cyQvO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNOb25EZWNsYXJhdGlvblRzRmlsZShmaWxlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIFRTX0ZJTEUuZXhlYyhmaWxlKSAhPT0gbnVsbCAmJiBEX1RTX0ZJTEUuZXhlYyhmaWxlKSA9PT0gbnVsbDtcbn1cbiJdfQ==