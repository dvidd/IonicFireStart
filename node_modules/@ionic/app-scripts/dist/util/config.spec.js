"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var helpers = require("./helpers");
var config = require("./config");
var Constants = require("./constants");
describe('config', function () {
    describe('config.generateContext', function () {
        it('should set isWatch true with isWatch true context', function () {
            var context = config.generateContext({
                isWatch: true
            });
            expect(context.isWatch).toEqual(true);
        });
        it('should set isWatch false by default', function () {
            var context = config.generateContext();
            expect(context.isWatch).toEqual(false);
        });
        it('should set isProd false with isProd false context', function () {
            var context = config.generateContext({
                isProd: false
            });
            expect(context.isProd).toEqual(false);
        });
        it('should set default bundler when invalid value', function () {
            var context = config.generateContext();
            expect(context.bundler).toEqual('webpack');
        });
        it('should set default bundler when not set', function () {
            var context = config.generateContext();
            expect(context.bundler).toEqual('webpack');
        });
        it('should set isProd by default', function () {
            var context = config.generateContext();
            expect(context.isProd).toEqual(false);
        });
        it('should create an object when passed nothing', function () {
            var context = config.generateContext();
            expect(context).toBeDefined();
        });
        it('should set the correct defaults for a dev build', function () {
            // arrange
            var fakeConfig = {};
            config.setProcessEnv(fakeConfig);
            // act
            var context = config.generateContext({
                isProd: false
            });
            // assert
            expect(context.isProd).toEqual(false);
            expect(context.runAot).toEqual(false);
            expect(context.runMinifyJs).toEqual(false);
            expect(context.runMinifyCss).toEqual(false);
            expect(context.optimizeJs).toEqual(false);
            expect(fakeConfig[Constants.ENV_VAR_IONIC_ENV]).toEqual(Constants.ENV_VAR_DEV);
            expect(fakeConfig[Constants.ENV_VAR_IONIC_AOT]).toEqual('false');
            expect(fakeConfig[Constants.ENV_VAR_IONIC_MINIFY_JS]).toEqual('false');
            expect(fakeConfig[Constants.ENV_VAR_IONIC_MINIFY_CSS]).toEqual('false');
            expect(fakeConfig[Constants.ENV_VAR_IONIC_OPTIMIZE_JS]).toEqual('false');
            expect(context.rootDir).toEqual(process.cwd());
            expect(context.tmpDir).toEqual(path_1.join(process.cwd(), Constants.TMP_DIR));
            expect(context.srcDir).toEqual(path_1.join(process.cwd(), Constants.SRC_DIR));
            expect(fakeConfig[Constants.ENV_VAR_DEEPLINKS_DIR]).toEqual(context.srcDir);
            expect(context.wwwDir).toEqual(path_1.join(process.cwd(), Constants.WWW_DIR));
            expect(context.wwwIndex).toEqual('index.html');
            expect(context.buildDir).toEqual(path_1.join(process.cwd(), Constants.WWW_DIR, Constants.BUILD_DIR));
            expect(fakeConfig[Constants.ENV_VAR_FONTS_DIR]).toEqual(path_1.join(context.wwwDir, 'assets', 'fonts'));
            expect(context.pagesDir).toEqual(path_1.join(context.srcDir, 'pages'));
            expect(context.componentsDir).toEqual(path_1.join(context.srcDir, 'components'));
            expect(context.directivesDir).toEqual(path_1.join(context.srcDir, 'directives'));
            expect(context.pipesDir).toEqual(path_1.join(context.srcDir, 'pipes'));
            expect(context.providersDir).toEqual(path_1.join(context.srcDir, 'providers'));
            expect(context.nodeModulesDir).toEqual(path_1.join(process.cwd(), Constants.NODE_MODULES));
            expect(context.ionicAngularDir).toEqual(path_1.join(process.cwd(), Constants.NODE_MODULES, Constants.IONIC_ANGULAR));
            expect(fakeConfig[Constants.ENV_VAR_ANGULAR_CORE_DIR]).toEqual(path_1.join(process.cwd(), Constants.NODE_MODULES, Constants.AT_ANGULAR, 'core'));
            expect(fakeConfig[Constants.ENV_VAR_TYPESCRIPT_DIR]).toEqual(path_1.join(process.cwd(), Constants.NODE_MODULES, Constants.TYPESCRIPT));
            expect(context.coreCompilerFilePath).toEqual(path_1.join(context.ionicAngularDir, 'compiler'));
            expect(context.coreDir).toEqual(context.ionicAngularDir);
            expect(fakeConfig[Constants.ENV_VAR_RXJS_DIR]).toEqual(path_1.join(process.cwd(), Constants.NODE_MODULES, Constants.RXJS));
            expect(fakeConfig[Constants.ENV_VAR_IONIC_ANGULAR_TEMPLATE_DIR]).toEqual(path_1.join(context.ionicAngularDir, 'templates'));
            expect(context.platform).toEqual(null);
            expect(context.target).toEqual(null);
            expect(fakeConfig[Constants.ENV_VAR_IONIC_ANGULAR_ENTRY_POINT]).toEqual(path_1.join(context.ionicAngularDir, 'index.js'));
            expect(fakeConfig[Constants.ENV_VAR_APP_SCRIPTS_DIR]).toEqual(path_1.join(__dirname, '..', '..'));
            expect(fakeConfig[Constants.ENV_VAR_GENERATE_SOURCE_MAP]).toEqual('true');
            expect(fakeConfig[Constants.ENV_VAR_SOURCE_MAP_TYPE]).toEqual(Constants.SOURCE_MAP_TYPE_EXPENSIVE);
            expect(fakeConfig[Constants.ENV_TS_CONFIG]).toEqual(path_1.join(process.cwd(), 'tsconfig.json'));
            expect(fakeConfig[Constants.ENV_READ_CONFIG_JSON]).toEqual('true');
            expect(fakeConfig[Constants.ENV_APP_ENTRY_POINT]).toEqual(path_1.join(context.srcDir, 'app', 'main.ts'));
            expect(fakeConfig[Constants.ENV_APP_NG_MODULE_PATH]).toEqual(path_1.join(context.srcDir, 'app', 'app.module.ts'));
            expect(fakeConfig[Constants.ENV_APP_NG_MODULE_CLASS]).toEqual('AppModule');
            expect(fakeConfig[Constants.ENV_GLOB_UTIL]).toEqual(path_1.join(fakeConfig[Constants.ENV_VAR_APP_SCRIPTS_DIR], 'dist', 'util', 'glob-util.js'));
            expect(fakeConfig[Constants.ENV_CLEAN_BEFORE_COPY]).toBeFalsy();
            expect(fakeConfig[Constants.ENV_OUTPUT_JS_FILE_NAME]).toEqual('main.js');
            expect(fakeConfig[Constants.ENV_OUTPUT_CSS_FILE_NAME]).toEqual('main.css');
            expect(fakeConfig[Constants.ENV_WEBPACK_FACTORY]).toEqual(path_1.join(fakeConfig[Constants.ENV_VAR_APP_SCRIPTS_DIR], 'dist', 'webpack', 'ionic-webpack-factory.js'));
            expect(fakeConfig[Constants.ENV_WEBPACK_LOADER]).toEqual(path_1.join(fakeConfig[Constants.ENV_VAR_APP_SCRIPTS_DIR], 'dist', 'webpack', 'loader.js'));
            expect(fakeConfig[Constants.ENV_AOT_WRITE_TO_DISK]).toBeFalsy();
            expect(fakeConfig[Constants.ENV_PRINT_WEBPACK_DEPENDENCY_TREE]).toBeFalsy();
            expect(fakeConfig[Constants.ENV_TYPE_CHECK_ON_LINT]).toBeFalsy();
            expect(fakeConfig[Constants.ENV_BAIL_ON_LINT_ERROR]).toBeFalsy();
            expect(fakeConfig[Constants.ENV_ENABLE_LINT]).toEqual('true');
            expect(fakeConfig[Constants.ENV_DISABLE_LOGGING]).toBeFalsy();
            expect(fakeConfig[Constants.ENV_START_WATCH_TIMEOUT]).toEqual('3000');
            expect(fakeConfig[Constants.ENV_NG_MODULE_FILE_NAME_SUFFIX]).toEqual('.module.ts');
            expect(fakeConfig[Constants.ENV_POLYFILL_FILE_NAME]).toEqual('polyfills.js');
            expect(fakeConfig[Constants.ENV_ACTION_SHEET_CONTROLLER_CLASSNAME]).toEqual('ActionSheetController');
            expect(fakeConfig[Constants.ENV_ACTION_SHEET_CONTROLLER_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'action-sheet', 'action-sheet-controller.js'));
            expect(fakeConfig[Constants.ENV_ACTION_SHEET_VIEW_CONTROLLER_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'action-sheet', 'action-sheet.js'));
            expect(fakeConfig[Constants.ENV_ACTION_SHEET_COMPONENT_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'action-sheet', 'action-sheet-component.js'));
            expect(fakeConfig[Constants.ENV_ACTION_SHEET_COMPONENT_FACTORY_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'action-sheet', 'action-sheet-component.ngfactory.js'));
            expect(fakeConfig[Constants.ENV_ALERT_CONTROLLER_CLASSNAME]).toEqual('AlertController');
            expect(fakeConfig[Constants.ENV_ALERT_CONTROLLER_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'alert', 'alert-controller.js'));
            expect(fakeConfig[Constants.ENV_ALERT_VIEW_CONTROLLER_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'alert', 'alert.js'));
            expect(fakeConfig[Constants.ENV_ALERT_COMPONENT_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'alert', 'alert-component.js'));
            expect(fakeConfig[Constants.ENV_ALERT_COMPONENT_FACTORY_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'alert', 'alert-component.ngfactory.js'));
            expect(fakeConfig[Constants.ENV_APP_ROOT_COMPONENT_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'app', 'app-root.js'));
            expect(fakeConfig[Constants.ENV_LOADING_CONTROLLER_CLASSNAME]).toEqual('LoadingController');
            expect(fakeConfig[Constants.ENV_LOADING_CONTROLLER_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'loading', 'loading-controller.js'));
            expect(fakeConfig[Constants.ENV_LOADING_VIEW_CONTROLLER_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'loading', 'loading.js'));
            expect(fakeConfig[Constants.ENV_LOADING_COMPONENT_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'loading', 'loading-component.js'));
            expect(fakeConfig[Constants.ENV_LOADING_COMPONENT_FACTORY_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'loading', 'loading-component.ngfactory.js'));
            expect(fakeConfig[Constants.ENV_MODAL_CONTROLLER_CLASSNAME]).toEqual('ModalController');
            expect(fakeConfig[Constants.ENV_MODAL_CONTROLLER_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'modal', 'modal-controller.js'));
            expect(fakeConfig[Constants.ENV_MODAL_VIEW_CONTROLLER_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'modal', 'modal.js'));
            expect(fakeConfig[Constants.ENV_MODAL_COMPONENT_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'modal', 'modal-component.js'));
            expect(fakeConfig[Constants.ENV_MODAL_COMPONENT_FACTORY_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'modal', 'modal-component.ngfactory.js'));
            expect(fakeConfig[Constants.ENV_PICKER_CONTROLLER_CLASSNAME]).toEqual('PickerController');
            expect(fakeConfig[Constants.ENV_PICKER_CONTROLLER_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'picker', 'picker-controller.js'));
            expect(fakeConfig[Constants.ENV_PICKER_VIEW_CONTROLLER_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'picker', 'picker.js'));
            expect(fakeConfig[Constants.ENV_PICKER_COMPONENT_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'picker', 'picker-component.js'));
            expect(fakeConfig[Constants.ENV_PICKER_COMPONENT_FACTORY_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'picker', 'picker-component.ngfactory.js'));
            expect(fakeConfig[Constants.ENV_POPOVER_CONTROLLER_CLASSNAME]).toEqual('PopoverController');
            expect(fakeConfig[Constants.ENV_POPOVER_CONTROLLER_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'popover', 'popover-controller.js'));
            expect(fakeConfig[Constants.ENV_POPOVER_VIEW_CONTROLLER_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'popover', 'popover.js'));
            expect(fakeConfig[Constants.ENV_POPOVER_COMPONENT_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'popover', 'popover-component.js'));
            expect(fakeConfig[Constants.ENV_POPOVER_COMPONENT_FACTORY_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'popover', 'popover-component.ngfactory.js'));
            expect(fakeConfig[Constants.ENV_TOAST_CONTROLLER_CLASSNAME]).toEqual('ToastController');
            expect(fakeConfig[Constants.ENV_TOAST_CONTROLLER_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'toast', 'toast-controller.js'));
            expect(fakeConfig[Constants.ENV_TOAST_VIEW_CONTROLLER_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'toast', 'toast.js'));
            expect(fakeConfig[Constants.ENV_TOAST_COMPONENT_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'toast', 'toast-component.js'));
            expect(fakeConfig[Constants.ENV_TOAST_COMPONENT_FACTORY_PATH]).toEqual(path_1.join(context.ionicAngularDir, 'components', 'toast', 'toast-component.ngfactory.js'));
            expect(fakeConfig[Constants.ENV_PARSE_DEEPLINKS]).toBeTruthy();
            expect(fakeConfig[Constants.ENV_SKIP_IONIC_ANGULAR_VERSION]).toEqual('false');
            expect(context.bundler).toEqual('webpack');
        });
        it('should set defaults for a prod build', function () {
            // arrange
            var fakeConfig = {};
            config.setProcessEnv(fakeConfig);
            // act
            var context = config.generateContext({
                isProd: true
            });
            // assert
            expect(context.isProd).toEqual(true);
            expect(context.runAot).toEqual(true);
            expect(context.runMinifyJs).toEqual(true);
            expect(context.runMinifyCss).toEqual(true);
            expect(context.optimizeJs).toEqual(true);
            expect(fakeConfig[Constants.ENV_VAR_IONIC_AOT]).toEqual('true');
            expect(fakeConfig[Constants.ENV_VAR_IONIC_MINIFY_JS]).toEqual('true');
            expect(fakeConfig[Constants.ENV_VAR_IONIC_MINIFY_CSS]).toEqual('true');
            expect(fakeConfig[Constants.ENV_VAR_IONIC_OPTIMIZE_JS]).toEqual('true');
            expect(fakeConfig[Constants.ENV_VAR_IONIC_ENV]).toEqual(Constants.ENV_VAR_PROD);
            expect(fakeConfig[Constants.ENV_VAR_GENERATE_SOURCE_MAP]).toBeFalsy();
        });
        it('should override console', function () {
            var originalDebug = console.debug;
            var originalError = console.error;
            var originalInfo = console.info;
            var originalLog = console.log;
            var originalTrace = console.trace;
            var originalWarn = console.warn;
            var fakeConfig = {};
            config.setProcessEnv(fakeConfig);
            spyOn(helpers, helpers.getBooleanPropertyValue.name).and.returnValue(true);
            config.generateContext({
                isProd: true
            });
            expect(console.debug).not.toEqual(originalDebug);
            expect(console.error).not.toEqual(originalError);
            expect(console.info).not.toEqual(originalInfo);
            expect(console.log).not.toEqual(originalLog);
            expect(console.trace).not.toEqual(originalTrace);
            expect(console.warn).not.toEqual(originalWarn);
        });
    });
    describe('config.replacePathVars', function () {
        it('should interpolated value when string', function () {
            var context = {
                srcDir: 'src',
            };
            var rtn = config.replacePathVars(context, '{{SRC}}');
            expect(rtn).toEqual('src');
        });
        it('should interpolated values in string array', function () {
            var context = {
                wwwDir: 'www',
                srcDir: 'src',
            };
            var filePaths = ['{{SRC}}', '{{WWW}}'];
            var rtn = config.replacePathVars(context, filePaths);
            expect(rtn).toEqual(['src', 'www']);
        });
        it('should interpolated values in key value pair', function () {
            var context = {
                wwwDir: 'www',
                srcDir: 'src',
            };
            var filePaths = {
                src: '{{SRC}}',
                www: '{{WWW}}'
            };
            var rtn = config.replacePathVars(context, filePaths);
            expect(rtn).toEqual({
                src: 'src',
                www: 'www'
            });
        });
    });
    describe('config.getConfigValue', function () {
        it('should get arg full value', function () {
            config.addArgv('--full');
            config.addArgv('fullArgValue');
            config.addArgv('-s');
            config.addArgv('shortArgValue');
            config.setProcessEnvVar('ENV_VAR', 'myProcessEnvVar');
            config.setAppPackageJsonData({ config: { config_prop: 'myPackageConfigVal' } });
            var val = config.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('fullArgValue');
        });
        it('should get arg short value', function () {
            config.addArgv('-s');
            config.addArgv('shortArgValue');
            config.setProcessEnvVar('ENV_VAR', 'myProcessEnvVar');
            config.setAppPackageJsonData({ config: { config_prop: 'myPackageConfigVal' } });
            var val = config.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('shortArgValue');
        });
        it('should get envVar value', function () {
            config.setProcessEnvVar('ENV_VAR', 'myProcessEnvVar');
            config.setAppPackageJsonData({ config: { config_prop: 'myPackageConfigVal' } });
            var val = config.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('myProcessEnvVar');
        });
        it('should get package.json config value', function () {
            config.setAppPackageJsonData({ config: { config_prop: 'myPackageConfigVal' } });
            var val = config.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('myPackageConfigVal');
        });
        it('should get default value', function () {
            var val = config.getConfigValue(context, '--full', '-s', 'ENV_VAR', 'config_prop', 'defaultValue');
            expect(val).toEqual('defaultValue');
        });
    });
    describe('config.bundlerStrategy', function () {
        it('should get webpack with invalid env var', function () {
            config.setProcessEnv({
                ionic_bundler: 'bobsBundler'
            });
            var bundler = config.bundlerStrategy(context);
            expect(bundler).toEqual('webpack');
        });
        it('should get webpack by default', function () {
            var bundler = config.bundlerStrategy(context);
            expect(bundler).toEqual('webpack');
        });
    });
    describe('config.getUserConfigFile', function () {
        it('should get config from package.json config', function () {
            config.setAppPackageJsonData({
                config: { ionic_config: 'myconfig.js' }
            });
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should get config from env var', function () {
            config.setProcessEnv({
                IONIC_CONFIG: 'myconfig.js'
            });
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should get config from short arg', function () {
            config.addArgv('-s');
            config.addArgv('myconfig.js');
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should get config from full arg', function () {
            config.addArgv('--full');
            config.addArgv('myconfig.js');
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should get userConfigFile', function () {
            var userConfigFile = 'myconfig.js';
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(path_1.resolve('myconfig.js'));
        });
        it('should not get a user config', function () {
            var userConfigFile = null;
            var context = { rootDir: process.cwd() };
            var taskInfo = { fullArg: '--full', shortArg: '-s', defaultConfigFile: 'default.config.js', envVar: 'IONIC_CONFIG', packageConfig: 'ionic_config' };
            var rtn = config.getUserConfigFile(context, taskInfo, userConfigFile);
            expect(rtn).toEqual(null);
        });
    });
    describe('config.hasArg function', function () {
        it('should return false when a match is not found', function () {
            var result = config.hasArg('--full', '-f');
            expect(result).toBeFalsy();
        });
        it('should match on a fullname arg', function () {
            config.addArgv('--full');
            var result = config.hasArg('--full');
            expect(result).toBeTruthy();
        });
        it('should match on a shortname arg', function () {
            config.addArgv('-f');
            var result = config.hasArg('--full', '-f');
            expect(result).toBeTruthy();
        });
        it('should compare fullnames as case insensitive', function () {
            config.addArgv('--full');
            config.addArgv('--TEST');
            var result = config.hasArg('--Full');
            var result2 = config.hasArg('--test');
            expect(result).toBeTruthy();
            expect(result2).toBeTruthy();
        });
        it('should compare shortnames as case insensitive', function () {
            config.addArgv('-f');
            config.addArgv('-T');
            var result = config.hasArg('-F');
            var result2 = config.hasArg('-t');
            expect(result).toBeTruthy();
            expect(result2).toBeTruthy();
        });
    });
    var context;
    beforeEach(function () {
        config.setProcessArgs(['node', 'ionic-app-scripts']);
        config.setProcessEnv({});
        config.setCwd('');
        config.setAppPackageJsonData(null);
        context = config.generateContext({});
    });
});
