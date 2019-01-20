"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_1 = require("../logger/logger");
var logger_runtime_1 = require("../logger/logger-runtime");
var logger_diagnostics_1 = require("../logger/logger-diagnostics");
var events_1 = require("../util/events");
var ws_1 = require("ws");
function createNotificationServer(config) {
    var wsServer;
    var msgToClient = [];
    // queue up all messages to the client
    function queueMessageSend(msg) {
        msgToClient.push(msg);
        drainMessageQueue({
            broadcast: true
        });
    }
    // drain the queue messages when the server is ready
    function drainMessageQueue(options) {
        if (options === void 0) { options = { broadcast: false }; }
        var sendMethod = wsServer && wsServer.send;
        if (options.hasOwnProperty('broadcast') && options.broadcast) {
            sendMethod = wss.broadcast;
        }
        if (sendMethod && wss.clients.size > 0) {
            var msg = void 0;
            while (msg = msgToClient.shift()) {
                try {
                    sendMethod(JSON.stringify(msg));
                }
                catch (e) {
                    if (e.message !== 'not opened' && e.message !== "Cannot read property 'readyState' of undefined") {
                        logger_1.Logger.error("error sending client ws - " + e.message);
                    }
                }
            }
        }
    }
    // a build update has started, notify the client
    events_1.on(events_1.EventType.BuildUpdateStarted, function (buildUpdateMsg) {
        var msg = {
            category: 'buildUpdate',
            type: 'started',
            data: {
                buildId: buildUpdateMsg.buildId,
                reloadApp: buildUpdateMsg.reloadApp,
                diagnosticsHtml: null
            }
        };
        queueMessageSend(msg);
    });
    // a build update has completed, notify the client
    events_1.on(events_1.EventType.BuildUpdateCompleted, function (buildUpdateMsg) {
        var msg = {
            category: 'buildUpdate',
            type: 'completed',
            data: {
                buildId: buildUpdateMsg.buildId,
                reloadApp: buildUpdateMsg.reloadApp,
                diagnosticsHtml: logger_diagnostics_1.hasDiagnostics(config.buildDir) ? logger_diagnostics_1.getDiagnosticsHtmlContent(config.buildDir) : null
            }
        };
        queueMessageSend(msg);
    });
    // create web socket server
    var wss = new ws_1.Server({ port: config.notificationPort });
    wss.broadcast = function broadcast(data) {
        wss.clients.forEach(function each(client) {
            client.send(data);
        });
    };
    wss.on('connection', function (ws) {
        // we've successfully connected
        wsServer = ws;
        wsServer.on('message', function (incomingMessage) {
            // incoming message from the client
            try {
                printMessageFromClient(JSON.parse(incomingMessage));
            }
            catch (e) {
                logger_1.Logger.error("error opening ws message: " + incomingMessage);
                logger_1.Logger.error(e.stack ? e.stack : e);
            }
        });
        // now that we're connected, send off any messages
        // we might has already queued up
        drainMessageQueue();
    });
    function printMessageFromClient(msg) {
        if (msg && msg.data) {
            switch (msg.category) {
                case 'console':
                    printConsole(msg);
                    break;
                case 'runtimeError':
                    handleRuntimeError(msg);
                    break;
            }
        }
    }
    function printConsole(msg) {
        var args = msg.data;
        args[0] = "console." + msg.type + ": " + args[0];
        var log = args.join(' ');
        switch (msg.type) {
            case 'error':
                logger_1.Logger.error(log);
                break;
            case 'warn':
                logger_1.Logger.warn(log);
                break;
            case 'debug':
                logger_1.Logger.debug(log);
                break;
            default:
                logger_1.Logger.info(log);
                break;
        }
    }
    function handleRuntimeError(clientMsg) {
        var msg = {
            category: 'buildUpdate',
            type: 'completed',
            data: {
                diagnosticsHtml: logger_runtime_1.generateRuntimeDiagnosticContent(config.rootDir, config.buildDir, clientMsg.data.message, clientMsg.data.stack)
            }
        };
        queueMessageSend(msg);
    }
}
exports.createNotificationServer = createNotificationServer;
