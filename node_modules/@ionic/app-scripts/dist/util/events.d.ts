/// <reference types="node" />
import { EventEmitter } from 'events';
export declare function on(eventType: string, listener: {
    (data?: any): void;
}): EventEmitter;
export declare function emit(eventType: string, val?: any): boolean;
export declare const EventType: {
    BuildUpdateCompleted: string;
    BuildUpdateStarted: string;
    FileAdd: string;
    FileChange: string;
    FileDelete: string;
    DirectoryAdd: string;
    DirectoryDelete: string;
    ReloadApp: string;
    WebpackFilesChanged: string;
};
