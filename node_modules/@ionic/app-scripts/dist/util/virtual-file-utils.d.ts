export declare class VirtualStats {
    protected _path: string;
    protected _ctime: Date;
    protected _mtime: Date;
    protected _atime: Date;
    protected _btime: Date;
    protected _dev: number;
    protected _ino: number;
    protected _mode: number;
    protected _uid: number;
    protected _gid: number;
    constructor(_path: string);
    isFile(): boolean;
    isDirectory(): boolean;
    isBlockDevice(): boolean;
    isCharacterDevice(): boolean;
    isSymbolicLink(): boolean;
    isFIFO(): boolean;
    isSocket(): boolean;
    readonly dev: number;
    readonly ino: number;
    readonly mode: number;
    readonly nlink: number;
    readonly uid: number;
    readonly gid: number;
    readonly rdev: number;
    readonly size: number;
    readonly blksize: number;
    readonly blocks: number;
    readonly atime: Date;
    readonly mtime: Date;
    readonly ctime: Date;
    readonly birthtime: Date;
}
export declare class VirtualDirStats extends VirtualStats {
    constructor(_fileName: string);
    isDirectory(): boolean;
    readonly size: number;
}
export declare class VirtualFileStats extends VirtualStats {
    private _content;
    constructor(_fileName: string, _content: string);
    content: string;
    isFile(): boolean;
    readonly size: number;
}
