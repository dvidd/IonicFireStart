import { FileCache } from '../util/file-cache';
export declare class WatchMemorySystem {
    private fileCache;
    private srcDir;
    private changes;
    private isAggregating;
    private isListening;
    private lastWatchEventTimestamp;
    private filePathsBeingWatched;
    private dirPaths;
    private missing;
    private startTime;
    private options;
    private immediateCallback;
    private aggregatedCallback;
    constructor(fileCache: FileCache, srcDir: string);
    close(): void;
    pause(): void;
    watch(filePathsBeingWatched: string[], dirPaths: string[], missing: string[], startTime: number, options: any, aggregatedCallback: (err: Error, changesFilePaths: string[]) => void, immediateCallback: (filePath: string, timestamp: number) => void): {
        pause: () => void;
        close: () => void;
    };
    startListening(): void;
    processChanges(filePaths: string[]): void;
    doneAggregating(changes: Set<string>): void;
    getTimes(allFiles: string[], startTime: number, fileCache: FileCache): any;
}
