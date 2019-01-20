"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var highlight_1 = require("./highlight");
describe('highlight.js', function () {
    describe('highlightError', function () {
        it('should error highlight unescaped', function () {
            var htmlInput = "x & y";
            var errorCharStart = 2;
            var errorLength = 1;
            var v = highlight_1.highlightError(htmlInput, errorCharStart, errorLength);
            expect(v).toEqual("x <span class=\"ion-diagnostics-error-chr\">&</span> y");
        });
        it('should error highlight escaped >', function () {
            var sourceText = "x > y";
            var htmlInput = highlight_1.highlight('typescript', sourceText, true).value;
            var errorCharStart = 2;
            var errorLength = 1;
            var v = highlight_1.highlightError(htmlInput, errorCharStart, errorLength);
            expect(v).toEqual("x <span class=\"ion-diagnostics-error-chr\">&gt;</span> y");
        });
        it('should error highlight before escaped >', function () {
            var sourceText = "if (x > y) return;";
            var htmlInput = highlight_1.highlight('typescript', sourceText, true).value;
            var errorCharStart = 4;
            var errorLength = 1;
            var v = highlight_1.highlightError(htmlInput, errorCharStart, errorLength);
            expect(v).toEqual("<span class=\"hljs-keyword\">if</span> (<span class=\"ion-diagnostics-error-chr\">x</span> &gt; y) <span class=\"hljs-keyword\">return</span>;");
        });
        it('should error highlight after escaped <', function () {
            var sourceText = "if (x < y) return;";
            var htmlInput = highlight_1.highlight('typescript', sourceText, true).value;
            var errorCharStart = 8;
            var errorLength = 1;
            var v = highlight_1.highlightError(htmlInput, errorCharStart, errorLength);
            expect(v).toEqual("<span class=\"hljs-keyword\">if</span> (x &lt; <span class=\"ion-diagnostics-error-chr\">y</span>) <span class=\"hljs-keyword\">return</span>;");
        });
        it('should error highlight first 3 chars', function () {
            // var name: string = 'Ellie';
            var htmlInput = "<span class=\"hljs-keyword\">var</span> name: <span class=\"hljs-built_in\">string</span> = <span class=\"hljs-string\">'Ellie'</span>;";
            var errorCharStart = 0;
            var errorLength = 3;
            var v = highlight_1.highlightError(htmlInput, errorCharStart, errorLength);
            expect(v).toEqual("<span class=\"hljs-keyword\"><span class=\"ion-diagnostics-error-chr\">v</span><span class=\"ion-diagnostics-error-chr\">a</span><span class=\"ion-diagnostics-error-chr\">r</span></span> name: <span class=\"hljs-built_in\">string</span> = <span class=\"hljs-string\">'Ellie'</span>;");
        });
        it('should error highlight second char', function () {
            // var name: string = 'Ellie';
            var htmlInput = "<span class=\"hljs-keyword\">var</span> name: <span class=\"hljs-built_in\">string</span> = <span class=\"hljs-string\">'Ellie'</span>;";
            var errorCharStart = 1;
            var errorLength = 1;
            var v = highlight_1.highlightError(htmlInput, errorCharStart, errorLength);
            expect(v).toEqual("<span class=\"hljs-keyword\">v<span class=\"ion-diagnostics-error-chr\">a</span>r</span> name: <span class=\"hljs-built_in\">string</span> = <span class=\"hljs-string\">'Ellie'</span>;");
        });
        it('should error highlight first char', function () {
            // var name: string = 'Ellie';
            var htmlInput = "<span class=\"hljs-keyword\">var</span> name: <span class=\"hljs-built_in\">string</span> = <span class=\"hljs-string\">'Ellie'</span>;";
            var errorCharStart = 0;
            var errorLength = 1;
            var v = highlight_1.highlightError(htmlInput, errorCharStart, errorLength);
            expect(v).toEqual("<span class=\"hljs-keyword\"><span class=\"ion-diagnostics-error-chr\">v</span>ar</span> name: <span class=\"hljs-built_in\">string</span> = <span class=\"hljs-string\">'Ellie'</span>;");
        });
        it('should return the same if there are is no errorLength', function () {
            // textInput = `var name: string = 'Ellie';`;
            var htmlInput = "<span class=\"hljs-keyword\">var</span> name: <span class=\"hljs-built_in\">string</span> = <span class=\"hljs-string\">'Ellie'</span>;";
            var errorCharStart = 10;
            var errorLength = 0;
            var v = highlight_1.highlightError(htmlInput, errorCharStart, errorLength);
            expect(v).toEqual(htmlInput);
        });
        it('should return the same if there are is no errorCharStart', function () {
            // textInput = `var name: string = 'Ellie';`;
            var htmlInput = "<span class=\"hljs-keyword\">var</span> name: <span class=\"hljs-built_in\">string</span> = <span class=\"hljs-string\">'Ellie'</span>;";
            var errorCharStart = -1;
            var errorLength = 10;
            var v = highlight_1.highlightError(htmlInput, errorCharStart, errorLength);
            expect(v).toEqual(htmlInput);
        });
    });
    describe('typescript', function () {
        it('should replace typescript with <', function () {
            var sourceText = "if (x < y) return;";
            var v = highlight_1.highlight('typescript', sourceText, true).value;
            expect(v).toEqual("<span class=\"hljs-keyword\">if</span> (x &lt; y) <span class=\"hljs-keyword\">return</span>;");
        });
        it('should replace typescript', function () {
            var sourceText = "var name: string = 'Ellie';";
            var v = highlight_1.highlight('typescript', sourceText, true).value;
            expect(v).toEqual("<span class=\"hljs-keyword\">var</span> name: <span class=\"hljs-built_in\">string</span> = <span class=\"hljs-string\">'Ellie'</span>;");
        });
    });
    describe('html', function () {
        it('should replace html', function () {
            var sourceText = "<div key=\"value\">Text</div>";
            var v = highlight_1.highlight('html', sourceText, true).value;
            expect(v).toEqual("<span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">div</span> <span class=\"hljs-attr\">key</span>=<span class=\"hljs-string\">\"value\"</span>&gt;</span>Text<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">div</span>&gt;</span>");
        });
    });
    describe('scss', function () {
        it('should replace scss', function () {
            var sourceText = ".className { color: $red; }";
            var v = highlight_1.highlight('scss', sourceText, true).value;
            expect(v).toEqual("<span class=\"hljs-selector-class\">.className</span> { <span class=\"hljs-attribute\">color</span>: <span class=\"hljs-variable\">$red</span>; }");
        });
    });
});
