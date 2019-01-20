import { isHorizontal, maxTranslate, minTranslate, round, transform, transition } from './swiper-utils';
import { parallaxSetTransition, parallaxSetTranslate } from './swiper-parallax';
import { updateProgress } from './swiper-progress';
import { updateActiveIndex } from './swiper-index';
import { SWIPER_CONTROLLER } from './swiper-controller';
import { SWIPER_EFFECTS } from './swiper-effects';
export function setWrapperTranslate(s, plt, translate, shouldUpdateActiveIndex, byController) {
    var x = 0, y = 0, z = 0;
    if (isHorizontal(s)) {
        x = s._rtl ? -translate : translate;
    }
    else {
        y = translate;
    }
    if (s.roundLengths) {
        x = round(x);
        y = round(y);
    }
    if (!s.virtualTranslate) {
        transform(s._wrapper, 'translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');
    }
    s._translate = isHorizontal(s) ? x : y;
    // Check if we need to update progress
    var progress;
    var translatesDiff = maxTranslate(s) - minTranslate(s);
    if (translatesDiff === 0) {
        progress = 0;
    }
    else {
        progress = (translate - minTranslate(s)) / (translatesDiff);
    }
    if (progress !== s.progress) {
        updateProgress(s, translate);
    }
    if (shouldUpdateActiveIndex) {
        updateActiveIndex(s);
    }
    if (s.effect !== 'slide' && SWIPER_EFFECTS[s.effect]) {
        SWIPER_EFFECTS[s.effect].setTranslate(s, plt);
    }
    if (s.parallax) {
        parallaxSetTranslate(s);
    }
    if (s.control) {
        SWIPER_CONTROLLER.setTranslate(s, plt, s._translate, byController, setWrapperTranslate);
    }
}
export function getTranslate(s, plt, el, axis) {
    var win = plt.win();
    var matrix;
    var curTransform;
    var curStyle;
    var transformMatrix;
    // automatic axis detection
    if (typeof axis === 'undefined') {
        axis = 'x';
    }
    if (s.virtualTranslate) {
        return s._rtl ? -s._translate : s._translate;
    }
    curStyle = plt.getElementComputedStyle(el);
    if (win.WebKitCSSMatrix) {
        curTransform = curStyle.transform || curStyle.webkitTransform;
        if (curTransform.split(',').length > 6) {
            curTransform = curTransform.split(', ').map(function (a) {
                return a.replace(',', '.');
            }).join(', ');
        }
        // Some old versions of Webkit choke when 'none' is passed; pass
        // empty string instead in this case
        transformMatrix = new win.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
    }
    else {
        transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
        matrix = transformMatrix.toString().split(',');
    }
    if (axis === 'x') {
        if (win.WebKitCSSMatrix) {
            // Latest Chrome and webkits Fix
            curTransform = transformMatrix.m41;
        }
        else if (matrix.length === 16) {
            // Crazy IE10 Matrix
            curTransform = parseFloat(matrix[12]);
        }
        else {
            // Normal Browsers
            curTransform = parseFloat(matrix[4]);
        }
    }
    if (axis === 'y') {
        if (win.WebKitCSSMatrix) {
            // Latest Chrome and webkits Fix
            curTransform = transformMatrix.m42;
        }
        else if (matrix.length === 16) {
            // Crazy IE10 Matrix
            curTransform = parseFloat(matrix[13]);
        }
        else {
            // Normal Browsers
            curTransform = parseFloat(matrix[5]);
        }
    }
    if (s._rtl && curTransform) {
        curTransform = -curTransform;
    }
    return curTransform || 0;
}
export function getWrapperTranslate(s, plt, axis) {
    if (typeof axis === 'undefined') {
        axis = isHorizontal(s) ? 'x' : 'y';
    }
    return getTranslate(s, plt, s._wrapper, axis);
}
export function setWrapperTransition(s, plt, duration, byController) {
    transition(s._wrapper, duration);
    if (s.effect !== 'slide' && SWIPER_EFFECTS[s.effect]) {
        SWIPER_EFFECTS[s.effect].setTransition(s, plt, duration);
    }
    if (s.parallax) {
        parallaxSetTransition(s, duration);
    }
    if (s.control) {
        SWIPER_CONTROLLER.setTransition(s, plt, duration, byController, setWrapperTransition);
    }
}
//# sourceMappingURL=swiper-transition.js.map