import { BuildContext } from './util/interfaces';
import { getNgModules, GeneratorOption, GeneratorRequest } from './generators/util';
export { getNgModules, GeneratorOption, GeneratorRequest };
export declare function processPageRequest(context: BuildContext, name: string, commandOptions?: {
    module?: boolean;
    constants?: boolean;
}): Promise<string[]>;
export declare function processPipeRequest(context: BuildContext, name: string, ngModulePath: string): Promise<void>;
export declare function processDirectiveRequest(context: BuildContext, name: string, ngModulePath: string): Promise<void>;
export declare function processComponentRequest(context: BuildContext, name: string, ngModulePath: string): Promise<void>;
export declare function processProviderRequest(context: BuildContext, name: string, ngModulePath: string): Promise<void>;
export declare function processTabsRequest(context: BuildContext, name: string, tabs: any[], commandOptions?: {
    module?: boolean;
    constants?: boolean;
}): Promise<void>;
export declare function listOptions(): GeneratorOption[];
