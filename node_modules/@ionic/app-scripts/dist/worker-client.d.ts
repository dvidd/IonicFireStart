import { BuildContext, WorkerProcess } from './util/interfaces';
export declare function runWorker(taskModule: string, taskWorker: string, context: BuildContext, workerConfig: any): Promise<{}>;
export declare function createWorker(taskModule: string): any;
export declare const workers: WorkerProcess[];
