"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_extra_1 = require("fs-extra");
var logger_1 = require("../logger/logger");
var helpers_1 = require("./helpers");
var file_cache_1 = require("./file-cache");
var Constants = require("./constants");
/**
 * Create a context object which is used by all the build tasks.
 * Filling the config data uses the following hierarchy, which will
 * keep going down the list until it, or if it, finds data.
 *
 * 1) Get from the passed in context variable
 * 2) Get from the config file set using the command-line args
 * 3) Get from environment variable
 * 4) Get from package.json config property
 * 5) Get environment variables
 *
 * Lastly, Ionic's default configs will always fill in any data
 * which is missing from the user's data.
 */
function generateContext(context) {
    if (!context) {
        context = {};
    }
    if (!context.fileCache) {
        context.fileCache = new file_cache_1.FileCache();
    }
    context.isProd = [
        context.isProd,
        hasArg('--prod')
    ].find(function (val) { return typeof val === 'boolean'; });
    setProcessEnvVar(Constants.ENV_VAR_IONIC_ENV, (context.isProd ? Constants.ENV_VAR_PROD : Constants.ENV_VAR_DEV));
    // If context is prod then the following flags must be set to true
    context.runAot = [
        context.runAot,
        context.isProd || hasArg('--aot'),
    ].find(function (val) { return typeof val === 'boolean'; });
    context.runMinifyJs = [
        context.runMinifyJs,
        context.isProd || hasArg('--minifyJs')
    ].find(function (val) { return typeof val === 'boolean'; });
    context.runMinifyCss = [
        context.runMinifyCss,
        context.isProd || hasArg('--minifyCss')
    ].find(function (val) { return typeof val === 'boolean'; });
    context.optimizeJs = [
        context.optimizeJs,
        context.isProd || hasArg('--optimizeJs')
    ].find(function (val) { return typeof val === 'boolean'; });
    if (typeof context.isWatch !== 'boolean') {
        context.isWatch = hasArg('--watch');
    }
    setProcessEnvVar(Constants.ENV_VAR_IONIC_AOT, "" + context.runAot);
    logger_1.Logger.debug(Constants.ENV_VAR_IONIC_AOT + " set to " + context.runAot);
    setProcessEnvVar(Constants.ENV_VAR_IONIC_MINIFY_JS, "" + context.runMinifyJs);
    logger_1.Logger.debug(Constants.ENV_VAR_IONIC_MINIFY_JS + " set to " + context.runMinifyJs);
    setProcessEnvVar(Constants.ENV_VAR_IONIC_MINIFY_CSS, "" + context.runMinifyCss);
    logger_1.Logger.debug(Constants.ENV_VAR_IONIC_MINIFY_CSS + " set to " + context.runMinifyCss);
    setProcessEnvVar(Constants.ENV_VAR_IONIC_OPTIMIZE_JS, "" + context.optimizeJs);
    logger_1.Logger.debug(Constants.ENV_VAR_IONIC_OPTIMIZE_JS + " set to " + context.optimizeJs);
    setProcessEnvVar(Constants.ENV_VAR_IONIC_MINIFY_JS, "" + context.runMinifyJs);
    logger_1.Logger.debug(Constants.ENV_VAR_IONIC_MINIFY_JS + " set to " + context.runMinifyJs);
    context.rootDir = path_1.resolve(context.rootDir || getConfigValue(context, '--rootDir', null, Constants.ENV_VAR_ROOT_DIR, Constants.ENV_VAR_ROOT_DIR.toLowerCase(), processCwd));
    setProcessEnvVar(Constants.ENV_VAR_ROOT_DIR, context.rootDir);
    logger_1.Logger.debug("rootDir set to " + context.rootDir);
    context.tmpDir = path_1.resolve(context.tmpDir || getConfigValue(context, '--tmpDir', null, Constants.ENV_VAR_TMP_DIR, Constants.ENV_VAR_TMP_DIR.toLowerCase(), path_1.join(context.rootDir, Constants.TMP_DIR)));
    setProcessEnvVar(Constants.ENV_VAR_TMP_DIR, context.tmpDir);
    logger_1.Logger.debug("tmpDir set to " + context.tmpDir);
    context.srcDir = path_1.resolve(context.srcDir || getConfigValue(context, '--srcDir', null, Constants.ENV_VAR_SRC_DIR, Constants.ENV_VAR_SRC_DIR.toLowerCase(), path_1.join(context.rootDir, Constants.SRC_DIR)));
    setProcessEnvVar(Constants.ENV_VAR_SRC_DIR, context.srcDir);
    logger_1.Logger.debug("srcDir set to " + context.srcDir);
    var deepLinksDir = path_1.resolve(getConfigValue(context, '--deepLinksDir', null, Constants.ENV_VAR_DEEPLINKS_DIR, Constants.ENV_VAR_DEEPLINKS_DIR.toLowerCase(), context.srcDir));
    setProcessEnvVar(Constants.ENV_VAR_DEEPLINKS_DIR, deepLinksDir);
    logger_1.Logger.debug("deepLinksDir set to " + deepLinksDir);
    context.wwwDir = path_1.resolve(context.wwwDir || getConfigValue(context, '--wwwDir', null, Constants.ENV_VAR_WWW_DIR, Constants.ENV_VAR_WWW_DIR.toLowerCase(), path_1.join(context.rootDir, Constants.WWW_DIR)));
    setProcessEnvVar(Constants.ENV_VAR_WWW_DIR, context.wwwDir);
    logger_1.Logger.debug("wwwDir set to " + context.wwwDir);
    context.wwwIndex = getConfigValue(context, '--wwwIndex', null, Constants.ENV_VAR_HTML_TO_SERVE, Constants.ENV_VAR_HTML_TO_SERVE.toLowerCase(), 'index.html');
    setProcessEnvVar(Constants.ENV_VAR_HTML_TO_SERVE, context.wwwIndex);
    logger_1.Logger.debug("wwwIndex set to " + context.wwwIndex);
    context.buildDir = path_1.resolve(context.buildDir || getConfigValue(context, '--buildDir', null, Constants.ENV_VAR_BUILD_DIR, Constants.ENV_VAR_BUILD_DIR.toLowerCase(), path_1.join(context.wwwDir, Constants.BUILD_DIR)));
    setProcessEnvVar(Constants.ENV_VAR_BUILD_DIR, context.buildDir);
    logger_1.Logger.debug("buildDir set to " + context.buildDir);
    var fontsDir = path_1.resolve(getConfigValue(context, '--fontsDir', null, Constants.ENV_VAR_FONTS_DIR, Constants.ENV_VAR_FONTS_DIR.toLowerCase(), path_1.join(context.wwwDir, 'assets', 'fonts')));
    setProcessEnvVar(Constants.ENV_VAR_FONTS_DIR, fontsDir);
    logger_1.Logger.debug("fontsDir set to " + fontsDir);
    context.sourcemapDir = path_1.resolve(context.sourcemapDir || getConfigValue(context, '--sourcemapDir', null, Constants.ENV_VAR_SOURCEMAP_DIR, Constants.ENV_VAR_SOURCEMAP_DIR.toLowerCase(), Constants.SOURCEMAP_DIR));
    setProcessEnvVar(Constants.ENV_VAR_SOURCEMAP_DIR, context.sourcemapDir);
    logger_1.Logger.debug("sourcemapDir set to " + context.sourcemapDir);
    context.pagesDir = path_1.resolve(context.pagesDir || getConfigValue(context, '--pagesDir', null, Constants.ENV_VAR_PAGES_DIR, Constants.ENV_VAR_PAGES_DIR.toLowerCase(), path_1.join(context.srcDir, 'pages')));
    setProcessEnvVar(Constants.ENV_VAR_PAGES_DIR, context.pagesDir);
    logger_1.Logger.debug("pagesDir set to " + context.pagesDir);
    context.componentsDir = path_1.resolve(context.componentsDir || getConfigValue(context, '--componentsDir', null, Constants.ENV_VAR_COMPONENTS_DIR, Constants.ENV_VAR_COMPONENTS_DIR.toLowerCase(), path_1.join(context.srcDir, 'components')));
    setProcessEnvVar(Constants.ENV_VAR_COMPONENTS_DIR, context.componentsDir);
    logger_1.Logger.debug("componentsDir set to " + context.componentsDir);
    context.directivesDir = path_1.resolve(context.directivesDir || getConfigValue(context, '--directivesDir', null, Constants.ENV_VAR_DIRECTIVES_DIR, Constants.ENV_VAR_DIRECTIVES_DIR.toLowerCase(), path_1.join(context.srcDir, 'directives')));
    setProcessEnvVar(Constants.ENV_VAR_DIRECTIVES_DIR, context.directivesDir);
    logger_1.Logger.debug("directivesDir set to " + context.directivesDir);
    context.pipesDir = path_1.resolve(context.pipesDir || getConfigValue(context, '--pipesDir', null, Constants.ENV_VAR_PIPES_DIR, Constants.ENV_VAR_PIPES_DIR.toLowerCase(), path_1.join(context.srcDir, 'pipes')));
    setProcessEnvVar(Constants.ENV_VAR_PIPES_DIR, context.pipesDir);
    logger_1.Logger.debug("pipesDir set to " + context.pipesDir);
    context.providersDir = path_1.resolve(context.providersDir || getConfigValue(context, '--providersDir', null, Constants.ENV_VAR_PROVIDERS_DIR, Constants.ENV_VAR_PROVIDERS_DIR.toLowerCase(), path_1.join(context.srcDir, 'providers')));
    setProcessEnvVar(Constants.ENV_VAR_PROVIDERS_DIR, context.providersDir);
    logger_1.Logger.debug("providersDir set to " + context.providersDir);
    context.nodeModulesDir = path_1.join(context.rootDir, Constants.NODE_MODULES);
    setProcessEnvVar(Constants.ENV_VAR_NODE_MODULES_DIR, context.nodeModulesDir);
    logger_1.Logger.debug("nodeModulesDir set to " + context.nodeModulesDir);
    context.ionicAngularDir = path_1.resolve(context.ionicAngularDir || getConfigValue(context, '--ionicAngularDir', null, Constants.ENV_VAR_IONIC_ANGULAR_DIR, Constants.ENV_VAR_IONIC_ANGULAR_DIR.toLowerCase(), path_1.join(context.nodeModulesDir, Constants.IONIC_ANGULAR)));
    setProcessEnvVar(Constants.ENV_VAR_IONIC_ANGULAR_DIR, context.ionicAngularDir);
    logger_1.Logger.debug("ionicAngularDir set to " + context.ionicAngularDir);
    var angularDir = path_1.resolve(getConfigValue(context, '--angularDir', null, Constants.ENV_VAR_ANGULAR_CORE_DIR, Constants.ENV_VAR_ANGULAR_CORE_DIR.toLowerCase(), path_1.join(context.nodeModulesDir, Constants.AT_ANGULAR, 'core')));
    setProcessEnvVar(Constants.ENV_VAR_ANGULAR_CORE_DIR, angularDir);
    logger_1.Logger.debug("angularDir set to " + angularDir);
    context.angularCoreDir = angularDir;
    var typescriptDir = path_1.resolve(getConfigValue(context, '--typescriptDir', null, Constants.ENV_VAR_TYPESCRIPT_DIR, Constants.ENV_VAR_TYPESCRIPT_DIR.toLowerCase(), path_1.join(context.nodeModulesDir, Constants.TYPESCRIPT)));
    setProcessEnvVar(Constants.ENV_VAR_TYPESCRIPT_DIR, typescriptDir);
    logger_1.Logger.debug("typescriptDir set to " + typescriptDir);
    context.typescriptDir = typescriptDir;
    var defaultCoreCompilerFilePath = path_1.join(context.ionicAngularDir, 'compiler');
    context.coreCompilerFilePath = path_1.resolve(context.coreCompilerFilePath || getConfigValue(context, '--coreCompilerFilePath', null, Constants.ENV_VAR_CORE_COMPILER_FILE_PATH, Constants.ENV_VAR_CORE_COMPILER_FILE_PATH.toLowerCase(), defaultCoreCompilerFilePath));
    setProcessEnvVar(Constants.ENV_VAR_CORE_COMPILER_FILE_PATH, context.coreCompilerFilePath);
    logger_1.Logger.debug("coreCompilerFilePath set to " + context.coreCompilerFilePath);
    var defaultCoreDir = context.ionicAngularDir;
    context.coreDir = path_1.resolve(context.coreDir || getConfigValue(context, '--coreDir', null, Constants.ENV_VAR_CORE_DIR, Constants.ENV_VAR_CORE_DIR.toLowerCase(), defaultCoreDir));
    setProcessEnvVar(Constants.ENV_VAR_CORE_DIR, context.coreDir);
    logger_1.Logger.debug("coreDir set to " + context.coreDir);
    var rxjsDir = path_1.resolve(getConfigValue(context, '--rxjsDir', null, Constants.ENV_VAR_RXJS_DIR, Constants.ENV_VAR_RXJS_DIR.toLowerCase(), path_1.join(context.nodeModulesDir, Constants.RXJS)));
    setProcessEnvVar(Constants.ENV_VAR_RXJS_DIR, rxjsDir);
    logger_1.Logger.debug("rxjsDir set to " + rxjsDir);
    var ionicAngularTemplatesDir = path_1.join(context.ionicAngularDir, 'templates');
    setProcessEnvVar(Constants.ENV_VAR_IONIC_ANGULAR_TEMPLATE_DIR, ionicAngularTemplatesDir);
    logger_1.Logger.debug("ionicAngularTemplatesDir set to " + ionicAngularTemplatesDir);
    context.platform = getConfigValue(context, '--platform', null, Constants.ENV_VAR_PLATFORM, null, null);
    setProcessEnvVar(Constants.ENV_VAR_PLATFORM, context.platform);
    logger_1.Logger.debug("platform set to " + context.platform);
    context.target = getConfigValue(context, '--target', null, Constants.ENV_VAR_TARGET, null, null);
    setProcessEnvVar(Constants.ENV_VAR_TARGET, context.target);
    logger_1.Logger.debug("target set to " + context.target);
    var ionicAngularEntryPoint = path_1.resolve(getConfigValue(context, '--ionicAngularEntryPoint', null, Constants.ENV_VAR_IONIC_ANGULAR_ENTRY_POINT, Constants.ENV_VAR_IONIC_ANGULAR_ENTRY_POINT.toLowerCase(), path_1.join(context.ionicAngularDir, 'index.js')));
    setProcessEnvVar(Constants.ENV_VAR_IONIC_ANGULAR_ENTRY_POINT, ionicAngularEntryPoint);
    logger_1.Logger.debug("ionicAngularEntryPoint set to " + ionicAngularEntryPoint);
    var appScriptsDir = path_1.join(__dirname, '..', '..');
    setProcessEnvVar(Constants.ENV_VAR_APP_SCRIPTS_DIR, appScriptsDir);
    logger_1.Logger.debug("appScriptsDir set to " + appScriptsDir);
    var generateSourceMap = getConfigValue(context, '--generateSourceMap', null, Constants.ENV_VAR_GENERATE_SOURCE_MAP, Constants.ENV_VAR_GENERATE_SOURCE_MAP.toLowerCase(), context.isProd || context.runMinifyJs ? null : 'true');
    setProcessEnvVar(Constants.ENV_VAR_GENERATE_SOURCE_MAP, generateSourceMap);
    logger_1.Logger.debug("generateSourceMap set to " + generateSourceMap);
    var sourceMapTypeValue = getConfigValue(context, '--sourceMapType', null, Constants.ENV_VAR_SOURCE_MAP_TYPE, Constants.ENV_VAR_SOURCE_MAP_TYPE.toLowerCase(), Constants.SOURCE_MAP_TYPE_EXPENSIVE);
    setProcessEnvVar(Constants.ENV_VAR_SOURCE_MAP_TYPE, sourceMapTypeValue);
    logger_1.Logger.debug("sourceMapType set to " + sourceMapTypeValue);
    var moveSourceMaps = getConfigValue(context, '--moveSourceMaps', null, Constants.ENV_VAR_MOVE_SOURCE_MAPS, Constants.ENV_VAR_MOVE_SOURCE_MAPS.toLowerCase(), 'true');
    setProcessEnvVar(Constants.ENV_VAR_MOVE_SOURCE_MAPS, moveSourceMaps);
    logger_1.Logger.debug("moveSourceMaps set to " + moveSourceMaps);
    var tsConfigPathValue = path_1.resolve(getConfigValue(context, '--tsconfig', null, Constants.ENV_TS_CONFIG, Constants.ENV_TS_CONFIG.toLowerCase(), path_1.join(context.rootDir, 'tsconfig.json')));
    setProcessEnvVar(Constants.ENV_TS_CONFIG, tsConfigPathValue);
    logger_1.Logger.debug("tsconfig set to " + tsConfigPathValue);
    var readConfigJson = getConfigValue(context, '--readConfigJson', null, Constants.ENV_READ_CONFIG_JSON, Constants.ENV_READ_CONFIG_JSON.toLowerCase(), 'true');
    setProcessEnvVar(Constants.ENV_READ_CONFIG_JSON, readConfigJson);
    logger_1.Logger.debug("readConfigJson set to " + readConfigJson);
    var appEntryPointPathValue = path_1.resolve(getConfigValue(context, '--appEntryPoint', null, Constants.ENV_APP_ENTRY_POINT, Constants.ENV_APP_ENTRY_POINT.toLowerCase(), path_1.join(context.srcDir, 'app', 'main.ts')));
    setProcessEnvVar(Constants.ENV_APP_ENTRY_POINT, appEntryPointPathValue);
    logger_1.Logger.debug("appEntryPoint set to " + appEntryPointPathValue);
    context.appNgModulePath = path_1.resolve(getConfigValue(context, '--appNgModulePath', null, Constants.ENV_APP_NG_MODULE_PATH, Constants.ENV_APP_NG_MODULE_PATH.toLowerCase(), path_1.join(context.srcDir, 'app', 'app.module.ts')));
    setProcessEnvVar(Constants.ENV_APP_NG_MODULE_PATH, context.appNgModulePath);
    logger_1.Logger.debug("appNgModulePath set to " + context.appNgModulePath);
    context.componentsNgModulePath = path_1.resolve(getConfigValue(context, '--componentsNgModulePath', null, Constants.ENV_COMPONENTS_NG_MODULE_PATH, Constants.ENV_COMPONENTS_NG_MODULE_PATH.toLowerCase(), path_1.join(context.srcDir, 'components', 'components.module.ts')));
    setProcessEnvVar(Constants.ENV_COMPONENTS_NG_MODULE_PATH, context.componentsNgModulePath);
    logger_1.Logger.debug("componentsNgModulePath set to " + context.componentsNgModulePath);
    context.pipesNgModulePath = path_1.resolve(getConfigValue(context, '--pipesNgModulePath', null, Constants.ENV_PIPES_NG_MODULE_PATH, Constants.ENV_PIPES_NG_MODULE_PATH.toLowerCase(), path_1.join(context.srcDir, 'pipes', 'pipes.module.ts')));
    setProcessEnvVar(Constants.ENV_PIPES_NG_MODULE_PATH, context.pipesNgModulePath);
    logger_1.Logger.debug("pipesNgModulePath set to " + context.pipesNgModulePath);
    context.directivesNgModulePath = path_1.resolve(getConfigValue(context, '--directivesNgModulePath', null, Constants.ENV_DIRECTIVES_NG_MODULE_PATH, Constants.ENV_DIRECTIVES_NG_MODULE_PATH.toLowerCase(), path_1.join(context.srcDir, 'directives', 'directives.module.ts')));
    setProcessEnvVar(Constants.ENV_DIRECTIVES_NG_MODULE_PATH, context.directivesNgModulePath);
    logger_1.Logger.debug("directivesNgModulePath set to " + context.directivesNgModulePath);
    var appNgModuleClass = getConfigValue(context, '--appNgModuleClass', null, Constants.ENV_APP_NG_MODULE_CLASS, Constants.ENV_APP_NG_MODULE_CLASS.toLowerCase(), 'AppModule');
    setProcessEnvVar(Constants.ENV_APP_NG_MODULE_CLASS, appNgModuleClass);
    logger_1.Logger.debug("appNgModuleClass set to " + appNgModuleClass);
    var pathToGlobUtil = path_1.join(getProcessEnvVar(Constants.ENV_VAR_APP_SCRIPTS_DIR), 'dist', 'util', 'glob-util.js');
    setProcessEnvVar(Constants.ENV_GLOB_UTIL, pathToGlobUtil);
    logger_1.Logger.debug("pathToGlobUtil set to " + pathToGlobUtil);
    var cleanBeforeCopy = getConfigValue(context, '--cleanBeforeCopy', null, Constants.ENV_CLEAN_BEFORE_COPY, Constants.ENV_CLEAN_BEFORE_COPY.toLowerCase(), null);
    setProcessEnvVar(Constants.ENV_CLEAN_BEFORE_COPY, cleanBeforeCopy);
    logger_1.Logger.debug("cleanBeforeCopy set to " + cleanBeforeCopy);
    context.outputJsFileName = getConfigValue(context, '--outputJsFileName', null, Constants.ENV_OUTPUT_JS_FILE_NAME, Constants.ENV_OUTPUT_JS_FILE_NAME.toLowerCase(), 'main.js');
    setProcessEnvVar(Constants.ENV_OUTPUT_JS_FILE_NAME, context.outputJsFileName);
    logger_1.Logger.debug("outputJsFileName set to " + context.outputJsFileName);
    context.outputCssFileName = getConfigValue(context, '--outputCssFileName', null, Constants.ENV_OUTPUT_CSS_FILE_NAME, Constants.ENV_OUTPUT_CSS_FILE_NAME.toLowerCase(), 'main.css');
    setProcessEnvVar(Constants.ENV_OUTPUT_CSS_FILE_NAME, context.outputCssFileName);
    logger_1.Logger.debug("outputCssFileName set to " + context.outputCssFileName);
    var webpackFactoryPath = path_1.join(getProcessEnvVar(Constants.ENV_VAR_APP_SCRIPTS_DIR), 'dist', 'webpack', 'ionic-webpack-factory.js');
    setProcessEnvVar(Constants.ENV_WEBPACK_FACTORY, webpackFactoryPath);
    logger_1.Logger.debug("webpackFactoryPath set to " + webpackFactoryPath);
    var webpackLoaderPath = path_1.join(getProcessEnvVar(Constants.ENV_VAR_APP_SCRIPTS_DIR), 'dist', 'webpack', 'loader.js');
    setProcessEnvVar(Constants.ENV_WEBPACK_LOADER, webpackLoaderPath);
    logger_1.Logger.debug("webpackLoaderPath set to " + webpackLoaderPath);
    var cacheLoaderPath = path_1.join(getProcessEnvVar(Constants.ENV_VAR_APP_SCRIPTS_DIR), 'dist', 'webpack', 'cache-loader.js');
    setProcessEnvVar(Constants.ENV_CACHE_LOADER, cacheLoaderPath);
    logger_1.Logger.debug("cacheLoaderPath set to " + cacheLoaderPath);
    var aotWriteToDisk = getConfigValue(context, '--aotWriteToDisk', null, Constants.ENV_AOT_WRITE_TO_DISK, Constants.ENV_AOT_WRITE_TO_DISK.toLowerCase(), null);
    setProcessEnvVar(Constants.ENV_AOT_WRITE_TO_DISK, aotWriteToDisk);
    logger_1.Logger.debug("aotWriteToDisk set to " + aotWriteToDisk);
    var printWebpackDependencyTree = getConfigValue(context, '--printWebpackDependencyTree', null, Constants.ENV_PRINT_WEBPACK_DEPENDENCY_TREE, Constants.ENV_PRINT_WEBPACK_DEPENDENCY_TREE.toLowerCase(), null);
    setProcessEnvVar(Constants.ENV_PRINT_WEBPACK_DEPENDENCY_TREE, printWebpackDependencyTree);
    logger_1.Logger.debug("printWebpackDependencyTree set to " + printWebpackDependencyTree);
    var typeCheckOnLint = getConfigValue(context, '--typeCheckOnLint', null, Constants.ENV_TYPE_CHECK_ON_LINT, Constants.ENV_TYPE_CHECK_ON_LINT.toLowerCase(), null);
    setProcessEnvVar(Constants.ENV_TYPE_CHECK_ON_LINT, typeCheckOnLint);
    logger_1.Logger.debug("typeCheckOnLint set to " + typeCheckOnLint);
    var bailOnLintError = getConfigValue(context, '--bailOnLintError', null, Constants.ENV_BAIL_ON_LINT_ERROR, Constants.ENV_BAIL_ON_LINT_ERROR.toLowerCase(), null);
    setProcessEnvVar(Constants.ENV_BAIL_ON_LINT_ERROR, bailOnLintError);
    logger_1.Logger.debug("bailOnLintError set to " + bailOnLintError);
    var enableLint = getConfigValue(context, '--enableLint', null, Constants.ENV_ENABLE_LINT, Constants.ENV_ENABLE_LINT.toLowerCase(), 'true');
    setProcessEnvVar(Constants.ENV_ENABLE_LINT, enableLint);
    logger_1.Logger.debug("enableLint set to " + enableLint);
    var disableLogging = getConfigValue(context, '--disableLogging', null, Constants.ENV_DISABLE_LOGGING, Constants.ENV_DISABLE_LOGGING.toLowerCase(), null);
    setProcessEnvVar(Constants.ENV_DISABLE_LOGGING, disableLogging);
    logger_1.Logger.debug("disableLogging set to " + disableLogging);
    var startWatchTimeout = getConfigValue(context, '--startWatchTimeout', null, Constants.ENV_START_WATCH_TIMEOUT, Constants.ENV_START_WATCH_TIMEOUT.toLowerCase(), '3000');
    setProcessEnvVar(Constants.ENV_START_WATCH_TIMEOUT, startWatchTimeout);
    logger_1.Logger.debug("startWatchTimeout set to " + startWatchTimeout);
    var ngModuleFileNameSuffix = getConfigValue(context, '--ngModuleFileNameSuffix', null, Constants.ENV_NG_MODULE_FILE_NAME_SUFFIX, Constants.ENV_NG_MODULE_FILE_NAME_SUFFIX.toLowerCase(), '.module.ts');
    setProcessEnvVar(Constants.ENV_NG_MODULE_FILE_NAME_SUFFIX, ngModuleFileNameSuffix);
    logger_1.Logger.debug("ngModuleFileNameSuffix set to " + ngModuleFileNameSuffix);
    var polyfillName = getConfigValue(context, '--polyfillFileName', null, Constants.ENV_POLYFILL_FILE_NAME, Constants.ENV_POLYFILL_FILE_NAME.toLowerCase(), 'polyfills.js');
    setProcessEnvVar(Constants.ENV_POLYFILL_FILE_NAME, polyfillName);
    logger_1.Logger.debug("polyfillName set to " + polyfillName);
    var purgeUnusedFonts = getConfigValue(context, '--purgeUnusedFonts', null, Constants.ENV_PURGE_UNUSED_FONTS, Constants.ENV_PURGE_UNUSED_FONTS.toLowerCase(), 'true');
    setProcessEnvVar(Constants.ENV_PURGE_UNUSED_FONTS, purgeUnusedFonts);
    logger_1.Logger.debug("purgeUnusedFonts set to " + purgeUnusedFonts);
    /* Provider Path Stuff */
    setProcessEnvVar(Constants.ENV_ACTION_SHEET_CONTROLLER_CLASSNAME, 'ActionSheetController');
    setProcessEnvVar(Constants.ENV_ACTION_SHEET_CONTROLLER_PATH, path_1.join(context.ionicAngularDir, 'components', 'action-sheet', 'action-sheet-controller.js'));
    setProcessEnvVar(Constants.ENV_ACTION_SHEET_VIEW_CONTROLLER_PATH, path_1.join(context.ionicAngularDir, 'components', 'action-sheet', 'action-sheet.js'));
    setProcessEnvVar(Constants.ENV_ACTION_SHEET_COMPONENT_PATH, path_1.join(context.ionicAngularDir, 'components', 'action-sheet', 'action-sheet-component.js'));
    setProcessEnvVar(Constants.ENV_ACTION_SHEET_COMPONENT_FACTORY_PATH, path_1.join(context.ionicAngularDir, 'components', 'action-sheet', 'action-sheet-component.ngfactory.js'));
    setProcessEnvVar(Constants.ENV_ALERT_CONTROLLER_CLASSNAME, 'AlertController');
    setProcessEnvVar(Constants.ENV_ALERT_CONTROLLER_PATH, path_1.join(context.ionicAngularDir, 'components', 'alert', 'alert-controller.js'));
    setProcessEnvVar(Constants.ENV_ALERT_VIEW_CONTROLLER_PATH, path_1.join(context.ionicAngularDir, 'components', 'alert', 'alert.js'));
    setProcessEnvVar(Constants.ENV_ALERT_COMPONENT_PATH, path_1.join(context.ionicAngularDir, 'components', 'alert', 'alert-component.js'));
    setProcessEnvVar(Constants.ENV_ALERT_COMPONENT_FACTORY_PATH, path_1.join(context.ionicAngularDir, 'components', 'alert', 'alert-component.ngfactory.js'));
    setProcessEnvVar(Constants.ENV_APP_ROOT_COMPONENT_PATH, path_1.join(context.ionicAngularDir, 'components', 'app', 'app-root.js'));
    setProcessEnvVar(Constants.ENV_LOADING_CONTROLLER_CLASSNAME, 'LoadingController');
    setProcessEnvVar(Constants.ENV_LOADING_CONTROLLER_PATH, path_1.join(context.ionicAngularDir, 'components', 'loading', 'loading-controller.js'));
    setProcessEnvVar(Constants.ENV_LOADING_VIEW_CONTROLLER_PATH, path_1.join(context.ionicAngularDir, 'components', 'loading', 'loading.js'));
    setProcessEnvVar(Constants.ENV_LOADING_COMPONENT_PATH, path_1.join(context.ionicAngularDir, 'components', 'loading', 'loading-component.js'));
    setProcessEnvVar(Constants.ENV_LOADING_COMPONENT_FACTORY_PATH, path_1.join(context.ionicAngularDir, 'components', 'loading', 'loading-component.ngfactory.js'));
    setProcessEnvVar(Constants.ENV_MODAL_CONTROLLER_CLASSNAME, 'ModalController');
    setProcessEnvVar(Constants.ENV_MODAL_CONTROLLER_PATH, path_1.join(context.ionicAngularDir, 'components', 'modal', 'modal-controller.js'));
    setProcessEnvVar(Constants.ENV_MODAL_VIEW_CONTROLLER_PATH, path_1.join(context.ionicAngularDir, 'components', 'modal', 'modal.js'));
    setProcessEnvVar(Constants.ENV_MODAL_COMPONENT_PATH, path_1.join(context.ionicAngularDir, 'components', 'modal', 'modal-component.js'));
    setProcessEnvVar(Constants.ENV_MODAL_COMPONENT_FACTORY_PATH, path_1.join(context.ionicAngularDir, 'components', 'modal', 'modal-component.ngfactory.js'));
    setProcessEnvVar(Constants.ENV_PICKER_CONTROLLER_CLASSNAME, 'PickerController');
    setProcessEnvVar(Constants.ENV_PICKER_CONTROLLER_PATH, path_1.join(context.ionicAngularDir, 'components', 'picker', 'picker-controller.js'));
    setProcessEnvVar(Constants.ENV_PICKER_VIEW_CONTROLLER_PATH, path_1.join(context.ionicAngularDir, 'components', 'picker', 'picker.js'));
    setProcessEnvVar(Constants.ENV_PICKER_COMPONENT_PATH, path_1.join(context.ionicAngularDir, 'components', 'picker', 'picker-component.js'));
    setProcessEnvVar(Constants.ENV_PICKER_COMPONENT_FACTORY_PATH, path_1.join(context.ionicAngularDir, 'components', 'picker', 'picker-component.ngfactory.js'));
    setProcessEnvVar(Constants.ENV_POPOVER_CONTROLLER_CLASSNAME, 'PopoverController');
    setProcessEnvVar(Constants.ENV_POPOVER_CONTROLLER_PATH, path_1.join(context.ionicAngularDir, 'components', 'popover', 'popover-controller.js'));
    setProcessEnvVar(Constants.ENV_POPOVER_VIEW_CONTROLLER_PATH, path_1.join(context.ionicAngularDir, 'components', 'popover', 'popover.js'));
    setProcessEnvVar(Constants.ENV_POPOVER_COMPONENT_PATH, path_1.join(context.ionicAngularDir, 'components', 'popover', 'popover-component.js'));
    setProcessEnvVar(Constants.ENV_POPOVER_COMPONENT_FACTORY_PATH, path_1.join(context.ionicAngularDir, 'components', 'popover', 'popover-component.ngfactory.js'));
    setProcessEnvVar(Constants.ENV_SELECT_POPOVER_CLASSNAME, 'SelectPopover');
    setProcessEnvVar(Constants.ENV_SELECT_POPOVER_COMPONENT_PATH, path_1.join(context.ionicAngularDir, 'components', 'select', 'select-popover-component.js'));
    setProcessEnvVar(Constants.ENV_SELECT_POPOVER_COMPONENT_FACTORY_PATH, path_1.join(context.ionicAngularDir, 'components', 'select', 'select-popover-component.ngfactory.js'));
    setProcessEnvVar(Constants.ENV_TOAST_CONTROLLER_CLASSNAME, 'ToastController');
    setProcessEnvVar(Constants.ENV_TOAST_CONTROLLER_PATH, path_1.join(context.ionicAngularDir, 'components', 'toast', 'toast-controller.js'));
    setProcessEnvVar(Constants.ENV_TOAST_VIEW_CONTROLLER_PATH, path_1.join(context.ionicAngularDir, 'components', 'toast', 'toast.js'));
    setProcessEnvVar(Constants.ENV_TOAST_COMPONENT_PATH, path_1.join(context.ionicAngularDir, 'components', 'toast', 'toast-component.js'));
    setProcessEnvVar(Constants.ENV_TOAST_COMPONENT_FACTORY_PATH, path_1.join(context.ionicAngularDir, 'components', 'toast', 'toast-component.ngfactory.js'));
    var parseDeepLinks = getConfigValue(context, '--parseDeepLinks', null, Constants.ENV_PARSE_DEEPLINKS, Constants.ENV_PARSE_DEEPLINKS.toLowerCase(), 'true');
    setProcessEnvVar(Constants.ENV_PARSE_DEEPLINKS, parseDeepLinks);
    logger_1.Logger.debug("parseDeepLinks set to " + parseDeepLinks);
    var skipReadIonicAngular = getConfigValue(context, '--skipIonicAngularVersion', null, Constants.ENV_SKIP_IONIC_ANGULAR_VERSION, Constants.ENV_SKIP_IONIC_ANGULAR_VERSION.toLowerCase(), 'false');
    setProcessEnvVar(Constants.ENV_SKIP_IONIC_ANGULAR_VERSION, skipReadIonicAngular);
    logger_1.Logger.debug("skipReadIonicAngular set to " + skipReadIonicAngular);
    if (!isValidBundler(context.bundler)) {
        context.bundler = bundlerStrategy(context);
        logger_1.Logger.debug("bundler set to " + context.bundler);
    }
    context.inlineTemplates = true;
    checkDebugMode();
    if (helpers_1.getBooleanPropertyValue(Constants.ENV_DISABLE_LOGGING)) {
        console.debug = function () { };
        console.error = function () { };
        console.info = function () { };
        console.log = function () { };
        console.trace = function () { };
        console.warn = function () { };
    }
    return context;
}
exports.generateContext = generateContext;
function getUserConfigFile(context, task, userConfigFile) {
    if (!context) {
        context = generateContext(context);
    }
    if (userConfigFile) {
        return path_1.resolve(userConfigFile);
    }
    var defaultConfig = getConfigValue(context, task.fullArg, task.shortArg, task.envVar, task.packageConfig, null);
    if (defaultConfig) {
        return path_1.join(context.rootDir, defaultConfig);
    }
    return null;
}
exports.getUserConfigFile = getUserConfigFile;
function fillConfigDefaults(userConfigFile, defaultConfigFile) {
    var userConfig = null;
    if (userConfigFile) {
        try {
            // check if exists first, so we can print a more specific error message
            // since required config could also throw MODULE_NOT_FOUND
            fs_extra_1.statSync(userConfigFile);
            // create a fresh copy of the config each time
            userConfig = require(userConfigFile);
            // if user config returns a function call it to determine proper object
            if (typeof userConfig === 'function') {
                userConfig = userConfig();
            }
        }
        catch (e) {
            if (e.code === 'ENOENT') {
                console.error("Config file \"" + userConfigFile + "\" not found. Using defaults instead.");
            }
            else {
                console.error("There was an error in config file \"" + userConfigFile + "\". Using defaults instead.");
                console.error(e);
            }
        }
    }
    var defaultConfig = require(path_1.join('..', '..', 'config', defaultConfigFile));
    // create a fresh copy of the config each time
    // always assign any default values which were not already supplied by the user
    return helpers_1.objectAssign({}, defaultConfig, userConfig);
}
exports.fillConfigDefaults = fillConfigDefaults;
function bundlerStrategy(context) {
    return Constants.BUNDLER_WEBPACK;
}
exports.bundlerStrategy = bundlerStrategy;
function isValidBundler(bundler) {
    return bundler === Constants.BUNDLER_WEBPACK;
}
function getConfigValue(context, argFullName, argShortName, envVarName, packageConfigProp, defaultValue) {
    if (!context) {
        context = generateContext(context);
    }
    // first see if the value was set in the command-line args
    var argVal = getArgValue(argFullName, argShortName);
    if (argVal !== null) {
        return argVal;
    }
    // next see if it was set in the environment variables
    // which also checks if it was set in the package.json config property
    var envVar = getProcessEnvVar(envVarName);
    if (envVar !== null) {
        return envVar;
    }
    var packageConfig = getPackageJsonConfig(context, packageConfigProp);
    if (packageConfig !== null) {
        return packageConfig;
    }
    // return the default if nothing above was found
    return defaultValue;
}
exports.getConfigValue = getConfigValue;
function getArgValue(fullName, shortName) {
    for (var i = 2; i < processArgv.length; i++) {
        var arg = processArgv[i];
        if (arg === fullName || (shortName && arg === shortName)) {
            var val = processArgv[i + 1];
            if (val !== undefined && val !== '') {
                return val;
            }
        }
    }
    return null;
}
function hasConfigValue(context, argFullName, argShortName, envVarName, defaultValue) {
    if (!context) {
        context = generateContext(context);
    }
    if (hasArg(argFullName, argShortName)) {
        return true;
    }
    // next see if it was set in the environment variables
    // which also checks if it was set in the package.json config property
    var envVar = getProcessEnvVar(envVarName);
    if (envVar !== null) {
        return true;
    }
    var packageConfig = getPackageJsonConfig(context, envVarName);
    if (packageConfig !== null) {
        return true;
    }
    // return the default if nothing above was found
    return defaultValue;
}
exports.hasConfigValue = hasConfigValue;
function hasArg(fullName, shortName) {
    if (shortName === void 0) { shortName = null; }
    return !!(processArgv.some(function (a) { return a.toLowerCase() === fullName.toLowerCase(); }) ||
        (shortName !== null && processArgv.some(function (a) { return a.toLowerCase() === shortName.toLowerCase(); })));
}
exports.hasArg = hasArg;
function replacePathVars(context, filePath) {
    if (Array.isArray(filePath)) {
        return filePath.map(function (f) { return replacePathVars(context, f); });
    }
    if (typeof filePath === 'object') {
        var clonedFilePaths = Object.assign({}, filePath);
        for (var key in clonedFilePaths) {
            clonedFilePaths[key] = replacePathVars(context, clonedFilePaths[key]);
        }
        return clonedFilePaths;
    }
    return filePath.replace('{{SRC}}', context.srcDir)
        .replace('{{WWW}}', context.wwwDir)
        .replace('{{TMP}}', context.tmpDir)
        .replace('{{ROOT}}', context.rootDir)
        .replace('{{BUILD}}', context.buildDir);
}
exports.replacePathVars = replacePathVars;
function getNodeBinExecutable(context, cmd) {
    var cmdPath = path_1.join(context.rootDir, 'node_modules', '.bin', cmd);
    try {
        fs_extra_1.accessSync(cmdPath);
    }
    catch (e) {
        cmdPath = null;
    }
    return cmdPath;
}
exports.getNodeBinExecutable = getNodeBinExecutable;
var checkedDebug = false;
function checkDebugMode() {
    if (!checkedDebug) {
        if (hasArg('--debug') || getProcessEnvVar('ionic_debug_mode') === 'true') {
            processEnv.ionic_debug_mode = 'true';
        }
        checkedDebug = true;
    }
}
function isDebugMode() {
    return (processEnv.ionic_debug_mode === 'true');
}
exports.isDebugMode = isDebugMode;
var processArgv;
function setProcessArgs(argv) {
    processArgv = argv;
}
exports.setProcessArgs = setProcessArgs;
setProcessArgs(process.argv);
function addArgv(value) {
    processArgv.push(value);
}
exports.addArgv = addArgv;
var processEnv;
function setProcessEnv(env) {
    processEnv = env;
}
exports.setProcessEnv = setProcessEnv;
setProcessEnv(process.env);
function setProcessEnvVar(key, value) {
    if (key && value) {
        processEnv[key] = value;
    }
}
exports.setProcessEnvVar = setProcessEnvVar;
function getProcessEnvVar(key) {
    var val = processEnv[key];
    if (val !== undefined) {
        if (val === 'true') {
            return true;
        }
        if (val === 'false') {
            return false;
        }
        return val;
    }
    return null;
}
exports.getProcessEnvVar = getProcessEnvVar;
var processCwd;
function setCwd(cwd) {
    processCwd = cwd;
}
exports.setCwd = setCwd;
setCwd(process.cwd());
function getPackageJsonConfig(context, key) {
    var packageJsonData = getAppPackageJsonData(context);
    if (packageJsonData && packageJsonData.config) {
        var val = packageJsonData.config[key];
        if (val !== undefined) {
            if (val === 'true') {
                return true;
            }
            if (val === 'false') {
                return false;
            }
            return val;
        }
    }
    return null;
}
exports.getPackageJsonConfig = getPackageJsonConfig;
var appPackageJsonData = null;
function setAppPackageJsonData(data) {
    appPackageJsonData = data;
}
exports.setAppPackageJsonData = setAppPackageJsonData;
function getAppPackageJsonData(context) {
    if (!appPackageJsonData) {
        try {
            appPackageJsonData = fs_extra_1.readJSONSync(path_1.join(context.rootDir, 'package.json'));
        }
        catch (e) { }
    }
    return appPackageJsonData;
}
