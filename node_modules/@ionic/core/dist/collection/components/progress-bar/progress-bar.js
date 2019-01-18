import { clamp } from '../../utils/helpers';
import { createColorClasses } from '../../utils/theme';
export class ProgressBar {
    constructor() {
        this.type = 'determinate';
        this.reversed = false;
        this.value = 0;
        this.buffer = 1;
    }
    hostData() {
        const { color, type, reversed, value } = this;
        const paused = this.config.getBoolean('_testing');
        return {
            'role': 'progressbar',
            'aria-valuenow': type === 'determinate' ? value : null,
            'aria-valuemin': 0,
            'aria-valuemax': 1,
            class: Object.assign({}, createColorClasses(color), { [`progress-bar-${type}`]: true, 'progress-paused': paused, 'progress-bar-reversed': reversed })
        };
    }
    render() {
        if (this.type === 'indeterminate') {
            return [
                h("div", { class: "indeterminate-bar-primary" },
                    h("span", { class: "progress-indeterminate" })),
                h("div", { class: "indeterminate-bar-secondary" },
                    h("span", { class: "progress-indeterminate" }))
            ];
        }
        const value = clamp(0, this.value, 1);
        const buffer = clamp(0, this.buffer, 1);
        return [
            h("div", { class: "progress", style: { transform: `scaleX(${value})` } }),
            buffer !== 1 && h("div", { class: "buffer-circles" }),
            h("div", { class: "progress-buffer-bar", style: { transform: `scaleX(${buffer})` } }),
        ];
    }
    static get is() { return "ion-progress-bar"; }
    static get encapsulation() { return "shadow"; }
    static get properties() { return {
        "buffer": {
            "type": Number,
            "attr": "buffer"
        },
        "color": {
            "type": String,
            "attr": "color"
        },
        "config": {
            "context": "config"
        },
        "mode": {
            "type": String,
            "attr": "mode"
        },
        "reversed": {
            "type": Boolean,
            "attr": "reversed"
        },
        "type": {
            "type": String,
            "attr": "type"
        },
        "value": {
            "type": Number,
            "attr": "value"
        }
    }; }
    static get style() { return "/**style-placeholder:ion-progress-bar:**/"; }
    static get styleMode() { return "/**style-id-placeholder:ion-progress-bar:**/"; }
}
