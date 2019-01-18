import { fromRef } from '../observable/fromRef';
import { validateEventsArray } from './utils';
import { merge } from 'rxjs';
export function stateChanges(query, events) {
    events = validateEventsArray(events);
    var childEvent$ = events.map(function (event) { return fromRef(query, event); });
    return merge.apply(void 0, childEvent$);
}
//# sourceMappingURL=state-changes.js.map