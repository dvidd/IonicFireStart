import { BuildContext, ChangedFile } from './util/interfaces';
export declare function build(context: BuildContext): Promise<void>;
export declare function buildUpdate(changedFiles: ChangedFile[], context: BuildContext): Promise<{}>;
