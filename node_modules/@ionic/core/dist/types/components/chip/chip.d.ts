import '../../stencil.core';
import { ComponentInterface } from '../../stencil.core';
import { Color, Mode } from '../../interface';
export declare class Chip implements ComponentInterface {
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
     * Display an outline style button.
     */
    outline: boolean;
    hostData(): {
        class: {
            'chip-outline': boolean;
            'ion-activatable': boolean;
        } | {
            'chip-outline': boolean;
            'ion-activatable': boolean;
        };
    };
    render(): (JSX.Element | null)[];
}
