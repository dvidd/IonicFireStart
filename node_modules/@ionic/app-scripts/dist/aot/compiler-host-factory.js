"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_host_1 = require("./compiler-host");
var hybrid_file_system_factory_1 = require("../util/hybrid-file-system-factory");
var instance = null;
function getInMemoryCompilerHostInstance(options) {
    if (!instance) {
        instance = new compiler_host_1.InMemoryCompilerHost(options, hybrid_file_system_factory_1.getInstance(false));
    }
    return instance;
}
exports.getInMemoryCompilerHostInstance = getInMemoryCompilerHostInstance;
