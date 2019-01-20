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
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var logger_1 = require("../logger/logger");
var helpers_1 = require("../util/helpers");
var Constants = require("../util/constants");
var GeneratorConstants = require("./constants");
var helpers_2 = require("../util/helpers");
var glob_util_1 = require("../util/glob-util");
var helpers_3 = require("../util/helpers");
var typescript_utils_1 = require("../util/typescript-utils");
function hydrateRequest(context, request) {
    var hydrated = request;
    var suffix = getSuffixFromGeneratorType(context, request.type);
    hydrated.className = helpers_3.ensureSuffix(helpers_2.pascalCase(request.name), helpers_2.upperCaseFirst(suffix));
    hydrated.fileName = helpers_3.removeSuffix(helpers_2.paramCase(request.name), "-" + helpers_2.paramCase(suffix));
    if (request.type === 'pipe')
        hydrated.pipeName = helpers_2.camelCase(request.name);
    if (!!hydrated.includeNgModule) {
        if (hydrated.type === 'tabs') {
            hydrated.importStatement = "import { IonicPage, NavController } from 'ionic-angular';";
        }
        else {
            hydrated.importStatement = "import { IonicPage, NavController, NavParams } from 'ionic-angular';";
        }
        hydrated.ionicPage = '\n@IonicPage()';
    }
    else {
        hydrated.ionicPage = null;
        hydrated.importStatement = "import { NavController, NavParams } from 'ionic-angular';";
    }
    hydrated.dirToRead = path_1.join(helpers_2.getStringPropertyValue(Constants.ENV_VAR_IONIC_ANGULAR_TEMPLATE_DIR), request.type);
    var baseDir = getDirToWriteToByType(context, request.type);
    hydrated.dirToWrite = path_1.join(baseDir, hydrated.fileName);
    return hydrated;
}
exports.hydrateRequest = hydrateRequest;
function createCommonModule(envVar, requestType) {
    var className = requestType.charAt(0).toUpperCase() + requestType.slice(1) + 's';
    var tmplt = "import { NgModule } from '@angular/core';\n@NgModule({\n\tdeclarations: [],\n\timports: [],\n\texports: []\n})\nexport class " + className + "Module {}\n";
    fs_1.writeFileSync(envVar, tmplt);
}
exports.createCommonModule = createCommonModule;
function hydrateTabRequest(context, request) {
    var h = hydrateRequest(context, request);
    var hydrated = Object.assign({
        tabs: request.tabs,
        tabContent: '',
        tabVariables: '',
        tabsImportStatement: '',
    }, h);
    if (hydrated.includeNgModule) {
        hydrated.tabsImportStatement += "import { IonicPage, NavController } from 'ionic-angular';";
    }
    else {
        hydrated.tabsImportStatement += "import { NavController } from 'ionic-angular';";
    }
    for (var i = 0; i < request.tabs.length; i++) {
        var tabVar = helpers_2.camelCase(request.tabs[i].name) + "Root";
        if (hydrated.includeNgModule) {
            hydrated.tabVariables += "  " + tabVar + " = '" + request.tabs[i].className + "'\n";
        }
        else {
            hydrated.tabVariables += "  " + tabVar + " = " + request.tabs[i].className + "\n";
        }
        // If this is the last ion-tab to insert
        // then we do not want a new line
        if (i === request.tabs.length - 1) {
            hydrated.tabContent += "    <ion-tab [root]=\"" + tabVar + "\" tabTitle=\"" + helpers_2.sentenceCase(request.tabs[i].name) + "\" tabIcon=\"information-circle\"></ion-tab>";
        }
        else {
            hydrated.tabContent += "    <ion-tab [root]=\"" + tabVar + "\" tabTitle=\"" + helpers_2.sentenceCase(request.tabs[i].name) + "\" tabIcon=\"information-circle\"></ion-tab>\n";
        }
    }
    return hydrated;
}
exports.hydrateTabRequest = hydrateTabRequest;
function readTemplates(pathToRead) {
    var fileNames = fs_1.readdirSync(pathToRead);
    var absolutePaths = fileNames.map(function (fileName) {
        return path_1.join(pathToRead, fileName);
    });
    var filePathToContent = new Map();
    var promises = absolutePaths.map(function (absolutePath) {
        var promise = helpers_2.readFileAsync(absolutePath);
        promise.then(function (fileContent) {
            filePathToContent.set(absolutePath, fileContent);
        });
        return promise;
    });
    return Promise.all(promises).then(function () {
        return filePathToContent;
    });
}
exports.readTemplates = readTemplates;
function filterOutTemplates(request, templates) {
    var templatesToUseMap = new Map();
    templates.forEach(function (fileContent, filePath) {
        var newFileExtension = path_1.basename(filePath, GeneratorConstants.KNOWN_FILE_EXTENSION);
        var shouldSkip = (!request.includeNgModule && newFileExtension === GeneratorConstants.NG_MODULE_FILE_EXTENSION) || (!request.includeSpec && newFileExtension === GeneratorConstants.SPEC_FILE_EXTENSION);
        if (!shouldSkip) {
            templatesToUseMap.set(filePath, fileContent);
        }
    });
    return templatesToUseMap;
}
exports.filterOutTemplates = filterOutTemplates;
function applyTemplates(request, templates) {
    var appliedTemplateMap = new Map();
    templates.forEach(function (fileContent, filePath) {
        fileContent = helpers_2.replaceAll(fileContent, GeneratorConstants.CLASSNAME_VARIABLE, request.className);
        fileContent = helpers_2.replaceAll(fileContent, GeneratorConstants.PIPENAME_VARIABLE, request.pipeName);
        fileContent = helpers_2.replaceAll(fileContent, GeneratorConstants.IMPORTSTATEMENT_VARIABLE, request.importStatement);
        fileContent = helpers_2.replaceAll(fileContent, GeneratorConstants.IONICPAGE_VARIABLE, request.ionicPage);
        fileContent = helpers_2.replaceAll(fileContent, GeneratorConstants.FILENAME_VARIABLE, request.fileName);
        fileContent = helpers_2.replaceAll(fileContent, GeneratorConstants.SUPPLIEDNAME_VARIABLE, request.name);
        fileContent = helpers_2.replaceAll(fileContent, GeneratorConstants.TAB_CONTENT_VARIABLE, request.tabContent);
        fileContent = helpers_2.replaceAll(fileContent, GeneratorConstants.TAB_VARIABLES_VARIABLE, request.tabVariables);
        fileContent = helpers_2.replaceAll(fileContent, GeneratorConstants.TABS_IMPORTSTATEMENT_VARIABLE, request.tabsImportStatement);
        appliedTemplateMap.set(filePath, fileContent);
    });
    return appliedTemplateMap;
}
exports.applyTemplates = applyTemplates;
function writeGeneratedFiles(request, processedTemplates) {
    var promises = [];
    var createdFileList = [];
    processedTemplates.forEach(function (fileContent, filePath) {
        var newFileExtension = path_1.basename(filePath, GeneratorConstants.KNOWN_FILE_EXTENSION);
        var newFileName = request.fileName + "." + newFileExtension;
        var fileToWrite = path_1.join(request.dirToWrite, newFileName);
        createdFileList.push(fileToWrite);
        promises.push(createDirAndWriteFile(fileToWrite, fileContent));
    });
    return Promise.all(promises).then(function () {
        return createdFileList;
    });
}
exports.writeGeneratedFiles = writeGeneratedFiles;
function createDirAndWriteFile(filePath, fileContent) {
    var directory = path_1.dirname(filePath);
    return helpers_2.mkDirpAsync(directory).then(function () {
        return helpers_2.writeFileAsync(filePath, fileContent);
    });
}
function getNgModules(context, types) {
    var ngModuleSuffix = helpers_2.getStringPropertyValue(Constants.ENV_NG_MODULE_FILE_NAME_SUFFIX);
    var patterns = types.map(function (type) { return path_1.join(getDirToWriteToByType(context, type), '**', "*" + ngModuleSuffix); });
    return glob_util_1.globAll(patterns);
}
exports.getNgModules = getNgModules;
function getSuffixFromGeneratorType(context, type) {
    if (type === Constants.COMPONENT) {
        return 'Component';
    }
    else if (type === Constants.DIRECTIVE) {
        return 'Directive';
    }
    else if (type === Constants.PAGE || type === Constants.TABS) {
        return 'Page';
    }
    else if (type === Constants.PIPE) {
        return 'Pipe';
    }
    else if (type === Constants.PROVIDER) {
        return 'Provider';
    }
    throw new Error("Unknown Generator Type: " + type);
}
function getDirToWriteToByType(context, type) {
    if (type === Constants.COMPONENT) {
        return context.componentsDir;
    }
    else if (type === Constants.DIRECTIVE) {
        return context.directivesDir;
    }
    else if (type === Constants.PAGE || type === Constants.TABS) {
        return context.pagesDir;
    }
    else if (type === Constants.PIPE) {
        return context.pipesDir;
    }
    else if (type === Constants.PROVIDER) {
        return context.providersDir;
    }
    throw new Error("Unknown Generator Type: " + type);
}
exports.getDirToWriteToByType = getDirToWriteToByType;
function nonPageFileManipulation(context, name, ngModulePath, type) {
    return __awaiter(this, void 0, void 0, function () {
        var hydratedRequest, envVar, importPath, fileContent, templatesArray, typescriptFilePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hydratedRequest = hydrateRequest(context, { type: type, name: name });
                    envVar = helpers_2.getStringPropertyValue("IONIC_" + hydratedRequest.type.toUpperCase() + "S_NG_MODULE_PATH");
                    return [4 /*yield*/, generateTemplates(context, hydratedRequest, false)];
                case 1:
                    templatesArray = _a.sent();
                    if (hydratedRequest.type === 'pipe' || hydratedRequest.type === 'component' || hydratedRequest.type === 'directive') {
                        if (!fs_1.existsSync(envVar))
                            createCommonModule(envVar, hydratedRequest.type);
                    }
                    typescriptFilePath = helpers_3.changeExtension(templatesArray.filter(function (path) { return path_1.extname(path) === '.ts'; })[0], '');
                    helpers_2.readFileAsync(ngModulePath).then(function (content) {
                        importPath = type === 'pipe' || type === 'component' || type === 'directive'
                            ? helpers_1.toUnixPath("./" + path_1.relative(path_1.dirname(ngModulePath), hydratedRequest.dirToWrite) + path_1.sep + hydratedRequest.fileName)
                            : helpers_1.toUnixPath("" + path_1.relative(path_1.dirname(ngModulePath), hydratedRequest.dirToWrite) + path_1.sep + hydratedRequest.fileName);
                        content = typescript_utils_1.insertNamedImportIfNeeded(ngModulePath, content, hydratedRequest.className, importPath);
                        if (type === 'pipe' || type === 'component' || type === 'directive') {
                            content = typescript_utils_1.appendNgModuleDeclaration(ngModulePath, content, hydratedRequest.className);
                            content = typescript_utils_1.appendNgModuleExports(ngModulePath, content, hydratedRequest.className);
                        }
                        if (type === 'provider') {
                            content = typescript_utils_1.appendNgModuleProvider(ngModulePath, content, hydratedRequest.className);
                        }
                        return helpers_2.writeFileAsync(ngModulePath, content);
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.nonPageFileManipulation = nonPageFileManipulation;
function tabsModuleManipulation(tabs, hydratedRequest, tabHydratedRequests) {
    tabHydratedRequests.forEach(function (tabRequest, index) {
        tabRequest.generatedFileNames = tabs[index];
    });
    var ngModulePath = tabs[0].find(function (element) { return element.indexOf('module') !== -1; });
    if (!ngModulePath) {
        // Static imports
        var tabsPath_1 = path_1.join(hydratedRequest.dirToWrite, hydratedRequest.fileName + ".ts");
        var modifiedContent_1 = null;
        return helpers_2.readFileAsync(tabsPath_1).then(function (content) {
            tabHydratedRequests.forEach(function (tabRequest) {
                var typescriptFilePath = helpers_3.changeExtension(tabRequest.generatedFileNames.filter(function (path) { return path_1.extname(path) === '.ts'; })[0], '');
                var importPath = helpers_1.toUnixPath(path_1.relative(path_1.dirname(tabsPath_1), typescriptFilePath));
                modifiedContent_1 = typescript_utils_1.insertNamedImportIfNeeded(tabsPath_1, content, tabRequest.className, importPath);
                content = modifiedContent_1;
            });
            return helpers_2.writeFileAsync(tabsPath_1, modifiedContent_1);
        });
    }
}
exports.tabsModuleManipulation = tabsModuleManipulation;
function generateTemplates(context, request, includePageConstants) {
    logger_1.Logger.debug('[Generators] generateTemplates: Reading templates ...');
    var pageConstantFile = path_1.join(context.pagesDir, 'pages.constants.ts');
    if (includePageConstants && !fs_1.existsSync(pageConstantFile))
        createPageConstants(context);
    return readTemplates(request.dirToRead).then(function (map) {
        logger_1.Logger.debug('[Generators] generateTemplates: Filtering out NgModule and Specs if needed ...');
        return filterOutTemplates(request, map);
    }).then(function (filteredMap) {
        logger_1.Logger.debug('[Generators] generateTemplates: Applying templates ...');
        var appliedTemplateMap = applyTemplates(request, filteredMap);
        logger_1.Logger.debug('[Generators] generateTemplates: Writing generated files to disk ...');
        // Adding const to gets some type completion
        if (includePageConstants)
            createConstStatments(pageConstantFile, request);
        return writeGeneratedFiles(request, appliedTemplateMap);
    });
}
exports.generateTemplates = generateTemplates;
function createConstStatments(pageConstantFile, request) {
    helpers_2.readFileAsync(pageConstantFile).then(function (content) {
        content += "\nexport const " + helpers_2.constantCase(request.className) + " = '" + request.className + "';";
        helpers_2.writeFileAsync(pageConstantFile, content);
    });
}
exports.createConstStatments = createConstStatments;
function createPageConstants(context) {
    var pageConstantFile = path_1.join(context.pagesDir, 'pages.constants.ts');
    helpers_2.writeFileAsync(pageConstantFile, '//Constants for getting type references');
}
exports.createPageConstants = createPageConstants;
