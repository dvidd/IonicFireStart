import { ComponentInterface, EventEmitter } from '../../stencil.core';
import { RadioGroupChangeEventDetail } from '../../interface';
export declare class RadioGroup implements ComponentInterface {
    private inputId;
    private labelId;
    private radios;
    el: HTMLElement;
    /**
     * If `true`, the radios can be deselected.
     */
    allowEmptySelection: boolean;
    /**
     * The name of the control, which is submitted with the form data.
     */
    name: string;
    /**
     * the value of the radio group.
     */
    value?: any | null;
    valueChanged(value: any | undefined): void;
    /**
     * Emitted when the value has changed.
     */
    ionChange: EventEmitter<RadioGroupChangeEventDetail>;
    onRadioDidLoad(ev: Event): void;
    onRadioDidUnload(ev: Event): void;
    onRadioSelect(ev: Event): void;
    onRadioDeselect(ev: Event): void;
    componentDidLoad(): void;
    private updateRadios;
    hostData(): {
        'role': string;
        'aria-labelledby': string;
    };
}
