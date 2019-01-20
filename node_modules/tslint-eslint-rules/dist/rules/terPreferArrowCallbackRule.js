"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var RULE_NAME = 'ter-prefer-arrow-callback';
var OPTIONS;
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var walker = new RuleWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(walker);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: RULE_NAME,
    description: 'require arrow functions as callbacks',
    rationale: (_a = ["\n      Arrow functions are suited to callbacks, because:\n\n      * `this` keywords in arrow functions bind to the upper scope\u2019s.\n      * The notation of the arrow function is shorter than function expression\u2019s.\n      "], _a.raw = ["\n      Arrow functions are suited to callbacks, because:\n\n      * \\`this\\` keywords in arrow functions bind to the upper scope\u2019s.\n      * The notation of the arrow function is shorter than function expression\u2019s.\n      "], Lint.Utils.dedent(_a)),
    optionsDescription: (_b = ["\n      This rule takes one optional argument, an object which is an options object. This object\n      may specify the following properties:\n\n      * `\"allowNamedFunctions\"` (default false) When set to `true`, the rule doesn't warn on\n                                  named functions used as callback.\n      * `\"allowUnboundThis\"` (default true) When set to `false`, this option allows the use of\n                               `this` without restriction and checks for dynamically assigned\n                               `this` values such as when using `Array.prototype.map` with a\n                               `context` argument. Normally, the rule will flag the use of this\n                               whenever a function does not use `bind()` to specify the value of\n                               `this` constantly.\n      "], _b.raw = ["\n      This rule takes one optional argument, an object which is an options object. This object\n      may specify the following properties:\n\n      * \\`\"allowNamedFunctions\"\\` (default false) When set to \\`true\\`, the rule doesn't warn on\n                                  named functions used as callback.\n      * \\`\"allowUnboundThis\"\\` (default true) When set to \\`false\\`, this option allows the use of\n                               \\`this\\` without restriction and checks for dynamically assigned\n                               \\`this\\` values such as when using \\`Array.prototype.map\\` with a\n                               \\`context\\` argument. Normally, the rule will flag the use of this\n                               whenever a function does not use \\`bind()\\` to specify the value of\n                               \\`this\\` constantly.\n      "], Lint.Utils.dedent(_b)),
    options: {
        type: 'array',
        items: [{
                type: 'object',
                properties: {
                    allowNamedFunctions: {
                        type: 'boolean'
                    },
                    allowUnboundThis: {
                        type: 'boolean'
                    }
                },
                additionalProperties: false
            }],
        maxLength: 1
    },
    optionExamples: [
        (_c = ["\n        \"", "\": [true]\n        "], _c.raw = ["\n        \"", "\": [true]\n        "], Lint.Utils.dedent(_c, RULE_NAME)),
        (_d = ["\n        \"", "\": [true, {\n          \"allowNamedFunctions\": true\n        }]\n        "], _d.raw = ["\n        \"", "\": [true, {\n          \"allowNamedFunctions\": true\n        }]\n        "], Lint.Utils.dedent(_d, RULE_NAME)),
        (_e = ["\n        \"", "\": [true, {\n          \"allowUnboundThis\": false\n        }]\n        "], _e.raw = ["\n        \"", "\": [true, {\n          \"allowUnboundThis\": false\n        }]\n        "], Lint.Utils.dedent(_e, RULE_NAME)),
        (_f = ["\n        \"", "\": [true, {\n          \"allowNamedFunctions\": true,\n          \"allowUnboundThis\": false\n        }]\n        "], _f.raw = ["\n        \"", "\": [true, {\n          \"allowNamedFunctions\": true,\n          \"allowUnboundThis\": false\n        }]\n        "], Lint.Utils.dedent(_f, RULE_NAME))
    ],
    typescriptOnly: false,
    type: 'typescript'
};
exports.Rule = Rule;
function checkMetaProperty(node, name, prop) {
    return node.parent && node.parent.getFirstToken().getText() === name && node.name.text === prop;
}
function getCallbackInfo(func) {
    var retv = { isCallback: false, isLexicalThis: false };
    var node = func;
    var parent = node.parent;
    while (node && parent) {
        switch (parent.kind) {
            case ts.SyntaxKind.BinaryExpression:
            case ts.SyntaxKind.ConditionalExpression:
                break;
            case ts.SyntaxKind.PropertyAccessExpression:
                if (parent.name.kind === ts.SyntaxKind.Identifier &&
                    parent.name.text === 'bind' &&
                    parent.parent &&
                    parent.parent.kind === ts.SyntaxKind.CallExpression &&
                    parent.parent.expression === parent) {
                    retv.isLexicalThis = (parent.parent.arguments.length === 1 &&
                        parent.parent.arguments[0].kind === ts.SyntaxKind.ThisKeyword);
                    node = parent;
                    parent = parent.parent;
                }
                else {
                    return retv;
                }
                break;
            case ts.SyntaxKind.CallExpression:
            case ts.SyntaxKind.NewExpression:
                if (parent.expression !== node) {
                    retv.isCallback = true;
                }
                return retv;
            default:
                return retv;
        }
        node = parent;
        parent = node.parent;
    }
    throw new Error('unreachable');
}
var RuleWalker = (function (_super) {
    tslib_1.__extends(RuleWalker, _super);
    function RuleWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.stack = [];
        OPTIONS = {
            allowUnboundThis: true,
            allowNamedFunctions: null
        };
        var userOptions = _this.getOptions()[0];
        if (userOptions) {
            OPTIONS.allowUnboundThis = userOptions.allowUnboundThis !== false;
            OPTIONS.allowNamedFunctions = userOptions.allowNamedFunctions;
        }
        _this.srcFile = sourceFile;
        _this.srcText = sourceFile.getFullText();
        return _this;
    }
    RuleWalker.prototype.enterScope = function (functionName) {
        this.stack.push({
            functionName: functionName,
            isRecursive: false,
            hasThis: false,
            hasSuper: false,
            hasMeta: false,
            hasArguments: false
        });
    };
    RuleWalker.prototype.exitScope = function () {
        return this.stack.pop();
    };
    RuleWalker.prototype.exitFunctionExpression = function (node) {
        var scopeInfo = this.exitScope();
        if (node.asteriskToken) {
            return;
        }
        if (node.name && node.name.text) {
            if (OPTIONS.allowNamedFunctions || scopeInfo.isRecursive) {
                return;
            }
        }
        var params = node.parameters.map(function (x) { return x.name.getText(); });
        var argumentsIsParam = params.indexOf('arguments') !== -1;
        if (!argumentsIsParam && scopeInfo.hasArguments) {
            return;
        }
        var callbackInfo = getCallbackInfo(node);
        if (callbackInfo.isCallback &&
            (!OPTIONS.allowUnboundThis || !scopeInfo.hasThis || callbackInfo.isLexicalThis) &&
            !scopeInfo.hasSuper &&
            !scopeInfo.hasMeta) {
            var failure = this.createFailure(node.getStart(), node.getWidth(), 'Unexpected function expression.');
            this.addFailure(failure);
        }
    };
    RuleWalker.prototype.visitSourceFile = function (node) {
        this.stack = [];
        _super.prototype.visitSourceFile.call(this, node);
    };
    RuleWalker.prototype.visitFunctionDeclaration = function (node) {
        this.enterScope();
        _super.prototype.visitFunctionDeclaration.call(this, node);
        this.exitScope();
    };
    RuleWalker.prototype.visitFunctionExpression = function (node) {
        this.enterScope(node.name ? node.name.text : undefined);
        _super.prototype.visitFunctionExpression.call(this, node);
        this.exitFunctionExpression(node);
    };
    RuleWalker.prototype.visitNode = function (node) {
        var info = this.stack[this.stack.length - 1];
        if (info && node.parent && node.parent.kind !== ts.SyntaxKind.FunctionExpression) {
            if (node.kind === ts.SyntaxKind.ThisKeyword) {
                info.hasThis = true;
            }
            else if (node.kind === ts.SyntaxKind.SuperKeyword) {
                info.hasSuper = true;
            }
            else if (node.kind === ts.SyntaxKind.Identifier) {
                var text = node.text;
                if (text === 'arguments') {
                    info.hasArguments = true;
                }
                else if (text === info.functionName) {
                    info.isRecursive = true;
                }
            }
            else if ((node.kind === ts.SyntaxKind.PropertyAccessExpression ||
                node.kind === ts.SyntaxKind.MetaProperty) &&
                checkMetaProperty(node, 'new', 'target')) {
                info.hasMeta = true;
            }
        }
        _super.prototype.visitNode.call(this, node);
    };
    return RuleWalker;
}(Lint.RuleWalker));
var _a, _b, _c, _d, _e, _f;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL3RlclByZWZlckFycm93Q2FsbGJhY2tSdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQU1BLCtCQUFpQztBQUNqQyw2QkFBK0I7QUFFL0IsSUFBTSxTQUFTLEdBQUcsMkJBQTJCLENBQUM7QUFDOUMsSUFBSSxPQUFZLENBQUM7QUFFakI7SUFBMEIsZ0NBQXVCO0lBQWpEOztJQW9FQSxDQUFDO0lBSlEsb0JBQUssR0FBWixVQUFhLFVBQXlCO1FBQ3BDLElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUM3RCxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0gsV0FBQztBQUFELENBcEVBLEFBb0VDLENBcEV5QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7QUFDakMsYUFBUSxHQUF1QjtJQUMzQyxRQUFRLEVBQUUsU0FBUztJQUNuQixXQUFXLEVBQUUsc0NBQXNDO0lBQ25ELFNBQVMsK1BBQW1CLDZPQUt6QixHQUxRLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUt6QjtJQUNILGtCQUFrQix5MkJBQW1CLDIzQkFZbEMsR0FaaUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBWWxDO0lBQ0gsT0FBTyxFQUFFO1FBQ1AsSUFBSSxFQUFFLE9BQU87UUFDYixLQUFLLEVBQUUsQ0FBQztnQkFDTixJQUFJLEVBQUUsUUFBUTtnQkFDZCxVQUFVLEVBQUU7b0JBQ1YsbUJBQW1CLEVBQUU7d0JBQ25CLElBQUksRUFBRSxTQUFTO3FCQUNoQjtvQkFDRCxnQkFBZ0IsRUFBRTt3QkFDaEIsSUFBSSxFQUFFLFNBQVM7cUJBQ2hCO2lCQUNGO2dCQUNELG9CQUFvQixFQUFFLEtBQUs7YUFDNUIsQ0FBQztRQUNGLFNBQVMsRUFBRSxDQUFDO0tBQ2I7SUFDRCxjQUFjLEVBQUU7a0VBQ0csY0FDWixFQUFTLHNC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
