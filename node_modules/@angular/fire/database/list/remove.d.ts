import { DatabaseReference } from '../interfaces';
import { database } from 'firebase/app';
export declare function createRemoveMethod<T>(ref: DatabaseReference): (item?: string | database.Reference | database.DataSnapshot | undefined) => any;
