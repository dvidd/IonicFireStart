import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, Optional, Output, Renderer, ViewEncapsulation } from '@angular/core';
import { Config } from '../../config/config';
import { enableKeyboardControl } from './swiper/swiper-keyboard';
import { Ion } from '../ion';
import { isTrueProperty } from '../../util/util';
import { initEvents } from './swiper/swiper-events';
import { initZoom } from './swiper/swiper-zoom';
import { Platform } from '../../platform/platform';
import { destroySwiper, initSwiper, slideNext, slidePrev, slideTo, startAutoplay, stopAutoplay, update, } from './swiper/swiper';
import { SWIPER_EFFECTS } from './swiper/swiper-effects';
import { ViewController } from '../../navigation/view-controller';
/**
 * @name Slides
 * @description
 * The Slides component is a multi-section container. Each section can be swiped
 * or dragged between. It contains any number of [Slide](../Slide) components.
 *
 *
 * ### Creating
 * You should use a template to create slides and listen to slide events. The template
 * should contain the slide container, an `<ion-slides>` element, and any number of
 * [Slide](../Slide) components, written as `<ion-slide>`. Basic configuration
 * values can be set as input properties, which are listed below. Slides events
 * can also be listened to such as the slide changing by placing the event on the
 * `<ion-slides>` element. See [Usage](#usage) below for more information.
 *
 *
 * ### Navigating
 * After creating and configuring the slides, you can navigate between them
 * by swiping or calling methods on the `Slides` instance. You can call `slideTo()` to
 * navigate to a specific slide, or `slideNext()` to change to the slide that follows
 * the active slide. All of the [methods](#instance-members) provided by the `Slides`
 * instance are listed below. See [Usage](#usage) below for more information on
 * navigating between slides.
 *
 *
 * @usage
 *
 * You can add slides to a `@Component` using the following template:
 *
 * ```html
 * <ion-slides>
 *   <ion-slide>
 *     <h1>Slide 1</h1>
 *   </ion-slide>
 *   <ion-slide>
 *     <h1>Slide 2</h1>
 *   </ion-slide>
 *   <ion-slide>
 *     <h1>Slide 3</h1>
 *   </ion-slide>
 * </ion-slides>
 * ```
 *
 * Next, we can use `ViewChild` to assign the Slides instance to
 * your `slides` property. Now we can call any of the `Slides`
 * [methods](#instance-members), for example we can use the Slide's
 * `slideTo()` method in order to navigate to a specific slide on
 * a button click. Below we call the `goToSlide()` method and it
 * navigates to the 3rd slide:
 *
 * ```ts
 * import { ViewChild } from '@angular/core';
 * import { Slides } from 'ionic-angular';
 *
 * class MyPage {
 *   @ViewChild(Slides) slides: Slides;
 *
 *   goToSlide() {
 *     this.slides.slideTo(2, 500);
 *   }
 * }
 * ```
 *
 * We can also add events to listen to on the `<ion-slides>` element.
 * Let's add the `ionSlideDidChange` event and call a method when the slide changes:
 *
 * ```html
 * <ion-slides (ionSlideDidChange)="slideChanged()">
 * ```
 *
 * In our class, we add the `slideChanged()` method which gets the active
 * index and prints it:
 *
 * ```ts
 * class MyPage {
 *   ...
 *
 *   slideChanged() {
 *     let currentIndex = this.slides.getActiveIndex();
 *     console.log('Current index is', currentIndex);
 *   }
 * }
 * ```
 *
 * ### Zooming
 * If your slides contain images, you can enable zooming on them by setting `zoom="true" and
 * wrapping each image in a `div` with the class `swiper-zoom-container`. Zoom supports
 * `img`, `svg`, `canvas`, and `ion-img`.
 *
 * ```html
 * <ion-slides zoom="true">
 *   <ion-slide>
 *     <div class="swiper-zoom-container">
 *       <img src="assets/img/dog.jpg">
 *     </div>
 *     <ion-label>Woof</ion-label>
 *   </ion-slide>
 *   <ion-slide>
 *     <div class="swiper-zoom-container">
 *       <img src="assets/img/cat.jpg">
 *     </div>
 *     <ion-label>Meow</ion-label>
 *   </ion-slide>
 *   <ion-slide>
 *     <div class="swiper-zoom-container">
 *       <img src="assets/img/fish.jpg">
 *     </div>
 *     <ion-label>Just keep swimming</ion-label>
 *   </ion-slide>
 * </ion-slides>
 * ```
 *
 * @advanced
 *
 * There are several options available to create customized slides. Ionic exposes
 * the most commonly used options as [inputs](http://learnangular2.com/inputs/).
 * In order to use an option that isn't exposed as an input the following code
 * should be used, where `freeMode` is the option to change:
 *
 * ```ts
 * import { ViewChild } from '@angular/core';
 * import { Slides } from 'ionic-angular';

 * class MyPage {
 *   @ViewChild(Slides) slides: Slides;
 *
 *   ngAfterViewInit() {
 *     this.slides.freeMode = true;
 *   }
 * }
 *
 * ```
 *
 * To see all of the available options, take a look at the
 * [source for slides](https://github.com/ionic-team/ionic/blob/master/src/components/slides/slides.ts).
 *
 * @demo /docs/demos/src/slides/
 * @see {@link /docs/components#slides Slides Component Docs}
 *
 * Adopted from Swiper.js:
 * The most modern mobile touch slider and framework with
 * hardware accelerated transitions.
 *
 * http://www.idangero.us/swiper/
 *
 * Copyright 2016, Vladimir Kharlampidi
 * The iDangero.us
 * http://www.idangero.us/
 *
 * Licensed under MIT
 */
export class Slides extends Ion {
    constructor(config, _plt, zone, viewCtrl, elementRef, renderer) {
        super(config, elementRef, renderer, 'slides');
        this._plt = _plt;
        this._control = null;
        this._effectName = 'slide';
        this._direction = 'horizontal';
        this._initialSlide = 0;
        this._isLoop = false;
        this._pager = false;
        this._paginationType = 'bullets';
        /** @hidden */
        this.paginationBulletRender = null;
        this._isParallax = false;
        this._speedMs = 300;
        this._isZoom = false;
        /**
         * @hidden
         * Enabled this option and swiper will be operated as usual except it will
         * not move, real translate values on wrapper will not be set. Useful when
         * you may need to create custom slide transition.
         */
        this.virtualTranslate = false;
        /**
         * @hidden
         * Set to true to round values of slides width and height to prevent blurry
         * texts on usual resolution screens (if you have such)
         */
        this.roundLengths = false;
        this._spaceBetween = 0;
        this._slidesPerView = 1;
        this._centeredSlides = false;
        /**
         * @hidden
         */
        this.slidesPerColumn = 1;
        /**
         * @hidden
         */
        this.slidesPerColumnFill = 'column';
        /**
         * @hidden
         */
        this.slidesPerGroup = 1;
        /**
         * @hidden
         */
        this.slidesOffsetBefore = 0;
        /**
         * @hidden
         */
        this.slidesOffsetAfter = 0;
        // autoplay
        /**
         * @hidden
         */
        this.autoplayDisableOnInteraction = true;
        /**
         * @hidden
         */
        this.autoplayStopOnLast = false;
        // Free mode
        /**
         * @hidden
         */
        this.freeMode = false;
        /**
         * @hidden
         */
        this.freeModeMomentum = true;
        /**
         * @hidden
         */
        this.freeModeMomentumRatio = 1;
        /**
         * @hidden
         */
        this.freeModeMomentumBounce = true;
        /**
         * @hidden
         */
        this.freeModeMomentumBounceRatio = 1;
        /**
         * @hidden
         */
        this.freeModeMomentumVelocityRatio = 1;
        /**
         * @hidden
         */
        this.freeModeSticky = false;
        /**
         * @hidden
         */
        this.freeModeMinimumVelocity = 0.02;
        // Autoheight
        /**
         * @hidden
         */
        this.autoHeight = false;
        // Set wrapper width
        /**
         * @hidden
         */
        this.setWrapperSize = false;
        // Zoom
        /**
         * @hidden
         */
        this.zoomMax = 3;
        /**
         * @hidden
         */
        this.zoomMin = 1;
        /**
         * @hidden
         */
        this.zoomToggle = true;
        // Touches
        /**
         * @hidden
         */
        this.touchRatio = 1;
        /**
         * @hidden
         */
        this.touchAngle = 45;
        /**
         * @hidden
         */
        this.simulateTouch = true;
        /**
         * @hidden
         */
        this.shortSwipes = true;
        /**
         * @hidden
         */
        this.longSwipes = true;
        /**
         * @hidden
         */
        this.longSwipesRatio = 0.5;
        /**
         * @hidden
         */
        this.longSwipesMs = 300;
        /**
         * @hidden
         */
        this.followFinger = true;
        /**
         * @hidden
         */
        this.onlyExternal = false;
        /**
         * @hidden
         */
        this.threshold = 0;
        /**
         * @hidden
         */
        this.touchMoveStopPropagation = true;
        /**
         * @hidden
         */
        this.touchReleaseOnEdges = false;
        // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
        /**
         * @hidden
         */
        this.iOSEdgeSwipeDetection = false;
        /**
         * @hidden
         */
        this.iOSEdgeSwipeThreshold = 20;
        // Pagination
        /**
         * @hidden
         */
        this.paginationClickable = false;
        /**
         * @hidden
         */
        this.paginationHide = false;
        // Resistance
        /** @hidden */
        this.resistance = true;
        /** @hidden */
        this.resistanceRatio = 0.85;
        // Progress
        /** @hidden */
        this.watchSlidesProgress = false;
        /** @hidden */
        this.watchSlidesVisibility = false;
        // Clicks
        /**
         * @hidden
         */
        this.preventClicks = true;
        /**
         * @hidden
         */
        this.preventClicksPropagation = true;
        /**
         * @hidden
         */
        this.slideToClickedSlide = false;
        // loop
        /**
         * @hidden
         */
        this.loopAdditionalSlides = 0;
        /**
         * @hidden
         */
        this.loopedSlides = null;
        // Swiping/no swiping
        /**
         * @hidden
         */
        this.swipeHandler = null;
        /**
         * @hidden
         */
        this.noSwiping = true;
        // Callbacks
        /** @hidden */
        this.runCallbacksOnInit = true;
        // Controller
        this.controlBy = 'slide';
        this.controlInverse = false;
        // Keyboard
        /**
         * @hidden
         */
        this.keyboardControl = true;
        // Effects
        /**
         * @hidden
         */
        this.coverflow = {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
        };
        /**
         * @hidden
         */
        this.flip = {
            slideShadows: true,
            limitRotation: true
        };
        /**
         * @hidden
         */
        this.cube = {
            slideShadows: true,
            shadow: true,
            shadowOffset: 20,
            shadowScale: 0.94
        };
        /**
         * @hidden
         */
        this.fade = {
            crossFade: false
        };
        // Accessibility
        /**
         * @hidden
         */
        this.prevSlideMessage = 'Previous slide';
        /**
         * @hidden
         */
        this.nextSlideMessage = 'Next slide';
        /**
         * @hidden
         */
        this.firstSlideMessage = 'This is the first slide';
        /**
         * @hidden
         */
        this.lastSlideMessage = 'This is the last slide';
        /**
         * @output {Slides} Emitted when a slide change starts.
         */
        this.ionSlideWillChange = new EventEmitter();
        /**
         * @output {Slides} Emitted when a slide change ends.
         */
        this.ionSlideDidChange = new EventEmitter();
        /**
         * @output {Slides} Emitted when a slide moves.
         */
        this.ionSlideDrag = new EventEmitter();
        /**
         * @output {Slides} Emitted when slides reaches its beginning (initial position).
         */
        this.ionSlideReachStart = new EventEmitter();
        /**
         * @output {Slides} Emitted when slides reaches its last slide.
         */
        this.ionSlideReachEnd = new EventEmitter();
        /**
         * @output {Slides} Emitted when a slide moves.
         */
        this.ionSlideAutoplay = new EventEmitter();
        /**
         * @output {Slides} Emitted when a autoplay starts.
         */
        this.ionSlideAutoplayStart = new EventEmitter();
        /**
         * @output {Slides} Emitted when a autoplay stops.
         */
        this.ionSlideAutoplayStop = new EventEmitter();
        /**
         * @output {Slides} Emitted when a slide change starts with the "forward" direction.
         */
        this.ionSlideNextStart = new EventEmitter();
        /**
         * @output {Slides} Emitted when a slide change starts with the "backward" direction.
         */
        this.ionSlidePrevStart = new EventEmitter();
        /**
         * @output {Slides} Emitted when a slide change ends with the "forward" direction.
         */
        this.ionSlideNextEnd = new EventEmitter();
        /**
         * @output {Slides} Emitted when a slide change ends with the "backward" direction.
         */
        this.ionSlidePrevEnd = new EventEmitter();
        /**
         * @output {Slides} Emitted when the user taps/clicks on the slide's container.
         */
        this.ionSlideTap = new EventEmitter();
        /**
         * @output {Slides} Emitted when the user double taps on the slide's container.
         */
        this.ionSlideDoubleTap = new EventEmitter();
        /** @hidden */
        this.ionSlideProgress = new EventEmitter();
        /** @hidden */
        this.ionSlideTransitionStart = new EventEmitter();
        /** @hidden */
        this.ionSlideTransitionEnd = new EventEmitter();
        /** @hidden */
        this.ionSlideTouchStart = new EventEmitter();
        /** @hidden */
        this.ionSlideTouchEnd = new EventEmitter();
        this._unregs = [];
        /** @internal */
        this._allowSwipeToNext = true;
        /** @internal */
        this._allowSwipeToPrev = true;
        this._zone = zone;
        this.id = ++slidesId;
        this.slideId = 'slides-' + this.id;
        this.setElementClass(this.slideId, true);
        // only initialize the slides whent the content is ready
        if (viewCtrl) {
            var subscription = viewCtrl.readReady.subscribe(() => {
                subscription.unsubscribe();
                this._initSlides();
            });
        }
    }
    /**
     * @input {number} Delay between transitions (in milliseconds). If this
     * parameter is not passed, autoplay is disabled. Default does
     * not have a value and does not autoplay.
     * Default: `null`.
     */
    get autoplay() {
        return this._autoplayMs;
    }
    set autoplay(val) {
        this._autoplayMs = parseInt(val, 10);
    }
    /**
     * @input {Slides} Pass another Slides instance or array of Slides instances
     * that should be controlled by this Slides instance.
     * Default: `null`.
     */
    get control() {
        return this._control;
    }
    set control(val) {
        if (val instanceof Slides || Array.isArray(val)) {
            this._control = val;
        }
    }
    /**
     * @input {string} The animation effect of the slides.
     * Possible values are: `slide`, `fade`, `cube`, `coverflow` or `flip`.
     * Default: `slide`.
     */
    get effect() {
        return this._effectName;
    }
    set effect(effectName) {
        if (SWIPER_EFFECTS[effectName]) {
            this._effectName = effectName;
        }
    }
    /**
     * @input {string}  Swipe direction: 'horizontal' or 'vertical'.
     * Default: `horizontal`.
     */
    get direction() {
        return this._direction;
    }
    set direction(val) {
        if (val === 'horizontal' || val === 'vertical') {
            this._direction = val;
        }
    }
    /**
     * @input {number}  Index number of initial slide. Default: `0`.
     */
    get initialSlide() {
        return this._initialSlide;
    }
    set initialSlide(val) {
        this._initialSlide = parseInt(val, 10);
    }
    /**
     * @input {boolean} If true, continuously loop from the last slide to the
     * first slide.
     */
    get loop() {
        return this._isLoop;
    }
    set loop(val) {
        this._isLoop = isTrueProperty(val);
    }
    /**
     * @input {boolean}  If true, show the pager.
     */
    get pager() {
        return this._pager;
    }
    set pager(val) {
        this._pager = isTrueProperty(val);
    }
    /**
     * @input {string} If dir attribute is equal to rtl, set interal _rtl to true;
     */
    set dir(val) {
        this._rtl = (val.toLowerCase() === 'rtl');
    }
    /**
     * @input {string}  Type of pagination. Possible values are:
     * `bullets`, `fraction`, `progress`. Default: `bullets`.
     * (Note that the pager will not show unless `pager` input
     * is set to true).
     */
    get paginationType() {
        return this._paginationType;
    }
    set paginationType(val) {
        if (val === 'bullets' || val === 'fraction' || val === 'progress') {
            this._paginationType = val;
        }
    }
    /**
     * @input {boolean} If true, allows you to use "parallaxed" elements inside of
     * slider.
     */
    get parallax() {
        return this._isParallax;
    }
    set parallax(val) {
        this._isParallax = isTrueProperty(val);
    }
    /**
     * @input {number} Duration of transition between slides
     * (in milliseconds). Default: `300`.
     */
    get speed() {
        return this._speedMs;
    }
    set speed(val) {
        this._speedMs = parseInt(val, 10);
    }
    /**
     * @input {boolean} If true, enables zooming functionality.
     */
    get zoom() {
        return this._isZoom;
    }
    set zoom(val) {
        this._isZoom = isTrueProperty(val);
    }
    // Slides grid
    /**
     * @input {number} Distance between slides in px. Default: `0`.
     */
    get spaceBetween() {
        return this._spaceBetween;
    }
    set spaceBetween(val) {
        this._spaceBetween = parseInt(val, 10);
    }
    /**
     * @input {number} Slides per view. Slides visible at the same time. Default: `1`.
     */
    get slidesPerView() {
        return this._slidesPerView;
    }
    set slidesPerView(val) {
        this._slidesPerView = val === 'auto' ? 'auto' : parseFloat(val);
    }
    /**
     * @input {boolean} Center a slide in the middle of the screen.
     */
    get centeredSlides() {
        return this._centeredSlides;
    }
    set centeredSlides(val) {
        this._centeredSlides = isTrueProperty(val);
    }
    _initSlides() {
        if (!this._init) {
            (void 0) /* console.debug */;
            var s = this;
            var plt = s._plt;
            s.container = this.getNativeElement().children[0];
            // init swiper core
            initSwiper(s, plt);
            // init core event listeners
            this._unregs.push(initEvents(s, plt));
            if (this.zoom) {
                // init zoom event listeners
                this._unregs.push(initZoom(s, plt));
            }
            if (this.keyboardControl) {
                // init keyboard event listeners
                s.enableKeyboardControl(true);
            }
            this._init = true;
        }
    }
    /**
     * @hidden
     */
    ngAfterContentInit() {
        this._plt.timeout(() => {
            this._initSlides();
        }, 300);
    }
    /**
     * Update the underlying slider implementation. Call this if you've added or removed
     * child slides.
     */
    update(debounce = 300) {
        if (this._init) {
            this._plt.cancelTimeout(this._tmr);
            this._tmr = this._plt.timeout(() => {
                update(this, this._plt);
                // Don't allow pager to show with > 10 slides
                if (this.length() > 10) {
                    this.paginationType = undefined;
                }
            }, debounce);
        }
    }
    resize() {
        if (this._init) {
        }
    }
    /**
     * Transition to the specified slide.
     *
     * @param {number} index  The index number of the slide.
     * @param {number} [speed]  Transition duration (in ms).
     * @param {boolean} [runCallbacks] Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
     */
    slideTo(index, speed, runCallbacks) {
        slideTo(this, this._plt, index, speed, runCallbacks);
    }
    /**
     * Transition to the next slide.
     *
     * @param {number} [speed]  Transition duration (in ms).
     * @param {boolean} [runCallbacks]  Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
     */
    slideNext(speed, runCallbacks) {
        slideNext(this, this._plt, runCallbacks, speed, true);
    }
    /**
     * Transition to the previous slide.
     *
     * @param {number} [speed]  Transition duration (in ms).
     * @param {boolean} [runCallbacks]  Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
     */
    slidePrev(speed, runCallbacks) {
        slidePrev(this, this._plt, runCallbacks, speed, true);
    }
    /**
     * Get the index of the active slide.
     *
     * @returns {number} The index number of the current slide.
     */
    getActiveIndex() {
        return this._activeIndex;
    }
    /**
     * Get the index of the previous slide.
     *
     * @returns {number} The index number of the previous slide.
     */
    getPreviousIndex() {
        return this._previousIndex;
    }
    /**
     * Get the total number of slides.
     *
     * @returns {number} The total number of slides.
     */
    length() {
        return this._slides.length;
    }
    /**
     * Get whether or not the current slide is the last slide.
     *
     * @returns {boolean} If the slide is the last slide or not.
     */
    isEnd() {
        return this._isEnd;
    }
    /**
     * Get whether or not the current slide is the first slide.
     *
     * @returns {boolean} If the slide is the first slide or not.
     */
    isBeginning() {
        return this._isBeginning;
    }
    /**
     * Start auto play.
     */
    startAutoplay() {
        startAutoplay(this, this._plt);
    }
    /**
     * Stop auto play.
     */
    stopAutoplay() {
        stopAutoplay(this);
    }
    /**
     * Lock or unlock the ability to slide to the next slides.
     * @param {boolean} shouldLockSwipeToNext If set to true the user will not be able to swipe to the next slide.
     * Set to false to unlock this behaviour.
     */
    lockSwipeToNext(shouldLockSwipeToNext) {
        this._allowSwipeToNext = !shouldLockSwipeToNext;
    }
    /**
     * Lock or unlock the ability to slide to the previous slides.
     * @param {boolean} shouldLockSwipeToPrev If set to true the user will not be able to swipe to the previous slide.
     * Set to false to unlock this behaviour.
     */
    lockSwipeToPrev(shouldLockSwipeToPrev) {
        this._allowSwipeToPrev = !shouldLockSwipeToPrev;
    }
    /**
     * Lock or unlock the ability to slide to change slides.
     * @param {boolean} shouldLockSwipes If set to true user can not swipe in either direction on slide.
     * False allows swiping in both directions.
     */
    lockSwipes(shouldLockSwipes) {
        this._allowSwipeToNext = this._allowSwipeToPrev = !shouldLockSwipes;
    }
    /**
     * Enable or disable keyboard control.
     * @param {boolean} shouldEnableKeyboard If set to true the slider can be controled by a keyboard.
     */
    enableKeyboardControl(shouldEnableKeyboard) {
        enableKeyboardControl(this, this._plt, shouldEnableKeyboard);
    }
    /**
     * @hidden
     */
    ngOnDestroy() {
        this._init = false;
        this._unregs.forEach(unReg => {
            unReg();
        });
        this._unregs.length = 0;
        destroySwiper(this);
        this.enableKeyboardControl(false);
    }
}
Slides.decorators = [
    { type: Component, args: [{
                selector: 'ion-slides',
                template: '<div class="swiper-container" [attr.dir]="_rtl? \'rtl\' : null">' +
                    '<div class="swiper-wrapper">' +
                    '<ng-content></ng-content>' +
                    '</div>' +
                    '<div [class.hide]="!pager" class="swiper-pagination"></div>' +
                    '</div>',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
            },] },
];
/** @nocollapse */
Slides.ctorParameters = () => [
    { type: Config, },
    { type: Platform, },
    { type: NgZone, },
    { type: ViewController, decorators: [{ type: Optional },] },
    { type: ElementRef, },
    { type: Renderer, },
];
Slides.propDecorators = {
    'autoplay': [{ type: Input },],
    'control': [{ type: Input },],
    'effect': [{ type: Input },],
    'direction': [{ type: Input },],
    'initialSlide': [{ type: Input },],
    'loop': [{ type: Input },],
    'pager': [{ type: Input },],
    'dir': [{ type: Input },],
    'paginationType': [{ type: Input },],
    'parallax': [{ type: Input },],
    'speed': [{ type: Input },],
    'zoom': [{ type: Input },],
    'spaceBetween': [{ type: Input },],
    'slidesPerView': [{ type: Input },],
    'centeredSlides': [{ type: Input },],
    'ionSlideWillChange': [{ type: Output },],
    'ionSlideDidChange': [{ type: Output },],
    'ionSlideDrag': [{ type: Output },],
    'ionSlideReachStart': [{ type: Output },],
    'ionSlideReachEnd': [{ type: Output },],
    'ionSlideAutoplay': [{ type: Output },],
    'ionSlideAutoplayStart': [{ type: Output },],
    'ionSlideAutoplayStop': [{ type: Output },],
    'ionSlideNextStart': [{ type: Output },],
    'ionSlidePrevStart': [{ type: Output },],
    'ionSlideNextEnd': [{ type: Output },],
    'ionSlidePrevEnd': [{ type: Output },],
    'ionSlideTap': [{ type: Output },],
    'ionSlideDoubleTap': [{ type: Output },],
};
let slidesId = -1;
//# sourceMappingURL=slides.js.map