"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var mockFs = require("mock-fs");
var logger_1 = require("./logger/logger");
var template_1 = require("./template");
var template_2 = require("./template");
describe('template', function () {
    describe('inlineTemplate', function () {
        it('should inline multiple external html files which are the same for multiple @Components in same .ts file', function () {
            var sourceText = '/*someprefix*/@Component({templateUrl: "some-file.html" });/*somebetween*/@Component({templateUrl: "some-file.html" })/*somesuffix*/';
            var baseDir = path_1.join(process.cwd(), 'path', 'to', 'dir');
            var d = {};
            d[baseDir] = {
                'some-file.html': '<div>A</div>',
                'some-file.scss': 'body { color: red; }',
                'some-file.ts': sourceText,
            };
            mockFs(d);
            var results = template_1.inlineTemplate(sourceText, path_1.join(baseDir, 'some-file.ts'));
            expect(results).toEqual("/*someprefix*/@Component({template:/*ion-inline-start:\"" + path_1.join(baseDir, 'some-file.html') + "\"*/'<div>A</div>'/*ion-inline-end:\"" + path_1.join(baseDir, 'some-file.html') + "\"*/ });/*somebetween*/@Component({template:/*ion-inline-start:\"" + path_1.join(baseDir, 'some-file.html') + "\"*/'<div>A</div>'/*ion-inline-end:\"" + path_1.join(baseDir, 'some-file.html') + "\"*/ })/*somesuffix*/");
            mockFs.restore();
        });
        it('should inline multiple external html files with multiple @Components in same .ts file', function () {
            var sourceText = '/*someprefix*/@Component({templateUrl: "some-file1.html" });/*somebetween*/@Component({templateUrl: "some-file2.html" })/*somesuffix*/';
            var baseDir = path_1.join(process.cwd(), 'path', 'to', 'dir');
            var d = {};
            d[baseDir] = {
                'some-file1.html': '<div>A</div>',
                'some-file2.html': '<div>B</div>',
                'some-file.scss': 'body { color: red; }',
                'some-file.ts': sourceText,
            };
            mockFs(d);
            var results = template_1.inlineTemplate(sourceText, path_1.join(baseDir, 'some-file.ts'));
            expect(results).toEqual("/*someprefix*/@Component({template:/*ion-inline-start:\"" + path_1.join(baseDir, 'some-file1.html') + "\"*/'<div>A</div>'/*ion-inline-end:\"" + path_1.join(baseDir, 'some-file1.html') + "\"*/ });/*somebetween*/@Component({template:/*ion-inline-start:\"" + path_1.join(baseDir, 'some-file2.html') + "\"*/'<div>B</div>'/*ion-inline-end:\"" + path_1.join(baseDir, 'some-file2.html') + "\"*/ })/*somesuffix*/");
            mockFs.restore();
        });
        it('should inline the external html file content', function () {
            var sourceText = '@Component({templateUrl: "some-file.html" })';
            var baseDir = path_1.join(process.cwd(), 'path', 'to', 'dir');
            var d = {};
            d[baseDir] = {
                'some-file.html': '<div>hello</div>',
                'some-file.scss': 'body { color: red; }',
                'some-file.ts': sourceText,
            };
            mockFs(d);
            var results = template_1.inlineTemplate(sourceText, path_1.join(baseDir, 'some-file.ts'));
            expect(results).toEqual("@Component({template:/*ion-inline-start:\"" + path_1.join(baseDir, 'some-file.html') + "\"*/'<div>hello</div>'/*ion-inline-end:\"" + path_1.join(baseDir, 'some-file.html') + "\"*/ })");
            mockFs.restore();
        });
        it('should do nothing for files with incomplete Component', function () {
            var sourceText = "\n        // Component this be bork\n      ";
            var sourcePath = 'somefile.ts';
            var output = template_1.inlineTemplate(sourceText, sourcePath);
            expect(output).toEqual(sourceText);
        });
        it('should do nothing for files without Component', function () {
            var sourceText = "\n        console.log('yeah nothing');\n      ";
            var sourcePath = 'somefile.ts';
            var output = template_1.inlineTemplate(sourceText, sourcePath);
            expect(output).toEqual(sourceText);
        });
    });
    describe('updateTemplate', function () {
        it('should load and replace html file content', function () {
            var d = {
                'path/to/dir': {
                    'some-file.html': '<div>hello</div>',
                    'some-file.scss': 'body { color: red; }',
                    'some-file.ts': '@Component({templateUrl: "some-file.html" })',
                },
            };
            mockFs(d);
            var match = template_2.getTemplateMatch(d['path/to/dir']['some-file.ts']);
            var expected = template_1.replaceTemplateUrl(match, 'path/to/dir/some-file.html', '<div>hello</div>');
            var results = template_1.updateTemplate('path/to/dir', match);
            expect(results).toEqual(expected);
            mockFs.restore();
        });
        it('should load null for unfound html file content', function () {
            var d = {
                'path/to/dir': {
                    'some-file.html': '<div>hello</div>',
                    'some-file.scss': 'body { color: red; }',
                    'some-file.ts': '@Component({templateUrl: "some-file-doesnt-exist.html" })',
                },
            };
            mockFs(d);
            var match = template_2.getTemplateMatch(d['path/to/dir']['some-file.ts']);
            var results = template_1.updateTemplate('path/to/dir', match);
            expect(results).toEqual(null);
            mockFs.restore();
        });
    });
    describe('replaceTemplateUrl', function () {
        it('should turn the template into one line', function () {
            var str = "\n        Component({\n          templateUrl: \"somepage.html\"})";
            var templateContent = "\n        <div>\t\n          this is \"multiline\" 'content'\n        </div>\r\n      ";
            var htmlFilePath = path_1.join(process.cwd(), 'full', 'path', 'to', 'somepage.html');
            var match = template_2.getTemplateMatch(str);
            var result = template_1.replaceTemplateUrl(match, htmlFilePath, templateContent);
            var expected = "Component({template:/*ion-inline-start:\"" + path_1.join(process.cwd(), 'full', 'path', 'to', 'somepage.html') + "\"*/'\\n        <div>\t\\n          this is \"multiline\" \\'content\\'\\n        </div>\\n\\n      '/*ion-inline-end:\"" + path_1.join(process.cwd(), 'full', 'path', 'to', 'somepage.html') + "\"*/})";
            expect(result).toEqual(expected);
        });
    });
    describe('getTemplateFormat', function () {
        it('should resolve the path', function () {
            var path = 'some/crazy/path/my.html';
            var resolvedPath = path_1.resolve(path);
            var results = template_2.getTemplateFormat(path, 'filibuster');
            expect(path).not.toEqual(resolvedPath);
            expect(results).toEqual("template:/*ion-inline-start:\"" + resolvedPath + "\"*/'filibuster'/*ion-inline-end:\"" + resolvedPath + "\"*/");
        });
    });
    describe('replaceBundleJsTemplate', function () {
        it('should replace already inlined template with new content', function () {
            var htmlFilePath = 'c:\\path/to\some/crazy:thing.html;';
            var oldContent = 'some old content';
            var tmplate = template_2.getTemplateFormat(htmlFilePath, oldContent);
            var bundleSourceText = "\n        @Component({\n          selector: 'yo-div',\n          /*blah*/" + tmplate + "/*derp*/\n        })\n        @Component({\n          selector: 'yo-div2',\n          /*222*/" + tmplate + "/*2222*/\n        })\n      ";
            var newContent = 'some new content';
            var output = template_2.replaceExistingJsTemplate(bundleSourceText, newContent, htmlFilePath);
            expect(output.indexOf(newContent)).toBeGreaterThan(-1);
            expect(output.indexOf(newContent)).toBeGreaterThan(-1);
        });
    });
    describe('COMPONENT_REGEX match', function () {
        it('should get Component with template url and selector above', function () {
            var str = "\n        Component({\n          selector: 'page-home',\n          templateUrl: 'home.html'\n        })\n      ";
            var match = template_2.getTemplateMatch(str);
            expect(match.templateUrl).toEqual('home.html');
        });
        it('should get Component with template url and selector below', function () {
            var str = "\n        Component({\n          templateUrl: 'home.html',\n          selector: 'page-home\n        })\n      ";
            var match = template_2.getTemplateMatch(str);
            expect(match.templateUrl).toEqual('home.html');
        });
        it('should get Component with template url, spaces, tabs and new lines', function () {
            var str = "\t\n\r\n        Component(\n          {\n\n            templateUrl :\n              \t\n\r\"c:\\somewindowspath.ts\"\n\n          }\n        )\n      ";
            var match = template_2.getTemplateMatch(str);
            expect(match.templateUrl).toEqual('c:\\some\windows\path.ts');
        });
        it('should get Component with template url and spaces', function () {
            var str = '  Component  (  {  templateUrl  :  `  hi  `  }  )  ';
            var match = template_2.getTemplateMatch(str);
            expect(match.component).toEqual('Component  (  {  templateUrl  :  `  hi  `  }  )');
            expect(match.templateProperty).toEqual('  templateUrl  :  `  hi  `');
            expect(match.templateUrl).toEqual('hi');
        });
        it('should get Component with template url and back-ticks', function () {
            var str = 'Component({templateUrl:`hi`})';
            var match = template_2.getTemplateMatch(str);
            expect(match.component).toEqual('Component({templateUrl:`hi`})');
            expect(match.templateProperty).toEqual('templateUrl:`hi`');
            expect(match.templateUrl).toEqual('hi');
        });
        it('should get Component with template url and double quotes', function () {
            var str = 'Component({templateUrl:"hi"})';
            var match = template_2.getTemplateMatch(str);
            expect(match.component).toEqual('Component({templateUrl:"hi"})');
            expect(match.templateProperty).toEqual('templateUrl:"hi"');
            expect(match.templateUrl).toEqual('hi');
        });
        it('should get Component with template url and single quotes', function () {
            var str = 'Component({templateUrl:\'hi\'})';
            var match = template_2.getTemplateMatch(str);
            expect(match.component).toEqual('Component({templateUrl:\'hi\'})');
            expect(match.templateProperty).toEqual('templateUrl:\'hi\'');
            expect(match.templateUrl).toEqual('hi');
        });
        it('should get null for Component without string for templateUrl', function () {
            var str = 'Component({templateUrl:someVar})';
            var match = template_2.getTemplateMatch(str);
            expect(match).toEqual(null);
        });
        it('should get null for Component without templateUrl', function () {
            var str = 'Component({template:"hi"})';
            var match = template_2.getTemplateMatch(str);
            expect(match).toEqual(null);
        });
        it('should get null for Component without brackets', function () {
            var str = 'Component()';
            var match = template_2.getTemplateMatch(str);
            expect(match).toEqual(null);
        });
        it('should get null for Component without parentheses', function () {
            var str = 'Component';
            var match = template_2.getTemplateMatch(str);
            expect(match).toEqual(null);
        });
        it('should get null for Component({})', function () {
            var str = 'Component';
            var match = template_2.getTemplateMatch(str);
            expect(match).toEqual(null);
        });
        it('should get null for no Component', function () {
            var str = 'whatever';
            var match = template_2.getTemplateMatch(str);
            expect(match).toEqual(null);
        });
    });
    var oldLoggerError = logger_1.Logger.error;
    logger_1.Logger.error = function () { };
    afterAll(function () {
        logger_1.Logger.error = oldLoggerError;
    });
});
