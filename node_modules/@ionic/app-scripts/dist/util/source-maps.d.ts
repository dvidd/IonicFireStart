import { BuildContext } from './interfaces';
export declare function copySourcemaps(context: BuildContext, shouldPurge: boolean): Promise<any[]>;
export declare function purgeSourceMapsIfNeeded(context: BuildContext): Promise<any>;
