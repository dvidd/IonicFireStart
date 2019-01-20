export declare class Logger {
    private start;
    private scope;
    constructor(scope: string);
    ready(color?: string, bold?: boolean): void;
    finish(color?: string, bold?: boolean): void;
    private completed(type, color, bold);
    fail(err: Error): Error;
    setStartTime(startTime: number): void;
    /**
     * Does not print out a time prefix or color any text. Only prefix
     * with whitespace so the message is lined up with timestamped logs.
     */
    static log(...msg: any[]): void;
    /**
     * Prints out a dim colored timestamp prefix, with optional color
     * and bold message.
     */
    static info(msg: string, color?: string, bold?: boolean): void;
    /**
     * Prints out a yellow colored timestamp prefix.
     */
    static warn(...msg: any[]): void;
    /**
     * Prints out a error colored timestamp prefix.
     */
    static error(...msg: any[]): void;
    static unformattedError(msg: string): void;
    static unformattedDebug(msg: string): void;
    /**
     * Prints out a blue colored DEBUG prefix. Only prints out when debug mode.
     */
    static debug(...msg: any[]): void;
    static wordWrap(msg: any[]): string[];
    static formatFileName(rootDir: string, fileName: string): string;
    static formatHeader(type: string, fileName: string, rootDir: string, startLineNumber?: number, endLineNumber?: number): string;
    static newLine(): void;
    static INDENT: string;
    static MAX_LEN: number;
}
