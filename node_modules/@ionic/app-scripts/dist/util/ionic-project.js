"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var fs = require("fs");
var promisify_1 = require("./promisify");
var readFilePromise = promisify_1.promisify(fs.readFile);
function getProjectJson() {
    var projectFile = path.join(process.cwd(), 'ionic.config.json');
    return readFilePromise(projectFile).then(function (textString) {
        return JSON.parse(textString.toString());
    });
}
exports.getProjectJson = getProjectJson;
