import { h } from '../ionic.core.js';

export { b as PLATFORMS_MAP, c as getPlatforms, a as isPlatform, d as setupPlatforms } from './chunk-99b2d1db.js';
export { b as LIFECYCLE_WILL_ENTER, c as LIFECYCLE_DID_ENTER, a as LIFECYCLE_WILL_LEAVE, d as LIFECYCLE_DID_LEAVE, e as LIFECYCLE_WILL_UNLOAD } from './chunk-90d954cd.js';

function setupConfig(config) {
    const win = window;
    const Ionic = win.Ionic;
    if (Ionic && Ionic.config && Ionic.config.constructor.name !== 'Object') {
        console.error('ionic config was already initialized');
        return;
    }
    win.Ionic = win.Ionic || {};
    win.Ionic.config = Object.assign({}, win.Ionic.config, config);
    return win.Ionic.config;
}

export { setupConfig };
