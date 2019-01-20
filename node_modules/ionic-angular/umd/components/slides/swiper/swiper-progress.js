(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./swiper-utils"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var swiper_utils_1 = require("./swiper-utils");
    function updateProgress(s, translate) {
        if (typeof translate === 'undefined') {
            translate = s._translate || 0;
        }
        var translatesDiff = swiper_utils_1.maxTranslate(s) - swiper_utils_1.minTranslate(s);
        var wasBeginning = s._isBeginning;
        var wasEnd = s._isEnd;
        if (translatesDiff === 0) {
            s.progress = 0;
            s._isBeginning = s._isEnd = true;
        }
        else {
            s.progress = (translate - swiper_utils_1.minTranslate(s)) / (translatesDiff);
            s._isBeginning = s.progress <= 0;
            s._isEnd = s.progress >= 1;
        }
        s._zone.run(function () {
            if (s._isBeginning && !wasBeginning) {
                s.ionSlideReachStart.emit();
            }
            if (s._isEnd && !wasEnd) {
                s.ionSlideReachEnd.emit();
            }
            if (s.watchSlidesProgress) {
                updateSlidesProgress(s, translate);
            }
            s.ionSlideProgress.emit(s.progress);
        });
    }
    exports.updateProgress = updateProgress;
    function updateSlidesProgress(s, translate) {
        if (typeof translate === 'undefined') {
            translate = s._translate || 0;
        }
        if (s._slides.length === 0)
            return;
        if (typeof s._slides[0].swiperSlideOffset === 'undefined') {
            swiper_utils_1.updateSlidesOffset(s);
        }
        var offsetCenter = -translate;
        if (s._rtl)
            offsetCenter = translate;
        // Visible Slides
        swiper_utils_1.removeClass(s._slides, swiper_utils_1.CLS.slideVisible);
        for (var i = 0; i < s._slides.length; i++) {
            var slide = s._slides[i];
            var slideProgress = (offsetCenter + (s.centeredSlides ? swiper_utils_1.minTranslate(s) : 0) - slide.swiperSlideOffset) / (slide.swiperSlideSize + s.spaceBetween);
            if (s.watchSlidesVisibility) {
                var slideBefore = -(offsetCenter - slide.swiperSlideOffset);
                var slideAfter = slideBefore + s._slidesSizesGrid[i];
                var isVisible = (slideBefore >= 0 && slideBefore < s._renderedSize) ||
                    (slideAfter > 0 && slideAfter <= s._renderedSize) ||
                    (slideBefore <= 0 && slideAfter >= s._renderedSize);
                if (isVisible) {
                    s._slides[i].classList.add(swiper_utils_1.CLS.slideVisible);
                }
            }
            slide.progress = s._rtl ? -slideProgress : slideProgress;
        }
    }
});
//# sourceMappingURL=swiper-progress.js.map