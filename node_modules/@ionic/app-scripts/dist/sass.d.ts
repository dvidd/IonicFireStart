import { BuildContext, ChangedFile } from './util/interfaces';
export declare function sass(context: BuildContext, configFile?: string): Promise<string>;
export declare function sassUpdate(changedFiles: ChangedFile[], context: BuildContext): Promise<string>;
export declare function sassWorker(context: BuildContext, configFile: string): Promise<string>;
export declare function getSassConfig(context: BuildContext, configFile: string): SassConfig;
export interface SassConfig {
    outputFilename?: string;
    outFile?: string;
    file?: string;
    data?: string;
    includePaths?: string[];
    excludeModules?: string[];
    includeFiles?: RegExp[];
    excludeFiles?: RegExp[];
    directoryMaps?: {
        [key: string]: string;
    };
    sortComponentPathsFn?: (a: any, b: any) => number;
    sortComponentFilesFn?: (a: any, b: any) => number;
    variableSassFiles?: string[];
    autoprefixer?: any;
    sourceMap?: string;
    omitSourceMapUrl?: boolean;
    sourceMapContents?: boolean;
    postCssPlugins?: any[];
}
export interface SassMap {
    version: number;
    file: string;
    sources: string[];
    mappings: string;
    names: any[];
}
