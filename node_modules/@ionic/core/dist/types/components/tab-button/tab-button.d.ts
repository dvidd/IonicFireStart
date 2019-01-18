import '../../stencil.core';
import { ComponentInterface, EventEmitter, QueueApi } from '../../stencil.core';
import { Config, Mode, TabBarChangedEventDetail, TabButtonClickEventDetail, TabButtonLayout } from '../../interface';
export declare class TabButton implements ComponentInterface {
    el: HTMLElement;
    queue: QueueApi;
    doc: Document;
    config: Config;
    /**
     * The selected tab component
     */
    selected: boolean;
    /**
     * The mode determines which platform styles to use.
     */
    mode: Mode;
    /**
     * Set the layout of the text and icon in the tab bar.
     * It defaults to `'icon-top'`.
     */
    layout?: TabButtonLayout;
    /**
     * The URL which will be used as the `href` within this tab's button anchor.
     */
    href?: string;
    /**
     * A tab id must be provided for each `ion-tab`. It's used internally to reference
     * the selected tab or by the router to switch between them.
     */
    tab?: string;
    /**
     * The selected tab component
     */
    disabled: boolean;
    /**
     * Emitted when the tab bar is clicked
     * @internal
     */
    ionTabButtonClick: EventEmitter<TabButtonClickEventDetail>;
    onTabBarChanged(ev: CustomEvent<TabBarChangedEventDetail>): void;
    onClick(ev: Event): void;
    componentWillLoad(): void;
    private readonly hasLabel;
    private readonly hasIcon;
    hostData(): {
        'role': string;
        'aria-selected': string | null;
        'id': string | null;
        class: {
            [x: string]: boolean;
            'tab-selected': boolean;
            'tab-disabled': boolean;
            'tab-has-label': boolean;
            'tab-has-icon': boolean;
            'tab-has-label-only': boolean;
            'tab-has-icon-only': boolean;
            'ion-activatable': boolean;
        };
    };
    render(): JSX.Element;
}
