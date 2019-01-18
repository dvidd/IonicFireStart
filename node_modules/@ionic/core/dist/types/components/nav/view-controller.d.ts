import { ComponentProps, FrameworkDelegate } from '../../interface';
export declare const VIEW_STATE_NEW = 1;
export declare const VIEW_STATE_ATTACHED = 2;
export declare const VIEW_STATE_DESTROYED = 3;
export declare class ViewController {
    component: any;
    params: ComponentProps | undefined;
    state: number;
    nav?: any;
    element?: HTMLElement;
    delegate?: FrameworkDelegate;
    constructor(component: any, params: ComponentProps | undefined);
    init(container: HTMLElement): Promise<void>;
    /**
     * DOM WRITE
     */
    _destroy(): void;
}
export declare function matches(view: ViewController | undefined, id: string, params: ComponentProps | undefined): view is ViewController;
export declare function convertToView(page: any, params: ComponentProps | undefined): ViewController | null;
export declare function convertToViews(pages: any[]): ViewController[];
