import { fromRef } from '../observable/fromRef';
import { validateEventsArray } from './utils';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/scan';
export function createStateChanges(query) {
    return (events) => stateChanges(query, events);
}
export function stateChanges(query, events) {
    events = (validateEventsArray(events));
    const childEvent$ = events.map(event => fromRef(query, event));
    return Observable.merge(...childEvent$);
}
//# sourceMappingURL=state-changes.js.map