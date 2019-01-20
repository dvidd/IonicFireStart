import { Linter, LintResult } from 'tslint';
import { Program, Diagnostic } from 'typescript';
import { BuildContext } from '../util/interfaces';
export interface LinterOptions {
    typeCheck?: boolean;
}
export interface LinterConfig {
    [key: string]: any;
}
/**
 * Lint a file according to config
 * @param {Linter} linter
 * @param {LinterConfig} config
 * @param {string} filePath
 * @param {string} fileContents
 */
export declare function lint(linter: Linter, config: LinterConfig, filePath: string, fileContents: string): void;
/**
 * Get the linter result
 * @param {Linter} linter
 * @return {LintResult}
 */
export declare function getLintResult(linter: Linter): LintResult;
/**
 * Type check a TS program
 * @param {BuildContext} context
 * @param {Program} program
 * @param {LinterOptions} linterOptions
 * @return {Promise<Diagnostic[]>}
 */
export declare function typeCheck(context: BuildContext, program: Program, linterOptions?: LinterOptions): Promise<Diagnostic[]>;
/**
 * Create a TS program based on the BuildContext {rootDir} or TS config file path (if provided)
 * @param {BuildContext} context
 * @param {string} tsConfig
 * @return {Program}
 */
export declare function createProgram(context: BuildContext, tsConfig: string): Program;
/**
 * Get all files that are sourced in TS config
 * @param {BuildContext} context
 * @param {Program} program
 * @return {Array<string>}
 */
export declare function getFileNames(context: BuildContext, program: Program): string[];
/**
 * Get lint configuration
 * @param {string} tsLintConfig
 * @param {LinterOptions} linterOptions
 * @return {Linter}
 */
export declare function getTsLintConfig(tsLintConfig: string, linterOptions?: LinterOptions): LinterConfig;
/**
 * Create a TS linter
 * @param {BuildContext} context
 * @param {Program} program
 * @return {Linter}
 */
export declare function createLinter(context: BuildContext, program: Program): Linter;
