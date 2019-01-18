(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('rxjs/operators'), require('@angular/core'), require('@angular/fire'), require('firebase/database')) :
    typeof define === 'function' && define.amd ? define(['exports', 'rxjs', 'rxjs/operators', '@angular/core', '@angular/fire', 'firebase/database'], factory) :
    (factory((global.angularfire2 = global.angularfire2 || {}, global.angularfire2.database = {}),global.rxjs,global.rxjs.operators,global.ng.core,global.angularfire2));
}(this, (function (exports,rxjs,operators,core,fire) { 'use strict';

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
    function getRef(database$$1, pathRef) {
        return isFirebaseRef(pathRef) ? pathRef
            : database$$1.ref(pathRef);
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
        return new rxjs.Observable(function (subscriber) {
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
        }).pipe(operators.map(function (payload) {
            var snapshot = payload.snapshot, prevKey = payload.prevKey;
            var key = null;
            if (snapshot.exists()) {
                key = snapshot.key;
            }
            return { type: event, payload: snapshot, prevKey: prevKey, key: key };
        }), operators.delay(0), operators.share());
    }

    function listChanges(ref, events) {
        return fromRef(ref, 'value', 'once').pipe(operators.switchMap(function (snapshotAction) {
            var childEvent$ = [rxjs.of(snapshotAction)];
            events.forEach(function (event) { return childEvent$.push(fromRef(ref, event)); });
            return rxjs.merge.apply(void 0, childEvent$).pipe(operators.scan(buildView, []));
        }), operators.distinctUntilChanged());
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

    function snapshotChanges(query, events) {
        events = validateEventsArray(events);
        return listChanges(query, events);
    }

    function stateChanges(query, events) {
        events = validateEventsArray(events);
        var childEvent$ = events.map(function (event) { return fromRef(query, event); });
        return rxjs.merge.apply(void 0, childEvent$);
    }

    function auditTrail(query, events) {
        var auditTrail$ = stateChanges(query, events)
            .pipe(operators.scan(function (current, action) { return current.concat([action]); }, []));
        return waitForLoaded(query, auditTrail$);
    }
    function loadedData(query) {
        return fromRef(query, 'value')
            .pipe(operators.map(function (data) {
            var lastKeyToLoad;
            data.payload.forEach(function (child) {
                lastKeyToLoad = child.key;
                return false;
            });
            return { data: data, lastKeyToLoad: lastKeyToLoad };
        }));
    }
    function waitForLoaded(query, action$) {
        var loaded$ = loadedData(query);
        return loaded$
            .pipe(operators.withLatestFrom(action$), operators.map(function (_a) {
            var loaded = _a[0], actions = _a[1];
            var lastKeyToLoad = loaded.lastKeyToLoad;
            var loadedKeys = actions.map(function (snap) { return snap.key; });
            return { actions: actions, lastKeyToLoad: lastKeyToLoad, loadedKeys: loadedKeys };
        }), operators.skipWhile(function (meta) { return meta.loadedKeys.indexOf(meta.lastKeyToLoad) === -1; }), operators.map(function (meta) { return meta.actions; }));
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

    function createListReference(query, afDatabase) {
        return {
            query: query,
            update: createDataOperationMethod(query.ref, 'update'),
            set: createDataOperationMethod(query.ref, 'set'),
            push: function (data) { return query.ref.push(data); },
            remove: createRemoveMethod(query.ref),
            snapshotChanges: function (events) {
                var snapshotChanges$ = snapshotChanges(query, events);
                return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(snapshotChanges$));
            },
            stateChanges: function (events) {
                var stateChanges$ = stateChanges(query, events);
                return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(stateChanges$));
            },
            auditTrail: function (events) {
                var auditTrail$ = auditTrail(query, events);
                return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(auditTrail$));
            },
            valueChanges: function (events) {
                var snapshotChanges$ = snapshotChanges(query, events);
                return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(snapshotChanges$)).pipe(operators.map(function (actions) { return actions.map(function (a) { return a.payload.val(); }); }));
            }
        };
    }

    function createObjectSnapshotChanges(query) {
        return function snapshotChanges() {
            return fromRef(query, 'value');
        };
    }

    function createObjectReference(query, afDatabase) {
        return {
            query: query,
            snapshotChanges: function () {
                var snapshotChanges$ = createObjectSnapshotChanges(query)();
                return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(snapshotChanges$));
            },
            update: function (data) { return query.ref.update(data); },
            set: function (data) { return query.ref.set(data); },
            remove: function () { return query.ref.remove(); },
            valueChanges: function () {
                var snapshotChanges$ = createObjectSnapshotChanges(query)();
                return afDatabase.scheduler.keepUnstableUntilFirst(afDatabase.scheduler.runOutsideAngular(snapshotChanges$)).pipe(operators.map(function (action) { return action.payload.exists() ? action.payload.val() : null; }));
            },
        };
    }

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
    var AngularFireDatabase = (function () {
        function AngularFireDatabase(options, nameOrConfig, databaseURL, platformId, zone) {
            this.scheduler = new fire.FirebaseZoneScheduler(zone, platformId);
            this.database = zone.runOutsideAngular(function () {
                var app = fire._firebaseAppFactory(options, nameOrConfig);
                return app.database(databaseURL || undefined);
            });
        }
        AngularFireDatabase.prototype.list = function (pathOrRef, queryFn) {
            var ref = getRef(this.database, pathOrRef);
            var query = ref;
            if (queryFn) {
                query = queryFn(ref);
            }
            return createListReference(query, this);
        };
        AngularFireDatabase.prototype.object = function (pathOrRef) {
            var ref = getRef(this.database, pathOrRef);
            return createObjectReference(ref, this);
        };
        AngularFireDatabase.prototype.createPushId = function () {
            return this.database.ref().push().key;
        };
        AngularFireDatabase = __decorate([
            core.Injectable(),
            __param(0, core.Inject(fire.FirebaseOptionsToken)),
            __param(1, core.Optional()), __param(1, core.Inject(fire.FirebaseNameOrConfigToken)),
            __param(2, core.Optional()), __param(2, core.Inject(fire.RealtimeDatabaseURL)),
            __param(3, core.Inject(core.PLATFORM_ID)),
            __metadata("design:paramtypes", [Object, Object, String, Object,
                core.NgZone])
        ], AngularFireDatabase);
        return AngularFireDatabase;
    }());

    var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var AngularFireDatabaseModule = (function () {
        function AngularFireDatabaseModule() {
        }
        AngularFireDatabaseModule = __decorate$1([
            core.NgModule({
                providers: [AngularFireDatabase]
            })
        ], AngularFireDatabaseModule);
        return AngularFireDatabaseModule;
    }());

    exports.RealtimeDatabaseURL = fire.RealtimeDatabaseURL;
    exports.AngularFireDatabase = AngularFireDatabase;
    exports.listChanges = listChanges;
    exports.createListReference = createListReference;
    exports.snapshotChanges = snapshotChanges;
    exports.stateChanges = stateChanges;
    exports.auditTrail = auditTrail;
    exports.fromRef = fromRef;
    exports.AngularFireDatabaseModule = AngularFireDatabaseModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
