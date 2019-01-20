"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./util/errors");
var helpers_1 = require("./util/helpers");
var logger_1 = require("./logger/logger");
process.on('message', function (msg) {
    try {
        var modulePath = "./" + msg.taskModule;
        var taskWorker = require(modulePath)[msg.taskWorker];
        taskWorker(msg.context, msg.workerConfig)
            .then(function (val) {
            taskResolve(msg.taskModule, msg.taskWorker, val);
        }, function (val) {
            taskReject(msg.taskModule, msg.taskWorker, val);
        })
            .catch(function (err) {
            taskError(msg.taskModule, msg.taskWorker, err);
        });
    }
    catch (e) {
        taskError(msg.taskModule, msg.taskWorker, e);
        process.exit(1);
    }
});
function taskResolve(taskModule, taskWorker, val) {
    var msg = {
        taskModule: taskModule,
        taskWorker: taskWorker,
        resolve: val,
        pid: process.pid
    };
    logger_1.Logger.debug("worker resolve, taskModule: " + msg.taskModule + ", pid: " + msg.pid);
    process.send(msg);
}
function taskReject(taskModule, taskWorker, error) {
    var buildError = new errors_1.BuildError(error.message);
    var json = helpers_1.buildErrorToJson(buildError);
    var msg = {
        taskModule: taskModule,
        taskWorker: taskWorker,
        reject: json,
        pid: process.pid
    };
    logger_1.Logger.debug("worker reject, taskModule: " + msg.taskModule + ", pid: " + msg.pid);
    process.send(msg);
}
function taskError(taskModule, taskWorker, error) {
    var buildError = new errors_1.BuildError(error.message);
    var json = helpers_1.buildErrorToJson(buildError);
    var msg = {
        taskModule: taskModule,
        taskWorker: taskWorker,
        error: json,
        pid: process.pid
    };
    logger_1.Logger.debug("worker error, taskModule: " + msg.taskModule + ", pid: " + msg.pid);
    process.send(msg);
}
