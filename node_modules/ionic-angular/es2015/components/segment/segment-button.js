import { Component, EventEmitter, HostListener, Input, Output, ViewEncapsulation } from '@angular/core';
import { isPresent, isTrueProperty } from '../../util/util';
/**
 * @name SegmentButton
 * @description
 * The child buttons of the `ion-segment` component. Each `ion-segment-button` must have a value.
 *
 * @usage
 *
 * ```html
 * <ion-content>
 *   <!-- Segment buttons with icons -->
 *   <ion-segment [(ngModel)]="icons" color="secondary">
 *     <ion-segment-button value="camera">
 *       <ion-icon name="camera"></ion-icon>
 *     </ion-segment-button>
 *     <ion-segment-button value="bookmark">
 *       <ion-icon name="bookmark"></ion-icon>
 *     </ion-segment-button>
 *   </ion-segment>
 *
 *   <!-- Segment buttons with text -->
 *   <ion-segment [(ngModel)]="relationship" color="primary">
 *     <ion-segment-button value="friends" (ionSelect)="selectedFriends()">
 *       Friends
 *     </ion-segment-button>
 *     <ion-segment-button value="enemies" (ionSelect)="selectedEnemies()">
 *       Enemies
 *     </ion-segment-button>
 *   </ion-segment>
 * </ion-content>
 * ```
 *
 *
 * @demo /docs/demos/src/segment/
 * @see {@link /docs/components#segment Segment Component Docs}
 * @see {@link /docs/api/components/segment/Segment/ Segment API Docs}
 */
export class SegmentButton {
    constructor() {
        this.isActive = false;
        this._disabled = false;
        /**
         * @output {SegmentButton} Emitted when a segment button has been clicked.
         */
        this.ionSelect = new EventEmitter();
    }
    /**
     * @input {boolean} If true, the user cannot interact with this element.
     */
    get disabled() {
        return this._disabled;
    }
    set disabled(val) {
        this._disabled = isTrueProperty(val);
    }
    /**
     * @hidden
     * On click of a SegmentButton
     */
    onClick() {
        (void 0) /* console.debug */;
        this.ionSelect.emit(this);
    }
    /**
     * @hidden
     */
    ngOnInit() {
        if (!isPresent(this.value)) {
            console.warn('<ion-segment-button> requires a "value" attribute');
        }
    }
}
SegmentButton.decorators = [
    { type: Component, args: [{
                selector: 'ion-segment-button',
                template: '<ng-content></ng-content>' +
                    '<div class="button-effect"></div>',
                host: {
                    'tappable': '',
                    'class': 'segment-button',
                    'role': 'button',
                    '[class.segment-button-disabled]': '_disabled',
                    '[class.segment-activated]': 'isActive',
                    '[attr.aria-pressed]': 'isActive'
                },
                encapsulation: ViewEncapsulation.None,
            },] },
];
/** @nocollapse */
SegmentButton.ctorParameters = () => [];
SegmentButton.propDecorators = {
    'value': [{ type: Input },],
    'ionSelect': [{ type: Output },],
    'disabled': [{ type: Input },],
    'onClick': [{ type: HostListener, args: ['click',] },],
};
//# sourceMappingURL=segment-button.js.map