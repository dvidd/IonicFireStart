import { AbstractControl } from '@angular/forms';
export declare type ErrorOptions = string | string[];
export interface ErrorDetails {
    control: AbstractControl;
    errorName: string;
}
