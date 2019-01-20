"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var Constants = require("../util/constants");
var helpers_1 = require("../util/helpers");
// For webapps, we pretty much need all fonts to be available because
// the web server deployment never knows which browser/platform is
// opening the app. Additionally, webapps will request fonts on-demand,
// so having them all sit in the www/assets/fonts directory doesn’t
// hurt anything if it’s never being requested.
// However, with Cordova, the entire directory gets bundled and
// shipped in the ipa/apk, but we also know exactly which platform
// is opening the webapp. For this reason we can safely delete font
// files we know would never be opened by the platform. So app-scripts
// will continue to copy all font files over, but the cordova build
// process would delete those we know are useless and just taking up
// space. End goal is that the Cordova ipa/apk filesize is smaller.
// Font Format Support:
// ttf: http://caniuse.com/#feat=ttf
// woff: http://caniuse.com/#feat=woff
// woff2: http://caniuse.com/#feat=woff2
function removeUnusedFonts(context) {
    var fontDir = helpers_1.getStringPropertyValue(Constants.ENV_VAR_FONTS_DIR);
    return helpers_1.readDirAsync(fontDir).then(function (fileNames) {
        fileNames = fileNames.sort();
        var toPurge = getFontFileNamesToPurge(context.target, context.platform, fileNames);
        var fullPaths = toPurge.map(function (fileName) { return path_1.join(fontDir, fileName); });
        var promises = fullPaths.map(function (fullPath) { return helpers_1.unlinkAsync(fullPath); });
        return Promise.all(promises);
    });
}
exports.removeUnusedFonts = removeUnusedFonts;
function getFontFileNamesToPurge(target, platform, fileNames) {
    if (target !== Constants.CORDOVA) {
        return [];
    }
    var filesToDelete = new Set();
    for (var _i = 0, fileNames_1 = fileNames; _i < fileNames_1.length; _i++) {
        var fileName = fileNames_1[_i];
        if (platform === 'android') {
            // remove noto-sans, roboto, and non-woff ionicons
            if (fileName.startsWith('noto-sans') || fileName.startsWith('roboto') || (isIonicons(fileName) && !isWoof(fileName))) {
                filesToDelete.add(fileName);
            }
        }
        else if (platform === 'ios') {
            // remove noto-sans, non-woff ionicons
            if (fileName.startsWith('noto-sans') || (fileName.startsWith('roboto') && !isWoof(fileName)) || (isIonicons(fileName) && !isWoof(fileName))) {
                filesToDelete.add(fileName);
            }
        }
        // for now don't bother deleting anything for windows, need to get some info first
    }
    return Array.from(filesToDelete);
}
exports.getFontFileNamesToPurge = getFontFileNamesToPurge;
function isIonicons(fileName) {
    return fileName.startsWith('ionicons');
}
// woof woof
function isWoof(fileName) {
    return path_1.extname(fileName) === '.woff' || path_1.extname(fileName) === '.woff2';
}
