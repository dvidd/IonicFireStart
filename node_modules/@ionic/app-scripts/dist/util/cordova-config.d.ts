export interface CordovaProject {
    name?: string;
    id?: string;
    version?: string;
}
/**
 * Parse and build a CordovaProject config object by parsing the
 * config.xml file in the project root.
 */
export declare let buildCordovaConfig: (errCb: Function, cb: Function) => void;
export declare let parseConfig: (parsedConfig: any) => CordovaProject;
