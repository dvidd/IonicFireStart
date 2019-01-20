import { BuildContext } from '../util/interfaces';
export declare function removeUnusedFonts(context: BuildContext): Promise<any>;
export declare function getFontFileNamesToPurge(target: string, platform: string, fileNames: string[]): string[];
