"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var injector_1 = require("./injector");
var live_reload_1 = require("./live-reload");
var express = require("express");
var fs = require("fs");
var url = require("url");
var serve_config_1 = require("./serve-config");
var logger_1 = require("../logger/logger");
var proxyMiddleware = require("proxy-middleware");
var logger_diagnostics_1 = require("../logger/logger-diagnostics");
var Constants = require("../util/constants");
var helpers_1 = require("../util/helpers");
var ionic_project_1 = require("../util/ionic-project");
var lab_1 = require("./lab");
/**
 * Create HTTP server
 */
function createHttpServer(config) {
    var app = express();
    app.set('serveConfig', config);
    app.listen(config.httpPort, config.host, function () {
        logger_1.Logger.debug("listening on " + config.httpPort);
    });
    app.get('/', serveIndex);
    app.use('/', express.static(config.wwwDir));
    app.use("/" + serve_config_1.LOGGER_DIR, express.static(path.join(__dirname, '..', '..', 'bin'), { maxAge: 31536000 }));
    // Lab routes
    app.use(serve_config_1.IONIC_LAB_URL + '/static', express.static(path.join(__dirname, '..', '..', 'lab', 'static')));
    app.get(serve_config_1.IONIC_LAB_URL, lab_1.LabAppView);
    app.get(serve_config_1.IONIC_LAB_URL + '/api/v1/cordova', lab_1.ApiCordovaProject);
    app.get(serve_config_1.IONIC_LAB_URL + '/api/v1/app-config', lab_1.ApiPackageJson);
    app.get('/cordova.js', servePlatformResource, serveMockCordovaJS);
    app.get('/cordova_plugins.js', servePlatformResource);
    app.get('/plugins/*', servePlatformResource);
    if (config.useProxy) {
        setupProxies(app);
    }
    return app;
}
exports.createHttpServer = createHttpServer;
function setupProxies(app) {
    if (helpers_1.getBooleanPropertyValue(Constants.ENV_READ_CONFIG_JSON)) {
        ionic_project_1.getProjectJson().then(function (projectConfig) {
            for (var _i = 0, _a = projectConfig.proxies || []; _i < _a.length; _i++) {
                var proxy = _a[_i];
                var opts = url.parse(proxy.proxyUrl);
                if (proxy.proxyNoAgent) {
                    opts.agent = false;
                }
                opts.rejectUnauthorized = !(proxy.rejectUnauthorized === false);
                opts.cookieRewrite = proxy.cookieRewrite;
                app.use(proxy.path, proxyMiddleware(opts));
                logger_1.Logger.info('Proxy added:' + proxy.path + ' => ' + url.format(opts));
            }
        }).catch(function (err) {
            logger_1.Logger.error("Failed to read the projects ionic.config.json file: " + err.message);
        });
    }
}
/**
 * http responder for /index.html base entrypoint
 */
function serveIndex(req, res) {
    var config = req.app.get('serveConfig');
    // respond with the index.html file
    var indexFileName = path.join(config.wwwDir, process.env[Constants.ENV_VAR_HTML_TO_SERVE]);
    fs.readFile(indexFileName, function (err, indexHtml) {
        if (!indexHtml) {
            logger_1.Logger.error("Failed to load index.html");
            res.send('try again later');
            return;
        }
        if (config.useLiveReload) {
            indexHtml = live_reload_1.injectLiveReloadScript(indexHtml, req.hostname, config.liveReloadPort);
            indexHtml = injector_1.injectNotificationScript(config.rootDir, indexHtml, config.notifyOnConsoleLog, config.notificationPort);
        }
        indexHtml = logger_diagnostics_1.injectDiagnosticsHtml(config.buildDir, indexHtml);
        res.set('Content-Type', 'text/html');
        res.send(indexHtml);
    });
}
/**
 * http responder for cordova.js file
 */
function serveMockCordovaJS(req, res) {
    res.set('Content-Type', 'application/javascript');
    res.send('// mock cordova file during development');
}
/**
 * Middleware to serve platform resources
 */
function servePlatformResource(req, res, next) {
    var config = req.app.get('serveConfig');
    var userAgent = req.header('user-agent');
    var resourcePath = config.wwwDir;
    if (!config.isCordovaServe) {
        return next();
    }
    if (isUserAgentIOS(userAgent)) {
        resourcePath = path.join(config.rootDir, serve_config_1.IOS_PLATFORM_PATH);
    }
    else if (isUserAgentAndroid(userAgent)) {
        resourcePath = path.join(config.rootDir, serve_config_1.ANDROID_PLATFORM_PATH);
    }
    fs.stat(path.join(resourcePath, req.url), function (err, stats) {
        if (err) {
            return next();
        }
        res.sendFile(req.url, { root: resourcePath });
    });
}
function isUserAgentIOS(ua) {
    ua = ua.toLowerCase();
    return (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1);
}
function isUserAgentAndroid(ua) {
    ua = ua.toLowerCase();
    return ua.indexOf('android') > -1;
}
