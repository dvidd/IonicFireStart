import { QueueApi } from '../../stencil.core';
import { Animation, NavOptions } from '../../interface';
export declare function transition(opts: TransitionOptions): Promise<TransitionResult>;
export declare function lifecycle(el: HTMLElement | undefined, eventName: string): void;
export declare function deepReady(el: any | undefined): Promise<void>;
export declare function setPageHidden(el: HTMLElement, hidden: boolean): void;
export interface TransitionOptions extends NavOptions {
    queue: QueueApi;
    progressCallback?: ((ani: Animation | undefined) => void);
    window: Window;
    baseEl: any;
    enteringEl: HTMLElement;
    leavingEl: HTMLElement | undefined;
}
export interface TransitionResult {
    hasCompleted: boolean;
    animation?: Animation;
}
