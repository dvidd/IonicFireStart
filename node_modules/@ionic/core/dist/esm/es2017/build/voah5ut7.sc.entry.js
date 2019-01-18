import { h } from '../ionic.core.js';

import { b as createColorClasses } from './chunk-7c632336.js';

class Text {
    hostData() {
        return {
            class: createColorClasses(this.color)
        };
    }
    render() {
        return h("slot", null);
    }
    static get is() { return "ion-text"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "color": {
            "type": String,
            "attr": "color"
        },
        "mode": {
            "type": String,
            "attr": "mode"
        }
    }; }
    static get style() { return ".ion-color.sc-ion-text-h{color:var(--ion-color-base)}"; }
}

export { Text as IonText };
