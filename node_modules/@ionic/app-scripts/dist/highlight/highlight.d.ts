export declare function highlightError(htmlInput: string, errorCharStart: number, errorLength: number): string;
export declare function highlight(name: string, value: string, ignore_illegals?: boolean, continuation?: any): {
    value: string;
    relevance: number;
    language?: string;
    top?: any;
};
