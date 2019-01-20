import { Linter, LintResult, RuleFailure } from 'tslint';
import { Diagnostic, Program } from 'typescript';
import { LinterOptions } from './lint-factory';
import { BuildContext } from '../util/interfaces';
/**
 * Lint files
 * @param {BuildContext} context
 * @param {Program} program
 * @param {string} tsLintConfig - TSLint config file path
 * @param {Array<string>} filePaths
 * @param {LinterOptions} linterOptions
 */
export declare function lintFiles(context: BuildContext, program: Program, tsLintConfig: string, filePaths: string[], linterOptions?: LinterOptions): Promise<void>;
export declare function lintFile(linter: Linter, config: any, filePath: string): Promise<void>;
/**
 * Process typescript diagnostics after type checking
 * NOTE: This will throw a BuildError if there were any type errors.
 * @param {BuildContext} context
 * @param {Array<Diagnostic>} tsDiagnostics
 */
export declare function processTypeCheckDiagnostics(context: BuildContext, tsDiagnostics: Diagnostic[]): void;
/**
 * Process lint results
 * NOTE: This will throw a BuildError if there were any warnings or errors in any of the lint results.
 * @param {BuildContext} context
 * @param {LintResult} result
 */
export declare function processLintResult(context: BuildContext, result: LintResult): void;
export declare function generateErrorMessageForFiles(failingFiles: string[], message?: string): string;
export declare function getFileNames(context: BuildContext, failures: RuleFailure[]): string[];
export declare function removeDuplicateFileNames(fileNames: string[]): string[];
