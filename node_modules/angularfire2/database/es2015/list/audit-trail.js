import { stateChanges } from './state-changes';
import { fromRef } from '../observable/fromRef';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/map';
export function createAuditTrail(query) {
    return (events) => auditTrail(query, events);
}
export function auditTrail(query, events) {
    const auditTrail$ = stateChanges(query, events)
        .scan((current, action) => [...current, action], []);
    return waitForLoaded(query, auditTrail$);
}
function loadedData(query) {
    return fromRef(query, 'value')
        .map(data => {
        let lastKeyToLoad;
        data.payload.forEach(child => {
            lastKeyToLoad = child.key;
            return false;
        });
        return { data, lastKeyToLoad };
    });
}
function waitForLoaded(query, action$) {
    const loaded$ = loadedData(query);
    return loaded$
        .withLatestFrom(action$)
        .map(([loaded, actions]) => {
        let lastKeyToLoad = loaded.lastKeyToLoad;
        const loadedKeys = actions.map(snap => snap.key);
        return { actions, lastKeyToLoad, loadedKeys };
    })
        .skipWhile(meta => meta.loadedKeys.indexOf(meta.lastKeyToLoad) === -1)
        .map(meta => meta.actions);
}
//# sourceMappingURL=audit-trail.js.map