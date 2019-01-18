import { ComponentInterface, EventEmitter } from '../../stencil.core';
import { Mode } from '../../interface';
export declare class SplitPane implements ComponentInterface {
    private rmL;
    mode: Mode;
    el: HTMLElement;
    visible: boolean;
    isServer: boolean;
    win: Window;
    /**
     * The content `id` of the split-pane's main content.
     * This property can be used instead of the `[main]` attribute to select the `main`
     * content of the split-pane.
     *
     * ```html
     * <ion-split-pane content-id="my-content">
     *   <ion-menu></ion-menu>
     *   <div id="my-content">
     * </ion-split-pane>
     * ```
     *
     */
    contentId?: string;
    /**
     * If `true`, the split pane will be hidden.
     */
    disabled: boolean;
    /**
     * When the split-pane should be shown.
     * Can be a CSS media query expression, or a shortcut expression.
     * Can also be a boolean expression.
     */
    when: string | boolean;
    /**
     * Emitted when the split pane is visible.
     */
    ionChange: EventEmitter<{
        visible: boolean;
    }>;
    /**
     * Expression to be called when the split-pane visibility has changed
     */
    ionSplitPaneVisible: EventEmitter;
    visibleChanged(visible: boolean): void;
    componentDidLoad(): void;
    componentDidUnload(): void;
    protected updateState(): void;
    private isPane;
    private styleChildren;
    hostData(): {
        class: {
            'split-pane-visible': boolean;
        };
    };
}
