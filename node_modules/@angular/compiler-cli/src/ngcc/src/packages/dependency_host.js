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
        define("@angular/compiler-cli/src/ngcc/src/packages/dependency_host", ["require", "exports", "canonical-path", "fs", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var path = require("canonical-path");
    var fs = require("fs");
    var ts = require("typescript");
    /**
     * Helper functions for computing dependencies.
     */
    var DependencyHost = /** @class */ (function () {
        function DependencyHost() {
        }
        /**
         * Get a list of the resolved paths to all the dependencies of this entry point.
         * @param from An absolute path to the file whose dependencies we want to get.
         * @param resolved A set that will have the absolute paths of resolved entry points added to it.
         * @param missing A set that will have the dependencies that could not be found added to it.
         * @param deepImports A set that will have the import paths that exist but cannot be mapped to
         * entry-points, i.e. deep-imports.
         * @param internal A set that is used to track internal dependencies to prevent getting stuck in a
         * circular dependency loop.
         */
        DependencyHost.prototype.computeDependencies = function (from, resolved, missing, deepImports, internal) {
            var _this = this;
            if (internal === void 0) { internal = new Set(); }
            var fromContents = fs.readFileSync(from, 'utf8');
            if (!this.hasImportOrReeportStatements(fromContents)) {
                return;
            }
            // Parse the source into a TypeScript AST and then walk it looking for imports and re-exports.
            var sf = ts.createSourceFile(from, fromContents, ts.ScriptTarget.ES2015, false, ts.ScriptKind.JS);
            sf.statements
                // filter out statements that are not imports or reexports
                .filter(this.isStringImportOrReexport)
                // Grab the id of the module that is being imported
                .map(function (stmt) { return stmt.moduleSpecifier.text; })
                // Resolve this module id into an absolute path
                .forEach(function (importPath) {
                if (importPath.startsWith('.')) {
                    // This is an internal import so follow it
                    var internalDependency = _this.resolveInternal(from, importPath);
                    // Avoid circular dependencies
                    if (!internal.has(internalDependency)) {
                        internal.add(internalDependency);
                        _this.computeDependencies(internalDependency, resolved, missing, deepImports, internal);
                    }
                }
                else {
                    var resolvedEntryPoint = _this.tryResolveEntryPoint(from, importPath);
                    if (resolvedEntryPoint !== null) {
                        resolved.add(resolvedEntryPoint);
                    }
                    else {
                        // If the import could not be resolved as entry point, it either does not exist
                        // at all or is a deep import.
                        var deeplyImportedFile = _this.tryResolve(from, importPath);
                        if (deeplyImportedFile !== null) {
                            deepImports.add(importPath);
                        }
                        else {
                            missing.add(importPath);
                        }
                    }
                }
            });
        };
        /**
         * Resolve an internal module import.
         * @param from the absolute file path from where to start trying to resolve this module
         * @param to the module specifier of the internal dependency to resolve
         * @returns the resolved path to the import.
         */
        DependencyHost.prototype.resolveInternal = function (from, to) {
            var fromDirectory = path.dirname(from);
            // `fromDirectory` is absolute so we don't need to worry about telling `require.resolve`
            // about it - unlike `tryResolve` below.
            return require.resolve(path.resolve(fromDirectory, to));
        };
        /**
         * We don't want to resolve external dependencies directly because if it is a path to a
         * sub-entry-point (e.g. @angular/animations/browser rather than @angular/animations)
         * then `require.resolve()` may return a path to a UMD bundle, which may actually live
         * in the folder containing the sub-entry-point
         * (e.g. @angular/animations/bundles/animations-browser.umd.js).
         *
         * Instead we try to resolve it as a package, which is what we would need anyway for it to be
         * compilable by ngcc.
         *
         * If `to` is actually a path to a file then this will fail, which is what we want.
         *
         * @param from the file path from where to start trying to resolve this module
         * @param to the module specifier of the dependency to resolve
         * @returns the resolved path to the entry point directory of the import or null
         * if it cannot be resolved.
         */
        DependencyHost.prototype.tryResolveEntryPoint = function (from, to) {
            var entryPoint = this.tryResolve(from, to + "/package.json");
            return entryPoint && path.dirname(entryPoint);
        };
        /**
         * Resolve the absolute path of a module from a particular starting point.
         *
         * @param from the file path from where to start trying to resolve this module
         * @param to the module specifier of the dependency to resolve
         * @returns an absolute path to the entry-point of the dependency or null if it could not be
         * resolved.
         */
        DependencyHost.prototype.tryResolve = function (from, to) {
            try {
                return require.resolve(to, { paths: [from] });
            }
            catch (e) {
                return null;
            }
        };
        /**
         * Check whether the given statement is an import with a string literal module specifier.
         * @param stmt the statement node to check.
         * @returns true if the statement is an import with a string literal module specifier.
         */
        DependencyHost.prototype.isStringImportOrReexport = function (stmt) {
            return ts.isImportDeclaration(stmt) ||
                ts.isExportDeclaration(stmt) && !!stmt.moduleSpecifier &&
                    ts.isStringLiteral(stmt.moduleSpecifier);
        };
        /**
         * Check whether a source file needs to be parsed for imports.
         * This is a performance short-circuit, which saves us from creating
         * a TypeScript AST unnecessarily.
         *
         * @param source The content of the source file to check.
         *
         * @returns false if there are definitely no import or re-export statements
         * in this file, true otherwise.
         */
        DependencyHost.prototype.hasImportOrReeportStatements = function (source) {
            return /(import|export)\s.+from/.test(source);
        };
        return DependencyHost;
    }());
    exports.DependencyHost = DependencyHost;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwZW5kZW5jeV9ob3N0LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uLyIsInNvdXJjZXMiOlsicGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9uZ2NjL3NyYy9wYWNrYWdlcy9kZXBlbmRlbmN5X2hvc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7SUFFSCxxQ0FBdUM7SUFDdkMsdUJBQXlCO0lBQ3pCLCtCQUFpQztJQUVqQzs7T0FFRztJQUNIO1FBQUE7UUFvSUEsQ0FBQztRQW5JQzs7Ozs7Ozs7O1dBU0c7UUFDSCw0Q0FBbUIsR0FBbkIsVUFDSSxJQUFZLEVBQUUsUUFBcUIsRUFBRSxPQUFvQixFQUFFLFdBQXdCLEVBQ25GLFFBQWlDO1lBRnJDLGlCQTJDQztZQXpDRyx5QkFBQSxFQUFBLGVBQTRCLEdBQUcsRUFBRTtZQUNuQyxJQUFNLFlBQVksR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsSUFBSSxDQUFDLDRCQUE0QixDQUFDLFlBQVksQ0FBQyxFQUFFO2dCQUNwRCxPQUFPO2FBQ1I7WUFFRCw4RkFBOEY7WUFDOUYsSUFBTSxFQUFFLEdBQ0osRUFBRSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxZQUFZLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0YsRUFBRSxDQUFDLFVBQVU7Z0JBQ1QsMERBQTBEO2lCQUN6RCxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDO2dCQUN0QyxtREFBbUQ7aUJBQ2xELEdBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUF6QixDQUF5QixDQUFDO2dCQUN2QywrQ0FBK0M7aUJBQzlDLE9BQU8sQ0FBQyxVQUFBLFVBQVU7Z0JB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b250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdjYW5vbmljYWwtcGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuLyoqXG4gKiBIZWxwZXIgZnVuY3Rpb25zIGZvciBjb21wdXRpbmcgZGVwZW5kZW5jaWVzLlxuICovXG5leHBvcnQgY2xhc3MgRGVwZW5kZW5jeUhvc3Qge1xuICAvKipcbiAgICogR2V0IGEgbGlzdCBvZiB0aGUgcmVzb2x2ZWQgcGF0aHMgdG8gYWxsIHRoZSBkZXBlbmRlbmNpZXMgb2YgdGhpcyBlbnRyeSBwb2ludC5cbiAgICogQHBhcmFtIGZyb20gQW4gYWJzb2x1dGUgcGF0aCB0byB0aGUgZmlsZSB3aG9zZSBkZXBlbmRlbmNpZXMgd2Ugd2FudCB0byBnZXQuXG4gICAqIEBwYXJhbSByZXNvbHZlZCBBIHNldCB0aGF0IHdpbGwgaGF2ZSB0aGUgYWJzb2x1dGUgcGF0aHMgb2YgcmVzb2x2ZWQgZW50cnkgcG9pbnRzIGFkZGVkIHRvIGl0LlxuICAgKiBAcGFyYW0gbWlzc2luZyBBIHNldCB0aGF0IHdpbGwgaGF2ZSB0aGUgZGVwZW5kZW5jaWVzIHRoYXQgY291bGQgbm90IGJlIGZvdW5kIGFkZGVkIHRvIGl0LlxuICAgKiBAcGFyYW0gZGVlcEltcG9ydHMgQSBzZXQgdGhhdCB3aWxsIGhhdmUgdGhlIGltcG9ydCBwYXRocyB0aGF0IGV4aXN0IGJ1dCBjYW5ub3QgYmUgbWFwcGVkIHRvXG4gICAqIGVudHJ5LXBvaW50cywgaS5lLiBkZWVwLWltcG9ydHMuXG4gICAqIEBwYXJhbSBpbnRlcm5hbCBBIHNldCB0aGF0IGlzIHVzZWQgdG8gdHJhY2sgaW50ZXJuYWwgZGVwZW5kZW5jaWVzIHRvIHByZXZlbnQgZ2V0dGluZyBzdHVjayBpbiBhXG4gICAqIGNpcmN1bGFyIGRlcGVuZGVuY3kgbG9vcC5cbiAgICovXG4gIGNvbXB1dGVEZXBlbmRlbmNpZXMoXG4gICAgICBmcm9tOiBzdHJpbmcsIHJlc29sdmVkOiBTZXQ8c3RyaW5nPiwgbWlzc2luZzogU2V0PHN0cmluZz4sIGRlZXBJbXBvcnRzOiBTZXQ8c3RyaW5nPixcbiAgICAgIGludGVybmFsOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKSk6IHZvaWQge1xuICAgIGNvbnN0IGZyb21Db250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyhmcm9tLCAndXRmOCcpO1xuICAgIGlmICghdGhpcy5oYXNJbXBvcnRPclJlZXBvcnRTdGF0ZW1lbnRzKGZyb21Db250ZW50cykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBQYXJzZSB0aGUgc291cmNlIGludG8gYSBUeXBlU2NyaXB0IEFTVCBhbmQgdGhlbiB3YWxrIGl0IGxvb2tpbmcgZm9yIGltcG9ydHMgYW5kIHJlLWV4cG9ydHMuXG4gICAgY29uc3Qgc2YgPVxuICAgICAgICB0cy5jcmVhdGVTb3VyY2VGaWxlKGZyb20sIGZyb21Db250ZW50cywgdHMuU2NyaXB0VGFyZ2V0LkVTMjAxNSwgZmFsc2UsIHRzLlNjcmlwdEtpbmQuSlMpO1xuICAgIHNmLnN0YXRlbWVudHNcbiAgICAgICAgLy8gZmlsdGVyIG91dCBzdGF0ZW1lbnRzIHRoYXQgYXJlIG5vdCBpbXBvcnRzIG9yIHJlZXhwb3J0c1xuICAgICAgICAuZmlsdGVyKHRoaXMuaXNTdHJpbmdJbXBvcnRPclJlZXhwb3J0KVxuICAgICAgICAvLyBHcmFiIHRoZSBpZCBvZiB0aGUgbW9kdWxlIHRoYXQgaXMgYmVpbmcgaW1wb3J0ZWRcbiAgICAgICAgLm1hcChzdG10ID0+IHN0bXQubW9kdWxlU3BlY2lmaWVyLnRleHQpXG4gICAgICAgIC8vIFJlc29sdmUgdGhpcyBtb2R1bGUgaWQgaW50byBhbiBhYnNvbHV0ZSBwYXRoXG4gICAgICAgIC5mb3JFYWNoKGltcG9ydFBhdGggPT4ge1xuICAgICAgICAgIGlmIChpbXBvcnRQYXRoLnN0YXJ0c1dpdGgoJy4nKSkge1xuICAgICAgICAgICAgLy8gVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBvcnQgc28gZm9sbG93IGl0XG4gICAgICAgICAgICBjb25zdCBpbnRlcm5hbERlcGVuZGVuY3kgPSB0aGlzLnJlc29sdmVJbnRlcm5hbChmcm9tLCBpbXBvcnRQYXRoKTtcbiAgICAgICAgICAgIC8vIEF2b2lkIGNpcmN1bGFyIGRlcGVuZGVuY2llc1xuICAgICAgICAgICAgaWYgKCFpbnRlcm5hbC5oYXMoaW50ZXJuYWxEZXBlbmRlbmN5KSkge1xuICAgICAgICAgICAgICBpbnRlcm5hbC5hZGQoaW50ZXJuYWxEZXBlbmRlbmN5KTtcbiAgICAgICAgICAgICAgdGhpcy5jb21wdXRlRGVwZW5kZW5jaWVzKFxuICAgICAgICAgICAgICAgICAgaW50ZXJuYWxEZXBlbmRlbmN5LCByZXNvbHZlZCwgbWlzc2luZywgZGVlcEltcG9ydHMsIGludGVybmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcmVzb2x2ZWRFbnRyeVBvaW50ID0gdGhpcy50cnlSZXNvbHZlRW50cnlQb2ludChmcm9tLCBpbXBvcnRQYXRoKTtcbiAgICAgICAgICAgIGlmIChyZXNvbHZlZEVudHJ5UG9pbnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgcmVzb2x2ZWQuYWRkKHJlc29sdmVkRW50cnlQb2ludCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAvLyBJZiB0aGUgaW1wb3J0IGNvdWxkIG5vdCBiZSByZXNvbHZlZCBhcyBlbnRyeSBwb2ludCwgaXQgZWl0aGVyIGRvZXMgbm90IGV4aXN0XG4gICAgICAgICAgICAgIC8vIGF0IGFsbCBvciBpcyBhIGRlZXAgaW1wb3J0LlxuICAgICAgICAgICAgICBjb25zdCBkZWVwbHlJbXBvcnRlZEZpbGUgPSB0aGlzLnRyeVJlc29sdmUoZnJvbSwgaW1wb3J0UGF0aCk7XG4gICAgICAgICAgICAgIGlmIChkZWVwbHlJbXBvcnRlZEZpbGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBkZWVwSW1wb3J0cy5hZGQoaW1wb3J0UGF0aCk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbWlzc2luZy5hZGQoaW1wb3J0UGF0aCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc29sdmUgYW4gaW50ZXJuYWwgbW9kdWxlIGltcG9ydC5cbiAgICogQHBhcmFtIGZyb20gdGhlIGFic29sdXRlIGZpbGUgcGF0aCBmcm9tIHdoZXJlIHRvIHN0YXJ0IHRyeWluZyB0byByZXNvbHZlIHRoaXMgbW9kdWxlXG4gICAqIEBwYXJhbSB0byB0aGUgbW9kdWxlIHNwZWNpZmllciBvZiB0aGUgaW50ZXJuYWwgZGVwZW5kZW5jeSB0byByZXNvbHZlXG4gICAqIEByZXR1cm5zIHRoZSByZXNvbHZlZCBwYXRoIHRvIHRoZSBpbXBvcnQuXG4gICAqL1xuICByZXNvbHZlSW50ZXJuYWwoZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCBmcm9tRGlyZWN0b3J5ID0gcGF0aC5kaXJuYW1lKGZyb20pO1xuICAgIC8vIGBmcm9tRGlyZWN0b3J5YCBpcyBhYnNvbHV0ZSBzbyB3ZSBkb24ndCBuZWVkIHRvIHdvcnJ5IGFib3V0IHRlbGxpbmcgYHJlcXVpcmUucmVzb2x2ZWBcbiAgICAvLyBhYm91dCBpdCAtIHVubGlrZSBgdHJ5UmVzb2x2ZWAgYmVsb3cuXG4gICAgcmV0dXJuIHJlcXVpcmUucmVzb2x2ZShwYXRoLnJlc29sdmUoZnJvbURpcmVjdG9yeSwgdG8pKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBXZSBkb24ndCB3YW50IHRvIHJlc29sdmUgZXh0ZXJuYWwgZGVwZW5kZW5jaWVzIGRpcmVjdGx5IGJlY2F1c2UgaWYgaXQgaXMgYSBwYXRoIHRvIGFcbiAgICogc3ViLWVudHJ5LXBvaW50IChlLmcuIEBhbmd1bGFyL2FuaW1hdGlvbnMvYnJvd3NlciByYXRoZXIgdGhhbiBAYW5ndWxhci9hbmltYXRpb25zKVxuICAgKiB0aGVuIGByZXF1aXJlLnJlc29sdmUoKWAgbWF5IHJldHVybiBhIHBhdGggdG8gYSBVTUQgYnVuZGxlLCB3aGljaCBtYXkgYWN0dWFsbHkgbGl2ZVxuICAgKiBpbiB0aGUgZm9sZGVyIGNvbnRhaW5pbmcgdGhlIHN1Yi1lbnRyeS1wb2ludFxuICAgKiAoZS5nLiBAYW5ndWxhci9hbmltYXRpb25zL2J1bmRsZXMvYW5pbWF0aW9ucy1icm93c2VyLnVtZC5qcykuXG4gICAqXG4gICAqIEluc3RlYWQgd2UgdHJ5IHRvIHJlc29sdmUgaXQgYXMgYSBwYWNrYWdlLCB3aGljaCBpcyB3aGF0IHdlIHdvdWxkIG5lZWQgYW55d2F5IGZvciBpdCB0byBiZVxuICAgKiBjb21waWxhYmxlIGJ5IG5nY2MuXG4gICAqXG4gICAqIElmIGB0b2AgaXMgYWN0dWFsbHkgYSBwYXRoIHRvIGEgZmlsZSB0aGVuIHRoaXMgd2lsbCBmYWlsLCB3aGljaCBpcyB3aGF0IHdlIHdhbnQuXG4gICAqXG4gICAqIEBwYXJhbSBmcm9tIHRoZSBmaWxlIHBhdGggZnJvbSB3aGVyZSB0byBzdGFydCB0cnlpbmcgdG8gcmVzb2x2ZSB0aGlzIG1vZHVsZVxuICAgKiBAcGFyYW0gdG8gdGhlIG1vZHVsZSBzcGVjaWZpZXIgb2YgdGhlIGRlcGVuZGVuY3kgdG8gcmVzb2x2ZVxuICAgKiBAcmV0dXJucyB0aGUgcmVzb2x2ZWQgcGF0aCB0byB0aGUgZW50cnkgcG9pbnQgZGlyZWN0b3J5IG9mIHRoZSBpbXBvcnQgb3IgbnVsbFxuICAgKiBpZiBpdCBjYW5ub3QgYmUgcmVzb2x2ZWQuXG4gICAqL1xuICB0cnlSZXNvbHZlRW50cnlQb2ludChmcm9tOiBzdHJpbmcsIHRvOiBzdHJpbmcpOiBzdHJpbmd8bnVsbCB7XG4gICAgY29uc3QgZW50cnlQb2ludCA9IHRoaXMudHJ5UmVzb2x2ZShmcm9tLCBgJHt0b30vcGFja2FnZS5qc29uYCk7XG4gICAgcmV0dXJuIGVudHJ5UG9pbnQgJiYgcGF0aC5kaXJuYW1lKGVudHJ5UG9pbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc29sdmUgdGhlIGFic29sdXRlIHBhdGggb2YgYSBtb2R1bGUgZnJvbSBhIHBhcnRpY3VsYXIgc3RhcnRpbmcgcG9pbnQuXG4gICAqXG4gICAqIEBwYXJhbSBmcm9tIHRoZSBmaWxlIHBhdGggZnJvbSB3aGVyZSB0byBzdGFydCB0cnlpbmcgdG8gcmVzb2x2ZSB0aGlzIG1vZHVsZVxuICAgKiBAcGFyYW0gdG8gdGhlIG1vZHVsZSBzcGVjaWZpZXIgb2YgdGhlIGRlcGVuZGVuY3kgdG8gcmVzb2x2ZVxuICAgKiBAcmV0dXJucyBhbiBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBlbnRyeS1wb2ludCBvZiB0aGUgZGVwZW5kZW5jeSBvciBudWxsIGlmIGl0IGNvdWxkIG5vdCBiZVxuICAgKiByZXNvbHZlZC5cbiAgICovXG4gIHRyeVJlc29sdmUoZnJvbTogc3RyaW5nLCB0bzogc3RyaW5nKTogc3RyaW5nfG51bGwge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gcmVxdWlyZS5yZXNvbHZlKHRvLCB7cGF0aHM6IFtmcm9tXX0pO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIHRoZSBnaXZlbiBzdGF0ZW1lbnQgaXMgYW4gaW1wb3J0IHdpdGggYSBzdHJpbmcgbGl0ZXJhbCBtb2R1bGUgc3BlY2lmaWVyLlxuICAgKiBAcGFyYW0gc3RtdCB0aGUgc3RhdGVtZW50IG5vZGUgdG8gY2hlY2suXG4gICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIHN0YXRlbWVudCBpcyBhbiBpbXBvcnQgd2l0aCBhIHN0cmluZyBsaXRlcmFsIG1vZHVsZSBzcGVjaWZpZXIuXG4gICAqL1xuICBpc1N0cmluZ0ltcG9ydE9yUmVleHBvcnQoc3RtdDogdHMuU3RhdGVtZW50KTogc3RtdCBpcyB0cy5JbXBvcnREZWNsYXJhdGlvbiZcbiAgICAgIHttb2R1bGVTcGVjaWZpZXI6IHRzLlN0cmluZ0xpdGVyYWx9IHtcbiAgICByZXR1cm4gdHMuaXNJbXBvcnREZWNsYXJhdGlvbihzdG10KSB8fFxuICAgICAgICB0cy5pc0V4cG9ydERlY2xhcmF0aW9uKHN0bXQpICYmICEhc3RtdC5tb2R1bGVTcGVjaWZpZXIgJiZcbiAgICAgICAgdHMuaXNTdHJpbmdMaXRlcmFsKHN0bXQubW9kdWxlU3BlY2lmaWVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB3aGV0aGVyIGEgc291cmNlIGZpbGUgbmVlZHMgdG8gYmUgcGFyc2VkIGZvciBpbXBvcnRzLlxuICAgKiBUaGlzIGlzIGEgcGVyZm9ybWFuY2Ugc2hvcnQtY2lyY3VpdCwgd2hpY2ggc2F2ZXMgdXMgZnJvbSBjcmVhdGluZ1xuICAgKiBhIFR5cGVTY3JpcHQgQVNUIHVubmVjZXNzYXJpbHkuXG4gICAqXG4gICAqIEBwYXJhbSBzb3VyY2UgVGhlIGNvbnRlbnQgb2YgdGhlIHNvdXJjZSBmaWxlIHRvIGNoZWNrLlxuICAgKlxuICAgKiBAcmV0dXJucyBmYWxzZSBpZiB0aGVyZSBhcmUgZGVmaW5pdGVseSBubyBpbXBvcnQgb3IgcmUtZXhwb3J0IHN0YXRlbWVudHNcbiAgICogaW4gdGhpcyBmaWxlLCB0cnVlIG90aGVyd2lzZS5cbiAgICovXG4gIGhhc0ltcG9ydE9yUmVlcG9ydFN0YXRlbWVudHMoc291cmNlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gLyhpbXBvcnR8ZXhwb3J0KVxccy4rZnJvbS8udGVzdChzb3VyY2UpO1xuICB9XG59XG4iXX0=