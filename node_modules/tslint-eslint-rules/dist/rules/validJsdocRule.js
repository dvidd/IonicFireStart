"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var doctrine = require("doctrine");
var RULE_NAME = 'valid-jsdoc';
var OPTIONS;
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var opts = this.getOptions().ruleArguments;
        OPTIONS = {
            prefer: {},
            requireReturn: true,
            requireParamType: true,
            requireReturnType: true,
            requireParamDescription: true,
            requireReturnDescription: true,
            matchDescription: ''
        };
        if (opts && opts.length > 0) {
            if (opts[0].prefer) {
                OPTIONS.prefer = opts[0].prefer;
            }
            OPTIONS.requireReturn = opts[0].requireReturn !== false;
            OPTIONS.requireParamType = opts[0].requireParamType !== false;
            OPTIONS.requireReturnType = opts[0].requireReturnType !== false;
            OPTIONS.requireParamDescription = opts[0].requireParamDescription !== false;
            OPTIONS.requireReturnDescription = opts[0].requireReturnDescription !== false;
            OPTIONS.matchDescription = opts[0].matchDescription;
        }
        var walker = new ValidJsdocWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(walker);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.FAILURE_STRING = {
    missingBrace: 'JSDoc type missing brace',
    syntaxError: 'JSDoc syntax error',
    missingParameterType: function (name) { return "missing JSDoc parameter type for '" + name + "'"; },
    missingParameterDescription: function (name) { return "missing JSDoc parameter description for '" + name + "'"; },
    duplicateParameter: function (name) { return "duplicate JSDoc parameter '" + name + "'"; },
    unexpectedTag: function (title) { return "unexpected @" + title + " tag; function has no return statement"; },
    missingReturnType: 'missing JSDoc return type',
    missingReturnDescription: 'missing JSDoc return description',
    prefer: function (name) { return "use @" + name + " instead"; },
    missingReturn: function (param) { return "missing JSDoc @" + (param || 'returns') + " for function"; },
    wrongParam: function (expected, actual) { return "expected JSDoc for '" + expected + "' but found '" + actual + "'"; },
    missingParam: function (name) { return "missing JSDoc for parameter '" + name + "'"; },
    wrongDescription: 'JSDoc description does not satisfy the regex pattern',
    invalidRegexDescription: function (error) { return "configured matchDescription is an invalid RegExp. Error: " + error; }
};
Rule.metadata = {
    ruleName: RULE_NAME,
    hasFix: false,
    description: 'enforce valid JSDoc comments',
    rationale: (_a = ["\n      [JSDoc](http://usejsdoc.org/) generates application programming interface (API) documentation\n      from specially-formatted comments in JavaScript code. So does [typedoc](http://typedoc.org/).\n\n      If comments are invalid because of typing mistakes, then documentation will be incomplete.\n\n      If comments are inconsistent because they are not updated when function definitions are\n      modified, then readers might become confused.\n      "], _a.raw = ["\n      [JSDoc](http://usejsdoc.org/) generates application programming interface (API) documentation\n      from specially-formatted comments in JavaScript code. So does [typedoc](http://typedoc.org/).\n\n      If comments are invalid because of typing mistakes, then documentation will be incomplete.\n\n      If comments are inconsistent because they are not updated when function definitions are\n      modified, then readers might become confused.\n      "], Lint.Utils.dedent(_a)),
    optionsDescription: (_b = ["\n      This rule has an object option:\n\n      * `\"prefer\"` enforces consistent documentation tags specified by an object whose properties\n                     mean instead of key use value (for example, `\"return\": \"returns\"` means\n                     instead of `@return` use `@returns`)\n      * `\"preferType\"` enforces consistent type strings specified by an object whose properties\n                         mean instead of key use value (for example, `\"object\": \"Object\"` means\n                         instead of `object` use `Object`)\n      * `\"requireReturn\"` requires a return tag:\n        * `true` (default) *even if* the function or method does not have a return statement\n                   (this option value does not apply to constructors)\n        * `false` *if and only if* the function or method has a return statement (this option\n                    value does apply to constructors)\n      * `\"requireParamType\"`: `false` allows missing type in param tags\n      * `\"requireReturnType\"`: `false` allows missing type in return tags\n      * `\"matchDescription\"` specifies (as a string) a regular expression to match the description\n                               in each JSDoc comment (for example, `\".+\"` requires a description;\n                               this option does not apply to descriptions in parameter or return\n                               tags)\n      * `\"requireParamDescription\"`: `false` allows missing description in parameter tags\n      * `\"requireReturnDescription\"`: `false` allows missing description in return tags\n      "], _b.raw = ["\n      This rule has an object option:\n\n      * \\`\"prefer\"\\` enforces consistent documentation tags specified by an object whose properties\n                     mean instead of key use value (for example, \\`\"return\": \"returns\"\\` means\n                     instead of \\`@return\\` use \\`@returns\\`)\n      * \\`\"preferType\"\\` enforces consistent type strings specified by an object whose properties\n                         mean instead of key use value (for example, \\`\"object\": \"Object\"\\` means\n                         instead of \\`object\\` use \\`Object\\`)\n      * \\`\"requireReturn\"\\` requires a return tag:\n        * \\`true\\` (default) *even if* the function or method does not have a return statement\n                   (this option value does not apply to constructors)\n        * \\`false\\` *if and only if* the function or method has a return statement (this option\n                    value does apply to constructors)\n      * \\`\"requireParamType\"\\`: \\`false\\` allows missing type in param tags\n      * \\`\"requireReturnType\"\\`: \\`false\\` allows missing type in return tags\n      * \\`\"matchDescription\"\\` specifies (as a string) a regular expression to match the description\n                               in each JSDoc comment (for example, \\`\".+\"\\` requires a description;\n                               this option does not apply to descriptions in parameter or return\n                               tags)\n      * \\`\"requireParamDescription\"\\`: \\`false\\` allows missing description in parameter tags\n      * \\`\"requireReturnDescription\"\\`: \\`false\\` allows missing description in return tags\n      "], Lint.Utils.dedent(_b)),
    options: {
        type: 'object',
        properties: {
            prefer: {
                type: 'object',
                additionalProperties: {
                    type: 'string'
                }
            },
            preferType: {
                type: 'object',
                additionalProperties: {
                    type: 'string'
                }
            },
            requireReturn: {
                type: 'boolean'
            },
            requireParamDescription: {
                type: 'boolean'
            },
            requireReturnDescription: {
                type: 'boolean'
            },
            matchDescription: {
                type: 'string'
            },
            requireParamType: {
                type: 'boolean'
            },
            requireReturnType: {
                type: 'boolean'
            }
        },
        additionalProperties: false
    },
    optionExamples: [
        (_c = ["\n        \"", "\": [true]\n        "], _c.raw = ["\n        \"", "\": [true]\n        "], Lint.Utils.dedent(_c, RULE_NAME)),
        (_d = ["\n        \"", "\": [true, {\n          \"prefer\": {\n            \"return\": \"returns\"\n          },\n          \"requireReturn\": false,\n          \"requireParamDescription\": true,\n          \"requireReturnDescription\": true,\n          \"matchDescription\": \"^[A-Z][A-Za-z0-9\\\\s]*[.]$\"\n        }]\n        "], _d.raw = ["\n        \"", "\": [true, {\n          \"prefer\": {\n            \"return\": \"returns\"\n          },\n          \"requireReturn\": false,\n          \"requireParamDescription\": true,\n          \"requireReturnDescription\": true,\n          \"matchDescription\": \"^[A-Z][A-Za-z0-9\\\\\\\\s]*[.]$\"\n        }]\n        "], Lint.Utils.dedent(_d, RULE_NAME))
    ],
    typescriptOnly: false,
    type: 'maintainability'
};
exports.Rule = Rule;
var ValidJsdocWalker = (function (_super) {
    tslib_1.__extends(ValidJsdocWalker, _super);
    function ValidJsdocWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fns = [];
        return _this;
    }
    ValidJsdocWalker.prototype.visitSourceFile = function (node) {
        _super.prototype.visitSourceFile.call(this, node);
    };
    ValidJsdocWalker.prototype.visitNode = function (node) {
        if (node.kind === ts.SyntaxKind.ClassExpression) {
            this.visitClassExpression(node);
        }
        else {
            _super.prototype.visitNode.call(this, node);
        }
    };
    ValidJsdocWalker.prototype.visitArrowFunction = function (node) {
        this.startFunction(node);
        _super.prototype.visitArrowFunction.call(this, node);
        this.checkJSDoc(node);
    };
    ValidJsdocWalker.prototype.visitFunctionExpression = function (node) {
        this.startFunction(node);
        _super.prototype.visitFunctionExpression.call(this, node);
        this.checkJSDoc(node);
    };
    ValidJsdocWalker.prototype.visitFunctionDeclaration = function (node) {
        this.startFunction(node);
        _super.prototype.visitFunctionDeclaration.call(this, node);
        this.checkJSDoc(node);
    };
    ValidJsdocWalker.prototype.visitClassExpression = function (node) {
        this.startFunction(node);
        _super.prototype.visitClassExpression.call(this, node);
        this.checkJSDoc(node);
    };
    ValidJsdocWalker.prototype.visitClassDeclaration = function (node) {
        this.startFunction(node);
        _super.prototype.visitClassDeclaration.call(this, node);
        this.checkJSDoc(node);
    };
    ValidJsdocWalker.prototype.visitMethodDeclaration = function (node) {
        this.startFunction(node);
        _super.prototype.visitMethodDeclaration.call(this, node);
        this.checkJSDoc(node);
    };
    ValidJsdocWalker.prototype.visitConstructorDeclaration = function (node) {
        this.startFunction(node);
        _super.prototype.visitConstructorDeclaration.call(this, node);
        this.checkJSDoc(node);
    };
    ValidJsdocWalker.prototype.visitReturnStatement = function (node) {
        this.addReturn(node);
        _super.prototype.visitReturnStatement.call(this, node);
    };
    ValidJsdocWalker.prototype.startFunction = function (node) {
        var returnPresent = false;
        if (node.kind === ts.SyntaxKind.ArrowFunction && node.body.kind !== ts.SyntaxKind.Block)
            returnPresent = true;
        if (this.isTypeClass(node))
            returnPresent = true;
        this.fns.push({ node: node, returnPresent: returnPresent });
    };
    ValidJsdocWalker.prototype.addReturn = function (node) {
        var parent = node;
        var nodes = this.fns.map(function (fn) { return fn.node; });
        while (parent && nodes.indexOf(parent) === -1)
            parent = parent.parent;
        if (parent && node.expression) {
            this.fns[nodes.indexOf(parent)].returnPresent = true;
        }
    };
    ValidJsdocWalker.prototype.isTypeClass = function (node) {
        return node.kind === ts.SyntaxKind.ClassExpression || node.kind === ts.SyntaxKind.ClassDeclaration;
    };
    ValidJsdocWalker.prototype.isValidReturnType = function (tag) {
        return tag.type && (tag.type.name === 'void' || tag.type.type === 'UndefinedLiteral');
    };
    ValidJsdocWalker.prototype.getJSDocComment = function (node) {
        var ALLOWED_PARENTS = [
            ts.SyntaxKind.BinaryExpression,
            ts.SyntaxKind.VariableDeclaration,
            ts.SyntaxKind.VariableDeclarationList,
            ts.SyntaxKind.VariableStatement
        ];
        if (!/^\/\*\*/.test(node.getFullText().trim())) {
            if (node.parent && ALLOWED_PARENTS.indexOf(node.parent.kind) !== -1) {
                return this.getJSDocComment(node.parent);
            }
            return {};
        }
        var comments = node.getFullText();
        var offset = comments.indexOf('/**');
        comments = comments.substring(offset);
        comments = comments.substring(0, comments.indexOf('*/') + 2);
        var start = node.pos + offset;
        var width = comments.length;
        if (!/^\/\*\*/.test(comments) || !/\*\/$/.test(comments)) {
            return {};
        }
        return { comments: comments, start: start, width: width };
    };
    ValidJsdocWalker.prototype.checkJSDoc = function (node) {
        var _this = this;
        var _a = this.getJSDocComment(node), comments = _a.comments, start = _a.start, width = _a.width;
        if (!comments || start === undefined || width === undefined)
            return;
        var jsdoc;
        try {
            jsdoc = doctrine.parse(comments, {
                strict: true,
                unwrap: true,
                sloppy: true
            });
        }
        catch (e) {
            if (/braces/i.test(e.message)) {
                this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING.missingBrace));
            }
            else {
                this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING.syntaxError));
            }
            return;
        }
        var fn = this.fns.filter(function (f) { return node === f.node; })[0];
        var params = {};
        var hasReturns = false;
        var hasConstructor = false;
        var isOverride = false;
        var isAbstract = false;
        for (var _i = 0, _b = jsdoc.tags; _i < _b.length; _i++) {
            var tag = _b[_i];
            switch (tag.title) {
                case 'param':
                case 'arg':
                case 'argument':
                    if (!tag.type && OPTIONS.requireParamType) {
                        this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING.missingParameterType(tag.name)));
                    }
                    if (!tag.description && OPTIONS.requireParamDescription) {
                        this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING.missingParameterDescription(tag.name)));
                    }
                    if (params[tag.name]) {
                        this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING.duplicateParameter(tag.name)));
                    }
                    else if (tag.name.indexOf('.') === -1) {
                        params[tag.name] = true;
                    }
                    break;
                case 'return':
                case 'returns':
                    hasReturns = true;
                    isAbstract = Lint.hasModifier(fn.node.modifiers, ts.SyntaxKind.AbstractKeyword);
                    if (!isAbstract && !OPTIONS.requireReturn && !fn.returnPresent && tag.type.name !== 'void' && tag.type.name !== 'undefined') {
                        this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING.unexpectedTag(tag.title)));
                    }
                    else {
                        if (!tag.type && OPTIONS.requireReturnType) {
                            this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING.missingReturnType));
                        }
                        if (!this.isValidReturnType(tag) && !tag.description && OPTIONS.requireReturnDescription) {
                            this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING.missingReturnDescription));
                        }
                    }
                    break;
                case 'constructor':
                case 'class':
                    hasConstructor = true;
                    break;
                case 'override':
                case 'inheritdoc':
                    isOverride = true;
                    break;
            }
            var title = OPTIONS.prefer[tag.title];
            if (OPTIONS.prefer.hasOwnProperty(tag.title) && tag.title !== title) {
                this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING.prefer(title)));
            }
        }
        if (!isOverride && !hasReturns && !hasConstructor && node.parent && node.parent.kind !== ts.SyntaxKind.GetKeyword && !this.isTypeClass(node)) {
            if (OPTIONS.requireReturn || fn.returnPresent) {
                this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING.missingReturn(OPTIONS.prefer['returns'])));
            }
        }
        var jsdocParams = Object.keys(params);
        var parameters = node.parameters;
        if (parameters) {
            parameters.forEach(function (param, i) {
                if (param.name.kind === ts.SyntaxKind.Identifier) {
                    var name = param.name.text;
                    if (jsdocParams[i] && name !== jsdocParams[i]) {
                        _this.addFailure(_this.createFailure(start, width, Rule.FAILURE_STRING.wrongParam(name, jsdocParams[i])));
                    }
                    else if (!params[name] && !isOverride) {
                        _this.addFailure(_this.createFailure(start, width, Rule.FAILURE_STRING.missingParam(name)));
                    }
                }
            });
        }
        if (OPTIONS.matchDescription) {
            try {
                var regex = new RegExp(OPTIONS.matchDescription);
                if (!regex.test(jsdoc.description)) {
                    this.addFailure(this.createFailure(start, width, Rule.FAILURE_STRING.wrongDescription));
                }
            }
            catch (e) {
                this.addFailure(this.createFailure(start, width, e.message));
            }
        }
    };
    return ValidJsdocWalker;
}(Lint.RuleWalker));
var _a, _b, _c, _d;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QkFDNUYsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUM7Z0JBQ0gsSUFBTSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7Z0JBQ25ELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNuQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztnQkFDMUYsQ0FBQztZQUNILENBQUM7WUFDRCxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNULElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQy9ELENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0ExUEEsQUEwUEMsQ0ExUDhCLElBQUksQ0FBQyxVQUFVLEdBMFA3QyIsImZpbGUiOiJydWxlcy92YWxpZEpzZG9jUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvam1sb3Blei9Xb3Jrc3BhY2UvdHNsaW50LWVzbGludC1ydWxlcy9zcmMifQ==
