"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var typescript_1 = require("typescript");
var typescript_utils_1 = require("../util/typescript-utils");
function getFallbackMainContent() {
    return "\nimport { platformBrowser } from '@angular/platform-browser';\nimport { enableProdMode } from '@angular/core';\n\nimport { AppModuleNgFactory } from './app.module.ngfactory';\n\nenableProdMode();\nplatformBrowser().bootstrapModuleFactory(AppModuleNgFactory);";
}
exports.getFallbackMainContent = getFallbackMainContent;
function getBootstrapNodes(allCalls) {
    return allCalls
        .filter(function (call) { return call.expression.kind === typescript_1.SyntaxKind.PropertyAccessExpression; })
        .map(function (call) { return call.expression; })
        .filter(function (access) {
        return access.name.kind === typescript_1.SyntaxKind.Identifier
            && access.name.text === 'bootstrapModule';
    });
}
function replaceNgModuleClassName(filePath, fileContent, className) {
    var sourceFile = typescript_utils_1.getTypescriptSourceFile(filePath, fileContent, typescript_1.ScriptTarget.Latest, false);
    var allCalls = typescript_utils_1.findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.CallExpression, true);
    var bootstraps = getBootstrapNodes(allCalls);
    var modifiedContent = fileContent;
    allCalls.filter(function (call) { return bootstraps.some(function (bs) { return bs === call.expression; }); }).forEach(function (call) {
        modifiedContent = typescript_utils_1.replaceNode(filePath, modifiedContent, call.arguments[0], className + 'NgFactory');
    });
    return modifiedContent;
}
function replacePlatformBrowser(filePath, fileContent) {
    var sourceFile = typescript_utils_1.getTypescriptSourceFile(filePath, fileContent, typescript_1.ScriptTarget.Latest, false);
    var allCalls = typescript_utils_1.findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.CallExpression, true);
    var bootstraps = getBootstrapNodes(allCalls);
    var calls = bootstraps.reduce(function (previous, access) {
        var expressions = typescript_utils_1.findNodes(sourceFile, access, typescript_1.SyntaxKind.CallExpression, true);
        return previous.concat(expressions);
    }, [])
        .filter(function (call) {
        return call.expression.kind === typescript_1.SyntaxKind.Identifier
            && call.expression.text === 'platformBrowserDynamic';
    });
    var modifiedContent = fileContent;
    calls.forEach(function (call) {
        modifiedContent = typescript_utils_1.replaceNode(filePath, modifiedContent, call.expression, 'platformBrowser');
    });
    return modifiedContent;
}
function checkForPlatformDynamicBrowser(filePath, fileContent) {
    var sourceFile = typescript_utils_1.getTypescriptSourceFile(filePath, fileContent, typescript_1.ScriptTarget.Latest, false);
    var allCalls = typescript_utils_1.findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.CallExpression, true);
    var bootstraps = getBootstrapNodes(allCalls);
    var calls = bootstraps.reduce(function (previous, access) {
        var expressions = typescript_utils_1.findNodes(sourceFile, access, typescript_1.SyntaxKind.CallExpression, true);
        return previous.concat(expressions);
    }, [])
        .filter(function (call) {
        return call.expression.kind === typescript_1.SyntaxKind.Identifier
            && call.expression.text === 'platformBrowserDynamic';
    });
    return calls && calls.length;
}
function replaceBootstrapModuleFactory(filePath, fileContent) {
    var sourceFile = typescript_utils_1.getTypescriptSourceFile(filePath, fileContent, typescript_1.ScriptTarget.Latest, false);
    var allCalls = typescript_utils_1.findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.CallExpression, true);
    var bootstraps = getBootstrapNodes(allCalls);
    var modifiedContent = fileContent;
    bootstraps.forEach(function (bs) {
        modifiedContent = typescript_utils_1.replaceNode(filePath, modifiedContent, bs.name, 'bootstrapModuleFactory');
    });
    return modifiedContent;
}
function getPlatformBrowserFunctionNode(filePath, fileContent) {
    var modifiedFileContent = fileContent;
    var sourceFile = typescript_utils_1.getTypescriptSourceFile(filePath, modifiedFileContent, typescript_1.ScriptTarget.Latest, false);
    var allCalls = typescript_utils_1.findNodes(sourceFile, sourceFile, typescript_1.SyntaxKind.CallExpression, true);
    var callsToPlatformBrowser = allCalls.filter(function (call) { return call.expression && call.expression.kind === typescript_1.SyntaxKind.Identifier && call.expression.text === 'platformBrowser'; });
    var toAppend = "enableProdMode();\n";
    if (callsToPlatformBrowser.length) {
        modifiedFileContent = typescript_utils_1.appendBefore(filePath, modifiedFileContent, callsToPlatformBrowser[0].expression, toAppend);
    }
    else {
        // just throw it at the bottom
        modifiedFileContent += toAppend;
    }
    return modifiedFileContent;
}
function importAndEnableProdMode(filePath, fileContent) {
    var modifiedFileContent = fileContent;
    modifiedFileContent = typescript_utils_1.insertNamedImportIfNeeded(filePath, modifiedFileContent, 'enableProdMode', '@angular/core');
    var isCalled = typescript_utils_1.checkIfFunctionIsCalled(filePath, modifiedFileContent, 'enableProdMode');
    if (!isCalled) {
        // go ahead and insert this
        modifiedFileContent = getPlatformBrowserFunctionNode(filePath, modifiedFileContent);
    }
    return modifiedFileContent;
}
function replaceBootstrapImpl(filePath, fileContent, appNgModulePath, appNgModuleClassName) {
    if (!fileContent.match(/\bbootstrapModule\b/)) {
        throw new Error("Could not find bootstrapModule in " + filePath);
    }
    var withoutExtension = path_1.join(path_1.dirname(appNgModulePath), path_1.basename(appNgModulePath, '.ts'));
    var appModuleAbsoluteFileName = path_1.normalize(path_1.resolve(withoutExtension));
    var withNgFactory = appModuleAbsoluteFileName + '.ngfactory';
    var originalImport = './' + path_1.relative(path_1.dirname(filePath), appModuleAbsoluteFileName);
    var ngFactryImport = './' + path_1.relative(path_1.dirname(filePath), withNgFactory);
    if (!checkForPlatformDynamicBrowser(filePath, fileContent)) {
        throw new Error("Could not find any references to \"platformBrowserDynamic\" in " + filePath);
    }
    var modifiedFileContent = fileContent;
    modifiedFileContent = replaceNgModuleClassName(filePath, modifiedFileContent, appNgModuleClassName);
    modifiedFileContent = replacePlatformBrowser(filePath, modifiedFileContent);
    modifiedFileContent = replaceBootstrapModuleFactory(filePath, modifiedFileContent);
    modifiedFileContent = typescript_utils_1.replaceNamedImport(filePath, modifiedFileContent, 'platformBrowserDynamic', 'platformBrowser');
    modifiedFileContent = typescript_utils_1.replaceNamedImport(filePath, modifiedFileContent, appNgModuleClassName, appNgModuleClassName + 'NgFactory');
    modifiedFileContent = typescript_utils_1.replaceImportModuleSpecifier(filePath, modifiedFileContent, '@angular/platform-browser-dynamic', '@angular/platform-browser');
    modifiedFileContent = typescript_utils_1.replaceImportModuleSpecifier(filePath, modifiedFileContent, originalImport, ngFactryImport);
    // check if prod mode is imported and enabled
    modifiedFileContent = importAndEnableProdMode(filePath, modifiedFileContent);
    return modifiedFileContent;
}
exports.replaceBootstrapImpl = replaceBootstrapImpl;
