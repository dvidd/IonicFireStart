import { Observable, of as observableOf } from 'rxjs';
import { auditTime, combineLatest, merge, map } from 'rxjs/operators';
import { OrderByOptions, LimitToOptions } from './interfaces';
import { hasKey, isNil } from './utils';
export function observeQuery(query, audit = true) {
    if (isNil(query)) {
        return observableOf(null);
    }
    return Observable.create((observer) => {
        let combined = combineLatest.call(getOrderObservables(query), getStartAtObservable(query), getEndAtObservable(query), getEqualToObservable(query), getLimitToObservables(query));
        if (audit) {
            combined = auditTime.call(combined, 0);
        }
        combined
            .subscribe(([orderBy, startAt, endAt, equalTo, limitTo]) => {
            let serializedOrder = {};
            if (!isNil(orderBy) && !isNil(orderBy.value)) {
                switch (orderBy.key) {
                    case OrderByOptions.Key:
                        serializedOrder = { orderByKey: orderBy.value };
                        break;
                    case OrderByOptions.Priority:
                        serializedOrder = { orderByPriority: orderBy.value };
                        break;
                    case OrderByOptions.Value:
                        serializedOrder = { orderByValue: orderBy.value };
                        break;
                    case OrderByOptions.Child:
                        serializedOrder = { orderByChild: orderBy.value };
                        break;
                }
            }
            if (!isNil(limitTo) && !isNil(limitTo.value)) {
                switch (limitTo.key) {
                    case LimitToOptions.First:
                        serializedOrder.limitToFirst = limitTo.value;
                        break;
                    case LimitToOptions.Last: {
                        serializedOrder.limitToLast = limitTo.value;
                        break;
                    }
                }
            }
            if (startAt !== undefined) {
                serializedOrder.startAt = startAt;
            }
            if (endAt !== undefined) {
                serializedOrder.endAt = endAt;
            }
            if (equalTo !== undefined) {
                serializedOrder.equalTo = equalTo;
            }
            observer.next(serializedOrder);
        });
    });
}
export function getOrderObservables(query) {
    var observables = ['orderByChild', 'orderByKey', 'orderByValue', 'orderByPriority']
        .map((key, option) => {
        return ({ key, option });
    })
        .filter(({ key, option }) => {
        return !isNil(query[key]);
    })
        .map(({ key, option }) => mapToOrderBySelection(query[key], option));
    if (observables.length === 1) {
        return observables[0];
    }
    else if (observables.length > 1) {
        return merge.apply(observables[0], observables.slice(1));
    }
    else {
        return new Observable(subscriber => {
            subscriber.next(null);
        });
    }
}
export function getLimitToObservables(query) {
    var observables = ['limitToFirst', 'limitToLast']
        .map((key, option) => ({ key, option }))
        .filter(({ key, option }) => !isNil(query[key]))
        .map(({ key, option }) => mapToLimitToSelection(query[key], option));
    if (observables.length === 1) {
        return observables[0];
    }
    else if (observables.length > 1) {
        const mergedObs = merge.apply(observables[0], observables.slice(1));
        return mergedObs;
    }
    else {
        return new Observable(subscriber => {
            subscriber.next(null);
        });
    }
}
export function getStartAtObservable(query) {
    if (query.startAt instanceof Observable) {
        return query.startAt;
    }
    else if (hasKey(query, 'startAt')) {
        return new Observable(subscriber => {
            subscriber.next(query.startAt);
        });
    }
    else {
        return new Observable(subscriber => {
            subscriber.next(undefined);
        });
    }
}
export function getEndAtObservable(query) {
    if (query.endAt instanceof Observable) {
        return query.endAt;
    }
    else if (hasKey(query, 'endAt')) {
        return new Observable(subscriber => {
            subscriber.next(query.endAt);
        });
    }
    else {
        return new Observable(subscriber => {
            subscriber.next(undefined);
        });
    }
}
export function getEqualToObservable(query) {
    if (query.equalTo instanceof Observable) {
        return query.equalTo;
    }
    else if (hasKey(query, 'equalTo')) {
        return new Observable(subscriber => {
            subscriber.next(query.equalTo);
        });
    }
    else {
        return new Observable(subscriber => {
            subscriber.next(undefined);
        });
    }
}
function mapToOrderBySelection(value, key) {
    if (value instanceof Observable) {
        return map
            .call(value, (value) => {
            return ({ value, key });
        });
    }
    else {
        return new Observable(subscriber => {
            subscriber.next({ key, value });
        });
    }
}
function mapToLimitToSelection(value, key) {
    if (value instanceof Observable) {
        return map
            .call(value, (value) => ({ value, key }));
    }
    else {
        return new Observable(subscriber => {
            subscriber.next({ key, value });
        });
    }
}
function hasObservableProperties(query) {
    if (query.orderByKey instanceof Observable)
        return true;
    return false;
}
//# sourceMappingURL=query_observable.js.map