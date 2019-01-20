(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('firebase/database'), require('@angular/core'), require('angularfire2'), require('rxjs/Observable'), require('rxjs/operator/observeOn'), require('rxjs/observable/of'), require('rxjs/operator/combineLatest'), require('rxjs/operator/merge'), require('rxjs/operator/map'), require('rxjs/operator/auditTime'), require('rxjs/operator/switchMap')) :
    typeof define === 'function' && define.amd ? define(['exports', 'firebase/database', '@angular/core', 'angularfire2', 'rxjs/Observable', 'rxjs/operator/observeOn', 'rxjs/observable/of', 'rxjs/operator/combineLatest', 'rxjs/operator/merge', 'rxjs/operator/map', 'rxjs/operator/auditTime', 'rxjs/operator/switchMap'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}, global.angularfire2.database_deprecated = global.angularfire2.database_deprecated || {}),global.firebase,global.ng.core,global.angularfire2,global.Rx,global.Rx.Observable.prototype,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype));
}(this, (function (exports,firebase_database,_angular_core,angularfire2,rxjs_Observable,rxjs_operator_observeOn,rxjs_observable_of,rxjs_operator_combineLatest,rxjs_operator_merge,rxjs_operator_map,rxjs_operator_auditTime,rxjs_operator_switchMap) { 'use strict';

var REGEX_ABSOLUTE_URL = /^[a-z]+:\/\/.*/;
function isNil(obj) {
    return obj === undefined || obj === null;
}
function hasKey(obj, key) {
    return obj && obj[key] !== undefined;
}
function isString(value) {
    return typeof value === 'string';
}
function isFirebaseRef(value) {
    return typeof value.set === 'function';
}
function isFirebaseDataSnapshot(value) {
    return typeof value.exportVal === 'function';
}
function isAFUnwrappedSnapshot(value) {
    return typeof value.$key === 'string';
}

function isEmptyObject(obj) {
    if (isNil(obj)) {
        return false;
    }
    return Object.keys(obj).length === 0 && JSON.stringify(obj) === JSON.stringify({});
}
function unwrapMapFn(snapshot) {
    var unwrapped = !isNil(snapshot.val()) ? snapshot.val() : { $value: null };
    if ((/string|number|boolean/).test(typeof unwrapped)) {
        unwrapped = {
            $value: unwrapped
        };
    }
    Object.defineProperty(unwrapped, '$key', {
        value: snapshot.ref.key,
        enumerable: false
    });
    Object.defineProperty(unwrapped, '$exists', {
        value: function () {
            return snapshot.exists();
        },
        enumerable: false
    });
    return unwrapped;
}

function stripLeadingSlash(value) {
    if (value.substring(0, 1) === '/') {
        return value.substring(1, value.length);
    }
    else {
        return value;
    }
}
function isAbsoluteUrl(url) {
    return REGEX_ABSOLUTE_URL.test(url);
}
function getRef(app, pathRef) {
    if (isFirebaseRef(pathRef)) {
        return pathRef;
    }
    var path = pathRef;
    if (isAbsoluteUrl(pathRef)) {
        return app.database().refFromURL(path);
    }
    return app.database().ref(path);
}

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FirebaseListObservable = (function (_super) {
    __extends(FirebaseListObservable, _super);
    function FirebaseListObservable($ref, subscribe) {
        var _this = _super.call(this, subscribe) || this;
        _this.$ref = $ref;
        return _this;
    }
    FirebaseListObservable.prototype.lift = function (operator) {
        var observable = new FirebaseListObservable(this.$ref);
        observable.source = this;
        observable.operator = operator;
        observable.$ref = this.$ref;
        return observable;
    };
    FirebaseListObservable.prototype.push = function (val) {
        if (!this.$ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this.$ref.ref.push(val);
    };
    FirebaseListObservable.prototype.set = function (item, value) {
        var _this = this;
        return this._checkOperationCases(item, {
            stringCase: function () { return _this.$ref.ref.child(item).set(value); },
            firebaseCase: function () { return item.set(value); },
            snapshotCase: function () { return item.ref.set(value); },
            unwrappedSnapshotCase: function () { return _this.$ref.ref.child(item.$key).set(value); }
        });
    };
    FirebaseListObservable.prototype.update = function (item, value) {
        var _this = this;
        return this._checkOperationCases(item, {
            stringCase: function () { return _this.$ref.ref.child(item).update(value); },
            firebaseCase: function () { return item.update(value); },
            snapshotCase: function () { return item.ref.update(value); },
            unwrappedSnapshotCase: function () { return _this.$ref.ref.child(item.$key).update(value); }
        });
    };
    FirebaseListObservable.prototype.remove = function (item) {
        var _this = this;
        if (!item) {
            return this.$ref.ref.remove();
        }
        return this._checkOperationCases(item, {
            stringCase: function () { return _this.$ref.ref.child(item).remove(); },
            firebaseCase: function () { return item.remove(); },
            snapshotCase: function () { return item.ref.remove(); },
            unwrappedSnapshotCase: function () { return _this.$ref.ref.child(item.$key).remove(); }
        });
    };
    FirebaseListObservable.prototype._checkOperationCases = function (item, cases) {
        if (isString(item)) {
            return cases.stringCase();
        }
        else if (isFirebaseRef(item)) {
            return cases.firebaseCase();
        }
        else if (isFirebaseDataSnapshot(item)) {
            return cases.snapshotCase();
        }
        else if (isAFUnwrappedSnapshot(item)) {
            return cases.unwrappedSnapshotCase();
        }
        throw new Error("Method requires a key, snapshot, reference, or unwrapped snapshot. Got: " + typeof item);
    };
    return FirebaseListObservable;
}(rxjs_Observable.Observable));

var OrderByOptions;
(function (OrderByOptions) {
    OrderByOptions[OrderByOptions["Child"] = 0] = "Child";
    OrderByOptions[OrderByOptions["Key"] = 1] = "Key";
    OrderByOptions[OrderByOptions["Value"] = 2] = "Value";
    OrderByOptions[OrderByOptions["Priority"] = 3] = "Priority";
})(OrderByOptions || (OrderByOptions = {}));
var LimitToOptions;
(function (LimitToOptions) {
    LimitToOptions[LimitToOptions["First"] = 0] = "First";
    LimitToOptions[LimitToOptions["Last"] = 1] = "Last";
})(LimitToOptions || (LimitToOptions = {}));
var QueryOptions;
(function (QueryOptions) {
    QueryOptions[QueryOptions["EqualTo"] = 0] = "EqualTo";
    QueryOptions[QueryOptions["StartAt"] = 1] = "StartAt";
    QueryOptions[QueryOptions["EndAt"] = 2] = "EndAt";
})(QueryOptions || (QueryOptions = {}));

function observeQuery(query, audit) {
    if (audit === void 0) { audit = true; }
    if (isNil(query)) {
        return rxjs_observable_of.of((null));
    }
    return rxjs_Observable.Observable.create(function (observer) {
        var combined = rxjs_operator_combineLatest.combineLatest.call(getOrderObservables(query), getStartAtObservable(query), getEndAtObservable(query), getEqualToObservable(query), getLimitToObservables(query));
        if (audit) {
            combined = rxjs_operator_auditTime.auditTime.call(combined, 0);
        }
        combined
            .subscribe(function (_a) {
            var orderBy = _a[0], startAt = _a[1], endAt = _a[2], equalTo = _a[3], limitTo = _a[4];
            var serializedOrder = {};
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
function getOrderObservables(query) {
    var observables = ['orderByChild', 'orderByKey', 'orderByValue', 'orderByPriority']
        .map(function (key, option) {
        return ({ key: key, option: option });
    })
        .filter(function (_a) {
        var key = _a.key, option = _a.option;
        return !isNil(query[key]);
    })
        .map(function (_a) {
        var key = _a.key, option = _a.option;
        return mapToOrderBySelection(query[key], option);
    });
    if (observables.length === 1) {
        return observables[0];
    }
    else if (observables.length > 1) {
        return rxjs_operator_merge.merge.apply(observables[0], observables.slice(1));
    }
    else {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next((null));
        });
    }
}
function getLimitToObservables(query) {
    var observables = ['limitToFirst', 'limitToLast']
        .map(function (key, option) { return ({ key: key, option: option }); })
        .filter(function (_a) {
        var key = _a.key, option = _a.option;
        return !isNil(query[key]);
    })
        .map(function (_a) {
        var key = _a.key, option = _a.option;
        return mapToLimitToSelection(query[key], option);
    });
    if (observables.length === 1) {
        return observables[0];
    }
    else if (observables.length > 1) {
        var mergedObs = rxjs_operator_merge.merge.apply(observables[0], observables.slice(1));
        return mergedObs;
    }
    else {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next((null));
        });
    }
}
function getStartAtObservable(query) {
    if (query.startAt instanceof rxjs_Observable.Observable) {
        return query.startAt;
    }
    else if (hasKey(query, 'startAt')) {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next(query.startAt);
        });
    }
    else {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next(undefined);
        });
    }
}
function getEndAtObservable(query) {
    if (query.endAt instanceof rxjs_Observable.Observable) {
        return query.endAt;
    }
    else if (hasKey(query, 'endAt')) {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next(query.endAt);
        });
    }
    else {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next(undefined);
        });
    }
}
function getEqualToObservable(query) {
    if (query.equalTo instanceof rxjs_Observable.Observable) {
        return query.equalTo;
    }
    else if (hasKey(query, 'equalTo')) {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next(query.equalTo);
        });
    }
    else {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next(undefined);
        });
    }
}
function mapToOrderBySelection(value, key) {
    if (value instanceof rxjs_Observable.Observable) {
        return rxjs_operator_map.map
            .call(value, function (value) {
            return ({ value: value, key: key });
        });
    }
    else {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next({ key: key, value: value });
        });
    }
}
function mapToLimitToSelection(value, key) {
    if (value instanceof rxjs_Observable.Observable) {
        return rxjs_operator_map.map
            .call(value, function (value) { return ({ value: value, key: key }); });
    }
    else {
        return new rxjs_Observable.Observable(function (subscriber) {
            subscriber.next({ key: key, value: value });
        });
    }
}

function FirebaseListFactory(ref, _a) {
    var _b = _a === void 0 ? {} : _a, preserveSnapshot = _b.preserveSnapshot, _c = _b.query, query = _c === void 0 ? {} : _c;
    if (isEmptyObject(query)) {
        return firebaseListObservable(ref, { preserveSnapshot: preserveSnapshot });
    }
    var queryObs = observeQuery(query);
    return new FirebaseListObservable(ref, function (subscriber) {
        var sub = rxjs_operator_switchMap.switchMap.call(rxjs_operator_map.map.call(queryObs, function (query) {
            var queried = ref;
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
            if (hasKey(query, "equalTo")) {
                if (hasKey(query.equalTo, "value")) {
                    queried = queried.equalTo(query.equalTo.value, query.equalTo.key);
                }
                else {
                    queried = queried.equalTo(query.equalTo);
                }
                if (hasKey(query, "startAt") || hasKey(query, "endAt")) {
                    throw new Error('Query Error: Cannot use startAt or endAt with equalTo.');
                }
                if (!isNil(query.limitToFirst)) {
                    queried = queried.limitToFirst(query.limitToFirst);
                }
                if (!isNil(query.limitToLast)) {
                    queried = queried.limitToLast(query.limitToLast);
                }
                return queried;
            }
            if (hasKey(query, "startAt")) {
                if (hasKey(query.startAt, "value")) {
                    queried = queried.startAt(query.startAt.value, query.startAt.key);
                }
                else {
                    queried = queried.startAt(query.startAt);
                }
            }
            if (hasKey(query, "endAt")) {
                if (hasKey(query.endAt, "value")) {
                    queried = queried.endAt(query.endAt.value, query.endAt.key);
                }
                else {
                    queried = queried.endAt(query.endAt);
                }
            }
            if (!isNil(query.limitToFirst) && query.limitToLast) {
                throw new Error('Query Error: Cannot use limitToFirst with limitToLast.');
            }
            if (!isNil(query.limitToFirst)) {
                queried = queried.limitToFirst(query.limitToFirst);
            }
            if (!isNil(query.limitToLast)) {
                queried = queried.limitToLast(query.limitToLast);
            }
            return queried;
        }), function (queryRef, ix) {
            return firebaseListObservable(queryRef, { preserveSnapshot: preserveSnapshot });
        })
            .subscribe(subscriber);
        return function () { return sub.unsubscribe(); };
    });
}
function firebaseListObservable(ref, _a) {
    var preserveSnapshot = (_a === void 0 ? {} : _a).preserveSnapshot;
    var toValue = preserveSnapshot ? (function (snapshot) { return snapshot; }) : unwrapMapFn;
    var toKey = preserveSnapshot ? (function (value) { return value.key; }) : (function (value) { return value.$key; });
    var listObs = new FirebaseListObservable(ref, function (obs) {
        var handles = [];
        var hasLoaded = false;
        var lastLoadedKey = (null);
        var array = [];
        ref.once('value', function (snap) {
            if (snap.exists()) {
                snap.forEach(function (child) {
                    lastLoadedKey = child.key;
                });
                if (array.find(function (child) { return toKey(child) === lastLoadedKey; })) {
                    hasLoaded = true;
                    obs.next(array);
                }
            }
            else {
                hasLoaded = true;
                obs.next(array);
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        var addFn = ref.on('child_added', function (child, prevKey) {
            array = onChildAdded(array, toValue(child), toKey, prevKey);
            if (hasLoaded) {
                obs.next(array);
            }
            else if (child.key === lastLoadedKey) {
                hasLoaded = true;
                obs.next(array);
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        handles.push({ event: 'child_added', handle: addFn });
        var remFn = ref.on('child_removed', function (child) {
            array = onChildRemoved(array, toValue(child), toKey);
            if (hasLoaded) {
                obs.next(array);
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        handles.push({ event: 'child_removed', handle: remFn });
        var chgFn = ref.on('child_changed', function (child, prevKey) {
            array = onChildChanged(array, toValue(child), toKey, prevKey);
            if (hasLoaded) {
                obs.next(array);
            }
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        handles.push({ event: 'child_changed', handle: chgFn });
        return function () {
            handles.forEach(function (item) {
                ref.off(item.event, item.handle);
            });
        };
    });
    return rxjs_operator_observeOn.observeOn.call(listObs, new angularfire2.ZoneScheduler(Zone.current));
}
function onChildAdded(arr, child, toKey, prevKey) {
    if (!arr.length) {
        return [child];
    }
    return arr.reduce(function (accumulator, curr, i) {
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
function onChildChanged(arr, child, toKey, prevKey) {
    var childKey = toKey(child);
    return arr.reduce(function (accumulator, val, i) {
        var valKey = toKey(val);
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
function onChildRemoved(arr, child, toKey) {
    var childKey = toKey(child);
    return arr.filter(function (c) { return toKey(c) !== childKey; });
}
function onChildUpdated(arr, child, toKey, prevKey) {
    return arr.map(function (v, i, arr) {
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

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var FirebaseObjectObservable = (function (_super) {
    __extends$1(FirebaseObjectObservable, _super);
    function FirebaseObjectObservable(subscribe, $ref) {
        var _this = _super.call(this, subscribe) || this;
        _this.$ref = $ref;
        return _this;
    }
    FirebaseObjectObservable.prototype.lift = function (operator) {
        var observable = new FirebaseObjectObservable();
        observable.source = this;
        observable.operator = operator;
        observable.$ref = this.$ref;
        return observable;
    };
    FirebaseObjectObservable.prototype.set = function (value) {
        if (!this.$ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this.$ref.set(value);
    };
    FirebaseObjectObservable.prototype.update = function (value) {
        if (!this.$ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this.$ref.update(value);
    };
    FirebaseObjectObservable.prototype.remove = function () {
        if (!this.$ref) {
            throw new Error('No ref specified for this Observable!');
        }
        return this.$ref.remove();
    };
    return FirebaseObjectObservable;
}(rxjs_Observable.Observable));

function FirebaseObjectFactory(ref, _a) {
    var preserveSnapshot = (_a === void 0 ? {} : _a).preserveSnapshot;
    var objectObservable = new FirebaseObjectObservable(function (obs) {
        var fn = ref.on('value', function (snapshot) {
            obs.next(preserveSnapshot ? snapshot : unwrapMapFn(snapshot));
        }, function (err) {
            if (err) {
                obs.error(err);
                obs.complete();
            }
        });
        return function () { return ref.off('value', fn); };
    }, ref);
    return rxjs_operator_observeOn.observeOn.call(objectObservable, new angularfire2.ZoneScheduler(Zone.current));
}

var AngularFireDatabase = (function () {
    function AngularFireDatabase(app) {
        this.app = app;
        this.database = app.database();
    }
    AngularFireDatabase.prototype.list = function (pathOrRef, opts) {
        var ref = getRef(this.app, pathOrRef);
        return FirebaseListFactory(ref, opts);
    };
    AngularFireDatabase.prototype.object = function (pathOrRef, opts) {
        var ref = getRef(this.app, pathOrRef);
        return FirebaseObjectFactory(ref, opts);
    };
    AngularFireDatabase.decorators = [
        { type: _angular_core.Injectable },
    ];
    AngularFireDatabase.ctorParameters = function () { return [
        { type: angularfire2.FirebaseApp, },
    ]; };
    return AngularFireDatabase;
}());

function _getAngularFireDatabase(app) {
    return new AngularFireDatabase(app);
}
var AngularFireDatabaseProvider = {
    provide: AngularFireDatabase,
    useFactory: _getAngularFireDatabase,
    deps: [angularfire2.FirebaseApp]
};
var DATABASE_PROVIDERS = [
    AngularFireDatabaseProvider,
];
var AngularFireDatabaseModule = (function () {
    function AngularFireDatabaseModule() {
    }
    AngularFireDatabaseModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [angularfire2.AngularFireModule],
                    providers: [DATABASE_PROVIDERS]
                },] },
    ];
    AngularFireDatabaseModule.ctorParameters = function () { return []; };
    return AngularFireDatabaseModule;
}());

exports.AngularFireDatabase = AngularFireDatabase;
exports.FirebaseListFactory = FirebaseListFactory;
exports.onChildAdded = onChildAdded;
exports.onChildChanged = onChildChanged;
exports.onChildRemoved = onChildRemoved;
exports.onChildUpdated = onChildUpdated;
exports.FirebaseListObservable = FirebaseListObservable;
exports.FirebaseObjectFactory = FirebaseObjectFactory;
exports.FirebaseObjectObservable = FirebaseObjectObservable;
exports.observeQuery = observeQuery;
exports.getOrderObservables = getOrderObservables;
exports.getLimitToObservables = getLimitToObservables;
exports.getStartAtObservable = getStartAtObservable;
exports.getEndAtObservable = getEndAtObservable;
exports.getEqualToObservable = getEqualToObservable;
exports._getAngularFireDatabase = _getAngularFireDatabase;
exports.AngularFireDatabaseProvider = AngularFireDatabaseProvider;
exports.DATABASE_PROVIDERS = DATABASE_PROVIDERS;
exports.AngularFireDatabaseModule = AngularFireDatabaseModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
