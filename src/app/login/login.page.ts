import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';

// https://medium.com/@ryangordon210/integrating-google-login-to-your-ionic-app-with-firebase-771cf3d50957

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('username') user;
  @ViewChild('password') password;

  loginForm: FormGroup;

  constructor( public afAuth: AngularFireAuth) { }

  ngOnInit() {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  signInWithEmail(credentials) {
    console.log('Sign in with email');
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
  }


}
