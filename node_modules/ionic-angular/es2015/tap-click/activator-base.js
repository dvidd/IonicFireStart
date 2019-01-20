export class ActivatorBase {
}
export function isActivatedDisabled(ev, activatableEle) {
    if (!activatableEle || !activatableEle.parentNode) {
        return true;
    }
    if (!ev) {
        return false;
    }
    if (ev.defaultPrevented) {
        return true;
    }
    let targetEle = ev.target;
    for (let i = 0; i < 4; i++) {
        if (!targetEle) {
            break;
        }
        if (targetEle.hasAttribute('disable-activated')) {
            return true;
        }
        targetEle = targetEle.parentElement;
    }
    return false;
}
//# sourceMappingURL=activator-base.js.map