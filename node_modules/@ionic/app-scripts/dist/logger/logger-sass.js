"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var highlight_1 = require("../highlight/highlight");
var logger_1 = require("./logger");
var fs_1 = require("fs");
var helpers_1 = require("../util/helpers");
function runSassDiagnostics(context, sassError) {
    if (!sassError) {
        return [];
    }
    var d = {
        level: 'error',
        type: 'sass',
        language: 'scss',
        header: 'sass error',
        code: sassError.status && sassError.status.toString(),
        relFileName: null,
        absFileName: null,
        messageText: sassError.message,
        lines: []
    };
    if (sassError.file) {
        d.absFileName = sassError.file;
        d.relFileName = logger_1.Logger.formatFileName(context.rootDir, d.absFileName);
        d.header = logger_1.Logger.formatHeader('sass', d.absFileName, context.rootDir, sassError.line);
        if (sassError.line > -1) {
            try {
                var sourceText = fs_1.readFileSync(d.absFileName, 'utf8');
                var srcLines = helpers_1.splitLineBreaks(sourceText);
                var htmlLines = srcLines;
                try {
                    htmlLines = helpers_1.splitLineBreaks(highlight_1.highlight(d.language, sourceText, true).value);
                }
                catch (e) { }
                var errorLine = {
                    lineIndex: sassError.line - 1,
                    lineNumber: sassError.line,
                    text: srcLines[sassError.line - 1],
                    html: htmlLines[sassError.line - 1],
                    errorCharStart: sassError.column,
                    errorLength: 0
                };
                if (errorLine.html.indexOf('class="hljs') === -1) {
                    try {
                        errorLine.html = highlight_1.highlight(d.language, errorLine.text, true).value;
                    }
                    catch (e) { }
                }
                for (var i = errorLine.errorCharStart; i >= 0; i--) {
                    if (STOP_CHARS.indexOf(errorLine.text.charAt(i)) > -1) {
                        break;
                    }
                    errorLine.errorCharStart = i;
                }
                for (var j = errorLine.errorCharStart; j <= errorLine.text.length; j++) {
                    if (STOP_CHARS.indexOf(errorLine.text.charAt(j)) > -1) {
                        break;
                    }
                    errorLine.errorLength++;
                }
                if (errorLine.errorLength === 0 && errorLine.errorCharStart > 0) {
                    errorLine.errorLength = 1;
                    errorLine.errorCharStart--;
                }
                d.lines.push(errorLine);
                if (errorLine.lineIndex > 0) {
                    var previousLine = {
                        lineIndex: errorLine.lineIndex - 1,
                        lineNumber: errorLine.lineNumber - 1,
                        text: srcLines[errorLine.lineIndex - 1],
                        html: htmlLines[errorLine.lineIndex - 1],
                        errorCharStart: -1,
                        errorLength: -1
                    };
                    if (previousLine.html.indexOf('class="hljs') === -1) {
                        try {
                            previousLine.html = highlight_1.highlight(d.language, previousLine.text, true).value;
                        }
                        catch (e) { }
                    }
                    d.lines.unshift(previousLine);
                }
                if (errorLine.lineIndex + 1 < srcLines.length) {
                    var nextLine = {
                        lineIndex: errorLine.lineIndex + 1,
                        lineNumber: errorLine.lineNumber + 1,
                        text: srcLines[errorLine.lineIndex + 1],
                        html: htmlLines[errorLine.lineIndex + 1],
                        errorCharStart: -1,
                        errorLength: -1
                    };
                    if (nextLine.html.indexOf('class="hljs') === -1) {
                        try {
                            nextLine.html = highlight_1.highlight(d.language, nextLine.text, true).value;
                        }
                        catch (e) { }
                    }
                    d.lines.push(nextLine);
                }
            }
            catch (e) {
                logger_1.Logger.debug("sass loadDiagnostic, " + e);
            }
        }
    }
    return [d];
}
exports.runSassDiagnostics = runSassDiagnostics;
var STOP_CHARS = ['', '\n', '\r', '\t', ' ', ':', ';', ',', '{', '}', '.', '#', '@', '!', '[', ']', '(', ')', '&', '+', '~', '^', '*', '$'];
