import { File } from './interfaces';
export declare class FileCache {
    private map;
    constructor();
    set(key: string, file: File): void;
    get(key: string): File;
    has(key: string): boolean;
    remove(key: string): Boolean;
    getAll(): File[];
    getRawStore(): Map<string, File>;
}
