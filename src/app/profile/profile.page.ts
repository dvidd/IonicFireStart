import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ServicesService } from '../services.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  id: any;
  item: any;
  anuncios: any;
  empty: Boolean;

  constructor(private rout: Router, private services: ServicesService, private aut: AngularFireAuth) {

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
            this.id = user.uid;
            console.log(this.id);
            this.getProfile(this.id);
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
