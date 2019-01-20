"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hybrid_file_system_1 = require("./hybrid-file-system");
var helpers_1 = require("./helpers");
var instance = null;
function getInstance(writeToDisk) {
    if (!instance) {
        instance = new hybrid_file_system_1.HybridFileSystem(helpers_1.getContext().fileCache);
    }
    instance.setWriteToDisk(writeToDisk);
    return instance;
}
exports.getInstance = getInstance;
