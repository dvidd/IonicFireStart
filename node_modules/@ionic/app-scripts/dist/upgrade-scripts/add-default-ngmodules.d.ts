import { FileCache } from '../util/file-cache';
import { BuildContext } from '../util/interfaces';
export declare function getTsFilePaths(context: BuildContext): Promise<string[]>;
export declare function readTsFiles(context: BuildContext, tsFilePaths: string[]): Promise<string[]>;
export declare function generateAndWriteNgModules(fileCache: FileCache): void;
