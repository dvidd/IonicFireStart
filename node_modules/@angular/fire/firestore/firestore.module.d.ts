import { ModuleWithProviders } from '@angular/core';
import { PersistenceSettings } from './interfaces';
import 'firebase/firestore';
export declare class AngularFirestoreModule {
    static enablePersistence(persistenceSettings?: PersistenceSettings): ModuleWithProviders;
}
