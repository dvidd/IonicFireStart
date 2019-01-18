const REGEX_ABSOLUTE_URL = /^[a-z]+:\/\/.*/;
export function isNil(obj) {
    return obj === undefined || obj === null;
}
export function hasKey(obj, key) {
    return obj && obj[key] !== undefined;
}
export function isString(value) {
    return typeof value === 'string';
}
export function isFirebaseRef(value) {
    return typeof value.set === 'function';
}
export function isFirebaseDataSnapshot(value) {
    return typeof value.exportVal === 'function';
}
export function isAFUnwrappedSnapshot(value) {
    return typeof value.$key === 'string';
}
export function isFirebaseQuery(value) {
    return typeof value.orderByChild === 'function';
}
export function isEmptyObject(obj) {
    if (isNil(obj)) {
        return false;
    }
    return Object.keys(obj).length === 0 && JSON.stringify(obj) === JSON.stringify({});
}
export function unwrapMapFn(snapshot) {
    var unwrapped = !isNil(snapshot.val()) ? snapshot.val() : { $value: null };
    if ((/string|number|boolean/).test(typeof unwrapped)) {
        unwrapped = {
            $value: unwrapped
        };
    }
    Object.defineProperty(unwrapped, '$key', {
        value: snapshot.ref.key,
        enumerable: false
    });
    Object.defineProperty(unwrapped, '$exists', {
        value: () => {
            return snapshot.exists();
        },
        enumerable: false
    });
    return unwrapped;
}
export function stripTrailingSlash(value) {
    if (value.substring(value.length - 1, value.length) === '/') {
        return value.substring(0, value.length - 1);
    }
    else {
        return value;
    }
}
function getAbsUrl(root, url) {
    if (!(/^[a-z]+:\/\/.*/.test(url))) {
        url = root + '/' + stripLeadingSlash(url);
    }
    return url;
}
export function stripLeadingSlash(value) {
    if (value.substring(0, 1) === '/') {
        return value.substring(1, value.length);
    }
    else {
        return value;
    }
}
export function isAbsoluteUrl(url) {
    return REGEX_ABSOLUTE_URL.test(url);
}
export function getRef(database, pathRef) {
    if (isFirebaseRef(pathRef)) {
        return pathRef;
    }
    const path = pathRef;
    if (isAbsoluteUrl(pathRef)) {
        return database.refFromURL(path);
    }
    return database.ref(path);
}
//# sourceMappingURL=utils.js.map