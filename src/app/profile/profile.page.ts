import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ServicesService } from '../services/services.service';
import { ThemeService } from '../services/theme.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  uid: any;
  item: any;
  anuncios: any;
  empty: Boolean;

  constructor(private rout: Router, private services: ServicesService, private aut: AngularFireAuth , private theme: ThemeService) {

  }

  enableDark() {
    this.theme.enableDark();
    console.log('bravo going dark');
    localStorage.setItem('theme', 'dark');
  }
  enableLight() {
    this.theme.enableLight();
    console.log('bravo going light');
    localStorage.setItem('theme', 'light');



  }

  update(e) {
    e.detail.checked ? this.enableDark() : this.enableLight()
  }

  ngOnInit() {
    this.getLogueado();
   }

  getLogueado() {
    this.aut.authState
      .subscribe(
        user => {
          if (user) {
            console.log('logeado');
            this.uid = user.uid;
            console.log(this.uid);
            this.getProfile(this.uid);
          } else {
            this.rout.navigateByUrl('/login');
          }
        },
        () => {
          this.rout.navigateByUrl('/login');
        }
      );
  }


  async getProfile(id) {
    await this.services.getProfile(id).subscribe((data => {
      console.log(data);
      if (data.length === 0) {
        this.empty = false;
        console.log('empty');
      } else {
        this.empty = true;
        this.item = data;
      }
    }));
  }



  goedit() {
    this.rout.navigateByUrl(`/edit-profile`);
  }

  async signOut() {
    const res = await this.aut.auth.signOut();
    console.log(res);
    this.rout.navigateByUrl('/login');
  }


}
