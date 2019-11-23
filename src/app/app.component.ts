import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public aut: AngularFireAuth,
    private rout: Router,
    private theme: ThemeService
  ) {
    this.initializeApp();
    if ( localStorage.getItem('theme') === 'dark') {
      this.theme.enableDark();
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });


    this.aut.authState
      .subscribe(
        user => {
          if (user) {
            // this.rout.navigateByUrl('');
          } else {
            this.rout.navigateByUrl('/login');
          }
        },
        () => {
          // this.rout.navigateByUrl('/login');
        }
      );
  }
}
