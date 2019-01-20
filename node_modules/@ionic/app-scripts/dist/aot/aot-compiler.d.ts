import 'reflect-metadata';
import { CompilerHost, CompilerOptions } from 'typescript';
import { HybridFileSystem } from '../util/hybrid-file-system';
import { TsConfig } from '../transpile';
import { BuildContext, CodegenOptions, SemverVersion } from '../util/interfaces';
export declare function runAot(context: BuildContext, options: AotOptions): Promise<void>;
export declare function isTranspileRequired(angularVersion: SemverVersion): boolean;
export declare function transpileFiles(context: BuildContext, tsConfig: TsConfig, fileSystem: HybridFileSystem): void;
export declare function isNg5(version: SemverVersion): boolean;
export declare function runNg4Aot(options: CodegenOptions): Promise<any>;
export declare function runNg5Aot(context: BuildContext, tsConfig: TsConfig, aggregateCompilerOptions: CompilerOptions, compilerHost: CompilerHost): Promise<void>;
export interface AotOptions {
    tsConfigPath: string;
    rootDir: string;
    entryPoint: string;
    appNgModulePath: string;
    appNgModuleClass: string;
}
