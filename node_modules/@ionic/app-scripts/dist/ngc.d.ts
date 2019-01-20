import { BuildContext } from './util/interfaces';
export declare function ngc(context: BuildContext, configFile?: string): Promise<void>;
export declare function ngcWorker(context: BuildContext, configFile: string): Promise<any>;
export declare function runNgc(context: BuildContext, configFile: string): Promise<any>;
export declare function transformTsForDeepLinking(context: BuildContext): Promise<void>;
