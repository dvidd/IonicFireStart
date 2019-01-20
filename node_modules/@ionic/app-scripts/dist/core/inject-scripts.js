"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ionic_global_1 = require("./ionic-global");
var helpers_1 = require("../util/helpers");
var path_1 = require("path");
function updateIndexHtml(context) {
    var indexPath = path_1.join(context.wwwDir, context.wwwIndex);
    return helpers_1.readFileAsync(indexPath).then(function (indexHtml) {
        if (!indexHtml) {
            return Promise.resolve(null);
        }
        indexHtml = injectCoreScripts(context, indexHtml);
        return helpers_1.writeFileAsync(indexPath, indexHtml);
    });
}
exports.updateIndexHtml = updateIndexHtml;
function injectCoreScripts(context, indexHtml) {
    var inject = [];
    inject.push("  <script data-ionic=\"inject\">");
    inject.push("    " + ionic_global_1.buildIonicGlobal(context));
    inject.push("  </script>");
    return injectCoreHtml(indexHtml, inject.join('\n'));
}
exports.injectCoreScripts = injectCoreScripts;
function injectCoreHtml(indexHtml, inject) {
    // see if we can find an existing ionic script tag and replace it entirely
    var existingTag = indexHtml.match(/<script data-ionic="inject">[\s\S]*?<\/script>/gi);
    if (existingTag) {
        return indexHtml.replace(existingTag[0], inject.trim());
    }
    // see if we can find the head tag and inject it immediate below it
    var headTag = indexHtml.match(/<head[^>]*>/gi);
    if (headTag) {
        return indexHtml.replace(headTag[0], headTag[0] + "\n" + inject);
    }
    // see if we can find the html tag and inject it immediate below it
    var htmlTag = indexHtml.match(/<html[^>]*>/gi);
    if (htmlTag) {
        return indexHtml.replace(htmlTag[0], htmlTag[0] + "\n" + inject);
    }
    return inject + "\n" + indexHtml;
}
exports.injectCoreHtml = injectCoreHtml;
