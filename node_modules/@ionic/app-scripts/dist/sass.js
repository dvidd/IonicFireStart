"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var interfaces_1 = require("./util/interfaces");
var errors_1 = require("./util/errors");
var bundle_1 = require("./bundle");
var fs_extra_1 = require("fs-extra");
var config_1 = require("./util/config");
var logger_1 = require("./logger/logger");
var logger_sass_1 = require("./logger/logger-sass");
var logger_diagnostics_1 = require("./logger/logger-diagnostics");
var node_sass_1 = require("node-sass");
var postcss = require("postcss");
var autoprefixer = require("autoprefixer");
function sass(context, configFile) {
    configFile = config_1.getUserConfigFile(context, taskInfo, configFile);
    var logger = new logger_1.Logger('sass');
    return sassWorker(context, configFile)
        .then(function (outFile) {
        context.sassState = interfaces_1.BuildState.SuccessfulBuild;
        logger.finish();
        return outFile;
    })
        .catch(function (err) {
        context.sassState = interfaces_1.BuildState.RequiresBuild;
        throw logger.fail(err);
    });
}
exports.sass = sass;
function sassUpdate(changedFiles, context) {
    var configFile = config_1.getUserConfigFile(context, taskInfo, null);
    var logger = new logger_1.Logger('sass update');
    return sassWorker(context, configFile)
        .then(function (outFile) {
        context.sassState = interfaces_1.BuildState.SuccessfulBuild;
        logger.finish();
        return outFile;
    })
        .catch(function (err) {
        context.sassState = interfaces_1.BuildState.RequiresBuild;
        throw logger.fail(err);
    });
}
exports.sassUpdate = sassUpdate;
function sassWorker(context, configFile) {
    var sassConfig = getSassConfig(context, configFile);
    var bundlePromise = [];
    if (!context.moduleFiles && !sassConfig.file) {
        // sass must always have a list of all the used module files
        // so ensure we bundle if moduleFiles are currently unknown
        bundlePromise.push(bundle_1.bundle(context));
    }
    return Promise.all(bundlePromise).then(function () {
        logger_diagnostics_1.clearDiagnostics(context, logger_diagnostics_1.DiagnosticsType.Sass);
        // where the final css output file is saved
        if (!sassConfig.outFile) {
            sassConfig.outFile = path_1.join(context.buildDir, sassConfig.outputFilename);
        }
        logger_1.Logger.debug("sass outFile: " + sassConfig.outFile);
        // import paths where the sass compiler will look for imports
        sassConfig.includePaths.unshift(path_1.join(context.srcDir));
        logger_1.Logger.debug("sass includePaths: " + sassConfig.includePaths);
        // sass import sorting algorithms incase there was something to tweak
        sassConfig.sortComponentPathsFn = (sassConfig.sortComponentPathsFn || defaultSortComponentPathsFn);
        sassConfig.sortComponentFilesFn = (sassConfig.sortComponentFilesFn || defaultSortComponentFilesFn);
        if (!sassConfig.file) {
            // if the sass config was not given an input file, then
            // we're going to dynamically generate the sass data by
            // scanning through all the components included in the bundle
            // and generate the sass on the fly
            generateSassData(context, sassConfig);
        }
        else {
            sassConfig.file = config_1.replacePathVars(context, sassConfig.file);
        }
        return render(context, sassConfig);
    });
}
exports.sassWorker = sassWorker;
function getSassConfig(context, configFile) {
    configFile = config_1.getUserConfigFile(context, taskInfo, configFile);
    return config_1.fillConfigDefaults(configFile, taskInfo.defaultConfigFile);
}
exports.getSassConfig = getSassConfig;
function generateSassData(context, sassConfig) {
    /**
     * 1) Import user sass variables first since user variables
     *    should have precedence over default library variables.
     * 2) Import all library sass files next since library css should
     *    be before user css, and potentially have library css easily
     *    overridden by user css selectors which come after the
     *    library's in the same file.
     * 3) Import the user's css last since we want the user's css to
     *    potentially easily override library css with the same
     *    css specificity.
     */
    var moduleDirectories = [];
    if (context.moduleFiles) {
        context.moduleFiles.forEach(function (moduleFile) {
            var moduleDirectory = path_1.dirname(moduleFile);
            if (moduleDirectories.indexOf(moduleDirectory) < 0) {
                moduleDirectories.push(moduleDirectory);
            }
        });
    }
    logger_1.Logger.debug("sass moduleDirectories: " + moduleDirectories.length);
    // gather a list of all the sass variable files that should be used
    // these variable files will be the first imports
    var userSassVariableFiles = sassConfig.variableSassFiles.map(function (f) {
        return config_1.replacePathVars(context, f);
    });
    // gather a list of all the sass files that are next to components we're bundling
    var componentSassFiles = getComponentSassFiles(moduleDirectories, context, sassConfig);
    logger_1.Logger.debug("sass userSassVariableFiles: " + userSassVariableFiles.length);
    logger_1.Logger.debug("sass componentSassFiles: " + componentSassFiles.length);
    var sassImports = userSassVariableFiles.concat(componentSassFiles).map(function (sassFile) { return '"' + sassFile.replace(/\\/g, '\\\\') + '"'; });
    if (sassImports.length) {
        sassConfig.data = "@charset \"UTF-8\"; @import " + sassImports.join(',') + ";";
    }
}
function getComponentSassFiles(moduleDirectories, context, sassConfig) {
    var collectedSassFiles = [];
    var componentDirectories = getComponentDirectories(moduleDirectories, sassConfig);
    // sort all components with the library components being first
    // and user components coming last, so it's easier for user css
    // to override library css with the same specificity
    var sortedComponentPaths = componentDirectories.sort(sassConfig.sortComponentPathsFn);
    sortedComponentPaths.forEach(function (componentPath) {
        addComponentSassFiles(componentPath, collectedSassFiles, context, sassConfig);
    });
    return collectedSassFiles;
}
function addComponentSassFiles(componentPath, collectedSassFiles, context, sassConfig) {
    var siblingFiles = getSiblingSassFiles(componentPath, sassConfig);
    if (!siblingFiles.length && componentPath.indexOf(path_1.sep + 'node_modules') === -1) {
        // if we didn't find anything, see if this module is mapped to another directory
        for (var k in sassConfig.directoryMaps) {
            if (sassConfig.directoryMaps.hasOwnProperty(k)) {
                var actualDirectory = config_1.replacePathVars(context, k);
                var mappedDirectory = config_1.replacePathVars(context, sassConfig.directoryMaps[k]);
                componentPath = componentPath.replace(actualDirectory, mappedDirectory);
                siblingFiles = getSiblingSassFiles(componentPath, sassConfig);
                if (siblingFiles.length) {
                    break;
                }
            }
        }
    }
    if (siblingFiles.length) {
        siblingFiles = siblingFiles.sort(sassConfig.sortComponentFilesFn);
        siblingFiles.forEach(function (componentFile) {
            collectedSassFiles.push(componentFile);
        });
    }
}
function getSiblingSassFiles(componentPath, sassConfig) {
    try {
        return fs_extra_1.readdirSync(componentPath).filter(function (f) {
            return isValidSassFile(f, sassConfig);
        }).map(function (f) {
            return path_1.join(componentPath, f);
        });
    }
    catch (ex) {
        // it's an invalid path
        return [];
    }
}
function isValidSassFile(filename, sassConfig) {
    for (var i = 0; i < sassConfig.includeFiles.length; i++) {
        if (sassConfig.includeFiles[i].test(filename)) {
            // filename passes the test to be included
            for (var j = 0; j < sassConfig.excludeFiles.length; j++) {
                if (sassConfig.excludeFiles[j].test(filename)) {
                    // however, it also passed the test that it should be excluded
                    logger_1.Logger.debug("sass excluded: " + filename);
                    return false;
                }
            }
            return true;
        }
    }
    return false;
}
function getComponentDirectories(moduleDirectories, sassConfig) {
    // filter out module directories we know wouldn't have sibling component sass file
    // just a way to reduce the amount of lookups to be done later
    return moduleDirectories.filter(function (moduleDirectory) {
        // normalize this directory is using / between directories
        moduleDirectory = moduleDirectory.replace(/\\/g, '/');
        for (var i = 0; i < sassConfig.excludeModules.length; i++) {
            if (moduleDirectory.indexOf('/node_modules/' + sassConfig.excludeModules[i] + '/') > -1) {
                return false;
            }
        }
        return true;
    });
}
function render(context, sassConfig) {
    return new Promise(function (resolve, reject) {
        sassConfig.omitSourceMapUrl = false;
        if (sassConfig.sourceMap) {
            sassConfig.sourceMapContents = true;
        }
        node_sass_1.render(sassConfig, function (sassError, sassResult) {
            var diagnostics = logger_sass_1.runSassDiagnostics(context, sassError);
            if (diagnostics.length) {
                logger_diagnostics_1.printDiagnostics(context, logger_diagnostics_1.DiagnosticsType.Sass, diagnostics, true, true);
                // sass render error :(
                reject(new errors_1.BuildError('Failed to render sass to css'));
            }
            else {
                // sass render success :)
                renderSassSuccess(context, sassResult, sassConfig).then(function (outFile) {
                    resolve(outFile);
                }).catch(function (err) {
                    reject(new errors_1.BuildError(err));
                });
            }
        });
    });
}
function renderSassSuccess(context, sassResult, sassConfig) {
    if (sassConfig.autoprefixer) {
        // with autoprefixer
        var autoPrefixerMapOptions = false;
        if (sassConfig.sourceMap) {
            autoPrefixerMapOptions = {
                inline: false,
                prev: generateSourceMaps(sassResult, sassConfig)
            };
        }
        var postcssOptions = {
            to: path_1.basename(sassConfig.outFile),
            map: autoPrefixerMapOptions
        };
        logger_1.Logger.debug("sass, start postcss/autoprefixer");
        var postCssPlugins = [autoprefixer(sassConfig.autoprefixer)];
        if (sassConfig.postCssPlugins) {
            postCssPlugins = sassConfig.postCssPlugins.concat(postCssPlugins);
        }
        return postcss(postCssPlugins)
            .process(sassResult.css, postcssOptions).then(function (postCssResult) {
            postCssResult.warnings().forEach(function (warn) {
                logger_1.Logger.warn(warn.toString());
            });
            var apMapResult = null;
            if (sassConfig.sourceMap && postCssResult.map) {
                logger_1.Logger.debug("sass, parse postCssResult.map");
                apMapResult = generateSourceMaps(postCssResult, sassConfig);
            }
            logger_1.Logger.debug("sass: postcss/autoprefixer completed");
            return writeOutput(context, sassConfig, postCssResult.css, apMapResult);
        });
    }
    // without autoprefixer
    var sassMapResult = generateSourceMaps(sassResult, sassConfig);
    return writeOutput(context, sassConfig, sassResult.css.toString(), sassMapResult);
}
function generateSourceMaps(sassResult, sassConfig) {
    // this can be async and nothing needs to wait on it
    // build Source Maps!
    if (sassResult.map) {
        logger_1.Logger.debug("sass, generateSourceMaps");
        // transform map into JSON
        var sassMap = JSON.parse(sassResult.map.toString());
        // grab the stdout and transform it into stdin
        var sassMapFile = sassMap.file.replace(/^stdout$/, 'stdin');
        // grab the base file name that's being worked on
        var sassFileSrc = sassConfig.outFile;
        // grab the path portion of the file that's being worked on
        var sassFileSrcPath_1 = path_1.dirname(sassFileSrc);
        if (sassFileSrcPath_1) {
            // prepend the path to all files in the sources array except the file that's being worked on
            var sourceFileIndex_1 = sassMap.sources.indexOf(sassMapFile);
            sassMap.sources = sassMap.sources.map(function (source, index) {
                return (index === sourceFileIndex_1) ? source : path_1.join(sassFileSrcPath_1, source);
            });
        }
        // remove 'stdin' from souces and replace with filenames!
        sassMap.sources = sassMap.sources.filter(function (src) {
            if (src !== 'stdin') {
                return src;
            }
        });
        return sassMap;
    }
}
function writeOutput(context, sassConfig, cssOutput, sourceMap) {
    var mappingsOutput = JSON.stringify(sourceMap);
    return new Promise(function (resolve, reject) {
        logger_1.Logger.debug("sass start write output: " + sassConfig.outFile);
        var buildDir = path_1.dirname(sassConfig.outFile);
        fs_extra_1.ensureDirSync(buildDir);
        fs_extra_1.writeFile(sassConfig.outFile, cssOutput, function (cssWriteErr) {
            if (cssWriteErr) {
                reject(new errors_1.BuildError("Error writing css file, " + sassConfig.outFile + ": " + cssWriteErr));
            }
            else {
                logger_1.Logger.debug("sass saved output: " + sassConfig.outFile);
                if (mappingsOutput) {
                    // save the css map file too
                    // this save completes async and does not hold up the resolve
                    var sourceMapPath_1 = path_1.join(buildDir, path_1.basename(sassConfig.outFile) + '.map');
                    logger_1.Logger.debug("sass start write css map: " + sourceMapPath_1);
                    fs_extra_1.writeFile(sourceMapPath_1, mappingsOutput, function (mapWriteErr) {
                        if (mapWriteErr) {
                            logger_1.Logger.error("Error writing css map file, " + sourceMapPath_1 + ": " + mapWriteErr);
                        }
                        else {
                            logger_1.Logger.debug("sass saved css map: " + sourceMapPath_1);
                        }
                    });
                }
                // css file all saved
                // note that we're not waiting on the css map to finish saving
                resolve(sassConfig.outFile);
            }
        });
    });
}
function defaultSortComponentPathsFn(a, b) {
    var aIndexOfNodeModules = a.indexOf('node_modules');
    var bIndexOfNodeModules = b.indexOf('node_modules');
    if (aIndexOfNodeModules > -1 && bIndexOfNodeModules > -1) {
        return (a > b) ? 1 : -1;
    }
    if (aIndexOfNodeModules > -1 && bIndexOfNodeModules === -1) {
        return -1;
    }
    if (aIndexOfNodeModules === -1 && bIndexOfNodeModules > -1) {
        return 1;
    }
    return (a > b) ? 1 : -1;
}
function defaultSortComponentFilesFn(a, b) {
    var aPeriods = a.split('.').length;
    var bPeriods = b.split('.').length;
    var aDashes = a.split('-').length;
    var bDashes = b.split('-').length;
    if (aPeriods > bPeriods) {
        return 1;
    }
    else if (aPeriods < bPeriods) {
        return -1;
    }
    if (aDashes > bDashes) {
        return 1;
    }
    else if (aDashes < bDashes) {
        return -1;
    }
    return (a > b) ? 1 : -1;
}
var taskInfo = {
    fullArg: '--sass',
    shortArg: '-s',
    envVar: 'IONIC_SASS',
    packageConfig: 'ionic_sass',
    defaultConfigFile: 'sass.config'
};
