import { BuildContext, ChangedFile, TaskInfo } from './util/interfaces';
import { Watcher } from './watch';
export declare function copy(context: BuildContext, configFile?: string): Promise<void>;
export declare function copyWorker(context: BuildContext, configFile: string): Promise<void[]>;
export declare function copyUpdate(changedFiles: ChangedFile[], context: BuildContext): Promise<void>;
export declare function copyConfigToWatchConfig(context: BuildContext): Watcher;
export interface CopySrcToDestResult {
    success: boolean;
    src: string;
    dest: string;
    errorMessage: string;
}
export declare const taskInfo: TaskInfo;
export interface CopyConfig {
    [index: string]: CopyOptions;
}
export interface CopyToFrom {
    absoluteSourcePath: string;
    absoluteDestPath: string;
}
export interface CopyOptions {
    src: string[];
    dest: string;
}
