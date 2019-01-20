"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
function findClosestOpenPorts(host, ports) {
    var promises = ports.map(function (port) { return findClosestOpenPort(host, port); });
    return Promise.all(promises);
}
exports.findClosestOpenPorts = findClosestOpenPorts;
function findClosestOpenPort(host, port) {
    function t(portToCheck) {
        return isPortTaken(host, portToCheck).then(function (isTaken) {
            if (!isTaken) {
                return portToCheck;
            }
            return t(portToCheck + 1);
        });
    }
    return t(port);
}
exports.findClosestOpenPort = findClosestOpenPort;
function isPortTaken(host, port) {
    return new Promise(function (resolve, reject) {
        var tester = net.createServer()
            .once('error', function (err) {
            if (err.code !== 'EADDRINUSE') {
                return resolve(true);
            }
            resolve(true);
        })
            .once('listening', function () {
            tester.once('close', function () {
                resolve(false);
            })
                .close();
        })
            .listen(port, host);
    });
}
exports.isPortTaken = isPortTaken;
