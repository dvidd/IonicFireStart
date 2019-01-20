import 'firebase/database';
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase } from './database';
export declare function _getAngularFireDatabase(app: FirebaseApp): AngularFireDatabase;
export declare const AngularFireDatabaseProvider: {
    provide: typeof AngularFireDatabase;
    useFactory: (app: FirebaseApp) => AngularFireDatabase;
    deps: typeof FirebaseApp[];
};
export declare const DATABASE_PROVIDERS: {
    provide: typeof AngularFireDatabase;
    useFactory: (app: FirebaseApp) => AngularFireDatabase;
    deps: typeof FirebaseApp[];
}[];
export declare class AngularFireDatabaseModule {
}
