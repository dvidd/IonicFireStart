"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var RULE_NAME = 'handle-callback-err';
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new ErrCallbackHandlerWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: RULE_NAME,
    description: 'enforce error handling in callbacks',
    rationale: (_a = ["\n      In Node.js, a common pattern for dealing with asynchronous behavior is called the callback\n      pattern. This pattern expects an Error object or null as the first argument of the callback.\n      Forgetting to handle these errors can lead to some really strange behavior in your\n      application.\n      "], _a.raw = ["\n      In Node.js, a common pattern for dealing with asynchronous behavior is called the callback\n      pattern. This pattern expects an Error object or null as the first argument of the callback.\n      Forgetting to handle these errors can lead to some really strange behavior in your\n      application.\n      "], Lint.Utils.dedent(_a)),
    optionsDescription: (_b = ["\n      The rule takes a string option: the name of the error parameter. The default is\n      `\"err\"`.\n\n      Sometimes the name of the error variable is not consistent across the project, so you need a\n      more flexible configuration to ensure that the rule reports all unhandled errors.\n\n      If the configured name of the error variable begins with a `^` it is considered to be a\n      regexp pattern.\n\n      - If the option is `\"^(err|error|anySpecificError)$\"`, the rule reports unhandled errors\n        where the parameter name can be `err`, `error` or `anySpecificError`.\n      - If the option is `\"^.+Error$\"`, the rule reports unhandled errors where the parameter\n        name ends with `Error` (for example, `connectionError` or `validationError` will\n        match).\n      - If the option is `\"^.*(e|E)rr\"`, the rule reports unhandled errors where the parameter\n        name matches any string that contains `err` or `Err` (for example, `err`, `error`,\n        `anyError`, `some_err` will match).\n\n      In addition to the string we may specify an options object with the following property:\n\n      - `allowProperties`: (`true` by default) When this is set to `false` the rule will not\n        report unhandled errors as long as the error object is handled without accessing any of its\n        properties at least once. For instance, `(err) => console.log(err.stack)` would report an\n        issue when `allowProperties` is set to `false` because `err` is not handled on its\n        own.\n      "], _b.raw = ["\n      The rule takes a string option: the name of the error parameter. The default is\n      \\`\"err\"\\`.\n\n      Sometimes the name of the error variable is not consistent across the project, so you need a\n      more flexible configuration to ensure that the rule reports all unhandled errors.\n\n      If the configured name of the error variable begins with a \\`^\\` it is considered to be a\n      regexp pattern.\n\n      - If the option is \\`\"^(err|error|anySpecificError)$\"\\`, the rule reports unhandled errors\n        where the parameter name can be \\`err\\`, \\`error\\` or \\`anySpecificError\\`.\n      - If the option is \\`\"^.+Error$\"\\`, the rule reports unhandled errors where the parameter\n        name ends with \\`Error\\` (for example, \\`connectionError\\` or \\`validationError\\` will\n        match).\n      - If the option is \\`\"^.*(e|E)rr\"\\`, the rule reports unhandled errors where the parameter\n        name matches any string that contains \\`err\\` or \\`Err\\` (for example, \\`err\\`, \\`error\\`,\n        \\`anyError\\`, \\`some_err\\` will match).\n\n      In addition to the string we may specify an options object with the following property:\n\n      - \\`allowProperties\\`: (\\`true\\` by default) When this is set to \\`false\\` the rule will not\n        report unhandled errors as long as the error object is handled without accessing any of its\n        properties at least once. For instance, \\`(err) => console.log(err.stack)\\` would report an\n        issue when \\`allowProperties\\` is set to \\`false\\` because \\`err\\` is not handled on its\n        own.\n      "], Lint.Utils.dedent(_b)),
    options: {
        type: 'array',
        items: [{
                type: 'string'
            }, {
                type: 'object',
                properties: {
                    allowProperties: 'boolean'
                },
                additionalProperties: false
            }],
        minLength: 0,
        maxLength: 2
    },
    optionExamples: [
        (_c = ["\n        \"", "\": [true, \"error\"]\n        "], _c.raw = ["\n        \"", "\": [true, \"error\"]\n        "], Lint.Utils.dedent(_c, RULE_NAME)),
        (_d = ["\n        \"", "\": [true, \"^(err|error|anySpecificError)$\"]\n        "], _d.raw = ["\n        \"", "\": [true, \"^(err|error|anySpecificError)$\"]\n        "], Lint.Utils.dedent(_d, RULE_NAME)),
        (_e = ["\n        \"", "\": [true, { \"allowProperties\": false }]\n        "], _e.raw = ["\n        \"", "\": [true, { \"allowProperties\": false }]\n        "], Lint.Utils.dedent(_e, RULE_NAME)),
        (_f = ["\n        \"", "\": [true, \"^(err|error|anySpecificError)$\", { \"allowProperties\": false }]\n        "], _f.raw = ["\n        \"", "\": [true, \"^(err|error|anySpecificError)$\", { \"allowProperties\": false }]\n        "], Lint.Utils.dedent(_f, RULE_NAME))
    ],
    typescriptOnly: false,
    type: 'maintainability'
};
exports.Rule = Rule;
var ErrCallbackHandlerWalker = (function (_super) {
    tslib_1.__extends(ErrCallbackHandlerWalker, _super);
    function ErrCallbackHandlerWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.stack = [];
        _this.allowProperties = true;
        var opt = _this.getOptions();
        var errorArgument = 'err';
        var optObj = opt[0];
        if (typeof opt[0] === 'string') {
            errorArgument = opt[0];
            optObj = opt[1];
        }
        if (optObj) {
            _this.allowProperties = optObj.allowProperties !== false;
        }
        if (errorArgument.charAt(0) === '^') {
            _this.errorCheck = RegExp.prototype.test.bind(new RegExp(errorArgument));
        }
        else {
            _this.errorCheck = (function (name) { return name === errorArgument; });
        }
        _this.firstParameterName = function (node) {
            var param = node.parameters[0];
            return param ? param.name.getText(sourceFile) : undefined;
        };
        return _this;
    }
    ErrCallbackHandlerWalker.prototype.enterScope = function (firstParamName) {
        this.stack.push({
            firstParamName: firstParamName,
            hasFirstParam: false
        });
    };
    ErrCallbackHandlerWalker.prototype.exitScope = function () {
        return this.stack.pop();
    };
    ErrCallbackHandlerWalker.prototype.visitSourceFile = function (node) {
        this.stack = [];
        _super.prototype.visitSourceFile.call(this, node);
    };
    ErrCallbackHandlerWalker.prototype.visitFunctionDeclaration = function (node) {
        this.enterScope(this.firstParameterName(node));
        _super.prototype.visitFunctionDeclaration.call(this, node);
        this.exitFunction(node);
    };
    ErrCallbackHandlerWalker.prototype.visitFunctionExpression = function (node) {
        this.enterScope(this.firstParameterName(node));
        _super.prototype.visitFunctionExpression.call(this, node);
        this.exitFunction(node);
    };
    ErrCallbackHandlerWalker.prototype.visitArrowFunction = function (node) {
        this.enterScope(this.firstParameterName(node));
        _super.prototype.visitArrowFunction.call(this, node);
        this.exitFunction(node);
    };
    ErrCallbackHandlerWalker.prototype.visitCatchClause = function (node) {
        this.enterScope(node.variableDeclaration ? node.variableDeclaration.name.getText() : undefined);
        _super.prototype.visitCatchClause.call(this, node);
        this.exitScope();
    };
    ErrCallbackHandlerWalker.prototype.exitFunction = function (node) {
        var scopeInfo = this.exitScope();
        var param = scopeInfo.firstParamName;
        if (param && this.errorCheck(param) && !scopeInfo.hasFirstParam) {
            var name = node.parameters[0].name;
            var strictMsg = !this.allowProperties ? ' without property access at least once' : '';
            var msg = "Expected error to be handled" + strictMsg;
            var failure = this.createFailure(name.getStart(this.getSourceFile()), name.getWidth(this.getSourceFile()), msg);
            this.addFailure(failure);
        }
    };
    ErrCallbackHandlerWalker.prototype.isPropAccess = function (node) {
        return node.kind === ts.SyntaxKind.PropertyAccessExpression;
    };
    ErrCallbackHandlerWalker.prototype.visitNode = function (node) {
        if (this.stack.length > 0 &&
            node.kind === ts.SyntaxKind.Identifier &&
            node.parent &&
            node.parent.kind !== ts.SyntaxKind.Parameter) {
            var doCheck = false;
            var inPropertyAccess = this.isPropAccess(node.parent);
            if (!this.allowProperties) {
                doCheck = !inPropertyAccess;
            }
            else if (inPropertyAccess) {
                doCheck = node.parent.expression === node;
            }
            else {
                doCheck = true;
            }
            if (doCheck) {
                var text = node.text;
                var i = this.stack.length;
                while (i--) {
                    var info = this.stack[i];
                    if (text === info.firstParamName) {
                        info.hasFirstParam = true;
                        break;
                    }
                }
            }
        }
        _super.prototype.visitNode.call(this, node);
    };
    return ErrCallbackHandlerWalker;
}(Lint.RuleWalker));
var _a, _b, _c, _d, _e, _f;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL2hhbmRsZUNhbGxiYWNrRXJyUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBaUM7QUFDakMsNkJBQStCO0FBRS9CLElBQU0sU0FBUyxHQUFHLHFCQUFxQixDQUFDO0FBRXhDO0lBQTBCLGdDQUF1QjtJQUFqRDs7SUF3RUEsQ0FBQztJQUhRLG9CQUFLLEdBQVosVUFBYSxVQUF5QjtRQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLHdCQUF3QixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFDSCxXQUFDO0FBQUQsQ0F4RUEsQUF3RUMsQ0F4RXlCLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTtBQUNqQyxhQUFRLEdBQXVCO0lBQzNDLFFBQVEsRUFBRSxTQUFTO0lBQ25CLFdBQVcsRUFBRSxxQ0FBcUM7SUFDbEQsU0FBUyxvVkFBbUIsOFRBS3pCLEdBTFEsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBS3pCO0lBQ0gsa0JBQWtCLDZoREFBbUIsdW1EQTBCbEMsR0ExQmlCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQTBCbEM7SUFDSCxPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsT0FBTztRQUNiLEtBQUssRUFBRSxDQUFDO2dCQUNOLElBQUksRUFBRSxRQUFRO2FBQ2YsRUFBRTtnQkFDRCxJQUFJLEVBQUUsUUFBUTtnQkFDZCxVQUFVLEVBQUU7b0JBQ1YsZUFBZSxFQUFFLFNBQVM7aUJBQzNCO2dCQUNELG9CQUFvQixFQUFFLEtBQUs7YUFDNUIsQ0FBQztRQUNGLFNBQVMsRUFBRSxDQUFDO1FBQ1osU0FBUyxFQUFFLENBQUM7S0FDYjtJQUNELGNBQWMsRUFBRTs2RUFDRyxjQUNaLEVBQVMsaUNBQ1gsR0FGSCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FDWixTQUFTO3NHQUVHLGNBQ1osRUFBUywwREFDWCxHQUZILElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUNaLFNBQVM7a0dBRUcsY0FDWixFQUFTLHNEQUNYLEdBRkgsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQ1osU0FBUztzSUFFRyxjQUNaLEVBQVMsMEZBQ1gsR0FGSCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FDWixTQUFTO0tBRWY7SUFDRCxjQUFjLEVBQUUsS0FBSztJQUNyQixJQUFJLEVBQUUsaUJBQWlCO0NBQ3hCLENBQUM7QUFuRVMsb0JBQUk7QUErRWpCO0lBQXVDLG9EQUFlO0lBTXBELGtDQUFZLFVBQXlCLEVBQUUsT0FBc0I7UUFBN0QsWUFDRSxrQkFBTSxVQUFVLEVBQUUsT0FBTyxDQUFDLFNBc0IzQjtRQTVCTyxXQUFLLEdBQXFCLEVBQUUsQ0FBQztRQUc3QixxQkFBZSxHQUFZLElBQUksQ0FBQztRQUl0QyxJQUFNLEdBQUcsR0FBRyxLQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDOUIsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDO1FBQzFCLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQixFQUFFLENBQUMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQy9CLGFBQWEsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQixDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLEtBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLGVBQWUsS0FBSyxLQUFLLENBQUM7UUFDMUQsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNwQyxLQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQzFFLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEtBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksS0FBSyxhQUFhLEVBQXRCLENBQXNCLENBQUMsQ0FBQztRQUNyRCxDQUFDO1FBQ0QsS0FBSSxDQUFDLGtCQUFrQixHQUFHLFVBQUMsSUFBZ0M7WUFDekQsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUM1RCxDQUFDLENBQUM7O0lBQ0osQ0FBQztJQU1PLDZDQUFVLEdBQWxCLFVBQW1CLGNBQXVCO1FBQ3hDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ2QsY0FBYyxnQkFBQTtZQUNkLGFBQWEsRUFBRSxLQUFLO1NBQ3JCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFLTyw0Q0FBUyxHQUFqQjtRQUVFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRyxDQUFDO0lBQzNCLENBQUM7SUFFUyxrREFBZSxHQUF6QixVQUEwQixJQUFtQjtRQUUzQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNoQixpQkFBTSxlQUFlLFlBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVTLDJEQUF3QixHQUFsQyxVQUFtQyxJQUE0QjtRQUM3RCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9DLGlCQUFNLHdCQUF3QixZQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVTLDBEQUF1QixHQUFqQyxVQUFrQyxJQUEyQjtRQUMzRCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9DLGlCQUFNLHVCQUF1QixZQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVNLHFEQUFrQixHQUF6QixVQUEwQixJQUFzQjtRQUM5QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQy9DLGlCQUFNLGtCQUFrQixZQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVTLG1EQUFnQixHQUExQixVQUEyQixJQUFvQjtRQUc3QyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLFNBQVMsQ0FBQyxDQUFDO1FBQ2hHLGlCQUFNLGdCQUFnQixZQUFDLElBQUksQ0FBQyxDQUFDO1FBRTdCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRU8sK0NBQVksR0FBcEIsVUFBcUIsSUFBZ0M7UUFDbkQsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ25DLElBQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUM7UUFDdkMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUNoRSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNyQyxJQUFNLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxlQUFlLEdBQUcsd0NBQXdDLEdBQUcsRUFBRSxDQUFDO1lBQ3hGLElBQU0sR0FBRyxHQUFHLGlDQUErQixTQUFXLENBQUM7WUFDdkQsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FDaEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsRUFDbkMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsRUFDbkMsR0FBRyxDQUNKLENBQUM7WUFDRixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzNCLENBQUM7SUFDSCxDQUFDO0lBRU8sK0NBQVksR0FBcEIsVUFBcUIsSUFBYTtRQUNoQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLHdCQUF3QixDQUFDO0lBQzlELENBQUM7SUFFUyw0Q0FBUyxHQUFuQixVQUFvQixJQUFhO1FBRS9CLEVBQUUsQ0FBQyxDQUNELElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDckIsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVU7WUFDdEMsSUFBSSxDQUFDLE1BQU07WUFDWCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQ3JDLENBQUMsQ0FBQyxDQUFDO1lBQ0QsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztnQkFDMUIsT0FBTyxHQUFHLENBQUMsZ0JBQWdCLENBQUM7WUFDOUIsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7Z0JBRTVCLE9BQU8sR0FBSSxJQUFJLENBQUMsTUFBc0MsQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDO1lBQzdFLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixPQUFPLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO2dCQUNaLElBQU0sSUFBSSxHQUFJLElBQXNCLENBQUMsSUFBSSxDQUFDO2dCQUcxQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztnQkFDMUIsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUNYLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFDakMsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7d0JBQzFCLEtBQUssQ0FBQztvQkFDUixDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztRQUVELGlCQUFNLFNBQVMsWUFBQyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBQ0gsK0JBQUM7QUFBRCxDQTNJQSxBQTJJQyxDQTNJc0MsSUFBSSxDQUFDLFVBQVUsR0EySXJEIiwiZmlsZSI6InJ1bGVzL2hhbmRsZUNhbGxiYWNrRXJyUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvam1sb3Blei9Xb3Jrc3BhY2UvdHNsaW50LWVzbGludC1ydWxlcy9zcmMifQ==
