import { stateChanges } from './state-changes';
import { fromRef } from '../observable/fromRef';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/map';
export function createAuditTrail(query) {
    return function (events) { return auditTrail(query, events); };
}
export function auditTrail(query, events) {
    var auditTrail$ = stateChanges(query, events)
        .scan(function (current, action) { return current.concat([action]); }, []);
    return waitForLoaded(query, auditTrail$);
}
function loadedData(query) {
    return fromRef(query, 'value')
        .map(function (data) {
        var lastKeyToLoad;
        data.payload.forEach(function (child) {
            lastKeyToLoad = child.key;
            return false;
        });
        return { data: data, lastKeyToLoad: lastKeyToLoad };
    });
}
function waitForLoaded(query, action$) {
    var loaded$ = loadedData(query);
    return loaded$
        .withLatestFrom(action$)
        .map(function (_a) {
        var loaded = _a[0], actions = _a[1];
        var lastKeyToLoad = loaded.lastKeyToLoad;
        var loadedKeys = actions.map(function (snap) { return snap.key; });
        return { actions: actions, lastKeyToLoad: lastKeyToLoad, loadedKeys: loadedKeys };
    })
        .skipWhile(function (meta) { return meta.loadedKeys.indexOf(meta.lastKeyToLoad) === -1; })
        .map(function (meta) { return meta.actions; });
}
//# sourceMappingURL=audit-trail.js.map