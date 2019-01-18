(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngcc/src/packages/transformer", ["require", "exports", "tslib", "canonical-path", "fs", "shelljs", "typescript", "@angular/compiler-cli/src/ngcc/src/analysis/decoration_analyzer", "@angular/compiler-cli/src/ngcc/src/analysis/switch_marker_analyzer", "@angular/compiler-cli/src/ngcc/src/host/esm2015_host", "@angular/compiler-cli/src/ngcc/src/host/esm5_host", "@angular/compiler-cli/src/ngcc/src/rendering/esm5_renderer", "@angular/compiler-cli/src/ngcc/src/rendering/esm_renderer", "@angular/compiler-cli/src/ngcc/src/packages/build_marker", "@angular/compiler-cli/src/ngcc/src/packages/bundle"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = require("tslib");
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var canonical_path_1 = require("canonical-path");
    var fs_1 = require("fs");
    var shelljs_1 = require("shelljs");
    var ts = require("typescript");
    var decoration_analyzer_1 = require("@angular/compiler-cli/src/ngcc/src/analysis/decoration_analyzer");
    var switch_marker_analyzer_1 = require("@angular/compiler-cli/src/ngcc/src/analysis/switch_marker_analyzer");
    var esm2015_host_1 = require("@angular/compiler-cli/src/ngcc/src/host/esm2015_host");
    var esm5_host_1 = require("@angular/compiler-cli/src/ngcc/src/host/esm5_host");
    var esm5_renderer_1 = require("@angular/compiler-cli/src/ngcc/src/rendering/esm5_renderer");
    var esm_renderer_1 = require("@angular/compiler-cli/src/ngcc/src/rendering/esm_renderer");
    var build_marker_1 = require("@angular/compiler-cli/src/ngcc/src/packages/build_marker");
    var bundle_1 = require("@angular/compiler-cli/src/ngcc/src/packages/bundle");
    /**
     * A Package is stored in a directory on disk and that directory can contain one or more package
     * formats - e.g. fesm2015, UMD, etc. Additionally, each package provides typings (`.d.ts` files).
     *
     * Each of these formats exposes one or more entry points, which are source files that need to be
     * parsed to identify the decorated exported classes that need to be analyzed and compiled by one or
     * more `DecoratorHandler` objects.
     *
     * Each entry point to a package is identified by a `SourceFile` that can be parsed and analyzed to
     * identify classes that need to be transformed; and then finally rendered and written to disk.
     * The actual file which needs to be transformed depends upon the package format.
     *
     * Along with the source files, the corresponding source maps (either inline or external) and
     * `.d.ts` files are transformed accordingly.
     *
     * - Flat file packages have all the classes in a single file.
     * - Other packages may re-export classes from other non-entry point files.
     * - Some formats may contain multiple "modules" in a single file.
     */
    var Transformer = /** @class */ (function () {
        function Transformer(sourcePath, targetPath) {
            this.sourcePath = sourcePath;
            this.targetPath = targetPath;
        }
        Transformer.prototype.transform = function (entryPoint, format, transformDts) {
            var _this = this;
            if (build_marker_1.checkMarkerFile(entryPoint, format)) {
                console.warn("Skipping " + entryPoint.name + " : " + format + " (already built).");
                return;
            }
            var entryPointFilePath = entryPoint[format];
            if (!entryPointFilePath) {
                console.warn("Skipping " + entryPoint.name + " : " + format + " (no entry point file for this format).");
                return;
            }
            console.warn("Compiling " + entryPoint.name + " - " + format);
            var options = {
                allowJs: true,
                maxNodeModuleJsDepth: Infinity,
                rootDir: entryPoint.path,
            };
            // Create the TS program and necessary helpers.
            // TODO : create a custom compiler host that reads from .bak files if available.
            var host = ts.createCompilerHost(options);
            var rootDirs = this.getRootDirs(host, options);
            var isCore = entryPoint.name === '@angular/core';
            var r3SymbolsPath = isCore ? this.findR3SymbolsPath(canonical_path_1.dirname(entryPointFilePath), 'r3_symbols.js') : null;
            var rootPaths = r3SymbolsPath ? [entryPointFilePath, r3SymbolsPath] : [entryPointFilePath];
            var packageProgram = ts.createProgram(rootPaths, options, host);
            var r3SymbolsFile = r3SymbolsPath && packageProgram.getSourceFile(r3SymbolsPath) || null;
            // Create the program for processing DTS files if enabled for this format.
            var dtsFilePath = entryPoint.typings;
            var dtsProgram = null;
            var r3SymbolsDtsFile = null;
            if (transformDts) {
                console.time(entryPoint.name + " (dtsMapper creation)");
                var r3SymbolsDtsPath = isCore ? this.findR3SymbolsPath(canonical_path_1.dirname(dtsFilePath), 'r3_symbols.d.ts') : null;
                var rootDtsPaths = r3SymbolsDtsPath ? [dtsFilePath, r3SymbolsDtsPath] : [dtsFilePath];
                dtsProgram = ts.createProgram(rootDtsPaths, options, host);
                r3SymbolsDtsFile = r3SymbolsDtsPath && dtsProgram.getSourceFile(r3SymbolsDtsPath) || null;
                console.timeEnd(entryPoint.name + " (dtsMapper creation)");
            }
            var bundle = bundle_1.createBundleInfo(isCore, r3SymbolsFile, r3SymbolsDtsFile);
            var reflectionHost = this.getHost(isCore, format, packageProgram, dtsFilePath, dtsProgram);
            // Parse and analyze the files.
            var _a = this.analyzeProgram(packageProgram, reflectionHost, rootDirs, isCore), decorationAnalyses = _a.decorationAnalyses, switchMarkerAnalyses = _a.switchMarkerAnalyses;
            console.time(entryPoint.name + " (rendering)");
            // Transform the source files and source maps.
            var renderer = this.getRenderer(format, packageProgram, reflectionHost, bundle, transformDts);
            var renderedFiles = renderer.renderProgram(packageProgram, decorationAnalyses, switchMarkerAnalyses);
            console.timeEnd(entryPoint.name + " (rendering)");
            // Write out all the transformed files.
            renderedFiles.forEach(function (file) { return _this.writeFile(file); });
            // Write the built-with-ngcc marker
            build_marker_1.writeMarkerFile(entryPoint, format);
        };
        Transformer.prototype.getRootDirs = function (host, options) {
            if (options.rootDirs !== undefined) {
                return options.rootDirs;
            }
            else if (options.rootDir !== undefined) {
                return [options.rootDir];
            }
            else {
                return [host.getCurrentDirectory()];
            }
        };
        Transformer.prototype.getHost = function (isCore, format, program, dtsFilePath, dtsProgram) {
            switch (format) {
                case 'esm2015':
                case 'fesm2015':
                    return new esm2015_host_1.Esm2015ReflectionHost(isCore, program.getTypeChecker(), dtsFilePath, dtsProgram);
                case 'esm5':
                case 'fesm5':
                    return new esm5_host_1.Esm5ReflectionHost(isCore, program.getTypeChecker());
                default:
                    throw new Error("Relection host for \"" + format + "\" not yet implemented.");
            }
        };
        Transformer.prototype.getRenderer = function (format, program, host, bundle, transformDts) {
            switch (format) {
                case 'esm2015':
                case 'fesm2015':
                    return new esm_renderer_1.EsmRenderer(host, bundle, this.sourcePath, this.targetPath, transformDts);
                case 'esm5':
                case 'fesm5':
                    return new esm5_renderer_1.Esm5Renderer(host, bundle, this.sourcePath, this.targetPath, transformDts);
                default:
                    throw new Error("Renderer for \"" + format + "\" not yet implemented.");
            }
        };
        Transformer.prototype.analyzeProgram = function (program, reflectionHost, rootDirs, isCore) {
            var decorationAnalyzer = new decoration_analyzer_1.DecorationAnalyzer(program.getTypeChecker(), reflectionHost, rootDirs, isCore);
            var switchMarkerAnalyzer = new switch_marker_analyzer_1.SwitchMarkerAnalyzer(reflectionHost);
            return {
                decorationAnalyses: decorationAnalyzer.analyzeProgram(program),
                switchMarkerAnalyses: switchMarkerAnalyzer.analyzeProgram(program),
            };
        };
        Transformer.prototype.writeFile = function (file) {
            shelljs_1.mkdir('-p', canonical_path_1.dirname(file.path));
            var backPath = file.path + '.bak';
            if (fs_1.existsSync(file.path) && !fs_1.existsSync(backPath)) {
                shelljs_1.mv(file.path, backPath);
            }
            fs_1.writeFileSync(file.path, file.contents, 'utf8');
        };
        Transformer.prototype.findR3SymbolsPath = function (directory, fileName) {
            var e_1, _a;
            var r3SymbolsFilePath = canonical_path_1.resolve(directory, fileName);
            if (fs_1.existsSync(r3SymbolsFilePath)) {
                return r3SymbolsFilePath;
            }
            var subDirectories = fs_1.readdirSync(directory)
                // Not interested in hidden files
                .filter(function (p) { return !p.startsWith('.'); })
                // Ignore node_modules
                .filter(function (p) { return p !== 'node_modules'; })
                // Only interested in directories (and only those that are not symlinks)
                .filter(function (p) {
                var stat = fs_1.lstatSync(canonical_path_1.resolve(directory, p));
                return stat.isDirectory() && !stat.isSymbolicLink();
            });
            try {
                for (var subDirectories_1 = tslib_1.__values(subDirectories), subDirectories_1_1 = subDirectories_1.next(); !subDirectories_1_1.done; subDirectories_1_1 = subDirectories_1.next()) {
                    var subDirectory = subDirectories_1_1.value;
                    var r3SymbolsFilePath_1 = this.findR3SymbolsPath(canonical_path_1.resolve(directory, subDirectory), fileName);
                    if (r3SymbolsFilePath_1) {
                        return r3SymbolsFilePath_1;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (subDirectories_1_1 && !subDirectories_1_1.done && (_a = subDirectories_1.return)) _a.call(subDirectories_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return null;
        };
        return Transformer;
    }());
    exports.Transformer = Transformer;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3JtZXIuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25nY2Mvc3JjL3BhY2thZ2VzL3RyYW5zZm9ybWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILGlEQUFnRDtJQUNoRCx5QkFBcUU7SUFDckUsbUNBQWtDO0lBQ2xDLCtCQUFpQztJQUVqQyx1R0FBbUU7SUFDbkUsNkdBQXdFO0lBQ3hFLHFGQUEyRDtJQUMzRCwrRUFBcUQ7SUFFckQsNEZBQXdEO0lBQ3hELDBGQUFzRDtJQUd0RCx5RkFBZ0U7SUFDaEUsNkVBQXNEO0lBR3REOzs7Ozs7Ozs7Ozs7Ozs7Ozs7T0FrQkc7SUFDSDtRQUNFLHFCQUFvQixVQUFrQixFQUFVLFVBQWtCO1lBQTlDLGVBQVUsR0FBVixVQUFVLENBQVE7WUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQUcsQ0FBQztRQUV0RSwrQkFBUyxHQUFULFVBQVUsVUFBc0IsRUFBRSxNQUF3QixFQUFFLFlBQXFCO1lBQWpGLGlCQWtFQztZQWpFQyxJQUFJLDhCQUFlLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxFQUFFO2dCQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQVksVUFBVSxDQUFDLElBQUksV0FBTSxNQUFNLHNCQUFtQixDQUFDLENBQUM7Z0JBQ3pFLE9BQU87YUFDUjtZQUVELElBQU0sa0JBQWtCLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlDLElBQUksQ0FBQyxrQkFBa0IsRUFBRTtnQkFDdkIsT0FBTyxDQUFDLElBQUksQ0FDUixjQUFZLFVBQVUsQ0FBQyxJQUFJLFdBQU0sTUFBTSw0Q0FBeUMsQ0FBQyxDQUFDO2dCQUN0RixPQUFPO2FBQ1I7WUFFRCxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWEsVUFBVSxDQUFDLElBQUksV0FBTSxNQUFRLENBQUMsQ0FBQztZ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QkFBQSxpQkFBQSxjQUFjLENBQUEsOENBQUEsMEVBQUU7b0JBQXRDLElBQU0sWUFBWSwyQkFBQTtvQkFDckIsSUFBTSxtQkFBaUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsd0JBQU8sQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQzdGLElBQUksbUJBQWlCLEVBQUU7d0JBQ3JCLE9BQU8sbUJBQWlCLENBQUM7cUJBQzFCO2lCQUNGOzs7Ozs7Ozs7WUFFRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFDSCxrQkFBQztJQUFELENBQUMsQUEvSkQsSUErSkM7SUEvSlksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge2Rpcm5hbWUsIHJlc29sdmV9IGZyb20gJ2Nhbm9uaWNhbC1wYXRoJztcbmltcG9ydCB7ZXhpc3RzU3luYywgbHN0YXRTeW5jLCByZWFkZGlyU3luYywgd3JpdGVGaWxlU3luY30gZnJvbSAnZnMnO1xuaW1wb3J0IHtta2RpciwgbXZ9IGZyb20gJ3NoZWxsanMnO1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5cbmltcG9ydCB7RGVjb3JhdGlvbkFuYWx5emVyfSBmcm9tICcuLi9hbmFseXNpcy9kZWNvcmF0aW9uX2FuYWx5emVyJztcbmltcG9ydCB7U3dpdGNoTWFya2VyQW5hbHl6ZXJ9IGZyb20gJy4uL2FuYWx5c2lzL3N3aXRjaF9tYXJrZXJfYW5hbHl6ZXInO1xuaW1wb3J0IHtFc20yMDE1UmVmbGVjdGlvbkhvc3R9IGZyb20gJy4uL2hvc3QvZXNtMjAxNV9ob3N0JztcbmltcG9ydCB7RXNtNVJlZmxlY3Rpb25Ib3N0fSBmcm9tICcuLi9ob3N0L2VzbTVfaG9zdCc7XG5pbXBvcnQge05nY2NSZWZsZWN0aW9uSG9zdH0gZnJvbSAnLi4vaG9zdC9uZ2NjX2hvc3QnO1xuaW1wb3J0IHtFc201UmVuZGVyZXJ9IGZyb20gJy4uL3JlbmRlcmluZy9lc201X3JlbmRlcmVyJztcbmltcG9ydCB7RXNtUmVuZGVyZXJ9IGZyb20gJy4uL3JlbmRlcmluZy9lc21fcmVuZGVyZXInO1xuaW1wb3J0IHtGaWxlSW5mbywgUmVuZGVyZXJ9IGZyb20gJy4uL3JlbmRlcmluZy9yZW5kZXJlcic7XG5cbmltcG9ydCB7Y2hlY2tNYXJrZXJGaWxlLCB3cml0ZU1hcmtlckZpbGV9IGZyb20gJy4vYnVpbGRfbWFya2VyJztcbmltcG9ydCB7QnVuZGxlSW5mbywgY3JlYXRlQnVuZGxlSW5mb30gZnJvbSAnLi9idW5kbGUnO1xuaW1wb3J0IHtFbnRyeVBvaW50LCBFbnRyeVBvaW50Rm9ybWF0fSBmcm9tICcuL2VudHJ5X3BvaW50JztcblxuLyoqXG4gKiBBIFBhY2thZ2UgaXMgc3RvcmVkIGluIGEgZGlyZWN0b3J5IG9uIGRpc2sgYW5kIHRoYXQgZGlyZWN0b3J5IGNhbiBjb250YWluIG9uZSBvciBtb3JlIHBhY2thZ2VcbiAqIGZvcm1hdHMgLSBlLmcuIGZlc20yMDE1LCBVTUQsIGV0Yy4gQWRkaXRpb25hbGx5LCBlYWNoIHBhY2thZ2UgcHJvdmlkZXMgdHlwaW5ncyAoYC5kLnRzYCBmaWxlcykuXG4gKlxuICogRWFjaCBvZiB0aGVzZSBmb3JtYXRzIGV4cG9zZXMgb25lIG9yIG1vcmUgZW50cnkgcG9pbnRzLCB3aGljaCBhcmUgc291cmNlIGZpbGVzIHRoYXQgbmVlZCB0byBiZVxuICogcGFyc2VkIHRvIGlkZW50aWZ5IHRoZSBkZWNvcmF0ZWQgZXhwb3J0ZWQgY2xhc3NlcyB0aGF0IG5lZWQgdG8gYmUgYW5hbHl6ZWQgYW5kIGNvbXBpbGVkIGJ5IG9uZSBvclxuICogbW9yZSBgRGVjb3JhdG9ySGFuZGxlcmAgb2JqZWN0cy5cbiAqXG4gKiBFYWNoIGVudHJ5IHBvaW50IHRvIGEgcGFja2FnZSBpcyBpZGVudGlmaWVkIGJ5IGEgYFNvdXJjZUZpbGVgIHRoYXQgY2FuIGJlIHBhcnNlZCBhbmQgYW5hbHl6ZWQgdG9cbiAqIGlkZW50aWZ5IGNsYXNzZXMgdGhhdCBuZWVkIHRvIGJlIHRyYW5zZm9ybWVkOyBhbmQgdGhlbiBmaW5hbGx5IHJlbmRlcmVkIGFuZCB3cml0dGVuIHRvIGRpc2suXG4gKiBUaGUgYWN0dWFsIGZpbGUgd2hpY2ggbmVlZHMgdG8gYmUgdHJhbnNmb3JtZWQgZGVwZW5kcyB1cG9uIHRoZSBwYWNrYWdlIGZvcm1hdC5cbiAqXG4gKiBBbG9uZyB3aXRoIHRoZSBzb3VyY2UgZmlsZXMsIHRoZSBjb3JyZXNwb25kaW5nIHNvdXJjZSBtYXBzIChlaXRoZXIgaW5saW5lIG9yIGV4dGVybmFsKSBhbmRcbiAqIGAuZC50c2AgZmlsZXMgYXJlIHRyYW5zZm9ybWVkIGFjY29yZGluZ2x5LlxuICpcbiAqIC0gRmxhdCBmaWxlIHBhY2thZ2VzIGhhdmUgYWxsIHRoZSBjbGFzc2VzIGluIGEgc2luZ2xlIGZpbGUuXG4gKiAtIE90aGVyIHBhY2thZ2VzIG1heSByZS1leHBvcnQgY2xhc3NlcyBmcm9tIG90aGVyIG5vbi1lbnRyeSBwb2ludCBmaWxlcy5cbiAqIC0gU29tZSBmb3JtYXRzIG1heSBjb250YWluIG11bHRpcGxlIFwibW9kdWxlc1wiIGluIGEgc2luZ2xlIGZpbGUuXG4gKi9cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1lciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc291cmNlUGF0aDogc3RyaW5nLCBwcml2YXRlIHRhcmdldFBhdGg6IHN0cmluZykge31cblxuICB0cmFuc2Zvcm0oZW50cnlQb2ludDogRW50cnlQb2ludCwgZm9ybWF0OiBFbnRyeVBvaW50Rm9ybWF0LCB0cmFuc2Zvcm1EdHM6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAoY2hlY2tNYXJrZXJGaWxlKGVudHJ5UG9pbnQsIGZvcm1hdCkpIHtcbiAgICAgIGNvbnNvbGUud2FybihgU2tpcHBpbmcgJHtlbnRyeVBvaW50Lm5hbWV9IDogJHtmb3JtYXR9IChhbHJlYWR5IGJ1aWx0KS5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBlbnRyeVBvaW50RmlsZVBhdGggPSBlbnRyeVBvaW50W2Zvcm1hdF07XG4gICAgaWYgKCFlbnRyeVBvaW50RmlsZVBhdGgpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBgU2tpcHBpbmcgJHtlbnRyeVBvaW50Lm5hbWV9IDogJHtmb3JtYXR9IChubyBlbnRyeSBwb2ludCBmaWxlIGZvciB0aGlzIGZvcm1hdCkuYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc29sZS53YXJuKGBDb21waWxpbmcgJHtlbnRyeVBvaW50Lm5hbWV9IC0gJHtmb3JtYXR9YCk7XG5cbiAgICBjb25zdCBvcHRpb25zOiB0cy5Db21waWxlck9wdGlvbnMgPSB7XG4gICAgICBhbGxvd0pzOiB0cnVlLFxuICAgICAgbWF4Tm9kZU1vZHVsZUpzRGVwdGg6IEluZmluaXR5LFxuICAgICAgcm9vdERpcjogZW50cnlQb2ludC5wYXRoLFxuICAgIH07XG5cbiAgICAvLyBDcmVhdGUgdGhlIFRTIHByb2dyYW0gYW5kIG5lY2Vzc2FyeSBoZWxwZXJzLlxuICAgIC8vIFRPRE8gOiBjcmVhdGUgYSBjdXN0b20gY29tcGlsZXIgaG9zdCB0aGF0IHJlYWRzIGZyb20gLmJhayBmaWxlcyBpZiBhdmFpbGFibGUuXG4gICAgY29uc3QgaG9zdCA9IHRzLmNyZWF0ZUNvbXBpbGVySG9zdChvcHRpb25zKTtcbiAgICBjb25zdCByb290RGlycyA9IHRoaXMuZ2V0Um9vdERpcnMoaG9zdCwgb3B0aW9ucyk7XG4gICAgY29uc3QgaXNDb3JlID0gZW50cnlQb2ludC5uYW1lID09PSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgY29uc3QgcjNTeW1ib2xzUGF0aCA9XG4gICAgICAgIGlzQ29yZSA/IHRoaXMuZmluZFIzU3ltYm9sc1BhdGgoZGlybmFtZShlbnRyeVBvaW50RmlsZVBhdGgpLCAncjNfc3ltYm9scy5qcycpIDogbnVsbDtcbiAgICBjb25zdCByb290UGF0aHMgPSByM1N5bWJvbHNQYXRoID8gW2VudHJ5UG9pbnRGaWxlUGF0aCwgcjNTeW1ib2xzUGF0aF0gOiBbZW50cnlQb2ludEZpbGVQYXRoXTtcbiAgICBjb25zdCBwYWNrYWdlUHJvZ3JhbSA9IHRzLmNyZWF0ZVByb2dyYW0ocm9vdFBhdGhzLCBvcHRpb25zLCBob3N0KTtcbiAgICBjb25zdCByM1N5bWJvbHNGaWxlID0gcjNTeW1ib2xzUGF0aCAmJiBwYWNrYWdlUHJvZ3JhbS5nZXRTb3VyY2VGaWxlKHIzU3ltYm9sc1BhdGgpIHx8IG51bGw7XG5cbiAgICAvLyBDcmVhdGUgdGhlIHByb2dyYW0gZm9yIHByb2Nlc3NpbmcgRFRTIGZpbGVzIGlmIGVuYWJsZWQgZm9yIHRoaXMgZm9ybWF0LlxuICAgIGNvbnN0IGR0c0ZpbGVQYXRoID0gZW50cnlQb2ludC50eXBpbmdzO1xuICAgIGxldCBkdHNQcm9ncmFtOiB0cy5Qcm9ncmFtfG51bGwgPSBudWxsO1xuICAgIGxldCByM1N5bWJvbHNEdHNGaWxlOiB0cy5Tb3VyY2VGaWxlfG51bGwgPSBudWxsO1xuICAgIGlmICh0cmFuc2Zvcm1EdHMpIHtcbiAgICAgIGNvbnNvbGUudGltZShgJHtlbnRyeVBvaW50Lm5hbWV9IChkdHNNYXBwZXIgY3JlYXRpb24pYCk7XG4gICAgICBjb25zdCByM1N5bWJvbHNEdHNQYXRoID1cbiAgICAgICAgICBpc0NvcmUgPyB0aGlzLmZpbmRSM1N5bWJvbHNQYXRoKGRpcm5hbWUoZHRzRmlsZVBhdGgpLCAncjNfc3ltYm9scy5kLnRzJykgOiBudWxsO1xuICAgICAgY29uc3Qgcm9vdER0c1BhdGhzID0gcjNTeW1ib2xzRHRzUGF0aCA/IFtkdHNGaWxlUGF0aCwgcjNTeW1ib2xzRHRzUGF0aF0gOiBbZHRzRmlsZVBhdGhdO1xuXG4gICAgICBkdHNQcm9ncmFtID0gdHMuY3JlYXRlUHJvZ3JhbShyb290RHRzUGF0aHMsIG9wdGlvbnMsIGhvc3QpO1xuICAgICAgcjNTeW1ib2xzRHRzRmlsZSA9IHIzU3ltYm9sc0R0c1BhdGggJiYgZHRzUHJvZ3JhbS5nZXRTb3VyY2VGaWxlKHIzU3ltYm9sc0R0c1BhdGgpIHx8IG51bGw7XG4gICAgICBjb25zb2xlLnRpbWVFbmQoYCR7ZW50cnlQb2ludC5uYW1lfSAoZHRzTWFwcGVyIGNyZWF0aW9uKWApO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1bmRsZSA9IGNyZWF0ZUJ1bmRsZUluZm8oaXNDb3JlLCByM1N5bWJvbHNGaWxlLCByM1N5bWJvbHNEdHNGaWxlKTtcbiAgICBjb25zdCByZWZsZWN0aW9uSG9zdCA9IHRoaXMuZ2V0SG9zdChpc0NvcmUsIGZvcm1hdCwgcGFja2FnZVByb2dyYW0sIGR0c0ZpbGVQYXRoLCBkdHNQcm9ncmFtKTtcblxuICAgIC8vIFBhcnNlIGFuZCBhbmFseXplIHRoZSBmaWxlcy5cbiAgICBjb25zdCB7ZGVjb3JhdGlvbkFuYWx5c2VzLCBzd2l0Y2hNYXJrZXJBbmFseXNlc30gPVxuICAgICAgICB0aGlzLmFuYWx5emVQcm9ncmFtKHBhY2thZ2VQcm9ncmFtLCByZWZsZWN0aW9uSG9zdCwgcm9vdERpcnMsIGlzQ29yZSk7XG5cbiAgICBjb25zb2xlLnRpbWUoYCR7ZW50cnlQb2ludC5uYW1lfSAocmVuZGVyaW5nKWApO1xuICAgIC8vIFRyYW5zZm9ybSB0aGUgc291cmNlIGZpbGVzIGFuZCBzb3VyY2UgbWFwcy5cbiAgICBjb25zdCByZW5kZXJlciA9IHRoaXMuZ2V0UmVuZGVyZXIoZm9ybWF0LCBwYWNrYWdlUHJvZ3JhbSwgcmVmbGVjdGlvbkhvc3QsIGJ1bmRsZSwgdHJhbnNmb3JtRHRzKTtcbiAgICBjb25zdCByZW5kZXJlZEZpbGVzID1cbiAgICAgICAgcmVuZGVyZXIucmVuZGVyUHJvZ3JhbShwYWNrYWdlUHJvZ3JhbSwgZGVjb3JhdGlvbkFuYWx5c2VzLCBzd2l0Y2hNYXJrZXJBbmFseXNlcyk7XG4gICAgY29uc29sZS50aW1lRW5kKGAke2VudHJ5UG9pbnQubmFtZX0gKHJlbmRlcmluZylgKTtcblxuICAgIC8vIFdyaXRlIG91dCBhbGwgdGhlIHRyYW5zZm9ybWVkIGZpbGVzLlxuICAgIHJlbmRlcmVkRmlsZXMuZm9yRWFjaChmaWxlID0+IHRoaXMud3JpdGVGaWxlKGZpbGUpKTtcblxuICAgIC8vIFdyaXRlIHRoZSBidWlsdC13aXRoLW5nY2MgbWFya2VyXG4gICAgd3JpdGVNYXJrZXJGaWxlKGVudHJ5UG9pbnQsIGZvcm1hdCk7XG4gIH1cblxuICBnZXRSb290RGlycyhob3N0OiB0cy5Db21waWxlckhvc3QsIG9wdGlvbnM6IHRzLkNvbXBpbGVyT3B0aW9ucykge1xuICAgIGlmIChvcHRpb25zLnJvb3REaXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLnJvb3REaXJzO1xuICAgIH0gZWxzZSBpZiAob3B0aW9ucy5yb290RGlyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBbb3B0aW9ucy5yb290RGlyXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFtob3N0LmdldEN1cnJlbnREaXJlY3RvcnkoKV07XG4gICAgfVxuICB9XG5cbiAgZ2V0SG9zdChcbiAgICAgIGlzQ29yZTogYm9vbGVhbiwgZm9ybWF0OiBzdHJpbmcsIHByb2dyYW06IHRzLlByb2dyYW0sIGR0c0ZpbGVQYXRoOiBzdHJpbmcsXG4gICAgICBkdHNQcm9ncmFtOiB0cy5Qcm9ncmFtfG51bGwpOiBOZ2NjUmVmbGVjdGlvbkhvc3Qge1xuICAgIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgICBjYXNlICdlc20yMDE1JzpcbiAgICAgIGNhc2UgJ2Zlc20yMDE1JzpcbiAgICAgICAgcmV0dXJuIG5ldyBFc20yMDE1UmVmbGVjdGlvbkhvc3QoaXNDb3JlLCBwcm9ncmFtLmdldFR5cGVDaGVja2VyKCksIGR0c0ZpbGVQYXRoLCBkdHNQcm9ncmFtKTtcbiAgICAgIGNhc2UgJ2VzbTUnOlxuICAgICAgY2FzZSAnZmVzbTUnOlxuICAgICAgICByZXR1cm4gbmV3IEVzbTVSZWZsZWN0aW9uSG9zdChpc0NvcmUsIHByb2dyYW0uZ2V0VHlwZUNoZWNrZXIoKSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFJlbGVjdGlvbiBob3N0IGZvciBcIiR7Zm9ybWF0fVwiIG5vdCB5ZXQgaW1wbGVtZW50ZWQuYCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0UmVuZGVyZXIoXG4gICAgICBmb3JtYXQ6IHN0cmluZywgcHJvZ3JhbTogdHMuUHJvZ3JhbSwgaG9zdDogTmdjY1JlZmxlY3Rpb25Ib3N0LCBidW5kbGU6IEJ1bmRsZUluZm8sXG4gICAgICB0cmFuc2Zvcm1EdHM6IGJvb2xlYW4pOiBSZW5kZXJlciB7XG4gICAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICAgIGNhc2UgJ2VzbTIwMTUnOlxuICAgICAgY2FzZSAnZmVzbTIwMTUnOlxuICAgICAgICByZXR1cm4gbmV3IEVzbVJlbmRlcmVyKGhvc3QsIGJ1bmRsZSwgdGhpcy5zb3VyY2VQYXRoLCB0aGlzLnRhcmdldFBhdGgsIHRyYW5zZm9ybUR0cyk7XG4gICAgICBjYXNlICdlc201JzpcbiAgICAgIGNhc2UgJ2Zlc201JzpcbiAgICAgICAgcmV0dXJuIG5ldyBFc201UmVuZGVyZXIoaG9zdCwgYnVuZGxlLCB0aGlzLnNvdXJjZVBhdGgsIHRoaXMudGFyZ2V0UGF0aCwgdHJhbnNmb3JtRHRzKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgUmVuZGVyZXIgZm9yIFwiJHtmb3JtYXR9XCIgbm90IHlldCBpbXBsZW1lbnRlZC5gKTtcbiAgICB9XG4gIH1cblxuICBhbmFseXplUHJvZ3JhbShcbiAgICAgIHByb2dyYW06IHRzLlByb2dyYW0sIHJlZmxlY3Rpb25Ib3N0OiBOZ2NjUmVmbGVjdGlvbkhvc3QsIHJvb3REaXJzOiBzdHJpbmdbXSxcbiAgICAgIGlzQ29yZTogYm9vbGVhbikge1xuICAgIGNvbnN0IGRlY29yYXRpb25BbmFseXplciA9XG4gICAgICAgIG5ldyBEZWNvcmF0aW9uQW5hbHl6ZXIocHJvZ3JhbS5nZXRUeXBlQ2hlY2tlcigpLCByZWZsZWN0aW9uSG9zdCwgcm9vdERpcnMsIGlzQ29yZSk7XG4gICAgY29uc3Qgc3dpdGNoTWFya2VyQW5hbHl6ZXIgPSBuZXcgU3dpdGNoTWFya2VyQW5hbHl6ZXIocmVmbGVjdGlvbkhvc3QpO1xuICAgIHJldHVybiB7XG4gICAgICBkZWNvcmF0aW9uQW5hbHlzZXM6IGRlY29yYXRpb25BbmFseXplci5hbmFseXplUHJvZ3JhbShwcm9ncmFtKSxcbiAgICAgIHN3aXRjaE1hcmtlckFuYWx5c2VzOiBzd2l0Y2hNYXJrZXJBbmFseXplci5hbmFseXplUHJvZ3JhbShwcm9ncmFtKSxcbiAgICB9O1xuICB9XG5cbiAgd3JpdGVGaWxlKGZpbGU6IEZpbGVJbmZvKTogdm9pZCB7XG4gICAgbWtkaXIoJy1wJywgZGlybmFtZShmaWxlLnBhdGgpKTtcbiAgICBjb25zdCBiYWNrUGF0aCA9IGZpbGUucGF0aCArICcuYmFrJztcbiAgICBpZiAoZXhpc3RzU3luYyhmaWxlLnBhdGgpICYmICFleGlzdHNTeW5jKGJhY2tQYXRoKSkge1xuICAgICAgbXYoZmlsZS5wYXRoLCBiYWNrUGF0aCk7XG4gICAgfVxuICAgIHdyaXRlRmlsZVN5bmMoZmlsZS5wYXRoLCBmaWxlLmNvbnRlbnRzLCAndXRmOCcpO1xuICB9XG5cbiAgZmluZFIzU3ltYm9sc1BhdGgoZGlyZWN0b3J5OiBzdHJpbmcsIGZpbGVOYW1lOiBzdHJpbmcpOiBzdHJpbmd8bnVsbCB7XG4gICAgY29uc3QgcjNTeW1ib2xzRmlsZVBhdGggPSByZXNvbHZlKGRpcmVjdG9yeSwgZmlsZU5hbWUpO1xuICAgIGlmIChleGlzdHNTeW5jKHIzU3ltYm9sc0ZpbGVQYXRoKSkge1xuICAgICAgcmV0dXJuIHIzU3ltYm9sc0ZpbGVQYXRoO1xuICAgIH1cblxuICAgIGNvbnN0IHN1YkRpcmVjdG9yaWVzID1cbiAgICAgICAgcmVhZGRpclN5bmMoZGlyZWN0b3J5KVxuICAgICAgICAgICAgLy8gTm90IGludGVyZXN0ZWQgaW4gaGlkZGVuIGZpbGVzXG4gICAgICAgICAgICAuZmlsdGVyKHAgPT4gIXAuc3RhcnRzV2l0aCgnLicpKVxuICAgICAgICAgICAgLy8gSWdub3JlIG5vZGVfbW9kdWxlc1xuICAgICAgICAgICAgLmZpbHRlcihwID0+IHAgIT09ICdub2RlX21vZHVsZXMnKVxuICAgICAgICAgICAgLy8gT25seSBpbnRlcmVzdGVkIGluIGRpcmVjdG9yaWVzIChhbmQgb25seSB0aG9zZSB0aGF0IGFyZSBub3Qgc3ltbGlua3MpXG4gICAgICAgICAgICAuZmlsdGVyKHAgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBzdGF0ID0gbHN0YXRTeW5jKHJlc29sdmUoZGlyZWN0b3J5LCBwKSk7XG4gICAgICAgICAgICAgIHJldHVybiBzdGF0LmlzRGlyZWN0b3J5KCkgJiYgIXN0YXQuaXNTeW1ib2xpY0xpbmsoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgZm9yIChjb25zdCBzdWJEaXJlY3Rvcnkgb2Ygc3ViRGlyZWN0b3JpZXMpIHtcbiAgICAgIGNvbnN0IHIzU3ltYm9sc0ZpbGVQYXRoID0gdGhpcy5maW5kUjNTeW1ib2xzUGF0aChyZXNvbHZlKGRpcmVjdG9yeSwgc3ViRGlyZWN0b3J5KSwgZmlsZU5hbWUpO1xuICAgICAgaWYgKHIzU3ltYm9sc0ZpbGVQYXRoKSB7XG4gICAgICAgIHJldHVybiByM1N5bWJvbHNGaWxlUGF0aDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuIl19