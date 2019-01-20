"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_chunks_plugins_1 = require("./common-chunks-plugins");
exports.getCommonChunksPlugin = common_chunks_plugins_1.getCommonChunksPlugin;
var ionic_environment_plugin_1 = require("./ionic-environment-plugin");
var source_mapper_1 = require("./source-mapper");
var helpers_1 = require("../util/helpers");
function getIonicEnvironmentPlugin() {
    var context = helpers_1.getContext();
    return new ionic_environment_plugin_1.IonicEnvironmentPlugin(context, true);
}
exports.getIonicEnvironmentPlugin = getIonicEnvironmentPlugin;
function getSourceMapperFunction() {
    return source_mapper_1.provideCorrectSourcePath;
}
exports.getSourceMapperFunction = getSourceMapperFunction;
