"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var RULE_NAME = 'ter-no-irregular-whitespace';
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        var walker = new NoIrregularWhitespaceWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(walker);
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: RULE_NAME,
    description: 'disallow irregular whitespace (recommended)',
    rationale: (_a = ["\n      Invalid or irregular whitespace causes issues with ECMAScript 5 parsers and also makes code\n      harder to debug in a similar nature to mixed tabs and spaces.\n      "], _a.raw = ["\n      Invalid or irregular whitespace causes issues with ECMAScript 5 parsers and also makes code\n      harder to debug in a similar nature to mixed tabs and spaces.\n      "], Lint.Utils.dedent(_a)),
    optionsDescription: '',
    options: {},
    optionExamples: [
        (_b = ["\n        \"", "\": [true]\n        "], _b.raw = ["\n        \"", "\": [true]\n        "], Lint.Utils.dedent(_b, RULE_NAME))
    ],
    typescriptOnly: false,
    type: 'typescript'
};
Rule.RULE_NAME = 'ter-no-irregular-whitespace';
Rule.FAILURE_STRING = 'irregular whitespace not allowed';
exports.Rule = Rule;
var NoIrregularWhitespaceWalker = (function (_super) {
    tslib_1.__extends(NoIrregularWhitespaceWalker, _super);
    function NoIrregularWhitespaceWalker() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.IRREGULAR_WHITESPACE = /[\u0085\u00A0\ufeff\f\v\u00a0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u202f\u205f\u3000]+/mg;
        _this.IRREGULAR_LINE_TERMINATORS = /[\u2028\u2029]/mg;
        return _this;
    }
    NoIrregularWhitespaceWalker.prototype.visitSourceFile = function (node) {
        this.validateIrregularWhitespace(node);
        _super.prototype.visitSourceFile.call(this, node);
    };
    NoIrregularWhitespaceWalker.prototype.visitNode = function (node) {
        if (node.kind === ts.SyntaxKind.StringLiteral) {
            this.removeStringError(node);
        }
        _super.prototype.visitNode.call(this, node);
    };
    NoIrregularWhitespaceWalker.prototype.removeStringError = function (node) {
        var start = node.getStart();
        var end = node.getEnd();
        var failures = this.getFailures();
        for (var i = failures.length - 1; i >= 0; i--) {
            var failure = failures[i];
            if (failure.getRuleName() === Rule.RULE_NAME) {
                if (failure.getStartPosition().getPosition() >= start && failure.getEndPosition().getPosition() <= end) {
                    failures.splice(i, 1);
                }
            }
        }
    };
    NoIrregularWhitespaceWalker.prototype.validateIrregularWhitespace = function (node) {
        var _this = this;
        var lines = node.text.split(/\n/g);
        lines.forEach(function (line, i) {
            var match = _this.IRREGULAR_WHITESPACE.exec(line);
            while (match) {
                _this.addFailure(_this.createFailure(node.getPositionOfLineAndCharacter(i, match.index), 1, Rule.FAILURE_STRING));
                match = _this.IRREGULAR_WHITESPACE.exec(line);
            }
            match = _this.IRREGULAR_LINE_TERMINATORS.exec(line);
            while (match) {
                _this.addFailure(_this.createFailure(node.getPositionOfLineAndCharacter(i, match.index), 1, Rule.FAILURE_STRING));
                match = _this.IRREGULAR_LINE_TERMINATORS.exec(line);
            }
        });
    };
    return NoIrregularWhitespaceWalker;
}(Lint.RuleWalker));
var _a, _b;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL3Rlck5vSXJyZWd1bGFyV2hpdGVzcGFjZVJ1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0JBQWlDO0FBQ2pDLDZCQUErQjtBQUUvQixJQUFNLFNBQVMsR0FBRyw2QkFBNkIsQ0FBQztBQUVoRDtJQUEwQixnQ0FBdUI7SUFBakQ7O0lBeUJBLENBQUM7SUFKUSxvQkFBSyxHQUFaLFVBQWEsVUFBeUI7UUFDcEMsSUFBTSxNQUFNLEdBQUcsSUFBSSwyQkFBMkIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDOUUsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNILFdBQUM7QUFBRCxDQXpCQSxBQXlCQyxDQXpCeUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZO0FBQ2pDLGFBQVEsR0FBdUI7SUFDM0MsUUFBUSxFQUFFLFNBQVM7SUFDbkIsV0FBVyxFQUFFLDZDQUE2QztJQUMxRCxTQUFTLHdNQUFtQixrTEFHekIsR0FIUSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FHekI7SUFDSCxrQkFBa0IsRUFBRSxFQUFFO0lBQ3RCLE9BQU8sRUFBRSxFQUFFO0lBQ1gsY0FBYyxFQUFFO2tFQUNHLGNBQ1osRUFBUyxzQkFDWCxHQUZILElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUNaLFNBQVM7S0FFZjtJQUNELGNBQWMsRUFBRSxLQUFLO0lBQ3JCLElBQUksRUFBRSxZQUFZO0NBQ25CLENBQUM7QUFDWSxjQUFTLEdBQUcsNkJBQTZCLENBQUM7QUFDMUMsbUJBQWMsR0FBRyxrQ0FBa0MsQ0FBQztBQW5CdkQsb0JBQUk7QUEyQmpCO0lBQTBDLHVEQUFlO0lBQXpEO1FBQUEscUVBb0RDO1FBbkRTLDBCQUFvQixHQUFHLHlJQUF5SSxDQUFDO1FBQ2pLLGdDQUEwQixHQUFHLGtCQUFrQixDQUFDOztJQWtEMUQsQ0FBQztJQWhEVyxxREFB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
