import { BuildContext, ChangedFile } from './util/interfaces';
export declare function bundle(context: BuildContext, configFile?: string): Promise<void>;
export declare function bundleUpdate(changedFiles: ChangedFile[], context: BuildContext): Promise<void>;
export declare function buildJsSourceMaps(context: BuildContext): boolean;
export declare function getJsOutputDest(context: BuildContext): string;
