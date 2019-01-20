/// <reference types="node" />
import { FileSystem, VirtualFileSystem } from './interfaces';
import { FileCache } from './file-cache';
import { VirtualDirStats, VirtualFileStats } from './virtual-file-utils';
export declare class HybridFileSystem implements FileSystem, VirtualFileSystem {
    private fileCache;
    private filesStats;
    private directoryStats;
    private inputFileSystem;
    private outputFileSystem;
    private writeToDisk;
    constructor(fileCache: FileCache);
    setInputFileSystem(fs: FileSystem): void;
    setOutputFileSystem(fs: FileSystem): void;
    setWriteToDisk(write: boolean): void;
    isSync(): boolean;
    stat(path: string, callback: Function): any;
    readdir(path: string, callback: Function): any;
    readJson(path: string, callback: Function): any;
    readlink(path: string, callback: Function): any;
    purge(pathsToPurge: string[]): void;
    readFile(path: string, callback: Function): any;
    addVirtualFile(filePath: string, fileContent: string): void;
    getFileContent(filePath: string): string;
    getDirectoryStats(path: string): VirtualDirStats;
    getSubDirs(directoryPath: string): string[];
    getFileNamesInDirectory(directoryPath: string): string[];
    getAllFileStats(): {
        [filePath: string]: VirtualFileStats;
    };
    getAllDirStats(): {
        [filePath: string]: VirtualDirStats;
    };
    mkdirp(filePath: string, callback: Function): void;
    mkdir(filePath: string, callback: Function): void;
    rmdir(filePath: string, callback: Function): void;
    unlink(filePath: string, callback: Function): void;
    join(dirPath: string, fileName: string): string;
    writeFile(filePath: string, fileContent: Buffer, callback: Function): void;
}
