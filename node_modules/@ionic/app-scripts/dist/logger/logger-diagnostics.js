"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../util/helpers");
var highlight_1 = require("../highlight/highlight");
var path_1 = require("path");
var logger_1 = require("./logger");
var fs_1 = require("fs");
var chalk = require("chalk");
function printDiagnostics(context, diagnosticsType, diagnostics, consoleLogDiagnostics, writeHtmlDiagnostics) {
    if (diagnostics && diagnostics.length) {
        if (consoleLogDiagnostics) {
            diagnostics.forEach(consoleLogDiagnostic);
        }
        if (writeHtmlDiagnostics) {
            var content = diagnostics.map(generateDiagnosticHtml);
            var fileName = getDiagnosticsFileName(context.buildDir, diagnosticsType);
            fs_1.writeFileSync(fileName, content.join('\n'), { encoding: 'utf8' });
        }
    }
}
exports.printDiagnostics = printDiagnostics;
function consoleLogDiagnostic(d) {
    if (d.level === 'warn') {
        logger_1.Logger.warn(d.header);
    }
    else {
        logger_1.Logger.error(d.header);
    }
    logger_1.Logger.wordWrap([d.messageText]).forEach(function (m) {
        console.log(m);
    });
    console.log('');
    if (d.lines && d.lines.length) {
        var lines = prepareLines(d.lines, 'text');
        lines.forEach(function (l) {
            if (!isMeaningfulLine(l.text)) {
                return;
            }
            var msg = "L" + l.lineNumber + ":  ";
            while (msg.length < logger_1.Logger.INDENT.length) {
                msg = ' ' + msg;
            }
            var text = l.text;
            if (l.errorCharStart > -1) {
                text = consoleHighlightError(text, l.errorCharStart, l.errorLength);
            }
            msg = chalk.dim(msg);
            if (d.language === 'javascript') {
                msg += jsConsoleSyntaxHighlight(text);
            }
            else if (d.language === 'scss') {
                msg += cssConsoleSyntaxHighlight(text, l.errorCharStart);
            }
            else {
                msg += text;
            }
            console.log(msg);
        });
        console.log('');
    }
}
function consoleHighlightError(errorLine, errorCharStart, errorLength) {
    var rightSideChars = errorLine.length - errorCharStart + errorLength - 1;
    while (errorLine.length + logger_1.Logger.INDENT.length > logger_1.Logger.MAX_LEN) {
        if (errorCharStart > (errorLine.length - errorCharStart + errorLength) && errorCharStart > 5) {
            // larger on left side
            errorLine = errorLine.substr(1);
            errorCharStart--;
        }
        else if (rightSideChars > 1) {
            // larger on right side
            errorLine = errorLine.substr(0, errorLine.length - 1);
            rightSideChars--;
        }
        else {
            break;
        }
    }
    var lineChars = [];
    var lineLength = Math.max(errorLine.length, errorCharStart + errorLength);
    for (var i = 0; i < lineLength; i++) {
        var chr = errorLine.charAt(i);
        if (i >= errorCharStart && i < errorCharStart + errorLength) {
            chr = chalk.bgRed(chr === '' ? ' ' : chr);
        }
        lineChars.push(chr);
    }
    return lineChars.join('');
}
var diagnosticsHtmlCache = {};
function clearDiagnosticsCache() {
    diagnosticsHtmlCache = {};
}
exports.clearDiagnosticsCache = clearDiagnosticsCache;
function clearDiagnostics(context, type) {
    try {
        delete diagnosticsHtmlCache[type];
        fs_1.unlinkSync(getDiagnosticsFileName(context.buildDir, type));
    }
    catch (e) { }
}
exports.clearDiagnostics = clearDiagnostics;
function hasDiagnostics(buildDir) {
    loadBuildDiagnosticsHtml(buildDir);
    var keys = Object.keys(diagnosticsHtmlCache);
    for (var i = 0; i < keys.length; i++) {
        if (typeof diagnosticsHtmlCache[keys[i]] === 'string') {
            return true;
        }
    }
    return false;
}
exports.hasDiagnostics = hasDiagnostics;
function loadBuildDiagnosticsHtml(buildDir) {
    try {
        if (diagnosticsHtmlCache[exports.DiagnosticsType.TypeScript] === undefined) {
            diagnosticsHtmlCache[exports.DiagnosticsType.TypeScript] = fs_1.readFileSync(getDiagnosticsFileName(buildDir, exports.DiagnosticsType.TypeScript), 'utf8');
        }
    }
    catch (e) {
        diagnosticsHtmlCache[exports.DiagnosticsType.TypeScript] = false;
    }
    try {
        if (diagnosticsHtmlCache[exports.DiagnosticsType.Sass] === undefined) {
            diagnosticsHtmlCache[exports.DiagnosticsType.Sass] = fs_1.readFileSync(getDiagnosticsFileName(buildDir, exports.DiagnosticsType.Sass), 'utf8');
        }
    }
    catch (e) {
        diagnosticsHtmlCache[exports.DiagnosticsType.Sass] = false;
    }
}
function injectDiagnosticsHtml(buildDir, content) {
    if (!hasDiagnostics(buildDir)) {
        return content;
    }
    var contentStr = content.toString();
    var c = [];
    c.push("<div id=\"ion-diagnostics\">");
    // diagnostics content
    c.push(getDiagnosticsHtmlContent(buildDir));
    c.push("</div>"); // #ion-diagnostics
    var match = contentStr.match(/<body>(?![\s\S]*<body>)/i);
    if (match) {
        contentStr = contentStr.replace(match[0], match[0] + '\n' + c.join('\n'));
    }
    else {
        contentStr = c.join('\n') + contentStr;
    }
    return contentStr;
}
exports.injectDiagnosticsHtml = injectDiagnosticsHtml;
function getDiagnosticsHtmlContent(buildDir, includeDiagnosticsHtml) {
    var c = [];
    // diagnostics header
    c.push("\n    <div class=\"ion-diagnostics-header\">\n      <div class=\"ion-diagnostics-header-content\">\n        <div class=\"ion-diagnostics-header-inner\">Error</div>\n        <div class=\"ion-diagnostics-buttons\">\n          <button id=\"ion-diagnostic-close\">Close</button>\n        </div>\n      </div>\n    </div>\n  ");
    c.push("<div class=\"ion-diagnostics-content\">");
    if (includeDiagnosticsHtml) {
        c.push(includeDiagnosticsHtml);
    }
    loadBuildDiagnosticsHtml(buildDir);
    var keys = Object.keys(diagnosticsHtmlCache);
    for (var i = 0; i < keys.length; i++) {
        if (typeof diagnosticsHtmlCache[keys[i]] === 'string') {
            c.push(diagnosticsHtmlCache[keys[i]]);
        }
    }
    c.push("</div>");
    return c.join('\n');
}
exports.getDiagnosticsHtmlContent = getDiagnosticsHtmlContent;
function generateDiagnosticHtml(d) {
    var c = [];
    c.push("<div class=\"ion-diagnostic\">");
    c.push("<div class=\"ion-diagnostic-masthead\" title=\"" + helpers_1.escapeHtml(d.type) + " error: " + helpers_1.escapeHtml(d.code) + "\">");
    var title = helpers_1.titleCase(d.type) + " " + helpers_1.titleCase(d.level);
    c.push("<div class=\"ion-diagnostic-title\">" + helpers_1.escapeHtml(title) + "</div>");
    c.push("<div class=\"ion-diagnostic-message\" data-error-code=\"" + helpers_1.escapeHtml(d.type) + "-" + helpers_1.escapeHtml(d.code) + "\">" + helpers_1.escapeHtml(d.messageText) + "</div>");
    c.push("</div>"); // .ion-diagnostic-masthead
    c.push(generateCodeBlock(d));
    c.push("</div>"); // .ion-diagnostic
    return c.join('\n');
}
exports.generateDiagnosticHtml = generateDiagnosticHtml;
function generateCodeBlock(d) {
    var c = [];
    c.push("<div class=\"ion-diagnostic-file\">");
    c.push("<div class=\"ion-diagnostic-file-header\" title=\"" + helpers_1.escapeHtml(d.absFileName) + "\">" + helpers_1.escapeHtml(d.relFileName) + "</div>");
    if (d.lines && d.lines.length) {
        c.push("<div class=\"ion-diagnostic-blob\">");
        c.push("<table class=\"ion-diagnostic-table\">");
        prepareLines(d.lines, 'html').forEach(function (l) {
            c.push("<tr" + ((l.errorCharStart > -1) ? ' class="ion-diagnostic-error-line"' : '') + ">");
            c.push("<td class=\"ion-diagnostic-blob-num\" data-line-number=\"" + l.lineNumber + "\"></td>");
            c.push("<td class=\"ion-diagnostic-blob-code\">" + highlight_1.highlightError(l.html, l.errorCharStart, l.errorLength) + "</td>");
            c.push("</tr>");
        });
        c.push("</table>");
        c.push("</div>"); // .ion-diagnostic-blob
    }
    c.push("</div>"); // .ion-diagnostic-file
    return c.join('\n');
}
exports.generateCodeBlock = generateCodeBlock;
function jsConsoleSyntaxHighlight(text) {
    if (text.trim().startsWith('//')) {
        return chalk.dim(text);
    }
    var words = text.split(' ').map(function (word) {
        if (JS_KEYWORDS.indexOf(word) > -1) {
            return chalk.cyan(word);
        }
        return word;
    });
    return words.join(' ');
}
function cssConsoleSyntaxHighlight(text, errorCharStart) {
    var cssProp = true;
    var safeChars = 'abcdefghijklmnopqrstuvwxyz-_';
    var notProp = '.#,:}@$[]/*';
    var chars = [];
    for (var i = 0; i < text.length; i++) {
        var c = text.charAt(i);
        if (c === ';' || c === '{') {
            cssProp = true;
        }
        else if (notProp.indexOf(c) > -1) {
            cssProp = false;
        }
        if (cssProp && safeChars.indexOf(c.toLowerCase()) > -1) {
            chars.push(chalk.cyan(c));
            continue;
        }
        chars.push(c);
    }
    return chars.join('');
}
function prepareLines(orgLines, code) {
    var lines = JSON.parse(JSON.stringify(orgLines));
    for (var i = 0; i < 100; i++) {
        if (!eachLineHasLeadingWhitespace(lines, code)) {
            return lines;
        }
        for (var i_1 = 0; i_1 < lines.length; i_1++) {
            lines[i_1][code] = lines[i_1][code].substr(1);
            lines[i_1].errorCharStart--;
            if (!lines[i_1][code].length) {
                return lines;
            }
        }
    }
    return lines;
}
function eachLineHasLeadingWhitespace(lines, code) {
    if (!lines.length) {
        return false;
    }
    for (var i = 0; i < lines.length; i++) {
        if (!lines[i][code] || lines[i][code].length < 1) {
            return false;
        }
        var firstChar = lines[i][code].charAt(0);
        if (firstChar !== ' ' && firstChar !== '\t') {
            return false;
        }
    }
    return true;
}
var JS_KEYWORDS = [
    'abstract', 'any', 'as', 'break', 'boolean', 'case', 'catch', 'class',
    'console', 'const', 'continue', 'debugger', 'declare', 'default', 'delete',
    'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for', 'from',
    'function', 'get', 'if', 'import', 'in', 'implements', 'Infinity',
    'instanceof', 'let', 'module', 'namespace', 'NaN', 'new', 'number', 'null',
    'public', 'private', 'protected', 'require', 'return', 'static', 'set',
    'string', 'super', 'switch', 'this', 'throw', 'try', 'true', 'type',
    'typeof', 'undefined', 'var', 'void', 'with', 'while', 'yield',
];
function getDiagnosticsFileName(buildDir, type) {
    return path_1.join(buildDir, ".ion-diagnostic-" + type + ".html");
}
function isMeaningfulLine(line) {
    if (line) {
        line = line.trim();
        if (line.length) {
            return (MEH_LINES.indexOf(line) < 0);
        }
    }
    return false;
}
var MEH_LINES = [';', ':', '{', '}', '(', ')', '/**', '/*', '*/', '*', '({', '})'];
exports.DiagnosticsType = {
    TypeScript: 'typescript',
    Sass: 'sass',
    TsLint: 'tslint'
};
