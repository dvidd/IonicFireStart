"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cleanCss = require("clean-css");
function getCleanCssInstance(options) {
    return new cleanCss(options);
}
exports.getCleanCssInstance = getCleanCssInstance;
