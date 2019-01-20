import { Diagnostic } from '../util/interfaces';
export declare function generateRuntimeDiagnosticContent(rootDir: string, buildDir: string, runtimeErrorMessage: string, runtimeErrorStack: string): string;
export declare function generateRuntimeStackDiagnostics(rootDir: string, stack: string): Diagnostic[];
