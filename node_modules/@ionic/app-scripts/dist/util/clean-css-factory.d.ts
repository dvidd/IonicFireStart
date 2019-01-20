import * as cleanCss from 'clean-css';
export declare function getCleanCssInstance(options: cleanCss.Options): cleanCss;
export interface CleanCssConfig {
    sourceFileName: string;
    destFileName: string;
    options?: cleanCss.Options;
}
