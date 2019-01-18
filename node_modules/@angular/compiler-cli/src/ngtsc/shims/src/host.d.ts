/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/compiler-cli/src/ngtsc/shims/src/host" />
import * as ts from 'typescript';
export interface ShimGenerator {
    /**
     * Get the original source file for the given shim path, the contents of which determine the
     * contents of the shim file.
     *
     * If this returns `null` then the given file was not a shim file handled by this generator.
     */
    getOriginalSourceOfShim(fileName: string): string | null;
    /**
     * Generate a shim's `ts.SourceFile` for the given original file.
     */
    generate(original: ts.SourceFile, genFileName: string): ts.SourceFile;
}
/**
 * A wrapper around a `ts.CompilerHost` which supports generated files.
 */
export declare class GeneratedShimsHostWrapper implements ts.CompilerHost {
    private delegate;
    private shimGenerators;
    constructor(delegate: ts.CompilerHost, shimGenerators: ShimGenerator[]);
    resolveTypeReferenceDirectives?: (names: string[], containingFile: string) => ts.ResolvedTypeReferenceDirective[];
    getSourceFile(fileName: string, languageVersion: ts.ScriptTarget, onError?: ((message: string) => void) | undefined, shouldCreateNewSourceFile?: boolean | undefined): ts.SourceFile | undefined;
    getDefaultLibFileName(options: ts.CompilerOptions): string;
    writeFile(fileName: string, data: string, writeByteOrderMark: boolean, onError: ((message: string) => void) | undefined, sourceFiles: ReadonlyArray<ts.SourceFile>): void;
    getCurrentDirectory(): string;
    getDirectories(path: string): string[];
    getCanonicalFileName(fileName: string): string;
    useCaseSensitiveFileNames(): boolean;
    getNewLine(): string;
    fileExists(fileName: string): boolean;
    readFile(fileName: string): string | undefined;
}
