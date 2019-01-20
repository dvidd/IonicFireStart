"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../logger/logger");
var fs = require("fs");
var path = require("path");
var nodeSass = require("node-sass");
var rollup = require("rollup");
var typescript = require("typescript");
var uglify = require("uglify-es");
var cleanCss = require("clean-css");
function bundleCoreComponents(context) {
    var compiler = getCoreCompiler(context);
    if (!compiler) {
        logger_1.Logger.debug("skipping core component bundling");
        return Promise.resolve();
    }
    var config = {
        srcDir: context.coreDir,
        destDir: context.buildDir,
        attrCase: 'lower',
        packages: {
            cleanCss: cleanCss,
            fs: fs,
            path: path,
            nodeSass: nodeSass,
            rollup: rollup,
            typescript: typescript,
            uglify: uglify
        },
        watch: context.isWatch
    };
    return compiler.bundle(config).then(function (results) {
        if (results.errors) {
            results.errors.forEach(function (err) {
                logger_1.Logger.error("compiler.bundle, results: " + err);
            });
        }
        else if (results.componentRegistry) {
            // add the component registry to the global window.Ionic
            context.ionicGlobal = context.ionicGlobal || {};
            context.ionicGlobal['components'] = results.componentRegistry;
        }
    }).catch(function (err) {
        if (err) {
            if (err.stack) {
                logger_1.Logger.error("compiler.bundle: " + err.stack);
            }
            else {
                logger_1.Logger.error("compiler.bundle: " + err);
            }
        }
        else {
            logger_1.Logger.error("compiler.bundle error");
        }
    });
}
exports.bundleCoreComponents = bundleCoreComponents;
function getCoreCompiler(context) {
    try {
        return require(context.coreCompilerFilePath);
    }
    catch (e) {
        logger_1.Logger.debug("error loading core compiler: " + context.coreCompilerFilePath + ", " + e);
    }
    return null;
}
