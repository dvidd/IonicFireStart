"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger_diagnostics_1 = require("../logger/logger-diagnostics");
var path = require("path");
var tinylr = require("tiny-lr");
var events = require("../util/events");
function createLiveReloadServer(config) {
    var liveReloadServer = tinylr();
    liveReloadServer.listen(config.liveReloadPort, config.host);
    function fileChange(changedFiles) {
        // only do a live reload if there are no diagnostics
        // the notification server takes care of showing diagnostics
        if (!logger_diagnostics_1.hasDiagnostics(config.buildDir)) {
            liveReloadServer.changed({
                body: {
                    files: changedFiles.map(function (changedFile) { return '/' + path.relative(config.wwwDir, changedFile.filePath); })
                }
            });
        }
    }
    events.on(events.EventType.FileChange, fileChange);
    events.on(events.EventType.ReloadApp, function () {
        fileChange([{ event: 'change', ext: '.html', filePath: 'index.html' }]);
    });
}
exports.createLiveReloadServer = createLiveReloadServer;
function injectLiveReloadScript(content, host, port) {
    var contentStr = content.toString();
    var liveReloadScript = getLiveReloadScript(host, port);
    if (contentStr.indexOf('/livereload.js') > -1) {
        // already added script
        return content;
    }
    var match = contentStr.match(/<\/body>(?![\s\S]*<\/body>)/i);
    if (!match) {
        match = contentStr.match(/<\/html>(?![\s\S]*<\/html>)/i);
    }
    if (match) {
        contentStr = contentStr.replace(match[0], liveReloadScript + "\n" + match[0]);
    }
    else {
        contentStr += liveReloadScript;
    }
    return contentStr;
}
exports.injectLiveReloadScript = injectLiveReloadScript;
function getLiveReloadScript(host, port) {
    var src = "//" + host + ":" + port + "/livereload.js?snipver=1";
    return "  <!-- Ionic Dev Server: Injected LiveReload Script -->\n  <script src=\"" + src + "\" async=\"\" defer=\"\"></script>";
}
