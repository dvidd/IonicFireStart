import { fromRef } from '../observable/fromRef';
import { of, merge } from 'rxjs';
import { isNil } from '../utils';
import { switchMap, distinctUntilChanged, scan } from 'rxjs/operators';
export function listChanges(ref, events) {
    return fromRef(ref, 'value', 'once').pipe(switchMap(function (snapshotAction) {
        var childEvent$ = [of(snapshotAction)];
        events.forEach(function (event) { return childEvent$.push(fromRef(ref, event)); });
        return merge.apply(void 0, childEvent$).pipe(scan(buildView, []));
    }), distinctUntilChanged());
}
function positionFor(changes, key) {
    var len = changes.length;
    for (var i = 0; i < len; i++) {
        if (changes[i].payload.key === key) {
            return i;
        }
    }
    return -1;
}
function positionAfter(changes, prevKey) {
    if (isNil(prevKey)) {
        return 0;
    }
    else {
        var i = positionFor(changes, prevKey);
        if (i === -1) {
            return changes.length;
        }
        else {
            return i + 1;
        }
    }
}
function buildView(current, action) {
    var payload = action.payload, type = action.type, prevKey = action.prevKey, key = action.key;
    var currentKeyPosition = positionFor(current, key);
    var afterPreviousKeyPosition = positionAfter(current, prevKey);
    switch (action.type) {
        case 'value':
            if (action.payload && action.payload.exists()) {
                var prevKey_1 = null;
                action.payload.forEach(function (payload) {
                    var action = { payload: payload, type: 'value', prevKey: prevKey_1, key: payload.key };
                    prevKey_1 = payload.key;
                    current = current.concat([action]);
                    return false;
                });
            }
            return current;
        case 'child_added':
            if (currentKeyPosition > -1) {
                var previous = current[currentKeyPosition - 1];
                if ((previous && previous.key || null) != prevKey) {
                    current = current.filter(function (x) { return x.payload.key !== payload.key; });
                    current.splice(afterPreviousKeyPosition, 0, action);
                }
            }
            else if (prevKey == null) {
                return [action].concat(current);
            }
            else {
                current = current.slice();
                current.splice(afterPreviousKeyPosition, 0, action);
            }
            return current;
        case 'child_removed':
            return current.filter(function (x) { return x.payload.key !== payload.key; });
        case 'child_changed':
            return current.map(function (x) { return x.payload.key === key ? action : x; });
        case 'child_moved':
            if (currentKeyPosition > -1) {
                var data = current.splice(currentKeyPosition, 1)[0];
                current = current.slice();
                current.splice(afterPreviousKeyPosition, 0, data);
                return current;
            }
            return current;
        default:
            return current;
    }
}
//# sourceMappingURL=changes.js.map