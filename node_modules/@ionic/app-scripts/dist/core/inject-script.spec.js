"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inject_scripts_1 = require("./inject-scripts");
describe('Inject Scripts', function () {
    describe('injectCoreHtml', function () {
        it('should replace an existed injected script tag', function () {
            var inputHtml = '' +
                '<html>\n' +
                '<head>\n' +
                '  <script data-ionic="inject">\n' +
                '    alert(11111);\n' +
                '  </script>\n' +
                '</head>\n' +
                '<body>\n' +
                '</body>\n' +
                '</html>';
            var output = inject_scripts_1.injectCoreHtml(inputHtml, '  <script data-ionic="inject">\n' +
                '    alert(55555);\n' +
                '  </script>');
            expect(output).toEqual('<html>\n' +
                '<head>\n' +
                '  <script data-ionic="inject">\n' +
                '    alert(55555);\n' +
                '  </script>\n' +
                '</head>\n' +
                '<body>\n' +
                '</body>\n' +
                '</html>');
        });
        it('should replace only one existed injected script tag', function () {
            var inputHtml = '' +
                '<html>\n' +
                '<head>\n' +
                '  <script data-ionic="inject">\n' +
                '    alert(11111);\n' +
                '  </script>\n' +
                '  <script>\n' +
                '    alert(222);\n' +
                '  </script>\n' +
                '</head>\n' +
                '<body>\n' +
                '</body>\n' +
                '</html>';
            var output = inject_scripts_1.injectCoreHtml(inputHtml, '  <script data-ionic="inject">\n' +
                '    alert(55555);\n' +
                '  </script>');
            expect(output).toEqual('<html>\n' +
                '<head>\n' +
                '  <script data-ionic="inject">\n' +
                '    alert(55555);\n' +
                '  </script>\n' +
                '  <script>\n' +
                '    alert(222);\n' +
                '  </script>\n' +
                '</head>\n' +
                '<body>\n' +
                '</body>\n' +
                '</html>');
        });
        it('should add script to top of file when no html tag', function () {
            var inputHtml = '' +
                '<body>\n' +
                '</body>';
            var output = inject_scripts_1.injectCoreHtml(inputHtml, '<injected></injected>');
            expect(output).toEqual('<injected></injected>\n' +
                '<body>\n' +
                '</body>');
        });
        it('should add script below <html> with attributes', function () {
            var inputHtml = '' +
                '<html dir="rtl">\n' +
                '<body>\n' +
                '</body>\n' +
                '</html>';
            var output = inject_scripts_1.injectCoreHtml(inputHtml, '<injected></injected>');
            expect(output).toEqual('<html dir="rtl">\n' +
                '<injected></injected>\n' +
                '<body>\n' +
                '</body>\n' +
                '</html>');
        });
        it('should add script below <html> when no head tag', function () {
            var inputHtml = '' +
                '<html>\n' +
                '<body>\n' +
                '</body>\n' +
                '</html>';
            var output = inject_scripts_1.injectCoreHtml(inputHtml, '<injected></injected>');
            expect(output).toEqual('<html>\n' +
                '<injected></injected>\n' +
                '<body>\n' +
                '</body>\n' +
                '</html>');
        });
        it('should add script below <head>', function () {
            var inputHtml = '' +
                '<html>\n' +
                '<head>\n' +
                '</head>\n' +
                '<body>\n' +
                '</body>\n' +
                '</html>';
            var output = inject_scripts_1.injectCoreHtml(inputHtml, '<injected></injected>');
            expect(output).toEqual('<html>\n' +
                '<head>\n' +
                '<injected></injected>\n' +
                '</head>\n' +
                '<body>\n' +
                '</body>\n' +
                '</html>');
        });
        it('should add script below <head> with attributes and all caps tag', function () {
            var inputHtml = '' +
                '<html>\n' +
                '<HEAD data-attr="yup">\n' +
                '</HEAD>\n' +
                '<body>\n' +
                '</body>\n' +
                '</html>';
            var output = inject_scripts_1.injectCoreHtml(inputHtml, '<injected></injected>');
            expect(output).toEqual('<html>\n' +
                '<HEAD data-attr="yup">\n' +
                '<injected></injected>\n' +
                '</HEAD>\n' +
                '<body>\n' +
                '</body>\n' +
                '</html>');
        });
    });
});
