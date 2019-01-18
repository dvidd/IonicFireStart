(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('rxjs/operators'), require('@angular/fire'), require('@angular/core'), require('@angular/common'), require('firebase/firestore')) :
    typeof define === 'function' && define.amd ? define(['exports', 'rxjs', 'rxjs/operators', '@angular/fire', '@angular/core', '@angular/common', 'firebase/firestore'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}, global.angularfire2.firestore = {}),global.rxjs,global.rxjs.operators,global.angularfire2,global.ng.core,global.ng.common));
}(this, (function (exports,rxjs,operators,fire,core,common) { 'use strict';

    function _fromRef(ref) {
        return new rxjs.Observable(function (subscriber) {
            var unsubscribe = ref.onSnapshot(subscriber);
            return { unsubscribe: unsubscribe };
        });
    }
    function fromRef(ref) {
        return _fromRef(ref).pipe(operators.share());
    }
    function fromDocRef(ref) {
        return fromRef(ref)
            .pipe(operators.map(function (payload) { return ({ payload: payload, type: 'value' }); }));
    }
    function fromCollectionRef(ref) {
        return fromRef(ref).pipe(operators.map(function (payload) { return ({ payload: payload, type: 'query' }); }));
    }

    function docChanges(query) {
        return fromCollectionRef(query)
            .pipe(operators.map(function (action) {
            return action.payload.docChanges()
                .map(function (change) { return ({ type: change.type, payload: change }); });
        }));
    }
    function sortedChanges(query, events) {
        return fromCollectionRef(query)
            .pipe(operators.map(function (changes) { return changes.payload.docChanges(); }), operators.scan(function (current, changes) { return combineChanges(current, changes, events); }, []), operators.map(function (changes) { return changes.map(function (c) { return ({ type: c.type, payload: c }); }); }));
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
                if (combined[change.newIndex] && combined[change.newIndex].doc.id == change.doc.id) ;
                else {
                    combined.splice(change.newIndex, 0, change);
                }
                break;
            case 'modified':
                if (combined[change.oldIndex] == null || combined[change.oldIndex].doc.id == change.doc.id) {
                    if (change.oldIndex !== change.newIndex) {
                        combined.splice(change.oldIndex, 1);
                        combined.splice(change.newIndex, 0, change);
                    }
                    else {
                        combined.splice(change.newIndex, 1, change);
                    }
                }
                break;
            case 'removed':
                if (combined[change.oldIndex] && combined[change.oldIndex].doc.id == change.doc.id) {
                    combined.splice(change.oldIndex, 1);
                }
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
        function AngularFirestoreCollection(ref, query, afs) {
            this.ref = ref;
            this.query = query;
            this.afs = afs;
        }
        AngularFirestoreCollection.prototype.stateChanges = function (events) {
            if (!events || events.length === 0) {
                return this.afs.scheduler.keepUnstableUntilFirst(this.afs.scheduler.runOutsideAngular(docChanges(this.query)));
            }
            return this.afs.scheduler.keepUnstableUntilFirst(this.afs.scheduler.runOutsideAngular(docChanges(this.query)))
                .pipe(operators.map(function (actions) { return actions.filter(function (change) { return events.indexOf(change.type) > -1; }); }), operators.filter(function (changes) { return changes.length > 0; }));
        };
        AngularFirestoreCollection.prototype.auditTrail = function (events) {
            return this.stateChanges(events).pipe(operators.scan(function (current, action) { return current.concat(action); }, []));
        };
        AngularFirestoreCollection.prototype.snapshotChanges = function (events) {
            var validatedEvents = validateEventsArray(events);
            var sortedChanges$ = sortedChanges(this.query, validatedEvents);
            var scheduledSortedChanges$ = this.afs.scheduler.runOutsideAngular(sortedChanges$);
            return this.afs.scheduler.keepUnstableUntilFirst(scheduledSortedChanges$);
        };
        AngularFirestoreCollection.prototype.valueChanges = function () {
            var fromCollectionRef$ = fromCollectionRef(this.query);
            var scheduled$ = this.afs.scheduler.runOutsideAngular(fromCollectionRef$);
            return this.afs.scheduler.keepUnstableUntilFirst(scheduled$)
                .pipe(operators.map(function (actions) { return actions.payload.docs.map(function (a) { return a.data(); }); }));
        };
        AngularFirestoreCollection.prototype.get = function (options) {
            return rxjs.from(this.query.get(options)).pipe(fire.runInZone(this.afs.scheduler.zone));
        };
        AngularFirestoreCollection.prototype.add = function (data) {
            return this.ref.add(data);
        };
        AngularFirestoreCollection.prototype.doc = function (path) {
            return new AngularFirestoreDocument(this.ref.doc(path), this.afs);
        };
        return AngularFirestoreCollection;
    }());

    var AngularFirestoreDocument = (function () {
        function AngularFirestoreDocument(ref, afs) {
            this.ref = ref;
            this.afs = afs;
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
            return new AngularFirestoreCollection(ref, query, this.afs);
        };
        AngularFirestoreDocument.prototype.snapshotChanges = function () {
            var fromDocRef$ = fromDocRef(this.ref);
            var scheduledFromDocRef$ = this.afs.scheduler.runOutsideAngular(fromDocRef$);
            return this.afs.scheduler.keepUnstableUntilFirst(scheduledFromDocRef$);
        };
        AngularFirestoreDocument.prototype.valueChanges = function () {
            return this.snapshotChanges().pipe(operators.map(function (action) {
                return action.payload.data();
            }));
        };
        AngularFirestoreDocument.prototype.get = function (options) {
            return rxjs.from(this.ref.get(options)).pipe(fire.runInZone(this.afs.scheduler.zone));
        };
        return AngularFirestoreDocument;
    }());

    var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (undefined && undefined.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var __param = (undefined && undefined.__param) || function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };
    var EnablePersistenceToken = new core.InjectionToken('angularfire2.enableFirestorePersistence');
    var PersistenceSettingsToken = new core.InjectionToken('angularfire2.firestore.persistenceSettings');
    var FirestoreSettingsToken = new core.InjectionToken('angularfire2.firestore.settings');
    var DefaultFirestoreSettings = { timestampsInSnapshots: true };
    function associateQuery(collectionRef, queryFn) {
        if (queryFn === void 0) { queryFn = function (ref) { return ref; }; }
        var query = queryFn(collectionRef);
        var ref = collectionRef;
        return { query: query, ref: ref };
    }
    var AngularFirestore = (function () {
        function AngularFirestore(options, nameOrConfig, shouldEnablePersistence, settings, platformId, zone, persistenceSettings) {
            var _this = this;
            this.scheduler = new fire.FirebaseZoneScheduler(zone, platformId);
            this.firestore = zone.runOutsideAngular(function () {
                var app = fire._firebaseAppFactory(options, nameOrConfig);
                var firestore$$1 = app.firestore();
                firestore$$1.settings(settings || DefaultFirestoreSettings);
                return firestore$$1;
            });
            if (shouldEnablePersistence && common.isPlatformBrowser(platformId)) {
                var enablePersistence = function () {
                    try {
                        return rxjs.from(_this.firestore.enablePersistence(persistenceSettings || undefined).then(function () { return true; }, function () { return false; }));
                    }
                    catch (e) {
                        return rxjs.of(false);
                    }
                };
                this.persistenceEnabled$ = zone.runOutsideAngular(enablePersistence);
            }
            else {
                this.persistenceEnabled$ = rxjs.of(false);
            }
        }
        AngularFirestore.prototype.collection = function (pathOrRef, queryFn) {
            var collectionRef;
            if (typeof pathOrRef === 'string') {
                collectionRef = this.firestore.collection(pathOrRef);
            }
            else {
                collectionRef = pathOrRef;
            }
            var _a = associateQuery(collectionRef, queryFn), ref = _a.ref, query = _a.query;
            return new AngularFirestoreCollection(ref, query, this);
        };
        AngularFirestore.prototype.doc = function (pathOrRef) {
            var ref;
            if (typeof pathOrRef === 'string') {
                ref = this.firestore.doc(pathOrRef);
            }
            else {
                ref = pathOrRef;
            }
            return new AngularFirestoreDocument(ref, this);
        };
        AngularFirestore.prototype.createId = function () {
            return this.firestore.collection('_').doc().id;
        };
        AngularFirestore = __decorate([
            core.Injectable(),
            __param(0, core.Inject(fire.FirebaseOptionsToken)),
            __param(1, core.Optional()), __param(1, core.Inject(fire.FirebaseNameOrConfigToken)),
            __param(2, core.Optional()), __param(2, core.Inject(EnablePersistenceToken)),
            __param(3, core.Optional()), __param(3, core.Inject(FirestoreSettingsToken)),
            __param(4, core.Inject(core.PLATFORM_ID)),
            __param(6, core.Optional()), __param(6, core.Inject(PersistenceSettingsToken)),
            __metadata("design:paramtypes", [Object, Object, Boolean, Object, Object,
                core.NgZone, Object])
        ], AngularFirestore);
        return AngularFirestore;
    }());

    var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var AngularFirestoreModule = (function () {
        function AngularFirestoreModule() {
        }
        AngularFirestoreModule_1 = AngularFirestoreModule;
        AngularFirestoreModule.enablePersistence = function (persistenceSettings) {
            return {
                ngModule: AngularFirestoreModule_1,
                providers: [
                    { provide: EnablePersistenceToken, useValue: true },
                    { provide: PersistenceSettingsToken, useValue: persistenceSettings },
                ]
            };
        };
        var AngularFirestoreModule_1;
        AngularFirestoreModule = AngularFirestoreModule_1 = __decorate$1([
            core.NgModule({
                providers: [AngularFirestore]
            })
        ], AngularFirestoreModule);
        return AngularFirestoreModule;
    }());

    exports.EnablePersistenceToken = EnablePersistenceToken;
    exports.PersistenceSettingsToken = PersistenceSettingsToken;
    exports.FirestoreSettingsToken = FirestoreSettingsToken;
    exports.DefaultFirestoreSettings = DefaultFirestoreSettings;
    exports.associateQuery = associateQuery;
    exports.AngularFirestore = AngularFirestore;
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
