import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { ServicesService } from "../services/services.service";

// import * as tmImage from "@teachablemachine/image";

@Component({
  selector: "app-main",
  templateUrl: "./main.page.html",
  styleUrls: ["./main.page.scss"]
})
export class MainPage implements OnInit {
  item: any;
  id: string;

  model: any;
  webcam: any;
  labelContainer: any;
  maxPredictions: any;

  URL = "../../assets/models/";

  constructor(
    private aut: AngularFireAuth,
    private router: Router,
    public services: ServicesService
  ) {}

  // // Load the image model and setup the webcam
  // async initModel() {
  //   alert("Model");
  //   const modelURL = this.URL + "model.json";
  //   const metadataURL = this.URL + "metadata.json";

  //   // load the model and metadata
  //   // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
  //   // or files from your local hard drive
  //   // Note: the pose library adds "tmImage" object to your window (window.tmImage)
  //   this.model = await tmImage.load(modelURL, metadataURL);
  //   this.maxPredictions = this.model.getTotalClasses();

  //   // Convenience function to setup a webcam
  //   const flip = true; // whether to flip the webcam
  //   this.webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
  //   await this.webcam.setup(); // request access to the webcam
  //   await this.webcam.play();
  //   window.requestAnimationFrame(this.loop.bind(this));

  //   // append elements to the DOM
  //   document.getElementById("webcam-container").appendChild(this.webcam.canvas);
  //   this.labelContainer = document.getElementById("label-container");
  //   for (let i = 0; i < this.maxPredictions; i++) {
  //     // and class labels
  //     this.labelContainer.appendChild(document.createElement("div"));
  //   }
  // }

  // async loop() {
  //   this.webcam.update(); // update the webcam frame
  //   await this.predict();
  //   window.requestAnimationFrame(this.loop.bind(this));
  // }

  // // run the webcam image through the image model
  // async predict() {
  //   // predict can take in an image, video or canvas html element
  //   const prediction = await this.model.predict(this.webcam.canvas);
  //   for (let i = 0; i < this.maxPredictions; i++) {
  //     const classPrediction =
  //       prediction[i].className + ": " + prediction[i].probability.toFixed(2);
  //     this.labelContainer.childNodes[i].innerHTML = classPrediction;
  //   }
  // }

  ngOnInit() {
    this.logued();
  }

  logued() {
    this.aut.authState.subscribe(
      user => {
        if (user) {
          console.log("loged");
          this.id = user.uid;
          console.log(this.id);
          this.getProfile(this.id);
        } else {
          this.router.navigateByUrl("/login");
        }
      },
      () => {
        // this.router.navigateByUrl('/login');
      }
    );
  }

  async signOut() {
    const res = await this.aut.auth.signOut();
    console.log(res);
    this.router.navigateByUrl("/login");
  }

  async getProfile(id) {
    await this.services.getProfile(id).subscribe((data: any) => {
      if (data.length === 0) {
        console.log("profile empty");
        this.router.navigateByUrl(`edit-profile`);
      } else {
        console.log("Profile not empty");
        console.log(data);
        this.item = data;
      }
    });
  }

  profile() {
    this.router.navigateByUrl(`profile`);
  }
}
