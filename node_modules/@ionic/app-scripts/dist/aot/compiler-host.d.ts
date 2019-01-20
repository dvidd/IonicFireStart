import { CancellationToken, CompilerHost, CompilerOptions, ScriptTarget, SourceFile } from 'typescript';
import { VirtualFileSystem } from '../util/interfaces';
export interface OnErrorFn {
    (message: string): void;
}
export declare class InMemoryCompilerHost implements CompilerHost {
    private options;
    private fileSystem;
    private setParentNodes;
    private sourceFileMap;
    private diskCompilerHost;
    constructor(options: CompilerOptions, fileSystem: VirtualFileSystem, setParentNodes?: boolean);
    fileExists(filePath: string): boolean;
    readFile(filePath: string): string;
    directoryExists(directoryPath: string): boolean;
    getFiles(directoryPath: string): string[];
    getDirectories(directoryPath: string): string[];
    getSourceFile(filePath: string, languageVersion: ScriptTarget, onError?: OnErrorFn): SourceFile;
    getCancellationToken(): CancellationToken;
    getDefaultLibFileName(options: CompilerOptions): string;
    writeFile(fileName: string, data: string, writeByteOrderMark: boolean, onError?: OnErrorFn): void;
    getCurrentDirectory(): string;
    getCanonicalFileName(fileName: string): string;
    useCaseSensitiveFileNames(): boolean;
    getNewLine(): string;
}
