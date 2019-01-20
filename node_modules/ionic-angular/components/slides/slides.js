var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Slides = (function (_super) {
    __extends(Slides, _super);
    function Slides(config, _plt, zone, viewCtrl, elementRef, renderer) {
        var _this = _super.call(this, config, elementRef, renderer, 'slides') || this;
        _this._plt = _plt;
        _this._control = null;
        _this._effectName = 'slide';
        _this._direction = 'horizontal';
        _this._initialSlide = 0;
        _this._isLoop = false;
        _this._pager = false;
        _this._paginationType = 'bullets';
        /** @hidden */
        _this.paginationBulletRender = null;
        _this._isParallax = false;
        _this._speedMs = 300;
        _this._isZoom = false;
        /**
         * @hidden
         * Enabled this option and swiper will be operated as usual except it will
         * not move, real translate values on wrapper will not be set. Useful when
         * you may need to create custom slide transition.
         */
        _this.virtualTranslate = false;
        /**
         * @hidden
         * Set to true to round values of slides width and height to prevent blurry
         * texts on usual resolution screens (if you have such)
         */
        _this.roundLengths = false;
        _this._spaceBetween = 0;
        _this._slidesPerView = 1;
        _this._centeredSlides = false;
        /**
         * @hidden
         */
        _this.slidesPerColumn = 1;
        /**
         * @hidden
         */
        _this.slidesPerColumnFill = 'column';
        /**
         * @hidden
         */
        _this.slidesPerGroup = 1;
        /**
         * @hidden
         */
        _this.slidesOffsetBefore = 0;
        /**
         * @hidden
         */
        _this.slidesOffsetAfter = 0;
        // autoplay
        /**
         * @hidden
         */
        _this.autoplayDisableOnInteraction = true;
        /**
         * @hidden
         */
        _this.autoplayStopOnLast = false;
        // Free mode
        /**
         * @hidden
         */
        _this.freeMode = false;
        /**
         * @hidden
         */
        _this.freeModeMomentum = true;
        /**
         * @hidden
         */
        _this.freeModeMomentumRatio = 1;
        /**
         * @hidden
         */
        _this.freeModeMomentumBounce = true;
        /**
         * @hidden
         */
        _this.freeModeMomentumBounceRatio = 1;
        /**
         * @hidden
         */
        _this.freeModeMomentumVelocityRatio = 1;
        /**
         * @hidden
         */
        _this.freeModeSticky = false;
        /**
         * @hidden
         */
        _this.freeModeMinimumVelocity = 0.02;
        // Autoheight
        /**
         * @hidden
         */
        _this.autoHeight = false;
        // Set wrapper width
        /**
         * @hidden
         */
        _this.setWrapperSize = false;
        // Zoom
        /**
         * @hidden
         */
        _this.zoomMax = 3;
        /**
         * @hidden
         */
        _this.zoomMin = 1;
        /**
         * @hidden
         */
        _this.zoomToggle = true;
        // Touches
        /**
         * @hidden
         */
        _this.touchRatio = 1;
        /**
         * @hidden
         */
        _this.touchAngle = 45;
        /**
         * @hidden
         */
        _this.simulateTouch = true;
        /**
         * @hidden
         */
        _this.shortSwipes = true;
        /**
         * @hidden
         */
        _this.longSwipes = true;
        /**
         * @hidden
         */
        _this.longSwipesRatio = 0.5;
        /**
         * @hidden
         */
        _this.longSwipesMs = 300;
        /**
         * @hidden
         */
        _this.followFinger = true;
        /**
         * @hidden
         */
        _this.onlyExternal = false;
        /**
         * @hidden
         */
        _this.threshold = 0;
        /**
         * @hidden
         */
        _this.touchMoveStopPropagation = true;
        /**
         * @hidden
         */
        _this.touchReleaseOnEdges = false;
        // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
        /**
         * @hidden
         */
        _this.iOSEdgeSwipeDetection = false;
        /**
         * @hidden
         */
        _this.iOSEdgeSwipeThreshold = 20;
        // Pagination
        /**
         * @hidden
         */
        _this.paginationClickable = false;
        /**
         * @hidden
         */
        _this.paginationHide = false;
        // Resistance
        /** @hidden */
        _this.resistance = true;
        /** @hidden */
        _this.resistanceRatio = 0.85;
        // Progress
        /** @hidden */
        _this.watchSlidesProgress = false;
        /** @hidden */
        _this.watchSlidesVisibility = false;
        // Clicks
        /**
         * @hidden
         */
        _this.preventClicks = true;
        /**
         * @hidden
         */
        _this.preventClicksPropagation = true;
        /**
         * @hidden
         */
        _this.slideToClickedSlide = false;
        // loop
        /**
         * @hidden
         */
        _this.loopAdditionalSlides = 0;
        /**
         * @hidden
         */
        _this.loopedSlides = null;
        // Swiping/no swiping
        /**
         * @hidden
         */
        _this.swipeHandler = null;
        /**
         * @hidden
         */
        _this.noSwiping = true;
        // Callbacks
        /** @hidden */
        _this.runCallbacksOnInit = true;
        // Controller
        _this.controlBy = 'slide';
        _this.controlInverse = false;
        // Keyboard
        /**
         * @hidden
         */
        _this.keyboardControl = true;
        // Effects
        /**
         * @hidden
         */
        _this.coverflow = {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true
        };
        /**
         * @hidden
         */
        _this.flip = {
            slideShadows: true,
            limitRotation: true
        };
        /**
         * @hidden
         */
        _this.cube = {
            slideShadows: true,
            shadow: true,
            shadowOffset: 20,
            shadowScale: 0.94
        };
        /**
         * @hidden
         */
        _this.fade = {
            crossFade: false
        };
        // Accessibility
        /**
         * @hidden
         */
        _this.prevSlideMessage = 'Previous slide';
        /**
         * @hidden
         */
        _this.nextSlideMessage = 'Next slide';
        /**
         * @hidden
         */
        _this.firstSlideMessage = 'This is the first slide';
        /**
         * @hidden
         */
        _this.lastSlideMessage = 'This is the last slide';
        /**
         * @output {Slides} Emitted when a slide change starts.
         */
        _this.ionSlideWillChange = new EventEmitter();
        /**
         * @output {Slides} Emitted when a slide change ends.
         */
        _this.ionSlideDidChange = new EventEmitter();
        /**
         * @output {Slides} Emitted when a slide moves.
         */
        _this.ionSlideDrag = new EventEmitter();
        /**
         * @output {Slides} Emitted when slides reaches its beginning (initial position).
         */
        _this.ionSlideReachStart = new EventEmitter();
        /**
         * @output {Slides} Emitted when slides reaches its last slide.
         */
        _this.ionSlideReachEnd = new EventEmitter();
        /**
         * @output {Slides} Emitted when a slide moves.
         */
        _this.ionSlideAutoplay = new EventEmitter();
        /**
         * @output {Slides} Emitted when a autoplay starts.
         */
        _this.ionSlideAutoplayStart = new EventEmitter();
        /**
         * @output {Slides} Emitted when a autoplay stops.
         */
        _this.ionSlideAutoplayStop = new EventEmitter();
        /**
         * @output {Slides} Emitted when a slide change starts with the "forward" direction.
         */
        _this.ionSlideNextStart = new EventEmitter();
        /**
         * @output {Slides} Emitted when a slide change starts with the "backward" direction.
         */
        _this.ionSlidePrevStart = new EventEmitter();
        /**
         * @output {Slides} Emitted when a slide change ends with the "forward" direction.
         */
        _this.ionSlideNextEnd = new EventEmitter();
        /**
         * @output {Slides} Emitted when a slide change ends with the "backward" direction.
         */
        _this.ionSlidePrevEnd = new EventEmitter();
        /**
         * @output {Slides} Emitted when the user taps/clicks on the slide's container.
         */
        _this.ionSlideTap = new EventEmitter();
        /**
         * @output {Slides} Emitted when the user double taps on the slide's container.
         */
        _this.ionSlideDoubleTap = new EventEmitter();
        /** @hidden */
        _this.ionSlideProgress = new EventEmitter();
        /** @hidden */
        _this.ionSlideTransitionStart = new EventEmitter();
        /** @hidden */
        _this.ionSlideTransitionEnd = new EventEmitter();
        /** @hidden */
        _this.ionSlideTouchStart = new EventEmitter();
        /** @hidden */
        _this.ionSlideTouchEnd = new EventEmitter();
        _this._unregs = [];
        /** @internal */
        _this._allowSwipeToNext = true;
        /** @internal */
        _this._allowSwipeToPrev = true;
        _this._zone = zone;
        _this.id = ++slidesId;
        _this.slideId = 'slides-' + _this.id;
        _this.setElementClass(_this.slideId, true);
        // only initialize the slides whent the content is ready
        if (viewCtrl) {
            var subscription = viewCtrl.readReady.subscribe(function () {
                subscription.unsubscribe();
                _this._initSlides();
            });
        }
        return _this;
    }
    Object.defineProperty(Slides.prototype, "autoplay", {
        /**
         * @input {number} Delay between transitions (in milliseconds). If this
         * parameter is not passed, autoplay is disabled. Default does
         * not have a value and does not autoplay.
         * Default: `null`.
         */
        get: function () {
            return this._autoplayMs;
        },
        set: function (val) {
            this._autoplayMs = parseInt(val, 10);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "control", {
        /**
         * @input {Slides} Pass another Slides instance or array of Slides instances
         * that should be controlled by this Slides instance.
         * Default: `null`.
         */
        get: function () {
            return this._control;
        },
        set: function (val) {
            if (val instanceof Slides || Array.isArray(val)) {
                this._control = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "effect", {
        /**
         * @input {string} The animation effect of the slides.
         * Possible values are: `slide`, `fade`, `cube`, `coverflow` or `flip`.
         * Default: `slide`.
         */
        get: function () {
            return this._effectName;
        },
        set: function (effectName) {
            if (SWIPER_EFFECTS[effectName]) {
                this._effectName = effectName;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "direction", {
        /**
         * @input {string}  Swipe direction: 'horizontal' or 'vertical'.
         * Default: `horizontal`.
         */
        get: function () {
            return this._direction;
        },
        set: function (val) {
            if (val === 'horizontal' || val === 'vertical') {
                this._direction = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "initialSlide", {
        /**
         * @input {number}  Index number of initial slide. Default: `0`.
         */
        get: function () {
            return this._initialSlide;
        },
        set: function (val) {
            this._initialSlide = parseInt(val, 10);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "loop", {
        /**
         * @input {boolean} If true, continuously loop from the last slide to the
         * first slide.
         */
        get: function () {
            return this._isLoop;
        },
        set: function (val) {
            this._isLoop = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "pager", {
        /**
         * @input {boolean}  If true, show the pager.
         */
        get: function () {
            return this._pager;
        },
        set: function (val) {
            this._pager = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "dir", {
        /**
         * @input {string} If dir attribute is equal to rtl, set interal _rtl to true;
         */
        set: function (val) {
            this._rtl = (val.toLowerCase() === 'rtl');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "paginationType", {
        /**
         * @input {string}  Type of pagination. Possible values are:
         * `bullets`, `fraction`, `progress`. Default: `bullets`.
         * (Note that the pager will not show unless `pager` input
         * is set to true).
         */
        get: function () {
            return this._paginationType;
        },
        set: function (val) {
            if (val === 'bullets' || val === 'fraction' || val === 'progress') {
                this._paginationType = val;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "parallax", {
        /**
         * @input {boolean} If true, allows you to use "parallaxed" elements inside of
         * slider.
         */
        get: function () {
            return this._isParallax;
        },
        set: function (val) {
            this._isParallax = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "speed", {
        /**
         * @input {number} Duration of transition between slides
         * (in milliseconds). Default: `300`.
         */
        get: function () {
            return this._speedMs;
        },
        set: function (val) {
            this._speedMs = parseInt(val, 10);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "zoom", {
        /**
         * @input {boolean} If true, enables zooming functionality.
         */
        get: function () {
            return this._isZoom;
        },
        set: function (val) {
            this._isZoom = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "spaceBetween", {
        // Slides grid
        /**
         * @input {number} Distance between slides in px. Default: `0`.
         */
        get: function () {
            return this._spaceBetween;
        },
        set: function (val) {
            this._spaceBetween = parseInt(val, 10);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "slidesPerView", {
        /**
         * @input {number} Slides per view. Slides visible at the same time. Default: `1`.
         */
        get: function () {
            return this._slidesPerView;
        },
        set: function (val) {
            this._slidesPerView = val === 'auto' ? 'auto' : parseFloat(val);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slides.prototype, "centeredSlides", {
        /**
         * @input {boolean} Center a slide in the middle of the screen.
         */
        get: function () {
            return this._centeredSlides;
        },
        set: function (val) {
            this._centeredSlides = isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    Slides.prototype._initSlides = function () {
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
    };
    /**
     * @hidden
     */
    Slides.prototype.ngAfterContentInit = function () {
        var _this = this;
        this._plt.timeout(function () {
            _this._initSlides();
        }, 300);
    };
    /**
     * Update the underlying slider implementation. Call this if you've added or removed
     * child slides.
     */
    Slides.prototype.update = function (debounce) {
        var _this = this;
        if (debounce === void 0) { debounce = 300; }
        if (this._init) {
            this._plt.cancelTimeout(this._tmr);
            this._tmr = this._plt.timeout(function () {
                update(_this, _this._plt);
                // Don't allow pager to show with > 10 slides
                if (_this.length() > 10) {
                    _this.paginationType = undefined;
                }
            }, debounce);
        }
    };
    Slides.prototype.resize = function () {
        if (this._init) {
        }
    };
    /**
     * Transition to the specified slide.
     *
     * @param {number} index  The index number of the slide.
     * @param {number} [speed]  Transition duration (in ms).
     * @param {boolean} [runCallbacks] Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
     */
    Slides.prototype.slideTo = function (index, speed, runCallbacks) {
        slideTo(this, this._plt, index, speed, runCallbacks);
    };
    /**
     * Transition to the next slide.
     *
     * @param {number} [speed]  Transition duration (in ms).
     * @param {boolean} [runCallbacks]  Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
     */
    Slides.prototype.slideNext = function (speed, runCallbacks) {
        slideNext(this, this._plt, runCallbacks, speed, true);
    };
    /**
     * Transition to the previous slide.
     *
     * @param {number} [speed]  Transition duration (in ms).
     * @param {boolean} [runCallbacks]  Whether or not to emit the `ionSlideWillChange`/`ionSlideDidChange` events. Default true.
     */
    Slides.prototype.slidePrev = function (speed, runCallbacks) {
        slidePrev(this, this._plt, runCallbacks, speed, true);
    };
    /**
     * Get the index of the active slide.
     *
     * @returns {number} The index number of the current slide.
     */
    Slides.prototype.getActiveIndex = function () {
        return this._activeIndex;
    };
    /**
     * Get the index of the previous slide.
     *
     * @returns {number} The index number of the previous slide.
     */
    Slides.prototype.getPreviousIndex = function () {
        return this._previousIndex;
    };
    /**
     * Get the total number of slides.
     *
     * @returns {number} The total number of slides.
     */
    Slides.prototype.length = function () {
        return this._slides.length;
    };
    /**
     * Get whether or not the current slide is the last slide.
     *
     * @returns {boolean} If the slide is the last slide or not.
     */
    Slides.prototype.isEnd = function () {
        return this._isEnd;
    };
    /**
     * Get whether or not the current slide is the first slide.
     *
     * @returns {boolean} If the slide is the first slide or not.
     */
    Slides.prototype.isBeginning = function () {
        return this._isBeginning;
    };
    /**
     * Start auto play.
     */
    Slides.prototype.startAutoplay = function () {
        startAutoplay(this, this._plt);
    };
    /**
     * Stop auto play.
     */
    Slides.prototype.stopAutoplay = function () {
        stopAutoplay(this);
    };
    /**
     * Lock or unlock the ability to slide to the next slides.
     * @param {boolean} shouldLockSwipeToNext If set to true the user will not be able to swipe to the next slide.
     * Set to false to unlock this behaviour.
     */
    Slides.prototype.lockSwipeToNext = function (shouldLockSwipeToNext) {
        this._allowSwipeToNext = !shouldLockSwipeToNext;
    };
    /**
     * Lock or unlock the ability to slide to the previous slides.
     * @param {boolean} shouldLockSwipeToPrev If set to true the user will not be able to swipe to the previous slide.
     * Set to false to unlock this behaviour.
     */
    Slides.prototype.lockSwipeToPrev = function (shouldLockSwipeToPrev) {
        this._allowSwipeToPrev = !shouldLockSwipeToPrev;
    };
    /**
     * Lock or unlock the ability to slide to change slides.
     * @param {boolean} shouldLockSwipes If set to true user can not swipe in either direction on slide.
     * False allows swiping in both directions.
     */
    Slides.prototype.lockSwipes = function (shouldLockSwipes) {
        this._allowSwipeToNext = this._allowSwipeToPrev = !shouldLockSwipes;
    };
    /**
     * Enable or disable keyboard control.
     * @param {boolean} shouldEnableKeyboard If set to true the slider can be controled by a keyboard.
     */
    Slides.prototype.enableKeyboardControl = function (shouldEnableKeyboard) {
        enableKeyboardControl(this, this._plt, shouldEnableKeyboard);
    };
    /**
     * @hidden
     */
    Slides.prototype.ngOnDestroy = function () {
        this._init = false;
        this._unregs.forEach(function (unReg) {
            unReg();
        });
        this._unregs.length = 0;
        destroySwiper(this);
        this.enableKeyboardControl(false);
    };
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
    Slides.ctorParameters = function () { return [
        { type: Config, },
        { type: Platform, },
        { type: NgZone, },
        { type: ViewController, decorators: [{ type: Optional },] },
        { type: ElementRef, },
        { type: Renderer, },
    ]; };
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
    return Slides;
}(Ion));
export { Slides };
var slidesId = -1;
//# sourceMappingURL=slides.js.map