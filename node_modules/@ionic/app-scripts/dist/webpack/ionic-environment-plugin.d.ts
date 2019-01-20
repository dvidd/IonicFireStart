import { BuildContext, DeepLinkConfigEntry } from '../util/interfaces';
export declare class IonicEnvironmentPlugin {
    private context;
    private writeToDisk;
    constructor(context: BuildContext, writeToDisk: boolean);
    apply(compiler: any): void;
    private initializeWebpackFileSystemCaches(webpackFileSystem);
}
export declare function convertDeepLinkConfigToWebpackFormat(parsedDeepLinkConfigs: Map<string, DeepLinkConfigEntry>): {
    [index: string]: string;
};
