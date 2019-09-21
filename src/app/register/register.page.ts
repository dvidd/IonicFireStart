import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  email: string ;
  password: string ;
  cpassword: string ;

  passwordType = 'password';
  passwordIcon = 'eye-off';

  constructor(public afr: AngularFireAuth, public rout: Router , public alertController: AlertController) { }



  async register() {

    const { email, password, cpassword } = this;

    if (password !== cpassword) {
      this.errorpassIguales();
      this.rout.navigate(['/register']);
    } else {
      try {
        await this.afr.auth.createUserWithEmailAndPassword(email, password).then(data => {
          console.log(data);
          setTimeout( () => {
            this.rout.navigate(['']);
          }, 1000);
        });

      } catch (error) {
        console.log(error);
        if (error.code === 'auth/wrong-password') {
          this.error('Incorrect Password');
        }  if (error.code === 'auth/user-not-found') {
          this.error('User dont found');
        }
        if (error.code === 'auth/email-already-in-use') {
          this.error('User already use');
        }
        if ( error.code === 'auth/argument-error') {
          this.error('Argument error');
         }
         if ( error.code === 'auth/invalid-email') {
          this.error('Invalid email');
         }
      }
    }
  }
  goLogin() {
    this.rout.navigate(['/login']);
  }

  async errorpassIguales() {
    const alert = await this.alertController.create({
      message: 'The password dont macth',
      buttons: ['OK']
    });

    await alert.present();
  }

  async errorServ() {
    const alert = await this.alertController.create({
      message: 'Something went wrong try later',
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentLoading(loading) {
    return await loading.present();
  }

  async error(mensaje: string) {
    const alert = await this.alertController.create({
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
moveFocus(nextElement) {
  nextElement.setFocus();
}

}
