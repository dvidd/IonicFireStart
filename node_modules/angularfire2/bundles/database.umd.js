(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('firebase/database'), require('angularfire2'), require('rxjs/Observable'), require('rxjs/operator/observeOn'), require('rxjs/add/operator/map'), require('rxjs/add/operator/delay'), require('rxjs/add/operator/share'), require('rxjs/add/operator/scan'), require('rxjs/add/observable/merge'), require('rxjs/add/observable/of'), require('rxjs/add/operator/switchMap'), require('rxjs/add/operator/filter'), require('rxjs/add/operator/distinctUntilChanged'), require('rxjs/add/operator/skipWhile'), require('rxjs/add/operator/withLatestFrom')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'firebase/database', 'angularfire2', 'rxjs/Observable', 'rxjs/operator/observeOn', 'rxjs/add/operator/map', 'rxjs/add/operator/delay', 'rxjs/add/operator/share', 'rxjs/add/operator/scan', 'rxjs/add/observable/merge', 'rxjs/add/observable/of', 'rxjs/add/operator/switchMap', 'rxjs/add/operator/filter', 'rxjs/add/operator/distinctUntilChanged', 'rxjs/add/operator/skipWhile', 'rxjs/add/operator/withLatestFrom'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}, global.angularfire2.database = global.angularfire2.database || {}),global.ng.core,global.firebase,global.angularfire2,global.Rx,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype,global.Rx.Observable.prototype));
}(this, (function (exports,_angular_core,firebase_database,angularfire2,rxjs_Observable,rxjs_operator_observeOn,rxjs_add_operator_map,rxjs_add_operator_delay,rxjs_add_operator_share,rxjs_add_operator_scan,rxjs_add_observable_merge,rxjs_add_observable_of,rxjs_add_operator_switchMap,rxjs_add_operator_filter,rxjs_add_operator_distinctUntilChanged,rxjs_add_operator_skipWhile,rxjs_add_operator_withLatestFrom) { 'use strict';

function isString(value) {
    return typeof value === 'string';
}
function isFirebaseDataSnapshot(value) {
    return typeof value.exportVal === 'function';
}
function isNil(obj) {
    return obj === undefined || obj === null;
}
function isFirebaseRef(value) {
    return typeof value.set === 'function';
}
function getRef(app, pathRef) {
    return isFirebaseRef(pathRef) ? pathRef
        : app.database().ref(pathRef);
}
function checkOperationCases(item, cases) {
    if (isString(item)) {
        return cases.stringCase();
    }
    else if (isFirebaseRef(item)) {
        return cases.firebaseCase();
    }
    else if (isFirebaseDataSnapshot(item)) {
        return cases.snapshotCase();
    }
    throw new Error("Expects a string, snapshot, or reference. Got: " + typeof item);
}

function fromRef(ref, event, listenType) {
    if (listenType === void 0) { listenType = 'on'; }
    var ref$ = new rxjs_Observable.Observable(function (subscriber) {
        var fn = ref[listenType](event, function (snapshot, prevKey) {
            subscriber.next({ snapshot: snapshot, prevKey: prevKey });
            if (listenType == 'once') {
                subscriber.complete();
            }
        }, subscriber.error.bind(subscriber));
        if (listenType == 'on') {
            return { unsubscribe: function () { ref.off(event, fn); } };
        }
        else {
            return { unsubscribe: function () { } };
        }
    })
        .map(function (payload) {
        var snapshot = payload.snapshot, prevKey = payload.prevKey;
        var key = null;
        if (snapshot.exists()) {
            key = snapshot.key;
        }
        return { type: event, payload: snapshot, prevKey: prevKey, key: key };
    })
        .delay(0);
    return rxjs_operator_observeOn.observeOn.call(ref$, new angularfire2.ZoneScheduler(Zone.current)).share();
}

function listChanges(ref, events) {
    return fromRef(ref, 'value', 'once').switchMap(function (snapshotAction) {
        var childEvent$ = [rxjs_Observable.Observable.of(snapshotAction)];
        events.forEach(function (event) { return childEvent$.push(fromRef(ref, event)); });
        return rxjs_Observable.Observable.merge.apply(rxjs_Observable.Observable, childEvent$).scan(buildView, []);
    })
        .distinctUntilChanged();
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

function validateEventsArray(events) {
    if (isNil(events) || events.length === 0) {
        events = ['child_added', 'child_removed', 'child_changed', 'child_moved'];
    }
    return events;
}

function snapshotChanges$1(query, events) {
    events = validateEventsArray(events);
    return listChanges(query, (events));
}

function createStateChanges(query) {
    return function (events) { return stateChanges(query, events); };
}
function stateChanges(query, events) {
    events = (validateEventsArray(events));
    var childEvent$ = events.map(function (event) { return fromRef(query, event); });
    return rxjs_Observable.Observable.merge.apply(rxjs_Observable.Observable, childEvent$);
}

function createAuditTrail(query) {
    return function (events) { return auditTrail(query, events); };
}
function auditTrail(query, events) {
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

function createDataOperationMethod(ref, operation) {
    return function dataOperation(item, value) {
        return checkOperationCases(item, {
            stringCase: function () { return ref.child(item)[operation](value); },
            firebaseCase: function () { return item[operation](value); },
            snapshotCase: function () { return item.ref[operation](value); }
        });
    };
}

function createRemoveMethod(ref) {
    return function remove(item) {
        if (!item) {
            return ref.remove();
        }
        return checkOperationCases(item, {
            stringCase: function () { return ref.child(item).remove(); },
            firebaseCase: function () { return item.remove(); },
            snapshotCase: function () { return item.ref.remove(); }
        });
    };
}

function createListReference(query) {
    return {
        query: query,
        update: createDataOperationMethod(query.ref, 'update'),
        set: createDataOperationMethod(query.ref, 'set'),
        push: function (data) { return query.ref.push(data); },
        remove: createRemoveMethod(query.ref),
        snapshotChanges: function (events) {
            return snapshotChanges$1(query, events);
        },
        stateChanges: createStateChanges(query),
        auditTrail: createAuditTrail(query),
        valueChanges: function (events) {
            return snapshotChanges$1(query, events)
                .map(function (actions) { return actions.map(function (a) { return a.payload.val(); }); });
        }
    };
}

function createObjectSnapshotChanges(query) {
    return function snapshotChanges() {
        return fromRef(query, 'value');
    };
}

function createObjectReference(query) {
    return {
        query: query,
        snapshotChanges: createObjectSnapshotChanges(query),
        update: function (data) { return query.ref.update(data); },
        set: function (data) { return query.ref.set(data); },
        remove: function () { return query.ref.remove(); },
        valueChanges: function () {
            return createObjectSnapshotChanges(query)()
                .map(function (action) { return action.payload.exists() ? action.payload.val() : null; });
        },
    };
}

var AngularFireDatabase = (function () {
    function AngularFireDatabase(app) {
        this.app = app;
        this.database = app.database();
    }
    AngularFireDatabase.prototype.list = function (pathOrRef, queryFn) {
        var ref = getRef(this.app, pathOrRef);
        var query = ref;
        if (queryFn) {
            query = queryFn(ref);
        }
        return createListReference(query);
    };
    AngularFireDatabase.prototype.object = function (pathOrRef) {
        var ref = getRef(this.app, pathOrRef);
        return createObjectReference(ref);
    };
    AngularFireDatabase.prototype.createPushId = function () {
        return this.database.ref().push().key;
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
exports.listChanges = listChanges;
exports.createListReference = createListReference;
exports.snapshotChanges = snapshotChanges$1;
exports.createStateChanges = createStateChanges;
exports.stateChanges = stateChanges;
exports.createAuditTrail = createAuditTrail;
exports.auditTrail = auditTrail;
exports.fromRef = fromRef;
exports._getAngularFireDatabase = _getAngularFireDatabase;
exports.AngularFireDatabaseProvider = AngularFireDatabaseProvider;
exports.DATABASE_PROVIDERS = DATABASE_PROVIDERS;
exports.AngularFireDatabaseModule = AngularFireDatabaseModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
