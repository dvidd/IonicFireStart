(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["login-login-module"],{

/***/ "./src/app/login/login.module.ts":
/*!***************************************!*\
  !*** ./src/app/login/login.module.ts ***!
  \***************************************/
/*! exports provided: LoginPageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginPageModule", function() { return LoginPageModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _login_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./login.page */ "./src/app/login/login.page.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var routes = [
    {
        path: '',
        component: _login_page__WEBPACK_IMPORTED_MODULE_5__["LoginPage"]
    }
];
var LoginPageModule = /** @class */ (function () {
    function LoginPageModule() {
    }
    LoginPageModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes)
            ],
            declarations: [_login_page__WEBPACK_IMPORTED_MODULE_5__["LoginPage"]]
        })
    ], LoginPageModule);
    return LoginPageModule;
}());



/***/ }),

/***/ "./src/app/login/login.page.html":
/*!***************************************!*\
  !*** ./src/app/login/login.page.html ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "\n<ion-content padding text-center>\n    <div  class=\"form\">\n        <img style=\"margin:auto;\" src=\"assets/icon/ionic_firebase-logo.png\" alt=\"\">\n        <h4>Login\n        </h4>\n        <h3 class=\"goodfont\">Ionic  Firestarter</h3>\n        <ion-list margin-top margin-bottom>\n    \n            <ion-item>\n                <ion-input type=\"text\" tabindex=\"20\" (keyup.enter)=\"moveFocus(b)\" placeholder=\"Email\" [(ngModel)]=\"username\" required></ion-input>\n    \n            </ion-item>\n    \n            <ion-item>\n                <ion-input (keyup.enter)=\"login()\" [type]=\"passwordType\" #b placeholder=\"Password\" [(ngModel)]=\"password\" required></ion-input>\n                <ion-icon (click)='hideShowPassword()' name=\"eye\" item-right></ion-icon>\n            </ion-item>\n    \n        </ion-list>\n        <br>\n        <ion-button class=\"goodfont boton\" margin-bottom mode=\"ios\"  expand=\"block\"  (click)=\"gotoslides()\">Login</ion-button>\n        <br><br>\n        <p class=\"register-text\" (click)=\"goRegister()\">Dont have account?<a> Register</a> </p>\n    \n        <div margin-top margin-bottom (click)=\"loginGmail()\" class=\"tc flex jusify-center align-center flex-wrap w-100\">\n            <div class=\"w-100 tc flex align-center justify-center\">\n                <button class=\"buttone google flex justify-center align-center\"><img src=\"https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png\" class=\"flex self-center pr2\"  > Login with google</button>\n            </div>\n        </div> \n    </div>\n</ion-content>"

/***/ }),

/***/ "./src/app/login/login.page.scss":
/*!***************************************!*\
  !*** ./src/app/login/login.page.scss ***!
  \***************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "h4 {\n  color: #222428;\n  font-size: 17px;\n  font-weight: bold; }\n\n.titulo {\n  color: #FCD000;\n  font-size: 24px;\n  font-weight: bold; }\n\nh1 {\n  margin-top: 100px;\n  font-size: 50px;\n  font-weight: bold;\n  text-align: center;\n  color: #FCD000;\n  margin-bottom: 100px; }\n\n.boton ion-button {\n  height: 39px;\n  border-radius: 50px;\n  font-size: 17px;\n  font-weight: bold; }\n\n.sep {\n  margin-top: 10px; }\n\nh2 {\n  font-size: 1.5rem;\n  color: #232B38; }\n\nh3 {\n  color: #C5CCCD;\n  font-weight: 500; }\n\n.input-card {\n  border-radius: 5rem;\n  background: #F5F6F7;\n  box-shadow: 0 3px 80px rgba(39, 68, 74, 0.2); }\n\nform.input-box {\n  border: 2px solid #C5CCCD;\n  border-radius: 1rem;\n  background: #FFFFFF;\n  -webkit-transition: .2s all;\n  transition: .2s all; }\n\nform.input-box:focus-within {\n  border: 2px solid #02C4D9; }\n\nform.input-box:focus-within.error {\n  border: 2px solid #F54D3D; }\n\ninput {\n  border: none;\n  background: transparent;\n  padding: 1.125rem 1rem;\n  width: 95%;\n  font-family: \"Poppins\", sans-serif;\n  font-weight: 500;\n  font-size: 1.5rem;\n  -webkit-transition: .2s all;\n  transition: .2s all; }\n\ninput:not(:last-child) {\n  border-bottom: 2px solid #ECEEEE; }\n\ninput::-webkit-input-placeholder {\n  color: #9DA8AB; }\n\ninput::-moz-placeholder {\n  color: #9DA8AB; }\n\ninput:-ms-input-placeholder {\n  color: #9DA8AB; }\n\ninput::-ms-input-placeholder {\n  color: #9DA8AB; }\n\ninput::placeholder {\n  color: #9DA8AB; }\n\ninput:focus {\n  outline: none;\n  color: #08242A;\n  padding: 2rem 1rem; }\n\ninput:focus::-webkit-input-placeholder {\n  color: #758589; }\n\ninput:focus::-moz-placeholder {\n  color: #758589; }\n\ninput:focus:-ms-input-placeholder {\n  color: #758589; }\n\ninput:focus::-ms-input-placeholder {\n  color: #758589; }\n\ninput:focus::placeholder {\n  color: #758589; }\n\ninput.error {\n  color: #F54D3D; }\n\ninput.success {\n  color: #02C4D9; }\n\n.buttone {\n  position: relative;\n  border: none;\n  padding: 1rem 3rem;\n  margin: 1rem;\n  border-radius: 99999px;\n  font-size: 1.5rem;\n  font-weight: 700;\n  font-family: \"Poppins\", sans-serif;\n  -webkit-transition: .2s all;\n  transition: .2s all;\n  -webkit-transition-timing-function: ease;\n          transition-timing-function: ease; }\n\n.buttone:hover {\n  -webkit-transform: translatey(3px);\n          transform: translatey(3px); }\n\n.buttone:focus {\n  outline: none; }\n\n.buttone.teal {\n  background-color: #02C4D9;\n  box-shadow: 0 7px 50px rgba(2, 196, 217, 0.5);\n  color: #FFFFFF; }\n\n.buttone.teal:hover {\n  box-shadow: 0 2px 10px rgba(2, 196, 217, 0.5); }\n\n.buttone.google {\n  background-color: #FFFFFF;\n  box-shadow: 0 3px 20px rgba(39, 68, 74, 0.2);\n  color: #506569;\n  font-weight: 600;\n  font-size: 22px;\n  line-height: 1rem; }\n\n.buttone.google > img {\n  height: 20px;\n  width: 20px; }\n\n.buttone.google:hover {\n  box-shadow: 0 1px 5px rgba(39, 68, 74, 0.2); }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZGJhcnJlcm8vRGVza3RvcC8xMDAvNDcgSW9uaWMgNCBGaXJlYmFzZSAvSW9uaWMtNC1maXJlYmFzZS9Jb25pYy00LWZpcmViYXNlL3NyYy9hcHAvbG9naW4vbG9naW4ucGFnZS5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksZUFBYTtFQUNiLGdCQUFlO0VBQ2Ysa0JBQWlCLEVBQ3BCOztBQUVEO0VBQ0ksZUFBYztFQUNkLGdCQUFlO0VBQ2Ysa0JBQWlCLEVBQ3BCOztBQUVEO0VBQ0ksa0JBQWlCO0VBQ2pCLGdCQUFlO0VBQ2Ysa0JBQWlCO0VBQ2pCLG1CQUFrQjtFQUNsQixlQUFhO0VBQ2IscUJBQW9CLEVBQ3ZCOztBQUVEO0VBQ0ksYUFBWTtFQUNaLG9CQUFtQjtFQUNuQixnQkFBZTtFQUNmLGtCQUFpQixFQUNwQjs7QUFFRDtFQUNJLGlCQUFnQixFQUNuQjs7QUFhRDtFQUNJLGtCQUFpQjtFQUNqQixlQUFjLEVBQ2pCOztBQUVEO0VBQ0ksZUFBYztFQUNkLGlCQUFnQixFQUNuQjs7QUFFRDtFQUNJLG9CQUFtQjtFQUNuQixvQkFBbUI7RUFDbkIsNkNBQTRDLEVBQy9DOztBQUVEO0VBQ0ksMEJBQXlCO0VBQ3pCLG9CQUFtQjtFQUNuQixvQkFBbUI7RUFDbkIsNEJBQW1CO0VBQW5CLG9CQUFtQixFQUN0Qjs7QUFFRDtFQUNJLDBCQUF5QixFQUM1Qjs7QUFFRDtFQUNJLDBCQUF5QixFQUM1Qjs7QUFFRDtFQUNJLGFBQVk7RUFDWix3QkFBdUI7RUFDdkIsdUJBQXNCO0VBQ3RCLFdBQVU7RUFDVixtQ0FBa0M7RUFDbEMsaUJBQWdCO0VBQ2hCLGtCQUFpQjtFQUNqQiw0QkFBbUI7RUFBbkIsb0JBQW1CLEVBQ3RCOztBQUVEO0VBQ0ksaUNBQWdDLEVBQ25DOztBQUVEO0VBQ0ksZUFBYyxFQUNqQjs7QUFGRDtFQUNJLGVBQWMsRUFDakI7O0FBRkQ7RUFDSSxlQUFjLEVBQ2pCOztBQUZEO0VBQ0ksZUFBYyxFQUNqQjs7QUFGRDtFQUNJLGVBQWMsRUFDakI7O0FBRUQ7RUFDSSxjQUFhO0VBQ2IsZUFBYztFQUNkLG1CQUFrQixFQUNyQjs7QUFFRDtFQUNJLGVBQWMsRUFDakI7O0FBRkQ7RUFDSSxlQUFjLEVBQ2pCOztBQUZEO0VBQ0ksZUFBYyxFQUNqQjs7QUFGRDtFQUNJLGVBQWMsRUFDakI7O0FBRkQ7RUFDSSxlQUFjLEVBQ2pCOztBQUVEO0VBQ0ksZUFBYyxFQUNqQjs7QUFFRDtFQUNJLGVBQWMsRUFDakI7O0FBRUQ7RUFDSSxtQkFBa0I7RUFDbEIsYUFBWTtFQUNaLG1CQUFrQjtFQUNsQixhQUFZO0VBQ1osdUJBQXNCO0VBQ3RCLGtCQUFpQjtFQUNqQixpQkFBZ0I7RUFDaEIsbUNBQWtDO0VBQ2xDLDRCQUFtQjtFQUFuQixvQkFBbUI7RUFDbkIseUNBQWdDO1VBQWhDLGlDQUFnQyxFQUNuQzs7QUFFRDtFQUNJLG1DQUEwQjtVQUExQiwyQkFBMEIsRUFDN0I7O0FBRUQ7RUFDSSxjQUFhLEVBQ2hCOztBQUVEO0VBQ0ksMEJBQXlCO0VBQ3pCLDhDQUE2QztFQUM3QyxlQUFjLEVBQ2pCOztBQUVEO0VBQ0ksOENBQTZDLEVBQ2hEOztBQUVEO0VBQ0ksMEJBQXlCO0VBQ3pCLDZDQUE0QztFQUM1QyxlQUFjO0VBQ2QsaUJBQWdCO0VBQ2hCLGdCQUFlO0VBQ2Ysa0JBQWlCLEVBQ3BCOztBQUVEO0VBQ0ksYUFBWTtFQUNaLFlBQVcsRUFDZDs7QUFFRDtFQUNJLDRDQUEyQyxFQUM5QyIsImZpbGUiOiJzcmMvYXBwL2xvZ2luL2xvZ2luLnBhZ2Uuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImg0IHtcbiAgICBjb2xvcjojMjIyNDI4O1xuICAgIGZvbnQtc2l6ZTogMTdweDtcbiAgICBmb250LXdlaWdodDogYm9sZDtcbn1cblxuLnRpdHVsbyB7XG4gICAgY29sb3I6ICNGQ0QwMDA7XG4gICAgZm9udC1zaXplOiAyNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG5oMSB7XG4gICAgbWFyZ2luLXRvcDogMTAwcHg7XG4gICAgZm9udC1zaXplOiA1MHB4O1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICBjb2xvcjojRkNEMDAwO1xuICAgIG1hcmdpbi1ib3R0b206IDEwMHB4O1xufVxuXG4uYm90b24gaW9uLWJ1dHRvbiB7XG4gICAgaGVpZ2h0OiAzOXB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDUwcHg7XG4gICAgZm9udC1zaXplOiAxN3B4O1xuICAgIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4uc2VwIHtcbiAgICBtYXJnaW4tdG9wOiAxMHB4O1xufVxuXG4vLyA6aG9zdCB7XG4vLyAgICAgaW9uLWNvbnRlbnQge1xuLy8gICAgICAgICAtLWJhY2tncm91bmQ6IHVybCgnL2Fzc2V0cy9iYWNrZ3JvdW5kLnBuZycpIG5vLXJlcGVhdDtcbi8vICAgICB9XG4vLyB9XG4vLyBpb24tY29udGVudCA6Om5nLWRlZXAgaW9uLXNjcm9sbCB7XG4vLyAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKCcvYXNzZXRzL2JhY2tncm91bmQucG5nJykhaW1wb3J0YW50O1xuLy8gICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQhaW1wb3J0YW50O1xuLy8gICAgIGJhY2tncm91bmQtcG9zaXRpb246IGNlbnRlcjtcbi8vICAgICBiYWNrZ3JvdW5kLXNpemU6IGNvbnRhaW47XG4vLyB9XG5oMiB7XG4gICAgZm9udC1zaXplOiAxLjVyZW07XG4gICAgY29sb3I6ICMyMzJCMzg7XG59XG5cbmgzIHtcbiAgICBjb2xvcjogI0M1Q0NDRDtcbiAgICBmb250LXdlaWdodDogNTAwO1xufVxuXG4uaW5wdXQtY2FyZCB7XG4gICAgYm9yZGVyLXJhZGl1czogNXJlbTtcbiAgICBiYWNrZ3JvdW5kOiAjRjVGNkY3O1xuICAgIGJveC1zaGFkb3c6IDAgM3B4IDgwcHggcmdiYSgzOSwgNjgsIDc0LCAwLjIpO1xufVxuXG5mb3JtLmlucHV0LWJveCB7XG4gICAgYm9yZGVyOiAycHggc29saWQgI0M1Q0NDRDtcbiAgICBib3JkZXItcmFkaXVzOiAxcmVtO1xuICAgIGJhY2tncm91bmQ6ICNGRkZGRkY7XG4gICAgdHJhbnNpdGlvbjogLjJzIGFsbDtcbn1cblxuZm9ybS5pbnB1dC1ib3g6Zm9jdXMtd2l0aGluIHtcbiAgICBib3JkZXI6IDJweCBzb2xpZCAjMDJDNEQ5O1xufVxuXG5mb3JtLmlucHV0LWJveDpmb2N1cy13aXRoaW4uZXJyb3Ige1xuICAgIGJvcmRlcjogMnB4IHNvbGlkICNGNTREM0Q7XG59XG5cbmlucHV0IHtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgcGFkZGluZzogMS4xMjVyZW0gMXJlbTtcbiAgICB3aWR0aDogOTUlO1xuICAgIGZvbnQtZmFtaWx5OiBcIlBvcHBpbnNcIiwgc2Fucy1zZXJpZjtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGZvbnQtc2l6ZTogMS41cmVtO1xuICAgIHRyYW5zaXRpb246IC4ycyBhbGw7XG59XG5cbmlucHV0Om5vdCg6bGFzdC1jaGlsZCkge1xuICAgIGJvcmRlci1ib3R0b206IDJweCBzb2xpZCAjRUNFRUVFO1xufVxuXG5pbnB1dDo6cGxhY2Vob2xkZXIge1xuICAgIGNvbG9yOiAjOURBOEFCO1xufVxuXG5pbnB1dDpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBjb2xvcjogIzA4MjQyQTtcbiAgICBwYWRkaW5nOiAycmVtIDFyZW07XG59XG5cbmlucHV0OmZvY3VzOjpwbGFjZWhvbGRlciB7XG4gICAgY29sb3I6ICM3NTg1ODk7XG59XG5cbmlucHV0LmVycm9yIHtcbiAgICBjb2xvcjogI0Y1NEQzRDtcbn1cblxuaW5wdXQuc3VjY2VzcyB7XG4gICAgY29sb3I6ICMwMkM0RDk7XG59XG5cbi5idXR0b25lIHtcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIHBhZGRpbmc6IDFyZW0gM3JlbTtcbiAgICBtYXJnaW46IDFyZW07XG4gICAgYm9yZGVyLXJhZGl1czogOTk5OTlweDtcbiAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGZvbnQtZmFtaWx5OiBcIlBvcHBpbnNcIiwgc2Fucy1zZXJpZjtcbiAgICB0cmFuc2l0aW9uOiAuMnMgYWxsO1xuICAgIHRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlO1xufVxuXG4uYnV0dG9uZTpob3ZlciB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGV5KDNweCk7XG59XG5cbi5idXR0b25lOmZvY3VzIHtcbiAgICBvdXRsaW5lOiBub25lO1xufVxuXG4uYnV0dG9uZS50ZWFsIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDJDNEQ5O1xuICAgIGJveC1zaGFkb3c6IDAgN3B4IDUwcHggcmdiYSgyLCAxOTYsIDIxNywgMC41KTtcbiAgICBjb2xvcjogI0ZGRkZGRjtcbn1cblxuLmJ1dHRvbmUudGVhbDpob3ZlciB7XG4gICAgYm94LXNoYWRvdzogMCAycHggMTBweCByZ2JhKDIsIDE5NiwgMjE3LCAwLjUpO1xufVxuXG4uYnV0dG9uZS5nb29nbGUge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICNGRkZGRkY7XG4gICAgYm94LXNoYWRvdzogMCAzcHggMjBweCByZ2JhKDM5LCA2OCwgNzQsIDAuMik7XG4gICAgY29sb3I6ICM1MDY1Njk7XG4gICAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgICBmb250LXNpemU6IDIycHg7XG4gICAgbGluZS1oZWlnaHQ6IDFyZW07XG59XG5cbi5idXR0b25lLmdvb2dsZT5pbWcge1xuICAgIGhlaWdodDogMjBweDtcbiAgICB3aWR0aDogMjBweDtcbn1cblxuLmJ1dHRvbmUuZ29vZ2xlOmhvdmVyIHtcbiAgICBib3gtc2hhZG93OiAwIDFweCA1cHggcmdiYSgzOSwgNjgsIDc0LCAwLjIpO1xufSJdfQ== */"

/***/ }),

/***/ "./src/app/login/login.page.ts":
/*!*************************************!*\
  !*** ./src/app/login/login.page.ts ***!
  \*************************************/
/*! exports provided: LoginPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LoginPage", function() { return LoginPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_fire_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/fire/auth */ "./node_modules/@angular/fire/auth/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! firebase/app */ "./node_modules/firebase/app/dist/index.cjs.js");
/* harmony import */ var firebase_app__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(firebase_app__WEBPACK_IMPORTED_MODULE_4__);
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





var LoginPage = /** @class */ (function () {
    function LoginPage(afs, rout, alertController) {
        this.afs = afs;
        this.rout = rout;
        this.alertController = alertController;
        this.passwordType = 'password';
        this.passwordIcon = 'eye-off';
    }
    LoginPage.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, username, password, res, error_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this, username = _a.username, password = _a.password;
                        console.log(username, password);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.afs.auth.signInWithEmailAndPassword(username, password)];
                    case 2:
                        res = _b.sent();
                        console.log(res);
                        setTimeout(function () {
                            _this.rout.navigateByUrl('');
                        }, 1000);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        console.log(error_1);
                        if (error_1.code === 'auth/wrong-password') {
                            this.error('Incorrect Password');
                        }
                        if (error_1.code === 'auth/user-not-found') {
                            this.error('User dont found');
                        }
                        if (error_1.code === 'auth/email-already-in-use') {
                            this.error('User already use');
                        }
                        if (error_1.code === 'auth/argument-error') {
                            this.error('Argument error');
                        }
                        if (error_1.code === 'auth/invalid-email') {
                            this.error('Invalid email');
                        }
                        else {
                            this.error('Something went wrong try later');
                        }
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.loginGmail = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.afs.auth.signInWithPopup(new firebase_app__WEBPACK_IMPORTED_MODULE_4__["auth"].GoogleAuthProvider())];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        this.rout.navigateByUrl('main');
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        if (error_2.code === 'auth/wrong-password') {
                            this.error('Incorrect Password');
                        }
                        if (error_2.code === 'auth/user-not-found') {
                            this.error('User dont found');
                        }
                        if (error_2.code === 'auth/email-already-in-use') {
                            this.error('User already use');
                        }
                        if (error_2.code === 'auth/argument-error') {
                            this.error('Argument error');
                        }
                        if (error_2.code === 'auth/invalid-email') {
                            this.error('Invalid error');
                        }
                        console.log(error_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.goRegister = function () {
        this.rout.navigateByUrl('/register');
    };
    LoginPage.prototype.error = function (mensaje) {
        return __awaiter(this, void 0, void 0, function () {
            var alert;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.alertController.create({
                            message: mensaje,
                            buttons: ['OK']
                        })];
                    case 1:
                        alert = _a.sent();
                        return [4 /*yield*/, alert.present()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.hideShowPassword = function () {
        this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
        this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    };
    LoginPage.prototype.moveFocus = function (nextElement) {
        nextElement.setFocus();
    };
    LoginPage.prototype.gotoslides = function () {
        this.rout.navigateByUrl('/');
    };
    LoginPage = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-login',
            template: __webpack_require__(/*! ./login.page.html */ "./src/app/login/login.page.html"),
            styles: [__webpack_require__(/*! ./login.page.scss */ "./src/app/login/login.page.scss")]
        }),
        __metadata("design:paramtypes", [_angular_fire_auth__WEBPACK_IMPORTED_MODULE_1__["AngularFireAuth"], _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _ionic_angular__WEBPACK_IMPORTED_MODULE_3__["AlertController"]])
    ], LoginPage);
    return LoginPage;
}());



/***/ })

}]);
//# sourceMappingURL=login-login-module.js.map