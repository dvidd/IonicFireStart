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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@angular/core", "./nav-util", "./nav-util", "../util/util", "./view-controller", "../components/ion", "./nav-controller", "./nav-params", "./swipe-back"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require("@angular/core");
    var nav_util_1 = require("./nav-util");
    var nav_util_2 = require("./nav-util");
    var util_1 = require("../util/util");
    var view_controller_1 = require("./view-controller");
    var ion_1 = require("../components/ion");
    var nav_controller_1 = require("./nav-controller");
    var nav_params_1 = require("./nav-params");
    var swipe_back_1 = require("./swipe-back");
    /**
     * @hidden
     * This class is for internal use only. It is not exported publicly.
     */
    var NavControllerBase = (function (_super) {
        __extends(NavControllerBase, _super);
        function NavControllerBase(parent, _app, config, plt, elementRef, _zone, renderer, _cfr, _gestureCtrl, _trnsCtrl, _linker, _domCtrl, _errHandler) {
            var _this = _super.call(this, config, elementRef, renderer) || this;
            _this.parent = parent;
            _this._app = _app;
            _this.config = config;
            _this.plt = plt;
            _this._zone = _zone;
            _this._cfr = _cfr;
            _this._gestureCtrl = _gestureCtrl;
            _this._trnsCtrl = _trnsCtrl;
            _this._linker = _linker;
            _this._domCtrl = _domCtrl;
            _this._errHandler = _errHandler;
            _this._ids = -1;
            _this._init = false;
            _this._queue = [];
            _this._trnsId = null;
            _this._trnsTm = false;
            _this._views = [];
            _this._zIndexOffset = 0;
            _this.viewDidLoad = new core_1.EventEmitter();
            _this.viewWillEnter = new core_1.EventEmitter();
            _this.viewDidEnter = new core_1.EventEmitter();
            _this.viewWillLeave = new core_1.EventEmitter();
            _this.viewDidLeave = new core_1.EventEmitter();
            _this.viewWillUnload = new core_1.EventEmitter();
            _this._sbEnabled = config.getBoolean('swipeBackEnabled');
            _this._children = [];
            _this.id = 'n' + (++ctrlIds);
            _this._destroyed = false;
            return _this;
        }
        Object.defineProperty(NavControllerBase.prototype, "swipeBackEnabled", {
            get: function () {
                return this._sbEnabled;
            },
            set: function (val) {
                this._sbEnabled = util_1.isTrueProperty(val);
                this._swipeBackCheck();
            },
            enumerable: true,
            configurable: true
        });
        NavControllerBase.prototype.push = function (page, params, opts, done) {
            return this._queueTrns({
                insertStart: -1,
                insertViews: [{ page: page, params: params }],
                opts: opts,
            }, done);
        };
        NavControllerBase.prototype.insert = function (insertIndex, page, params, opts, done) {
            return this._queueTrns({
                insertStart: insertIndex,
                insertViews: [{ page: page, params: params }],
                opts: opts,
            }, done);
        };
        NavControllerBase.prototype.insertPages = function (insertIndex, insertPages, opts, done) {
            return this._queueTrns({
                insertStart: insertIndex,
                insertViews: insertPages,
                opts: opts,
            }, done);
        };
        NavControllerBase.prototype.pop = function (opts, done) {
            return this._queueTrns({
                removeStart: -1,
                removeCount: 1,
                opts: opts,
            }, done);
        };
        NavControllerBase.prototype.popTo = function (indexOrViewCtrl, opts, done) {
            var config = {
                removeStart: -1,
                removeCount: -1,
                opts: opts
            };
            if (view_controller_1.isViewController(indexOrViewCtrl)) {
                config.removeView = indexOrViewCtrl;
                config.removeStart = 1;
            }
            else if (util_1.isNumber(indexOrViewCtrl)) {
                config.removeStart = indexOrViewCtrl + 1;
            }
            return this._queueTrns(config, done);
        };
        NavControllerBase.prototype.popToRoot = function (opts, done) {
            return this._queueTrns({
                removeStart: 1,
                removeCount: -1,
                opts: opts,
            }, done);
        };
        NavControllerBase.prototype.popAll = function () {
            var promises = [];
            for (var i = this._views.length - 1; i >= 0; i--) {
                promises.push(this.pop(null));
            }
            return Promise.all(promises);
        };
        NavControllerBase.prototype.remove = function (startIndex, removeCount, opts, done) {
            if (removeCount === void 0) { removeCount = 1; }
            return this._queueTrns({
                removeStart: startIndex,
                removeCount: removeCount,
                opts: opts,
            }, done);
        };
        NavControllerBase.prototype.removeView = function (viewController, opts, done) {
            return this._queueTrns({
                removeView: viewController,
                removeStart: 0,
                removeCount: 1,
                opts: opts,
            }, done);
        };
        NavControllerBase.prototype.setRoot = function (pageOrViewCtrl, params, opts, done) {
            return this.setPages([{ page: pageOrViewCtrl, params: params }], opts, done);
        };
        NavControllerBase.prototype.setPages = function (viewControllers, opts, done) {
            if (util_1.isBlank(opts)) {
                opts = {};
            }
            // if animation wasn't set to true then default it to NOT animate
            if (opts.animate !== true) {
                opts.animate = false;
            }
            return this._queueTrns({
                insertStart: 0,
                insertViews: viewControllers,
                removeStart: 0,
                removeCount: -1,
                opts: opts
            }, done);
        };
        // _queueTrns() adds a navigation stack change to the queue and schedules it to run:
        // 1. _nextTrns(): consumes the next transition in the queue
        // 2. _viewInit(): initializes enteringView if required
        // 3. _viewTest(): ensures canLeave/canEnter returns true, so the operation can continue
        // 4. _postViewInit(): add/remove the views from the navigation stack
        // 5. _transitionInit(): initializes the visual transition if required and schedules it to run
        // 6. _viewAttachToDOM(): attaches the enteringView to the DOM
        // 7. _transitionStart(): called once the transition actually starts, it initializes the Animation underneath.
        // 8. _transitionFinish(): called once the transition finishes
        // 9. _cleanup(): syncs the navigation internal state with the DOM. For example it removes the pages from the DOM or hides/show them.
        NavControllerBase.prototype._queueTrns = function (ti, done) {
            var promise = new Promise(function (resolve, reject) {
                ti.resolve = resolve;
                ti.reject = reject;
            });
            ti.done = done;
            // Normalize empty
            if (ti.insertViews && ti.insertViews.length === 0) {
                ti.insertViews = undefined;
            }
            // Enqueue transition instruction
            this._queue.push(ti);
            // if there isn't a transition already happening
            // then this will kick off this transition
            this._nextTrns();
            return promise;
        };
        NavControllerBase.prototype._success = function (result, ti) {
            if (this._queue === null) {
                this._fireError('nav controller was destroyed', ti);
                return;
            }
            this._init = true;
            this._trnsId = null;
            // ensure we're not transitioning here
            this.setTransitioning(false);
            this._swipeBackCheck();
            // let's see if there's another to kick off
            this._nextTrns();
            if (ti.done) {
                ti.done(result.hasCompleted, result.requiresTransition, result.enteringName, result.leavingName, result.direction);
            }
            ti.resolve(result.hasCompleted);
        };
        NavControllerBase.prototype._failed = function (rejectReason, ti) {
            if (this._queue === null) {
                this._fireError('nav controller was destroyed', ti);
                return;
            }
            this._trnsId = null;
            this._queue.length = 0;
            // let's see if there's another to kick off
            this.setTransitioning(false);
            this._swipeBackCheck();
            this._nextTrns();
            this._fireError(rejectReason, ti);
        };
        NavControllerBase.prototype._fireError = function (rejectReason, ti) {
            if (ti.done) {
                ti.done(false, false, rejectReason);
            }
            if (ti.reject && !this._destroyed) {
                ti.reject(rejectReason);
            }
            else {
                ti.resolve(false);
            }
        };
        NavControllerBase.prototype._nextTrns = function () {
            var _this = this;
            // this is the framework's bread 'n butta function
            // only one transition is allowed at any given time
            if (this.isTransitioning()) {
                return false;
            }
            // there is no transition happening right now
            // get the next instruction
            var ti = this._queue.shift();
            if (!ti) {
                return false;
            }
            // set that this nav is actively transitioning
            var enteringView;
            var leavingView;
            this._startTI(ti)
                .then(function () { return _this._loadLazyLoading(ti); })
                .then(function () {
                leavingView = _this.getActive();
                enteringView = _this._getEnteringView(ti, leavingView);
                if (!leavingView && !enteringView) {
                    throw 'no views in the stack to be removed';
                }
                if (enteringView && enteringView._state === nav_util_1.STATE_NEW) {
                    _this._viewInit(enteringView);
                }
                // Needs transition?
                ti.requiresTransition = (ti.enteringRequiresTransition || ti.leavingRequiresTransition) && enteringView !== leavingView;
            })
                .then(function () { return _this._viewTest(enteringView, leavingView, ti); })
                .then(function () { return _this._postViewInit(enteringView, leavingView, ti); })
                .then(function () { return _this._transition(enteringView, leavingView, ti); })
                .then(function (result) { return _this._success(result, ti); })
                .catch(function (rejectReason) { return _this._failed(rejectReason, ti); });
            return true;
        };
        NavControllerBase.prototype._startTI = function (ti) {
            var viewsLength = this._views.length;
            if (util_1.isPresent(ti.removeView)) {
                (void 0) /* assert */;
                (void 0) /* assert */;
                var index = this.indexOf(ti.removeView);
                if (index < 0) {
                    return Promise.reject('removeView was not found');
                }
                ti.removeStart += index;
            }
            if (util_1.isPresent(ti.removeStart)) {
                if (ti.removeStart < 0) {
                    ti.removeStart = (viewsLength - 1);
                }
                if (ti.removeCount < 0) {
                    ti.removeCount = (viewsLength - ti.removeStart);
                }
                ti.leavingRequiresTransition = (ti.removeCount > 0) && ((ti.removeStart + ti.removeCount) === viewsLength);
            }
            if (ti.insertViews) {
                // allow -1 to be passed in to auto push it on the end
                // and clean up the index if it's larger then the size of the stack
                if (ti.insertStart < 0 || ti.insertStart > viewsLength) {
                    ti.insertStart = viewsLength;
                }
                ti.enteringRequiresTransition = (ti.insertStart === viewsLength);
            }
            this.setTransitioning(true);
            return Promise.resolve();
        };
        NavControllerBase.prototype._loadLazyLoading = function (ti) {
            var _this = this;
            var insertViews = ti.insertViews;
            if (insertViews) {
                (void 0) /* assert */;
                return nav_util_1.convertToViews(this._linker, insertViews).then(function (viewControllers) {
                    (void 0) /* assert */;
                    viewControllers = viewControllers.filter(function (v) { return v !== null; });
                    if (viewControllers.length === 0) {
                        throw 'invalid views to insert';
                    }
                    // Check all the inserted view are correct
                    for (var i = 0; i < viewControllers.length; i++) {
                        var view = viewControllers[i];
                        var nav = view._nav;
                        if (nav && nav !== _this) {
                            throw 'inserted view was already inserted';
                        }
                        if (view._state === nav_util_1.STATE_DESTROYED) {
                            throw 'inserted view was already destroyed';
                        }
                    }
                    ti.insertViews = viewControllers;
                });
            }
            return Promise.resolve();
        };
        NavControllerBase.prototype._getEnteringView = function (ti, leavingView) {
            var insertViews = ti.insertViews;
            if (insertViews) {
                // grab the very last view of the views to be inserted
                // and initialize it as the new entering view
                return insertViews[insertViews.length - 1];
            }
            var removeStart = ti.removeStart;
            if (util_1.isPresent(removeStart)) {
                var views = this._views;
                var removeEnd = removeStart + ti.removeCount;
                var i;
                var view;
                for (i = views.length - 1; i >= 0; i--) {
                    view = views[i];
                    if ((i < removeStart || i >= removeEnd) && view !== leavingView) {
                        return view;
                    }
                }
            }
            return null;
        };
        NavControllerBase.prototype._postViewInit = function (enteringView, leavingView, ti) {
            var _this = this;
            (void 0) /* assert */;
            (void 0) /* assert */;
            (void 0) /* assert */;
            var opts = ti.opts || {};
            var insertViews = ti.insertViews;
            var removeStart = ti.removeStart;
            var removeCount = ti.removeCount;
            var view;
            var i;
            var destroyQueue;
            // there are views to remove
            if (util_1.isPresent(removeStart)) {
                (void 0) /* assert */;
                (void 0) /* assert */;
                destroyQueue = [];
                for (i = 0; i < removeCount; i++) {
                    view = this._views[i + removeStart];
                    if (view && view !== enteringView && view !== leavingView) {
                        destroyQueue.push(view);
                    }
                }
                // default the direction to "back"
                opts.direction = opts.direction || nav_util_1.DIRECTION_BACK;
            }
            var finalBalance = this._views.length + (insertViews ? insertViews.length : 0) - (removeCount ? removeCount : 0);
            (void 0) /* assert */;
            if (finalBalance === 0 && !this._isPortal) {
                console.warn("You can't remove all the pages in the navigation stack. nav.pop() is probably called too many times.", this, this.getNativeElement());
                throw 'navigation stack needs at least one root page';
            }
            // At this point the transition can not be rejected, any throw should be an error
            // there are views to insert
            if (insertViews) {
                // manually set the new view's id if an id was passed in the options
                if (util_1.isPresent(opts.id)) {
                    enteringView.id = opts.id;
                }
                // add the views to the
                for (i = 0; i < insertViews.length; i++) {
                    view = insertViews[i];
                    this._insertViewAt(view, ti.insertStart + i);
                }
                if (ti.enteringRequiresTransition) {
                    // default to forward if not already set
                    opts.direction = opts.direction || nav_util_1.DIRECTION_FORWARD;
                }
            }
            // if the views to be removed are in the beginning or middle
            // and there is not a view that needs to visually transition out
            // then just destroy them and don't transition anything
            // batch all of lifecycles together
            // let's make sure, callbacks are zoned
            if (destroyQueue && destroyQueue.length > 0) {
                this._zone.run(function () {
                    for (i = 0; i < destroyQueue.length; i++) {
                        view = destroyQueue[i];
                        _this._willLeave(view, true);
                        _this._didLeave(view);
                        _this._willUnload(view);
                    }
                });
                // once all lifecycle events has been delivered, we can safely detroy the views
                for (i = 0; i < destroyQueue.length; i++) {
                    this._destroyView(destroyQueue[i]);
                }
            }
            // set which animation it should use if it wasn't set yet
            if (ti.requiresTransition && !opts.animation) {
                if (util_1.isPresent(ti.removeStart)) {
                    opts.animation = (leavingView || enteringView).getTransitionName(opts.direction);
                }
                else {
                    opts.animation = (enteringView || leavingView).getTransitionName(opts.direction);
                }
            }
            ti.opts = opts;
        };
        /**
         * DOM WRITE
         */
        NavControllerBase.prototype._viewInit = function (enteringView) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            // render the entering view, and all child navs and views
            // entering view has not been initialized yet
            var componentProviders = core_1.ReflectiveInjector.resolve([
                { provide: nav_controller_1.NavController, useValue: this },
                { provide: view_controller_1.ViewController, useValue: enteringView },
                { provide: nav_params_1.NavParams, useValue: enteringView.getNavParams() }
            ]);
            var componentFactory = this._linker.resolveComponent(enteringView.component);
            var childInjector = core_1.ReflectiveInjector.fromResolvedProviders(componentProviders, this._viewport.parentInjector);
            // create ComponentRef and set it to the entering view
            enteringView.init(componentFactory.create(childInjector, []));
            enteringView._state = nav_util_1.STATE_INITIALIZED;
            this._preLoad(enteringView);
        };
        NavControllerBase.prototype._viewAttachToDOM = function (view, componentRef, viewport) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            // fire willLoad before change detection runs
            this._willLoad(view);
            // render the component ref instance to the DOM
            // ******** DOM WRITE ****************
            viewport.insert(componentRef.hostView, viewport.length);
            view._state = nav_util_1.STATE_ATTACHED;
            if (view._cssClass) {
                // the ElementRef of the actual ion-page created
                var pageElement = componentRef.location.nativeElement;
                // ******** DOM WRITE ****************
                this._renderer.setElementClass(pageElement, view._cssClass, true);
            }
            componentRef.changeDetectorRef.detectChanges();
            // successfully finished loading the entering view
            // fire off the "didLoad" lifecycle events
            this._zone.run(this._didLoad.bind(this, view));
        };
        NavControllerBase.prototype._viewTest = function (enteringView, leavingView, ti) {
            // Only test canLeave/canEnter if there is transition
            if (!ti.requiresTransition) {
                return Promise.resolve();
            }
            var promises = [];
            if (leavingView) {
                promises.push(leavingView._lifecycleTest('Leave'));
            }
            if (enteringView) {
                promises.push(enteringView._lifecycleTest('Enter'));
            }
            if (promises.length === 0) {
                return Promise.resolve();
            }
            // darn, async promises, gotta wait for them to resolve
            return Promise.all(promises).then(function (values) {
                if (values.some(function (result) { return result === false; })) {
                    throw 'canEnter/Leave returned false';
                }
            }).catch(function (reason) {
                // Do not
                ti.reject = null;
                throw reason;
            });
        };
        NavControllerBase.prototype._transition = function (enteringView, leavingView, ti) {
            var _this = this;
            if (!ti.requiresTransition) {
                // transition is not required, so we are already done!
                // they're inserting/removing the views somewhere in the middle or
                // beginning, so visually nothing needs to animate/transition
                // resolve immediately because there's no animation that's happening
                return Promise.resolve({
                    hasCompleted: true,
                    requiresTransition: false
                });
            }
            var opts = ti.opts;
            // figure out if this transition is the root one or a
            // child of a parent nav that has the root transition
            this._trnsId = this._trnsCtrl.getRootTrnsId(this);
            if (this._trnsId === null) {
                // this is the root transition, meaning all child navs and their views
                // should be added as a child transition to this one
                this._trnsId = this._trnsCtrl.nextId();
            }
            // create the transition options
            var animationOpts = {
                animation: opts.animation,
                direction: opts.direction,
                duration: (opts.animate === false ? 0 : opts.duration),
                easing: opts.easing,
                isRTL: this._config.plt.isRTL,
                ev: opts.ev,
            };
            // create the transition animation from the TransitionController
            // this will either create the root transition, or add it as a child transition
            var transition = this._trnsCtrl.get(this._trnsId, enteringView, leavingView, animationOpts);
            // ensure any swipeback transitions are cleared out
            this._sbTrns && this._sbTrns.destroy();
            this._sbTrns = null;
            // swipe to go back root transition
            if (transition.isRoot() && opts.progressAnimation) {
                this._sbTrns = transition;
            }
            // transition start has to be registered before attaching the view to the DOM!
            var promise = new Promise(function (resolve) { return transition.registerStart(resolve); }).then(function () {
                return _this._transitionStart(transition, enteringView, leavingView, opts);
            });
            if (enteringView && (enteringView._state === nav_util_1.STATE_INITIALIZED)) {
                // render the entering component in the DOM
                // this would also render new child navs/views
                // which may have their very own async canEnter/Leave tests
                // ******** DOM WRITE ****************
                this._viewAttachToDOM(enteringView, enteringView._cmp, this._viewport);
            }
            if (!transition.hasChildren) {
                // lowest level transition, so kick it off and let it bubble up to start all of them
                transition.start();
            }
            return promise;
        };
        NavControllerBase.prototype._transitionStart = function (transition, enteringView, leavingView, opts) {
            var _this = this;
            (void 0) /* assert */;
            this._trnsId = null;
            // set the correct zIndex for the entering and leaving views
            // ******** DOM WRITE ****************
            nav_util_2.setZIndex(this, enteringView, leavingView, opts.direction, this._renderer);
            // always ensure the entering view is viewable
            // ******** DOM WRITE ****************
            enteringView && enteringView._domShow(true, this._renderer);
            // always ensure the leaving view is viewable
            // ******** DOM WRITE ****************
            leavingView && leavingView._domShow(true, this._renderer);
            // initialize the transition
            transition.init();
            // we should animate (duration > 0) if the pushed page is not the first one (startup)
            // or if it is a portal (modal, actionsheet, etc.)
            var isFirstPage = !this._init && this._views.length === 1;
            var shouldNotAnimate = isFirstPage && !this._isPortal;
            var canNotAnimate = this._config.get('animate') === false;
            if (shouldNotAnimate || canNotAnimate) {
                opts.animate = false;
            }
            if (opts.animate === false) {
                // if it was somehow set to not animation, then make the duration zero
                transition.duration(0);
            }
            // create a callback that needs to run within zone
            // that will fire off the willEnter/Leave lifecycle events at the right time
            transition.beforeAddRead(this._viewsWillLifecycles.bind(this, enteringView, leavingView));
            // get the set duration of this transition
            var duration = transition.getDuration();
            // create a callback for when the animation is done
            var promise = new Promise(function (resolve) {
                transition.onFinish(resolve);
            });
            if (transition.isRoot()) {
                // this is the top most, or only active transition, so disable the app
                // add XXms to the duration the app is disabled when the keyboard is open
                if (duration > DISABLE_APP_MINIMUM_DURATION && opts.disableApp !== false) {
                    // if this transition has a duration and this is the root transition
                    // then set that the app is actively disabled
                    this._app.setEnabled(false, duration + ACTIVE_TRANSITION_OFFSET, opts.minClickBlockDuration);
                }
                else {
                    (void 0) /* console.debug */;
                }
                // cool, let's do this, start the transition
                if (opts.progressAnimation) {
                    // this is a swipe to go back, just get the transition progress ready
                    // kick off the swipe animation start
                    transition.progressStart();
                }
                else {
                    // only the top level transition should actually start "play"
                    // kick it off and let it play through
                    // ******** DOM WRITE ****************
                    transition.play();
                }
            }
            return promise.then(function () { return _this._zone.run(function () {
                return _this._transitionFinish(transition, opts);
            }); });
        };
        NavControllerBase.prototype._transitionFinish = function (transition, opts) {
            var hasCompleted = transition.hasCompleted;
            var enteringView = transition.enteringView;
            var leavingView = transition.leavingView;
            // mainly for testing
            var enteringName;
            var leavingName;
            if (hasCompleted) {
                // transition has completed (went from 0 to 1)
                if (enteringView) {
                    enteringName = enteringView.name;
                    this._didEnter(enteringView);
                }
                if (leavingView) {
                    leavingName = leavingView.name;
                    this._didLeave(leavingView);
                }
                this._cleanup(enteringView);
            }
            else {
                // If transition does not complete, we have to cleanup anyway, because
                // previous pages in the stack are not hidden probably.
                this._cleanup(leavingView);
            }
            if (transition.isRoot()) {
                // this is the root transition
                // it's safe to destroy this transition
                this._trnsCtrl.destroy(transition.trnsId);
                // it's safe to enable the app again
                this._app.setEnabled(true);
                // mark ourselves as not transitioning - `deepLinker navchange` requires this
                // TODO - probably could be resolved in a better way
                this.setTransitioning(false);
                if (!this.hasChildren() && opts.updateUrl !== false) {
                    // notify deep linker of the nav change
                    // if a direction was provided and should update url
                    this._linker.navChange(opts.direction);
                }
                if (opts.keyboardClose !== false) {
                    // the keyboard is still open!
                    // no problem, let's just close for them
                    this.plt.focusOutActiveElement();
                }
            }
            return {
                hasCompleted: hasCompleted,
                requiresTransition: true,
                enteringName: enteringName,
                leavingName: leavingName,
                direction: opts.direction
            };
        };
        NavControllerBase.prototype._viewsWillLifecycles = function (enteringView, leavingView) {
            var _this = this;
            if (enteringView || leavingView) {
                this._zone.run(function () {
                    // Here, the order is important. WillLeave must be called before WillEnter.
                    if (leavingView) {
                        var willUnload = enteringView ? leavingView.index > enteringView.index : true;
                        _this._willLeave(leavingView, willUnload);
                    }
                    enteringView && _this._willEnter(enteringView);
                });
            }
        };
        NavControllerBase.prototype._insertViewAt = function (view, index) {
            var existingIndex = this._views.indexOf(view);
            if (existingIndex > -1) {
                // this view is already in the stack!!
                // move it to its new location
                (void 0) /* assert */;
                this._views.splice(index, 0, this._views.splice(existingIndex, 1)[0]);
            }
            else {
                (void 0) /* assert */;
                // this is a new view to add to the stack
                // create the new entering view
                view._setNav(this);
                // give this inserted view an ID
                this._ids++;
                if (!view.id) {
                    view.id = this.id + "-" + this._ids;
                }
                // insert the entering view into the correct index in the stack
                this._views.splice(index, 0, view);
            }
        };
        NavControllerBase.prototype._removeView = function (view) {
            (void 0) /* assert */;
            var views = this._views;
            var index = views.indexOf(view);
            (void 0) /* assert */;
            if (index >= 0) {
                views.splice(index, 1);
            }
        };
        NavControllerBase.prototype._destroyView = function (view) {
            view._destroy(this._renderer);
            this._removeView(view);
        };
        /**
         * DOM WRITE
         */
        NavControllerBase.prototype._cleanup = function (activeView) {
            // ok, cleanup time!! Destroy all of the views that are
            // INACTIVE and come after the active view
            // only do this if the views exist, though
            if (!this._destroyed) {
                var activeViewIndex = this._views.indexOf(activeView);
                var views = this._views;
                var reorderZIndexes = false;
                var view = void 0;
                var i = void 0;
                for (i = views.length - 1; i >= 0; i--) {
                    view = views[i];
                    if (i > activeViewIndex) {
                        // this view comes after the active view
                        // let's unload it
                        this._willUnload(view);
                        this._destroyView(view);
                    }
                    else if (i < activeViewIndex && !this._isPortal) {
                        // this view comes before the active view
                        // and it is not a portal then ensure it is hidden
                        view._domShow(false, this._renderer);
                    }
                    if (view._zIndex <= 0) {
                        reorderZIndexes = true;
                    }
                }
                if (!this._isPortal && reorderZIndexes) {
                    for (i = 0; i < views.length; i++) {
                        view = views[i];
                        // ******** DOM WRITE ****************
                        view._setZIndex(view._zIndex + nav_util_1.INIT_ZINDEX + 1, this._renderer);
                    }
                }
            }
        };
        NavControllerBase.prototype._preLoad = function (view) {
            (void 0) /* assert */;
            view._preLoad();
        };
        NavControllerBase.prototype._willLoad = function (view) {
            (void 0) /* assert */;
            try {
                view._willLoad();
            }
            catch (e) {
                this._errHandler && this._errHandler.handleError(e);
            }
        };
        NavControllerBase.prototype._didLoad = function (view) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            try {
                view._didLoad();
                this.viewDidLoad.emit(view);
                this._app.viewDidLoad.emit(view);
            }
            catch (e) {
                this._errHandler && this._errHandler.handleError(e);
            }
        };
        NavControllerBase.prototype._willEnter = function (view) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            try {
                view._willEnter();
                this.viewWillEnter.emit(view);
                this._app.viewWillEnter.emit(view);
            }
            catch (e) {
                this._errHandler && this._errHandler.handleError(e);
            }
        };
        NavControllerBase.prototype._didEnter = function (view) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            try {
                view._didEnter();
                this.viewDidEnter.emit(view);
                this._app.viewDidEnter.emit(view);
            }
            catch (e) {
                this._errHandler && this._errHandler.handleError(e);
            }
        };
        NavControllerBase.prototype._willLeave = function (view, willUnload) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            try {
                view._willLeave(willUnload);
                this.viewWillLeave.emit(view);
                this._app.viewWillLeave.emit(view);
            }
            catch (e) {
                this._errHandler && this._errHandler.handleError(e);
            }
        };
        NavControllerBase.prototype._didLeave = function (view) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            try {
                view._didLeave();
                this.viewDidLeave.emit(view);
                this._app.viewDidLeave.emit(view);
            }
            catch (e) {
                this._errHandler && this._errHandler.handleError(e);
            }
        };
        NavControllerBase.prototype._willUnload = function (view) {
            (void 0) /* assert */;
            (void 0) /* assert */;
            try {
                view._willUnload();
                this.viewWillUnload.emit(view);
                this._app.viewWillUnload.emit(view);
            }
            catch (e) {
                this._errHandler && this._errHandler.handleError(e);
            }
        };
        NavControllerBase.prototype.hasChildren = function () {
            return this._children && this._children.length > 0;
        };
        NavControllerBase.prototype.getActiveChildNavs = function () {
            return this._children;
        };
        NavControllerBase.prototype.getAllChildNavs = function () {
            return this._children;
        };
        NavControllerBase.prototype.registerChildNav = function (container) {
            this._children.push(container);
        };
        NavControllerBase.prototype.unregisterChildNav = function (nav) {
            this._children = this._children.filter(function (child) { return child !== nav; });
        };
        NavControllerBase.prototype.destroy = function () {
            var views = this._views;
            var view;
            for (var i = 0; i < views.length; i++) {
                view = views[i];
                view._willUnload();
                view._destroy(this._renderer);
            }
            // release swipe back gesture and transition
            this._sbGesture && this._sbGesture.destroy();
            this._sbTrns && this._sbTrns.destroy();
            this._queue = this._views = this._sbGesture = this._sbTrns = null;
            // Unregister navcontroller
            if (this.parent && this.parent.unregisterChildNav) {
                this.parent.unregisterChildNav(this);
            }
            else if (this._app) {
                this._app.unregisterRootNav(this);
            }
            this._destroyed = true;
        };
        NavControllerBase.prototype.swipeBackStart = function () {
            if (this.isTransitioning() || this._queue.length > 0) {
                return;
            }
            // default the direction to "back";
            var opts = {
                direction: nav_util_1.DIRECTION_BACK,
                progressAnimation: true
            };
            this._queueTrns({
                removeStart: -1,
                removeCount: 1,
                opts: opts,
            }, null);
        };
        NavControllerBase.prototype.swipeBackProgress = function (stepValue) {
            if (this._sbTrns && this._sbGesture) {
                // continue to disable the app while actively dragging
                this._app.setEnabled(false, ACTIVE_TRANSITION_DEFAULT);
                this.setTransitioning(true);
                // set the transition animation's progress
                this._sbTrns.progressStep(stepValue);
            }
        };
        NavControllerBase.prototype.swipeBackEnd = function (shouldComplete, currentStepValue, velocity) {
            if (this._sbTrns && this._sbGesture) {
                // the swipe back gesture has ended
                var dur = this._sbTrns.getDuration() / (Math.abs(velocity) + 1);
                this._sbTrns.progressEnd(shouldComplete, currentStepValue, dur);
            }
        };
        NavControllerBase.prototype._swipeBackCheck = function () {
            if (this.canSwipeBack()) {
                if (!this._sbGesture) {
                    this._sbGesture = new swipe_back_1.SwipeBackGesture(this.plt, this, this._gestureCtrl, this._domCtrl);
                }
                this._sbGesture.listen();
            }
            else if (this._sbGesture) {
                this._sbGesture.unlisten();
            }
        };
        NavControllerBase.prototype.canSwipeBack = function () {
            return (this._sbEnabled &&
                !this._isPortal &&
                !this._children.length &&
                !this.isTransitioning() &&
                this._app.isEnabled() &&
                this.canGoBack());
        };
        NavControllerBase.prototype.canGoBack = function () {
            var activeView = this.getActive();
            return !!(activeView && activeView.enableBack());
        };
        NavControllerBase.prototype.isTransitioning = function () {
            return this._trnsTm;
        };
        NavControllerBase.prototype.setTransitioning = function (isTransitioning) {
            this._trnsTm = isTransitioning;
        };
        NavControllerBase.prototype.getActive = function () {
            return this._views[this._views.length - 1];
        };
        NavControllerBase.prototype.isActive = function (view) {
            return (view === this.getActive());
        };
        NavControllerBase.prototype.getByIndex = function (index) {
            return this._views[index];
        };
        NavControllerBase.prototype.getPrevious = function (view) {
            // returns the view controller which is before the given view controller.
            if (!view) {
                view = this.getActive();
            }
            var views = this._views;
            var index = views.indexOf(view);
            return (index > 0) ? views[index - 1] : null;
        };
        NavControllerBase.prototype.first = function () {
            // returns the first view controller in this nav controller's stack.
            return this._views[0];
        };
        NavControllerBase.prototype.last = function () {
            // returns the last page in this nav controller's stack.
            var views = this._views;
            return views[views.length - 1];
        };
        NavControllerBase.prototype.indexOf = function (view) {
            // returns the index number of the given view controller.
            return this._views.indexOf(view);
        };
        NavControllerBase.prototype.length = function () {
            return this._views.length;
        };
        NavControllerBase.prototype.getViews = function () {
            return this._views;
        };
        /**
         * Return a view controller
         */
        NavControllerBase.prototype.getViewById = function (id) {
            for (var _i = 0, _a = this._views; _i < _a.length; _i++) {
                var vc = _a[_i];
                if (vc && vc.id === id) {
                    return vc;
                }
            }
            return null;
        };
        NavControllerBase.prototype.isSwipeBackEnabled = function () {
            return this._sbEnabled;
        };
        NavControllerBase.prototype.dismissPageChangeViews = function () {
            for (var _i = 0, _a = this._views; _i < _a.length; _i++) {
                var view = _a[_i];
                if (view.data && view.data.dismissOnPageChange) {
                    view.dismiss().catch(function () { });
                }
            }
        };
        NavControllerBase.prototype.setViewport = function (val) {
            this._viewport = val;
        };
        NavControllerBase.prototype.resize = function () {
            var active = this.getActive();
            if (!active) {
                return;
            }
            var content = active.getIONContent();
            content && content.resize();
        };
        NavControllerBase.prototype.goToRoot = function (_opts) {
            return Promise.reject(new Error('goToRoot needs to be implemented by child class'));
        };
        /*
         * @private
         */
        NavControllerBase.prototype.getType = function () {
            return 'nav';
        };
        /*
         * @private
         */
        NavControllerBase.prototype.getSecondaryIdentifier = function () {
            return null;
        };
        /**
         * Returns the active child navigation.
         */
        NavControllerBase.prototype.getActiveChildNav = function () {
            console.warn('(getActiveChildNav) is deprecated and will be removed in the next major release. Use getActiveChildNavs instead.');
            return this._children[this._children.length - 1];
        };
        NavControllerBase.propDecorators = {
            'swipeBackEnabled': [{ type: core_1.Input },],
        };
        return NavControllerBase;
    }(ion_1.Ion));
    exports.NavControllerBase = NavControllerBase;
    var ctrlIds = -1;
    var DISABLE_APP_MINIMUM_DURATION = 64;
    var ACTIVE_TRANSITION_DEFAULT = 5000;
    var ACTIVE_TRANSITION_OFFSET = 2000;
});
//# sourceMappingURL=nav-controller-base.js.map