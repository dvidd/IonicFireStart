import { isActivatedDisabled } from './activator-base';
import { Activator } from './activator';
import { hasPointerMoved, pointerCoord } from '../util/dom';
/**
 * @hidden
 */
export class RippleActivator {
    constructor(app, config, dom) {
        this.dom = dom;
        this.highlight = new Activator(app, config, dom);
    }
    clickAction(ev, activatableEle, startCoord) {
        // Highlight
        this.highlight && this.highlight.clickAction(ev, activatableEle, startCoord);
        // Ripple
        this._clickAction(ev, activatableEle, startCoord);
    }
    downAction(ev, activatableEle, startCoord) {
        // Highlight
        this.highlight && this.highlight.downAction(ev, activatableEle, startCoord);
        // Ripple
        this._downAction(ev, activatableEle, startCoord);
    }
    upAction(ev, activatableEle, startCoord) {
        // Highlight
        this.highlight && this.highlight.upAction(ev, activatableEle, startCoord);
        // Ripple
        this._upAction(ev, activatableEle, startCoord);
    }
    clearState(animated) {
        // Highlight
        this.highlight && this.highlight.clearState(animated);
    }
    _downAction(ev, activatableEle, _startCoord) {
        if (isActivatedDisabled(ev, activatableEle)) {
            return;
        }
        var j = activatableEle.childElementCount;
        while (j--) {
            var rippleEle = activatableEle.children[j];
            if (rippleEle.classList.contains('button-effect')) {
                // DOM READ
                var clientRect = activatableEle.getBoundingClientRect();
                rippleEle.$top = clientRect.top;
                rippleEle.$left = clientRect.left;
                rippleEle.$width = clientRect.width;
                rippleEle.$height = clientRect.height;
                break;
            }
        }
    }
    _upAction(ev, activatableEle, startCoord) {
        if (!hasPointerMoved(6, startCoord, pointerCoord(ev))) {
            let i = activatableEle.childElementCount;
            while (i--) {
                var rippleEle = activatableEle.children[i];
                if (rippleEle.classList.contains('button-effect')) {
                    // DOM WRITE
                    this.startRippleEffect(rippleEle, activatableEle, startCoord);
                    break;
                }
            }
        }
    }
    _clickAction(_ev, _activatableEle, _startCoord) {
        // NOTHING
    }
    startRippleEffect(rippleEle, activatableEle, startCoord) {
        if (!startCoord) {
            return;
        }
        let clientPointerX = (startCoord.x - rippleEle.$left);
        let clientPointerY = (startCoord.y - rippleEle.$top);
        let x = Math.max(Math.abs(rippleEle.$width - clientPointerX), clientPointerX) * 2;
        let y = Math.max(Math.abs(rippleEle.$height - clientPointerY), clientPointerY) * 2;
        let diameter = Math.min(Math.max(Math.hypot(x, y), 64), 240);
        if (activatableEle.hasAttribute('ion-item')) {
            diameter = Math.min(diameter, 140);
        }
        clientPointerX -= diameter / 2;
        clientPointerY -= diameter / 2;
        clientPointerX = Math.round(clientPointerX);
        clientPointerY = Math.round(clientPointerY);
        diameter = Math.round(diameter);
        // Reset ripple
        // DOM WRITE
        const Css = this.dom.plt.Css;
        rippleEle.style.opacity = '';
        rippleEle.style[Css.transform] = `translate3d(${clientPointerX}px, ${clientPointerY}px, 0px) scale(0.001)`;
        rippleEle.style[Css.transition] = '';
        // Start ripple animation
        let radius = Math.sqrt(rippleEle.$width + rippleEle.$height);
        let scaleTransitionDuration = Math.max(1600 * Math.sqrt(radius / TOUCH_DOWN_ACCEL) + 0.5, 260);
        let opacityTransitionDuration = Math.round(scaleTransitionDuration * 0.7);
        let opacityTransitionDelay = Math.round(scaleTransitionDuration - opacityTransitionDuration);
        scaleTransitionDuration = Math.round(scaleTransitionDuration);
        let transform = `translate3d(${clientPointerX}px, ${clientPointerY}px, 0px) scale(1)`;
        let transition = `transform ${scaleTransitionDuration}ms,opacity ${opacityTransitionDuration}ms ${opacityTransitionDelay}ms`;
        this.dom.write(() => {
            // DOM WRITE
            rippleEle.style.width = rippleEle.style.height = diameter + 'px';
            rippleEle.style.opacity = '0';
            rippleEle.style[Css.transform] = transform;
            rippleEle.style[Css.transition] = transition;
        }, 16);
    }
}
const TOUCH_DOWN_ACCEL = 300;
//# sourceMappingURL=ripple.js.map