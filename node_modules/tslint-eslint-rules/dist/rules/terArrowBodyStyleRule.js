"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var RULE_NAME = 'ter-arrow-body-style';
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
    description: 'require braces in arrow function body',
    rationale: (_a = ["\n      Arrow functions have two syntactic forms for their function bodies. They may be defined with\n      a block body (denoted by curly braces) `() => { ... }` or with a single expression\n      `() => ...`, whose value is implicitly returned.\n      "], _a.raw = ["\n      Arrow functions have two syntactic forms for their function bodies. They may be defined with\n      a block body (denoted by curly braces) \\`() => { ... }\\` or with a single expression\n      \\`() => ...\\`, whose value is implicitly returned.\n      "], Lint.Utils.dedent(_a)),
    optionsDescription: (_b = ["\n      The rule takes one or two options. The first is a string, which can be:\n\n      - `\"always\"` enforces braces around the function body\n      - `\"as-needed\"` enforces no braces where they can be omitted (default)\n      - `\"never\"` enforces no braces around the function body (constrains arrow functions to the\n                    role of returning an expression)\n\n      The second one is an object for more fine-grained configuration when the first option is\n      `\"as-needed\"`. Currently, the only available option is `requireReturnForObjectLiteral`, a\n      boolean property. It\u2019s false by default. If set to true, it requires braces and an explicit\n      return for object literals.\n      "], _b.raw = ["\n      The rule takes one or two options. The first is a string, which can be:\n\n      - \\`\"always\"\\` enforces braces around the function body\n      - \\`\"as-needed\"\\` enforces no braces where they can be omitted (default)\n      - \\`\"never\"\\` enforces no braces around the function body (constrains arrow functions to the\n                    role of returning an expression)\n\n      The second one is an object for more fine-grained configuration when the first option is\n      \\`\"as-needed\"\\`. Currently, the only available option is \\`requireReturnForObjectLiteral\\`, a\n      boolean property. It\u2019s false by default. If set to true, it requires braces and an explicit\n      return for object literals.\n      "], Lint.Utils.dedent(_b)),
    options: {
        anyOf: [
            {
                type: 'array',
                items: [
                    {
                        enum: ['always', 'never']
                    }
                ],
                minItems: 0,
                maxItems: 1
            },
            {
                type: 'array',
                items: [
                    {
                        enum: ['as-needed']
                    },
                    {
                        type: 'object',
                        properties: {
                            requireReturnForObjectLiteral: { type: 'boolean' }
                        },
                        additionalProperties: false
                    }
                ],
                minItems: 0,
                maxItems: 2
            }
        ]
    },
    optionExamples: [
        (_c = ["\n        \"", "\": [true, \"always\"]\n        "], _c.raw = ["\n        \"", "\": [true, \"always\"]\n        "], Lint.Utils.dedent(_c, RULE_NAME)),
        (_d = ["\n        \"", "\": [true, \"never\"]\n        "], _d.raw = ["\n        \"", "\": [true, \"never\"]\n        "], Lint.Utils.dedent(_d, RULE_NAME)),
        (_e = ["\n        \"", "\": [true, \"as-needed\", {\n          \"requireReturnForObjectLiteral\": true\n        }]\n        "], _e.raw = ["\n        \"", "\": [true, \"as-needed\", {\n          \"requireReturnForObjectLiteral\": true\n        }]\n        "], Lint.Utils.dedent(_e, RULE_NAME))
    ],
    typescriptOnly: false,
    type: 'style'
};
exports.Rule = Rule;
var RuleWalker = (function (_super) {
    tslib_1.__extends(RuleWalker, _super);
    function RuleWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        var opt = _this.getOptions();
        _this.always = opt[0] === 'always';
        _this.asNeeded = !opt[0] || opt[0] === 'as-needed';
        _this.never = opt[0] === 'never';
        _this.requireReturnForObjectLiteral = opt[1] && opt[1].requireReturnForObjectLiteral;
        return _this;
    }
    RuleWalker.prototype.visitArrowFunction = function (node) {
        var arrowBody = node.body;
        if (arrowBody.kind === ts.SyntaxKind.Block) {
            var blockBody = arrowBody.statements;
            if (blockBody.length !== 1 && !this.never) {
                return;
            }
            var returnExpression = blockBody[0].expression;
            if (this.asNeeded &&
                this.requireReturnForObjectLiteral &&
                blockBody[0].kind === ts.SyntaxKind.ReturnStatement &&
                (returnExpression && this.isObjectLiteral(returnExpression))) {
                return;
            }
            if (this.never || this.asNeeded && blockBody[0].kind === ts.SyntaxKind.ReturnStatement) {
                this.report(arrowBody, false);
            }
        }
        else {
            if (this.always || (this.asNeeded &&
                this.requireReturnForObjectLiteral &&
                this.isObjectLiteral(arrowBody))) {
                this.report(arrowBody, true);
            }
        }
        _super.prototype.visitArrowFunction.call(this, node);
    };
    RuleWalker.prototype.isObjectLiteral = function (node) {
        var obj = node;
        while (obj.kind === ts.SyntaxKind.ParenthesizedExpression) {
            obj = node.expression;
        }
        return obj.kind === ts.SyntaxKind.ObjectLiteralExpression;
    };
    RuleWalker.prototype.report = function (arrowBody, expected) {
        var val = expected ? 'Expected' : 'Unexpected';
        var failure = this.createFailure(arrowBody.getStart(), arrowBody.getWidth(), val + " block statement surrounding arrow body.");
        this.addFailure(failure);
    };
    return RuleWalker;
}(Lint.RuleWalker));
var _a, _b, _c, _d, _e;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL3RlckFycm93Qm9keVN0eWxlUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFJQSwrQkFBaUM7QUFDakMsNkJBQStCO0FBRS9CLElBQU0sU0FBUyxHQUFHLHNCQUFzQixDQUFDO0FBRXpDO0lBQTBCLGdDQUF1QjtJQUFqRDs7SUEwRUEsQ0FBQztJQUpRLG9CQUFLLEdBQVosVUFBYSxVQUF5QjtRQUNwQyxJQUFNLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDN0QsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNILFdBQUM7QUFBRCxDQTFFQSxBQTBFQyxDQTFFeUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZO0FBQ2pDLGFBQVEsR0FBdUI7SUFDM0MsUUFBUSxFQUFFLFNBQVM7SUFDbkIsV0FBVyxFQUFFLHVDQUF1QztJQUNwRCxTQUFTLHNSQUFtQix3UUFJekIsR0FKUSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FJekI7SUFDSCxrQkFBa0IsMHVCQUFtQix3dUJBWWxDLEdBWmlCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQVlsQztJQUNILE9BQU8sRUFBRTtRQUNQLEtBQUssRUFBRTtZQUNMO2dCQUNFLElBQUksRUFBRSxPQUFPO2dCQUNiLEtBQUssRUFBRTtvQkFDTDt3QkFDRSxJQUFJLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDO3FCQUMxQjtpQkFDRjtnQkFDRCxRQUFRLEVBQUUsQ0FBQztnQkFDWCxRQUFRLEVBQUUsQ0FBQzthQUNaO1lBQ0Q7Z0JBQ0UsSUFBSSxFQUFFLE9BQU87Z0JBQ2IsS0FBSyxFQUFFO29CQUNMO3dCQUNFLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQztxQkFDcEI7b0JBQ0Q7d0JBQ0UsSUFBSSxFQUFFLFFBQVE7d0JBQ2QsVUFBVSxFQUFFOzRC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QUFDLENBQ2hDLENBQUMsQ0FBQyxDQUFDO2dCQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQy9CLENBQUM7UUFDSCxDQUFDO1FBRUQsaUJBQU0sa0JBQWtCLFlBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVPLG9DQUFlLEdBQXZCLFVBQXdCLElBQWE7UUFDbkMsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQ2YsT0FBTyxHQUFHLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLEVBQUUsQ0FBQztZQUMxRCxHQUFHLEdBQUksSUFBbUMsQ0FBQyxVQUFVLENBQUM7UUFDeEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUM7SUFDNUQsQ0FBQztJQUVPLDJCQUFNLEdBQWQsVUFBZSxTQUFrQixFQUFFLFFBQWlCO1FBQ2xELElBQU0sR0FBRyxHQUFHLFFBQVEsR0FBRyxVQUFVLEdBQUcsWUFBWSxDQUFDO1FBQ2pELElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQ2hDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsRUFDcEIsU0FBUyxDQUFDLFFBQVEsRUFBRSxFQUNqQixHQUFHLDZDQUEwQyxDQUNqRCxDQUFDO1FBQ0YsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBQ0gsaUJBQUM7QUFBRCxDQW5FQSxBQW1FQyxDQW5Fd0IsSUFBSSxDQUFDLFVBQVUsR0FtRXZDIiwiZmlsZSI6InJ1bGVzL3RlckFycm93Qm9keVN0eWxlUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvam1sb3Blei9Xb3Jrc3BhY2UvdHNsaW50LWVzbGludC1ydWxlcy9zcmMifQ==
