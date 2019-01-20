"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path = require("path");
var typescript_1 = require("typescript");
var helpers_1 = require("./helpers");
function getTypescriptSourceFile(filePath, fileContent, languageVersion, setParentNodes) {
    if (languageVersion === void 0) { languageVersion = typescript_1.ScriptTarget.Latest; }
    if (setParentNodes === void 0) { setParentNodes = false; }
    return typescript_1.createSourceFile(filePath, fileContent, languageVersion, setParentNodes);
}
exports.getTypescriptSourceFile = getTypescriptSourceFile;
function removeDecorators(fileName, source) {
    var sourceFile = typescript_1.createSourceFile(fileName, source, typescript_1.ScriptTarget.Latest);
    var decorators = findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.Decorator, true);
    decorators.sort(function (a, b) { return b.pos - a.pos; });
    decorators.forEach(function (d) {
        source = source.slice(0, d.pos) + source.slice(d.end);
    });
    return source;
}
exports.removeDecorators = removeDecorators;
function findNodes(sourceFile, node, kind, keepGoing) {
    if (keepGoing === void 0) { keepGoing = false; }
    if (node.kind === kind && !keepGoing) {
        return [node];
    }
    return node.getChildren(sourceFile).reduce(function (result, n) {
        return result.concat(findNodes(sourceFile, n, kind, keepGoing));
    }, node.kind === kind ? [node] : []);
}
exports.findNodes = findNodes;
function replaceNode(filePath, fileContent, node, replacement) {
    var sourceFile = getTypescriptSourceFile(filePath, fileContent, typescript_1.ScriptTarget.Latest, false);
    var startIndex = node.getStart(sourceFile);
    var endIndex = node.getEnd();
    var modifiedContent = helpers_1.rangeReplace(fileContent, startIndex, endIndex, replacement);
    return modifiedContent;
}
exports.replaceNode = replaceNode;
function removeNode(filePath, fileContent, node) {
    var sourceFile = getTypescriptSourceFile(filePath, fileContent, typescript_1.ScriptTarget.Latest, false);
    var startIndex = node.getStart(sourceFile);
    var endIndex = node.getEnd();
    var modifiedContent = helpers_1.rangeReplace(fileContent, startIndex, endIndex, '');
    return modifiedContent;
}
exports.removeNode = removeNode;
function getNodeStringContent(sourceFile, node) {
    return sourceFile.getFullText().substring(node.getStart(sourceFile), node.getEnd());
}
exports.getNodeStringContent = getNodeStringContent;
function appendAfter(source, node, toAppend) {
    return helpers_1.stringSplice(source, node.getEnd(), 0, toAppend);
}
exports.appendAfter = appendAfter;
function appendEmpty(source, position, toAppend) {
    return helpers_1.stringSplice(source, position, 0, toAppend);
}
exports.appendEmpty = appendEmpty;
function appendBefore(filePath, fileContent, node, toAppend) {
    var sourceFile = getTypescriptSourceFile(filePath, fileContent, typescript_1.ScriptTarget.Latest, false);
    return helpers_1.stringSplice(fileContent, node.getStart(sourceFile), 0, toAppend);
}
exports.appendBefore = appendBefore;
function insertNamedImportIfNeeded(filePath, fileContent, namedImport, fromModule) {
    var sourceFile = getTypescriptSourceFile(filePath, fileContent, typescript_1.ScriptTarget.Latest, false);
    var allImports = findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.ImportDeclaration);
    var maybeImports = allImports.filter(function (node) {
        return node.moduleSpecifier.kind === typescript_1.SyntaxKind.StringLiteral
            && node.moduleSpecifier.text === fromModule;
    }).filter(function (node) {
        // Remove import statements that are either `import 'XYZ'` or `import * as X from 'XYZ'`.
        var clause = node.importClause;
        if (!clause || clause.name || !clause.namedBindings) {
            return false;
        }
        return clause.namedBindings.kind === typescript_1.SyntaxKind.NamedImports;
    }).map(function (node) {
        return node.importClause.namedBindings;
    });
    if (maybeImports.length) {
        // There's an `import {A, B, C} from 'modulePath'`.
        // Find if it's in either imports. If so, just return; nothing to do.
        var hasImportAlready = maybeImports.some(function (node) {
            return node.elements.some(function (element) {
                return element.name.text === namedImport;
            });
        });
        if (hasImportAlready) {
            // it's already imported, so just return the original text
            return fileContent;
        }
        // Just pick the first one and insert at the end of its identifier list.
        fileContent = appendAfter(fileContent, maybeImports[0].elements[maybeImports[0].elements.length - 1], ", " + namedImport);
    }
    else {
        // Find the last import and insert after.
        fileContent = appendAfter(fileContent, allImports[allImports.length - 1], "\nimport { " + namedImport + " } from '" + fromModule + "';");
    }
    return fileContent;
}
exports.insertNamedImportIfNeeded = insertNamedImportIfNeeded;
function replaceNamedImport(filePath, fileContent, namedImportOriginal, namedImportReplacement) {
    var sourceFile = getTypescriptSourceFile(filePath, fileContent, typescript_1.ScriptTarget.Latest, false);
    var allImports = findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.ImportDeclaration);
    var modifiedContent = fileContent;
    allImports.filter(function (node) {
        if (node.importClause && node.importClause.namedBindings) {
            return node.importClause.namedBindings.kind === typescript_1.SyntaxKind.NamedImports;
        }
    }).map(function (importDeclaration) {
        return importDeclaration.importClause.namedBindings;
    }).forEach(function (namedImport) {
        return namedImport.elements.forEach(function (element) {
            if (element.name.text === namedImportOriginal) {
                modifiedContent = replaceNode(filePath, modifiedContent, element, namedImportReplacement);
            }
        });
    });
    return modifiedContent;
}
exports.replaceNamedImport = replaceNamedImport;
function replaceImportModuleSpecifier(filePath, fileContent, moduleSpecifierOriginal, moduleSpecifierReplacement) {
    var sourceFile = getTypescriptSourceFile(filePath, fileContent, typescript_1.ScriptTarget.Latest, false);
    var allImports = findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.ImportDeclaration);
    var modifiedContent = fileContent;
    allImports.forEach(function (node) {
        if (node.moduleSpecifier.kind === typescript_1.SyntaxKind.StringLiteral && node.moduleSpecifier.text === moduleSpecifierOriginal) {
            modifiedContent = replaceNode(filePath, modifiedContent, node.moduleSpecifier, "'" + moduleSpecifierReplacement + "'");
        }
    });
    return modifiedContent;
}
exports.replaceImportModuleSpecifier = replaceImportModuleSpecifier;
function checkIfFunctionIsCalled(filePath, fileContent, functionName) {
    var sourceFile = getTypescriptSourceFile(filePath, fileContent, typescript_1.ScriptTarget.Latest, false);
    var allCalls = findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.CallExpression, true);
    var functionCallList = allCalls.filter(function (call) { return call.expression && call.expression.kind === typescript_1.SyntaxKind.Identifier && call.expression.text === functionName; });
    return functionCallList.length > 0;
}
exports.checkIfFunctionIsCalled = checkIfFunctionIsCalled;
function getClassDeclarations(sourceFile) {
    return findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.ClassDeclaration, true);
}
exports.getClassDeclarations = getClassDeclarations;
function getNgModuleClassName(filePath, fileContent) {
    var ngModuleSourceFile = getTypescriptSourceFile(filePath, fileContent);
    var classDeclarations = getClassDeclarations(ngModuleSourceFile);
    // find the class with NgModule decorator;
    var classNameList = [];
    classDeclarations.forEach(function (classDeclaration) {
        if (classDeclaration && classDeclaration.decorators) {
            classDeclaration.decorators.forEach(function (decorator) {
                if (decorator.expression && decorator.expression.expression && decorator.expression.expression.text === exports.NG_MODULE_DECORATOR_TEXT) {
                    var className = classDeclaration.name.text;
                    classNameList.push(className);
                }
            });
        }
    });
    if (classNameList.length === 0) {
        throw new Error("Could not find a class declaration in " + filePath);
    }
    if (classNameList.length > 1) {
        throw new Error("Multiple class declarations with NgModule in " + filePath + ". The correct class to use could not be determined.");
    }
    return classNameList[0];
}
exports.getNgModuleClassName = getNgModuleClassName;
function getNgModuleDecorator(fileName, sourceFile) {
    var ngModuleDecorators = [];
    var classDeclarations = getClassDeclarations(sourceFile);
    classDeclarations.forEach(function (classDeclaration) {
        if (classDeclaration && classDeclaration.decorators) {
            classDeclaration.decorators.forEach(function (decorator) {
                if (decorator.expression && decorator.expression.expression && decorator.expression.expression.text === exports.NG_MODULE_DECORATOR_TEXT) {
                    ngModuleDecorators.push(decorator);
                }
            });
        }
    });
    if (ngModuleDecorators.length === 0) {
        throw new Error("Could not find an \"NgModule\" decorator in " + fileName);
    }
    if (ngModuleDecorators.length > 1) {
        throw new Error("Multiple \"NgModule\" decorators found in " + fileName + ". The correct one to use could not be determined");
    }
    return ngModuleDecorators[0];
}
exports.getNgModuleDecorator = getNgModuleDecorator;
function getNgModuleObjectLiteralArg(decorator) {
    var ngModuleArgs = decorator.expression.arguments;
    if (!ngModuleArgs || ngModuleArgs.length === 0 || ngModuleArgs.length > 1) {
        throw new Error("Invalid NgModule Argument");
    }
    return ngModuleArgs[0];
}
exports.getNgModuleObjectLiteralArg = getNgModuleObjectLiteralArg;
function findObjectLiteralElementByName(properties, identifierToLookFor) {
    return properties.filter(function (propertyNode) {
        return propertyNode && propertyNode.name && propertyNode.name.text === identifierToLookFor;
    })[0];
}
exports.findObjectLiteralElementByName = findObjectLiteralElementByName;
function appendNgModuleDeclaration(filePath, fileContent, declaration) {
    var sourceFile = getTypescriptSourceFile(filePath, fileContent, typescript_1.ScriptTarget.Latest, false);
    var decorator = getNgModuleDecorator(path.basename(filePath), sourceFile);
    var obj = getNgModuleObjectLiteralArg(decorator);
    var properties = findObjectLiteralElementByName(obj.properties, 'declarations');
    var declarations = properties.initializer.elements;
    if (declarations.length === 0) {
        return appendEmpty(fileContent, declarations['end'], declaration);
    }
    else {
        return appendAfter(fileContent, declarations[declarations.length - 1], ",\n    " + declaration);
    }
}
exports.appendNgModuleDeclaration = appendNgModuleDeclaration;
function appendNgModuleProvider(filePath, fileContent, declaration) {
    var sourceFile = getTypescriptSourceFile(filePath, fileContent, typescript_1.ScriptTarget.Latest, false);
    var decorator = getNgModuleDecorator(path.basename(filePath), sourceFile);
    var obj = getNgModuleObjectLiteralArg(decorator);
    var properties = findObjectLiteralElementByName(obj.properties, 'providers');
    var providers = properties.initializer.elements;
    if (providers.length === 0) {
        return appendEmpty(fileContent, providers['end'], declaration);
    }
    else {
        return appendAfter(fileContent, providers[providers.length - 1], ",\n    " + declaration);
    }
}
exports.appendNgModuleProvider = appendNgModuleProvider;
function appendNgModuleExports(filePath, fileContent, declaration) {
    var sourceFile = getTypescriptSourceFile(filePath, fileContent, typescript_1.ScriptTarget.Latest, false);
    var decorator = getNgModuleDecorator(path.basename(filePath), sourceFile);
    var obj = getNgModuleObjectLiteralArg(decorator);
    var properties = findObjectLiteralElementByName(obj.properties, 'exports');
    var exportsProp = properties.initializer.elements;
    if (exportsProp.length === 0) {
        return appendEmpty(fileContent, exportsProp['end'], declaration);
    }
    else {
        return appendAfter(fileContent, exportsProp[exportsProp.length - 1], ",\n    " + declaration);
    }
}
exports.appendNgModuleExports = appendNgModuleExports;
exports.NG_MODULE_DECORATOR_TEXT = 'NgModule';
