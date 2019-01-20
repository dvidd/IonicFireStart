"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ts = require("typescript");
var Lint = require("tslint");
var tsutils_1 = require("tsutils");
var RULE_NAME = 'ter-max-len';
var CODE = 'code';
var COMMENTS = 'comments';
var TAB_WIDTH = 'tabWidth';
var IGNORE_PATTERN = 'ignorePattern';
var IGNORE_COMMENTS = 'ignoreComments';
var IGNORE_STRINGS = 'ignoreStrings';
var IGNORE_URLS = 'ignoreUrls';
var IGNORE_TEMPLATE_LITERALS = 'ignoreTemplateLiterals';
var IGNORE_REG_EXP_LITERALS = 'ignoreRegExpLiterals';
var IGNORE_TRAILING_COMMENTS = 'ignoreTrailingComments';
var IGNORE_IMPORTS = 'ignoreImports';
function computeLineLength(line, tabWidth) {
    var extraCharacterCount = 0;
    line.replace(/\t/g, function (_, offset) {
        var totalOffset = offset + extraCharacterCount;
        var previousTabStopOffset = tabWidth ? totalOffset % tabWidth : 0;
        var spaceCount = tabWidth - previousTabStopOffset;
        extraCharacterCount += spaceCount - 1;
        return '\t';
    });
    return line.length + extraCharacterCount;
}
function isFullLineComment(line, lineNumber, comment) {
    var start = comment.start;
    var end = comment.end;
    var isFirstTokenOnLine = !line.slice(0, start[1]).trim();
    return comment &&
        (start[0] < lineNumber || (start[0] === lineNumber && isFirstTokenOnLine)) &&
        (end[0] > lineNumber || (end[0] === lineNumber && end[1] === line.length));
}
function isTrailingComment(line, lineNumber, comment) {
    return comment &&
        (comment.start[0] === lineNumber && lineNumber <= comment.end[0]) &&
        (comment.end[0] > lineNumber || comment.end[1] === line.length);
}
function stripTrailingComment(line, comment) {
    return line.slice(0, comment.start[1]).replace(/\s+$/, '');
}
function groupByLineNumber(acc, node) {
    var startLoc = node.start;
    var endLoc = node.end;
    for (var i = startLoc[0]; i <= endLoc[0]; ++i) {
        if (!Array.isArray(acc[i])) {
            acc[i] = [];
        }
        acc[i].push(node);
    }
    return acc;
}
var Rule = (function (_super) {
    tslib_1.__extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.mergeOptions = function (options) {
        var optionsObj = {};
        var obj = options[0];
        if (typeof obj === 'number') {
            optionsObj[CODE] = obj || 80;
            obj = options[1];
        }
        if (typeof obj === 'number') {
            optionsObj[TAB_WIDTH] = obj || 4;
            obj = options[2];
        }
        if (typeof obj === 'object' && !Array.isArray(obj)) {
            Object.keys(obj).forEach(function (key) {
                optionsObj[key] = obj[key];
            });
        }
        optionsObj[CODE] = optionsObj[CODE] || 80;
        optionsObj[TAB_WIDTH] = optionsObj[TAB_WIDTH] || 4;
        return optionsObj;
    };
    Rule.prototype.isEnabled = function () {
        if (_super.prototype.isEnabled.call(this)) {
            var options = this.getOptions().ruleArguments;
            var option = options[0];
            if (typeof option === 'number' && option > 0) {
                return true;
            }
            var optionsObj = Rule.mergeOptions(options);
            if (optionsObj[CODE]) {
                return true;
            }
        }
        return false;
    };
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new MaxLenWalker(sourceFile, this.getOptions()));
    };
    return Rule;
}(Lint.Rules.AbstractRule));
Rule.metadata = {
    ruleName: RULE_NAME,
    description: 'enforce a maximum line length',
    rationale: (_a = ["\n      Limiting the length of a line of code improves code readability.\n      It also makes comparing code side-by-side easier and improves compatibility with\n      various editors, IDEs, and diff viewers.\n      "], _a.raw = ["\n      Limiting the length of a line of code improves code readability.\n      It also makes comparing code side-by-side easier and improves compatibility with\n      various editors, IDEs, and diff viewers.\n      "], Lint.Utils.dedent(_a)),
    optionsDescription: (_b = ["\n      An integer indicating the maximum length of lines followed by an optional integer specifying\n      the character width for tab characters.\n\n      An optional object may be provided to fine tune the rule:\n\n      * `\"", "\"`: (default 80) enforces a maximum line length\n      * `\"", "\"`: (default 4) specifies the character width for tab characters\n      * `\"", "\"`: enforces a maximum line length for comments; defaults to value of code\n      * `\"", "\"`: ignores lines matching a regular expression; can only match a single\n                                 line and need to be double escaped when written in JSON\n      * `\"", "\"`: true ignores all trailing comments and comments on their own line\n      * `\"", "\"`: true ignores only trailing comments\n      * `\"", "\"`: true ignores lines that contain a URL\n      * `\"", "\"`: true ignores lines that contain a double-quoted or single-quoted string\n      * `\"", "\"`: true ignores lines that contain a template literal\n      * `\"", "\"`: true ignores lines that contain a RegExp literal\n      * `\"", "\"`: true ignores lines that contain an import module specifier\n      "], _b.raw = ["\n      An integer indicating the maximum length of lines followed by an optional integer specifying\n      the character width for tab characters.\n\n      An optional object may be provided to fine tune the rule:\n\n      * \\`\"", "\"\\`: (default 80) enforces a maximum line length\n      * \\`\"", "\"\\`: (default 4) specifies the character width for tab characters\n      * \\`\"", "\"\\`: enforces a maximum line length for comments; defaults to value of code\n      * \\`\"", "\"\\`: ignores lines matching a regular expression; can only match a single\n                                 line and need to be double escaped when written in JSON\n      * \\`\"", "\"\\`: true ignores all trailing comments and comments on their own line\n      * \\`\"", "\"\\`: true ignores only trailing comments\n      * \\`\"", "\"\\`: true ignores lines that contain a URL\n      * \\`\"", "\"\\`: true ignores lines that contain a double-quoted or single-quoted string\n      * \\`\"", "\"\\`: true ignores lines that contain a template literal\n      * \\`\"", "\"\\`: true ignores lines that contain a RegExp literal\n      * \\`\"", "\"\\`: true ignores lines that contain an import module specifier\n      "], Lint.Utils.dedent(_b, CODE, TAB_WIDTH, COMMENTS, IGNORE_PATTERN, IGNORE_COMMENTS, IGNORE_TRAILING_COMMENTS, IGNORE_URLS, IGNORE_STRINGS, IGNORE_TEMPLATE_LITERALS, IGNORE_REG_EXP_LITERALS, IGNORE_IMPORTS)),
    options: {
        type: 'array',
        items: [{
                type: 'number',
                minimum: '0'
            }, {
                type: 'object',
                properties: (_c = {},
                    _c[CODE] = {
                        type: 'number',
                        minumum: '1'
                    },
                    _c[COMMENTS] = {
                        type: 'number',
                        minumum: '1'
                    },
                    _c[TAB_WIDTH] = {
                        type: 'number',
                        minumum: '1'
                    },
                    _c[IGNORE_PATTERN] = {
                        type: 'string'
                    },
                    _c[IGNORE_COMMENTS] = {
                        type: 'boolean'
                    },
                    _c[IGNORE_STRINGS] = {
                        type: 'boolean'
                    },
                    _c[IGNORE_URLS] = {
                        type: 'boolean'
                    },
                    _c[IGNORE_TEMPLATE_LITERALS] = {
                        type: 'boolean'
                    },
                    _c[IGNORE_REG_EXP_LITERALS] = {
                        type: 'boolean'
                    },
                    _c[IGNORE_TRAILING_COMMENTS] = {
                        type: 'boolean'
                    },
                    _c[IGNORE_IMPORTS] = {
                        type: 'boolean'
                    },
                    _c),
                additionalProperties: false
            }],
        minLength: 1,
        maxLength: 3
    },
    optionExamples: [
        (_d = ["\n        \"", "\": [true, 100]\n        "], _d.raw = ["\n        \"", "\": [true, 100]\n        "], Lint.Utils.dedent(_d, RULE_NAME)),
        (_e = ["\n        \"", "\": [\n          true,\n          100,\n          2,\n          {\n            \"", "\": true,\n            \"", "\": \"^\\\\s*(let|const)\\\\s.+=\\\\s*require\\\\s*\\\\(\"\n          }\n        ]\n        "], _e.raw = ["\n        \"", "\": [\n          true,\n          100,\n          2,\n          {\n            \"", "\": true,\n            \"", "\": \"^\\\\\\\\s*(let|const)\\\\\\\\s.+=\\\\\\\\s*require\\\\\\\\s*\\\\\\\\(\"\n          }\n        ]\n        "], Lint.Utils.dedent(_e, RULE_NAME, IGNORE_URLS, IGNORE_PATTERN)),
        (_f = ["\n        \"", "\": [\n          true,\n          {\n            \"", "\": 100,\n            \"", "\": 2,\n            \"", "\": true,\n            \"", "\": true,\n            \"", "\": \"^\\\\s*(let|const)\\\\s.+=\\\\s*require\\\\s*\\\\(\"\n          }\n        ]\n        "], _f.raw = ["\n        \"", "\": [\n          true,\n          {\n            \"", "\": 100,\n            \"", "\": 2,\n            \"", "\": true,\n            \"", "\": true,\n            \"", "\": \"^\\\\\\\\s*(let|const)\\\\\\\\s.+=\\\\\\\\s*require\\\\\\\\s*\\\\\\\\(\"\n          }\n        ]\n        "], Lint.Utils.dedent(_f, RULE_NAME, CODE, TAB_WIDTH, IGNORE_IMPORTS, IGNORE_URLS, IGNORE_PATTERN))
    ],
    typescriptOnly: false,
    type: 'style'
};
Rule.URL_REGEXP = /[^:/?#]:\/\/[^?#]/;
exports.Rule = Rule;
var MaxLenWalker = (function (_super) {
    tslib_1.__extends(MaxLenWalker, _super);
    function MaxLenWalker(sourceFile, options) {
        var _this = _super.call(this, sourceFile, options) || this;
        _this.ignoredIntervals = [];
        _this.optionsObj = {};
        _this.comments = [];
        _this.strings = [];
        _this.templates = [];
        _this.regExp = [];
        _this.optionsObj = Rule.mergeOptions(_this.getOptions());
        return _this;
    }
    MaxLenWalker.prototype.hasOption = function (option) {
        if (this.optionsObj[option] && this.optionsObj[option]) {
            return true;
        }
        return false;
    };
    MaxLenWalker.prototype.getOption = function (option) {
        return this.optionsObj[option];
    };
    MaxLenWalker.prototype.visitStringLiteral = function (node) {
        this.strings.push(this.getINode(node.kind, node.getText(), node.getStart()));
        _super.prototype.visitStringLiteral.call(this, node);
    };
    MaxLenWalker.prototype.visitRegularExpressionLiteral = function (node) {
        this.regExp.push(this.getINode(node.kind, node.getText(), node.getStart()));
        _super.prototype.visitRegularExpressionLiteral.call(this, node);
    };
    MaxLenWalker.prototype.getINode = function (kind, text, startPos) {
        var width = text.length;
        var src = this.getSourceFile();
        var startLoc = src.getLineAndCharacterOfPosition(startPos);
        var endLoc = src.getLineAndCharacterOfPosition(startPos + width);
        return {
            kind: kind,
            text: text,
            startPosition: startPos,
            endPosition: startPos + width,
            start: [startLoc.line, startLoc.character],
            end: [endLoc.line, endLoc.character]
        };
    };
    MaxLenWalker.prototype.visitSourceFile = function (node) {
        var _this = this;
        _super.prototype.visitSourceFile.call(this, node);
        tsutils_1.forEachTokenWithTrivia(node, function (text, token, range) {
            if (token === ts.SyntaxKind.SingleLineCommentTrivia ||
                token === ts.SyntaxKind.MultiLineCommentTrivia) {
                _this.comments.push(_this.getINode(token, text.substring(range.pos, range.end), range.pos));
            }
            else if (token === ts.SyntaxKind.FirstTemplateToken) {
                _this.templates.push(_this.getINode(token, text.substring(range.pos, range.end), range.pos));
            }
        });
        this.findFailures(node);
    };
    MaxLenWalker.prototype.visitImportDeclaration = function (node) {
        _super.prototype.visitImportDeclaration.call(this, node);
        var startPos = node.moduleSpecifier.getStart();
        var text = node.moduleSpecifier.getText();
        var width = text.length;
        if (this.hasOption(IGNORE_IMPORTS)) {
            this.ignoredIntervals.push({
                endPosition: startPos + width,
                startPosition: startPos
            });
        }
    };
    MaxLenWalker.prototype.findFailures = function (sourceFile) {
        var lineStarts = sourceFile.getLineStarts();
        var source = sourceFile.getFullText();
        var lineLimit = this.getOption(CODE) || 80;
        var ignoreTrailingComments = this.getOption(IGNORE_TRAILING_COMMENTS) ||
            this.getOption(IGNORE_COMMENTS) ||
            false;
        var ignoreComments = this.getOption(IGNORE_COMMENTS) || false;
        var ignoreStrings = this.getOption(IGNORE_STRINGS) || false;
        var ignoreTemplateLiterals = this.getOption(IGNORE_TEMPLATE_LITERALS) || false;
        var ignoreUrls = this.getOption(IGNORE_URLS) || false;
        var ignoreRexExpLiterals = this.getOption(IGNORE_REG_EXP_LITERALS) || false;
        var pattern = this.getOption(IGNORE_PATTERN) || null;
        var tabWidth = this.getOption(TAB_WIDTH) || 4;
        var maxCommentLength = this.getOption(COMMENTS);
        var comments = ignoreComments || maxCommentLength || ignoreTrailingComments ? this.comments : [];
        var commentsIndex = 0;
        var stringsByLine = this.strings.reduce(groupByLineNumber, {});
        var templatesByLine = this.templates.reduce(groupByLineNumber, {});
        var regExpByLine = this.regExp.reduce(groupByLineNumber, {});
        var totalLines = lineStarts.length;
        for (var i = 0; i < totalLines; ++i) {
            var from = lineStarts[i];
            var to = lineStarts[i + 1];
            var line = source.substring(from, i === totalLines - 1 ? to : to - 1);
            var lineIsComment = false;
            if (commentsIndex < comments.length) {
                var comment = void 0;
                do {
                    comment = comments[++commentsIndex];
                } while (comment && comment.start[0] <= i);
                comment = comments[--commentsIndex];
                if (isFullLineComment(line, i, comment)) {
                    lineIsComment = true;
                }
                else if (ignoreTrailingComments && isTrailingComment(line, i, comment)) {
                    line = stripTrailingComment(line, comment);
                }
            }
            if (ignoreUrls && Rule.URL_REGEXP.test(line) ||
                pattern && new RegExp(pattern).test(line) ||
                ignoreStrings && stringsByLine[i] ||
                ignoreTemplateLiterals && templatesByLine[i] ||
                ignoreRexExpLiterals && regExpByLine[i]) {
                continue;
            }
            var lineLength = computeLineLength(line, tabWidth);
            if (lineIsComment && ignoreComments) {
                continue;
            }
            var ruleFailure = null;
            if (lineIsComment && exceedLineLimit(lineLength, maxCommentLength, source[to - 2])) {
                ruleFailure = new Lint.RuleFailure(sourceFile, from, to - 1, "Line " + (i + 1) + " exceeds the maximum comment line length of " + maxCommentLength + ".", RULE_NAME);
            }
            else if (exceedLineLimit(lineLength, lineLimit, source[to - 2])) {
                ruleFailure = new Lint.RuleFailure(sourceFile, from, to - 1, "Line " + (i + 1) + " exceeds the maximum line length of " + lineLimit + ".", RULE_NAME);
            }
            if (ruleFailure && !Lint.doesIntersect(ruleFailure, this.ignoredIntervals)) {
                this.addFailure(ruleFailure);
            }
        }
    };
    return MaxLenWalker;
}(Lint.RuleWalker));
function exceedLineLimit(lineLength, lineLimit, secondToLast) {
    return lineLength > lineLimit && !((lineLength - 1) === lineLimit && secondToLast === '\r');
}
var _a, _b, _c, _d, _e, _f;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Q0FBQyxDQUFDLENBQUM7Z0JBQ3BDLFFBQVEsQ0FBQztZQUNYLENBQUM7WUFFRCxJQUFJLFdBQVcsR0FBNEIsSUFBSSxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLGFBQWEsSUFBSSxlQUFlLENBQUMsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25GLFdBQVcsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQ2hDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFDeEIsV0FBUSxDQUFDLEdBQUcsQ0FBQyxxREFBK0MsZ0JBQWdCLE1BQUcsRUFDL0UsU0FBUyxDQUNWLENBQUM7WUFDSixDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xFLFdBQVcsR0FBRyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQ2hDLFVBQVUsRUFBRSxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUMsRUFDeEIsV0FBUSxDQUFDLEdBQUcsQ0FBQyw2Q0FBdUMsU0FBUyxNQUFHLEVBQ2hFLFNBQVMsQ0FDVixDQUFDO1lBQ0osQ0FBQztZQUVELEVBQUUsQ0FBQyxDQUFDLFdBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDM0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUMvQixDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFDSCxtQkFBQztBQUFELENBbExBLEFBa0xDLENBbEwwQixJQUFJLENBQUMsVUFBVSxHQWtMekM7QUFFRCx5QkFBeUIsVUFBa0IsRUFBRSxTQUFpQixFQUFFLFlBQW9CO0lBTWxGLE1BQU0sQ0FBQyxVQUFVLEdBQUcsU0FBUyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsS0FBSyxTQUFTLElBQUksWUFBWSxLQUFLLElBQUksQ0FBQyxDQUFDO0FBQzlGLENBQUMiLCJmaWxlIjoicnVsZXMvdGVyTWF4TGVuUnVsZS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvam1sb3Blei9Xb3Jrc3BhY2UvdHNsaW50LWVzbGludC1ydWxlcy9zcmMifQ==
