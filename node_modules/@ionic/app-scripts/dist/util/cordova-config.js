"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var xml2js = require("xml2js");
var lastConfig;
/**
 * Parse and build a CordovaProject config object by parsing the
 * config.xml file in the project root.
 */
exports.buildCordovaConfig = function (errCb, cb) {
    var parser = new xml2js.Parser();
    fs.readFile('config.xml', function (err, data) {
        if (err) {
            errCb(err);
            return;
        }
        parser.parseString(data, function (err, result) {
            if (err) {
                errCb(err);
                return;
            }
            cb(exports.parseConfig(result));
        });
    });
};
exports.parseConfig = function (parsedConfig) {
    if (!parsedConfig.widget) {
        return {};
    }
    var widget = parsedConfig.widget;
    // Widget attrs are defined on the <widget> tag
    var widgetAttrs = widget.$;
    var config = {
        name: widget.name[0]
    };
    if (widgetAttrs) {
        config.id = widgetAttrs.id;
        config.version = widgetAttrs.version;
    }
    lastConfig = config;
    return config;
};
