import { Injectable } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class FireionicService {

  constructor(public afAuth: AngularFireAuth) {
   }
  doLogin(email: string, pass: string) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, pass)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });
   }
}
