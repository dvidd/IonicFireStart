import '../../stencil.core';
import { ComponentInterface, EventEmitter } from '../../stencil.core';
import { Mode, SegmentButtonLayout } from '../../interface';
export declare class SegmentButton implements ComponentInterface {
    el: HTMLElement;
    /**
     * The mode determines which platform styles to use.
     */
    mode: Mode;
    /**
     * If `true`, the segment button is selected.
     */
    checked: boolean;
    /**
     * If `true`, the user cannot interact with the segment button.
     */
    disabled: boolean;
    /**
     * Set the layout of the text and icon in the segment.
     */
    layout?: SegmentButtonLayout;
    /**
     * The value of the segment button.
     */
    value: string;
    /**
     * Emitted when the segment button is clicked.
     */
    ionSelect: EventEmitter<void>;
    checkedChanged(checked: boolean, prev: boolean): void;
    private onClick;
    private readonly hasLabel;
    private readonly hasIcon;
    hostData(): {
        'aria-disabled': string | null;
        class: {
            [x: string]: boolean;
            'segment-button-has-label': boolean;
            'segment-button-has-icon': boolean;
            'segment-button-has-label-only': boolean;
            'segment-button-has-icon-only': boolean;
            'segment-button-disabled': boolean;
            'segment-button-checked': boolean;
            'ion-activatable': boolean;
            'ion-activatable-instant': boolean;
        };
    };
    render(): JSX.Element[];
}
