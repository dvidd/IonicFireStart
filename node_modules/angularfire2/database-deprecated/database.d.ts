import * as firebase from 'firebase/app';
import 'firebase/database';
import { FirebaseApp } from 'angularfire2';
import { FirebaseListObservable } from './firebase_list_observable';
import { FirebaseListFactoryOpts, FirebaseObjectFactoryOpts, PathReference } from './interfaces';
import { FirebaseObjectObservable } from './firebase_object_observable';
export declare class AngularFireDatabase {
    app: FirebaseApp;
    database: firebase.database.Database;
    constructor(app: FirebaseApp);
    list(pathOrRef: PathReference, opts?: FirebaseListFactoryOpts): FirebaseListObservable<any[]>;
    object(pathOrRef: PathReference, opts?: FirebaseObjectFactoryOpts): FirebaseObjectObservable<any>;
}
