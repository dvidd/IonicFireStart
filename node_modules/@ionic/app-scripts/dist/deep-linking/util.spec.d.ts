import * as ts from 'typescript';
export declare function transformSourceFile(sourceText: string, transformers: ts.TransformerFactory<ts.SourceFile>[]): string;
