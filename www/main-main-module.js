(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main-main-module"],{

/***/ "./src/app/main/main.module.ts":
/*!*************************************!*\
  !*** ./src/app/main/main.module.ts ***!
  \*************************************/
/*! exports provided: MainPageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainPageModule", function() { return MainPageModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "./node_modules/@ionic/angular/dist/fesm5.js");
/* harmony import */ var _main_page__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./main.page */ "./src/app/main/main.page.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var routes = [
    {
        path: '',
        component: _main_page__WEBPACK_IMPORTED_MODULE_5__["MainPage"]
    }
];
var MainPageModule = /** @class */ (function () {
    function MainPageModule() {
    }
    MainPageModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormsModule"],
                _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicModule"],
                _angular_router__WEBPACK_IMPORTED_MODULE_3__["RouterModule"].forChild(routes)
            ],
            declarations: [_main_page__WEBPACK_IMPORTED_MODULE_5__["MainPage"]]
        })
    ], MainPageModule);
    return MainPageModule;
}());



/***/ }),

/***/ "./src/app/main/main.page.html":
/*!*************************************!*\
  !*** ./src/app/main/main.page.html ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<ion-header no-border>\n  <ion-toolbar no-border>\n      <ion-title>\n          Ionic 4 Firestart\n      </ion-title>\n  <ion-buttons slot=\"start\" >\n      <ion-button [routerLink]=\"['/profile']\" >\n        <ion-icon color=\"primary\" slot=\"icon-only\" name=\"contact\"></ion-icon>\n      </ion-button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content padding>\n\n\n  <h1>Welcome! </h1>\n  <br>\n  <br>\n  <!-- Animation -->\n\n  <svg class=\"atom\"  viewBox=\"0 0 100 100\">\n    <defs>\n      <filter id=\"blur\" x=\"-10\" y=\"-10\" width=\"120\" height=\"120\">\n        <feGaussianBlur in=\"SourceGraphic\" stdDeviation=\".4\" />\n      </filter>\n      <filter id=\"blur2\" x=\"-10\" y=\"-10\" width=\"120\" height=\"120\">\n        <feGaussianBlur in=\"SourceGraphic\" stdDeviation=\"3\" />\n      </filter>\n    </defs>\n    <g filter=\"url(#blur2)\">\n    <circle class=\"kern\" cx=\"50\" cy=\"50\" r=\"2\" />\n    </g>\n    <circle class=\"kern\" cx=\"50\" cy=\"50\" r=\"2\" />\n    <g class=\"lines\">\n      <path class=\"\" d=\"M  57.5,50 57.39,55.21 57.05,60.26 56.5,65 55.75,69.28 54.82,72.98 53.75,75.98 52.57,78.19 51.3,79.54 50,80 48.7,79.54 47.43,78.19 46.25,75.98 45.18,72.98 44.25,69.28 43.5,65 42.95,60.26 42.61,55.21 42.5,50 42.61,44.79 42.95,39.74 43.5,35 44.25,30.72 45.18,27.02 46.25,24.02 47.43,21.81 48.7,20.46 50,20 51.3,20.46 52.57,21.81 53.75,24.02 54.82,27.02 55.75,30.72 56.5,35 57.05,39.74 57.39,44.79 57.5,50\"></path>\n      <path class=\"\" d=\"M  53.75,56.5 49.18,59 44.64,61.23 40.26,63.13 36.17,64.62 32.51,65.67 29.38,66.24 26.87,66.32 25.07,65.9 24.02,65 23.76,63.64 24.3,61.87 25.63,59.74 27.69,57.32 30.43,54.67 33.76,51.88 37.59,49.03 41.8,46.21 46.25,43.5 50.82,41 55.36,38.77 59.74,36.88 63.83,35.38 67.49,34.33 70.62,33.76 73.13,33.68 74.93,34.1 75.98,35 76.24,36.36 75.7,38.13 74.38,40.26 72.31,42.68 69.57,45.33 66.24,48.12 62.41,50.97 58.2,53.79 53.75,56.5\"></path>\n      <path class=\"\" d=\"M  53.75,43.5 58.2,46.21 62.41,49.03 66.24,51.88 69.57,54.67 72.31,57.32 74.38,59.74 75.7,61.87 76.24,63.64 75.98,65 74.93,65.9 73.13,66.32 70.63,66.24 67.49,65.67 63.83,64.62 59.74,63.13 55.36,61.23 50.82,59 46.25,56.5 41.8,53.79 37.59,50.97 33.76,48.13 30.43,45.33 27.69,42.68 25.63,40.26 24.3,38.13 23.76,36.36 24.02,35 25.07,34.1 26.87,33.68 29.37,33.76 32.51,34.33 36.17,35.38 40.26,36.87 44.64,38.77 49.18,41 53.75,43.5\"></path>\n      </g>\n    <g class=\"electronTails\"  filter=\"url(#blur)\" >\n      <path class=\"tail tail1\" d=\"M  57.5,50 57.39,55.21 57.05,60.26 56.5,65 55.75,69.28 54.82,72.98 53.75,75.98 52.57,78.19 51.3,79.54 50,80 48.7,79.54 47.43,78.19 46.25,75.98 45.18,72.98 44.25,69.28 43.5,65 42.95,60.26 42.61,55.21 42.5,50 42.61,44.79 42.95,39.74 43.5,35 44.25,30.72 45.18,27.02 46.25,24.02 47.43,21.81 48.7,20.46 50,20 51.3,20.46 52.57,21.81 53.75,24.02 54.82,27.02 55.75,30.72 56.5,35 57.05,39.74 57.39,44.79 57.5,50\"></path>\n      <path class=\"tail tail2\" d=\"M  53.75,56.5 49.18,59 44.64,61.23 40.26,63.13 36.17,64.62 32.51,65.67 29.38,66.24 26.87,66.32 25.07,65.9 24.02,65 23.76,63.64 24.3,61.87 25.63,59.74 27.69,57.32 30.43,54.67 33.76,51.88 37.59,49.03 41.8,46.21 46.25,43.5 50.82,41 55.36,38.77 59.74,36.88 63.83,35.38 67.49,34.33 70.62,33.76 73.13,33.68 74.93,34.1 75.98,35 76.24,36.36 75.7,38.13 74.38,40.26 72.31,42.68 69.57,45.33 66.24,48.12 62.41,50.97 58.2,53.79 53.75,56.5\"></path>\n      <path class=\"tail tail3\" d=\"M  53.75,43.5 58.2,46.21 62.41,49.03 66.24,51.88 69.57,54.67 72.31,57.32 74.38,59.74 75.7,61.87 76.24,63.64 75.98,65 74.93,65.9 73.13,66.32 70.63,66.24 67.49,65.67 63.83,64.62 59.74,63.13 55.36,61.23 50.82,59 46.25,56.5 41.8,53.79 37.59,50.97 33.76,48.13 30.43,45.33 27.69,42.68 25.63,40.26 24.3,38.13 23.76,36.36 24.02,35 25.07,34.1 26.87,33.68 29.37,33.76 32.51,34.33 36.17,35.38 40.26,36.87 44.64,38.77 49.18,41 53.75,43.5\"></path>\n    </g>\n    <g class=\"electrons\">\n      <path class=\"electron electron1\" d=\"M  57.5,50 57.39,55.21 57.05,60.26 56.5,65 55.75,69.28 54.82,72.98 53.75,75.98 52.57,78.19 51.3,79.54 50,80 48.7,79.54 47.43,78.19 46.25,75.98 45.18,72.98 44.25,69.28 43.5,65 42.95,60.26 42.61,55.21 42.5,50 42.61,44.79 42.95,39.74 43.5,35 44.25,30.72 45.18,27.02 46.25,24.02 47.43,21.81 48.7,20.46 50,20 51.3,20.46 52.57,21.81 53.75,24.02 54.82,27.02 55.75,30.72 56.5,35 57.05,39.74 57.39,44.79 57.5,50\"></path>\n      <path class=\"electron electron2\" d=\"M  53.75,56.5 49.18,59 44.64,61.23 40.26,63.13 36.17,64.62 32.51,65.67 29.38,66.24 26.87,66.32 25.07,65.9 24.02,65 23.76,63.64 24.3,61.87 25.63,59.74 27.69,57.32 30.43,54.67 33.76,51.88 37.59,49.03 41.8,46.21 46.25,43.5 50.82,41 55.36,38.77 59.74,36.88 63.83,35.38 67.49,34.33 70.62,33.76 73.13,33.68 74.93,34.1 75.98,35 76.24,36.36 75.7,38.13 74.38,40.26 72.31,42.68 69.57,45.33 66.24,48.12 62.41,50.97 58.2,53.79 53.75,56.5\">\n      </path>\n      <path class=\"electron electron3\" d=\"M  53.75,43.5 58.2,46.21 62.41,49.03 66.24,51.88 69.57,54.67 72.31,57.32 74.38,59.74 75.7,61.87 76.24,63.64 75.98,65 74.93,65.9 73.13,66.32 70.63,66.24 67.49,65.67 63.83,64.62 59.74,63.13 55.36,61.23 50.82,59 46.25,56.5 41.8,53.79 37.59,50.97 33.76,48.13 30.43,45.33 27.69,42.68 25.63,40.26 24.3,38.13 23.76,36.36 24.02,35 25.07,34.1 26.87,33.68 29.37,33.76 32.51,34.33 36.17,35.38 40.26,36.87 44.64,38.77 49.18,41 53.75,43.5\"></path></g>\n  </svg>\n  \n  \n  \n\n</ion-content>"

/***/ }),

/***/ "./src/app/main/main.page.scss":
/*!*************************************!*\
  !*** ./src/app/main/main.page.scss ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "@import url(\"https://fonts.googleapis.com/css?family=Roboto:400,400i,700\");\nsvg.atom {\n  max-height: 100vh;\n  max-width: 100vw;\n  overflow: visible; }\nsvg circle.kern {\n  fill: #FFEA00;\n  stroke: none;\n  -webkit-filter: drop-shadow(0px 0px 4px #AEEA00);\n          filter: drop-shadow(0px 0px 4px #AEEA00); }\n.atom path {\n  fill: none;\n  stroke: #EEFF41;\n  stroke-width: .06; }\n/* 129 = ellipse.getTotalLength() */\npath.tail {\n  stroke: #bda800;\n  fill: none;\n  -webkit-animation: atom 1.5s infinite linear;\n          animation: atom 1.5s infinite linear;\n  stroke-dashoffset: 0;\n  stroke-dasharray: 20,44.5;\n  stroke-width: .6; }\npath.electron {\n  stroke: #FFEA00;\n  fill: none;\n  -webkit-animation: atom 1.5s infinite linear;\n          animation: atom 1.5s infinite linear;\n  stroke-dashoffset: 0;\n  stroke-dasharray: .1,64.4;\n  stroke-width: 2;\n  stroke-linecap: round; }\npath.tail1, path.electron1 {\n  -webkit-animation-delay: -1.0s;\n          animation-delay: -1.0s; }\npath.tail2, path.electron2 {\n  -webkit-animation-delay: -1.4s;\n          animation-delay: -1.4s; }\n/* 129 = ellipse.getTotalLength() */\n@-webkit-keyframes atom {\n  to {\n    stroke-dashoffset: 129; } }\n@keyframes atom {\n  to {\n    stroke-dashoffset: 129; } }\n/* \n  \n  Template boilerplate CSS\n  \n  */\nhtml {\n  height: 100%;\n  background: #1A2A3A;\n  color: #FFF; }\nbody {\n  font-family: Roboto, sans-serif;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  height: 100%; }\n*,\n*:before,\n*:after {\n  position: relative;\n  box-sizing: border-box; }\n.dwf, .share {\n  position: fixed;\n  bottom: 4px;\n  right: 10px;\n  background-color: #0003;\n  padding: 3px;\n  border-radius: 3px; }\n.dwf .btn, .share .btn {\n    color: #fff;\n    text-decoration: none; }\n.share {\n  right: auto;\n  left: 10px;\n  border-radius: 50%;\n  padding: 5px; }\n.share .twitter {\n    width: 20px;\n    fill: #fff;\n    stroke: none;\n    overflow: visible; }\n.share .ani {\n    -webkit-animation: share 7s ease-in infinite;\n            animation: share 7s ease-in infinite;\n    -webkit-transform-origin: 0% 100%;\n            transform-origin: 0% 100%; }\n@-webkit-keyframes share {\n  85% {\n    -webkit-transform: scale(1);\n            transform: scale(1);\n    opacity: .8; }\n  100% {\n    -webkit-transform: scale(5);\n            transform: scale(5);\n    opacity: 0; } }\n@keyframes share {\n  85% {\n    -webkit-transform: scale(1);\n            transform: scale(1);\n    opacity: .8; }\n  100% {\n    -webkit-transform: scale(5);\n            transform: scale(5);\n    opacity: 0; } }\n\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9kYXZpZGJhcnJlcm8vRGVza3RvcC8xMDAvNDcgSW9uaWMgNCBGaXJlYmFzZSAvSW9uaWMtNC1maXJlYmFzZS9Jb25pYy00LWZpcmViYXNlL3NyYy9hcHAvbWFpbi9tYWluLnBhZ2Uuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUF3REUsMkVBQVk7QUF4RGQ7RUFFSSxrQkFBZ0I7RUFDaEIsaUJBQWU7RUFDZixrQkFBZ0IsRUFDakI7QUFFRDtFQUNFLGNBQWE7RUFDYixhQUFXO0VBQ1gsaURBQXdDO1VBQXhDLHlDQUF3QyxFQUN6QztBQUNEO0VBQ0UsV0FBUztFQUNULGdCQUFjO0VBRWQsa0JBQWdCLEVBQ2pCO0FBQ0Qsb0NBQW9DO0FBQ3BDO0VBQ0UsZ0JBQWU7RUFFZixXQUFTO0VBQ1QsNkNBQW9DO1VBQXBDLHFDQUFvQztFQUNwQyxxQkFBb0I7RUFDcEIsMEJBQXlCO0VBQ3pCLGlCQUFnQixFQUNqQjtBQUNEO0VBQ0UsZ0JBQWU7RUFFZixXQUFTO0VBQ1QsNkNBQW9DO1VBQXBDLHFDQUFvQztFQUNwQyxxQkFBb0I7RUFDcEIsMEJBQXlCO0VBQ3pCLGdCQUFlO0VBQ2Ysc0JBQW9CLEVBQ3JCO0FBQ0Q7RUFDRSwrQkFBcUI7VUFBckIsdUJBQXFCLEVBQ3RCO0FBQ0Q7RUFDRSwrQkFBcUI7VUFBckIsdUJBQXFCLEVBQ3RCO0FBQ0Qsb0NBQW9DO0FBQ3BDO0VBQ0U7SUFBSyx1QkFBcUIsRUFBQSxFQUFBO0FBRDVCO0VBQ0U7SUFBSyx1QkFBcUIsRUFBQSxFQUFBO0FBSzVCOzs7O0lBSUU7QUFFRjtFQUNFLGFBQVk7RUFDWixvQkFBbUI7RUFDbkIsWUFBVyxFQUNaO0FBQ0Q7RUFDRSxnQ0FBK0I7RUFDL0IscUJBQWE7RUFBYixjQUFhO0VBQ2IseUJBQXVCO1VBQXZCLHdCQUF1QjtFQUN2QiwwQkFBbUI7VUFBbkIsb0JBQW1CO0VBQ25CLDZCQUFzQjtFQUF0Qiw4QkFBc0I7VUFBdEIsdUJBQXNCO0VBQ3RCLGFBQVcsRUFDWjtBQUVEOzs7RUFHRSxtQkFBa0I7RUFDbEIsdUJBQXNCLEVBQ3ZCO0FBRUQ7RUFDRSxnQkFBYztFQUNkLFlBQVU7RUFDVixZQUFVO0VBQ1Ysd0JBQXNCO0VBQ3RCLGFBQVc7RUFDWCxtQkFBaUIsRUFLbEI7QUFYRDtJQVFJLFlBQVU7SUFDVixzQkFDRixFQUFDO0FBRUg7RUFDRSxZQUFVO0VBQ1YsV0FBUztFQUNULG1CQUFpQjtFQUNqQixhQUFXLEVBcUJaO0FBekJEO0lBTUksWUFBVztJQUNYLFdBQVM7SUFDVCxhQUFXO0lBQ1gsa0JBQWdCLEVBQ2pCO0FBVkg7SUFZSSw2Q0FBbUM7WUFBbkMscUNBQW1DO0lBQ25DLGtDQUF3QjtZQUF4QiwwQkFBd0IsRUFDekI7QUFDRDtFQUNFO0lBQ0UsNEJBQW1CO1lBQW5CLG9CQUFtQjtJQUNuQixZQUFVLEVBQUE7RUFFWjtJQUNFLDRCQUFtQjtZQUFuQixvQkFBbUI7SUFDbkIsV0FBUyxFQUFBLEVBQUE7QUFQYjtFQUNFO0lBQ0UsNEJBQW1CO1lBQW5CLG9CQUFtQjtJQUNuQixZQUFVLEVBQUE7RUFFWjtJQUNFLDRCQUFtQjtZQUFuQixvQkFBbUI7SUFDbkIsV0FBUyxFQUFBLEVBQUEiLCJmaWxlIjoic3JjL2FwcC9tYWluL21haW4ucGFnZS5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsic3ZnLmF0b20ge1xuICAgIC8vb3V0bGluZTogMXB4IHNvbGlkIGJsYWNrO1xuICAgIG1heC1oZWlnaHQ6MTAwdmg7XG4gICAgbWF4LXdpZHRoOjEwMHZ3O1xuICAgIG92ZXJmbG93OnZpc2libGU7XG4gIH1cbiAgXG4gIHN2ZyBjaXJjbGUua2VybiB7XG4gICAgZmlsbDogI0ZGRUEwMDtcbiAgICBzdHJva2U6bm9uZTtcbiAgICBmaWx0ZXI6IGRyb3Atc2hhZG93KDBweCAwcHggNHB4ICNBRUVBMDApO1xuICB9XG4gIC5hdG9tIHBhdGgge1xuICAgIGZpbGw6bm9uZTtcbiAgICBzdHJva2U6I0VFRkY0MTtcbiAgICAvL3N0cm9rZTojRUVGRjQxO1xuICAgIHN0cm9rZS13aWR0aDouMDY7XG4gIH1cbiAgLyogMTI5ID0gZWxsaXBzZS5nZXRUb3RhbExlbmd0aCgpICovXG4gIHBhdGgudGFpbCB7XG4gICAgc3Ryb2tlOiAjYmRhODAwO1xuICAgIC8vc3Ryb2tlOiAjMUI1RTIwO1xuICAgIGZpbGw6bm9uZTtcbiAgICBhbmltYXRpb246IGF0b20gMS41cyBpbmZpbml0ZSBsaW5lYXI7XG4gICAgc3Ryb2tlLWRhc2hvZmZzZXQ6IDA7XG4gICAgc3Ryb2tlLWRhc2hhcnJheTogMjAsNDQuNTtcbiAgICBzdHJva2Utd2lkdGg6IC42O1xuICB9XG4gIHBhdGguZWxlY3Ryb24ge1xuICAgIHN0cm9rZTogI0ZGRUEwMDtcbiAgICAvL3N0cm9rZTogICMxQjVFMjA7XG4gICAgZmlsbDpub25lO1xuICAgIGFuaW1hdGlvbjogYXRvbSAxLjVzIGluZmluaXRlIGxpbmVhcjtcbiAgICBzdHJva2UtZGFzaG9mZnNldDogMDtcbiAgICBzdHJva2UtZGFzaGFycmF5OiAuMSw2NC40O1xuICAgIHN0cm9rZS13aWR0aDogMjtcbiAgICBzdHJva2UtbGluZWNhcDpyb3VuZDtcbiAgfVxuICBwYXRoLnRhaWwxLCBwYXRoLmVsZWN0cm9uMSB7XG4gICAgYW5pbWF0aW9uLWRlbGF5Oi0xLjBzO1xuICB9XG4gIHBhdGgudGFpbDIsIHBhdGguZWxlY3Ryb24yIHtcbiAgICBhbmltYXRpb24tZGVsYXk6LTEuNHM7XG4gIH1cbiAgLyogMTI5ID0gZWxsaXBzZS5nZXRUb3RhbExlbmd0aCgpICovXG4gIEBrZXlmcmFtZXMgYXRvbSB7XG4gICAgdG8geyBzdHJva2UtZGFzaG9mZnNldDoxMjk7IH1cbiAgfVxuICBcbiAgXG4gIFxuICAvKiBcbiAgXG4gIFRlbXBsYXRlIGJvaWxlcnBsYXRlIENTU1xuICBcbiAgKi9cbiAgQGltcG9ydCB1cmwoXCJodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2Nzcz9mYW1pbHk9Um9ib3RvOjQwMCw0MDBpLDcwMFwiKTtcbiAgaHRtbCB7IFxuICAgIGhlaWdodDogMTAwJTsgXG4gICAgYmFja2dyb3VuZDogIzFBMkEzQTsgIFxuICAgIGNvbG9yOiAjRkZGOyBcbiAgfVxuICBib2R5IHtcbiAgICBmb250LWZhbWlseTogUm9ib3RvLCBzYW5zLXNlcmlmO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGhlaWdodDoxMDAlO1xuICB9XG4gIFxuICAqLFxuICAqOmJlZm9yZSxcbiAgKjphZnRlciB7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIH1cbiAgXG4gIC5kd2YsIC5zaGFyZSB7XG4gICAgcG9zaXRpb246Zml4ZWQ7XG4gICAgYm90dG9tOjRweDtcbiAgICByaWdodDoxMHB4O1xuICAgIGJhY2tncm91bmQtY29sb3I6IzAwMDM7XG4gICAgcGFkZGluZzozcHg7XG4gICAgYm9yZGVyLXJhZGl1czozcHg7XG4gICAgLmJ0biB7XG4gICAgICBjb2xvcjojZmZmO1xuICAgICAgdGV4dC1kZWNvcmF0aW9uOm5vbmVcbiAgICB9XG4gIH1cbiAgLnNoYXJlIHtcbiAgICByaWdodDphdXRvO1xuICAgIGxlZnQ6MTBweDtcbiAgICBib3JkZXItcmFkaXVzOjUwJTtcbiAgICBwYWRkaW5nOjVweDtcbiAgICAudHdpdHRlciB7XG4gICAgICB3aWR0aDogMjBweDtcbiAgICAgIGZpbGw6I2ZmZjtcbiAgICAgIHN0cm9rZTpub25lO1xuICAgICAgb3ZlcmZsb3c6dmlzaWJsZTtcbiAgICB9XG4gICAgLmFuaSB7XG4gICAgICBhbmltYXRpb246c2hhcmUgN3MgZWFzZS1pbiBpbmZpbml0ZTtcbiAgICAgIHRyYW5zZm9ybS1vcmlnaW46MCUgMTAwJTtcbiAgICB9XG4gICAgQGtleWZyYW1lcyBzaGFyZSB7XG4gICAgICA4NSUge1xuICAgICAgICB0cmFuc2Zvcm06IHNjYWxlKDEpO1xuICAgICAgICBvcGFjaXR5Oi44O1xuICAgICAgfVxuICAgICAgMTAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogc2NhbGUoNSk7XG4gICAgICAgIG9wYWNpdHk6MDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgXG4gICJdfQ== */"

/***/ }),

/***/ "./src/app/main/main.page.ts":
/*!***********************************!*\
  !*** ./src/app/main/main.page.ts ***!
  \***********************************/
/*! exports provided: MainPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MainPage", function() { return MainPage; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_fire_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/fire/auth */ "./node_modules/@angular/fire/auth/index.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_services_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/services.service */ "./src/app/services/services.service.ts");
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




var MainPage = /** @class */ (function () {
    function MainPage(aut, router, services) {
        this.aut = aut;
        this.router = router;
        this.services = services;
    }
    MainPage.prototype.ngOnInit = function () {
        this.logued();
    };
    MainPage.prototype.logued = function () {
        var _this = this;
        this.aut.authState
            .subscribe(function (user) {
            if (user) {
                console.log('loged');
                _this.id = user.uid;
                console.log(_this.id);
                _this.getProfile(_this.id);
            }
            else {
                _this.router.navigateByUrl('/login');
            }
        }, function () {
            _this.router.navigateByUrl('/login');
        });
    };
    MainPage.prototype.signOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.aut.auth.signOut()];
                    case 1:
                        res = _a.sent();
                        console.log(res);
                        this.router.navigateByUrl('/login');
                        return [2 /*return*/];
                }
            });
        });
    };
    MainPage.prototype.getProfile = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.services.getProfile(id).subscribe(function (data) {
                            if (data.length === 0) {
                                console.log('profile empty');
                                _this.router.navigateByUrl("edit-profile");
                            }
                            else {
                                console.log('Profile not empty');
                                console.log(data);
                                _this.item = data;
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    MainPage.prototype.profile = function () {
        this.router.navigateByUrl("profile");
    };
    MainPage = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-main',
            template: __webpack_require__(/*! ./main.page.html */ "./src/app/main/main.page.html"),
            styles: [__webpack_require__(/*! ./main.page.scss */ "./src/app/main/main.page.scss")]
        }),
        __metadata("design:paramtypes", [_angular_fire_auth__WEBPACK_IMPORTED_MODULE_1__["AngularFireAuth"],
            _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"], _services_services_service__WEBPACK_IMPORTED_MODULE_3__["ServicesService"]])
    ], MainPage);
    return MainPage;
}());



/***/ })

}]);
//# sourceMappingURL=main-main-module.js.map