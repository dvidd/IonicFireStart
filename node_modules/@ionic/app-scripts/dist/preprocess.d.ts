import { BuildContext, ChangedFile } from './util/interfaces';
export declare function preprocess(context: BuildContext): Promise<void>;
export declare function preprocessUpdate(changedFiles: ChangedFile[], context: BuildContext): Promise<any[]>;
