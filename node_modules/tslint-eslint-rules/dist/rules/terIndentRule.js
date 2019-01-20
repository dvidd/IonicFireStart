"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var RULE_NAME = 'ter-indent';
var DEFAULT_VARIABLE_INDENT = 1;
var DEFAULT_PARAMETER_INDENT = null;
var DEFAULT_FUNCTION_BODY_INDENT = 1;
var indentType = 'space';
var indentSize = 4;
var OPTIONS;
function assign(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) {
        if (source !== undefined && source !== null) {
            for (var nextKey in source) {
                if (source.hasOwnProperty(nextKey)) {
                    target[nextKey] = source[nextKey];
                }
            }
        }
    });
    return target;
}
function isKind(node, kind) {
    return node.kind === ts.SyntaxKind[kind];
}
function isOneOf(node, kinds) {
    return kinds.some(function (kind) { return node.kind === ts.SyntaxKind[kind]; });
}
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var walker = new IndentWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(walker);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: RULE_NAME,
    hasFix: true,
    description: 'enforce consistent indentation',
    rationale: (_a = ["\n      Using only one of tabs or spaces for indentation leads to more consistent editor behavior,\n      cleaner diffs in version control, and easier programmatic manipulation.\n      "], _a.raw = ["\n      Using only one of tabs or spaces for indentation leads to more consistent editor behavior,\n      cleaner diffs in version control, and easier programmatic manipulation.\n      "], Lint.Utils.dedent(_a)),
    optionsDescription: (_b = ["\n      The string 'tab' or an integer indicating the number of spaces to use per tab.\n\n      An object may be provided to fine tune the indentation rules:\n\n        * `\"SwitchCase\"` (default: 0) enforces indentation level for `case` clauses in\n                           `switch` statements\n        * `\"VariableDeclarator\"` (default: 1) enforces indentation level for `var` declarators;\n                                   can also take an object to define separate rules for `var`,\n                                   `let` and `const` declarations.\n        * `\"outerIIFEBody\"` (default: 1) enforces indentation level for file-level IIFEs.\n        * `\"MemberExpression\"` (off by default) enforces indentation level for multi-line\n                                 property chains (except in variable declarations and assignments)\n        * `\"FunctionDeclaration\"` takes an object to define rules for function declarations.\n            * `\"parameters\"` (off by default) enforces indentation level for parameters in a\n                               function declaration. This can either be a number indicating\n                               indentation level, or the string `\"first\"` indicating that all\n                               parameters of the declaration must be aligned with the first parameter.\n            * `\"body\"` (default: 1) enforces indentation level for the body of a function expression.\n        * `\"FunctionExpression\"` takes an object to define rules for function declarations.\n            * `\"parameters\"` (off by default) enforces indentation level for parameters in a\n                               function declaration. This can either be a number indicating\n                               indentation level, or the string `\"first\"` indicating that all\n                               parameters of the declaration must be aligned with the first parameter.\n            * `\"body\"` (default: 1) enforces indentation level for the body of a function expression.\n        * `\"CallExpression\"` takes an object to define rules for function call expressions.\n            * `\"arguments\"` (off by default) enforces indentation level for arguments in a call\n                              expression. This can either be a number indicating indentation level,\n                              or the string `\"first\"` indicating that all arguments of the\n                              expression must be aligned with the first argument.\n      "], _b.raw = ["\n      The string 'tab' or an integer indicating the number of spaces to use per tab.\n\n      An object may be provided to fine tune the indentation rules:\n\n        * \\`\"SwitchCase\"\\` (default: 0) enforces indentation level for \\`case\\` clauses in\n                           \\`switch\\` statements\n        * \\`\"VariableDeclarator\"\\` (default: 1) enforces indentation level for \\`var\\` declarators;\n                                   can also take an object to define separate rules for \\`var\\`,\n                                   \\`let\\` and \\`const\\` declarations.\n        * \\`\"outerIIFEBody\"\\` (default: 1) enforces indentation level for file-level IIFEs.\n        * \\`\"MemberExpression\"\\` (off by default) enforces indentation level for multi-line\n                                 property chains (except in variable declarations and assignments)\n        * \\`\"FunctionDeclaration\"\\` takes an object to define rules for function declarations.\n            * \\`\"parameters\"\\` (off by default) enforces indentation level for parameters in a\n                               function declaration. This can either be a number indicating\n                               indentation level, or the string \\`\"first\"\\` indicating that all\n                               parameters of the declaration must be aligned with the first parameter.\n            * \\`\"body\"\\` (default: 1) enforces indentation level for the body of a function expression.\n        * \\`\"FunctionExpression\"\\` takes an object to define rules for function declarations.\n            * \\`\"parameters\"\\` (off by default) enforces indentation level for parameters in a\n                               function declaration. This can either be a number indicating\n                               indentation level, or the string \\`\"first\"\\` indicating that all\n                               parameters of the declaration must be aligned with the first parameter.\n            * \\`\"body\"\\` (default: 1) enforces indentation level for the body of a function expression.\n        * \\`\"CallExpression\"\\` takes an object to define rules for function call expressions.\n            * \\`\"arguments\"\\` (off by default) enforces indentation level for arguments in a call\n                              expression. This can either be a number indicating indentation level,\n                              or the string \\`\"first\"\\` indicating that all arguments of the\n                              expression must be aligned with the first argument.\n      "], Lint.Utils.dedent(_b)),
    options: {
        type: 'array',
        items: [{
                type: 'number',
                minimum: '0'
            }, {
                type: 'string',
                enum: ['tab']
            }, {
                type: 'object',
                properties: {
                    SwitchCase: {
                        type: 'number',
                        minimum: 0
                    },
                    VariableDeclarator: {
                        type: 'object',
                        properties: {
                            var: {
                                type: 'number',
                                minimum: 0
                            },
                            let: {
                                type: 'number',
                                minimum: 0
                            },
                            const: {
                                type: 'number',
                                minimum: 0
                            }
                        }
                    },
                    outerIIFEBody: {
                        type: 'number'
                    },
                    FunctionDeclaration: {
                        type: 'object',
                        properties: {
                            parameters: {
                                type: 'number',
                                minimum: 0
                            },
                            body: {
                                type: 'number',
                                minimum: 0
                            }
                        }
                    },
                    FunctionExpression: {
                        type: 'object',
                        properties: {
                            parameters: {
                                type: 'number',
                                minimum: 0
                            },
                            body: {
                                type: 'number',
                                minimum: 0
                            }
                        }
                    },
                    MemberExpression: {
                        type: 'number'
                    },
                    CallExpression: {
                        type: 'object',
                        properties: {
                            arguments: {
                                type: 'number',
                                minimum: 0
                            }
                        }
                    }
                },
                additionalProperties: false
            }],
        minLength: 1,
        maxLength: 2
    },
    optionExamples: [
        (_c = ["\n        \"", "\": [true, \"tab\"]\n        "], _c.raw = ["\n        \"", "\": [true, \"tab\"]\n        "], Lint.Utils.dedent(_c, RULE_NAME)),
        (_d = ["\n        \"", "\": [true, 2]\n        "], _d.raw = ["\n        \"", "\": [true, 2]\n        "], Lint.Utils.dedent(_d, RULE_NAME)),
        (_e = ["\n        \"", "\": [\n          true,\n          2,\n          {\n            \"FunctionExpression\": {\n              \"parameters\": 1,\n              \"body\": 1\n            }\n          }\n        ]\n        "], _e.raw = ["\n        \"", "\": [\n          true,\n          2,\n          {\n            \"FunctionExpression\": {\n              \"parameters\": 1,\n              \"body\": 1\n            }\n          }\n        ]\n        "], Lint.Utils.dedent(_e, RULE_NAME))
    ],
    typescriptOnly: false,
    type: 'maintainability'
};
exports.Rule = Rule;
var IndentWalker = (function (_super) {
    tslib_1.__extends(IndentWalker, _super);
    function IndentWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.caseIndentStore = {};
        _this.varIndentStore = {};
        OPTIONS = {
            SwitchCase: 0,
            VariableDeclarator: {
                var: DEFAULT_VARIABLE_INDENT,
                let: DEFAULT_VARIABLE_INDENT,
                const: DEFAULT_VARIABLE_INDENT
            },
            outerIIFEBody: null,
            FunctionDeclaration: {
                parameters: DEFAULT_PARAMETER_INDENT,
                body: DEFAULT_FUNCTION_BODY_INDENT
            },
            FunctionExpression: {
                parameters: DEFAULT_PARAMETER_INDENT,
                body: DEFAULT_FUNCTION_BODY_INDENT
            },
            CallExpression: {
                arguments: DEFAULT_PARAMETER_INDENT
            }
        };
        var firstParam = _this.getOptions()[0];
        if (firstParam === 'tab') {
            indentSize = 1;
            indentType = 'tab';
        }
        else {
            indentSize = firstParam || 4;
            indentType = 'space';
        }
        var userOptions = _this.getOptions()[1];
        if (userOptions) {
            OPTIONS.SwitchCase = userOptions.SwitchCase || 0;
            if (typeof userOptions.VariableDeclarator === 'number') {
                OPTIONS.VariableDeclarator = {
                    var: userOptions.VariableDeclarator,
                    let: userOptions.VariableDeclarator,
                    const: userOptions.VariableDeclarator
                };
            }
            else if (typeof userOptions.VariableDeclarator === 'object') {
                assign(OPTIONS.VariableDeclarator, userOptions.VariableDeclarator);
            }
            if (typeof userOptions.outerIIFEBody === 'number') {
                OPTIONS.outerIIFEBody = userOptions.outerIIFEBody;
            }
            if (typeof userOptions.MemberExpression === 'number') {
                OPTIONS.MemberExpression = userOptions.MemberExpression;
            }
            if (typeof userOptions.FunctionDeclaration === 'object') {
                assign(OPTIONS.FunctionDeclaration, userOptions.FunctionDeclaration);
            }
            if (typeof userOptions.FunctionExpression === 'object') {
                assign(OPTIONS.FunctionExpression, userOptions.FunctionExpression);
            }
            if (typeof userOptions.CallExpression === 'object') {
                assign(OPTIONS.CallExpression, userOptions.CallExpression);
            }
        }
        _this.srcFile = sourceFile;
        _this.srcText = sourceFile.getFullText();
        return _this;
    }
    IndentWalker.prototype.getSourceSubstr = function (start, end) {
        return this.srcText.substr(start, end - start);
    };
    IndentWalker.prototype.getLineAndCharacter = function (node, byEndLocation) {
        if (byEndLocation === void 0) { byEndLocation = false; }
        var index = byEndLocation ? node.getEnd() : node.getStart();
        return this.srcFile.getLineAndCharacterOfPosition(index);
    };
    IndentWalker.prototype.getLine = function (node, byEndLocation) {
        if (byEndLocation === void 0) { byEndLocation = false; }
        return this.getLineAndCharacter(node, byEndLocation).line;
    };
    IndentWalker.prototype.createErrorMessage = function (expectedAmount, actualSpaces, actualTabs) {
        var expectedStatement = expectedAmount + " " + indentType + (expectedAmount === 1 ? '' : 's');
        var foundSpacesWord = "space" + (actualSpaces === 1 ? '' : 's');
        var foundTabsWord = "tab" + (actualTabs === 1 ? '' : 's');
        var foundStatement;
        if (actualSpaces > 0 && actualTabs > 0) {
            foundStatement = actualSpaces + " " + foundSpacesWord + " and " + actualTabs + " " + foundTabsWord;
        }
        else if (actualSpaces > 0) {
            foundStatement = indentType === 'space' ? actualSpaces : actualSpaces + " " + foundSpacesWord;
        }
        else if (actualTabs > 0) {
            foundStatement = indentType === 'tab' ? actualTabs : actualTabs + " " + foundTabsWord;
        }
        else {
            foundStatement = '0';
        }
        return "Expected indentation of " + expectedStatement + " but found " + foundStatement + ".";
    };
    IndentWalker.prototype.report = function (node, needed, gottenSpaces, gottenTabs, loc) {
        if (gottenSpaces && gottenTabs) {
            return;
        }
        var msg = this.createErrorMessage(needed, gottenSpaces, gottenTabs);
        var width = gottenSpaces + gottenTabs;
        var start = (loc !== undefined ? loc : node.getStart()) - width;
        var desiredIndent = (indentType === 'space' ? ' ' : '\t').repeat(needed);
        var fix = this.createReplacement(start, width, desiredIndent);
        this.addFailure(this.createFailure(start, width, msg, fix));
    };
    IndentWalker.prototype.isNodeFirstInLine = function (node, byEndLocation) {
        if (byEndLocation === void 0) { byEndLocation = false; }
        var token = byEndLocation ? node.getLastToken() : node.getFirstToken();
        var pos = token.getStart() - 1;
        while ([' ', '\t'].indexOf(this.srcText.charAt(pos)) !== -1) {
            pos -= 1;
        }
        return this.srcText.charAt(pos) === '\n' || this._firstInLineCommentHelper(node);
    };
    IndentWalker.prototype._firstInLineCommentHelper = function (node) {
        var pos;
        var firstInLine = false;
        var comments = ts.getLeadingCommentRanges(node.getFullText(), 0);
        if (comments && comments.length) {
            var offset = node.getFullStart();
            var lastComment = comments[comments.length - 1];
            var comment = this.getSourceSubstr(lastComment.pos + offset, lastComment.end + offset);
            if (comment.indexOf('\n') !== -1) {
                firstInLine = true;
            }
            else {
                pos = lastComment.pos + offset;
                while (pos > 0 && this.srcText.charAt(pos) !== '\n') {
                    pos -= 1;
                }
                var content = this.getSourceSubstr(pos + 1, lastComment.pos + offset);
                if (content.trim() === '') {
                    firstInLine = true;
                }
            }
        }
        return firstInLine;
    };
    IndentWalker.prototype.getNodeIndent = function (node) {
        if (node === this.getSourceFile()) {
            return { contentStart: 0, firstInLine: true, space: 0, tab: 0, goodChar: 0, badChar: 0 };
        }
        if (node.kind === ts.SyntaxKind.SyntaxList && node.parent) {
            return this.getNodeIndent(node.parent);
        }
        var endIndex = node.getStart();
        var pos = endIndex - 1;
        while (pos > 0 && this.srcText.charAt(pos) !== '\n') {
            pos -= 1;
        }
        var str = this.getSourceSubstr(pos + 1, endIndex);
        var whiteSpace = (str.match(/^\s+/) || [''])[0];
        var indentChars = whiteSpace.split('');
        var spaces = indentChars.filter(function (char) { return char === ' '; }).length;
        var tabs = indentChars.filter(function (char) { return char === '\t'; }).length;
        return {
            contentStart: pos + spaces + tabs + 1,
            firstInLine: spaces + tabs === str.length || this._firstInLineCommentHelper(node),
            space: spaces,
            tab: tabs,
            goodChar: indentType === 'space' ? spaces : tabs,
            badChar: indentType === 'space' ? tabs : spaces
        };
    };
    IndentWalker.prototype.checkNodeIndent = function (node, neededIndent) {
        var actualIndent = this.getNodeIndent(node);
        if (!isKind(node, 'ArrayLiteralExpression') &&
            !isKind(node, 'ObjectLiteralExpression') &&
            (actualIndent.goodChar !== neededIndent || actualIndent.badChar !== 0) &&
            actualIndent.firstInLine) {
            this.report(node, neededIndent, actualIndent.space, actualIndent.tab, actualIndent.contentStart);
        }
        if (isKind(node, 'IfStatement')) {
            var elseStatement = node.elseStatement;
            if (elseStatement) {
                var elseKeyword = node.getChildren().filter(function (ch) { return isKind(ch, 'ElseKeyword'); }).shift();
                this.checkNodeIndent(elseKeyword, neededIndent);
                if (!this.isNodeFirstInLine(elseStatement)) {
                    this.checkNodeIndent(elseStatement, neededIndent);
                }
            }
        }
        else if (isKind(node, 'TryStatement')) {
            var handler = node.catchClause;
            if (handler) {
                var catchKeyword = handler.getChildren().filter(function (ch) { return isKind(ch, 'CatchKeyword'); }).shift();
                this.checkNodeIndent(catchKeyword, neededIndent);
                if (!this.isNodeFirstInLine(handler)) {
                    this.checkNodeIndent(handler, neededIndent);
                }
            }
            var finalizer = node.finallyBlock;
            if (finalizer) {
                var finallyKeyword = node.getChildren().filter(function (ch) { return isKind(ch, 'FinallyKeyword'); }).shift();
                this.checkNodeIndent(finallyKeyword, neededIndent);
            }
        }
        else if (isKind(node, 'DoStatement')) {
            var whileKeyword = node.getChildren().filter(function (ch) { return isKind(ch, 'WhileKeyword'); }).shift();
            this.checkNodeIndent(whileKeyword, neededIndent);
        }
    };
    IndentWalker.prototype.isSingleLineNode = function (node) {
        var text = node.kind === ts.SyntaxKind.SyntaxList ? node.getFullText() : node.getText();
        return text.indexOf('\n') === -1;
    };
    IndentWalker.prototype.blockIndentationCheck = function (node) {
        if (this.isSingleLineNode(node)) {
            return;
        }
        var functionLike = [
            'FunctionExpression',
            'FunctionDeclaration',
            'MethodDeclaration',
            'Constructor',
            'ArrowFunction'
        ];
        if (node.parent && isOneOf(node.parent, functionLike)) {
            this.checkIndentInFunctionBlock(node);
            return;
        }
        var indent;
        var nodesToCheck = [];
        var statementsWithProperties = [
            'IfStatement',
            'WhileStatement',
            'ForStatement',
            'ForInStatement',
            'ForOfStatement',
            'DoStatement',
            'ClassDeclaration',
            'ClassExpression',
            'InterfaceDeclaration',
            'TypeLiteral',
            'TryStatement',
            'SourceFile'
        ];
        if (node.parent && isOneOf(node.parent, statementsWithProperties) && this.isNodeBodyBlock(node)) {
            indent = this.getNodeIndent(node.parent).goodChar;
        }
        else if (node.parent && isKind(node.parent, 'CatchClause')) {
            indent = this.getNodeIndent(node.parent.parent).goodChar;
        }
        else {
            indent = this.getNodeIndent(node).goodChar;
        }
        if (isKind(node, 'IfStatement') && !isKind(node.thenStatement, 'Block')) {
            nodesToCheck = [node.thenStatement];
        }
        else {
            if (isKind(node, 'Block')) {
                nodesToCheck = node.getChildren()[1].getChildren();
            }
            else if (node.parent &&
                isOneOf(node.parent, [
                    'ClassDeclaration',
                    'ClassExpression',
                    'InterfaceDeclaration',
                    'TypeLiteral'
                ])) {
                nodesToCheck = node.getChildren();
            }
            else {
                nodesToCheck = [node.statement];
            }
        }
        this.checkNodeIndent(node, indent);
        if (nodesToCheck.length > 0) {
            this.checkNodesIndent(nodesToCheck, indent + indentSize);
        }
        if (isKind(node, 'Block')) {
            this.checkLastNodeLineIndent(node, indent);
        }
        else if (node.parent && this.isNodeBodyBlock(node)) {
            this.checkLastNodeLineIndent(node.parent, indent);
        }
    };
    IndentWalker.prototype.isAssignment = function (node) {
        if (!isKind(node, 'BinaryExpression')) {
            return false;
        }
        return node.operatorToken.getText() === '=';
    };
    IndentWalker.prototype.isNodeBodyBlock = function (node) {
        var hasBlock = [
            'ClassDeclaration',
            'ClassExpression',
            'InterfaceDeclaration',
            'TypeLiteral'
        ];
        return isKind(node, 'Block') || (isKind(node, 'SyntaxList') &&
            isOneOf(node.parent, hasBlock));
    };
    IndentWalker.prototype.checkFirstNodeLineIndent = function (node, firstLineIndent) {
        var startIndent = this.getNodeIndent(node);
        var firstInLine = startIndent.firstInLine;
        if (firstInLine && (startIndent.goodChar !== firstLineIndent || startIndent.badChar !== 0)) {
            this.report(node, firstLineIndent, startIndent.space, startIndent.tab, startIndent.contentStart);
        }
    };
    IndentWalker.prototype.checkLastNodeLineIndent = function (node, lastLineIndent) {
        var lastToken = node.getLastToken();
        var endIndent = this.getNodeIndent(lastToken);
        var firstInLine = endIndent.firstInLine;
        if (firstInLine && (endIndent.goodChar !== lastLineIndent || endIndent.badChar !== 0)) {
            this.report(lastToken, lastLineIndent, endIndent.space, endIndent.tab);
        }
    };
    IndentWalker.prototype.isOuterIIFE = function (node) {
        if (!node.parent)
            return false;
        var parent = node.parent;
        var expressionIsNode = parent.expression !== node;
        if (isKind(parent, 'ParenthesizedExpression')) {
            parent = parent.parent;
        }
        if (!isKind(parent, 'CallExpression') || expressionIsNode) {
            return false;
        }
        var stmt = parent;
        var condition;
        do {
            stmt = stmt.parent;
            condition = (isKind(stmt, 'PrefixUnaryExpression') && (stmt.operator === ts.SyntaxKind.ExclamationToken ||
                stmt.operator === ts.SyntaxKind.TildeToken ||
                stmt.operator === ts.SyntaxKind.PlusToken ||
                stmt.operator === ts.SyntaxKind.MinusToken) ||
                isKind(stmt, 'BinaryExpression') ||
                isKind(stmt, 'SyntaxList') ||
                isKind(stmt, 'VariableDeclaration') ||
                isKind(stmt, 'VariableDeclarationList') ||
                isKind(stmt, 'ParenthesizedExpression'));
        } while (condition);
        return ((isKind(stmt, 'ExpressionStatement') ||
            isKind(stmt, 'VariableStatement')) &&
            !!stmt.parent && isKind(stmt.parent, 'SourceFile'));
    };
    IndentWalker.prototype.isArgBeforeCalleeNodeMultiline = function (node) {
        var parent = node.parent;
        if (parent && parent['arguments'].length >= 2 && parent['arguments'][1] === node) {
            var firstArg = parent['arguments'][0];
            return this.getLine(firstArg, true) > this.getLine(firstArg);
        }
        return false;
    };
    IndentWalker.prototype.checkIndentInFunctionBlock = function (node) {
        var calleeNode = node.parent;
        var indent = this.getNodeIndent(calleeNode).goodChar;
        if (calleeNode.parent && calleeNode.parent.kind === ts.SyntaxKind.CallExpression) {
            var calleeParent = calleeNode.parent;
            if (calleeNode.kind !== ts.SyntaxKind.FunctionExpression && calleeNode.kind !== ts.SyntaxKind.ArrowFunction) {
                if (calleeParent && this.getLine(calleeParent) < this.getLine(node)) {
                    indent = this.getNodeIndent(calleeParent).goodChar;
                }
            }
            else {
                var callee = calleeParent.expression;
                if (this.isArgBeforeCalleeNodeMultiline(calleeNode) &&
                    this.getLine(callee) === this.getLine(callee, true) &&
                    !this.isNodeFirstInLine(calleeNode)) {
                    indent = this.getNodeIndent(calleeParent).goodChar;
                }
            }
        }
        var functionOffset = indentSize;
        if (OPTIONS.outerIIFEBody !== null && this.isOuterIIFE(calleeNode)) {
            functionOffset = OPTIONS.outerIIFEBody * indentSize;
        }
        else if (calleeNode.kind === ts.SyntaxKind.FunctionExpression) {
            functionOffset = OPTIONS.FunctionExpression.body * indentSize;
        }
        else if (calleeNode.kind === ts.SyntaxKind.FunctionDeclaration) {
            functionOffset = OPTIONS.FunctionDeclaration.body * indentSize;
        }
        else if (isOneOf(calleeNode, ['MethodDeclaration', 'Constructor'])) {
            functionOffset = OPTIONS.FunctionExpression.body * indentSize;
        }
        indent += functionOffset;
        var parentVarNode = this.getVariableDeclaratorNode(node);
        if (parentVarNode && this.isNodeInVarOnTop(node, parentVarNode) && parentVarNode.parent) {
            var varKind = parentVarNode.parent.getFirstToken().getText();
            indent += indentSize * OPTIONS.VariableDeclarator[varKind];
        }
        this.checkFirstNodeLineIndent(node, indent - functionOffset);
        if (node.statements.length) {
            this.checkNodesIndent(node.statements, indent);
        }
        this.checkLastNodeLineIndent(node, indent - functionOffset);
    };
    IndentWalker.prototype.checkNodesIndent = function (nodes, indent) {
        var _this = this;
        nodes.forEach(function (node) { return _this.checkNodeIndent(node, indent); });
    };
    IndentWalker.prototype.expectedCaseIndent = function (node, switchIndent) {
        var switchNode = (node.kind === ts.SyntaxKind.SwitchStatement) ? node : node.parent;
        var line = this.getLine(switchNode);
        var caseIndent;
        if (this.caseIndentStore[line]) {
            return this.caseIndentStore[line];
        }
        else {
            if (typeof switchIndent === 'undefined') {
                switchIndent = this.getNodeIndent(switchNode).goodChar;
            }
            caseIndent = switchIndent + (indentSize * OPTIONS.SwitchCase);
            this.caseIndentStore[line] = caseIndent;
            return caseIndent;
        }
    };
    IndentWalker.prototype.expectedVarIndent = function (node, varIndent) {
        var varNode = node.parent;
        var line = this.getLine(varNode);
        var indent;
        if (this.varIndentStore[line]) {
            return this.varIndentStore[line];
        }
        else {
            if (typeof varIndent === 'undefined') {
                varIndent = this.getNodeIndent(varNode).goodChar;
            }
            var varKind = varNode.getFirstToken().getText();
            indent = varIndent + (indentSize * OPTIONS.VariableDeclarator[varKind]);
            this.varIndentStore[line] = indent;
            return indent;
        }
    };
    IndentWalker.prototype.getParentNodeByType = function (node, kind, stopAtList) {
        if (stopAtList === void 0) { stopAtList = [ts.SyntaxKind.SourceFile]; }
        var parent = node.parent;
        while (parent
            && parent.kind !== kind
            && stopAtList.indexOf(parent.kind) === -1
            && parent.kind !== ts.SyntaxKind.SourceFile) {
            parent = parent.parent;
        }
        return parent && parent.kind === kind ? parent : null;
    };
    IndentWalker.prototype.getVariableDeclaratorNode = function (node) {
        return this.getParentNodeByType(node, ts.SyntaxKind.VariableDeclaration);
    };
    IndentWalker.prototype.getBinaryExpressionNode = function (node) {
        return this.getParentNodeByType(node, ts.SyntaxKind.BinaryExpression);
    };
    IndentWalker.prototype.checkIndentInArrayOrObjectBlock = function (node) {
        if (this.isSingleLineNode(node)) {
            return;
        }
        var elements = isKind(node, 'ObjectLiteralExpression') ? node['properties'] : node['elements'];
        elements = elements.filter(function (elem) { return elem.getText() !== ''; });
        var nodeLine = this.getLine(node);
        var nodeEndLine = this.getLine(node, true);
        var nodeIndent;
        var elementsIndent;
        var varKind;
        var parentVarNode = this.getVariableDeclaratorNode(node);
        if (this.isNodeFirstInLine(node) && node.parent) {
            var parent = node.parent;
            nodeIndent = this.getNodeIndent(parent).goodChar;
            if (parentVarNode && this.getLine(parentVarNode) !== nodeLine) {
                if (!isKind(parent, 'VariableDeclaration') || parentVarNode === parentVarNode.parent.declarations[0]) {
                    var parentVarLine = this.getLine(parentVarNode);
                    var parentLine = this.getLine(parent);
                    if (isKind(parent, 'VariableDeclaration') && parentVarLine === parentLine && parentVarNode.parent) {
                        varKind = parentVarNode.parent.getFirstToken().getText();
                        nodeIndent = nodeIndent + (indentSize * OPTIONS.VariableDeclarator[varKind]);
                    }
                    else if (isOneOf(parent, [
                        'ObjectLiteralExpression',
                        'ArrayLiteralExpression',
                        'CallExpression',
                        'ArrowFunction',
                        'NewExpression',
                        'BinaryExpression'
                    ])) {
                        nodeIndent = nodeIndent + indentSize;
                    }
                }
            }
            else if (!parentVarNode &&
                !this.isFirstArrayElementOnSameLine(parent) &&
                parent.kind !== ts.SyntaxKind.PropertyAccessExpression &&
                parent.kind !== ts.SyntaxKind.ExpressionStatement &&
                parent.kind !== ts.SyntaxKind.PropertyAssignment &&
                !(this.isAssignment(parent))) {
                nodeIndent = nodeIndent + indentSize;
            }
            elementsIndent = nodeIndent + indentSize;
            this.checkFirstNodeLineIndent(node, nodeIndent);
        }
        else {
            nodeIndent = this.getNodeIndent(node).goodChar;
            elementsIndent = nodeIndent + indentSize;
        }
        if (parentVarNode && this.isNodeInVarOnTop(node, parentVarNode) && parentVarNode.parent) {
            varKind = parentVarNode.parent.getFirstToken().getText();
            elementsIndent += indentSize * OPTIONS.VariableDeclarator[varKind];
        }
        this.checkNodesIndent(elements, elementsIndent);
        if (elements.length > 0) {
            var lastLine = this.getLine(elements[elements.length - 1], true);
            if (lastLine === nodeEndLine) {
                return;
            }
        }
        this.checkLastNodeLineIndent(node, elementsIndent - indentSize);
    };
    IndentWalker.prototype.isFirstArrayElementOnSameLine = function (node) {
        if (isKind(node, 'ArrayLiteralExpression')) {
            var ele = node.elements[0];
            if (ele) {
                return isKind(ele, 'ObjectLiteralExpression') && this.getLine(ele) === this.getLine(node);
            }
        }
        return false;
    };
    IndentWalker.prototype.isNodeInVarOnTop = function (node, varNode) {
        var nodeLine = this.getLine(node);
        var parentLine = this.getLine(varNode.parent);
        return varNode &&
            parentLine === nodeLine &&
            varNode.parent.declarations.length > 1;
    };
    IndentWalker.prototype.blockLessNodes = function (node) {
        if (!isKind(node.statement, 'Block')) {
            this.blockIndentationCheck(node);
        }
    };
    IndentWalker.prototype.checkIndentInVariableDeclarations = function (node) {
        var indent = this.expectedVarIndent(node);
        this.checkNodeIndent(node, indent);
    };
    IndentWalker.prototype.visitCase = function (node) {
        if (this.isSingleLineNode(node)) {
            return;
        }
        var caseIndent = this.expectedCaseIndent(node);
        this.checkNodesIndent(node.statements, caseIndent + indentSize);
    };
    IndentWalker.prototype.checkLastReturnStatementLineIndent = function (node, firstLineIndent) {
        if (!node.expression) {
            return;
        }
        var lastToken = node.expression.getLastToken();
        var endIndex = lastToken.getStart();
        var pos = endIndex - 1;
        while (pos > 0 && this.srcText.charAt(pos) !== '\n') {
            pos -= 1;
        }
        var textBeforeClosingParenthesis = this.getSourceSubstr(pos + 1, endIndex);
        if (textBeforeClosingParenthesis.trim()) {
            return;
        }
        var endIndent = this.getNodeIndent(lastToken);
        if (endIndent.goodChar !== firstLineIndent) {
            this.report(node, firstLineIndent, endIndent.space, endIndent.tab, lastToken.getStart());
        }
    };
    IndentWalker.prototype.visitClassDeclaration = function (node) {
        var len = node.getChildCount();
        this.blockIndentationCheck(node.getChildAt(len - 2));
        _super.prototype.visitClassDeclaration.call(this, node);
    };
    IndentWalker.prototype.visitClassExpression = function (node) {
        var len = node.getChildCount();
        this.blockIndentationCheck(node.getChildAt(len - 2));
        _super.prototype.visitClassExpression.call(this, node);
    };
    IndentWalker.prototype.visitInterfaceDeclaration = function (node) {
        var len = node.getChildCount();
        this.blockIndentationCheck(node.getChildAt(len - 2));
        _super.prototype.visitInterfaceDeclaration.call(this, node);
    };
    IndentWalker.prototype.visitTypeLiteral = function (node) {
        var len = node.getChildCount();
        this.blockIndentationCheck(node.getChildAt(len - 2));
        _super.prototype.visitTypeLiteral.call(this, node);
    };
    IndentWalker.prototype.visitBlock = function (node) {
        this.blockIndentationCheck(node);
        _super.prototype.visitBlock.call(this, node);
    };
    IndentWalker.prototype.visitIfStatement = function (node) {
        var thenLine = this.getLine(node.thenStatement);
        var line = this.getLine(node);
        if (!isKind(node.thenStatement, 'Block') && thenLine > line) {
            this.blockIndentationCheck(node);
        }
        _super.prototype.visitIfStatement.call(this, node);
    };
    IndentWalker.prototype.visitObjectLiteralExpression = function (node) {
        this.checkIndentInArrayOrObjectBlock(node);
        _super.prototype.visitObjectLiteralExpression.call(this, node);
    };
    IndentWalker.prototype.visitArrayLiteralExpression = function (node) {
        this.checkIndentInArrayOrObjectBlock(node);
        _super.prototype.visitArrayLiteralExpression.call(this, node);
    };
    IndentWalker.prototype.visitSwitchStatement = function (node) {
        var switchIndent = this.getNodeIndent(node).goodChar;
        var caseIndent = this.expectedCaseIndent(node, switchIndent);
        this.checkNodesIndent(node.caseBlock.clauses, caseIndent);
        this.checkLastNodeLineIndent(node, switchIndent);
        _super.prototype.visitSwitchStatement.call(this, node);
    };
    IndentWalker.prototype.visitCaseClause = function (node) {
        this.visitCase(node);
        _super.prototype.visitCaseClause.call(this, node);
    };
    IndentWalker.prototype.visitDefaultClause = function (node) {
        this.visitCase(node);
        _super.prototype.visitDefaultClause.call(this, node);
    };
    IndentWalker.prototype.visitWhileStatement = function (node) {
        this.blockLessNodes(node);
        _super.prototype.visitWhileStatement.call(this, node);
    };
    IndentWalker.prototype.visitForStatement = function (node) {
        this.blockLessNodes(node);
        _super.prototype.visitForStatement.call(this, node);
    };
    IndentWalker.prototype.visitForInStatement = function (node) {
        this.blockLessNodes(node);
        _super.prototype.visitForInStatement.call(this, node);
    };
    IndentWalker.prototype.visitDoStatement = function (node) {
        this.blockLessNodes(node);
        _super.prototype.visitDoStatement.call(this, node);
    };
    IndentWalker.prototype.visitVariableDeclaration = function (node) {
        this.checkIndentInVariableDeclarations(node);
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    IndentWalker.prototype.visitVariableStatement = function (node) {
        _super.prototype.visitVariableStatement.call(this, node);
        var list = node.getChildAt(0).getChildAt(1);
        if (!list) {
            return;
        }
        var len = list.getChildCount();
        if (len === 0) {
            return;
        }
        var lastElement = list.getChildAt(len - 1);
        var lastToken = node.getLastToken();
        var lastTokenLine = this.getLine(lastToken, true);
        var lastElementLine = this.getLine(lastElement, true);
        if (lastTokenLine <= lastElementLine) {
            return;
        }
        var tokenBeforeLastElement = list.getChildAt(len - 2);
        if (tokenBeforeLastElement && isKind(tokenBeforeLastElement, 'CommaToken')) {
            this.checkLastNodeLineIndent(node, this.getNodeIndent(tokenBeforeLastElement).goodChar);
        }
        else {
            var nodeIndent = this.getNodeIndent(node).goodChar;
            var varKind = node.getFirstToken().getText();
            var elementsIndent = nodeIndent + indentSize * OPTIONS.VariableDeclarator[varKind];
            this.checkLastNodeLineIndent(node, elementsIndent - indentSize);
        }
    };
    IndentWalker.prototype.visitFunctionDeclaration = function (node) {
        if (this.isSingleLineNode(node)) {
            return;
        }
        if (OPTIONS.FunctionDeclaration.parameters === 'first' && node.parameters.length) {
            var indent = this.getLineAndCharacter(node.parameters[0]).character;
            this.checkNodesIndent(node.parameters.slice(1), indent);
        }
        else if (OPTIONS.FunctionDeclaration.parameters !== null) {
            var nodeIndent = this.getNodeIndent(node).goodChar;
            this.checkNodesIndent(node.parameters, nodeIndent + indentSize * OPTIONS.FunctionDeclaration.parameters);
            var closingParen = node.getChildAt(node.getChildCount() - 2);
            this.checkNodeIndent(closingParen, nodeIndent);
        }
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    IndentWalker.prototype.checkFunctionMethodExpression = function (node) {
        if (OPTIONS.FunctionExpression.parameters === 'first' && node.parameters.length) {
            var indent = this.getLineAndCharacter(node.parameters[0]).character;
            this.checkNodesIndent(node.parameters.slice(1), indent);
        }
        else if (OPTIONS.FunctionExpression.parameters !== null) {
            var nodeIndent = this.getNodeIndent(node).goodChar;
            this.checkNodesIndent(node.parameters, nodeIndent + indentSize * OPTIONS.FunctionExpression.parameters);
            var closingParen = node.getChildAt(node.getChildCount() - 2);
            this.checkNodeIndent(closingParen, nodeIndent);
        }
    };
    IndentWalker.prototype.visitFunctionExpression = function (node) {
        if (this.isSingleLineNode(node)) {
            return;
        }
        this.checkFunctionMethodExpression(node);
        _super.prototype.visitFunctionExpression.call(this, node);
    };
    IndentWalker.prototype.visitMethodDeclaration = function (node) {
        if (this.isSingleLineNode(node)) {
            return;
        }
        this.checkFunctionMethodExpression(node);
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    IndentWalker.prototype.visitConstructorDeclaration = function (node) {
        if (this.isSingleLineNode(node)) {
            return;
        }
        this.checkFunctionMethodExpression(node);
        _super.prototype.visitConstructorDeclaration.call(this, node);
    };
    IndentWalker.prototype.visitCallExpression = function (node) {
        if (this.isSingleLineNode(node)) {
            return;
        }
        if (OPTIONS.CallExpression.arguments === 'first' && node.arguments.length) {
            var indent = this.getLineAndCharacter(node.arguments[0]).character;
            this.checkNodesIndent(node.arguments.slice(1), indent);
        }
        else if (OPTIONS.CallExpression.arguments !== null) {
            this.checkNodesIndent(node.arguments, this.getNodeIndent(node).goodChar + indentSize * OPTIONS.CallExpression.arguments);
        }
        _super.prototype.visitCallExpression.call(this, node);
    };
    IndentWalker.prototype.visitPropertyAccessExpression = function (node) {
        if (this.isSingleLineNode(node)) {
            return;
        }
        var varDec = ts.SyntaxKind.VariableDeclaration;
        var funcKind = [ts.SyntaxKind.FunctionExpression, ts.SyntaxKind.ArrowFunction];
        if (this.getParentNodeByType(node, varDec, funcKind)) {
            return;
        }
        var binExp = ts.SyntaxKind.BinaryExpression;
        var funcExp = ts.SyntaxKind.FunctionExpression;
        var binaryNode = this.getParentNodeByType(node, binExp, [funcExp]);
        if (binaryNode && this.isAssignment(binaryNode)) {
            return;
        }
        _super.prototype.visitPropertyAccessExpression.call(this, node);
        if (typeof OPTIONS.MemberExpression === 'undefined') {
            return;
        }
        var propertyIndent = this.getNodeIndent(node).goodChar + indentSize * OPTIONS.MemberExpression;
        var dotToken = node.getChildAt(1);
        var checkNodes = [node.name, dotToken];
        this.checkNodesIndent(checkNodes, propertyIndent);
    };
    IndentWalker.prototype.visitReturnStatement = function (node) {
        if (this.isSingleLineNode(node) || !node.expression) {
            return;
        }
        var firstLineIndent = this.getNodeIndent(node).goodChar;
        if (isKind(node.expression, 'ParenthesizedExpression')) {
            this.checkLastReturnStatementLineIndent(node, firstLineIndent);
        }
        else {
            this.checkNodeIndent(node, firstLineIndent);
        }
        _super.prototype.visitReturnStatement.call(this, node);
    };
    IndentWalker.prototype.visitSourceFile = function (node) {
        this.checkNodesIndent(node.statements, 0);
        _super.prototype.visitSourceFile.call(this, node);
    };
    return IndentWalker;
}(Lint.RuleWalker));
var _a, _b, _c, _d, _e;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QkFBNkIsWUFBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sQ0FBQyxnQkFBZ0IsS0FBSyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ3BELE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsR0FBRyxVQUFVLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDO1FBSWpHLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsSUFBTSxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBRXpDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVTLDJDQUFvQixHQUE5QixVQUErQixJQUF3QjtRQUNyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNwRCxNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFHMUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUseUJBQXlCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkQsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztRQUNqRSxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQ0QsaUJBQU0sb0JBQW9CLFlBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVTLHNDQUFlLEdBQXpCLFVBQTBCLElBQW1CO1FBRTNDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFDLGlCQUFNLGVBQWUsWUFBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQ0gsbUJBQUM7QUFBRCxDQXRnQ0EsQUFzZ0NDLENBdGdDMEIsSUFBSSxDQUFDLFVBQVUsR0FzZ0N6QyIsImZpbGUiOiJydWxlcy90ZXJJbmRlbnRSdWxlLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9qbWxvcGV6L1dvcmtzcGFjZS90c2xpbnQtZXNsaW50LXJ1bGVzL3NyYyJ9
