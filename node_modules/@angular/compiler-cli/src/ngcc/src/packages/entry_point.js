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
        define("@angular/compiler-cli/src/ngcc/src/packages/entry_point", ["require", "exports", "canonical-path", "fs"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var path = require("canonical-path");
    var fs = require("fs");
    /**
     * Parses the JSON from a package.json file.
     * @param packageJsonPath the absolute path to the package.json file.
     * @returns JSON from the package.json file if it is valid, `null` otherwise.
     */
    function loadEntryPointPackage(packageJsonPath) {
        try {
            return JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        }
        catch (e) {
            // We may have run into a package.json with unexpected symbols
            console.warn("Failed to read entry point info from " + packageJsonPath + " with error " + e + ".");
            return null;
        }
    }
    /**
     * Try to get entry point info from the given path.
     * @param pkgPath the absolute path to the containing npm package
     * @param entryPoint the absolute path to the potential entry point.
     * @returns Info about the entry point if it is valid, `null` otherwise.
     */
    function getEntryPointInfo(pkgPath, entryPoint) {
        var packageJsonPath = path.resolve(entryPoint, 'package.json');
        if (!fs.existsSync(packageJsonPath)) {
            return null;
        }
        var entryPointPackageJson = loadEntryPointPackage(packageJsonPath);
        if (!entryPointPackageJson) {
            return null;
        }
        // If there is `esm2015` then `es2015` will be FESM2015, otherwise ESM2015.
        // If there is `esm5` then `module` will be FESM5, otherwise it will be ESM5.
        var name = entryPointPackageJson.name, modulePath = entryPointPackageJson.module, types = entryPointPackageJson.types, _a = entryPointPackageJson.typings, typings = _a === void 0 ? types : _a, // synonymous
        es2015 = entryPointPackageJson.es2015, _b = entryPointPackageJson.fesm2015, fesm2015 = _b === void 0 ? es2015 : _b, // synonymous
        _c = entryPointPackageJson.fesm5, // synonymous
        fesm5 = _c === void 0 ? modulePath : _c, // synonymous
        esm2015 = entryPointPackageJson.esm2015, esm5 = entryPointPackageJson.esm5, main = entryPointPackageJson.main;
        // Minimum requirement is that we have typings and one of esm2015 or fesm2015 formats.
        if (!typings || !(fesm2015 || esm2015)) {
            return null;
        }
        // Also we need to have a metadata.json file
        var metadataPath = path.resolve(entryPoint, typings.replace(/\.d\.ts$/, '') + '.metadata.json');
        if (!fs.existsSync(metadataPath)) {
            return null;
        }
        var entryPointInfo = {
            name: name,
            package: pkgPath,
            path: entryPoint,
            typings: path.resolve(entryPoint, typings),
        };
        if (esm2015) {
            entryPointInfo.esm2015 = path.resolve(entryPoint, esm2015);
        }
        if (fesm2015) {
            entryPointInfo.fesm2015 = path.resolve(entryPoint, fesm2015);
        }
        if (fesm5) {
            entryPointInfo.fesm5 = path.resolve(entryPoint, fesm5);
        }
        if (esm5) {
            entryPointInfo.esm5 = path.resolve(entryPoint, esm5);
        }
        if (main) {
            entryPointInfo.umd = path.resolve(entryPoint, main);
        }
        return entryPointInfo;
    }
    exports.getEntryPointInfo = getEntryPointInfo;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnlfcG9pbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9jb21waWxlci1jbGkvc3JjL25nY2Mvc3JjL3BhY2thZ2VzL2VudHJ5X3BvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBRUgscUNBQXVDO0lBQ3ZDLHVCQUF5QjtJQTJDekI7Ozs7T0FJRztJQUNILFNBQVMscUJBQXFCLENBQUMsZUFBdUI7UUFDcEQsSUFBSTtZQUNGLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQzdEO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDViw4REFBOEQ7WUFDOUQsT0FBTyxDQUFDLElBQUksQ0FBQywwQ0FBd0MsZUFBZSxvQkFBZSxDQUFDLE1BQUcsQ0FBQyxDQUFDO1lBQ3pGLE9BQU8sSUFBSSxDQUFDO1NBQ2I7SUFDSCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxTQUFnQixpQkFBaUIsQ0FBQyxPQUFlLEVBQUUsVUFBa0I7UUFDbkUsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDbkMsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQU0scUJBQXFCLEdBQUcscUJBQXFCLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDckUsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzFCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCwyRUFBMkU7UUFDM0UsNkVBQTZFO1FBRTNFLElBQUEsaUNBQUksRUFDSix5Q0FBa0IsRUFDbEIsbUNBQUssRUFDTCxrQ0FBZSxFQUFmLG9DQUFlLEVBQUcsYUFBYTtRQUMvQixxQ0FBTSxFQUNOLG1DQUFpQixFQUFqQixzQ0FBaUIsRUFBSSxhQUFhO1FBQ2xDLGdDQUFrQixFQURHLGFBQWE7UUFDbEMsdUNBQWtCLEVBQUcsYUFBYTtRQUNsQyx1Q0FBTyxFQUNQLGlDQUFJLEVBQ0osaUNBQUksQ0FDb0I7UUFDMUIsc0ZBQXNGO1FBQ3RGLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxDQUFDLFFBQVEsSUFBSSxPQUFPLENBQUMsRUFBRTtZQUN0QyxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsNENBQTRDO1FBQzVDLElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxHQUFHLGdCQUFnQixDQUFDLENBQUM7UUFDbEcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLEVBQUU7WUFDaEMsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQU0sY0FBYyxHQUFlO1lBQ2pDLElBQUksTUFBQTtZQUNKLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLElBQUksRUFBRSxVQUFVO1lBQ2hCLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUM7U0FDM0MsQ0FBQztRQUVGLElBQUksT0FBTyxFQUFFO1lBQ1gsY0FBYyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM1RDtRQUNELElBQUksUUFBUSxFQUFFO1lBQ1osY0FBYyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM5RDtRQUNELElBQUksS0FBSyxFQUFFO1lBQ1QsY0FBYyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN4RDtRQUNELElBQUksSUFBSSxFQUFFO1lBQ1IsY0FBYyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN0RDtRQUNELElBQUksSUFBSSxFQUFFO1lBQ1IsY0FBYyxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNyRDtRQUVELE9BQU8sY0FBYyxDQUFDO0lBQ3hCLENBQUM7SUE1REQsOENBNERDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ2Nhbm9uaWNhbC1wYXRoJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcblxuXG4vKipcbiAqIFRoZSBwb3NzaWJsZSB2YWx1ZXMgZm9yIHRoZSBmb3JtYXQgb2YgYW4gZW50cnktcG9pbnQuXG4gKi9cbmV4cG9ydCB0eXBlIEVudHJ5UG9pbnRGb3JtYXQgPSAnZXNtNScgfCAnZmVzbTUnIHwgJ2VzbTIwMTUnIHwgJ2Zlc20yMDE1JyB8ICd1bWQnO1xuXG4vKipcbiAqIEFuIG9iamVjdCBjb250YWluaW5nIHBhdGhzIHRvIHRoZSBlbnRyeS1wb2ludHMgZm9yIGVhY2ggZm9ybWF0LlxuICovXG5leHBvcnQgdHlwZSBFbnRyeVBvaW50UGF0aHMgPSB7XG4gIFtGb3JtYXQgaW4gRW50cnlQb2ludEZvcm1hdF0/OiBzdHJpbmc7XG59O1xuXG4vKipcbiAqIEFuIG9iamVjdCBjb250YWluaW5nIGluZm9ybWF0aW9uIGFib3V0IGFuIGVudHJ5LXBvaW50LCBpbmNsdWRpbmcgcGF0aHNcbiAqIHRvIGVhY2ggb2YgdGhlIHBvc3NpYmxlIGVudHJ5LXBvaW50IGZvcm1hdHMuXG4gKi9cbmV4cG9ydCB0eXBlIEVudHJ5UG9pbnQgPSBFbnRyeVBvaW50UGF0aHMgJiB7XG4gIC8qKiBUaGUgbmFtZSBvZiB0aGUgcGFja2FnZSAoZS5nLiBgQGFuZ3VsYXIvY29yZWApLiAqL1xuICBuYW1lOiBzdHJpbmc7XG4gIC8qKiBUaGUgcGF0aCB0byB0aGUgcGFja2FnZSB0aGF0IGNvbnRhaW5zIHRoaXMgZW50cnktcG9pbnQuICovXG4gIHBhY2thZ2U6IHN0cmluZztcbiAgLyoqIFRoZSBwYXRoIHRvIHRoaXMgZW50cnkgcG9pbnQuICovXG4gIHBhdGg6IHN0cmluZztcbiAgLyoqIFRoZSBwYXRoIHRvIGEgdHlwaW5ncyAoLmQudHMpIGZpbGUgZm9yIHRoaXMgZW50cnktcG9pbnQuICovXG4gIHR5cGluZ3M6IHN0cmluZztcbn07XG5cbmludGVyZmFjZSBFbnRyeVBvaW50UGFja2FnZUpzb24ge1xuICBuYW1lOiBzdHJpbmc7XG4gIGZlc20yMDE1Pzogc3RyaW5nO1xuICBmZXNtNT86IHN0cmluZztcbiAgZXMyMDE1Pzogc3RyaW5nOyAgLy8gaWYgZXhpc3RzIHRoZW4gaXQgaXMgYWN0dWFsbHkgRkVTTTIwMTVcbiAgZXNtMjAxNT86IHN0cmluZztcbiAgZXNtNT86IHN0cmluZztcbiAgbWFpbj86IHN0cmluZzsgICAgIC8vIFVNRFxuICBtb2R1bGU/OiBzdHJpbmc7ICAgLy8gaWYgZXhpc3RzIHRoZW4gaXQgaXMgYWN0dWFsbHkgRkVTTTVcbiAgdHlwZXM/OiBzdHJpbmc7ICAgIC8vIFN5bm9ueW1vdXMgdG8gYHR5cGluZ3NgIHByb3BlcnR5IC0gc2VlIGh0dHBzOi8vYml0Lmx5LzJPZ1dwMkhcbiAgdHlwaW5ncz86IHN0cmluZzsgIC8vIFR5cGVTY3JpcHQgLmQudHMgZmlsZXNcbn1cblxuLyoqXG4gKiBQYXJzZXMgdGhlIEpTT04gZnJvbSBhIHBhY2thZ2UuanNvbiBmaWxlLlxuICogQHBhcmFtIHBhY2thZ2VKc29uUGF0aCB0aGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgcGFja2FnZS5qc29uIGZpbGUuXG4gKiBAcmV0dXJucyBKU09OIGZyb20gdGhlIHBhY2thZ2UuanNvbiBmaWxlIGlmIGl0IGlzIHZhbGlkLCBgbnVsbGAgb3RoZXJ3aXNlLlxuICovXG5mdW5jdGlvbiBsb2FkRW50cnlQb2ludFBhY2thZ2UocGFja2FnZUpzb25QYXRoOiBzdHJpbmcpOiB7W2tleTogc3RyaW5nXTogYW55fXxudWxsIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZShmcy5yZWFkRmlsZVN5bmMocGFja2FnZUpzb25QYXRoLCAndXRmOCcpKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIFdlIG1heSBoYXZlIHJ1biBpbnRvIGEgcGFja2FnZS5qc29uIHdpdGggdW5leHBlY3RlZCBzeW1ib2xzXG4gICAgY29uc29sZS53YXJuKGBGYWlsZWQgdG8gcmVhZCBlbnRyeSBwb2ludCBpbmZvIGZyb20gJHtwYWNrYWdlSnNvblBhdGh9IHdpdGggZXJyb3IgJHtlfS5gKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG4vKipcbiAqIFRyeSB0byBnZXQgZW50cnkgcG9pbnQgaW5mbyBmcm9tIHRoZSBnaXZlbiBwYXRoLlxuICogQHBhcmFtIHBrZ1BhdGggdGhlIGFic29sdXRlIHBhdGggdG8gdGhlIGNvbnRhaW5pbmcgbnBtIHBhY2thZ2VcbiAqIEBwYXJhbSBlbnRyeVBvaW50IHRoZSBhYnNvbHV0ZSBwYXRoIHRvIHRoZSBwb3RlbnRpYWwgZW50cnkgcG9pbnQuXG4gKiBAcmV0dXJucyBJbmZvIGFib3V0IHRoZSBlbnRyeSBwb2ludCBpZiBpdCBpcyB2YWxpZCwgYG51bGxgIG90aGVyd2lzZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEVudHJ5UG9pbnRJbmZvKHBrZ1BhdGg6IHN0cmluZywgZW50cnlQb2ludDogc3RyaW5nKTogRW50cnlQb2ludHxudWxsIHtcbiAgY29uc3QgcGFja2FnZUpzb25QYXRoID0gcGF0aC5yZXNvbHZlKGVudHJ5UG9pbnQsICdwYWNrYWdlLmpzb24nKTtcbiAgaWYgKCFmcy5leGlzdHNTeW5jKHBhY2thZ2VKc29uUGF0aCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGVudHJ5UG9pbnRQYWNrYWdlSnNvbiA9IGxvYWRFbnRyeVBvaW50UGFja2FnZShwYWNrYWdlSnNvblBhdGgpO1xuICBpZiAoIWVudHJ5UG9pbnRQYWNrYWdlSnNvbikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gSWYgdGhlcmUgaXMgYGVzbTIwMTVgIHRoZW4gYGVzMjAxNWAgd2lsbCBiZSBGRVNNMjAxNSwgb3RoZXJ3aXNlIEVTTTIwMTUuXG4gIC8vIElmIHRoZXJlIGlzIGBlc201YCB0aGVuIGBtb2R1bGVgIHdpbGwgYmUgRkVTTTUsIG90aGVyd2lzZSBpdCB3aWxsIGJlIEVTTTUuXG4gIGNvbnN0IHtcbiAgICBuYW1lLFxuICAgIG1vZHVsZTogbW9kdWxlUGF0aCxcbiAgICB0eXBlcyxcbiAgICB0eXBpbmdzID0gdHlwZXMsICAvLyBzeW5vbnltb3VzXG4gICAgZXMyMDE1LFxuICAgIGZlc20yMDE1ID0gZXMyMDE1LCAgIC8vIHN5bm9ueW1vdXNcbiAgICBmZXNtNSA9IG1vZHVsZVBhdGgsICAvLyBzeW5vbnltb3VzXG4gICAgZXNtMjAxNSxcbiAgICBlc201LFxuICAgIG1haW5cbiAgfSA9IGVudHJ5UG9pbnRQYWNrYWdlSnNvbjtcbiAgLy8gTWluaW11bSByZXF1aXJlbWVudCBpcyB0aGF0IHdlIGhhdmUgdHlwaW5ncyBhbmQgb25lIG9mIGVzbTIwMTUgb3IgZmVzbTIwMTUgZm9ybWF0cy5cbiAgaWYgKCF0eXBpbmdzIHx8ICEoZmVzbTIwMTUgfHwgZXNtMjAxNSkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8vIEFsc28gd2UgbmVlZCB0byBoYXZlIGEgbWV0YWRhdGEuanNvbiBmaWxlXG4gIGNvbnN0IG1ldGFkYXRhUGF0aCA9IHBhdGgucmVzb2x2ZShlbnRyeVBvaW50LCB0eXBpbmdzLnJlcGxhY2UoL1xcLmRcXC50cyQvLCAnJykgKyAnLm1ldGFkYXRhLmpzb24nKTtcbiAgaWYgKCFmcy5leGlzdHNTeW5jKG1ldGFkYXRhUGF0aCkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGVudHJ5UG9pbnRJbmZvOiBFbnRyeVBvaW50ID0ge1xuICAgIG5hbWUsXG4gICAgcGFja2FnZTogcGtnUGF0aCxcbiAgICBwYXRoOiBlbnRyeVBvaW50LFxuICAgIHR5cGluZ3M6IHBhdGgucmVzb2x2ZShlbnRyeVBvaW50LCB0eXBpbmdzKSxcbiAgfTtcblxuICBpZiAoZXNtMjAxNSkge1xuICAgIGVudHJ5UG9pbnRJbmZvLmVzbTIwMTUgPSBwYXRoLnJlc29sdmUoZW50cnlQb2ludCwgZXNtMjAxNSk7XG4gIH1cbiAgaWYgKGZlc20yMDE1KSB7XG4gICAgZW50cnlQb2ludEluZm8uZmVzbTIwMTUgPSBwYXRoLnJlc29sdmUoZW50cnlQb2ludCwgZmVzbTIwMTUpO1xuICB9XG4gIGlmIChmZXNtNSkge1xuICAgIGVudHJ5UG9pbnRJbmZvLmZlc201ID0gcGF0aC5yZXNvbHZlKGVudHJ5UG9pbnQsIGZlc201KTtcbiAgfVxuICBpZiAoZXNtNSkge1xuICAgIGVudHJ5UG9pbnRJbmZvLmVzbTUgPSBwYXRoLnJlc29sdmUoZW50cnlQb2ludCwgZXNtNSk7XG4gIH1cbiAgaWYgKG1haW4pIHtcbiAgICBlbnRyeVBvaW50SW5mby51bWQgPSBwYXRoLnJlc29sdmUoZW50cnlQb2ludCwgbWFpbik7XG4gIH1cblxuICByZXR1cm4gZW50cnlQb2ludEluZm87XG59XG4iXX0=