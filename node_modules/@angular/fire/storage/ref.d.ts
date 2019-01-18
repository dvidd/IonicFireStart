import { SettableMetadata, UploadMetadata, Reference } from './interfaces';
import { AngularFireUploadTask } from './task';
import { Observable } from 'rxjs';
import { FirebaseZoneScheduler } from '@angular/fire';
export interface AngularFireStorageReference {
    getDownloadURL(): Observable<any>;
    getMetadata(): Observable<any>;
    delete(): Observable<any>;
    child(path: string): any;
    updateMetatdata(meta: SettableMetadata): Observable<any>;
    put(data: any, metadata?: UploadMetadata | undefined): AngularFireUploadTask;
    putString(data: string, format?: string | undefined, metadata?: UploadMetadata | undefined): AngularFireUploadTask;
}
export declare function createStorageRef(ref: Reference, scheduler: FirebaseZoneScheduler): AngularFireStorageReference;
