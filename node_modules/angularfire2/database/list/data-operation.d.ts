import { DatabaseReference, FirebaseOperation } from '../interfaces';
export declare function createDataOperationMethod<T>(ref: DatabaseReference, operation: string): <T>(item: FirebaseOperation, value: T) => Promise<void>;
