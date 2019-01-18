import { NgZone } from '@angular/core';
import { FirebaseZoneScheduler } from '@angular/fire';
import * as utils from './utils';
import { FirebaseListObservable } from './firebase_list_observable';
import { observeOn, switchMap, map } from 'rxjs/operators';
import { observeQuery } from './query_observable';
export function FirebaseListFactory(ref, { preserveSnapshot, query = {} } = {}) {
    if (utils.isEmptyObject(query)) {
        return firebaseListObservable(ref, { preserveSnapshot });
    }
    const queryObs = observeQuery(query);
    return new FirebaseListObservable(ref, subscriber => {
        let sub = switchMap.call(map.call(queryObs, query => {
            let queried = ref;
            if (query.orderByChild) {
                queried = queried.orderByChild(query.orderByChild);
            }
            else if (query.orderByKey) {
                queried = queried.orderByKey();
            }
            else if (query.orderByPriority) {
                queried = queried.orderByPriority();
            }
            else if (query.orderByValue) {
                queried = queried.orderByValue();
            }
            if (utils.hasKey(query, "equalTo")) {
                if (utils.hasKey(query.equalTo, "value")) {
                    queried = queried.equalTo(query.equalTo.value, query.equalTo.key);
                }
                else {
                    queried = queried.equalTo(query.equalTo);
                }
                if (utils.hasKey(query, "startAt") || utils.hasKey(query, "endAt")) {
                    throw new Error('Query Error: Cannot use startAt or endAt with equalTo.');
                }
                if (!utils.isNil(query.limitToFirst)) {
                    queried = queried.limitToFirst(query.limitToFirst);
                }
                if (!utils.isNil(query.limitToLast)) {
                    queried = queried.limitToLast(query.limitToLast);
                }
                return queried;
            }
            if (utils.hasKey(query, "startAt")) {
                if (utils.hasKey(query.startAt, "value")) {
                    queried = queried.startAt(query.startAt.value, query.startAt.key);
                }
                else {
                    queried = queried.startAt(query.startAt);
                }
            }
            if (utils.hasKey(query, "endAt")) {
                if (utils.hasKey(query.endAt, "value")) {
                    queried = queried.endAt(query.endAt.value, query.endAt.key);
                }
                else {
                    queried = queried.endAt(query.endAt);
                }
            }
            if (!utils.isNil(query.limitToFirst) && query.limitToLast) {
                throw new Error('Query Error: Cannot use limitToFirst with limitToLast.');
            }
            if (!utils.isNil(query.limitToFirst)) {
                queried = queried.limitToFirst(query.limitToFirst);
            }
            if (!utils.isNil(query.limitToLast)) {
                queried = queried.limitToLast(query.limitToLast);
            }
            return queried;
        }), (queryRef, ix) => {
            return firebaseListObservable(queryRef, { preserveSnapshot });
        })
            .subscribe(subscriber);
        return () => sub.unsubscribe();
    });
}
function firebaseListObservable(ref, { preserveSnapshot } = {}) {
    const toValue = preserveSnapshot ? (snapshot => snapshot) : utils.unwrapMapFn;
    const toKey = preserveSnapshot ? (value => value.key) : (value => value.$key);
    const listObs = new FirebaseListObservable(ref, (obs) => {
        const handles = [];
        let hasLoaded = false;
        let lastLoadedKey = null;
        let array = [];
        ref.once('value', (snap) => {
            if (snap.exists()) {
                snap.forEach((child) => {
                    lastLoadedKey = child.key;
                });
                if (array.find((child) => toKey(child) === lastLoadedKey)) {
                    hasLoaded = true;
                    obs.next(array);
                }
            }
            else {
                hasLoaded = true;
                obs.next(array);
            }
        }, err => {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        const addFn = ref.on('child_added', (child, prevKey) => {
            array = onChildAdded(array, toValue(child), toKey, prevKey);
            if (hasLoaded) {
                obs.next(array);
            }
            else if (child.key === lastLoadedKey) {
                hasLoaded = true;
                obs.next(array);
            }
        }, err => {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        handles.push({ event: 'child_added', handle: addFn });
        let remFn = ref.on('child_removed', (child) => {
            array = onChildRemoved(array, toValue(child), toKey);
            if (hasLoaded) {
                obs.next(array);
            }
        }, err => {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        handles.push({ event: 'child_removed', handle: remFn });
        let chgFn = ref.on('child_changed', (child, prevKey) => {
            array = onChildChanged(array, toValue(child), toKey, prevKey);
            if (hasLoaded) {
                obs.next(array);
            }
        }, err => {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        handles.push({ event: 'child_changed', handle: chgFn });
        return () => {
            handles.forEach(item => {
                ref.off(item.event, item.handle);
            });
        };
    });
    return observeOn.call(listObs, new FirebaseZoneScheduler(new NgZone({}), {}));
}
export function onChildAdded(arr, child, toKey, prevKey) {
    if (!arr.length) {
        return [child];
    }
    return arr.reduce((accumulator, curr, i) => {
        if (!prevKey && i === 0) {
            accumulator.push(child);
        }
        accumulator.push(curr);
        if (prevKey && prevKey === toKey(curr)) {
            accumulator.push(child);
        }
        return accumulator;
    }, []);
}
export function onChildChanged(arr, child, toKey, prevKey) {
    const childKey = toKey(child);
    return arr.reduce((accumulator, val, i) => {
        const valKey = toKey(val);
        if (!prevKey && i == 0) {
            accumulator.push(child);
            if (valKey !== childKey) {
                accumulator.push(val);
            }
        }
        else if (valKey === prevKey) {
            accumulator.push(val);
            accumulator.push(child);
        }
        else if (valKey !== childKey) {
            accumulator.push(val);
        }
        return accumulator;
    }, []);
}
export function onChildRemoved(arr, child, toKey) {
    let childKey = toKey(child);
    return arr.filter(c => toKey(c) !== childKey);
}
export function onChildUpdated(arr, child, toKey, prevKey) {
    return arr.map((v, i, arr) => {
        if (!prevKey && !i) {
            return child;
        }
        else if (i > 0 && toKey(arr[i - 1]) === prevKey) {
            return child;
        }
        else {
            return v;
        }
    });
}
//# sourceMappingURL=firebase_list_factory.js.map