import { App } from './definitions';
/**
 * Check if we're running in an Angular 1 context. If so,
 * extend the $exceptionHandler to report better errors.
 */
declare const checkIfAngular1: (app: App) => void;
export { checkIfAngular1 };
