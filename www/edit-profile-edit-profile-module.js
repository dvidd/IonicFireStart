(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["edit-profile-edit-profile-module"],{

/***/ "./src/app/edit-profile/edit-profile.module.ts":
/*!*****************************************************!*\
  !*** ./src/app/edit-profile/edit-profile.module.ts ***!
  \*****************************************************/
/*! exports provided: EditProfilePageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditProfilePageModule", function() { return EditProfilePageModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _edit_profile_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./edit-profile.page */ "./src/app/edit-profile/edit-profile.page.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var routes = [
    {
        path: '',
        component: _edit_profile_page__WEBPACK_IMPORTED_MODULE_5__["EditProfilePage"]
    }
];
var EditProfilePageModule = /** @class */ (function () {
    function EditProfilePageModule() {
    }
    EditProfilePageModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes)
            ],
            declarations: [_edit_profile_page__WEBPACK_IMPORTED_MODULE_5__["EditProfilePage"]]
        })
    ], EditProfilePageModule);
    return EditProfilePageModule;
}());



/***/ }),

/***/ "./src/app/edit-profile/edit-profile.page.html":
/*!*****************************************************!*\
  !*** ./src/app/edit-profile/edit-profile.page.html ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header no-border>\n  <ion-toolbar no-border>\n   \n    <ion-title>Edit Profile</ion-title>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content padding>\n  <!-- <div text-center>\n    <img *ngIf=\"img\"  class=\"circle\" src=\"{{img}}\" width=\"200px\"> <br><br>\n    <img *ngIf=\"!img\" src=\"assets/frame.svg\" width=\"200px\"> <br><br>\n\n    \n  </div> -->\n  <div text-center>\n   <img *ngIf=\"img && !urlImage\" src=\"{{img}}\" class=\"circle\"> \n    <img *ngIf=\"urlImage\"  [src]=\"urlImage | async\" class=\"circle\" > \n   \n    <br>\n    <br>\n    <img *ngIf=\"!urlImage && !img\"  src=\"assets/user.svg\" width=\"200px\"> <br>\n    </div>\n\n\n  <div margin-bottom margin-top text-center>\n    <label class=\"custom-file-upload\" style=\"margin:auto;max-width:400px\">\n      <input id=\"file-upload\" placeholder=\"Seleciona imagen\" type=\"file\" accept=\".png, .jpg\"\n        (change)=\"onUpload($event)\" />\n      <ion-icon margin-right name=\"cloud-download\"></ion-icon> Select profile photo\n    </label>\n  </div>\n\n  <br>\n    <h3>Profile info</h3>\n\n  <br>\n  <ion-item margin-bottom margin-bottom >\n    <ion-input (keyup.enter)=\"moveFocus(b)\" type=\"text\" placeholder=\"Name\" [(ngModel)]=\"name\"></ion-input>\n  </ion-item>\n  <ion-item margin-bottom margin-bottom >\n    <ion-input #b (keyup.enter)=\"moveFocus(d)\" type=\"text\" placeholder=\"Phone\" [(ngModel)]=\"phone\"></ion-input>\n  </ion-item>\n\n  <ion-item margin-bottom margin-bottom >\n    <ion-input [(ngModel)]=\"mail\" disabled></ion-input>\n  </ion-item>\n\n  <ion-item margin-bottom margin-bottom >\n    <ion-input #d (keyup.enter)=\"save(name, phone,adress)\" type=\"text\" placeholder=\"Direcction\" [(ngModel)]=\"adress\">\n    </ion-input>\n  </ion-item>\n\n  <input #imageProd type=\"hidden\" [value]=\"urlImage | async\" style=\"color:black;\">\n  <br><br>\n  <ion-button mode=\"ios\" size=\"large\" (click)=\"save(name, phone,adress)\" class=\"main-container\" color=\"light\" expand=\"block\">\n    Save</ion-button>\n\n</ion-content>"

/***/ }),

/***/ "./src/app/edit-profile/edit-profile.page.scss":
/*!*****************************************************!*\
  !*** ./src/app/edit-profile/edit-profile.page.scss ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".welcome-card ion-img {\n  max-height: 35vh;\n  overflow: hidden; }\n\nh4 {\n  color: #222428;\n  font-size: 17px;\n  font-weight: bold; }\n\n#file-upload {\n  font-size: 14px; }\n\n.titulo {\n  color: #FCD000;\n  font-size: 24px;\n  font-weight: bold; }\n\nh1 {\n  font-size: 40px;\n  font-weight: bold;\n  text-align: center; }\n\n.boton ion-button {\n  height: 39px;\n  border-radius: 50px;\n  font-size: 17px;\n  font-weight: bold; }\n\n.sep {\n  margin-top: 10px; }\n\nh2 {\n  font-size: 1.5rem;\n  color: #232B38; }\n\n.input-card {\n  border-radius: 5rem;\n  background: #F5F6F7;\n  box-shadow: 0 3px 80px rgba(39, 68, 74, 0.2); }\n\nform.input-box {\n  border: 2px solid #C5CCCD;\n  border-radius: 1rem;\n  background: #FFFFFF;\n  -webkit-transition: .2s all;\n  transition: .2s all; }\n\nform.input-box:focus-within {\n  border: 2px solid #02C4D9; }\n\nform.input-box:focus-within.error {\n  border: 2px solid #F54D3D; }\n\ninput {\n  border: none;\n  background: transparent;\n  padding: 1.125rem 1rem;\n  width: 95%;\n  font-family: \"Poppins\", sans-serif;\n  font-weight: 500;\n  font-size: 1.5rem;\n  -webkit-transition: .2s all;\n  transition: .2s all; }\n\ninput:not(:last-child) {\n  border-bottom: 2px solid #ECEEEE; }\n\ninput::-webkit-input-placeholder {\n  color: #9DA8AB; }\n\ninput::-moz-placeholder {\n  color: #9DA8AB; }\n\ninput:-ms-input-placeholder {\n  color: #9DA8AB; }\n\ninput::-ms-input-placeholder {\n  color: #9DA8AB; }\n\ninput::placeholder {\n  color: #9DA8AB; }\n\ninput:focus {\n  outline: none;\n  color: #08242A;\n  padding: 2rem 1rem; }\n\ninput:focus::-webkit-input-placeholder {\n  color: #758589; }\n\ninput:focus::-moz-placeholder {\n  color: #758589; }\n\ninput:focus:-ms-input-placeholder {\n  color: #758589; }\n\ninput:focus::-ms-input-placeholder {\n  color: #758589; }\n\ninput:focus::placeholder {\n  color: #758589; }\n\ninput.error {\n  color: #F54D3D; }\n\ninput.success {\n  color: #02C4D9; }\n\n.buttone {\n  position: relative;\n  border: none;\n  padding: 1rem 3rem;\n  margin: 1rem;\n  border-radius: 99999px;\n  font-size: 1.5rem;\n  font-weight: 700;\n  font-family: \"Poppins\", sans-serif;\n  -webkit-transition: .2s all;\n  transition: .2s all;\n  -webkit-transition-timing-function: ease;\n          transition-timing-function: ease; }\n\n.buttone:hover {\n  -webkit-transform: translatey(3px);\n          transform: translatey(3px); }\n\n.buttone:focus {\n  outline: none; }\n\n.buttone.teal {\n  background-color: #02C4D9;\n  box-shadow: 0 7px 50px rgba(2, 196, 217, 0.5);\n  color: #FFFFFF; }\n\n.buttone.teal:hover {\n  box-shadow: 0 2px 10px rgba(2, 196, 217, 0.5); }\n\n.buttone.google {\n  background-color: #FFFFFF;\n  box-shadow: 0 3px 20px rgba(39, 68, 74, 0.2);\n  color: #506569;\n  font-weight: 600;\n  font-size: 22px;\n  line-height: 1rem; }\n\n.buttone.google > img {\n  height: 20px;\n  width: 20px; }\n\n.buttone.google:hover {\n  box-shadow: 0 1px 5px rgba(39, 68, 74, 0.2); }\n\n.ionicon {\n  font-size: 90px; }\n\n.fileUpload {\n  position: relative;\n  overflow: hidden;\n  margin: 10px; }\n\n.fileUpload input.upload {\n  position: absolute;\n  top: 0;\n  right: 0;\n  margin: 0;\n  padding: 0;\n  font-size: 20px;\n  cursor: pointer;\n  opacity: 0;\n  filter: alpha(opacity=0); }\n\ninput[type=\"file\"] {\n  display: none; }\n\n.custom-file-upload {\n  border: 1px solid #ccc;\n  display: inline-block;\n  padding: 6px 12px;\n  cursor: pointer;\n  width: 100%;\n  text-align: center;\n  color: var(--ion-color-primary); }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZGJhcnJlcm8vRGVza3RvcC8xMDAvNDcgSW9uaWMgNCBGaXJlYmFzZSAvSW9uaWMtNC1maXJlYmFzZS9Jb25pYy00LWZpcmViYXNlL3NyYy9hcHAvZWRpdC1wcm9maWxlL2VkaXQtcHJvZmlsZS5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxpQkFBZ0I7RUFDaEIsaUJBQWdCLEVBQ2pCOztBQUNEO0VBQ0UsZUFBYTtFQUNiLGdCQUFlO0VBQ2Ysa0JBQWlCLEVBQ2xCOztBQUVEO0VBQ0UsZ0JBQWMsRUFDZjs7QUFHRDtFQUNFLGVBQWM7RUFDZCxnQkFBZTtFQUNmLGtCQUFpQixFQUNsQjs7QUFFRDtFQUNFLGdCQUFlO0VBQ2Ysa0JBQWlCO0VBQ2pCLG1CQUFrQixFQUVuQjs7QUFFRDtFQUNFLGFBQVk7RUFDWixvQkFBbUI7RUFDbkIsZ0JBQWU7RUFDZixrQkFBaUIsRUFDbEI7O0FBRUQ7RUFDRSxpQkFBZ0IsRUFDakI7O0FBQ0Q7RUFDRSxrQkFBaUI7RUFDakIsZUFBYyxFQUNmOztBQUdEO0VBQ0Usb0JBQW1CO0VBQ25CLG9CQUFtQjtFQUNuQiw2Q0FBNEMsRUFDN0M7O0FBRUQ7RUFDRSwwQkFBeUI7RUFDekIsb0JBQW1CO0VBQ25CLG9CQUFtQjtFQUNuQiw0QkFBbUI7RUFBbkIsb0JBQW1CLEVBQ3BCOztBQUVEO0VBQ0UsMEJBQXlCLEVBQzFCOztBQUVEO0VBQ0UsMEJBQXlCLEVBQzFCOztBQUVEO0VBQ0UsYUFBWTtFQUNaLHdCQUF1QjtFQUN2Qix1QkFBc0I7RUFDdEIsV0FBVTtFQUNWLG1DQUFrQztFQUNsQyxpQkFBZ0I7RUFDaEIsa0JBQWlCO0VBQ2pCLDRCQUFtQjtFQUFuQixvQkFBbUIsRUFDcEI7O0FBRUQ7RUFDRSxpQ0FBZ0MsRUFDakM7O0FBRUQ7RUFDRSxlQUFjLEVBQ2Y7O0FBRkQ7RUFDRSxlQUFjLEVBQ2Y7O0FBRkQ7RUFDRSxlQUFjLEVBQ2Y7O0FBRkQ7RUFDRSxlQUFjLEVBQ2Y7O0FBRkQ7RUFDRSxlQUFjLEVBQ2Y7O0FBRUQ7RUFDRSxjQUFhO0VBQ2IsZUFBYztFQUNkLG1CQUFrQixFQUNuQjs7QUFFRDtFQUNFLGVBQWMsRUFDZjs7QUFGRDtFQUNFLGVBQWMsRUFDZjs7QUFGRDtFQUNFLGVBQWMsRUFDZjs7QUFGRDtFQUNFLGVBQWMsRUFDZjs7QUFGRDtFQUNFLGVBQWMsRUFDZjs7QUFFRDtFQUNFLGVBQWMsRUFDZjs7QUFFRDtFQUNFLGVBQWMsRUFDZjs7QUFFRDtFQUNFLG1CQUFrQjtFQUNsQixhQUFZO0VBQ1osbUJBQWtCO0VBQ2xCLGFBQVk7RUFDWix1QkFBc0I7RUFDdEIsa0JBQWlCO0VBQ2pCLGlCQUFnQjtFQUNoQixtQ0FBa0M7RUFDbEMsNEJBQW1CO0VBQW5CLG9CQUFtQjtFQUNuQix5Q0FBZ0M7VUFBaEMsaUNBQWdDLEVBQ2pDOztBQUVEO0VBQ0UsbUNBQTBCO1VBQTFCLDJCQUEwQixFQUMzQjs7QUFFRDtFQUNFLGNBQWEsRUFDZDs7QUFFRDtFQUNFLDBCQUF5QjtFQUN6Qiw4Q0FBNkM7RUFDN0MsZUFBYyxFQUNmOztBQUVEO0VBQ0UsOENBQTZDLEVBQzlDOztBQUVEO0VBQ0UsMEJBQXlCO0VBQ3pCLDZDQUE0QztFQUM1QyxlQUFjO0VBQ2QsaUJBQWdCO0VBQ2hCLGdCQUFlO0VBQ2Ysa0JBQWlCLEVBQ2xCOztBQUVEO0VBQ0UsYUFBWTtFQUNaLFlBQVcsRUFDWjs7QUFFRDtFQUNFLDRDQUEyQyxFQUM1Qzs7QUFHRDtFQUNFLGdCQUFlLEVBQ2hCOztBQUVEO0VBQ0UsbUJBQWtCO0VBQ2xCLGlCQUFnQjtFQUNoQixhQUFZLEVBQ2I7O0FBQ0Q7RUFDRSxtQkFBa0I7RUFDbEIsT0FBTTtFQUNOLFNBQVE7RUFDUixVQUFTO0VBQ1QsV0FBVTtFQUNWLGdCQUFlO0VBQ2YsZ0JBQWU7RUFDZixXQUFVO0VBQ1YseUJBQXdCLEVBQ3pCOztBQVFEO0VBQ0UsY0FBYSxFQUNkOztBQUNEO0VBQ0UsdUJBQXNCO0VBQ3RCLHNCQUFxQjtFQUNyQixrQkFBaUI7RUFDakIsZ0JBQWU7RUFDZixZQUFXO0VBQ1gsbUJBQWtCO0VBQ2xCLGdDQUE4QixFQUMvQiIsImZpbGUiOiJzcmMvYXBwL2VkaXQtcHJvZmlsZS9lZGl0LXByb2ZpbGUucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLndlbGNvbWUtY2FyZCBpb24taW1nIHtcbiAgICBtYXgtaGVpZ2h0OiAzNXZoO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gIH1cbiAgaDQge1xuICAgIGNvbG9yOiMyMjI0Mjg7XG4gICAgZm9udC1zaXplOiAxN3B4O1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICB9XG4gIFxuICAjZmlsZS11cGxvYWR7XG4gICAgZm9udC1zaXplOjE0cHg7XG4gIH1cbiAgXG4gIFxuICAudGl0dWxvIHtcbiAgICBjb2xvcjogI0ZDRDAwMDtcbiAgICBmb250LXNpemU6IDI0cHg7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gIH1cbiAgXG4gIGgxIHtcbiAgICBmb250LXNpemU6IDQwcHg7XG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBcbiAgfVxuICBcbiAgLmJvdG9uIGlvbi1idXR0b24ge1xuICAgIGhlaWdodDogMzlweDtcbiAgICBib3JkZXItcmFkaXVzOiA1MHB4O1xuICAgIGZvbnQtc2l6ZTogMTdweDtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbiAgfVxuICBcbiAgLnNlcCB7XG4gICAgbWFyZ2luLXRvcDogMTBweDtcbiAgfVxuICBoMiB7XG4gICAgZm9udC1zaXplOiAxLjVyZW07XG4gICAgY29sb3I6ICMyMzJCMzg7XG4gIH1cbiAgXG4gIFxuICAuaW5wdXQtY2FyZCB7XG4gICAgYm9yZGVyLXJhZGl1czogNXJlbTtcbiAgICBiYWNrZ3JvdW5kOiAjRjVGNkY3O1xuICAgIGJveC1zaGFkb3c6IDAgM3B4IDgwcHggcmdiYSgzOSwgNjgsIDc0LCAwLjIpO1xuICB9XG4gIFxuICBmb3JtLmlucHV0LWJveCB7XG4gICAgYm9yZGVyOiAycHggc29saWQgI0M1Q0NDRDtcbiAgICBib3JkZXItcmFkaXVzOiAxcmVtO1xuICAgIGJhY2tncm91bmQ6ICNGRkZGRkY7XG4gICAgdHJhbnNpdGlvbjogLjJzIGFsbDtcbiAgfVxuICBcbiAgZm9ybS5pbnB1dC1ib3g6Zm9jdXMtd2l0aGluIHtcbiAgICBib3JkZXI6IDJweCBzb2xpZCAjMDJDNEQ5O1xuICB9XG4gIFxuICBmb3JtLmlucHV0LWJveDpmb2N1cy13aXRoaW4uZXJyb3Ige1xuICAgIGJvcmRlcjogMnB4IHNvbGlkICNGNTREM0Q7XG4gIH1cbiAgXG4gIGlucHV0IHtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgcGFkZGluZzogMS4xMjVyZW0gMXJlbTtcbiAgICB3aWR0aDogOTUlO1xuICAgIGZvbnQtZmFtaWx5OiBcIlBvcHBpbnNcIiwgc2Fucy1zZXJpZjtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xuICAgIHRyYW5zaXRpb246IC4ycyBhbGw7XG4gIH1cbiAgXG4gIGlucHV0Om5vdCg6bGFzdC1jaGlsZCkge1xuICAgIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCAjRUNFRUVFO1xuICB9XG4gIFxuICBpbnB1dDo6cGxhY2Vob2xkZXIge1xuICAgIGNvbG9yOiAjOURBOEFCO1xuICB9XG4gIFxuICBpbnB1dDpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBjb2xvcjogIzA4MjQyQTtcbiAgICBwYWRkaW5nOiAycmVtIDFyZW07XG4gIH1cbiAgXG4gIGlucHV0OmZvY3VzOjpwbGFjZWhvbGRlciB7XG4gICAgY29sb3I6ICM3NTg1ODk7XG4gIH1cbiAgXG4gIGlucHV0LmVycm9yIHtcbiAgICBjb2xvcjogI0Y1NEQzRDtcbiAgfVxuICBcbiAgaW5wdXQuc3VjY2VzcyB7XG4gICAgY29sb3I6ICMwMkM0RDk7XG4gIH1cbiAgXG4gIC5idXR0b25lIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIHBhZGRpbmc6IDFyZW0gM3JlbTtcbiAgICBtYXJnaW46IDFyZW07XG4gICAgYm9yZGVyLXJhZGl1czogOTk5OTlweDtcbiAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGZvbnQtZmFtaWx5OiBcIlBvcHBpbnNcIiwgc2Fucy1zZXJpZjtcbiAgICB0cmFuc2l0aW9uOiAuMnMgYWxsO1xuICAgIHRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlO1xuICB9XG4gIFxuICAuYnV0dG9uZTpob3ZlciB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGV5KDNweCk7XG4gIH1cbiAgXG4gIC5idXR0b25lOmZvY3VzIHtcbiAgICBvdXRsaW5lOiBub25lO1xuICB9XG4gIFxuICAuYnV0dG9uZS50ZWFsIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDJDNEQ5O1xuICAgIGJveC1zaGFkb3c6IDAgN3B4IDUwcHggcmdiYSgyLCAxOTYsIDIxNywgMC41KTtcbiAgICBjb2xvcjogI0ZGRkZGRjtcbiAgfVxuICBcbiAgLmJ1dHRvbmUudGVhbDpob3ZlciB7XG4gICAgYm94LXNoYWRvdzogMCAycHggMTBweCByZ2JhKDIsIDE5NiwgMjE3LCAwLjUpO1xuICB9XG4gIFxuICAuYnV0dG9uZS5nb29nbGUge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNGRkZGRkY7XG4gICAgYm94LXNoYWRvdzogMCAzcHggMjBweCByZ2JhKDM5LCA2OCwgNzQsIDAuMik7XG4gICAgY29sb3I6ICM1MDY1Njk7XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBmb250LXNpemU6IDIycHg7XG4gICAgbGluZS1oZWlnaHQ6IDFyZW07XG4gIH1cbiAgXG4gIC5idXR0b25lLmdvb2dsZT5pbWcge1xuICAgIGhlaWdodDogMjBweDtcbiAgICB3aWR0aDogMjBweDtcbiAgfVxuICBcbiAgLmJ1dHRvbmUuZ29vZ2xlOmhvdmVyIHtcbiAgICBib3gtc2hhZG93OiAwIDFweCA1cHggcmdiYSgzOSwgNjgsIDc0LCAwLjIpO1xuICB9XG4gIFxuICBcbiAgLmlvbmljb24ge1xuICAgIGZvbnQtc2l6ZTogOTBweDtcbiAgfVxuICBcbiAgLmZpbGVVcGxvYWQge1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIG1hcmdpbjogMTBweDtcbiAgfVxuICAuZmlsZVVwbG9hZCBpbnB1dC51cGxvYWQge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDA7XG4gICAgcmlnaHQ6IDA7XG4gICAgbWFyZ2luOiAwO1xuICAgIHBhZGRpbmc6IDA7XG4gICAgZm9udC1zaXplOiAyMHB4O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBvcGFjaXR5OiAwO1xuICAgIGZpbHRlcjogYWxwaGEob3BhY2l0eT0wKTtcbiAgfVxuICBcbiAgXG4gIFxuICBcbiAgXG4gIC8vZXN0aWxvIGRlIGlucHV0IHRpcG8gZmlsZSBlbCBxdWUgZGViZXMgbW9kaWZpY2FyIGVzIGxhIGNsYXNlIC5jdXN0b20tZmlsZS11cGxvYWRcbiAgXG4gIGlucHV0W3R5cGU9XCJmaWxlXCJdIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG4gIC5jdXN0b20tZmlsZS11cGxvYWQge1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgIHBhZGRpbmc6IDZweCAxMnB4O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICB3aWR0aDogMTAwJTtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgY29sb3I6dmFyKC0taW9uLWNvbG9yLXByaW1hcnkpO1xuICB9XG4gICJdfQ== */"

/***/ }),

/***/ "./src/app/edit-profile/edit-profile.page.ts":
/*!***************************************************!*\
  !*** ./src/app/edit-profile/edit-profile.page.ts ***!
  \***************************************************/
/*! exports provided: EditProfilePage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditProfilePage", function() { return EditProfilePage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_fire_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/fire/auth */ "./node_modules/@angular/fire/auth/index.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_fire_storage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/fire/storage */ "./node_modules/@angular/fire/storage/index.js");
/* harmony import */ var _services_services_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/services.service */ "./src/app/services/services.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};







var EditProfilePage = /** @class */ (function () {
    function EditProfilePage(rout, route, services, afs, loadingController, aut) {
        this.rout = rout;
        this.route = route;
        this.services = services;
        this.afs = afs;
        this.loadingController = loadingController;
        this.aut = aut;
    }
    EditProfilePage.prototype.ngOnInit = function () {
        this.logueado();
    };
    EditProfilePage.prototype.logueado = function () {
        var _this = this;
        this.aut.authState
            .subscribe(function (user) {
            if (user) {
                _this.mail = user.email;
                _this.uid = user.uid;
                console.log(_this.mail);
                _this.getProfile(_this.uid);
            }
        });
    };
    EditProfilePage.prototype.getProfile = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.services.getProfile(id).subscribe(function (data) {
                            console.log(data);
                            if (data.length !== 0) {
                                _this.cp = true;
                                _this.id = data[0].payload.doc.id;
                                _this.name = data[0].payload.doc.data().name;
                                _this.phone = data[0].payload.doc.data().phone;
                                _this.adress = data[0].payload.doc.data().adress;
                                _this.img = data[0].payload.doc.data().img;
                                console.log('profil full');
                            }
                            else {
                                _this.cp = false;
                                console.log('profile empty');
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProfilePage.prototype.onUpload = function (e) {
        var _this = this;
        console.log(e.target.files[0]);
        var id = Math.random().toString(36).substring(2);
        var file = e.target.files[0];
        var filePath = "image/pic_" + id;
        var ref = this.afs.ref(filePath);
        var task = this.afs.upload(filePath, file);
        this.uploadPercent = task.percentageChanges();
        this.presentLoading();
        task.snapshotChanges().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_4__["finalize"])(function () { return _this.urlImage = ref.getDownloadURL(); })).subscribe();
    };
    EditProfilePage.prototype.save = function (name, phone, adress) {
        var _this = this;
        console.log(this.cp);
        var image = this.inputimageProd.nativeElement.value;
        var data = {
            name: name,
            phone: phone,
            mail: this.mail,
            img: image || this.img,
            adress: adress,
            uid: this.uid
        };
        console.log(data);
        if (this.cp === false) {
            this.services.crearUser(data).then(function (res) {
                console.log('Upload' + res);
                _this.rout.navigateByUrl("/profile");
            });
        }
        else {
            this.services.updateUser(data, this.id).then(function (res) {
                console.log('Upload' + res);
                _this.rout.navigateByUrl("/profile");
            });
        }
    };
    EditProfilePage.prototype.presentLoading = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loading, _a, role, data;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.loadingController.create({
                            message: 'Loading image',
                            duration: 2000
                        })];
                    case 1:
                        loading = _b.sent();
                        return [4 /*yield*/, loading.present()];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, loading.onDidDismiss()];
                    case 3:
                        _a = _b.sent(), role = _a.role, data = _a.data;
                        console.log('Loading dismissed!');
                        return [2 /*return*/];
                }
            });
        });
    };
    EditProfilePage.prototype.moveFocus = function (nextElement) {
        nextElement.setFocus();
    };
    __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"])('imageProd'),
        __metadata("design:type", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"])
    ], EditProfilePage.prototype, "inputimageProd", void 0);
    EditProfilePage = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-edit-profile',
            template: __webpack_require__(/*! ./edit-profile.page.html */ "./src/app/edit-profile/edit-profile.page.html"),
            styles: [__webpack_require__(/*! ./edit-profile.page.scss */ "./src/app/edit-profile/edit-profile.page.scss")]
        }),
        __metadata("design:paramtypes", [_angular_router__WEBPACK_IMPORTED_MODULE_1__["Router"],
            _angular_router__WEBPACK_IMPORTED_MODULE_1__["ActivatedRoute"],
            _services_services_service__WEBPACK_IMPORTED_MODULE_6__["ServicesService"],
            _angular_fire_storage__WEBPACK_IMPORTED_MODULE_5__["AngularFireStorage"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["LoadingController"],
            _angular_fire_auth__WEBPACK_IMPORTED_MODULE_2__["AngularFireAuth"]])
    ], EditProfilePage);
    return EditProfilePage;
}());



/***/ })

}]);
//# sourceMappingURL=edit-profile-edit-profile-module.js.map