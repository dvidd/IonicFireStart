import { RuleFailure } from 'tslint';
import { BuildContext, Diagnostic } from '../util/interfaces';
export declare function runTsLintDiagnostics(context: BuildContext, failures: RuleFailure[]): Diagnostic[];
export declare function loadDiagnostic(context: BuildContext, failure: RuleFailure): Diagnostic;
