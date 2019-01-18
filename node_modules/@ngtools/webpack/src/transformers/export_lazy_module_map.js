"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const path = require("path");
const ts = require("typescript");
const ast_helpers_1 = require("./ast_helpers");
const interfaces_1 = require("./interfaces");
const make_transform_1 = require("./make_transform");
function exportLazyModuleMap(shouldTransform, lazyRoutesCb) {
    const standardTransform = function (sourceFile) {
        const ops = [];
        const lazyRoutes = lazyRoutesCb();
        if (!shouldTransform(sourceFile.fileName)) {
            return ops;
        }
        const dirName = path.normalize(path.dirname(sourceFile.fileName));
        const modules = Object.keys(lazyRoutes)
            .map((loadChildrenString) => {
            const [, moduleName] = loadChildrenString.split('#');
            const modulePath = lazyRoutes[loadChildrenString];
            return {
                modulePath,
                moduleName,
                loadChildrenString,
            };
        });
        modules.forEach((module, index) => {
            const modulePath = module.modulePath;
            if (!modulePath) {
                return;
            }
            let relativePath = path.relative(dirName, modulePath).replace(/\\/g, '/');
            if (!(relativePath.startsWith('./') || relativePath.startsWith('../'))) {
                // 'a/b/c' is a relative path for Node but an absolute path for TS, so we must convert it.
                relativePath = `./${relativePath}`;
            }
            // Create the new namespace import node.
            const namespaceImport = ts.createNamespaceImport(ts.createIdentifier(`__lazy_${index}__`));
            const importClause = ts.createImportClause(undefined, namespaceImport);
            const newImport = ts.createImportDeclaration(undefined, undefined, importClause, ts.createLiteral(relativePath));
            const firstNode = ast_helpers_1.getFirstNode(sourceFile);
            if (firstNode) {
                ops.push(new interfaces_1.AddNodeOperation(sourceFile, firstNode, newImport));
            }
        });
        const lazyModuleObjectLiteral = ts.createObjectLiteral(modules.map((mod, idx) => {
            let [modulePath, moduleName] = mod.loadChildrenString.split('#');
            if (modulePath.match(/\.ngfactory/)) {
                modulePath = modulePath.replace('.ngfactory', '');
                moduleName = moduleName.replace('NgFactory', '');
            }
            return ts.createPropertyAssignment(ts.createLiteral(`${modulePath}#${moduleName}`), ts.createPropertyAccess(ts.createIdentifier(`__lazy_${idx}__`), mod.moduleName));
        }));
        const lazyModuleVariableStmt = ts.createVariableStatement([ts.createToken(ts.SyntaxKind.ExportKeyword)], [ts.createVariableDeclaration('LAZY_MODULE_MAP', undefined, lazyModuleObjectLiteral)]);
        const lastNode = ast_helpers_1.getLastNode(sourceFile);
        if (lastNode) {
            ops.push(new interfaces_1.AddNodeOperation(sourceFile, lastNode, undefined, lazyModuleVariableStmt));
        }
        return ops;
    };
    return make_transform_1.makeTransform(standardTransform);
}
exports.exportLazyModuleMap = exportLazyModuleMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwb3J0X2xhenlfbW9kdWxlX21hcC5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvbmd0b29scy93ZWJwYWNrL3NyYy90cmFuc2Zvcm1lcnMvZXhwb3J0X2xhenlfbW9kdWxlX21hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILDZCQUE2QjtBQUM3QixpQ0FBaUM7QUFDakMsK0NBQTBEO0FBQzFELDZDQUF1RjtBQUN2RixxREFBaUQ7QUFNakQsU0FBZ0IsbUJBQW1CLENBQ2pDLGVBQThDLEVBQzlDLFlBQWdDO0lBR2hDLE1BQU0saUJBQWlCLEdBQXNCLFVBQVUsVUFBeUI7UUFDOUUsTUFBTSxHQUFHLEdBQXlCLEVBQUUsQ0FBQztRQUVyQyxNQUFNLFVBQVUsR0FBRyxZQUFZLEVBQUUsQ0FBQztRQUVsQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUN6QyxPQUFPLEdBQUcsQ0FBQztTQUNaO1FBRUQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBRWxFLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2FBQ3BDLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLEVBQUU7WUFDMUIsTUFBTSxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JELE1BQU0sVUFBVSxHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBRWxELE9BQU87Z0JBQ0wsVUFBVTtnQkFDVixVQUFVO2dCQUNWLGtCQUFrQjthQUNuQixDQUFDO1FBQ0osQ0FBQyxDQUFDLENBQUM7UUFFTCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEtBQUssRUFB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Q0FBQyxDQUFDO0FBQzFDLENBQUM7QUEvRUQsa0RBK0VDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIHRzIGZyb20gJ3R5cGVzY3JpcHQnO1xuaW1wb3J0IHsgZ2V0Rmlyc3ROb2RlLCBnZXRMYXN0Tm9kZSB9IGZyb20gJy4vYXN0X2hlbHBlcnMnO1xuaW1wb3J0IHsgQWRkTm9kZU9wZXJhdGlvbiwgU3RhbmRhcmRUcmFuc2Zvcm0sIFRyYW5zZm9ybU9wZXJhdGlvbiB9IGZyb20gJy4vaW50ZXJmYWNlcyc7XG5pbXBvcnQgeyBtYWtlVHJhbnNmb3JtIH0gZnJvbSAnLi9tYWtlX3RyYW5zZm9ybSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGF6eVJvdXRlTWFwIHtcbiAgW3BhdGg6IHN0cmluZ106IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4cG9ydExhenlNb2R1bGVNYXAoXG4gIHNob3VsZFRyYW5zZm9ybTogKGZpbGVOYW1lOiBzdHJpbmcpID0+IGJvb2xlYW4sXG4gIGxhenlSb3V0ZXNDYjogKCkgPT4gTGF6eVJvdXRlTWFwLFxuKTogdHMuVHJhbnNmb3JtZXJGYWN0b3J5PHRzLlNvdXJjZUZpbGU+IHtcblxuICBjb25zdCBzdGFuZGFyZFRyYW5zZm9ybTogU3RhbmRhcmRUcmFuc2Zvcm0gPSBmdW5jdGlvbiAoc291cmNlRmlsZTogdHMuU291cmNlRmlsZSkge1xuICAgIGNvbnN0IG9wczogVHJhbnNmb3JtT3BlcmF0aW9uW10gPSBbXTtcblxuICAgIGNvbnN0IGxhenlSb3V0ZXMgPSBsYXp5Um91dGVzQ2IoKTtcblxuICAgIGlmICghc2hvdWxkVHJhbnNmb3JtKHNvdXJjZUZpbGUuZmlsZU5hbWUpKSB7XG4gICAgICByZXR1cm4gb3BzO1xuICAgIH1cblxuICAgIGNvbnN0IGRpck5hbWUgPSBwYXRoLm5vcm1hbGl6ZShwYXRoLmRpcm5hbWUoc291cmNlRmlsZS5maWxlTmFtZSkpO1xuXG4gICAgY29uc3QgbW9kdWxlcyA9IE9iamVjdC5rZXlzKGxhenlSb3V0ZXMpXG4gICAgICAubWFwKChsb2FkQ2hpbGRyZW5TdHJpbmcpID0+IHtcbiAgICAgICAgY29uc3QgWywgbW9kdWxlTmFtZV0gPSBsb2FkQ2hpbGRyZW5TdHJpbmcuc3BsaXQoJyMnKTtcbiAgICAgICAgY29uc3QgbW9kdWxlUGF0aCA9IGxhenlSb3V0ZXNbbG9hZENoaWxkcmVuU3RyaW5nXTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG1vZHVsZVBhdGgsXG4gICAgICAgICAgbW9kdWxlTmFtZSxcbiAgICAgICAgICBsb2FkQ2hpbGRyZW5TdHJpbmcsXG4gICAgICAgIH07XG4gICAgICB9KTtcblxuICAgIG1vZHVsZXMuZm9yRWFjaCgobW9kdWxlLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgbW9kdWxlUGF0aCA9IG1vZHVsZS5tb2R1bGVQYXRoO1xuICAgICAgaWYgKCFtb2R1bGVQYXRoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IHJlbGF0aXZlUGF0aCA9IHBhdGgucmVsYXRpdmUoZGlyTmFtZSwgbW9kdWxlUGF0aCkucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuICAgICAgaWYgKCEocmVsYXRpdmVQYXRoLnN0YXJ0c1dpdGgoJy4vJykgfHwgcmVsYXRpdmVQYXRoLnN0YXJ0c1dpdGgoJy4uLycpKSkge1xuICAgICAgICAvLyAnYS9iL2MnIGlzIGEgcmVsYXRpdmUgcGF0aCBmb3IgTm9kZSBidXQgYW4gYWJzb2x1dGUgcGF0aCBmb3IgVFMsIHNvIHdlIG11c3QgY29udmVydCBpdC5cbiAgICAgICAgcmVsYXRpdmVQYXRoID0gYC4vJHtyZWxhdGl2ZVBhdGh9YDtcbiAgICAgIH1cbiAgICAgIC8vIENyZWF0ZSB0aGUgbmV3IG5hbWVzcGFjZSBpbXBvcnQgbm9kZS5cbiAgICAgIGNvbnN0IG5hbWVzcGFjZUltcG9ydCA9IHRzLmNyZWF0ZU5hbWVzcGFjZUltcG9ydCh0cy5jcmVhdGVJZGVudGlmaWVyKGBfX2xhenlfJHtpbmRleH1fX2ApKTtcbiAgICAgIGNvbnN0IGltcG9ydENsYXVzZSA9IHRzLmNyZWF0ZUltcG9ydENsYXVzZSh1bmRlZmluZWQsIG5hbWVzcGFjZUltcG9ydCk7XG4gICAgICBjb25zdCBuZXdJbXBvcnQgPSB0cy5jcmVhdGVJbXBvcnREZWNsYXJhdGlvbih1bmRlZmluZWQsIHVuZGVmaW5lZCwgaW1wb3J0Q2xhdXNlLFxuICAgICAgICB0cy5jcmVhdGVMaXRlcmFsKHJlbGF0aXZlUGF0aCkpO1xuXG4gICAgICBjb25zdCBmaXJzdE5vZGUgPSBnZXRGaXJzdE5vZGUoc291cmNlRmlsZSk7XG4gICAgICBpZiAoZmlyc3ROb2RlKSB7XG4gICAgICAgIG9wcy5wdXNoKG5ldyBBZGROb2RlT3BlcmF0aW9uKHNvdXJjZUZpbGUsIGZpcnN0Tm9kZSwgbmV3SW1wb3J0KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBsYXp5TW9kdWxlT2JqZWN0TGl0ZXJhbCA9IHRzLmNyZWF0ZU9iamVjdExpdGVyYWwoXG4gICAgICBtb2R1bGVzLm1hcCgobW9kLCBpZHgpID0+IHtcbiAgICAgICAgbGV0IFttb2R1bGVQYXRoLCBtb2R1bGVOYW1lXSA9IG1vZC5sb2FkQ2hpbGRyZW5TdHJpbmcuc3BsaXQoJyMnKTtcbiAgICAgICAgaWYgKG1vZHVsZVBhdGgubWF0Y2goL1xcLm5nZmFjdG9yeS8pKSB7XG4gICAgICAgICAgbW9kdWxlUGF0aCA9IG1vZHVsZVBhdGgucmVwbGFjZSgnLm5nZmFjdG9yeScsICcnKTtcbiAgICAgICAgICBtb2R1bGVOYW1lID0gbW9kdWxlTmFtZS5yZXBsYWNlKCdOZ0ZhY3RvcnknLCAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHMuY3JlYXRlUHJvcGVydHlBc3NpZ25tZW50KFxuICAgICAgICAgIHRzLmNyZWF0ZUxpdGVyYWwoYCR7bW9kdWxlUGF0aH0jJHttb2R1bGVOYW1lfWApLFxuICAgICAgICAgIHRzLmNyZWF0ZVByb3BlcnR5QWNjZXNzKHRzLmNyZWF0ZUlkZW50aWZpZXIoYF9fbGF6eV8ke2lkeH1fX2ApLCBtb2QubW9kdWxlTmFtZSkpO1xuICAgICAgfSksXG4gICAgKTtcblxuICAgIGNvbnN0IGxhenlNb2R1bGVWYXJpYWJsZVN0bXQgPSB0cy5jcmVhdGVWYXJpYWJsZVN0YXRlbWVudChcbiAgICAgIFt0cy5jcmVhdGVUb2tlbih0cy5TeW50YXhLaW5kLkV4cG9ydEtleXdvcmQpXSxcbiAgICAgIFt0cy5jcmVhdGVWYXJpYWJsZURlY2xhcmF0aW9uKCdMQVpZX01PRFVMRV9NQVAnLCB1bmRlZmluZWQsIGxhenlNb2R1bGVPYmplY3RMaXRlcmFsKV0sXG4gICAgKTtcblxuICAgIGNvbnN0IGxhc3ROb2RlID0gZ2V0TGFzdE5vZGUoc291cmNlRmlsZSk7XG4gICAgaWYgKGxhc3ROb2RlKSB7XG4gICAgICBvcHMucHVzaChuZXcgQWRkTm9kZU9wZXJhdGlvbihzb3VyY2VGaWxlLCBsYXN0Tm9kZSwgdW5kZWZpbmVkLCBsYXp5TW9kdWxlVmFyaWFibGVTdG10KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9wcztcbiAgfTtcblxuICByZXR1cm4gbWFrZVRyYW5zZm9ybShzdGFuZGFyZFRyYW5zZm9ybSk7XG59XG4iXX0=