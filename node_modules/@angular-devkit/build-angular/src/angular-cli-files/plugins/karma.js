"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable
// TODO: cleanup this file, it's copied as is from Angular CLI.
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const webpackDevMiddleware = require('webpack-dev-middleware');
const karma_webpack_failure_cb_1 = require("./karma-webpack-failure-cb");
const stats_1 = require("../utilities/stats");
const stats_2 = require("../models/webpack-configs/stats");
const node_1 = require("@angular-devkit/core/node");
/**
 * Enumerate needed (but not require/imported) dependencies from this file
 *  to let the dependency validator know they are used.
 *
 * require('source-map-support')
 * require('karma-source-map-support')
 */
let blocked = [];
let isBlocked = false;
let webpackMiddleware;
let successCb;
let failureCb;
// Add files to the Karma files array.
function addKarmaFiles(files, newFiles, prepend = false) {
    const defaults = {
        included: true,
        served: true,
        watched: true
    };
    const processedFiles = newFiles
        // Remove globs that do not match any files, otherwise Karma will show a warning for these.
        .filter(file => glob.sync(file.pattern, { nodir: true }).length != 0)
        // Fill in pattern properties with defaults.
        .map(file => (Object.assign({}, defaults, file)));
    // It's important to not replace the array, because
    // karma already has a reference to the existing array.
    if (prepend) {
        files.unshift(...processedFiles);
    }
    else {
        files.push(...processedFiles);
    }
}
const init = (config, emitter, customFileHandlers) => {
    if (!config.buildWebpack) {
        throw new Error(`The '@angular-devkit/build-angular/plugins/karma' karma plugin is meant to` +
            ` be used from within Angular CLI and will not work correctly outside of it.`);
    }
    const options = config.buildWebpack.options;
    const logger = config.buildWebpack.logger || node_1.createConsoleLogger();
    successCb = config.buildWebpack.successCb;
    failureCb = config.buildWebpack.failureCb;
    config.reporters.unshift('@angular-devkit/build-angular--event-reporter');
    // When using code-coverage, auto-add coverage-istanbul.
    config.reporters = config.reporters || [];
    if (options.codeCoverage && config.reporters.indexOf('coverage-istanbul') === -1) {
        config.reporters.unshift('coverage-istanbul');
    }
    // Add a reporter that fixes sourcemap urls.
    if (options.sourceMap) {
        config.reporters.unshift('@angular-devkit/build-angular--sourcemap-reporter');
        // Code taken from https://github.com/tschaub/karma-source-map-support.
        // We can't use it directly because we need to add it conditionally in this file, and karma
        // frameworks cannot be added dynamically.
        const smsPath = path.dirname(require.resolve('source-map-support'));
        const ksmsPath = path.dirname(require.resolve('karma-source-map-support'));
        addKarmaFiles(config.files, [
            { pattern: path.join(smsPath, 'browser-source-map-support.js'), watched: false },
            { pattern: path.join(ksmsPath, 'client.js'), watched: false }
        ], true);
    }
    // Add webpack config.
    const webpackConfig = config.buildWebpack.webpackConfig;
    const webpackMiddlewareConfig = {
        // Hide webpack output because its noisy.
        logLevel: 'error',
        stats: false,
        watchOptions: { poll: options.poll },
        publicPath: '/_karma_webpack_/',
    };
    const compilationErrorCb = (error, errors) => {
        // Notify potential listeners of the compile error
        emitter.emit('compile_error', errors);
        // Finish Karma run early in case of compilation error.
        emitter.emit('run_complete', [], { exitCode: 1 });
        // Unblock any karma requests (potentially started using `karma run`)
        unblock();
    };
    webpackConfig.plugins.push(new karma_webpack_failure_cb_1.KarmaWebpackFailureCb(compilationErrorCb));
    // Use existing config if any.
    config.webpack = Object.assign(webpackConfig, config.webpack);
    config.webpackMiddleware = Object.assign(webpackMiddlewareConfig, config.webpackMiddleware);
    // Our custom context and debug files list the webpack bundles directly instead of using
    // the karma files array.
    config.customContextFile = `${__dirname}/karma-context.html`;
    config.customDebugFile = `${__dirname}/karma-debug.html`;
    // Add the request blocker and the webpack server fallback.
    config.beforeMiddleware = config.beforeMiddleware || [];
    config.beforeMiddleware.push('@angular-devkit/build-angular--blocker');
    config.middleware = config.middleware || [];
    config.middleware.push('@angular-devkit/build-angular--fallback');
    // The webpack tier owns the watch behavior so we want to force it in the config.
    webpackConfig.watch = !config.singleRun;
    if (config.singleRun) {
        // There's no option to turn off file watching in webpack-dev-server, but
        // we can override the file watcher instead.
        webpackConfig.plugins.unshift({
            apply: (compiler) => {
                compiler.hooks.afterEnvironment.tap('karma', () => {
                    compiler.watchFileSystem = { watch: () => { } };
                });
            },
        });
    }
    // Files need to be served from a custom path for Karma.
    webpackConfig.output.path = '/_karma_webpack_/';
    webpackConfig.output.publicPath = '/_karma_webpack_/';
    webpackConfig.output.devtoolModuleFilenameTemplate = '[namespace]/[resource-path]?[loaders]';
    let compiler;
    try {
        compiler = webpack(webpackConfig);
    }
    catch (e) {
        logger.error(e.stack || e);
        if (e.details) {
            logger.error(e.details);
        }
        throw e;
    }
    function handler(callback) {
        isBlocked = true;
        if (typeof callback === 'function') {
            callback();
        }
    }
    compiler.hooks.invalid.tap('karma', () => handler());
    compiler.hooks.watchRun.tapAsync('karma', (_, callback) => handler(callback));
    compiler.hooks.run.tapAsync('karma', (_, callback) => handler(callback));
    function unblock() {
        isBlocked = false;
        blocked.forEach((cb) => cb());
        blocked = [];
    }
    let lastCompilationHash;
    const statsConfig = stats_2.getWebpackStatsConfig();
    compiler.hooks.done.tap('karma', (stats) => {
        if (stats.compilation.errors.length > 0) {
            const json = stats.toJson(config.stats);
            // Print compilation errors.
            logger.error(stats_1.statsErrorsToString(json, statsConfig));
            lastCompilationHash = undefined;
            // Emit a failure build event if there are compilation errors.
            failureCb && failureCb();
        }
        else if (stats.hash != lastCompilationHash) {
            // Refresh karma only when there are no webpack errors, and if the compilation changed.
            lastCompilationHash = stats.hash;
            emitter.refreshFiles();
        }
        unblock();
    });
    webpackMiddleware = new webpackDevMiddleware(compiler, webpackMiddlewareConfig);
    // Forward requests to webpack server.
    customFileHandlers.push({
        urlRegex: /^\/_karma_webpack_\/.*/,
        handler: function handler(req, res) {
            webpackMiddleware(req, res, function () {
                // Ensure script and style bundles are served.
                // They are mentioned in the custom karma context page and we don't want them to 404.
                const alwaysServe = [
                    '/_karma_webpack_/runtime.js',
                    '/_karma_webpack_/polyfills.js',
                    '/_karma_webpack_/scripts.js',
                    '/_karma_webpack_/styles.js',
                    '/_karma_webpack_/vendor.js',
                ];
                if (alwaysServe.indexOf(req.url) != -1) {
                    res.statusCode = 200;
                    res.end();
                }
                else {
                    res.statusCode = 404;
                    res.end('Not found');
                }
            });
        }
    });
    emitter.on('exit', (done) => {
        webpackMiddleware.close();
        done();
    });
};
init.$inject = ['config', 'emitter', 'customFileHandlers'];
// Block requests until the Webpack compilation is done.
function requestBlocker() {
    return function (_request, _response, next) {
        if (isBlocked) {
            blocked.push(next);
        }
        else {
            next();
        }
    };
}
// Copied from "karma-jasmine-diff-reporter" source code:
// In case, when multiple reporters are used in conjunction
// with initSourcemapReporter, they both will show repetitive log
// messages when displaying everything that supposed to write to terminal.
// So just suppress any logs from initSourcemapReporter by doing nothing on
// browser log, because it is an utility reporter,
// unless it's alone in the "reporters" option and base reporter is used.
function muteDuplicateReporterLogging(context, config) {
    context.writeCommonMsg = function () { };
    const reporterName = '@angular/cli';
    const hasTrailingReporters = config.reporters.slice(-1).pop() !== reporterName;
    if (hasTrailingReporters) {
        context.writeCommonMsg = function () { };
    }
}
// Emits builder events.
const eventReporter = function (baseReporterDecorator, config) {
    baseReporterDecorator(this);
    muteDuplicateReporterLogging(this, config);
    this.onRunComplete = function (_browsers, results) {
        if (results.exitCode === 0) {
            successCb && successCb();
        }
        else {
            failureCb && failureCb();
        }
    };
    // avoid duplicate failure message
    this.specFailure = () => { };
};
eventReporter.$inject = ['baseReporterDecorator', 'config'];
// Strip the server address and webpack scheme (webpack://) from error log.
const sourceMapReporter = function (baseReporterDecorator, config) {
    baseReporterDecorator(this);
    muteDuplicateReporterLogging(this, config);
    const urlRegexp = /\(http:\/\/localhost:\d+\/_karma_webpack_\/webpack:\//gi;
    this.onSpecComplete = function (_browser, result) {
        if (!result.success && result.log.length > 0) {
            result.log.forEach((log, idx) => {
                result.log[idx] = log.replace(urlRegexp, '');
            });
        }
    };
    // avoid duplicate complete message
    this.onRunComplete = () => { };
    // avoid duplicate failure message
    this.specFailure = () => { };
};
sourceMapReporter.$inject = ['baseReporterDecorator', 'config'];
// When a request is not found in the karma server, try looking for it from the webpack server root.
function fallbackMiddleware() {
    return function (req, res, next) {
        if (webpackMiddleware) {
            const webpackUrl = '/_karma_webpack_' + req.url;
            const webpackReq = Object.assign({}, req, { url: webpackUrl });
            webpackMiddleware(webpackReq, res, next);
        }
        else {
            next();
        }
    };
}
module.exports = {
    'framework:@angular-devkit/build-angular': ['factory', init],
    'reporter:@angular-devkit/build-angular--sourcemap-reporter': ['type', sourceMapReporter],
    'reporter:@angular-devkit/build-angular--event-reporter': ['type', eventReporter],
    'middleware:@angular-devkit/build-angular--blocker': ['factory', requestBlocker],
    'middleware:@angular-devkit/build-angular--fallback': ['factory', fallbackMiddleware]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2FybWEuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX2FuZ3VsYXIvc3JjL2FuZ3VsYXItY2xpLWZpbGVzL3BsdWdpbnMva2FybWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRztBQUNILGlCQUFpQjtBQUNqQiwrREFBK0Q7O0FBRS9ELDZCQUE2QjtBQUM3Qiw2QkFBNkI7QUFDN0IsbUNBQW1DO0FBQ25DLE1BQU0sb0JBQW9CLEdBQUcsT0FBTyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFFL0QseUVBQW1FO0FBQ25FLDhDQUF5RDtBQUN6RCwyREFBd0U7QUFDeEUsb0RBQWdFO0FBR2hFOzs7Ozs7R0FNRztBQUdILElBQUksT0FBTyxHQUFVLEVBQUUsQ0FBQztBQUN4QixJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUM7QUFDdEIsSUFBSSxpQkFBc0IsQ0FBQztBQUMzQixJQUFJLFNBQXFCLENBQUM7QUFDMUIsSUFBSSxTQUFxQixDQUFDO0FBRTFCLHNDQUFzQztBQUN0QyxTQUFTLGFBQWEsQ0FBQyxLQUFZLEVBQUUsUUFBZSxFQUFFLE9BQU8sR0FBRyxLQUFLO0lBQ25FLE1BQU0sUUFBUSxHQUFHO1FBQ2YsUUFBUSxFQUFFLElBQUk7UUFDZCxNQUFNLEVBQUUsSUFBSTtRQUNaLE9BQU8sRUFBRSxJQUFJO0tBQ2QsQ0FBQztJQUVGLE1BQU0sY0FBYyxHQUFHLFFBQVE7UUFDN0IsMkZBQTJGO1NBQzFGLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7UUFDckUsNENBQTRDO1NBQzNDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLG1CQUFNLFFBQVEsRUFBSyxJQUFJLEVBQUcsQ0FBQyxD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QUFVLEdBQUUsQ0FBQTtZQUM5QyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzFDO2FBQU07WUFDTCxJQUFJLEVBQUUsQ0FBQztTQUNSO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDZix5Q0FBeUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUM7SUFDNUQsNERBQTRELEVBQUUsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUM7SUFDekYsd0RBQXdELEVBQUUsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDO0lBQ2pGLG1EQUFtRCxFQUFFLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQztJQUNoRixvREFBb0QsRUFBRSxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQztDQUN0RixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8gdHNsaW50OmRpc2FibGVcbi8vIFRPRE86IGNsZWFudXAgdGhpcyBmaWxlLCBpdCdzIGNvcGllZCBhcyBpcyBmcm9tIEFuZ3VsYXIgQ0xJLlxuXG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0ICogYXMgZ2xvYiBmcm9tICdnbG9iJztcbmltcG9ydCAqIGFzIHdlYnBhY2sgZnJvbSAnd2VicGFjayc7XG5jb25zdCB3ZWJwYWNrRGV2TWlkZGxld2FyZSA9IHJlcXVpcmUoJ3dlYnBhY2stZGV2LW1pZGRsZXdhcmUnKTtcblxuaW1wb3J0IHsgS2FybWFXZWJwYWNrRmFpbHVyZUNiIH0gZnJvbSAnLi9rYXJtYS13ZWJwYWNrLWZhaWx1cmUtY2InO1xuaW1wb3J0IHsgc3RhdHNFcnJvcnNUb1N0cmluZyB9IGZyb20gJy4uL3V0aWxpdGllcy9zdGF0cyc7XG5pbXBvcnQgeyBnZXRXZWJwYWNrU3RhdHNDb25maWcgfSBmcm9tICcuLi9tb2RlbHMvd2VicGFjay1jb25maWdzL3N0YXRzJztcbmltcG9ydCB7IGNyZWF0ZUNvbnNvbGVMb2dnZXIgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZS9ub2RlJztcbmltcG9ydCB7IGxvZ2dpbmcgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5cbi8qKlxuICogRW51bWVyYXRlIG5lZWRlZCAoYnV0IG5vdCByZXF1aXJlL2ltcG9ydGVkKSBkZXBlbmRlbmNpZXMgZnJvbSB0aGlzIGZpbGVcbiAqICB0byBsZXQgdGhlIGRlcGVuZGVuY3kgdmFsaWRhdG9yIGtub3cgdGhleSBhcmUgdXNlZC5cbiAqXG4gKiByZXF1aXJlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKVxuICogcmVxdWlyZSgna2FybWEtc291cmNlLW1hcC1zdXBwb3J0JylcbiAqL1xuXG5cbmxldCBibG9ja2VkOiBhbnlbXSA9IFtdO1xubGV0IGlzQmxvY2tlZCA9IGZhbHNlO1xubGV0IHdlYnBhY2tNaWRkbGV3YXJlOiBhbnk7XG5sZXQgc3VjY2Vzc0NiOiAoKSA9PiB2b2lkO1xubGV0IGZhaWx1cmVDYjogKCkgPT4gdm9pZDtcblxuLy8gQWRkIGZpbGVzIHRvIHRoZSBLYXJtYSBmaWxlcyBhcnJheS5cbmZ1bmN0aW9uIGFkZEthcm1hRmlsZXMoZmlsZXM6IGFueVtdLCBuZXdGaWxlczogYW55W10sIHByZXBlbmQgPSBmYWxzZSkge1xuICBjb25zdCBkZWZhdWx0cyA9IHtcbiAgICBpbmNsdWRlZDogdHJ1ZSxcbiAgICBzZXJ2ZWQ6IHRydWUsXG4gICAgd2F0Y2hlZDogdHJ1ZVxuICB9O1xuXG4gIGNvbnN0IHByb2Nlc3NlZEZpbGVzID0gbmV3RmlsZXNcbiAgICAvLyBSZW1vdmUgZ2xvYnMgdGhhdCBkbyBub3QgbWF0Y2ggYW55IGZpbGVzLCBvdGhlcndpc2UgS2FybWEgd2lsbCBzaG93IGEgd2FybmluZyBmb3IgdGhlc2UuXG4gICAgLmZpbHRlcihmaWxlID0+IGdsb2Iuc3luYyhmaWxlLnBhdHRlcm4sIHsgbm9kaXI6IHRydWUgfSkubGVuZ3RoICE9IDApXG4gICAgLy8gRmlsbCBpbiBwYXR0ZXJuIHByb3BlcnRpZXMgd2l0aCBkZWZhdWx0cy5cbiAgICAubWFwKGZpbGUgPT4gKHsgLi4uZGVmYXVsdHMsIC4uLmZpbGUgfSkpO1xuXG4gIC8vIEl0J3MgaW1wb3J0YW50IHRvIG5vdCByZXBsYWNlIHRoZSBhcnJheSwgYmVjYXVzZVxuICAvLyBrYXJtYSBhbHJlYWR5IGhhcyBhIHJlZmVyZW5jZSB0byB0aGUgZXhpc3RpbmcgYXJyYXkuXG4gIGlmIChwcmVwZW5kKSB7XG4gICAgZmlsZXMudW5zaGlmdCguLi5wcm9jZXNzZWRGaWxlcyk7XG4gIH0gZWxzZSB7XG4gICAgZmlsZXMucHVzaCguLi5wcm9jZXNzZWRGaWxlcyk7XG4gIH1cbn1cblxuY29uc3QgaW5pdDogYW55ID0gKGNvbmZpZzogYW55LCBlbWl0dGVyOiBhbnksIGN1c3RvbUZpbGVIYW5kbGVyczogYW55KSA9PiB7XG4gIGlmICghY29uZmlnLmJ1aWxkV2VicGFjaykge1xuICAgIHRocm93IG5ldyBFcnJvcihgVGhlICdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhci9wbHVnaW5zL2thcm1hJyBrYXJtYSBwbHVnaW4gaXMgbWVhbnQgdG9gICtcbiAgICBgIGJlIHVzZWQgZnJvbSB3aXRoaW4gQW5ndWxhciBDTEkgYW5kIHdpbGwgbm90IHdvcmsgY29ycmVjdGx5IG91dHNpZGUgb2YgaXQuYFxuICAgIClcbiAgfVxuICBjb25zdCBvcHRpb25zID0gY29uZmlnLmJ1aWxkV2VicGFjay5vcHRpb25zO1xuICBjb25zdCBsb2dnZXI6IGxvZ2dpbmcuTG9nZ2VyID0gY29uZmlnLmJ1aWxkV2VicGFjay5sb2dnZXIgfHwgY3JlYXRlQ29uc29sZUxvZ2dlcigpO1xuICBzdWNjZXNzQ2IgPSBjb25maWcuYnVpbGRXZWJwYWNrLnN1Y2Nlc3NDYjtcbiAgZmFpbHVyZUNiID0gY29uZmlnLmJ1aWxkV2VicGFjay5mYWlsdXJlQ2I7XG5cbiAgY29uZmlnLnJlcG9ydGVycy51bnNoaWZ0KCdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhci0tZXZlbnQtcmVwb3J0ZXInKTtcblxuICAvLyBXaGVuIHVzaW5nIGNvZGUtY292ZXJhZ2UsIGF1dG8tYWRkIGNvdmVyYWdlLWlzdGFuYnVsLlxuICBjb25maWcucmVwb3J0ZXJzID0gY29uZmlnLnJlcG9ydGVycyB8fCBbXTtcbiAgaWYgKG9wdGlvbnMuY29kZUNvdmVyYWdlICYmIGNvbmZpZy5yZXBvcnRlcnMuaW5kZXhPZignY292ZXJhZ2UtaXN0YW5idWwnKSA9PT0gLTEpIHtcbiAgICBjb25maWcucmVwb3J0ZXJzLnVuc2hpZnQoJ2NvdmVyYWdlLWlzdGFuYnVsJyk7XG4gIH1cblxuICAvLyBBZGQgYSByZXBvcnRlciB0aGF0IGZpeGVzIHNvdXJjZW1hcCB1cmxzLlxuICBpZiAob3B0aW9ucy5zb3VyY2VNYXApIHtcbiAgICBjb25maWcucmVwb3J0ZXJzLnVuc2hpZnQoJ0Bhbmd1bGFyLWRldmtpdC9idWlsZC1hbmd1bGFyLS1zb3VyY2VtYXAtcmVwb3J0ZXInKTtcblxuICAgIC8vIENvZGUgdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vdHNjaGF1Yi9rYXJtYS1zb3VyY2UtbWFwLXN1cHBvcnQuXG4gICAgLy8gV2UgY2FuJ3QgdXNlIGl0IGRpcmVjdGx5IGJlY2F1c2Ugd2UgbmVlZCB0byBhZGQgaXQgY29uZGl0aW9uYWxseSBpbiB0aGlzIGZpbGUsIGFuZCBrYXJtYVxuICAgIC8vIGZyYW1ld29ya3MgY2Fubm90IGJlIGFkZGVkIGR5bmFtaWNhbGx5LlxuICAgIGNvbnN0IHNtc1BhdGggPSBwYXRoLmRpcm5hbWUocmVxdWlyZS5yZXNvbHZlKCdzb3VyY2UtbWFwLXN1cHBvcnQnKSk7XG4gICAgY29uc3Qga3Ntc1BhdGggPSBwYXRoLmRpcm5hbWUocmVxdWlyZS5yZXNvbHZlKCdrYXJtYS1zb3VyY2UtbWFwLXN1cHBvcnQnKSk7XG5cbiAgICBhZGRLYXJtYUZpbGVzKGNvbmZpZy5maWxlcywgW1xuICAgICAgeyBwYXR0ZXJuOiBwYXRoLmpvaW4oc21zUGF0aCwgJ2Jyb3dzZXItc291cmNlLW1hcC1zdXBwb3J0LmpzJyksIHdhdGNoZWQ6IGZhbHNlIH0sXG4gICAgICB7IHBhdHRlcm46IHBhdGguam9pbihrc21zUGF0aCwgJ2NsaWVudC5qcycpLCB3YXRjaGVkOiBmYWxzZSB9XG4gICAgXSwgdHJ1ZSk7XG4gIH1cblxuICAvLyBBZGQgd2VicGFjayBjb25maWcuXG4gIGNvbnN0IHdlYnBhY2tDb25maWcgPSBjb25maWcuYnVpbGRXZWJwYWNrLndlYnBhY2tDb25maWc7XG4gIGNvbnN0IHdlYnBhY2tNaWRkbGV3YXJlQ29uZmlnID0ge1xuICAgIC8vIEhpZGUgd2VicGFjayBvdXRwdXQgYmVjYXVzZSBpdHMgbm9pc3kuXG4gICAgbG9nTGV2ZWw6ICdlcnJvcicsXG4gICAgc3RhdHM6IGZhbHNlLFxuICAgIHdhdGNoT3B0aW9uczogeyBwb2xsOiBvcHRpb25zLnBvbGwgfSxcbiAgICBwdWJsaWNQYXRoOiAnL19rYXJtYV93ZWJwYWNrXy8nLFxuICB9O1xuXG4gIGNvbnN0IGNvbXBpbGF0aW9uRXJyb3JDYiA9IChlcnJvcjogc3RyaW5nIHwgdW5kZWZpbmVkLCBlcnJvcnM6IHN0cmluZ1tdKSA9PiB7XG4gICAgLy8gTm90aWZ5IHBvdGVudGlhbCBsaXN0ZW5lcnMgb2YgdGhlIGNvbXBpbGUgZXJyb3JcbiAgICBlbWl0dGVyLmVtaXQoJ2NvbXBpbGVfZXJyb3InLCBlcnJvcnMpO1xuXG4gICAgLy8gRmluaXNoIEthcm1hIHJ1biBlYXJseSBpbiBjYXNlIG9mIGNvbXBpbGF0aW9uIGVycm9yLlxuICAgIGVtaXR0ZXIuZW1pdCgncnVuX2NvbXBsZXRlJywgW10sIHsgZXhpdENvZGU6IDEgfSk7XG5cbiAgICAvLyBVbmJsb2NrIGFueSBrYXJtYSByZXF1ZXN0cyAocG90ZW50aWFsbHkgc3RhcnRlZCB1c2luZyBga2FybWEgcnVuYClcbiAgICB1bmJsb2NrKCk7XG4gIH1cbiAgd2VicGFja0NvbmZpZy5wbHVnaW5zLnB1c2gobmV3IEthcm1hV2VicGFja0ZhaWx1cmVDYihjb21waWxhdGlvbkVycm9yQ2IpKTtcblxuICAvLyBVc2UgZXhpc3RpbmcgY29uZmlnIGlmIGFueS5cbiAgY29uZmlnLndlYnBhY2sgPSBPYmplY3QuYXNzaWduKHdlYnBhY2tDb25maWcsIGNvbmZpZy53ZWJwYWNrKTtcbiAgY29uZmlnLndlYnBhY2tNaWRkbGV3YXJlID0gT2JqZWN0LmFzc2lnbih3ZWJwYWNrTWlkZGxld2FyZUNvbmZpZywgY29uZmlnLndlYnBhY2tNaWRkbGV3YXJlKTtcblxuICAvLyBPdXIgY3VzdG9tIGNvbnRleHQgYW5kIGRlYnVnIGZpbGVzIGxpc3QgdGhlIHdlYnBhY2sgYnVuZGxlcyBkaXJlY3RseSBpbnN0ZWFkIG9mIHVzaW5nXG4gIC8vIHRoZSBrYXJtYSBmaWxlcyBhcnJheS5cbiAgY29uZmlnLmN1c3RvbUNvbnRleHRGaWxlID0gYCR7X19kaXJuYW1lfS9rYXJtYS1jb250ZXh0Lmh0bWxgO1xuICBjb25maWcuY3VzdG9tRGVidWdGaWxlID0gYCR7X19kaXJuYW1lfS9rYXJtYS1kZWJ1Zy5odG1sYDtcblxuICAvLyBBZGQgdGhlIHJlcXVlc3QgYmxvY2tlciBhbmQgdGhlIHdlYnBhY2sgc2VydmVyIGZhbGxiYWNrLlxuICBjb25maWcuYmVmb3JlTWlkZGxld2FyZSA9IGNvbmZpZy5iZWZvcmVNaWRkbGV3YXJlIHx8IFtdO1xuICBjb25maWcuYmVmb3JlTWlkZGxld2FyZS5wdXNoKCdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhci0tYmxvY2tlcicpO1xuICBjb25maWcubWlkZGxld2FyZSA9IGNvbmZpZy5taWRkbGV3YXJlIHx8IFtdO1xuICBjb25maWcubWlkZGxld2FyZS5wdXNoKCdAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhci0tZmFsbGJhY2snKTtcblxuICAvLyBUaGUgd2VicGFjayB0aWVyIG93bnMgdGhlIHdhdGNoIGJlaGF2aW9yIHNvIHdlIHdhbnQgdG8gZm9yY2UgaXQgaW4gdGhlIGNvbmZpZy5cbiAgd2VicGFja0NvbmZpZy53YXRjaCA9ICFjb25maWcuc2luZ2xlUnVuO1xuICBpZiAoY29uZmlnLnNpbmdsZVJ1bikge1xuICAgIC8vIFRoZXJlJ3Mgbm8gb3B0aW9uIHRvIHR1cm4gb2ZmIGZpbGUgd2F0Y2hpbmcgaW4gd2VicGFjay1kZXYtc2VydmVyLCBidXRcbiAgICAvLyB3ZSBjYW4gb3ZlcnJpZGUgdGhlIGZpbGUgd2F0Y2hlciBpbnN0ZWFkLlxuICAgIHdlYnBhY2tDb25maWcucGx1Z2lucy51bnNoaWZ0KHtcbiAgICAgIGFwcGx5OiAoY29tcGlsZXI6IGFueSkgPT4geyAvLyB0c2xpbnQ6ZGlzYWJsZS1saW5lOm5vLWFueVxuICAgICAgICBjb21waWxlci5ob29rcy5hZnRlckVudmlyb25tZW50LnRhcCgna2FybWEnLCAoKSA9PiB7XG4gICAgICAgICAgY29tcGlsZXIud2F0Y2hGaWxlU3lzdGVtID0geyB3YXRjaDogKCkgPT4geyB9IH07XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuICAvLyBGaWxlcyBuZWVkIHRvIGJlIHNlcnZlZCBmcm9tIGEgY3VzdG9tIHBhdGggZm9yIEthcm1hLlxuICB3ZWJwYWNrQ29uZmlnLm91dHB1dC5wYXRoID0gJy9fa2FybWFfd2VicGFja18vJztcbiAgd2VicGFja0NvbmZpZy5vdXRwdXQucHVibGljUGF0aCA9ICcvX2thcm1hX3dlYnBhY2tfLyc7XG4gIHdlYnBhY2tDb25maWcub3V0cHV0LmRldnRvb2xNb2R1bGVGaWxlbmFtZVRlbXBsYXRlID0gJ1tuYW1lc3BhY2VdL1tyZXNvdXJjZS1wYXRoXT9bbG9hZGVyc10nO1xuXG4gIGxldCBjb21waWxlcjogYW55O1xuICB0cnkge1xuICAgIGNvbXBpbGVyID0gd2VicGFjayh3ZWJwYWNrQ29uZmlnKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGxvZ2dlci5lcnJvcihlLnN0YWNrIHx8IGUpXG4gICAgaWYgKGUuZGV0YWlscykge1xuICAgICAgbG9nZ2VyLmVycm9yKGUuZGV0YWlscylcbiAgICB9XG4gICAgdGhyb3cgZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZXIoY2FsbGJhY2s/OiAoKSA9PiB2b2lkKSB7XG4gICAgaXNCbG9ja2VkID0gdHJ1ZTtcblxuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuICB9XG5cbiAgY29tcGlsZXIuaG9va3MuaW52YWxpZC50YXAoJ2thcm1hJywgKCkgPT4gaGFuZGxlcigpKTtcblxuICBjb21waWxlci5ob29rcy53YXRjaFJ1bi50YXBBc3luYygna2FybWEnLCAoXzogYW55LCBjYWxsYmFjazogKCkgPT4gdm9pZCkgPT4gaGFuZGxlcihjYWxsYmFjaykpO1xuXG4gIGNvbXBpbGVyLmhvb2tzLnJ1bi50YXBBc3luYygna2FybWEnLCAoXzogYW55LCBjYWxsYmFjazogKCkgPT4gdm9pZCkgPT4gaGFuZGxlcihjYWxsYmFjaykpO1xuXG4gIGZ1bmN0aW9uIHVuYmxvY2soKXtcbiAgICBpc0Jsb2NrZWQgPSBmYWxzZTtcbiAgICBibG9ja2VkLmZvckVhY2goKGNiKSA9PiBjYigpKTtcbiAgICBibG9ja2VkID0gW107XG4gIH1cblxuICBsZXQgbGFzdENvbXBpbGF0aW9uSGFzaDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBjb25zdCBzdGF0c0NvbmZpZyA9IGdldFdlYnBhY2tTdGF0c0NvbmZpZygpO1xuICBjb21waWxlci5ob29rcy5kb25lLnRhcCgna2FybWEnLCAoc3RhdHM6IGFueSkgPT4ge1xuICAgIGlmIChzdGF0cy5jb21waWxhdGlvbi5lcnJvcnMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QganNvbiA9IHN0YXRzLnRvSnNvbihjb25maWcuc3RhdHMpO1xuICAgICAgLy8gUHJpbnQgY29tcGlsYXRpb24gZXJyb3JzLlxuICAgICAgbG9nZ2VyLmVycm9yKHN0YXRzRXJyb3JzVG9TdHJpbmcoanNvbiwgc3RhdHNDb25maWcpKTtcbiAgICAgIGxhc3RDb21waWxhdGlvbkhhc2ggPSB1bmRlZmluZWQ7XG4gICAgICAvLyBFbWl0IGEgZmFpbHVyZSBidWlsZCBldmVudCBpZiB0aGVyZSBhcmUgY29tcGlsYXRpb24gZXJyb3JzLlxuICAgICAgZmFpbHVyZUNiICYmIGZhaWx1cmVDYigpO1xuICAgIH0gZWxzZSBpZiAoc3RhdHMuaGFzaCAhPSBsYXN0Q29tcGlsYXRpb25IYXNoKSB7XG4gICAgICAvLyBSZWZyZXNoIGthcm1hIG9ubHkgd2hlbiB0aGVyZSBhcmUgbm8gd2VicGFjayBlcnJvcnMsIGFuZCBpZiB0aGUgY29tcGlsYXRpb24gY2hhbmdlZC5cbiAgICAgIGxhc3RDb21waWxhdGlvbkhhc2ggPSBzdGF0cy5oYXNoO1xuICAgICAgZW1pdHRlci5yZWZyZXNoRmlsZXMoKTtcbiAgICB9XG4gICAgdW5ibG9jaygpO1xuICB9KTtcblxuICB3ZWJwYWNrTWlkZGxld2FyZSA9IG5ldyB3ZWJwYWNrRGV2TWlkZGxld2FyZShjb21waWxlciwgd2VicGFja01pZGRsZXdhcmVDb25maWcpO1xuXG4gIC8vIEZvcndhcmQgcmVxdWVzdHMgdG8gd2VicGFjayBzZXJ2ZXIuXG4gIGN1c3RvbUZpbGVIYW5kbGVycy5wdXNoKHtcbiAgICB1cmxSZWdleDogL15cXC9fa2FybWFfd2VicGFja19cXC8uKi8sXG4gICAgaGFuZGxlcjogZnVuY3Rpb24gaGFuZGxlcihyZXE6IGFueSwgcmVzOiBhbnkpIHtcbiAgICAgIHdlYnBhY2tNaWRkbGV3YXJlKHJlcSwgcmVzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIEVuc3VyZSBzY3JpcHQgYW5kIHN0eWxlIGJ1bmRsZXMgYXJlIHNlcnZlZC5cbiAgICAgICAgLy8gVGhleSBhcmUgbWVudGlvbmVkIGluIHRoZSBjdXN0b20ga2FybWEgY29udGV4dCBwYWdlIGFuZCB3ZSBkb24ndCB3YW50IHRoZW0gdG8gNDA0LlxuICAgICAgICBjb25zdCBhbHdheXNTZXJ2ZSA9IFtcbiAgICAgICAgICAnL19rYXJtYV93ZWJwYWNrXy9ydW50aW1lLmpzJyxcbiAgICAgICAgICAnL19rYXJtYV93ZWJwYWNrXy9wb2x5ZmlsbHMuanMnLFxuICAgICAgICAgICcvX2thcm1hX3dlYnBhY2tfL3NjcmlwdHMuanMnLFxuICAgICAgICAgICcvX2thcm1hX3dlYnBhY2tfL3N0eWxlcy5qcycsXG4gICAgICAgICAgJy9fa2FybWFfd2VicGFja18vdmVuZG9yLmpzJyxcbiAgICAgICAgXTtcbiAgICAgICAgaWYgKGFsd2F5c1NlcnZlLmluZGV4T2YocmVxLnVybCkgIT0gLTEpIHtcbiAgICAgICAgICByZXMuc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzLnN0YXR1c0NvZGUgPSA0MDQ7XG4gICAgICAgICAgcmVzLmVuZCgnTm90IGZvdW5kJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG5cbiAgZW1pdHRlci5vbignZXhpdCcsIChkb25lOiBhbnkpID0+IHtcbiAgICB3ZWJwYWNrTWlkZGxld2FyZS5jbG9zZSgpO1xuICAgIGRvbmUoKTtcbiAgfSk7XG59O1xuXG5pbml0LiRpbmplY3QgPSBbJ2NvbmZpZycsICdlbWl0dGVyJywgJ2N1c3RvbUZpbGVIYW5kbGVycyddO1xuXG4vLyBCbG9jayByZXF1ZXN0cyB1bnRpbCB0aGUgV2VicGFjayBjb21waWxhdGlvbiBpcyBkb25lLlxuZnVuY3Rpb24gcmVxdWVzdEJsb2NrZXIoKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoX3JlcXVlc3Q6IGFueSwgX3Jlc3BvbnNlOiBhbnksIG5leHQ6ICgpID0+IHZvaWQpIHtcbiAgICBpZiAoaXNCbG9ja2VkKSB7XG4gICAgICBibG9ja2VkLnB1c2gobmV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5leHQoKTtcbiAgICB9XG4gIH07XG59XG5cbi8vIENvcGllZCBmcm9tIFwia2FybWEtamFzbWluZS1kaWZmLXJlcG9ydGVyXCIgc291cmNlIGNvZGU6XG4vLyBJbiBjYXNlLCB3aGVuIG11bHRpcGxlIHJlcG9ydGVycyBhcmUgdXNlZCBpbiBjb25qdW5jdGlvblxuLy8gd2l0aCBpbml0U291cmNlbWFwUmVwb3J0ZXIsIHRoZXkgYm90aCB3aWxsIHNob3cgcmVwZXRpdGl2ZSBsb2dcbi8vIG1lc3NhZ2VzIHdoZW4gZGlzcGxheWluZyBldmVyeXRoaW5nIHRoYXQgc3VwcG9zZWQgdG8gd3JpdGUgdG8gdGVybWluYWwuXG4vLyBTbyBqdXN0IHN1cHByZXNzIGFueSBsb2dzIGZyb20gaW5pdFNvdXJjZW1hcFJlcG9ydGVyIGJ5IGRvaW5nIG5vdGhpbmcgb25cbi8vIGJyb3dzZXIgbG9nLCBiZWNhdXNlIGl0IGlzIGFuIHV0aWxpdHkgcmVwb3J0ZXIsXG4vLyB1bmxlc3MgaXQncyBhbG9uZSBpbiB0aGUgXCJyZXBvcnRlcnNcIiBvcHRpb24gYW5kIGJhc2UgcmVwb3J0ZXIgaXMgdXNlZC5cbmZ1bmN0aW9uIG11dGVEdXBsaWNhdGVSZXBvcnRlckxvZ2dpbmcoY29udGV4dDogYW55LCBjb25maWc6IGFueSkge1xuICBjb250ZXh0LndyaXRlQ29tbW9uTXNnID0gZnVuY3Rpb24gKCkgeyB9O1xuICBjb25zdCByZXBvcnRlck5hbWUgPSAnQGFuZ3VsYXIvY2xpJztcbiAgY29uc3QgaGFzVHJhaWxpbmdSZXBvcnRlcnMgPSBjb25maWcucmVwb3J0ZXJzLnNsaWNlKC0xKS5wb3AoKSAhPT0gcmVwb3J0ZXJOYW1lO1xuXG4gIGlmIChoYXNUcmFpbGluZ1JlcG9ydGVycykge1xuICAgIGNvbnRleHQud3JpdGVDb21tb25Nc2cgPSBmdW5jdGlvbiAoKSB7IH07XG4gIH1cbn1cblxuLy8gRW1pdHMgYnVpbGRlciBldmVudHMuXG5jb25zdCBldmVudFJlcG9ydGVyOiBhbnkgPSBmdW5jdGlvbiAodGhpczogYW55LCBiYXNlUmVwb3J0ZXJEZWNvcmF0b3I6IGFueSwgY29uZmlnOiBhbnkpIHtcbiAgYmFzZVJlcG9ydGVyRGVjb3JhdG9yKHRoaXMpO1xuXG4gIG11dGVEdXBsaWNhdGVSZXBvcnRlckxvZ2dpbmcodGhpcywgY29uZmlnKTtcblxuICB0aGlzLm9uUnVuQ29tcGxldGUgPSBmdW5jdGlvbiAoX2Jyb3dzZXJzOiBhbnksIHJlc3VsdHM6IGFueSkge1xuICAgIGlmIChyZXN1bHRzLmV4aXRDb2RlID09PSAwKSB7XG4gICAgICBzdWNjZXNzQ2IgJiYgc3VjY2Vzc0NiKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZhaWx1cmVDYiAmJiBmYWlsdXJlQ2IoKTtcbiAgICB9XG4gIH1cblxuICAvLyBhdm9pZCBkdXBsaWNhdGUgZmFpbHVyZSBtZXNzYWdlXG4gIHRoaXMuc3BlY0ZhaWx1cmUgPSAoKSA9PiB7fTtcbn07XG5cbmV2ZW50UmVwb3J0ZXIuJGluamVjdCA9IFsnYmFzZVJlcG9ydGVyRGVjb3JhdG9yJywgJ2NvbmZpZyddO1xuXG4vLyBTdHJpcCB0aGUgc2VydmVyIGFkZHJlc3MgYW5kIHdlYnBhY2sgc2NoZW1lICh3ZWJwYWNrOi8vKSBmcm9tIGVycm9yIGxvZy5cbmNvbnN0IHNvdXJjZU1hcFJlcG9ydGVyOiBhbnkgPSBmdW5jdGlvbiAodGhpczogYW55LCBiYXNlUmVwb3J0ZXJEZWNvcmF0b3I6IGFueSwgY29uZmlnOiBhbnkpIHtcbiAgYmFzZVJlcG9ydGVyRGVjb3JhdG9yKHRoaXMpO1xuXG4gIG11dGVEdXBsaWNhdGVSZXBvcnRlckxvZ2dpbmcodGhpcywgY29uZmlnKTtcblxuICBjb25zdCB1cmxSZWdleHAgPSAvXFwoaHR0cDpcXC9cXC9sb2NhbGhvc3Q6XFxkK1xcL19rYXJtYV93ZWJwYWNrX1xcL3dlYnBhY2s6XFwvL2dpO1xuXG4gIHRoaXMub25TcGVjQ29tcGxldGUgPSBmdW5jdGlvbiAoX2Jyb3dzZXI6IGFueSwgcmVzdWx0OiBhbnkpIHtcbiAgICBpZiAoIXJlc3VsdC5zdWNjZXNzICYmIHJlc3VsdC5sb2cubGVuZ3RoID4gMCkge1xuICAgICAgcmVzdWx0LmxvZy5mb3JFYWNoKChsb2c6IHN0cmluZywgaWR4OiBudW1iZXIpID0+IHtcbiAgICAgICAgcmVzdWx0LmxvZ1tpZHhdID0gbG9nLnJlcGxhY2UodXJsUmVnZXhwLCAnJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG5cbiAgLy8gYXZvaWQgZHVwbGljYXRlIGNvbXBsZXRlIG1lc3NhZ2VcbiAgdGhpcy5vblJ1bkNvbXBsZXRlID0gKCkgPT4ge307XG5cbiAgLy8gYXZvaWQgZHVwbGljYXRlIGZhaWx1cmUgbWVzc2FnZVxuICB0aGlzLnNwZWNGYWlsdXJlID0gKCkgPT4ge307XG59O1xuXG5zb3VyY2VNYXBSZXBvcnRlci4kaW5qZWN0ID0gWydiYXNlUmVwb3J0ZXJEZWNvcmF0b3InLCAnY29uZmlnJ107XG5cbi8vIFdoZW4gYSByZXF1ZXN0IGlzIG5vdCBmb3VuZCBpbiB0aGUga2FybWEgc2VydmVyLCB0cnkgbG9va2luZyBmb3IgaXQgZnJvbSB0aGUgd2VicGFjayBzZXJ2ZXIgcm9vdC5cbmZ1bmN0aW9uIGZhbGxiYWNrTWlkZGxld2FyZSgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChyZXE6IGFueSwgcmVzOiBhbnksIG5leHQ6ICgpID0+IHZvaWQpIHtcbiAgICBpZiAod2VicGFja01pZGRsZXdhcmUpIHtcbiAgICAgIGNvbnN0IHdlYnBhY2tVcmwgPSAnL19rYXJtYV93ZWJwYWNrXycgKyByZXEudXJsO1xuICAgICAgY29uc3Qgd2VicGFja1JlcSA9IHsgLi4ucmVxLCB1cmw6IHdlYnBhY2tVcmwgfVxuICAgICAgd2VicGFja01pZGRsZXdhcmUod2VicGFja1JlcSwgcmVzLCBuZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV4dCgpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICdmcmFtZXdvcms6QGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXInOiBbJ2ZhY3RvcnknLCBpbml0XSxcbiAgJ3JlcG9ydGVyOkBhbmd1bGFyLWRldmtpdC9idWlsZC1hbmd1bGFyLS1zb3VyY2VtYXAtcmVwb3J0ZXInOiBbJ3R5cGUnLCBzb3VyY2VNYXBSZXBvcnRlcl0sXG4gICdyZXBvcnRlcjpAYW5ndWxhci1kZXZraXQvYnVpbGQtYW5ndWxhci0tZXZlbnQtcmVwb3J0ZXInOiBbJ3R5cGUnLCBldmVudFJlcG9ydGVyXSxcbiAgJ21pZGRsZXdhcmU6QGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXItLWJsb2NrZXInOiBbJ2ZhY3RvcnknLCByZXF1ZXN0QmxvY2tlcl0sXG4gICdtaWRkbGV3YXJlOkBhbmd1bGFyLWRldmtpdC9idWlsZC1hbmd1bGFyLS1mYWxsYmFjayc6IFsnZmFjdG9yeScsIGZhbGxiYWNrTWlkZGxld2FyZV1cbn07XG4iXX0=