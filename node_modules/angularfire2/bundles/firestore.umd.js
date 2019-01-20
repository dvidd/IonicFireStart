(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('firebase/firestore'), require('rxjs/observable/from'), require('rxjs/add/operator/map'), require('@angular/core'), require('angularfire2'), require('rxjs/Observable'), require('rxjs/operator/observeOn'), require('rxjs/add/operator/share'), require('rxjs/add/operator/filter'), require('rxjs/add/operator/scan')) :
    typeof define === 'function' && define.amd ? define(['exports', 'firebase/firestore', 'rxjs/observable/from', 'rxjs/add/operator/map', '@angular/core', 'angularfire2', 'rxjs/Observable', 'rxjs/operator/observeOn', 'rxjs/add/operator/share', 'rxjs/add/operator/filter', 'rxjs/add/operator/scan'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}, global.angularfire2.firestore = global.angularfire2.firestore || {}),global.firebase,global.Rx.Observable,global.Rx.Observable.prototype,global.ng.core,global.angularfire2,global.Rx,global.Rx.Observable.prototype,global.Rx.Observable,global.Rx.Observable.prototype,global.Rx.Observable.prototype));
}(this, (function (exports,firebase_firestore,rxjs_observable_from,rxjs_add_operator_map,_angular_core,angularfire2,rxjs_Observable,rxjs_operator_observeOn,rxjs_add_operator_share,rxjs_add_operator_filter,rxjs_add_operator_scan) { 'use strict';

function _fromRef(ref) {
    var ref$ = new rxjs_Observable.Observable(function (subscriber) {
        var unsubscribe = ref.onSnapshot(subscriber);
        return { unsubscribe: unsubscribe };
    });
    return rxjs_operator_observeOn.observeOn.call(ref$, new angularfire2.ZoneScheduler(Zone.current));
}
function fromRef(ref) {
    return _fromRef(ref).share();
}
function fromDocRef(ref) {
    return fromRef(ref)
        .map(function (payload) { return ({ payload: payload, type: 'value' }); });
}
function fromCollectionRef(ref) {
    return fromRef(ref).map(function (payload) { return ({ payload: payload, type: 'query' }); });
}

function docChanges(query) {
    return fromCollectionRef(query)
        .map(function (action) {
        return action.payload.docChanges
            .map(function (change) { return ({ type: change.type, payload: change }); });
    });
}
function sortedChanges(query, events) {
    return fromCollectionRef(query)
        .map(function (changes) { return changes.payload.docChanges; })
        .scan(function (current, changes) { return combineChanges(current, changes, events); }, [])
        .map(function (changes) { return changes.map(function (c) { return ({ type: c.type, payload: c }); }); });
}
function combineChanges(current, changes, events) {
    changes.forEach(function (change) {
        if (events.indexOf(change.type) > -1) {
            current = combineChange(current, change);
        }
    });
    return current;
}
function combineChange(combined, change) {
    switch (change.type) {
        case 'added':
            if (combined[change.newIndex] && combined[change.newIndex].doc.id == change.doc.id) {
            }
            else {
                combined.splice(change.newIndex, 0, change);
            }
            break;
        case 'modified':
            if (change.oldIndex !== change.newIndex) {
                combined.splice(change.oldIndex, 1);
                combined.splice(change.newIndex, 0, change);
            }
            else {
                combined.splice(change.newIndex, 1, change);
            }
            break;
        case 'removed':
            combined.splice(change.oldIndex, 1);
            break;
    }
    return combined;
}

function validateEventsArray(events) {
    if (!events || events.length === 0) {
        events = ['added', 'removed', 'modified'];
    }
    return events;
}
var AngularFirestoreCollection = (function () {
    function AngularFirestoreCollection(ref, query) {
        this.ref = ref;
        this.query = query;
    }
    AngularFirestoreCollection.prototype.stateChanges = function (events) {
        if (!events || events.length === 0) {
            return docChanges(this.query);
        }
        return docChanges(this.query)
            .map(function (actions) { return actions.filter(function (change) { return events.indexOf(change.type) > -1; }); })
            .filter(function (changes) { return changes.length > 0; });
    };
    AngularFirestoreCollection.prototype.auditTrail = function (events) {
        return this.stateChanges(events).scan(function (current, action) { return current.concat(action); }, []);
    };
    AngularFirestoreCollection.prototype.snapshotChanges = function (events) {
        events = validateEventsArray(events);
        return sortedChanges(this.query, events);
    };
    AngularFirestoreCollection.prototype.valueChanges = function (events) {
        return fromCollectionRef(this.query)
            .map(function (actions) { return actions.payload.docs.map(function (a) { return a.data(); }); });
    };
    AngularFirestoreCollection.prototype.add = function (data) {
        return this.ref.add(data);
    };
    AngularFirestoreCollection.prototype.doc = function (path) {
        return new AngularFirestoreDocument(this.ref.doc(path));
    };
    return AngularFirestoreCollection;
}());

var AngularFirestoreDocument = (function () {
    function AngularFirestoreDocument(ref) {
        this.ref = ref;
    }
    AngularFirestoreDocument.prototype.set = function (data, options) {
        return this.ref.set(data, options);
    };
    AngularFirestoreDocument.prototype.update = function (data) {
        return this.ref.update(data);
    };
    AngularFirestoreDocument.prototype.delete = function () {
        return this.ref.delete();
    };
    AngularFirestoreDocument.prototype.collection = function (path, queryFn) {
        var collectionRef = this.ref.collection(path);
        var _a = associateQuery(collectionRef, queryFn), ref = _a.ref, query = _a.query;
        return new AngularFirestoreCollection(ref, query);
    };
    AngularFirestoreDocument.prototype.snapshotChanges = function () {
        return fromDocRef(this.ref);
    };
    AngularFirestoreDocument.prototype.valueChanges = function () {
        return this.snapshotChanges().map(function (action) {
            return (action.payload.exists ? action.payload.data() : null);
        });
    };
    return AngularFirestoreDocument;
}());

function associateQuery(collectionRef, queryFn) {
    if (queryFn === void 0) { queryFn = function (ref) { return ref; }; }
    var query = queryFn(collectionRef);
    var ref = collectionRef;
    return { query: query, ref: ref };
}
var AngularFirestore = (function () {
    function AngularFirestore(app, shouldEnablePersistence) {
        this.app = app;
        this.firestore = app.firestore();
        this.persistenceEnabled$ = shouldEnablePersistence ?
            rxjs_observable_from.from(app.firestore().enablePersistence().then(function () { return true; }, function () { return false; })) :
            rxjs_observable_from.from(new Promise(function (res, rej) { res(false); }));
    }
    AngularFirestore.prototype.collection = function (path, queryFn) {
        var collectionRef = this.firestore.collection(path);
        var _a = associateQuery(collectionRef, queryFn), ref = _a.ref, query = _a.query;
        return new AngularFirestoreCollection(ref, query);
    };
    AngularFirestore.prototype.doc = function (path) {
        var ref = this.firestore.doc(path);
        return new AngularFirestoreDocument(ref);
    };
    AngularFirestore.prototype.createId = function () {
        return this.firestore.collection('_').doc().id;
    };
    AngularFirestore.decorators = [
        { type: _angular_core.Injectable },
    ];
    AngularFirestore.ctorParameters = function () { return [
        { type: angularfire2.FirebaseApp, },
        null,
    ]; };
    return AngularFirestore;
}());

var EnablePersistenceToken = new _angular_core.InjectionToken('EnablePersistenceToken');
function _getAngularFirestore(app, enablePersistence) {
    return new AngularFirestore(app, enablePersistence);
}
var AngularFirestoreProvider = {
    provide: AngularFirestore,
    useFactory: _getAngularFirestore,
    deps: [angularfire2.FirebaseApp, EnablePersistenceToken]
};
var FIRESTORE_PROVIDERS = [
    AngularFirestoreProvider,
    { provide: EnablePersistenceToken, useValue: false },
];
var AngularFirestoreModule = (function () {
    function AngularFirestoreModule() {
    }
    AngularFirestoreModule.enablePersistence = function () {
        return {
            ngModule: angularfire2.AngularFireModule,
            providers: [
                { provide: EnablePersistenceToken, useValue: true },
                AngularFirestoreProvider
            ]
        };
    };
    AngularFirestoreModule.decorators = [
        { type: _angular_core.NgModule, args: [{
                    imports: [angularfire2.AngularFireModule],
                    providers: [FIRESTORE_PROVIDERS]
                },] },
    ];
    AngularFirestoreModule.ctorParameters = function () { return []; };
    return AngularFirestoreModule;
}());

exports.associateQuery = associateQuery;
exports.AngularFirestore = AngularFirestore;
exports.EnablePersistenceToken = EnablePersistenceToken;
exports._getAngularFirestore = _getAngularFirestore;
exports.AngularFirestoreProvider = AngularFirestoreProvider;
exports.FIRESTORE_PROVIDERS = FIRESTORE_PROVIDERS;
exports.AngularFirestoreModule = AngularFirestoreModule;
exports.validateEventsArray = validateEventsArray;
exports.AngularFirestoreCollection = AngularFirestoreCollection;
exports.AngularFirestoreDocument = AngularFirestoreDocument;
exports.docChanges = docChanges;
exports.sortedChanges = sortedChanges;
exports.combineChanges = combineChanges;
exports.combineChange = combineChange;
exports.fromRef = fromRef;
exports.fromDocRef = fromDocRef;
exports.fromCollectionRef = fromCollectionRef;

Object.defineProperty(exports, '__esModule', { value: true });

})));
