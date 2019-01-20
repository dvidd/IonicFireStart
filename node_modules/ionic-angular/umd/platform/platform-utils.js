(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isCordova(plt) {
        var win = plt.win();
        return !!(win['cordova'] || win['PhoneGap'] || win['phonegap']);
    }
    exports.isCordova = isCordova;
    function isElectron(plt) {
        return plt.testUserAgent('Electron');
    }
    exports.isElectron = isElectron;
    function isIos(plt) {
        // shortcut function to be reused internally
        // checks navigator.platform to see if it's an actual iOS device
        // this does not use the user-agent string because it is often spoofed
        // an actual iPad will return true, a chrome dev tools iPad will return false
        return plt.testNavigatorPlatform('iphone|ipad|ipod');
    }
    exports.isIos = isIos;
    function isSafari(plt) {
        return plt.testUserAgent('Safari');
    }
    exports.isSafari = isSafari;
    function isWKWebView(plt) {
        return isIos(plt) && !!plt.win()['webkit'];
    }
    exports.isWKWebView = isWKWebView;
    function isIosUIWebView(plt) {
        return isIos(plt) && !isWKWebView(plt) && !isSafari(plt);
    }
    exports.isIosUIWebView = isIosUIWebView;
});
//# sourceMappingURL=platform-utils.js.map