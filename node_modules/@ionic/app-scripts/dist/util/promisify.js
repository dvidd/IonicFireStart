"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @example: const rReadFile = promisify<Buffer, string>(fs.readFile);
 */
exports.promisify = function (func) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            func.apply(void 0, args.concat([function (err, response) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(response);
                }]));
        });
    };
};
