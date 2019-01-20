export declare function generateGlobTasks(patterns: string[], opts: any): GlobObject[];
export declare function globAll(globs: string[]): Promise<GlobResult[]>;
export declare function getBasePath(pattern: string): string;
export interface GlobObject {
    pattern: string;
    opts: GlobOptions;
    base: string;
}
export interface GlobResult {
    absolutePath: string;
    base: string;
}
export interface GlobOptions {
    ignore: string[];
}
export declare const DEFAULT_IGNORE_ARRAY: string[];
