"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../util/helpers");
var serve_config_1 = require("./serve-config");
var LOGGER_HEADER = '<!-- Ionic Dev Server: Injected Logger Script -->';
function injectNotificationScript(rootDir, content, notifyOnConsoleLog, notificationPort) {
    var contentStr = content.toString();
    var consoleLogScript = getDevLoggerScript(rootDir, notifyOnConsoleLog, notificationPort);
    if (contentStr.indexOf(LOGGER_HEADER) > -1) {
        // already added script somehow
        return content;
    }
    var match = contentStr.match(/<head>(?![\s\S]*<head>)/i);
    if (!match) {
        match = contentStr.match(/<body>(?![\s\S]*<body>)/i);
    }
    if (match) {
        contentStr = contentStr.replace(match[0], match[0] + "\n" + consoleLogScript);
    }
    else {
        contentStr = consoleLogScript + contentStr;
    }
    return contentStr;
}
exports.injectNotificationScript = injectNotificationScript;
function getDevLoggerScript(rootDir, notifyOnConsoleLog, notificationPort) {
    var appScriptsVersion = helpers_1.getAppScriptsVersion();
    var ionDevServer = JSON.stringify({
        sendConsoleLogs: notifyOnConsoleLog,
        wsPort: notificationPort,
        appScriptsVersion: appScriptsVersion,
        systemInfo: helpers_1.getSystemText(rootDir)
    });
    return "\n  " + LOGGER_HEADER + "\n  <script>var IonicDevServerConfig=" + ionDevServer + ";</script>\n  <link href=\"" + serve_config_1.LOGGER_DIR + "/ion-dev.css?v=" + appScriptsVersion + "\" rel=\"stylesheet\">\n  <script src=\"" + serve_config_1.LOGGER_DIR + "/ion-dev.js?v=" + appScriptsVersion + "\"></script>\n  ";
}
