import { BuildContext, TaskInfo } from './interfaces';
/**
 * Create a context object which is used by all the build tasks.
 * Filling the config data uses the following hierarchy, which will
 * keep going down the list until it, or if it, finds data.
 *
 * 1) Get from the passed in context variable
 * 2) Get from the config file set using the command-line args
 * 3) Get from environment variable
 * 4) Get from package.json config property
 * 5) Get environment variables
 *
 * Lastly, Ionic's default configs will always fill in any data
 * which is missing from the user's data.
 */
export declare function generateContext(context?: BuildContext): BuildContext;
export declare function getUserConfigFile(context: BuildContext, task: TaskInfo, userConfigFile: string): string;
export declare function fillConfigDefaults(userConfigFile: string, defaultConfigFile: string): any;
export declare function bundlerStrategy(context: BuildContext): string;
export declare function getConfigValue(context: BuildContext, argFullName: string, argShortName: string, envVarName: string, packageConfigProp: string, defaultValue: string): any;
export declare function hasConfigValue(context: BuildContext, argFullName: string, argShortName: string, envVarName: string, defaultValue: boolean): boolean;
export declare function hasArg(fullName: string, shortName?: string): boolean;
export declare function replacePathVars(context: BuildContext, filePath: string | string[] | {
    [key: string]: any;
}): any;
export declare function getNodeBinExecutable(context: BuildContext, cmd: string): string;
export declare function isDebugMode(): boolean;
export declare function setProcessArgs(argv: string[]): void;
export declare function addArgv(value: string): void;
export declare function setProcessEnv(env: any): void;
export declare function setProcessEnvVar(key: string, value: any): void;
export declare function getProcessEnvVar(key: string): any;
export declare function setCwd(cwd: string): void;
export declare function getPackageJsonConfig(context: BuildContext, key: string): any;
export declare function setAppPackageJsonData(data: any): void;
