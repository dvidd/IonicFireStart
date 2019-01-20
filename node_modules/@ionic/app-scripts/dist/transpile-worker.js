"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var transpile_1 = require("./transpile");
var context = {};
process.on('message', function (incomingMsg) {
    context.rootDir = incomingMsg.rootDir;
    context.buildDir = incomingMsg.buildDir;
    var workerConfig = {
        configFile: incomingMsg.configFile,
        writeInMemory: false,
        sourceMaps: false,
        cache: false,
        inlineTemplate: false,
        useTransforms: false
    };
    transpile_1.transpileWorker(context, workerConfig)
        .then(function () {
        var outgoingMsg = {
            transpileSuccess: true
        };
        process.send(outgoingMsg);
    })
        .catch(function () {
        var outgoingMsg = {
            transpileSuccess: false
        };
        process.send(outgoingMsg);
    });
});
