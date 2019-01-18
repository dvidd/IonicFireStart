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
export const EnablePersistenceToken = new InjectionToken('angularfire2.enableFirestorePersistence');
export const PersistenceSettingsToken = new InjectionToken('angularfire2.firestore.persistenceSettings');
export const FirestoreSettingsToken = new InjectionToken('angularfire2.firestore.settings');
export const DefaultFirestoreSettings = { timestampsInSnapshots: true };
export function associateQuery(collectionRef, queryFn = ref => ref) {
    const query = queryFn(collectionRef);
    const ref = collectionRef;
    return { query, ref };
}
let AngularFirestore = class AngularFirestore {
    constructor(options, nameOrConfig, shouldEnablePersistence, settings, platformId, zone, persistenceSettings) {
        this.scheduler = new FirebaseZoneScheduler(zone, platformId);
        this.firestore = zone.runOutsideAngular(() => {
            const app = _firebaseAppFactory(options, nameOrConfig);
            const firestore = app.firestore();
            firestore.settings(settings || DefaultFirestoreSettings);
            return firestore;
        });
        if (shouldEnablePersistence && isPlatformBrowser(platformId)) {
            const enablePersistence = () => {
                try {
                    return from(this.firestore.enablePersistence(persistenceSettings || undefined).then(() => true, () => false));
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
    collection(pathOrRef, queryFn) {
        let collectionRef;
        if (typeof pathOrRef === 'string') {
            collectionRef = this.firestore.collection(pathOrRef);
        }
        else {
            collectionRef = pathOrRef;
        }
        const { ref, query } = associateQuery(collectionRef, queryFn);
        return new AngularFirestoreCollection(ref, query, this);
    }
    doc(pathOrRef) {
        let ref;
        if (typeof pathOrRef === 'string') {
            ref = this.firestore.doc(pathOrRef);
        }
        else {
            ref = pathOrRef;
        }
        return new AngularFirestoreDocument(ref, this);
    }
    createId() {
        return this.firestore.collection('_').doc().id;
    }
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
export { AngularFirestore };
//# sourceMappingURL=firestore.js.map