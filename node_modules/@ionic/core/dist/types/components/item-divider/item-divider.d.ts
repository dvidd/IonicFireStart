import '../../stencil.core';
import { ComponentInterface } from '../../stencil.core';
import { Color, Mode } from '../../interface';
export declare class ItemDivider implements ComponentInterface {
    el: HTMLElement;
    /**
     * The color to use from your application's color palette.
     * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
     * For more information on colors, see [theming](/docs/theming/basics).
     */
    color?: Color;
    /**
     * The mode determines which platform styles to use.
     */
    mode: Mode;
    /**
     * When it's set to `true`, the item-divider will stay visible when it reaches the top
     * of the viewport until the next `ion-item-divider` replaces it.
     *
     * This feature relies in `position:sticky`:
     * https://caniuse.com/#feat=css-sticky
     */
    sticky: boolean;
    componentDidLoad(): void;
    hostData(): {
        class: {
            'item-divider-sticky': boolean;
            'item': boolean;
        } | {
            'item-divider-sticky': boolean;
            'item': boolean;
        };
    };
    render(): JSX.Element[];
}
