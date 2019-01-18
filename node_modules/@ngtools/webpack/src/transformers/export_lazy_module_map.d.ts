import * as ts from 'typescript';
export interface LazyRouteMap {
    [path: string]: string;
}
export declare function exportLazyModuleMap(shouldTransform: (fileName: string) => boolean, lazyRoutesCb: () => LazyRouteMap): ts.TransformerFactory<ts.SourceFile>;
