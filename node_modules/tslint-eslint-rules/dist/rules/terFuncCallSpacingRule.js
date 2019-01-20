"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var RULE_NAME = 'ter-func-call-spacing';
var ALWAYS = 'always';
var MISSING_SPACE = 'Missing space between function name and paren.';
var UNEXPECTED_SPACE = 'Unexpected space between function name and paren.';
var UNEXPECTED_NEWLINE = 'Unexpected newline between function name and paren.';
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var options = {
            expectSpace: false,
            spacePattern: /\s/
        };
        var userOptions = this.getOptions().ruleArguments;
        if (userOptions[0] === ALWAYS) {
            options.expectSpace = true;
            if (userOptions[1] !== undefined && userOptions[1].allowNewlines) {
                options.spacePattern = /[ \t\r\n\u2028\u2029]/;
            }
            else {
                options.spacePattern = /[ \t]/;
            }
        }
        var walker = new RuleWalker(sourceFile, RULE_NAME, options);
        return this.applyWithWalker(walker);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: RULE_NAME,
    hasFix: true,
    description: 'require or disallow spacing between function identifiers and their invocations',
    rationale: (_a = ["\n      This rule will enforce consistency of spacing in function calls,\n      by disallowing or requiring one or more spaces before the open paren.\n      "], _a.raw = ["\n      This rule will enforce consistency of spacing in function calls,\n      by disallowing or requiring one or more spaces before the open paren.\n      "], Lint.Utils.dedent(_a)),
    optionsDescription: (_b = ["\n      This rule has a string option:\n\n      * `\"never\"` (default) disallows space between the function name and the opening parenthesis.\n      * `\"always\"` requires space between the function name and the opening parenthesis.\n\n      Further, in `\"always\"` mode, a second object option is available that contains a single boolean `allowNewlines` property.\n      "], _b.raw = ["\n      This rule has a string option:\n\n      * \\`\"never\"\\` (default) disallows space between the function name and the opening parenthesis.\n      * \\`\"always\"\\` requires space between the function name and the opening parenthesis.\n\n      Further, in \\`\"always\"\\` mode, a second object option is available that contains a single boolean \\`allowNewlines\\` property.\n      "], Lint.Utils.dedent(_b)),
    options: {
        type: 'array',
        items: [
            {
                enum: ['always', 'never']
            },
            {
                type: 'object',
                properties: {
                    allowNewlines: {
                        type: 'boolean'
                    }
                },
                additionalProperties: false
            }
        ],
        minItems: 0,
        maxItems: 2
    },
    optionExamples: [
        (_c = ["\n        \"", "\": [true]\n        "], _c.raw = ["\n        \"", "\": [true]\n        "], Lint.Utils.dedent(_c, RULE_NAME)),
        (_d = ["\n        \"", "\": [true, \"always\"]\n        "], _d.raw = ["\n        \"", "\": [true, \"always\"]\n        "], Lint.Utils.dedent(_d, RULE_NAME)),
        (_e = ["\n        \"", "\": [true, \"always\", { allowNewlines: true }]\n        "], _e.raw = ["\n        \"", "\": [true, \"always\", { allowNewlines: true }]\n        "], Lint.Utils.dedent(_e, RULE_NAME))
    ],
    typescriptOnly: false,
    type: 'style'
};
exports.Rule = Rule;
var RuleWalker = (function (_super) {
    tslib_1.__extends(RuleWalker, _super);
    function RuleWalker(sourceFile, ruleName, options) {
        var _this = _super.call(this, sourceFile, ruleName, options) || this;
        _this.sourceText = sourceFile.getFullText();
        return _this;
    }
    RuleWalker.prototype.walk = function (sourceFile) {
        var _this = this;
        var cb = function (node) {
            if (node.kind === ts.SyntaxKind.NewExpression) {
                _this.visitNewExpression(node);
            }
            else if (node.kind === ts.SyntaxKind.CallExpression) {
                _this.visitCallExpression(node);
            }
            else if (node.kind >= ts.SyntaxKind.FirstTypeNode && node.kind <= ts.SyntaxKind.LastTypeNode) {
                return;
            }
            return ts.forEachChild(node, cb);
        };
        return ts.forEachChild(sourceFile, cb);
    };
    RuleWalker.prototype.visitNewExpression = function (node) {
        this.checkWhitespaceAfterExpression(node.expression, node.typeArguments, node.arguments);
    };
    RuleWalker.prototype.visitCallExpression = function (node) {
        this.checkWhitespaceAfterExpression(node.expression, node.typeArguments, node.arguments);
    };
    RuleWalker.prototype.checkWhitespaceAfterExpression = function (expression, typeArguments, funcArguments) {
        if (funcArguments !== undefined) {
            var start = void 0;
            if (typeArguments !== undefined) {
                start = typeArguments.end + 1;
            }
            else {
                start = expression.getEnd();
            }
            this.checkWhitespaceBetween(start, funcArguments.pos - 1);
        }
    };
    RuleWalker.prototype.checkWhitespaceBetween = function (start, end) {
        var whitespace = this.sourceText.substring(start, end);
        if (this.options.spacePattern.test(whitespace)) {
            if (!this.options.expectSpace) {
                var fix = Lint.Replacement.deleteText(start, whitespace.length);
                var failureMessage = this.failureMessageForUnexpectedWhitespace(whitespace);
                this.addFailureAt(start, whitespace.length, failureMessage, fix);
            }
        }
        else if (this.options.expectSpace) {
            var fix = Lint.Replacement.appendText(start, ' ');
            this.addFailureAt(start, 1, MISSING_SPACE, fix);
        }
    };
    RuleWalker.prototype.failureMessageForUnexpectedWhitespace = function (whitespace) {
        if (/[\r\n]/.test(whitespace)) {
            return UNEXPECTED_NEWLINE;
        }
        else {
            return UNEXPECTED_SPACE;
        }
    };
    return RuleWalker;
}(Lint.AbstractWalker));
var _a, _b, _c, _d, _e;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL3RlckZ1bmNDYWxsU3BhY2luZ1J1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0JBQWlDO0FBQ2pDLDZCQUErQjtBQUUvQixJQUFNLFNBQVMsR0FBRyx1QkFBdUIsQ0FBQztBQUMxQyxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFFeEIsSUFBTSxhQUFhLEdBQUcsZ0RBQWdELENBQUM7QUFDdkUsSUFBTSxnQkFBZ0IsR0FBRyxtREFBbUQsQ0FBQztBQUM3RSxJQUFNLGtCQUFrQixHQUFHLHFEQUFxRCxDQUFDO0FBT2pGO0lBQTBCLGdDQUF1QjtJQUFqRDs7SUF1RUEsQ0FBQztJQXBCUSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDcEMsSUFBTSxPQUFPLEdBQUc7WUFDZCxXQUFXLEVBQUUsS0FBSztZQUNsQixZQUFZLEVBQUUsSUFBSTtTQUNuQixDQUFDO1FBRUYsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLGFBQWEsQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM5QixPQUFPLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUMzQixFQUFFLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO2dCQUNqRSxPQUFPLENBQUMsWUFBWSxHQUFHLHVCQUF1QixDQUFDO1lBQ2pELENBQUM7WUFDRCxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLENBQUMsWUFBWSxHQUFHLE9BQU8sQ0FBQztZQUNqQyxDQUFDO1FBQ0gsQ0FBQztRQUVELElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDOUQsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFl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QUFDO2dCQUNsRSxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMscUNBQXFDLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzlFLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ25FLENBQUM7UUFDSCxDQUFDO1FBQ0QsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUNsQyxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDcEQsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNsRCxDQUFDO0lBQ0gsQ0FBQztJQUVPLDBEQUFxQyxHQUE3QyxVQUE4QyxVQUFrQjtRQUM5RCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QixNQUFNLENBQUMsa0JBQWtCLENBQUM7UUFDNUIsQ0FBQztRQUNELElBQUksQ0FBQyxDQUFDO1lBQ0osTUFBTSxDQUFDLGdCQUFnQixDQUFDO1FBQzFCLENBQUM7SUFDSCxDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQXZFQSxBQXVFQyxDQXZFd0IsSUFBSSxDQUFDLGNBQWMsR0F1RTNDIiwiZmlsZSI6InJ1bGVzL3RlckZ1bmNDYWxsU3BhY2luZ1J1bGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2ptbG9wZXovV29ya3NwYWNlL3RzbGludC1lc2xpbnQtcnVsZXMvc3JjIn0=
