import { DIRECTION_BACK, convertToViews, isNav, isTab, isTabs } from './nav-util';
import { isArray, isPresent } from '../util/util';
import { formatUrlPart } from './url-serializer';
import { ViewController } from './view-controller';
/**
 * @hidden
 */
export class DeepLinker {
    constructor(_app, _serializer, _location, _moduleLoader, _baseCfr) {
        this._app = _app;
        this._serializer = _serializer;
        this._location = _location;
        this._moduleLoader = _moduleLoader;
        this._baseCfr = _baseCfr;
        /** @internal */
        this._history = [];
    }
    /**
     * @internal
     */
    init() {
        // scenario 1: Initial load of all navs from the initial browser URL
        const browserUrl = normalizeUrl(this._location.path());
        (void 0) /* console.debug */;
        // remember this URL in our internal history stack
        this._historyPush(browserUrl);
        // listen for browser URL changes
        this._location.subscribe((locationChg) => {
            this._urlChange(normalizeUrl(locationChg.url));
        });
    }
    /**
     * The browser's location has been updated somehow.
     * @internal
     */
    _urlChange(browserUrl) {
        // do nothing if this url is the same as the current one
        if (!this._isCurrentUrl(browserUrl)) {
            let isGoingBack = true;
            if (this._isBackUrl(browserUrl)) {
                // scenario 2: user clicked the browser back button
                // scenario 4: user changed the browser URL to what was the back url was
                // scenario 5: user clicked a link href that was the back url
                (void 0) /* console.debug */;
                this._historyPop();
            }
            else {
                // scenario 3: user click forward button
                // scenario 4: user changed browser URL that wasn't the back url
                // scenario 5: user clicked a link href that wasn't the back url
                isGoingBack = false;
                (void 0) /* console.debug */;
                this._historyPush(browserUrl);
            }
            // get the app's root nav container
            const activeNavContainers = this._app.getActiveNavContainers();
            if (activeNavContainers && activeNavContainers.length) {
                if (browserUrl === '/') {
                    // a url change to the index url
                    if (isPresent(this._indexAliasUrl)) {
                        // we already know the indexAliasUrl
                        // update the url to use the know alias
                        browserUrl = this._indexAliasUrl;
                    }
                    else {
                        // the url change is to the root but we don't
                        // already know the url used. So let's just
                        // reset the root nav to its root page
                        activeNavContainers.forEach((navContainer) => {
                            navContainer.goToRoot({
                                updateUrl: false,
                                isNavRoot: true
                            });
                        });
                        return;
                    }
                }
                // normal url
                const segments = this.getCurrentSegments(browserUrl);
                segments
                    .map(segment => {
                    // find the matching nav container
                    for (const navContainer of activeNavContainers) {
                        const nav = getNavFromTree(navContainer, segment.navId);
                        if (nav) {
                            return {
                                segment: segment,
                                navContainer: nav
                            };
                        }
                    }
                })
                    .filter(pair => !!pair)
                    .forEach(pair => {
                    this._loadViewForSegment(pair.navContainer, pair.segment, () => { });
                });
            }
        }
    }
    getCurrentSegments(browserUrl) {
        if (!browserUrl) {
            browserUrl = normalizeUrl(this._location.path());
        }
        return this._serializer.parse(browserUrl);
    }
    /**
     * Update the deep linker using the NavController's current active view.
     * @internal
     */
    navChange(direction) {
        if (direction) {
            const activeNavContainers = this._app.getActiveNavContainers();
            // the only time you'll ever get a TABS here is when loading directly from a URL
            // this method will be called again when the TAB is loaded
            // so just don't worry about the TABS for now
            // if you encounter a TABS, just return
            for (const activeNavContainer of activeNavContainers) {
                if (isTabs(activeNavContainer) || activeNavContainer.isTransitioning()) {
                    return;
                }
            }
            // okay, get the root navs and build the segments up
            let segments = [];
            const navContainers = this._app.getRootNavs();
            for (const navContainer of navContainers) {
                const segmentsForNav = this.getSegmentsFromNav(navContainer);
                segments = segments.concat(segmentsForNav);
            }
            segments = segments.filter(segment => !!segment);
            if (segments.length) {
                const browserUrl = this._serializer.serialize(segments);
                this._updateLocation(browserUrl, direction);
            }
        }
    }
    getSegmentsFromNav(nav) {
        let segments = [];
        if (isNav(nav)) {
            segments.push(this.getSegmentFromNav(nav));
        }
        else if (isTab(nav)) {
            segments.push(this.getSegmentFromTab(nav));
        }
        nav.getActiveChildNavs().forEach(child => {
            segments = segments.concat(this.getSegmentsFromNav(child));
        });
        return segments;
    }
    getSegmentFromNav(nav, component, data) {
        if (!component) {
            const viewController = nav.getActive(true);
            if (viewController) {
                component = viewController.component;
                data = viewController.data;
            }
        }
        return this._serializer.serializeComponent(nav, component, data);
    }
    getSegmentFromTab(navContainer, component, data) {
        if (navContainer && navContainer.parent) {
            const tabsNavContainer = navContainer.parent;
            const activeChildNavs = tabsNavContainer.getActiveChildNavs();
            if (activeChildNavs && activeChildNavs.length) {
                const activeChildNav = activeChildNavs[0];
                const viewController = activeChildNav.getActive(true);
                if (viewController) {
                    component = viewController.component;
                    data = viewController.data;
                }
                return this._serializer.serializeComponent(tabsNavContainer, component, data);
            }
        }
    }
    /**
     * @internal
     */
    _updateLocation(browserUrl, direction) {
        if (this._indexAliasUrl === browserUrl) {
            browserUrl = '/';
        }
        if (direction === DIRECTION_BACK && this._isBackUrl(browserUrl)) {
            // this URL is exactly the same as the back URL
            // it's safe to use the browser's location.back()
            (void 0) /* console.debug */;
            this._historyPop();
            this._location.back();
        }
        else if (!this._isCurrentUrl(browserUrl)) {
            // probably navigating forward
            (void 0) /* console.debug */;
            this._historyPush(browserUrl);
            this._location.go(browserUrl);
        }
    }
    getComponentFromName(componentName) {
        const link = this._serializer.getLinkFromName(componentName);
        if (link) {
            // cool, we found the right link for this component name
            return this.getNavLinkComponent(link);
        }
        // umm, idk
        return Promise.reject(`invalid link: ${componentName}`);
    }
    getNavLinkComponent(link) {
        if (link.component) {
            // sweet, we're already got a component loaded for this link
            return Promise.resolve(link.component);
        }
        if (link.loadChildren) {
            // awesome, looks like we'll lazy load this component
            // using loadChildren as the URL to request
            return this._moduleLoader.load(link.loadChildren).then((response) => {
                link.component = response.component;
                return response.component;
            });
        }
        return Promise.reject(`invalid link component: ${link.name}`);
    }
    /**
     * @internal
     */
    resolveComponent(component) {
        let cfr = this._moduleLoader.getComponentFactoryResolver(component);
        if (!cfr) {
            cfr = this._baseCfr;
        }
        return cfr.resolveComponentFactory(component);
    }
    /**
     * @internal
     */
    createUrl(navContainer, nameOrComponent, _data, prepareExternalUrl = true) {
        // create a segment out of just the passed in name
        const segment = this._serializer.createSegmentFromName(navContainer, nameOrComponent);
        const allSegments = this.getCurrentSegments();
        if (segment) {
            for (let i = 0; i < allSegments.length; i++) {
                if (allSegments[i].navId === navContainer.name || allSegments[i].navId === navContainer.id) {
                    allSegments[i] = segment;
                    const url = this._serializer.serialize(allSegments);
                    return prepareExternalUrl ? this._location.prepareExternalUrl(url) : url;
                }
            }
        }
        return '';
    }
    /**
     * Each NavController will call this method when it initializes for
     * the first time. This allows each NavController to figure out
     * where it lives in the path and load up the correct component.
     * @internal
     */
    getSegmentByNavIdOrName(navId, name) {
        const browserUrl = normalizeUrl(this._location.path());
        const segments = this._serializer.parse(browserUrl);
        for (const segment of segments) {
            if (segment.navId === navId || segment.navId === name) {
                return segment;
            }
        }
        return null;
    }
    /**
     * @internal
     */
    initViews(segment) {
        const link = this._serializer.getLinkFromName(segment.name);
        return this.getNavLinkComponent(link).then((component) => {
            segment.component = component;
            const view = new ViewController(component, segment.data);
            view.id = segment.id;
            if (isArray(segment.defaultHistory)) {
                return convertToViews(this, segment.defaultHistory).then(views => {
                    views.push(view);
                    return views;
                });
            }
            return [view];
        });
    }
    /**
     * @internal
     */
    _isBackUrl(browserUrl) {
        return (browserUrl === this._history[this._history.length - 2]);
    }
    /**
     * @internal
     */
    _isCurrentUrl(browserUrl) {
        return (browserUrl === this._history[this._history.length - 1]);
    }
    /**
     * @internal
     */
    _historyPush(browserUrl) {
        if (!this._isCurrentUrl(browserUrl)) {
            this._history.push(browserUrl);
            if (this._history.length > 30) {
                this._history.shift();
            }
        }
    }
    /**
     * @internal
     */
    _historyPop() {
        this._history.pop();
        if (!this._history.length) {
            this._historyPush(this._location.path());
        }
    }
    /**
     * @internal
     */
    _getTabSelector(tab) {
        if (isPresent(tab.tabUrlPath)) {
            return tab.tabUrlPath;
        }
        if (isPresent(tab.tabTitle)) {
            return formatUrlPart(tab.tabTitle);
        }
        return `tab-${tab.index}`;
    }
    /**
     * Using the known Path of Segments, walk down all descendents
     * from the root NavController and load each NavController according
     * to each Segment. This is usually called after a browser URL and
     * Path changes and needs to update all NavControllers to match
     * the new browser URL. Because the URL is already known, it will
     * not update the browser's URL when transitions have completed.
     *
     * @internal
     */
    _loadViewForSegment(navContainer, segment, done) {
        if (!segment) {
            return done(false, false);
        }
        if (isTabs(navContainer) || (isTab(navContainer) && navContainer.parent)) {
            const tabs = (isTabs(navContainer) ? navContainer : navContainer.parent);
            const selectedIndex = tabs._getSelectedTabIndex(segment.secondaryId);
            const tab = tabs.getByIndex(selectedIndex);
            tab._segment = segment;
            tabs.select(tab, {
                updateUrl: false,
                animate: false
            }, true);
            return done(false, false);
        }
        const navController = navContainer;
        const numViews = navController.length() - 1;
        // walk backwards to see if the exact view we want to show here
        // is already in the stack that we can just pop back to
        for (let i = numViews; i >= 0; i--) {
            const viewController = navController.getByIndex(i);
            if (viewController && (viewController.id === segment.id || viewController.id === segment.name)) {
                // hooray! we've already got a view loaded in the stack
                // matching the view they wanted to show
                if (i === numViews) {
                    // this is the last view in the stack and it's the same
                    // as the segment so there's no change needed
                    return done(false, false);
                }
                else {
                    // it's not the exact view as the end
                    // let's have this nav go back to this exact view
                    return navController.popTo(viewController, {
                        animate: false,
                        updateUrl: false,
                    }, done);
                }
            }
        }
        // ok, so we don't know about a view that they're navigating to
        // so we might as well just call setRoot and make tthe view the first view
        // this seems like the least bad option
        return navController.setRoot(segment.component || segment.name, segment.data, {
            id: segment.id, animate: false, updateUrl: false
        }, done);
    }
}
export function setupDeepLinker(app, serializer, location, moduleLoader, cfr) {
    const deepLinker = new DeepLinker(app, serializer, location, moduleLoader, cfr);
    deepLinker.init();
    return deepLinker;
}
export function normalizeUrl(browserUrl) {
    browserUrl = browserUrl.trim();
    if (browserUrl.charAt(0) !== '/') {
        // ensure first char is a /
        browserUrl = '/' + browserUrl;
    }
    if (browserUrl.length > 1 && browserUrl.charAt(browserUrl.length - 1) === '/') {
        // ensure last char is not a /
        browserUrl = browserUrl.substr(0, browserUrl.length - 1);
    }
    return browserUrl;
}
export function getNavFromTree(nav, id) {
    while (nav) {
        if (nav.id === id || nav.name === id) {
            return nav;
        }
        nav = nav.parent;
    }
    return null;
}
//# sourceMappingURL=deep-linker.js.map