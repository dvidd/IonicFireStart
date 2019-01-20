"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serve = require("./serve");
var config = require("./util/config");
var watch = require("./watch");
var open = require("./util/open");
var notificationServer = require("./dev-server/notification-server");
var httpServer = require("./dev-server/http-server");
var liveReloadServer = require("./dev-server/live-reload");
var network = require("./util/network");
describe('test serve', function () {
    var configResults;
    var context;
    var openSpy;
    beforeEach(function () {
        context = {
            rootDir: '/',
            wwwDir: '/www',
            buildDir: '/build',
        };
        configResults = {
            httpPort: 8100,
            hostBaseUrl: 'http://localhost:8100',
            host: '0.0.0.0',
            rootDir: '/',
            wwwDir: '/www',
            buildDir: '/build',
            isCordovaServe: false,
            launchBrowser: true,
            launchLab: false,
            browserToLaunch: null,
            useLiveReload: true,
            liveReloadPort: 35729,
            notificationPort: 53703,
            useServerLogs: false,
            useProxy: true,
            notifyOnConsoleLog: false,
            devapp: false
        };
        spyOn(network, 'findClosestOpenPorts').and.callFake(function (host, ports) { return Promise.resolve(ports); });
        spyOn(notificationServer, 'createNotificationServer');
        spyOn(liveReloadServer, 'createLiveReloadServer');
        spyOn(httpServer, 'createHttpServer');
        spyOn(watch, 'watch').and.returnValue(Promise.resolve());
        openSpy = spyOn(open, 'default');
    });
    it('should work with no args on a happy path', function () {
        return serve.serve(context).then(function () {
            expect(network.findClosestOpenPorts).toHaveBeenCalledWith('0.0.0.0', [53703, 35729, 8100]);
            expect(notificationServer.createNotificationServer).toHaveBeenCalledWith(configResults);
            expect(liveReloadServer.createLiveReloadServer).toHaveBeenCalledWith(configResults);
            expect(httpServer.createHttpServer).toHaveBeenCalledWith(configResults);
            expect(openSpy.calls.mostRecent().args[0]).toEqual('http://localhost:8100');
            expect(openSpy.calls.mostRecent().args[1]).toEqual(null);
        });
    });
    it('should include ionicplatform in the browser url if platform is passed', function () {
        config.addArgv('--platform');
        config.addArgv('android');
        return serve.serve(context).then(function () {
            expect(network.findClosestOpenPorts).toHaveBeenCalledWith('0.0.0.0', [53703, 35729, 8100]);
            expect(notificationServer.createNotificationServer).toHaveBeenCalledWith(configResults);
            expect(liveReloadServer.createLiveReloadServer).toHaveBeenCalledWith(configResults);
            expect(httpServer.createHttpServer).toHaveBeenCalledWith(configResults);
            expect(openSpy.calls.mostRecent().args[0]).toEqual('http://localhost:8100?ionicplatform=android');
            expect(openSpy.calls.mostRecent().args[1]).toEqual(null);
        });
    });
    it('all args should be set in the config object and should be passed on to server functions', function () {
        config.setProcessArgs([]);
        config.addArgv('--serverlogs');
        configResults.useServerLogs = true;
        config.addArgv('--consolelogs');
        configResults.notifyOnConsoleLog = true;
        config.addArgv('--noproxy');
        configResults.useProxy = false;
        config.addArgv('--nolivereload');
        configResults.useLiveReload = false;
        config.addArgv('--lab');
        configResults.launchLab = true;
        config.addArgv('--browser');
        config.addArgv('safari');
        configResults.browserToLaunch = 'safari';
        config.addArgv('--port');
        config.addArgv('8101');
        configResults.httpPort = 8101;
        config.addArgv('--address');
        config.addArgv('127.0.0.1');
        configResults.host = '127.0.0.1';
        configResults.hostBaseUrl = 'http://127.0.0.1:8101';
        config.addArgv('--livereload-port');
        config.addArgv('35730');
        configResults.liveReloadPort = 35730;
        config.addArgv('--dev-logger-port');
        config.addArgv('53704');
        configResults.notificationPort = 53704;
        return serve.serve(context).then(function () {
            expect(network.findClosestOpenPorts).toHaveBeenCalledWith('127.0.0.1', [53704, 35730, 8101]);
            expect(notificationServer.createNotificationServer).toHaveBeenCalledWith(configResults);
            expect(liveReloadServer.createLiveReloadServer).toHaveBeenCalledWith(configResults);
            expect(httpServer.createHttpServer).toHaveBeenCalledWith(configResults);
            expect(openSpy.calls.mostRecent().args[0]).toEqual('http://127.0.0.1:8101/ionic-lab');
            expect(openSpy.calls.mostRecent().args[1]).toEqual('safari');
        });
    });
});
