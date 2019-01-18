import { DataSnapshot, AFUnwrappedDataSnapshot, PathReference, DatabaseReference } from './interfaces';
import { FirebaseDatabase } from '@angular/fire';
export declare function isNil(obj: any): boolean;
export declare function hasKey(obj: Object, key: string): boolean;
export declare function isString(value: any): boolean;
export declare function isFirebaseRef(value: any): boolean;
export declare function isFirebaseDataSnapshot(value: any): boolean;
export declare function isAFUnwrappedSnapshot(value: any): boolean;
export declare function isFirebaseQuery(value: any): boolean;
export declare function isEmptyObject(obj: Object): boolean;
export interface CheckUrlRef {
    isUrl: () => any;
    isRef: () => any;
    isQuery?: () => any;
}
export declare function unwrapMapFn(snapshot: DataSnapshot): AFUnwrappedDataSnapshot;
export declare function stripTrailingSlash(value: string): string;
export declare function stripLeadingSlash(value: string): string;
export declare function isAbsoluteUrl(url: string): boolean;
export declare function getRef(database: FirebaseDatabase, pathRef: PathReference): DatabaseReference;
