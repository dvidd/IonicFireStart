import { PathReference, DatabaseReference, FirebaseOperation, FirebaseOperationCases } from './interfaces';
import { FirebaseApp } from 'angularfire2';
export declare function isString(value: any): boolean;
export declare function isFirebaseDataSnapshot(value: any): boolean;
export declare function isNil(obj: any): boolean;
export declare function isFirebaseRef(value: any): boolean;
export declare function getRef(app: FirebaseApp, pathRef: PathReference): DatabaseReference;
export declare function checkOperationCases(item: FirebaseOperation, cases: FirebaseOperationCases): Promise<void>;
