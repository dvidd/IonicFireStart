import { fromRef } from '../observable/fromRef';
import { validateEventsArray } from './utils';
import { merge } from 'rxjs';
export function stateChanges(query, events) {
    events = validateEventsArray(events);
    const childEvent$ = events.map(event => fromRef(query, event));
    return merge(...childEvent$);
}
//# sourceMappingURL=state-changes.js.map