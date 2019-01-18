(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler-cli/src/ngcc/src/main", ["require", "exports", "canonical-path", "yargs", "@angular/compiler-cli/src/ngcc/src/packages/dependency_host", "@angular/compiler-cli/src/ngcc/src/packages/dependency_resolver", "@angular/compiler-cli/src/ngcc/src/packages/entry_point_finder", "@angular/compiler-cli/src/ngcc/src/packages/transformer"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * @license
     * Copyright Google Inc. All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var path = require("canonical-path");
    var yargs = require("yargs");
    var dependency_host_1 = require("@angular/compiler-cli/src/ngcc/src/packages/dependency_host");
    var dependency_resolver_1 = require("@angular/compiler-cli/src/ngcc/src/packages/dependency_resolver");
    var entry_point_finder_1 = require("@angular/compiler-cli/src/ngcc/src/packages/entry_point_finder");
    var transformer_1 = require("@angular/compiler-cli/src/ngcc/src/packages/transformer");
    function mainNgcc(args) {
        var options = yargs
            .option('s', {
            alias: 'source',
            describe: 'A path to the root folder to compile.',
            default: './node_modules'
        })
            .option('f', {
            alias: 'formats',
            array: true,
            describe: 'An array of formats to compile.',
            default: ['fesm2015', 'esm2015', 'fesm5', 'esm5']
        })
            .option('t', {
            alias: 'target',
            describe: 'A path to a root folder where the compiled files will be written.',
            defaultDescription: 'The `source` folder.'
        })
            .help()
            .parse(args);
        var sourcePath = path.resolve(options['s']);
        var formats = options['f'];
        var targetPath = options['t'] || sourcePath;
        var transformer = new transformer_1.Transformer(sourcePath, targetPath);
        var host = new dependency_host_1.DependencyHost();
        var resolver = new dependency_resolver_1.DependencyResolver(host);
        var finder = new entry_point_finder_1.EntryPointFinder(resolver);
        try {
            var entryPoints = finder.findEntryPoints(sourcePath).entryPoints;
            entryPoints.forEach(function (entryPoint) {
                // We transform the d.ts typings files while transforming one of the formats.
                // This variable decides with which of the available formats to do this transform.
                // It is marginally faster to process via the flat file if available.
                var dtsTranformFormat = entryPoint.fesm2015 ? 'fesm2015' : 'esm2015';
                formats.forEach(function (format) { return transformer.transform(entryPoint, format, format === dtsTranformFormat); });
            });
        }
        catch (e) {
            console.error(e.stack);
            return 1;
        }
        return 0;
    }
    exports.mainNgcc = mainNgcc;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmdjYy9zcmMvbWFpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUFBOzs7Ozs7T0FNRztJQUNILHFDQUF1QztJQUN2Qyw2QkFBK0I7SUFFL0IsK0ZBQTBEO0lBQzFELHVHQUFrRTtJQUVsRSxxR0FBK0Q7SUFDL0QsdUZBQW1EO0lBRW5ELFNBQWdCLFFBQVEsQ0FBQyxJQUFjO1FBQ3JDLElBQU0sT0FBTyxHQUNULEtBQUs7YUFDQSxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLFFBQVE7WUFDZixRQUFRLEVBQUUsdUNBQXVDO1lBQ2pELE9BQU8sRUFBRSxnQkFBZ0I7U0FDMUIsQ0FBQzthQUNELE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDWCxLQUFLLEVBQUUsU0FBUztZQUNoQixLQUFLLEVBQUUsSUFBSTtZQUNYLFFBQVEsRUFBRSxpQ0FBaUM7WUFDM0MsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO1NBQ2xELENBQUM7YUFDRCxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ1gsS0FBSyxFQUFFLFFBQVE7WUFDZixRQUFRLEVBQUUsbUVBQW1FO1lBQzdFLGtCQUFrQixFQUFFLHNCQUFzQjtTQUMzQyxDQUFDO2FBQ0QsSUFBSSxFQUFFO2FBQ04sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJCLElBQU0sVUFBVSxHQUFXLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdEQsSUFBTSxPQUFPLEdBQXVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqRCxJQUFNLFVBQVUsR0FBVyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDO1FBRXRELElBQU0sV0FBVyxHQUFHLElBQUkseUJBQVcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDNUQsSUFBTSxJQUFJLEdBQUcsSUFBSSxnQ0FBYyxFQUFFLENBQUM7UUFDbEMsSUFBTSxRQUFRLEdBQUcsSUFBSSx3Q0FBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QyxJQUFNLE1BQU0sR0FBRyxJQUFJLHFDQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTlDLElBQUk7WUFDSyxJQUFBLDREQUFXLENBQXVDO1lBQ3pELFdBQVcsQ0FBQyxPQUFPLENBQUMsVUFBQSxVQUFVO2dCQUM1Qiw2RUFBNkU7Z0JBQzdFLGtGQUFrRjtnQkFDbEYscUVBQXFFO2dCQUNyRSxJQUFNLGlCQUFpQixHQUFxQixVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDekYsT0FBTyxDQUFDLE9BQU8sQ0FDWCxVQUFBLE1BQU0sSUFBSSxPQUFBLFdBQVcsQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEtBQUssaUJBQWlCLENBQUMsRUFBdkUsQ0FBdUUsQ0FBQyxDQUFDO1lBQ3pGLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3ZCLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7UUFFRCxPQUFPLENBQUMsQ0FBQztJQUNYLENBQUM7SUEvQ0QsNEJBK0NDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdjYW5vbmljYWwtcGF0aCc7XG5pbXBvcnQgKiBhcyB5YXJncyBmcm9tICd5YXJncyc7XG5cbmltcG9ydCB7RGVwZW5kZW5jeUhvc3R9IGZyb20gJy4vcGFja2FnZXMvZGVwZW5kZW5jeV9ob3N0JztcbmltcG9ydCB7RGVwZW5kZW5jeVJlc29sdmVyfSBmcm9tICcuL3BhY2thZ2VzL2RlcGVuZGVuY3lfcmVzb2x2ZXInO1xuaW1wb3J0IHtFbnRyeVBvaW50Rm9ybWF0fSBmcm9tICcuL3BhY2thZ2VzL2VudHJ5X3BvaW50JztcbmltcG9ydCB7RW50cnlQb2ludEZpbmRlcn0gZnJvbSAnLi9wYWNrYWdlcy9lbnRyeV9wb2ludF9maW5kZXInO1xuaW1wb3J0IHtUcmFuc2Zvcm1lcn0gZnJvbSAnLi9wYWNrYWdlcy90cmFuc2Zvcm1lcic7XG5cbmV4cG9ydCBmdW5jdGlvbiBtYWluTmdjYyhhcmdzOiBzdHJpbmdbXSk6IG51bWJlciB7XG4gIGNvbnN0IG9wdGlvbnMgPVxuICAgICAgeWFyZ3NcbiAgICAgICAgICAub3B0aW9uKCdzJywge1xuICAgICAgICAgICAgYWxpYXM6ICdzb3VyY2UnLFxuICAgICAgICAgICAgZGVzY3JpYmU6ICdBIHBhdGggdG8gdGhlIHJvb3QgZm9sZGVyIHRvIGNvbXBpbGUuJyxcbiAgICAgICAgICAgIGRlZmF1bHQ6ICcuL25vZGVfbW9kdWxlcydcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5vcHRpb24oJ2YnLCB7XG4gICAgICAgICAgICBhbGlhczogJ2Zvcm1hdHMnLFxuICAgICAgICAgICAgYXJyYXk6IHRydWUsXG4gICAgICAgICAgICBkZXNjcmliZTogJ0FuIGFycmF5IG9mIGZvcm1hdHMgdG8gY29tcGlsZS4nLFxuICAgICAgICAgICAgZGVmYXVsdDogWydmZXNtMjAxNScsICdlc20yMDE1JywgJ2Zlc201JywgJ2VzbTUnXVxuICAgICAgICAgIH0pXG4gICAgICAgICAgLm9wdGlvbigndCcsIHtcbiAgICAgICAgICAgIGFsaWFzOiAndGFyZ2V0JyxcbiAgICAgICAgICAgIGRlc2NyaWJlOiAnQSBwYXRoIHRvIGEgcm9vdCBmb2xkZXIgd2hlcmUgdGhlIGNvbXBpbGVkIGZpbGVzIHdpbGwgYmUgd3JpdHRlbi4nLFxuICAgICAgICAgICAgZGVmYXVsdERlc2NyaXB0aW9uOiAnVGhlIGBzb3VyY2VgIGZvbGRlci4nXG4gICAgICAgICAgfSlcbiAgICAgICAgICAuaGVscCgpXG4gICAgICAgICAgLnBhcnNlKGFyZ3MpO1xuXG4gIGNvbnN0IHNvdXJjZVBhdGg6IHN0cmluZyA9IHBhdGgucmVzb2x2ZShvcHRpb25zWydzJ10pO1xuICBjb25zdCBmb3JtYXRzOiBFbnRyeVBvaW50Rm9ybWF0W10gPSBvcHRpb25zWydmJ107XG4gIGNvbnN0IHRhcmdldFBhdGg6IHN0cmluZyA9IG9wdGlvbnNbJ3QnXSB8fCBzb3VyY2VQYXRoO1xuXG4gIGNvbnN0IHRyYW5zZm9ybWVyID0gbmV3IFRyYW5zZm9ybWVyKHNvdXJjZVBhdGgsIHRhcmdldFBhdGgpO1xuICBjb25zdCBob3N0ID0gbmV3IERlcGVuZGVuY3lIb3N0KCk7XG4gIGNvbnN0IHJlc29sdmVyID0gbmV3IERlcGVuZGVuY3lSZXNvbHZlcihob3N0KTtcbiAgY29uc3QgZmluZGVyID0gbmV3IEVudHJ5UG9pbnRGaW5kZXIocmVzb2x2ZXIpO1xuXG4gIHRyeSB7XG4gICAgY29uc3Qge2VudHJ5UG9pbnRzfSA9IGZpbmRlci5maW5kRW50cnlQb2ludHMoc291cmNlUGF0aCk7XG4gICAgZW50cnlQb2ludHMuZm9yRWFjaChlbnRyeVBvaW50ID0+IHtcbiAgICAgIC8vIFdlIHRyYW5zZm9ybSB0aGUgZC50cyB0eXBpbmdzIGZpbGVzIHdoaWxlIHRyYW5zZm9ybWluZyBvbmUgb2YgdGhlIGZvcm1hdHMuXG4gICAgICAvLyBUaGlzIHZhcmlhYmxlIGRlY2lkZXMgd2l0aCB3aGljaCBvZiB0aGUgYXZhaWxhYmxlIGZvcm1hdHMgdG8gZG8gdGhpcyB0cmFuc2Zvcm0uXG4gICAgICAvLyBJdCBpcyBtYXJnaW5hbGx5IGZhc3RlciB0byBwcm9jZXNzIHZpYSB0aGUgZmxhdCBmaWxlIGlmIGF2YWlsYWJsZS5cbiAgICAgIGNvbnN0IGR0c1RyYW5mb3JtRm9ybWF0OiBFbnRyeVBvaW50Rm9ybWF0ID0gZW50cnlQb2ludC5mZXNtMjAxNSA/ICdmZXNtMjAxNScgOiAnZXNtMjAxNSc7XG4gICAgICBmb3JtYXRzLmZvckVhY2goXG4gICAgICAgICAgZm9ybWF0ID0+IHRyYW5zZm9ybWVyLnRyYW5zZm9ybShlbnRyeVBvaW50LCBmb3JtYXQsIGZvcm1hdCA9PT0gZHRzVHJhbmZvcm1Gb3JtYXQpKTtcbiAgICB9KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnNvbGUuZXJyb3IoZS5zdGFjayk7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICByZXR1cm4gMDtcbn1cbiJdfQ==