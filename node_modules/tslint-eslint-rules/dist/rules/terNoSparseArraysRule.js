"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var RULE_NAME = 'ter-no-sparse-arrays';
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var walker = new NoSparseArraysWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(walker);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: RULE_NAME,
    description: 'disallow sparse arrays (recommended)',
    rationale: (_a = ["\n      Invalid or irregular whitespace causes issues with ECMAScript 5 parsers and also makes code\n      harder to debug in a similar nature to mixed tabs and spaces.\n      "], _a.raw = ["\n      Invalid or irregular whitespace causes issues with ECMAScript 5 parsers and also makes code\n      harder to debug in a similar nature to mixed tabs and spaces.\n      "], Lint.Utils.dedent(_a)),
    optionsDescription: '',
    options: {},
    optionExamples: [
        (_b = ["\n        \"", "\": [true]\n        "], _b.raw = ["\n        \"", "\": [true]\n        "], Lint.Utils.dedent(_b, RULE_NAME))
    ],
    typescriptOnly: false,
    type: 'typescript'
};
Rule.FAILURE_STRING = 'unexpected comma in middle of array';
exports.Rule = Rule;
var NoSparseArraysWalker = (function (_super) {
    tslib_1.__extends(NoSparseArraysWalker, _super);
    function NoSparseArraysWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoSparseArraysWalker.prototype.visitArrayLiteralExpression = function (node) {
        this.validateNoSparseArray(node);
        _super.prototype.visitArrayLiteralExpression.call(this, node);
    };
    NoSparseArraysWalker.prototype.validateNoSparseArray = function (node) {
        var hasEmptySlot = node.elements.some(function (el) { return el.kind === ts.SyntaxKind.OmittedExpression; });
        if (hasEmptySlot) {
            this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
        }
    };
    return NoSparseArraysWalker;
}(Lint.RuleWalker));
var _a, _b;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL3Rlck5vU3BhcnNlQXJyYXlzUnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBaUM7QUFDakMsNkJBQStCO0FBRS9CLElBQU0sU0FBUyxHQUFHLHNCQUFzQixDQUFDO0FBRXpDO0lBQTBCLGdDQUF1QjtJQUFqRDs7SUF3QkEsQ0FBQztJQUpRLG9CQUFLLEdBQVosVUFBYSxVQUF5QjtRQUNwQyxJQUFNLE1BQU0sR0FBRyxJQUFJLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUN2RSxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0gsV0FBQztBQUFELENBeEJBLEFBd0JDLENBeEJ5QixJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVk7QUFDakMsYUFBUSxHQUF1QjtJQUMzQyxRQUFRLEVBQUUsU0FBUztJQUNuQixXQUFXLEVBQUUsc0NBQXNDO0lBQ25ELFNBQVMsd01BQW1CLGtMQUd6QixHQUhRLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUd6QjtJQUNILGtCQUFrQixFQUFFLEVBQUU7SUFDdEIsT0FBTyxFQUFFLEVBQUU7SUFDWCxjQUFjLEVBQUU7a0VBQ0csY0FDWixFQUFTLHNCQUNYLEdBRkgsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQ1osU0FBUztLQUVmO0lBQ0QsY0FBYyxFQUFFLEtBQUs7SUFDckIsSUFBSSxFQUFFLFlBQVk7Q0FDbkIsQ0FBQztBQUNZLG1CQUFjLEdBQUcscUNBQXFDLENBQUM7QUFsQjFELG9CQUFJO0FBMEJqQjtJQUFtQyxnREFBZTtJQUFsRDs7SUFhQSxDQUFDO0lBWlcsMERBQTJCLEdBQXJDLFVBQXNDLElBQStCO1FBQ25FLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxpQkFBTSwyQkFBMkIsWUFBQyxJQUFJLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRU8sb0RBQXFCLEdBQTdCLFVBQThCLElBQStCO1FBQzNELElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFVBQUEsRUFBRSxJQUFJLE9BQUEsRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQixFQUEzQyxDQUEyQyxDQUFDLENBQUM7UUFFM0YsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztRQUM3RixDQUFDO0lBQ0gsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FiQSxBQWFDLENBYmtDLElBQUksQ0FBQyxVQUFVLEdBYWpEIiwiZmlsZSI6InJ1bGVzL3Rlck5vU3BhcnNlQXJyYXlzUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvam1sb3Blei9Xb3Jrc3BhY2UvdHNsaW50LWVzbGludC1ydWxlcy9zcmMifQ==
