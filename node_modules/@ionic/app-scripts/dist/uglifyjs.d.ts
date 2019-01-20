import { BuildContext, TaskInfo } from './util/interfaces';
export declare function uglifyjs(context: BuildContext, configFile?: string): Promise<void>;
export declare function uglifyjsWorker(context: BuildContext, configFile: string): Promise<any>;
export declare function uglifyjsWorkerImpl(context: BuildContext, uglifyJsConfig: UglifyJsConfig): Promise<any[]>;
export declare const taskInfo: TaskInfo;
export interface UglifyJsConfig {
    sourceFile?: string;
    destFileName?: string;
    inSourceMap?: string;
    outSourceMap?: string;
    mangle?: boolean;
    compress?: boolean;
    comments?: boolean;
}
export interface UglifyResponse {
    code?: string;
    map?: any;
}
