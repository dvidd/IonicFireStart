/**
 * @hidden
 */
var DisplayWhen = (function () {
    function DisplayWhen(conditions, _plt, zone) {
        this._plt = _plt;
        this.zone = zone;
        this.isMatch = false;
        if (!conditions)
            return;
        this.conditions = conditions.replace(/\s/g, '').split(',');
        // check if its one of the matching platforms first
        // a platform does not change during the life of an app
        for (var i = 0; i < this.conditions.length; i++) {
            if (this.conditions[i] && _plt.is(this.conditions[i])) {
                this.isMatch = true;
                return;
            }
        }
        if (this.orientation()) {
            // add window resize listener
            this.resizeObs = _plt.resize.subscribe(this.orientation.bind(this));
        }
    }
    DisplayWhen.prototype.orientation = function () {
        for (var i = 0; i < this.conditions.length; i++) {
            if (this.conditions[i] === 'portrait') {
                this.isMatch = this._plt.isPortrait();
                return true;
            }
            if (this.conditions[i] === 'landscape') {
                this.isMatch = this._plt.isLandscape();
                return true;
            }
        }
        return false;
    };
    DisplayWhen.prototype.ngOnDestroy = function () {
        this.resizeObs && this.resizeObs.unsubscribe();
        this.resizeObs = null;
    };
    return DisplayWhen;
}());
export { DisplayWhen };
//# sourceMappingURL=display-when.js.map