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
        define("@angular/compiler-cli/src/ngcc/src/packages/bundle", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function createBundleInfo(isCore, rewriteCoreImportsTo, rewriteCoreDtsImportsTo) {
        return {
            isCore: isCore,
            isFlat: rewriteCoreImportsTo === null,
            rewriteCoreImportsTo: rewriteCoreImportsTo,
            rewriteCoreDtsImportsTo: rewriteCoreDtsImportsTo,
        };
    }
    exports.createBundleInfo = createBundleInfo;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uLyIsInNvdXJjZXMiOlsicGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ2NjL3NyYy9wYWNrYWdlcy9idW5kbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFlSCxTQUFnQixnQkFBZ0IsQ0FDNUIsTUFBZSxFQUFFLG9CQUEwQyxFQUMzRCx1QkFBNkM7UUFDL0MsT0FBTztZQUNMLE1BQU0sUUFBQTtZQUNOLE1BQU0sRUFBRSxvQkFBb0IsS0FBSyxJQUFJO1lBQ3JDLG9CQUFvQixFQUFFLG9CQUFvQjtZQUMxQyx1QkFBdUIsRUFBRSx1QkFBdUI7U0FDakQsQ0FBQztJQUNKLENBQUM7SUFURCw0Q0FTQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbi8qKlxuICogQSBidW5kbGUgcmVwcmVzZW50cyB0aGUgY3VycmVudGx5IGNvbXBpbGVkIGVudHJ5IHBvaW50IGZvcm1hdCwgY29udGFpbmluZ1xuICogaW5mb3JtYXRpb24gdGhhdCBpcyBuZWNlc3NhcnkgZm9yIGNvbXBpbGluZyBAYW5ndWxhci9jb3JlIHdpdGggbmdjYy5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBCdW5kbGVJbmZvIHtcbiAgaXNDb3JlOiBib29sZWFuO1xuICBpc0ZsYXQ6IGJvb2xlYW47XG4gIHJld3JpdGVDb3JlSW1wb3J0c1RvOiB0cy5Tb3VyY2VGaWxlfG51bGw7XG4gIHJld3JpdGVDb3JlRHRzSW1wb3J0c1RvOiB0cy5Tb3VyY2VGaWxlfG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVCdW5kbGVJbmZvKFxuICAgIGlzQ29yZTogYm9vbGVhbiwgcmV3cml0ZUNvcmVJbXBvcnRzVG86IHRzLlNvdXJjZUZpbGUgfCBudWxsLFxuICAgIHJld3JpdGVDb3JlRHRzSW1wb3J0c1RvOiB0cy5Tb3VyY2VGaWxlIHwgbnVsbCk6IEJ1bmRsZUluZm8ge1xuICByZXR1cm4ge1xuICAgIGlzQ29yZSxcbiAgICBpc0ZsYXQ6IHJld3JpdGVDb3JlSW1wb3J0c1RvID09PSBudWxsLFxuICAgIHJld3JpdGVDb3JlSW1wb3J0c1RvOiByZXdyaXRlQ29yZUltcG9ydHNUbyxcbiAgICByZXdyaXRlQ29yZUR0c0ltcG9ydHNUbzogcmV3cml0ZUNvcmVEdHNJbXBvcnRzVG8sXG4gIH07XG59XG4iXX0=