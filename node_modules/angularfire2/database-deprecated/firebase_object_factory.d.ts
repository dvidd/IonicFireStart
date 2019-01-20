import { FirebaseObjectObservable } from './firebase_object_observable';
import 'firebase/database';
import { FirebaseObjectFactoryOpts, DatabaseReference } from './interfaces';
export declare function FirebaseObjectFactory(ref: DatabaseReference, {preserveSnapshot}?: FirebaseObjectFactoryOpts): FirebaseObjectObservable<any>;
