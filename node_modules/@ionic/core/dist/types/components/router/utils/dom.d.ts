import { NavOutletElement, RouteChain, RouteID, RouterDirection } from '../../../interface';
export declare function writeNavState(root: HTMLElement | undefined, chain: RouteChain, direction: RouterDirection, index: number, changed?: boolean): Promise<boolean>;
export declare function readNavState(root: HTMLElement | undefined): Promise<{
    ids: RouteID[];
    outlet: NavOutletElement | undefined;
}>;
export declare function waitUntilNavNode(win: Window): Promise<void> | Promise<{}>;
