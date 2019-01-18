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
        define("@angular/compiler-cli/src/ngtsc/shims", ["require", "exports", "@angular/compiler-cli/src/ngtsc/shims/src/factory_generator", "@angular/compiler-cli/src/ngtsc/shims/src/host", "@angular/compiler-cli/src/ngtsc/shims/src/summary_generator"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <reference types="node" />
    var factory_generator_1 = require("@angular/compiler-cli/src/ngtsc/shims/src/factory_generator");
    exports.FactoryGenerator = factory_generator_1.FactoryGenerator;
    exports.generatedFactoryTransform = factory_generator_1.generatedFactoryTransform;
    var host_1 = require("@angular/compiler-cli/src/ngtsc/shims/src/host");
    exports.GeneratedShimsHostWrapper = host_1.GeneratedShimsHostWrapper;
    var summary_generator_1 = require("@angular/compiler-cli/src/ngtsc/shims/src/summary_generator");
    exports.SummaryGenerator = summary_generator_1.SummaryGenerator;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vLi4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25ndHNjL3NoaW1zL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgsOEJBQThCO0lBRTlCLGlHQUFpRztJQUF6RiwrQ0FBQSxnQkFBZ0IsQ0FBQTtJQUFlLHdEQUFBLHlCQUF5QixDQUFBO0lBQ2hFLHVFQUFxRDtJQUE3QywyQ0FBQSx5QkFBeUIsQ0FBQTtJQUNqQyxpR0FBeUQ7SUFBakQsK0NBQUEsZ0JBQWdCLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwibm9kZVwiIC8+XG5cbmV4cG9ydCB7RmFjdG9yeUdlbmVyYXRvciwgRmFjdG9yeUluZm8sIGdlbmVyYXRlZEZhY3RvcnlUcmFuc2Zvcm19IGZyb20gJy4vc3JjL2ZhY3RvcnlfZ2VuZXJhdG9yJztcbmV4cG9ydCB7R2VuZXJhdGVkU2hpbXNIb3N0V3JhcHBlcn0gZnJvbSAnLi9zcmMvaG9zdCc7XG5leHBvcnQge1N1bW1hcnlHZW5lcmF0b3J9IGZyb20gJy4vc3JjL3N1bW1hcnlfZ2VuZXJhdG9yJztcbiJdfQ==