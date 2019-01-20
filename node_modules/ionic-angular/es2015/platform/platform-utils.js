export function isCordova(plt) {
    const win = plt.win();
    return !!(win['cordova'] || win['PhoneGap'] || win['phonegap']);
}
export function isElectron(plt) {
    return plt.testUserAgent('Electron');
}
export function isIos(plt) {
    // shortcut function to be reused internally
    // checks navigator.platform to see if it's an actual iOS device
    // this does not use the user-agent string because it is often spoofed
    // an actual iPad will return true, a chrome dev tools iPad will return false
    return plt.testNavigatorPlatform('iphone|ipad|ipod');
}
export function isSafari(plt) {
    return plt.testUserAgent('Safari');
}
export function isWKWebView(plt) {
    return isIos(plt) && !!plt.win()['webkit'];
}
export function isIosUIWebView(plt) {
    return isIos(plt) && !isWKWebView(plt) && !isSafari(plt);
}
//# sourceMappingURL=platform-utils.js.map