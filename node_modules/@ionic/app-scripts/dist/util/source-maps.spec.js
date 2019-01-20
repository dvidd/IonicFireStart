"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var Constants = require("./constants");
var sourceMaps = require("./source-maps");
var helpers = require("./helpers");
describe('source maps', function () {
    describe('purgeSourceMapsIfNeeded', function () {
        it('should copy files first, then purge the files', function () { return __awaiter(_this, void 0, void 0, function () {
            var knownFileNames, context, copyFileSpy, unlinkFileSpy, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spyOn(helpers, helpers.getBooleanPropertyValue.name).and.callFake(function (argument) {
                            if (argument === Constants.ENV_VAR_MOVE_SOURCE_MAPS) {
                                return true;
                            }
                        });
                        spyOn(helpers, helpers.mkDirpAsync.name).and.returnValue(Promise.resolve());
                        knownFileNames = ['0.js', '0.js.map', '1.js', '1.js.map', 'main.js', 'main.js.map', 'vendor.js', 'vendor.js.map', 'main.css', 'polyfills.js', 'sw-toolbox.js', 'main.css', 'main.css.map'];
                        spyOn(helpers, helpers.readDirAsync.name).and.returnValue(Promise.resolve(knownFileNames));
                        context = {
                            sourcemapDir: path_1.join(process.cwd(), 'sourceMapDir'),
                            buildDir: path_1.join(process.cwd(), 'www', 'build')
                        };
                        copyFileSpy = spyOn(helpers, helpers.copyFileAsync.name).and.returnValue(Promise.resolve());
                        unlinkFileSpy = spyOn(helpers, helpers.unlinkAsync.name).and.returnValue(Promise.resolve());
                        return [4 /*yield*/, sourceMaps.copySourcemaps(context, true)];
                    case 1:
                        result = _a.sent();
                        expect(helpers.mkDirpAsync).toHaveBeenCalledTimes(1);
                        expect(helpers.mkDirpAsync).toHaveBeenCalledWith(context.sourcemapDir);
                        expect(helpers.readDirAsync).toHaveBeenCalledTimes(1);
                        expect(helpers.readDirAsync).toHaveBeenLastCalledWith(context.buildDir);
                        expect(helpers.copyFileAsync).toHaveBeenCalledTimes(3);
                        expect(copyFileSpy.calls.all()[0].args[0]).toEqual(path_1.join(context.buildDir, '0.js.map'));
                        expect(copyFileSpy.calls.all()[0].args[1]).toEqual(path_1.join(context.sourcemapDir, '0.js.map'));
                        expect(copyFileSpy.calls.all()[1].args[0]).toEqual(path_1.join(context.buildDir, '1.js.map'));
                        expect(copyFileSpy.calls.all()[1].args[1]).toEqual(path_1.join(context.sourcemapDir, '1.js.map'));
                        expect(copyFileSpy.calls.all()[2].args[0]).toEqual(path_1.join(context.buildDir, 'main.js.map'));
                        expect(copyFileSpy.calls.all()[2].args[1]).toEqual(path_1.join(context.sourcemapDir, 'main.js.map'));
                        expect(helpers.unlinkAsync).toHaveBeenCalledTimes(5);
                        expect(unlinkFileSpy.calls.all()[0].args[0]).toEqual(path_1.join(context.buildDir, '0.js.map'));
                        expect(unlinkFileSpy.calls.all()[1].args[0]).toEqual(path_1.join(context.buildDir, '1.js.map'));
                        expect(unlinkFileSpy.calls.all()[2].args[0]).toEqual(path_1.join(context.buildDir, 'main.js.map'));
                        expect(unlinkFileSpy.calls.all()[3].args[0]).toEqual(path_1.join(context.buildDir, 'vendor.js.map'));
                        expect(unlinkFileSpy.calls.all()[4].args[0]).toEqual(path_1.join(context.buildDir, 'main.css.map'));
                        return [2 /*return*/];
                }
            });
        }); });
        it('should copy the files but not purge them after', function () { return __awaiter(_this, void 0, void 0, function () {
            var knownFileNames, context, copyFileSpy, unlinkFileSpy, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spyOn(helpers, helpers.getBooleanPropertyValue.name).and.callFake(function (argument) {
                            if (argument === Constants.ENV_VAR_MOVE_SOURCE_MAPS) {
                                return true;
                            }
                        });
                        spyOn(helpers, helpers.mkDirpAsync.name).and.returnValue(Promise.resolve());
                        knownFileNames = ['0.js', '0.js.map', '1.js', '1.js.map', 'main.js', 'main.js.map', 'vendor.js', 'vendor.js.map', 'main.css', 'polyfills.js', 'sw-toolbox.js', 'main.css', 'main.css.map'];
                        spyOn(helpers, helpers.readDirAsync.name).and.returnValue(Promise.resolve(knownFileNames));
                        context = {
                            sourcemapDir: path_1.join(process.cwd(), 'sourceMapDir'),
                            buildDir: path_1.join(process.cwd(), 'www', 'build')
                        };
                        copyFileSpy = spyOn(helpers, helpers.copyFileAsync.name).and.returnValue(Promise.resolve());
                        unlinkFileSpy = spyOn(helpers, helpers.unlinkAsync.name).and.returnValue(Promise.resolve());
                        return [4 /*yield*/, sourceMaps.copySourcemaps(context, false)];
                    case 1:
                        result = _a.sent();
                        expect(helpers.mkDirpAsync).toHaveBeenCalledTimes(1);
                        expect(helpers.mkDirpAsync).toHaveBeenCalledWith(context.sourcemapDir);
                        expect(helpers.readDirAsync).toHaveBeenCalledTimes(1);
                        expect(helpers.readDirAsync).toHaveBeenLastCalledWith(context.buildDir);
                        expect(helpers.copyFileAsync).toHaveBeenCalledTimes(3);
                        expect(copyFileSpy.calls.all()[0].args[0]).toEqual(path_1.join(context.buildDir, '0.js.map'));
                        expect(copyFileSpy.calls.all()[0].args[1]).toEqual(path_1.join(context.sourcemapDir, '0.js.map'));
                        expect(copyFileSpy.calls.all()[1].args[0]).toEqual(path_1.join(context.buildDir, '1.js.map'));
                        expect(copyFileSpy.calls.all()[1].args[1]).toEqual(path_1.join(context.sourcemapDir, '1.js.map'));
                        expect(copyFileSpy.calls.all()[2].args[0]).toEqual(path_1.join(context.buildDir, 'main.js.map'));
                        expect(copyFileSpy.calls.all()[2].args[1]).toEqual(path_1.join(context.sourcemapDir, 'main.js.map'));
                        expect(helpers.unlinkAsync).toHaveBeenCalledTimes(0);
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
