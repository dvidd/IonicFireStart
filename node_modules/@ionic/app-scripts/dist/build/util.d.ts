import { TsConfig } from '../transpile';
import { BuildContext } from '../util/interfaces';
export declare function scanSrcTsFiles(context: BuildContext): Promise<string[]>;
export declare function validateTsConfigSettings(tsConfigFileContents: TsConfig): Promise<{}>;
export declare function validateRequiredFilesExist(context: BuildContext): Promise<[string, TsConfig]>;
export declare function readVersionOfDependencies(context: BuildContext): Promise<void>;
export declare function readPackageVersion(packageDir: string): Promise<any>;
