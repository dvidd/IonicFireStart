import { UploadTaskSnapshot, UploadTask } from './interfaces';
import { Observable } from 'rxjs';
export interface AngularFireUploadTask {
    task: UploadTask;
    snapshotChanges(): Observable<UploadTaskSnapshot | undefined>;
    percentageChanges(): Observable<number | undefined>;
    pause(): boolean;
    cancel(): boolean;
    resume(): boolean;
    then(onFulfilled?: ((a: UploadTaskSnapshot) => any) | null, onRejected?: ((a: Error) => any) | null): Promise<any>;
    catch(onRejected: (a: Error) => any): Promise<any>;
}
export declare function createUploadTask(task: UploadTask): AngularFireUploadTask;
