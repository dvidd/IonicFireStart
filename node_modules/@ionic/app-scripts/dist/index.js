"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var build_1 = require("./build");
exports.build = build_1.build;
var bundle_1 = require("./bundle");
exports.bundle = bundle_1.bundle;
exports.bundleUpdate = bundle_1.bundleUpdate;
var clean_1 = require("./clean");
exports.clean = clean_1.clean;
var cleancss_1 = require("./cleancss");
exports.cleancss = cleancss_1.cleancss;
var copy_1 = require("./copy");
exports.copy = copy_1.copy;
exports.copyUpdate = copy_1.copyUpdate;
var lint_1 = require("./lint");
exports.lint = lint_1.lint;
var minify_1 = require("./minify");
exports.minify = minify_1.minify;
var ngc_1 = require("./ngc");
exports.ngc = ngc_1.ngc;
var sass_1 = require("./sass");
exports.sass = sass_1.sass;
exports.sassUpdate = sass_1.sassUpdate;
var serve_1 = require("./serve");
exports.serve = serve_1.serve;
var transpile_1 = require("./transpile");
exports.transpile = transpile_1.transpile;
var uglifyjs_1 = require("./uglifyjs");
exports.uglifyjs = uglifyjs_1.uglifyjs;
var watch_1 = require("./watch");
exports.watch = watch_1.watch;
exports.buildUpdate = watch_1.buildUpdate;
__export(require("./util/config"));
__export(require("./util/helpers"));
__export(require("./util/interfaces"));
__export(require("./util/constants"));
__export(require("./generators"));
var util_1 = require("./deep-linking/util");
exports.getDeepLinkData = util_1.getDeepLinkData;
var config_1 = require("./util/config");
var helpers_1 = require("./util/helpers");
var logger_1 = require("./logger/logger");
function run(task) {
    try {
        logger_1.Logger.info("ionic-app-scripts " + helpers_1.getAppScriptsVersion(), 'cyan');
    }
    catch (e) { }
    try {
        var context = config_1.generateContext(null);
        helpers_1.setContext(context);
        require("../dist/" + task)[task](context).catch(function (err) {
            errorLog(task, err);
        });
    }
    catch (e) {
        errorLog(task, e);
    }
}
exports.run = run;
function errorLog(task, e) {
    logger_1.Logger.error("ionic-app-script task: \"" + task + "\"");
    if (e && e.toString() !== 'Error') {
        logger_1.Logger.error("" + e);
    }
    if (e.stack) {
        logger_1.Logger.unformattedError(e.stack);
    }
    process.exit(1);
}
