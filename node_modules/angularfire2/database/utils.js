export function isString(value) {
    return typeof value === 'string';
}
export function isFirebaseDataSnapshot(value) {
    return typeof value.exportVal === 'function';
}
export function isNil(obj) {
    return obj === undefined || obj === null;
}
export function isFirebaseRef(value) {
    return typeof value.set === 'function';
}
export function getRef(app, pathRef) {
    return isFirebaseRef(pathRef) ? pathRef
        : app.database().ref(pathRef);
}
export function checkOperationCases(item, cases) {
    if (isString(item)) {
        return cases.stringCase();
    }
    else if (isFirebaseRef(item)) {
        return cases.firebaseCase();
    }
    else if (isFirebaseDataSnapshot(item)) {
        return cases.snapshotCase();
    }
    throw new Error("Expects a string, snapshot, or reference. Got: " + typeof item);
}
//# sourceMappingURL=utils.js.map