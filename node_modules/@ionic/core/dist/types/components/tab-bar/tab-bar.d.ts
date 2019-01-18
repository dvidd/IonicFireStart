import '../../stencil.core';
import { ComponentInterface, EventEmitter, QueueApi } from '../../stencil.core';
import { Color, Mode, TabBarChangedEventDetail } from '../../interface';
export declare class TabBar implements ComponentInterface {
    el: HTMLElement;
    queue: QueueApi;
    doc: Document;
    keyboardVisible: boolean;
    /**
     * The mode determines which platform styles to use.
     */
    mode: Mode;
    /**
     * The color to use from your application's color palette.
     * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
     * For more information on colors, see [theming](/docs/theming/basics).
     */
    color?: Color;
    /**
     * The selected tab component
     */
    selectedTab?: string;
    selectedTabChanged(): void;
    /**
     * If `true`, the tab bar will be translucent.
     */
    translucent: boolean;
    /** @internal */
    ionTabBarChanged: EventEmitter<TabBarChangedEventDetail>;
    protected onKeyboardWillHide(): void;
    protected onKeyboardWillShow(): void;
    componentWillLoad(): void;
    hostData(): {
        'role': string;
        'aria-hidden': string | null;
        class: {
            'tab-bar-translucent': boolean;
            'tab-bar-hidden': boolean;
        } | {
            'tab-bar-translucent': boolean;
            'tab-bar-hidden': boolean;
        };
    };
    render(): JSX.Element;
}
