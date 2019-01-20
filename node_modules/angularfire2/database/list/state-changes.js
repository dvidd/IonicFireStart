import { fromRef } from '../observable/fromRef';
import { validateEventsArray } from './utils';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/scan';
export function createStateChanges(query) {
    return function (events) { return stateChanges(query, events); };
}
export function stateChanges(query, events) {
    events = (validateEventsArray(events));
    var childEvent$ = events.map(function (event) { return fromRef(query, event); });
    return Observable.merge.apply(Observable, childEvent$);
}
//# sourceMappingURL=state-changes.js.map