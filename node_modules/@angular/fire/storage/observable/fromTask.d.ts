import { Observable } from 'rxjs';
import { UploadTask } from '../interfaces';
import { storage } from 'firebase/app';
export declare function fromTask(task: UploadTask): Observable<storage.UploadTaskSnapshot>;
