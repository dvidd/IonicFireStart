import { Ion } from '../ion';
/**
 * @hidden
 */
export class ToolbarBase extends Ion {
    constructor(config, elementRef, renderer) {
        super(config, elementRef, renderer, 'toolbar');
    }
    /**
     * @hidden
     */
    _setTitle(titleCmp) {
        this._title = titleCmp;
    }
    /**
     * @hidden
     * Returns the toolbar title text if it exists or an empty string
     */
    getTitleText() {
        return (this._title && this._title.getTitleText()) || '';
    }
}
//# sourceMappingURL=toolbar-base.js.map