import { h } from '../ionic.core.js';

import { b as createColorClasses } from './chunk-7c632336.js';

class TabBar {
    constructor() {
        this.keyboardVisible = false;
        this.translucent = false;
    }
    selectedTabChanged() {
        this.ionTabBarChanged.emit({
            tab: this.selectedTab
        });
    }
    onKeyboardWillHide() {
        setTimeout(() => this.keyboardVisible = false, 50);
    }
    onKeyboardWillShow() {
        if (this.el.getAttribute('slot') !== 'top') {
            this.keyboardVisible = true;
        }
    }
    componentWillLoad() {
        this.selectedTabChanged();
    }
    hostData() {
        const { color, translucent, keyboardVisible } = this;
        return {
            'role': 'tablist',
            'aria-hidden': keyboardVisible ? 'true' : null,
            class: Object.assign({}, createColorClasses(color), { 'tab-bar-translucent': translucent, 'tab-bar-hidden': keyboardVisible })
        };
    }
    render() {
        return (h("slot", null));
    }
    static get is() { return "ion-tab-bar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "color": {
            "type": String,
            "attr": "color"
        },
        "doc": {
            "context": "document"
        },
        "el": {
            "elementRef": true
        },
        "keyboardVisible": {
            "state": true
        },
        "mode": {
            "type": String,
            "attr": "mode"
        },
        "queue": {
            "context": "queue"
        },
        "selectedTab": {
            "type": String,
            "attr": "selected-tab",
            "watchCallbacks": ["selectedTabChanged"]
        },
        "translucent": {
            "type": Boolean,
            "attr": "translucent"
        }
    }; }
    static get events() { return [{
            "name": "ionTabBarChanged",
            "method": "ionTabBarChanged",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "window:keyboardWillHide",
            "method": "onKeyboardWillHide"
        }, {
            "name": "window:keyboardWillShow",
            "method": "onKeyboardWillShow"
        }]; }
    static get style() { return ".sc-ion-tab-bar-md-h{padding-left:var(--ion-safe-area-left);padding-right:var(--ion-safe-area-right);display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:auto;padding-bottom:var(--ion-safe-area-bottom,0);border-top:var(--border);background:var(--background);color:var(--color);text-align:center;contain:strict;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:10;-webkit-box-sizing:content-box!important;box-sizing:content-box!important}.ion-color.sc-ion-tab-bar-md-h, .sc-ion-tab-bar-md-h.ion-color .sc-ion-tab-bar-md-s > ion-tab-button{background:var(--ion-color-base);color:rgba(var(--ion-color-contrast-rgb),.7)}.sc-ion-tab-bar-md-h.ion-color .sc-ion-tab-bar-md-s > ion-tab-button{--background-focused:var(--ion-color-shade);--color-selected:var(--ion-color-contrast)}.sc-ion-tab-bar-md-h.ion-color .sc-ion-tab-bar-md-s > .tab-selected{color:var(--ion-color-contrast)}[slot=top].sc-ion-tab-bar-md-h{padding-bottom:0;border-top:0;border-bottom:var(--border)}.tab-bar-hidden.sc-ion-tab-bar-md-h{display:none!important}.sc-ion-tab-bar-md-h{--background:var(--ion-tab-bar-background,var(--ion-background-color,#fff));--background-focused:var(--ion-tab-bar-background-focused,#e0e0e0);--border:1px solid var(--ion-tab-bar-border-color,var(--ion-border-color,var(--ion-color-step-150,rgba(0,0,0,0.07))));--color:var(--ion-tab-bar-color,var(--ion-color-step-600,#666));--color-selected:var(--ion-tab-bar-color-activated,var(--ion-color-primary,#3880ff));height:56px}"; }
    static get styleMode() { return "md"; }
}

class TabButton {
    constructor() {
        this.selected = false;
        this.disabled = false;
    }
    onTabBarChanged(ev) {
        this.selected = this.tab === ev.detail.tab;
    }
    onClick(ev) {
        if (this.tab !== undefined) {
            if (!this.disabled) {
                this.ionTabButtonClick.emit({
                    tab: this.tab,
                    href: this.href,
                    selected: this.selected
                });
            }
            ev.preventDefault();
        }
    }
    componentWillLoad() {
        if (this.layout === undefined) {
            this.layout = this.config.get('tabButtonLayout', 'icon-top');
        }
    }
    get hasLabel() {
        return !!this.el.querySelector('ion-label');
    }
    get hasIcon() {
        return !!this.el.querySelector('ion-icon');
    }
    hostData() {
        const { disabled, hasIcon, hasLabel, layout, selected, tab } = this;
        return {
            'role': 'tab',
            'aria-selected': selected ? 'true' : null,
            'id': tab !== undefined ? `tab-button-${tab}` : null,
            class: {
                'tab-selected': selected,
                'tab-disabled': disabled,
                'tab-has-label': hasLabel,
                'tab-has-icon': hasIcon,
                'tab-has-label-only': hasLabel && !hasIcon,
                'tab-has-icon-only': hasIcon && !hasLabel,
                [`tab-layout-${layout}`]: true,
                'ion-activatable': true,
            }
        };
    }
    render() {
        const { mode, href } = this;
        return (h("a", { href: href },
            h("slot", null),
            mode === 'md' && h("ion-ripple-effect", { type: "unbounded" })));
    }
    static get is() { return "ion-tab-button"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "config": {
            "context": "config"
        },
        "disabled": {
            "type": Boolean,
            "attr": "disabled"
        },
        "doc": {
            "context": "document"
        },
        "el": {
            "elementRef": true
        },
        "href": {
            "type": String,
            "attr": "href"
        },
        "layout": {
            "type": String,
            "attr": "layout",
            "mutable": true
        },
        "mode": {
            "type": String,
            "attr": "mode"
        },
        "queue": {
            "context": "queue"
        },
        "selected": {
            "type": Boolean,
            "attr": "selected",
            "mutable": true
        },
        "tab": {
            "type": String,
            "attr": "tab"
        }
    }; }
    static get events() { return [{
            "name": "ionTabButtonClick",
            "method": "ionTabButtonClick",
            "bubbles": true,
            "cancelable": true,
            "composed": true
        }]; }
    static get listeners() { return [{
            "name": "parent:ionTabBarChanged",
            "method": "onTabBarChanged"
        }, {
            "name": "click",
            "method": "onClick"
        }]; }
    static get style() { return ".sc-ion-tab-button-md-h{--ripple-color:var(--color-selected);-ms-flex:1;flex:1;-ms-flex-direction:column;flex-direction:column;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;background:var(--background);color:var(--color)}.sc-ion-tab-button-md-h, a.sc-ion-tab-button-md{height:100%}a.sc-ion-tab-button-md{margin:0;padding:var(--padding-top) var(--padding-end) var(--padding-bottom) var(--padding-start);font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;display:-ms-flexbox;display:flex;position:relative;-ms-flex-direction:inherit;flex-direction:inherit;-ms-flex-align:inherit;align-items:inherit;-ms-flex-pack:inherit;justify-content:inherit;width:100%;border:0;outline:none;background:transparent;text-decoration:none;cursor:pointer;overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-user-drag:none}a.sc-ion-tab-button-md:focus-visible{background:var(--background-focused)}\@media (any-hover:hover){a.sc-ion-tab-button-md:hover{color:var(--color-selected)}}.tab-selected.sc-ion-tab-button-md-h{color:var(--color-selected)}.tab-hidden.sc-ion-tab-button-md-h{display:none!important}.tab-disabled.sc-ion-tab-button-md-h{pointer-events:none;opacity:.4}.sc-ion-tab-button-md-s > ion-icon, .sc-ion-tab-button-md-s > ion-label{display:block;-ms-flex-item-align:center;align-self:center;max-width:100%;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;-webkit-box-sizing:border-box;box-sizing:border-box}.sc-ion-tab-button-md-s > ion-label{-ms-flex-order:0;order:0}.sc-ion-tab-button-md-s > ion-icon{-ms-flex-order:-1;order:-1;height:1em}.sc-ion-tab-button-md-h.tab-has-label-only .sc-ion-tab-button-md-s > ion-label{white-space:normal}.sc-ion-tab-button-md-s > ion-badge{-webkit-box-sizing:border-box;box-sizing:border-box;position:absolute;z-index:1}.tab-layout-icon-start.sc-ion-tab-button-md-h{-ms-flex-direction:row;flex-direction:row}.tab-layout-icon-end.sc-ion-tab-button-md-h{-ms-flex-direction:row-reverse;flex-direction:row-reverse}.tab-layout-icon-bottom.sc-ion-tab-button-md-h{-ms-flex-direction:column-reverse;flex-direction:column-reverse}.sc-ion-tab-button-md-h.tab-layout-icon-hide .sc-ion-tab-button-md-s > ion-icon, .sc-ion-tab-button-md-h.tab-layout-label-hide .sc-ion-tab-button-md-s > ion-label{display:none}ion-ripple-effect.sc-ion-tab-button-md{color:var(--ripple-color)}.sc-ion-tab-button-md-h{--padding-top:0;--padding-end:12px;--padding-bottom:0;--padding-start:12px;max-width:168px;font-size:12px;font-weight:400;letter-spacing:.03em}.sc-ion-tab-button-md-s > ion-label{margin:2px 0;text-transform:none}.sc-ion-tab-button-md-s > ion-icon{margin:16px 0;-webkit-transform-origin:center center;transform-origin:center center;font-size:22px}.sc-ion-tab-button-md-s > ion-badge{border-radius:8px;padding:3px 2px 2px;left:calc(50% + 6px);top:8px;min-width:12px;font-size:8px;font-weight:400}.sc-ion-tab-button-md-s > ion-badge:empty{display:block;min-width:8px;height:8px}.sc-ion-tab-button-md-h.tab-layout-icon-top .sc-ion-tab-button-md-s > ion-icon{margin-top:6px;margin-bottom:2px}.sc-ion-tab-button-md-h.tab-layout-icon-top .sc-ion-tab-button-md-s > ion-label{margin-top:0;margin-bottom:6px}.sc-ion-tab-button-md-h.tab-layout-icon-bottom .sc-ion-tab-button-md-s > ion-badge{left:70%;top:8px}.sc-ion-tab-button-md-h.tab-layout-icon-bottom .sc-ion-tab-button-md-s > ion-icon{margin-top:0;margin-bottom:6px}.sc-ion-tab-button-md-h.tab-layout-icon-bottom .sc-ion-tab-button-md-s > ion-label{margin-top:6px;margin-bottom:0}.sc-ion-tab-button-md-h.tab-layout-icon-end .sc-ion-tab-button-md-s > ion-badge, .sc-ion-tab-button-md-h.tab-layout-icon-start .sc-ion-tab-button-md-s > ion-badge{left:80%;top:16px}.sc-ion-tab-button-md-h.tab-layout-icon-start .sc-ion-tab-button-md-s > ion-icon{margin-right:6px}.sc-ion-tab-button-md-h.tab-layout-icon-end .sc-ion-tab-button-md-s > ion-icon{margin-left:6px}.sc-ion-tab-button-md-h.tab-has-label-only .sc-ion-tab-button-md-s > ion-badge, .sc-ion-tab-button-md-h.tab-layout-icon-hide .sc-ion-tab-button-md-s > ion-badge{left:70%;top:16px}.sc-ion-tab-button-md-h.tab-has-label-only .sc-ion-tab-button-md-s > ion-label, .sc-ion-tab-button-md-h.tab-layout-icon-hide .sc-ion-tab-button-md-s > ion-label{margin-top:0;margin-bottom:0}.sc-ion-tab-button-md-h.tab-has-icon-only .sc-ion-tab-button-md-s > ion-badge, .sc-ion-tab-button-md-h.tab-layout-label-hide .sc-ion-tab-button-md-s > ion-badge{top:16px}.sc-ion-tab-button-md-h.tab-has-icon-only .sc-ion-tab-button-md-s > ion-icon, .sc-ion-tab-button-md-h.tab-layout-label-hide .sc-ion-tab-button-md-s > ion-icon{margin-top:0;margin-bottom:0;font-size:24px}"; }
    static get styleMode() { return "md"; }
}

export { TabBar as IonTabBar, TabButton as IonTabButton };
