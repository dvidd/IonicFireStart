import '../../stencil.core';
import { ComponentInterface } from '../../stencil.core';
import { Color, Config, Mode } from '../../interface';
export declare class ProgressBar implements ComponentInterface {
    config: Config;
    /**
     * The mode determines which platform styles to use.
     */
    mode: Mode;
    /**
     * The state of the progress bar, based on if the time the process takes is known or not.
     * Default options are: `"determinate"` (no animation), `"indeterminate"` (animate from left to right).
     */
    type: 'determinate' | 'indeterminate';
    /**
     * If true, reverse the progress bar direction.
     */
    reversed: boolean;
    /**
     * The value determines how much of the active bar should display when the
     * `type` is `"determinate"`.
     * The value should be between [0, 1].
     */
    value: number;
    /**
     * If the buffer and value are smaller than 1, the buffer circles will show.
     * The buffer should be between [0, 1].
     */
    buffer: number;
    /**
     * The color to use from your application's color palette.
     * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
     * For more information on colors, see [theming](/docs/theming/basics).
     */
    color?: Color;
    hostData(): {
        'role': string;
        'aria-valuenow': number | null;
        'aria-valuemin': number;
        'aria-valuemax': number;
        class: {
            'progress-paused': boolean;
            'progress-bar-reversed': boolean;
        } | {
            [x: string]: boolean;
            'progress-paused': boolean;
            'progress-bar-reversed': boolean;
        };
    };
    render(): JSX.Element[];
}
