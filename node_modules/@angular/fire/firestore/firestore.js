var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { InjectionToken, NgZone, PLATFORM_ID, Injectable, Inject, Optional } from '@angular/core';
import { of, from } from 'rxjs';
import { AngularFirestoreDocument } from './document/document';
import { AngularFirestoreCollection } from './collection/collection';
import { FirebaseOptionsToken, FirebaseNameOrConfigToken, _firebaseAppFactory, FirebaseZoneScheduler } from '@angular/fire';
import { isPlatformBrowser } from '@angular/common';
export var EnablePersistenceToken = new InjectionToken('angularfire2.enableFirestorePersistence');
export var PersistenceSettingsToken = new InjectionToken('angularfire2.firestore.persistenceSettings');
export var FirestoreSettingsToken = new InjectionToken('angularfire2.firestore.settings');
export var DefaultFirestoreSettings = { timestampsInSnapshots: true };
export function associateQuery(collectionRef, queryFn) {
    if (queryFn === void 0) { queryFn = function (ref) { return ref; }; }
    var query = queryFn(collectionRef);
    var ref = collectionRef;
    return { query: query, ref: ref };
}
var AngularFirestore = (function () {
    function AngularFirestore(options, nameOrConfig, shouldEnablePersistence, settings, platformId, zone, persistenceSettings) {
        var _this = this;
        this.scheduler = new FirebaseZoneScheduler(zone, platformId);
        this.firestore = zone.runOutsideAngular(function () {
            var app = _firebaseAppFactory(options, nameOrConfig);
            var firestore = app.firestore();
            firestore.settings(settings || DefaultFirestoreSettings);
            return firestore;
        });
        if (shouldEnablePersistence && isPlatformBrowser(platformId)) {
            var enablePersistence = function () {
                try {
                    return from(_this.firestore.enablePersistence(persistenceSettings || undefined).then(function () { return true; }, function () { return false; }));
                }
                catch (e) {
                    return of(false);
                }
            };
            this.persistenceEnabled$ = zone.runOutsideAngular(enablePersistence);
        }
        else {
            this.persistenceEnabled$ = of(false);
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
        Injectable(),
        __param(0, Inject(FirebaseOptionsToken)),
        __param(1, Optional()), __param(1, Inject(FirebaseNameOrConfigToken)),
        __param(2, Optional()), __param(2, Inject(EnablePersistenceToken)),
        __param(3, Optional()), __param(3, Inject(FirestoreSettingsToken)),
        __param(4, Inject(PLATFORM_ID)),
        __param(6, Optional()), __param(6, Inject(PersistenceSettingsToken)),
        __metadata("design:paramtypes", [Object, Object, Boolean, Object, Object,
            NgZone, Object])
    ], AngularFirestore);
    return AngularFirestore;
}());
export { AngularFirestore };
//# sourceMappingURL=firestore.js.map