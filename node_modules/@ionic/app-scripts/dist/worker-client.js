"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./util/errors");
var helpers_1 = require("./util/helpers");
var logger_1 = require("./logger/logger");
var child_process_1 = require("child_process");
var path_1 = require("path");
function runWorker(taskModule, taskWorker, context, workerConfig) {
    return new Promise(function (resolve, reject) {
        var worker = createWorker(taskModule);
        var msg = {
            taskModule: taskModule,
            taskWorker: taskWorker,
            context: {
                // only copy over what's important
                // don't copy over the large data properties
                rootDir: context.rootDir,
                tmpDir: context.tmpDir,
                srcDir: context.srcDir,
                wwwDir: context.wwwDir,
                wwwIndex: context.wwwIndex,
                buildDir: context.buildDir,
                bundledFilePaths: context.bundledFilePaths,
                isProd: context.isProd,
                isWatch: context.isWatch,
                runAot: context.runAot,
                runMinifyJs: context.runMinifyJs,
                runMinifyCss: context.runMinifyCss,
                optimizeJs: context.optimizeJs,
                bundler: context.bundler,
                inlineTemplates: context.inlineTemplates,
            },
            workerConfig: workerConfig
        };
        worker.on('message', function (msg) {
            if (msg.error) {
                reject(new errors_1.BuildError(msg.error));
            }
            else if (msg.reject) {
                var buildError = helpers_1.jsonToBuildError(msg.reject);
                reject(buildError);
            }
            else {
                resolve(msg.resolve);
            }
            killWorker(msg.pid);
        });
        worker.on('error', function (err) {
            logger_1.Logger.error("worker error, taskModule: " + taskModule + ", pid: " + worker.pid + ", error: " + err);
        });
        worker.on('exit', function (code) {
            logger_1.Logger.debug("worker exited, taskModule: " + taskModule + ", pid: " + worker.pid);
        });
        worker.send(msg);
    });
}
exports.runWorker = runWorker;
function killWorker(pid) {
    for (var i = exports.workers.length - 1; i >= 0; i--) {
        if (exports.workers[i].worker.pid === pid) {
            try {
                exports.workers[i].worker.kill('SIGKILL');
            }
            catch (e) {
                logger_1.Logger.error("killWorker, " + pid + ": " + e);
            }
            finally {
                delete exports.workers[i].worker;
                exports.workers.splice(i, 1);
            }
        }
    }
}
function createWorker(taskModule) {
    for (var i = exports.workers.length - 1; i >= 0; i--) {
        if (exports.workers[i].task === taskModule) {
            try {
                exports.workers[i].worker.kill('SIGKILL');
            }
            catch (e) {
                logger_1.Logger.debug("createWorker, " + taskModule + " kill('SIGKILL'): " + e);
            }
            finally {
                delete exports.workers[i].worker;
                exports.workers.splice(i, 1);
            }
        }
    }
    try {
        var workerModule = path_1.join(__dirname, 'worker-process.js');
        var worker = child_process_1.fork(workerModule, process.argv, {
            env: {
                FORCE_COLOR: true,
                npm_config_argv: process.env.npm_config_argv
            }
        });
        logger_1.Logger.debug("worker created, taskModule: " + taskModule + ", pid: " + worker.pid);
        exports.workers.push({
            task: taskModule,
            worker: worker
        });
        return worker;
    }
    catch (e) {
        throw new errors_1.BuildError("unable to create worker-process, task: " + taskModule + ": " + e);
    }
}
exports.createWorker = createWorker;
exports.workers = [];
