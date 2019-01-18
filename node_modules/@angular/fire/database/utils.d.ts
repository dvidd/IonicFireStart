import { PathReference, DatabaseReference, FirebaseOperation, FirebaseOperationCases } from './interfaces';
import { FirebaseDatabase } from '@angular/fire';
export declare function isString(value: any): boolean;
export declare function isFirebaseDataSnapshot(value: any): boolean;
export declare function isNil(obj: any): boolean;
export declare function isFirebaseRef(value: any): boolean;
export declare function getRef(database: FirebaseDatabase, pathRef: PathReference): DatabaseReference;
export declare function checkOperationCases(item: FirebaseOperation, cases: FirebaseOperationCases): Promise<void>;
