import { BuildContext, ChangedFile } from './util/interfaces';
export declare function webpack(context: BuildContext, configFile: string): Promise<void>;
export declare function webpackUpdate(changedFiles: ChangedFile[], context: BuildContext, configFile?: string): Promise<void>;
export declare function webpackWorker(context: BuildContext, configFile: string): Promise<any>;
export declare function setBundledFiles(context: BuildContext): void;
export declare function runWebpackFullBuild(config: WebpackConfig): Promise<{}>;
export declare function getWebpackConfig(context: BuildContext, configFile: string): WebpackConfig;
export declare function getWebpackConfigFromDictionary(context: BuildContext, webpackConfigDictionary: any): WebpackConfig;
export declare function getOutputDest(context: BuildContext): string;
export interface WebpackConfig {
    devtool: string;
    entry: string | {
        [key: string]: any;
    };
    output: WebpackOutputObject;
    resolve: WebpackResolveObject;
}
export interface WebpackOutputObject {
    path: string;
    filename: string;
}
export interface WebpackResolveObject {
    extensions: string[];
    modules: string[];
}
