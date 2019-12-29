import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { ServicesService } from '../services/services.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  @ViewChild('imageProd') inputimageProd: ElementRef;
  id: any;
  uid: string;
  name: any;
  phone: string;
  adress: string;
  img: any;
  mail: string;
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  item: any;
  username: string;

  cp: Boolean;

  constructor(private rout: Router,
    private route: ActivatedRoute,
    private services: ServicesService,
    private afs: AngularFireStorage,
    private loadingController: LoadingController,
    private aut: AngularFireAuth) {
  }

  ngOnInit() {
    this.logueado();
  }




  logueado() {
    this.aut.authState
      .subscribe(
        user => {
          if (user) {
            this.mail = user.email;
            this.uid = user.uid;
            console.log(this.mail);
            this.getProfile(this.uid);
          }
        });
  }

  async getProfile(id) {
    await this.services.getProfile(id).subscribe((data: any) => {
      console.log(data);
      if (data.length !== 0) {
        this.cp = true;
        this.id = data[0].payload.doc.id;
        this.name = data[0].payload.doc.data().name;
        this.phone = data[0].payload.doc.data().phone;
        this.adress = data[0].payload.doc.data().adress;
        this.img = data[0].payload.doc.data().img;
        this.username =  data[0].payload.doc.data().username;
        console.log('profil full');
      } else {
        this.cp = false;
        console.log('profile empty');
      }

    });
  }


  onUpload(e) {
    console.log(e.target.files[0]);

    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `image/pic_${id}`;
    const ref = this.afs.ref(filePath);
    const task = this.afs.upload(filePath, file);
    this.uploadPercent = task.percentageChanges();
    this.presentLoading();
    task.snapshotChanges().pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
  }


  save(name, phone, adress, username) {
    console.log(this.cp);
    const image = this.inputimageProd.nativeElement.value;
    const data = {
      name: name,
      phone: phone,
      mail: this.mail,
      img: image || this.img,
      adress: adress,
      uid: this.uid,
      username: username || 'null'
    };
    console.log(data);
    if (this.cp === false) {
      this.services.createUser(data).then(
        res => {
          console.log('Upload' + res);
          this.rout.navigateByUrl(`/profile`);
        });
    } else {
      this.services.updateUser(data, this.id).then(
        res => {
          console.log('Upload' + res);
          this.rout.navigateByUrl(`/profile`);
        });
    }

  }


  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading image',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();

    console.log('Loading dismissed!');
  }
  moveFocus(nextElement) {
    nextElement.setFocus();
  }

}
