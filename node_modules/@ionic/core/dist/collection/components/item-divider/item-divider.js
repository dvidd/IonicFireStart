import { createColorClasses } from '../../utils/theme';
export class ItemDivider {
    constructor() {
        this.sticky = false;
    }
    componentDidLoad() {
        Array.from(this.el.querySelectorAll('ion-button')).forEach(button => {
            if (button.size === undefined) {
                button.size = 'small';
            }
        });
    }
    hostData() {
        return {
            class: Object.assign({}, createColorClasses(this.color), { 'item-divider-sticky': this.sticky, 'item': true })
        };
    }
    render() {
        return [
            h("slot", { name: "start" }),
            h("div", { class: "item-divider-inner" },
                h("div", { class: "item-divider-wrapper" },
                    h("slot", null)),
                h("slot", { name: "end" }))
        ];
    }
    static get is() { return "ion-item-divider"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "color": {
            "type": String,
            "attr": "color"
        },
        "el": {
            "elementRef": true
        },
        "mode": {
            "type": String,
            "attr": "mode"
        },
        "sticky": {
            "type": Boolean,
            "attr": "sticky"
        }
    }; }
    static get style() { return "/**style-placeholder:ion-item-divider:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-item-divider:**/"; }
}
