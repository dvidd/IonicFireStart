export declare class BuildError extends Error {
    hasBeenLogged: boolean;
    isFatal: boolean;
    constructor(error: Error | string);
}
export declare class IgnorableError extends Error {
    constructor(msg?: string);
}
