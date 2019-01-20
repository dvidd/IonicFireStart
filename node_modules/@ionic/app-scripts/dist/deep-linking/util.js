"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var typescript_1 = require("typescript");
var logger_1 = require("../logger/logger");
var Constants = require("../util/constants");
var helpers_1 = require("../util/helpers");
var typescript_utils_1 = require("../util/typescript-utils");
function getDeepLinkData(appNgModuleFilePath, fileCache, isAot) {
    // we only care about analyzing a subset of typescript files, so do that for efficiency
    var typescriptFiles = filterTypescriptFilesForDeepLinks(fileCache);
    var deepLinkConfigEntries = new Map();
    var segmentSet = new Set();
    typescriptFiles.forEach(function (file) {
        var sourceFile = typescript_utils_1.getTypescriptSourceFile(file.path, file.content);
        var deepLinkDecoratorData = getDeepLinkDecoratorContentForSourceFile(sourceFile);
        if (deepLinkDecoratorData) {
            // sweet, the page has a DeepLinkDecorator, which means it meets the criteria to process that bad boy
            var pathInfo = getNgModuleDataFromPage(appNgModuleFilePath, file.path, deepLinkDecoratorData.className, fileCache, isAot);
            var deepLinkConfigEntry = Object.assign({}, deepLinkDecoratorData, pathInfo);
            if (deepLinkConfigEntries.has(deepLinkConfigEntry.name)) {
                // gadzooks, it's a duplicate name
                throw new Error("There are multiple entries in the deeplink config with the name of " + deepLinkConfigEntry.name);
            }
            if (segmentSet.has(deepLinkConfigEntry.segment)) {
                // gadzooks, it's a duplicate segment
                throw new Error("There are multiple entries in the deeplink config with the segment of " + deepLinkConfigEntry.segment);
            }
            segmentSet.add(deepLinkConfigEntry.segment);
            deepLinkConfigEntries.set(deepLinkConfigEntry.name, deepLinkConfigEntry);
        }
    });
    return deepLinkConfigEntries;
}
exports.getDeepLinkData = getDeepLinkData;
function filterTypescriptFilesForDeepLinks(fileCache) {
    return fileCache.getAll().filter(function (file) { return isDeepLinkingFile(file.path); });
}
exports.filterTypescriptFilesForDeepLinks = filterTypescriptFilesForDeepLinks;
function isDeepLinkingFile(filePath) {
    var deepLinksDir = helpers_1.getStringPropertyValue(Constants.ENV_VAR_DEEPLINKS_DIR) + path_1.sep;
    var moduleSuffix = helpers_1.getStringPropertyValue(Constants.ENV_NG_MODULE_FILE_NAME_SUFFIX);
    var result = path_1.extname(filePath) === '.ts' && filePath.indexOf(moduleSuffix) === -1 && filePath.indexOf(deepLinksDir) >= 0;
    return result;
}
exports.isDeepLinkingFile = isDeepLinkingFile;
function getNgModulePathFromCorrespondingPage(filePath) {
    var newExtension = helpers_1.getStringPropertyValue(Constants.ENV_NG_MODULE_FILE_NAME_SUFFIX);
    return helpers_1.changeExtension(filePath, newExtension);
}
exports.getNgModulePathFromCorrespondingPage = getNgModulePathFromCorrespondingPage;
function getRelativePathToPageNgModuleFromAppNgModule(pathToAppNgModule, pathToPageNgModule) {
    return path_1.relative(path_1.dirname(pathToAppNgModule), pathToPageNgModule);
}
exports.getRelativePathToPageNgModuleFromAppNgModule = getRelativePathToPageNgModuleFromAppNgModule;
function getNgModuleDataFromPage(appNgModuleFilePath, filePath, className, fileCache, isAot) {
    var ngModulePath = getNgModulePathFromCorrespondingPage(filePath);
    var ngModuleFile = fileCache.get(ngModulePath);
    if (!ngModuleFile) {
        throw new Error(filePath + " has a @IonicPage decorator, but it does not have a corresponding \"NgModule\" at " + ngModulePath);
    }
    // get the class declaration out of NgModule class content
    var exportedClassName = typescript_utils_1.getNgModuleClassName(ngModuleFile.path, ngModuleFile.content);
    var relativePathToAppNgModule = getRelativePathToPageNgModuleFromAppNgModule(appNgModuleFilePath, ngModulePath);
    var absolutePath = isAot ? helpers_1.changeExtension(ngModulePath, '.ngfactory.js') : helpers_1.changeExtension(ngModulePath, '.ts');
    var userlandModulePath = isAot ? helpers_1.changeExtension(relativePathToAppNgModule, '.ngfactory') : helpers_1.changeExtension(relativePathToAppNgModule, '');
    var namedExport = isAot ? exportedClassName + "NgFactory" : exportedClassName;
    return {
        absolutePath: absolutePath,
        userlandModulePath: helpers_1.toUnixPath(userlandModulePath),
        className: namedExport
    };
}
exports.getNgModuleDataFromPage = getNgModuleDataFromPage;
function getDeepLinkDecoratorContentForSourceFile(sourceFile) {
    var classDeclarations = typescript_utils_1.getClassDeclarations(sourceFile);
    var defaultSegment = path_1.basename(helpers_1.changeExtension(sourceFile.fileName, ''));
    var list = [];
    classDeclarations.forEach(function (classDeclaration) {
        if (classDeclaration.decorators) {
            classDeclaration.decorators.forEach(function (decorator) {
                var className = classDeclaration.name.text;
                if (decorator.expression && decorator.expression.expression && decorator.expression.expression.text === DEEPLINK_DECORATOR_TEXT) {
                    var deepLinkArgs = decorator.expression.arguments;
                    var deepLinkObject = null;
                    if (deepLinkArgs && deepLinkArgs.length) {
                        deepLinkObject = deepLinkArgs[0];
                    }
                    var propertyList = [];
                    if (deepLinkObject && deepLinkObject.properties) {
                        propertyList = deepLinkObject.properties; // TODO this typing got jacked up
                    }
                    var deepLinkName = getStringValueFromDeepLinkDecorator(sourceFile, propertyList, className, DEEPLINK_DECORATOR_NAME_ATTRIBUTE);
                    var deepLinkSegment = getStringValueFromDeepLinkDecorator(sourceFile, propertyList, defaultSegment, DEEPLINK_DECORATOR_SEGMENT_ATTRIBUTE);
                    var deepLinkPriority = getStringValueFromDeepLinkDecorator(sourceFile, propertyList, 'low', DEEPLINK_DECORATOR_PRIORITY_ATTRIBUTE);
                    var deepLinkDefaultHistory = getArrayValueFromDeepLinkDecorator(sourceFile, propertyList, [], DEEPLINK_DECORATOR_DEFAULT_HISTORY_ATTRIBUTE);
                    var rawStringContent = typescript_utils_1.getNodeStringContent(sourceFile, decorator.expression);
                    list.push({
                        name: deepLinkName,
                        segment: deepLinkSegment,
                        priority: deepLinkPriority,
                        defaultHistory: deepLinkDefaultHistory,
                        rawString: rawStringContent,
                        className: className
                    });
                }
            });
        }
    });
    if (list.length > 1) {
        throw new Error('Only one @IonicPage decorator is allowed per file.');
    }
    if (list.length === 1) {
        return list[0];
    }
    return null;
}
exports.getDeepLinkDecoratorContentForSourceFile = getDeepLinkDecoratorContentForSourceFile;
function getStringValueFromDeepLinkDecorator(sourceFile, propertyNodeList, defaultValue, identifierToLookFor) {
    try {
        var valueToReturn_1 = defaultValue;
        logger_1.Logger.debug("[DeepLinking util] getNameValueFromDeepLinkDecorator: Setting default deep link " + identifierToLookFor + " to " + defaultValue);
        propertyNodeList.forEach(function (propertyNode) {
            if (propertyNode && propertyNode.name && propertyNode.name.text === identifierToLookFor) {
                var initializer = propertyNode.initializer;
                var stringContent = typescript_utils_1.getNodeStringContent(sourceFile, initializer);
                stringContent = helpers_1.replaceAll(stringContent, '\'', '');
                stringContent = helpers_1.replaceAll(stringContent, '`', '');
                stringContent = helpers_1.replaceAll(stringContent, '"', '');
                stringContent = stringContent.trim();
                valueToReturn_1 = stringContent;
            }
        });
        logger_1.Logger.debug("[DeepLinking util] getNameValueFromDeepLinkDecorator: DeepLink " + identifierToLookFor + " set to " + valueToReturn_1);
        return valueToReturn_1;
    }
    catch (ex) {
        logger_1.Logger.error("Failed to parse the @IonicPage decorator. The " + identifierToLookFor + " must be an array of strings");
        throw ex;
    }
}
function getArrayValueFromDeepLinkDecorator(sourceFile, propertyNodeList, defaultValue, identifierToLookFor) {
    try {
        var valueToReturn_2 = defaultValue;
        logger_1.Logger.debug("[DeepLinking util] getArrayValueFromDeepLinkDecorator: Setting default deep link " + identifierToLookFor + " to " + defaultValue);
        propertyNodeList.forEach(function (propertyNode) {
            if (propertyNode && propertyNode.name && propertyNode.name.text === identifierToLookFor) {
                var initializer = propertyNode.initializer;
                if (initializer && initializer.elements) {
                    var stringArray = initializer.elements.map(function (element) {
                        var elementText = element.text;
                        elementText = helpers_1.replaceAll(elementText, '\'', '');
                        elementText = helpers_1.replaceAll(elementText, '`', '');
                        elementText = helpers_1.replaceAll(elementText, '"', '');
                        elementText = elementText.trim();
                        return elementText;
                    });
                    valueToReturn_2 = stringArray;
                }
            }
        });
        logger_1.Logger.debug("[DeepLinking util] getNameValueFromDeepLinkDecorator: DeepLink " + identifierToLookFor + " set to " + valueToReturn_2);
        return valueToReturn_2;
    }
    catch (ex) {
        logger_1.Logger.error("Failed to parse the @IonicPage decorator. The " + identifierToLookFor + " must be an array of strings");
        throw ex;
    }
}
function hasExistingDeepLinkConfig(appNgModuleFilePath, appNgModuleFileContent) {
    var sourceFile = typescript_utils_1.getTypescriptSourceFile(appNgModuleFilePath, appNgModuleFileContent);
    var decorator = typescript_utils_1.getNgModuleDecorator(appNgModuleFilePath, sourceFile);
    var functionCall = getIonicModuleForRootCall(decorator);
    if (functionCall.arguments.length <= 2) {
        return false;
    }
    var deepLinkConfigArg = functionCall.arguments[2];
    if (deepLinkConfigArg.kind === typescript_1.SyntaxKind.NullKeyword || deepLinkConfigArg.kind === typescript_1.SyntaxKind.UndefinedKeyword) {
        return false;
    }
    if (deepLinkConfigArg.kind === typescript_1.SyntaxKind.ObjectLiteralExpression) {
        return true;
    }
    if (deepLinkConfigArg.text && deepLinkConfigArg.text.length > 0) {
        return true;
    }
}
exports.hasExistingDeepLinkConfig = hasExistingDeepLinkConfig;
function getIonicModuleForRootCall(decorator) {
    var argument = typescript_utils_1.getNgModuleObjectLiteralArg(decorator);
    var properties = argument.properties.filter(function (property) {
        return property.name.text === NG_MODULE_IMPORT_DECLARATION;
    });
    if (properties.length === 0) {
        throw new Error('Could not find "import" property in NgModule arguments');
    }
    if (properties.length > 1) {
        throw new Error('Found multiple "import" properties in NgModule arguments. Only one is allowed');
    }
    var property = properties[0];
    var importArrayLiteral = property.initializer;
    var functionsInImport = importArrayLiteral.elements.filter(function (element) {
        return element.kind === typescript_1.SyntaxKind.CallExpression;
    });
    var ionicModuleFunctionCalls = functionsInImport.filter(function (functionNode) {
        return (functionNode.expression
            && functionNode.expression.name
            && functionNode.expression.name.text === FOR_ROOT_METHOD
            && functionNode.expression.expression
            && functionNode.expression.expression.text === IONIC_MODULE_NAME);
    });
    if (ionicModuleFunctionCalls.length === 0) {
        throw new Error('Could not find IonicModule.forRoot call in "imports"');
    }
    if (ionicModuleFunctionCalls.length > 1) {
        throw new Error('Found multiple IonicModule.forRoot calls in "imports". Only one is allowed');
    }
    return ionicModuleFunctionCalls[0];
}
function convertDeepLinkConfigEntriesToString(entries) {
    var individualLinks = [];
    entries.forEach(function (entry) {
        individualLinks.push(convertDeepLinkEntryToJsObjectString(entry));
    });
    var deepLinkConfigString = "\n{\n  links: [\n    " + individualLinks.join(',\n    ') + "\n  ]\n}";
    return deepLinkConfigString;
}
exports.convertDeepLinkConfigEntriesToString = convertDeepLinkConfigEntriesToString;
function convertDeepLinkEntryToJsObjectString(entry) {
    var defaultHistoryWithQuotes = entry.defaultHistory.map(function (defaultHistoryEntry) { return "'" + defaultHistoryEntry + "'"; });
    var segmentString = entry.segment && entry.segment.length ? "'" + entry.segment + "'" : null;
    return "{ loadChildren: '" + entry.userlandModulePath + LOAD_CHILDREN_SEPARATOR + entry.className + "', name: '" + entry.name + "', segment: " + segmentString + ", priority: '" + entry.priority + "', defaultHistory: [" + defaultHistoryWithQuotes.join(', ') + "] }";
}
exports.convertDeepLinkEntryToJsObjectString = convertDeepLinkEntryToJsObjectString;
function updateAppNgModuleWithDeepLinkConfig(context, deepLinkString, changedFiles) {
    var appNgModulePath = helpers_1.getStringPropertyValue(Constants.ENV_APP_NG_MODULE_PATH);
    var appNgModuleFile = context.fileCache.get(appNgModulePath);
    if (!appNgModuleFile) {
        throw new Error("App NgModule " + appNgModulePath + " not found in cache");
    }
    var updatedAppNgModuleContent = getUpdatedAppNgModuleContentWithDeepLinkConfig(appNgModulePath, appNgModuleFile.content, deepLinkString);
    context.fileCache.set(appNgModulePath, { path: appNgModulePath, content: updatedAppNgModuleContent });
    if (changedFiles) {
        changedFiles.push({
            event: 'change',
            filePath: appNgModulePath,
            ext: path_1.extname(appNgModulePath).toLowerCase()
        });
    }
}
exports.updateAppNgModuleWithDeepLinkConfig = updateAppNgModuleWithDeepLinkConfig;
function getUpdatedAppNgModuleContentWithDeepLinkConfig(appNgModuleFilePath, appNgModuleFileContent, deepLinkStringContent) {
    var sourceFile = typescript_utils_1.getTypescriptSourceFile(appNgModuleFilePath, appNgModuleFileContent);
    var decorator = typescript_utils_1.getNgModuleDecorator(appNgModuleFilePath, sourceFile);
    var functionCall = getIonicModuleForRootCall(decorator);
    if (functionCall.arguments.length === 1) {
        appNgModuleFileContent = addDefaultSecondArgumentToAppNgModule(appNgModuleFileContent, functionCall);
        sourceFile = typescript_utils_1.getTypescriptSourceFile(appNgModuleFilePath, appNgModuleFileContent);
        decorator = typescript_utils_1.getNgModuleDecorator(appNgModuleFilePath, sourceFile);
        functionCall = getIonicModuleForRootCall(decorator);
    }
    if (functionCall.arguments.length === 2) {
        // we need to add the node
        return addDeepLinkArgumentToAppNgModule(appNgModuleFileContent, functionCall, deepLinkStringContent);
    }
    // we need to replace whatever node exists here with the deeplink config
    return typescript_utils_1.replaceNode(appNgModuleFilePath, appNgModuleFileContent, functionCall.arguments[2], deepLinkStringContent);
}
exports.getUpdatedAppNgModuleContentWithDeepLinkConfig = getUpdatedAppNgModuleContentWithDeepLinkConfig;
function getUpdatedAppNgModuleFactoryContentWithDeepLinksConfig(appNgModuleFactoryFileContent, deepLinkStringContent) {
    // tried to do this with typescript API, wasn't clear on how to do it
    var regex = /this.*?DeepLinkConfigToken.*?=([\s\S]*?);/g;
    var results = regex.exec(appNgModuleFactoryFileContent);
    if (results && results.length === 2) {
        var actualString = results[0];
        var chunkToReplace = results[1];
        var fullStringToReplace = actualString.replace(chunkToReplace, deepLinkStringContent);
        return appNgModuleFactoryFileContent.replace(actualString, fullStringToReplace);
    }
    throw new Error('The RegExp to find the DeepLinkConfigToken did not return valid data');
}
exports.getUpdatedAppNgModuleFactoryContentWithDeepLinksConfig = getUpdatedAppNgModuleFactoryContentWithDeepLinksConfig;
function addDefaultSecondArgumentToAppNgModule(appNgModuleFileContent, ionicModuleForRoot) {
    var argOneNode = ionicModuleForRoot.arguments[0];
    var updatedFileContent = typescript_utils_1.appendAfter(appNgModuleFileContent, argOneNode, ', {}');
    return updatedFileContent;
}
exports.addDefaultSecondArgumentToAppNgModule = addDefaultSecondArgumentToAppNgModule;
function addDeepLinkArgumentToAppNgModule(appNgModuleFileContent, ionicModuleForRoot, deepLinkString) {
    var argTwoNode = ionicModuleForRoot.arguments[1];
    var updatedFileContent = typescript_utils_1.appendAfter(appNgModuleFileContent, argTwoNode, ", " + deepLinkString);
    return updatedFileContent;
}
exports.addDeepLinkArgumentToAppNgModule = addDeepLinkArgumentToAppNgModule;
function generateDefaultDeepLinkNgModuleContent(pageFilePath, className) {
    var importFrom = path_1.basename(pageFilePath, '.ts');
    return "\nimport { NgModule } from '@angular/core';\nimport { IonicPageModule } from 'ionic-angular';\nimport { " + className + " } from './" + importFrom + "';\n\n@NgModule({\n  declarations: [\n    " + className + ",\n  ],\n  imports: [\n    IonicPageModule.forChild(" + className + ")\n  ]\n})\nexport class " + className + "Module {}\n\n";
}
exports.generateDefaultDeepLinkNgModuleContent = generateDefaultDeepLinkNgModuleContent;
function purgeDeepLinkDecoratorTSTransform() {
    return purgeDeepLinkDecoratorTSTransformImpl;
}
exports.purgeDeepLinkDecoratorTSTransform = purgeDeepLinkDecoratorTSTransform;
function purgeDeepLinkDecoratorTSTransformImpl(transformContext) {
    function visitClassDeclaration(classDeclaration) {
        var hasDeepLinkDecorator = false;
        var diffDecorators = [];
        for (var _i = 0, _a = classDeclaration.decorators || []; _i < _a.length; _i++) {
            var decorator = _a[_i];
            if (decorator.expression && decorator.expression.expression
                && decorator.expression.expression.text === DEEPLINK_DECORATOR_TEXT) {
                hasDeepLinkDecorator = true;
            }
            else {
                diffDecorators.push(decorator);
            }
        }
        if (hasDeepLinkDecorator) {
            return typescript_1.updateClassDeclaration(classDeclaration, diffDecorators, classDeclaration.modifiers, classDeclaration.name, classDeclaration.typeParameters, classDeclaration.heritageClauses, classDeclaration.members);
        }
        return classDeclaration;
    }
    function visitImportDeclaration(importDeclaration, sourceFile) {
        if (importDeclaration.moduleSpecifier
            && importDeclaration.moduleSpecifier.text === 'ionic-angular'
            && importDeclaration.importClause
            && importDeclaration.importClause.namedBindings
            && importDeclaration.importClause.namedBindings.elements) {
            // loop over each import and store it
            var importSpecifiers_1 = [];
            importDeclaration.importClause.namedBindings.elements.forEach(function (importSpecifier) {
                if (importSpecifier.name.text !== DEEPLINK_DECORATOR_TEXT) {
                    importSpecifiers_1.push(importSpecifier);
                }
            });
            var emptyNamedImports = typescript_1.createNamedImports(importSpecifiers_1);
            var newImportClause = typescript_1.updateImportClause(importDeclaration.importClause, importDeclaration.importClause.name, emptyNamedImports);
            return typescript_1.updateImportDeclaration(importDeclaration, importDeclaration.decorators, importDeclaration.modifiers, newImportClause, importDeclaration.moduleSpecifier);
        }
        return importDeclaration;
    }
    function visit(node, sourceFile) {
        switch (node.kind) {
            case typescript_1.SyntaxKind.ClassDeclaration:
                return visitClassDeclaration(node);
            case typescript_1.SyntaxKind.ImportDeclaration:
                return visitImportDeclaration(node, sourceFile);
            default:
                return typescript_1.visitEachChild(node, function (node) {
                    return visit(node, sourceFile);
                }, transformContext);
        }
    }
    return function (sourceFile) {
        return visit(sourceFile, sourceFile);
    };
}
exports.purgeDeepLinkDecoratorTSTransformImpl = purgeDeepLinkDecoratorTSTransformImpl;
function purgeDeepLinkDecorator(inputText) {
    var sourceFile = typescript_utils_1.getTypescriptSourceFile('', inputText);
    var classDeclarations = typescript_utils_1.getClassDeclarations(sourceFile);
    var toRemove = [];
    var toReturn = inputText;
    for (var _i = 0, classDeclarations_1 = classDeclarations; _i < classDeclarations_1.length; _i++) {
        var classDeclaration = classDeclarations_1[_i];
        for (var _a = 0, _b = classDeclaration.decorators || []; _a < _b.length; _a++) {
            var decorator = _b[_a];
            if (decorator.expression && decorator.expression.expression
                && decorator.expression.expression.text === DEEPLINK_DECORATOR_TEXT) {
                toRemove.push(decorator);
            }
        }
    }
    toRemove.forEach(function (node) {
        toReturn = typescript_utils_1.replaceNode('', inputText, node, '');
    });
    toReturn = purgeDeepLinkImport(toReturn);
    return toReturn;
}
exports.purgeDeepLinkDecorator = purgeDeepLinkDecorator;
function purgeDeepLinkImport(inputText) {
    var sourceFile = typescript_utils_1.getTypescriptSourceFile('', inputText);
    var importDeclarations = typescript_utils_1.findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.ImportDeclaration);
    importDeclarations.forEach(function (importDeclaration) {
        if (importDeclaration.moduleSpecifier
            && importDeclaration.moduleSpecifier.text === 'ionic-angular'
            && importDeclaration.importClause
            && importDeclaration.importClause.namedBindings
            && importDeclaration.importClause.namedBindings.elements) {
            // loop over each import and store it
            var decoratorIsImported_1 = false;
            var namedImportStrings_1 = [];
            importDeclaration.importClause.namedBindings.elements.forEach(function (importSpecifier) {
                if (importSpecifier.name.text === DEEPLINK_DECORATOR_TEXT) {
                    decoratorIsImported_1 = true;
                }
                else {
                    namedImportStrings_1.push(importSpecifier.name.text);
                }
            });
            // okay, cool. If namedImportStrings is empty, then just remove the entire import statement
            // otherwise, just replace the named imports with the namedImportStrings separated by a comma
            if (decoratorIsImported_1) {
                if (namedImportStrings_1.length) {
                    // okay cool, we only want to remove some of these homies
                    var stringRepresentation = namedImportStrings_1.join(', ');
                    var namedImportString = "{ " + stringRepresentation + " }";
                    inputText = typescript_utils_1.replaceNode('', inputText, importDeclaration.importClause.namedBindings, namedImportString);
                }
                else {
                    // remove the entire import statement
                    inputText = typescript_utils_1.replaceNode('', inputText, importDeclaration, '');
                }
            }
        }
    });
    return inputText;
}
exports.purgeDeepLinkImport = purgeDeepLinkImport;
function getInjectDeepLinkConfigTypescriptTransform() {
    var deepLinkString = convertDeepLinkConfigEntriesToString(helpers_1.getParsedDeepLinkConfig());
    var appNgModulePath = helpers_1.toUnixPath(helpers_1.getStringPropertyValue(Constants.ENV_APP_NG_MODULE_PATH));
    return injectDeepLinkConfigTypescriptTransform(deepLinkString, appNgModulePath);
}
exports.getInjectDeepLinkConfigTypescriptTransform = getInjectDeepLinkConfigTypescriptTransform;
function injectDeepLinkConfigTypescriptTransform(deepLinkString, appNgModuleFilePath) {
    function visitDecoratorNode(decorator, sourceFile) {
        if (decorator.expression && decorator.expression.expression && decorator.expression.expression.text === typescript_utils_1.NG_MODULE_DECORATOR_TEXT) {
            // okay cool, we have the ng module
            var functionCall = getIonicModuleForRootCall(decorator);
            var updatedArgs = functionCall.arguments;
            if (updatedArgs.length === 1) {
                updatedArgs.push(typescript_1.createIdentifier('{ }'));
            }
            if (updatedArgs.length === 2) {
                updatedArgs.push(typescript_1.createIdentifier(deepLinkString));
            }
            functionCall = typescript_1.updateCall(functionCall, functionCall.expression, functionCall.typeArguments, updatedArgs);
            // loop over the parent elements and replace the IonicModule expression with ours'
            for (var i = 0; i < (functionCall.parent.elements || []).length; i++) {
                var element = functionCall.parent.elements[i];
                if (element.king === typescript_1.SyntaxKind.CallExpression
                    && element.expression
                    && element.expression.expression
                    && element.expression.expression.escapedText === 'IonicModule') {
                    functionCall.parent.elements[i] = functionCall;
                }
            }
        }
        return decorator;
    }
    return function (transformContext) {
        function visit(node, sourceFile, sourceFilePath) {
            if (sourceFilePath !== appNgModuleFilePath) {
                return node;
            }
            switch (node.kind) {
                case typescript_1.SyntaxKind.Decorator:
                    return visitDecoratorNode(node, sourceFile);
                default:
                    return typescript_1.visitEachChild(node, function (node) {
                        return visit(node, sourceFile, sourceFilePath);
                    }, transformContext);
            }
        }
        return function (sourceFile) {
            return visit(sourceFile, sourceFile, sourceFile.fileName);
        };
    };
}
exports.injectDeepLinkConfigTypescriptTransform = injectDeepLinkConfigTypescriptTransform;
var DEEPLINK_DECORATOR_TEXT = 'IonicPage';
var DEEPLINK_DECORATOR_NAME_ATTRIBUTE = 'name';
var DEEPLINK_DECORATOR_SEGMENT_ATTRIBUTE = 'segment';
var DEEPLINK_DECORATOR_PRIORITY_ATTRIBUTE = 'priority';
var DEEPLINK_DECORATOR_DEFAULT_HISTORY_ATTRIBUTE = 'defaultHistory';
var NG_MODULE_IMPORT_DECLARATION = 'imports';
var IONIC_MODULE_NAME = 'IonicModule';
var FOR_ROOT_METHOD = 'forRoot';
var LOAD_CHILDREN_SEPARATOR = '#';
