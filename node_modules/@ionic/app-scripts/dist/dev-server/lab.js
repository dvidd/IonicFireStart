"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var cordova_config_1 = require("../util/cordova-config");
/**
 * Main Lab app view
 */
exports.LabAppView = function (req, res) {
    return res.sendFile('index.html', { root: path.join(__dirname, '..', '..', 'lab') });
};
exports.ApiCordovaProject = function (req, res) {
    cordova_config_1.buildCordovaConfig(function (err) {
        res.status(400).json({ status: 'error', message: 'Unable to load config.xml' });
    }, function (config) {
        res.json(config);
    });
};
exports.ApiPackageJson = function (req, res) {
    res.sendFile(path.join(process.cwd(), 'package.json'), {
        headers: {
            'content-type': 'application/json'
        }
    });
};
