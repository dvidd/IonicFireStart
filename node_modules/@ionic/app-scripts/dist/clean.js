"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("./util/errors");
var fs_extra_1 = require("fs-extra");
var logger_1 = require("./logger/logger");
function clean(context) {
    return new Promise(function (resolve, reject) {
        var logger = new logger_1.Logger('clean');
        try {
            logger_1.Logger.debug("[Clean] clean: cleaning " + context.buildDir);
            fs_extra_1.emptyDirSync(context.buildDir);
            logger.finish();
        }
        catch (ex) {
            reject(logger.fail(new errors_1.BuildError("Failed to clean directory " + context.buildDir + " - " + ex.message)));
        }
        resolve();
    });
}
exports.clean = clean;
