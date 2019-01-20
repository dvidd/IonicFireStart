import { BuildContext, ChangedFile } from './util/interfaces';
export interface LintWorkerConfig {
    tsConfig: string;
    tsLintConfig: string | null;
    filePaths?: string[];
    typeCheck?: boolean;
}
export declare function lint(context: BuildContext, tsLintConfig?: string | null, typeCheck?: boolean): Promise<void>;
export declare function lintWorker(context: BuildContext, {tsConfig, tsLintConfig, typeCheck}: LintWorkerConfig): Promise<void>;
export declare function lintUpdate(changedFiles: ChangedFile[], context: BuildContext, typeCheck?: boolean): Promise<{}>;
export declare function lintUpdateWorker(context: BuildContext, {tsConfig, tsLintConfig, filePaths, typeCheck}: LintWorkerConfig): Promise<void>;
