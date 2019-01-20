webpackJsonp([1],{

/***/ 122:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home_page__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_auth_service__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__signup_signup__ = __webpack_require__(207);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var LoginPage = (function () {
    function LoginPage(navCtrl, auth, fb) {
        this.navCtrl = navCtrl;
        this.auth = auth;
        this.loginForm = fb.group({
            email: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].email])],
            password: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].minLength(6)])]
        });
    }
    LoginPage.prototype.login = function () {
        var _this = this;
        var data = this.loginForm.value;
        if (!data.email) {
            return;
        }
        var credentials = {
            email: data.email,
            password: data.password
        };
        this.auth.signInWithEmail(credentials)
            .then(function () { return _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home_page__["a" /* HomePage */]); }, function (error) { return _this.loginError = error.message; });
    };
    LoginPage.prototype.signup = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__signup_signup__["a" /* SignupPage */]);
    };
    LoginPage.prototype.loginWithGoogle = function () {
        var _this = this;
        this.auth.signInWithGoogle()
            .then(function () { return _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home_page__["a" /* HomePage */]); }, function (error) { return console.log(error.message); });
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/login/login.html"*/'<ion-header>\n	<ion-navbar>\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Log in</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n	<form (ngSubmit)="login()" [formGroup]="loginForm">\n		<ion-list inset>\n\n			<ion-item [ngClass]="{ invalid: emailErrors.hasError(\'*\', [\'touched\', \'dirty\']) }">\n				<ion-input type="text" placeholder="Email" formControlName="email"></ion-input>\n			</ion-item>\n\n			<div ngxErrors="email" #emailErrors="ngxErrors">\n				<div [ngxError]="[\'email\', \'required\']" [when]="[\'touched\', \'dirty\']">It should be a valid email</div>\n			</div>\n\n			<ion-item [ngClass]="{ invalid: passwordErrors.hasError(\'*\', [\'touched\']) }">\n				<ion-input type="password" placeholder="Password" formControlName="password"></ion-input>\n			</ion-item>\n\n			<div ngxErrors="password" #passwordErrors="ngxErrors">\n				<div [ngxError]="[\'minlength\', \'required\']" [when]="[\'touched\']">It should be at least 5 characters</div>\n			</div>\n		</ion-list>\n\n		<div padding-horizontal>\n			<div class="form-error">{{loginError}}</div>\n\n			<button ion-button full type="submit" [disabled]="!loginForm.valid">Log in</button>\n			<div class="login-footer">\n				<p>\n					<a href="#">Forgot password?</a>\n					If you\'re a new user, please sign up.\n				</p>\n			</div>\n\n			<ion-list>\n\n				<button ion-button icon-left block clear (click)="loginWithGoogle()">\n					<ion-icon name="logo-google"></ion-icon>\n					Log in with Google\n				</button>\n\n				<button ion-button icon-left block clear (click)="signup()">\n					<ion-icon name="person-add"></ion-icon>\n					Sign up\n				</button>\n			</ion-list>\n		</div>\n	</form>\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/login/login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_4__services_auth_service__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 130:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 130;

/***/ }),

/***/ 188:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/login/login.module": [
		406,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 188;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 189:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WordpressListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__wordpress_service__ = __webpack_require__(335);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__item_wordpress_item_page__ = __webpack_require__(190);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var WordpressListPage = (function () {
    function WordpressListPage(wordpressService, nav) {
        this.wordpressService = wordpressService;
        this.nav = nav;
    }
    WordpressListPage.prototype.ngOnInit = function () {
        var _this = this;
        this.wordpressService.getPosts()
            .subscribe(function (posts) {
            _this.posts = posts;
        });
    };
    WordpressListPage.prototype.itemTapped = function (item) {
        this.nav.push(__WEBPACK_IMPORTED_MODULE_3__item_wordpress_item_page__["a" /* WordpressItemPage */], {
            item: item
        });
    };
    WordpressListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/wordpress/list/wordpress.list.html"*/'<ion-header>\n	<ion-navbar>\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>WP posts</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n	<ion-card *ngFor="let post of posts" (click)="itemTapped(post)">\n		<img *ngIf="!!post.image" src="{{post.image}}"/>\n		<ion-card-content>\n			<h2 class="card-title">{{post.title}}</h2>\n			<p>{{post.brief | trimHtml | truncate : 140}}</p>\n		</ion-card-content>\n	</ion-card>\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/wordpress/list/wordpress.list.html"*/,
            providers: [__WEBPACK_IMPORTED_MODULE_2__wordpress_service__["a" /* WordpressService */]]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__wordpress_service__["a" /* WordpressService */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */]])
    ], WordpressListPage);
    return WordpressListPage;
}());

//# sourceMappingURL=wordpress.list.page.js.map

/***/ }),

/***/ 190:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WordpressItemPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var WordpressItemPage = (function () {
    function WordpressItemPage(navParams) {
        this.post = navParams.get('item');
    }
    WordpressItemPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/wordpress/item/wordpress.item.html"*/'<ion-header>\n	<ion-navbar>\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>WP post</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n	<ion-card>\n		<img *ngIf="!!post.image" src="{{post.image}}"/>\n		<ion-card-content>\n			<h2 class="card-title">{{post.title}}</h2>\n			<div [innerHTML]="post.content"></div>\n			<p><strong>{{post.author}}</strong> - {{post.date}}</p>\n			<p><i>[{{post.tags.join(\', \')}}]</i></p>\n		</ion-card-content>\n	</ion-card>\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/wordpress/item/wordpress.item.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
    ], WordpressItemPage);
    return WordpressItemPage;
}());

//# sourceMappingURL=wordpress.item.page.js.map

/***/ }),

/***/ 191:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SlideBoxPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SlideBoxPage = (function () {
    function SlideBoxPage() {
        this.items = this.generateItems(7);
    }
    SlideBoxPage.prototype.generateItems = function (n) {
        var items = [];
        for (var i = 0; i < n; i++) {
            items.push({
                image: 'http://lorempixel.com/g/786/1024/city/' + i + '/'
            });
        }
        return items;
    };
    SlideBoxPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/slide-box/slide-box.html"*/'<ion-header>\n	<ion-navbar>\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Slides</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n	<ion-slides pager loop="true">\n		<ion-slide *ngFor="let item of items">\n			<img src="{{item.image}}" />\n		</ion-slide>\n	</ion-slides>\n</ion-content>'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/slide-box/slide-box.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], SlideBoxPage);
    return SlideBoxPage;
}());

//# sourceMappingURL=slide-box.page.js.map

/***/ }),

/***/ 192:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GoogleMapsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var GoogleMapsPage = (function () {
    function GoogleMapsPage() {
        this.initMarkers();
        this.origin = {
            lat: 51.673858,
            lng: 7.815982
        };
        this.zoom = 8;
    }
    GoogleMapsPage.prototype.clickedMarker = function (label) {
        window.alert("clicked the marker: " + (label || ''));
    };
    GoogleMapsPage.prototype.initMarkers = function () {
        this.markers = [{
                lat: 51.673858,
                lng: 7.815982,
                label: 'A'
            }, {
                lat: 51.373858,
                lng: 7.215982,
                label: 'B'
            }, {
                lat: 51.723858,
                lng: 7.895982,
                label: 'C'
            }];
    };
    GoogleMapsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/google-maps/google-maps.html"*/'<ion-header>\n	<ion-navbar>\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Google maps</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n	<agm-map style="width: 100%; height: 100%;"\n			[latitude]="origin.lat"\n			[longitude]="origin.lng"\n			[zoom]="zoom">\n		<agm-marker\n				*ngFor="let m of markers"\n				(markerClick)="clickedMarker(m.label)"\n				[latitude]="m.lat"\n				[longitude]="m.lng"\n				[label]="m.label">\n		</agm-marker>\n	</agm-map>\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/google-maps/google-maps.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], GoogleMapsPage);
    return GoogleMapsPage;
}());

//# sourceMappingURL=google-maps.page.js.map

/***/ }),

/***/ 193:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Email */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EmailService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var Email = (function () {
    function Email() {
    }
    return Email;
}());

var EmailService = (function () {
    function EmailService() {
    }
    EmailService.prototype.sendEmail = function (email) {
        var plugins = window.cordova.plugins;
        plugins.email.isAvailable(function () {
            plugins.email.open(email);
        });
    };
    EmailService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])()
    ], EmailService);
    return EmailService;
}());

//# sourceMappingURL=email.service.js.map

/***/ }),

/***/ 194:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CallService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var CallService = (function () {
    function CallService() {
    }
    CallService.prototype.call = function (phoneNumber) {
        window.location.href = 'tel:' + phoneNumber;
    };
    CallService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])()
    ], CallService);
    return CallService;
}());

//# sourceMappingURL=call.service.js.map

/***/ }),

/***/ 195:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapsService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MapsService = (function () {
    function MapsService(platform) {
        this.platform = platform;
    }
    MapsService.prototype.openMapsApp = function (location) {
        var q;
        if (this.platform.is('android')) {
            q = 'geo:' + location;
        }
        else {
            q = 'maps://maps.apple.com/?q=' + location;
        }
        window.location.href = q;
    };
    MapsService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */]])
    ], MapsService);
    return MapsService;
}());

//# sourceMappingURL=maps.service.js.map

/***/ }),

/***/ 196:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InAppBrowserService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var InAppBrowserService = (function () {
    function InAppBrowserService() {
    }
    InAppBrowserService.prototype.open = function (url) {
        window.open(url, '_system', 'location=yes');
        return false;
    };
    InAppBrowserService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])()
    ], InAppBrowserService);
    return InAppBrowserService;
}());

//# sourceMappingURL=in-app-browser.service.js.map

/***/ }),

/***/ 207:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignupPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home_page__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_auth_service__ = __webpack_require__(56);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var SignupPage = (function () {
    function SignupPage(fb, navCtrl, auth) {
        this.navCtrl = navCtrl;
        this.auth = auth;
        this.form = fb.group({
            email: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].email])],
            password: ['', __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].compose([__WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].required, __WEBPACK_IMPORTED_MODULE_1__angular_forms__["g" /* Validators */].minLength(6)])]
        });
    }
    SignupPage.prototype.signup = function () {
        var _this = this;
        var data = this.form.value;
        var credentials = {
            email: data.email,
            password: data.password
        };
        this.auth.signUp(credentials).then(function () { return _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_3__home_home_page__["a" /* HomePage */]); }, function (error) { return _this.signupError = error.message; });
    };
    SignupPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'as-page-signup',template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/signup/signup.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Sign up</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n\n	<form (ngSubmit)="signup()" [formGroup]="form">\n		<ion-list inset>\n\n			<ion-item [ngClass]="{ invalid: emailErrors.hasError(\'*\', [\'touched\']) }">\n				<ion-input type="text" placeholder="Email" formControlName="email"></ion-input>\n			</ion-item>\n\n			<div ngxErrors="email" #emailErrors="ngxErrors">\n				<div [ngxError]="[\'email\', \'required\']" [when]="[\'touched\']">It should be a valid email</div>\n			</div>\n\n			<ion-item [ngClass]="{ invalid: passwordErrors.hasError(\'*\', [\'touched\']) }">\n				<ion-input type="password" placeholder="Password" formControlName="password"></ion-input>\n			</ion-item>\n\n			<div ngxErrors="password" #passwordErrors="ngxErrors">\n				<div [ngxError]="[\'minlength\', \'required\']" [when]="[\'touched\']">It should be at least 6 characters</div>\n			</div>\n		</ion-list>\n\n		<div padding-horizontal>\n			<div class="form-error">{{signupError}}</div>\n\n			<button ion-button full type="submit" [disabled]="!form.valid">Sign up</button>\n		</div>\n	</form>\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/signup/signup.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_4__services_auth_service__["a" /* AuthService */]])
    ], SignupPage);
    return SignupPage;
}());

//# sourceMappingURL=signup.js.map

/***/ }),

/***/ 247:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsInputsStackedLabelsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsInputsStackedLabelsPage = (function () {
    function ComponentsInputsStackedLabelsPage() {
    }
    ComponentsInputsStackedLabelsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/inputs/stacked-labels/components.inputs.stacked-labels.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Stacked Labels</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n	<ion-list>\n\n		<ion-item>\n			<ion-label stacked>Username</ion-label>\n			<ion-input type="text"></ion-input>\n		</ion-item>\n\n		<ion-item>\n			<ion-label stacked>Password</ion-label>\n			<ion-input type="password"></ion-input>\n		</ion-item>\n\n	</ion-list>\n\n	<div padding>\n		<button ion-button color="primary" block>Sign In</button>\n	</div>\n\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/inputs/stacked-labels/components.inputs.stacked-labels.html"*/
        })
    ], ComponentsInputsStackedLabelsPage);
    return ComponentsInputsStackedLabelsPage;
}());

//# sourceMappingURL=components.inputs.stacked-labels.page.js.map

/***/ }),

/***/ 248:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsInputsPlaceholderLabelsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsInputsPlaceholderLabelsPage = (function () {
    function ComponentsInputsPlaceholderLabelsPage() {
    }
    ComponentsInputsPlaceholderLabelsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/inputs/placeholder-labels/components.inputs.placeholder-labels.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Placeholder Labels</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n\n	<ion-list>\n\n		<ion-item>\n			<ion-input type="text" placeholder="Username"></ion-input>\n		</ion-item>\n\n		<ion-item>\n			<ion-input type="password" placeholder="Password"></ion-input>\n		</ion-item>\n\n	</ion-list>\n\n	<div padding>\n		<button ion-button color="primary" block>Sign In</button>\n	</div>\n\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/inputs/placeholder-labels/components.inputs.placeholder-labels.html"*/
        })
    ], ComponentsInputsPlaceholderLabelsPage);
    return ComponentsInputsPlaceholderLabelsPage;
}());

//# sourceMappingURL=components.inputs.placeholder-labels.page.js.map

/***/ }),

/***/ 249:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsInputsInsetLabelsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsInputsInsetLabelsPage = (function () {
    function ComponentsInputsInsetLabelsPage() {
    }
    ComponentsInputsInsetLabelsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/inputs/inset-labels/components.inputs.inset-labels.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Inset Labels</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n	<ion-list inset>\n\n		<ion-item>\n			<ion-label>Username</ion-label>\n			<ion-input type="text" value=""></ion-input>\n		</ion-item>\n\n		<ion-item>\n			<ion-label>Password</ion-label>\n			<ion-input type="password" value=""></ion-input>\n		</ion-item>\n\n	</ion-list>\n\n	<div padding>\n		<button ion-button color="primary" block>Sign In</button>\n	</div>\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/inputs/inset-labels/components.inputs.inset-labels.html"*/
        })
    ], ComponentsInputsInsetLabelsPage);
    return ComponentsInputsInsetLabelsPage;
}());

//# sourceMappingURL=components.inputs.inset-labels.page.js.map

/***/ }),

/***/ 250:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsInputsInlineLabelsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsInputsInlineLabelsPage = (function () {
    function ComponentsInputsInlineLabelsPage() {
    }
    ComponentsInputsInlineLabelsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/inputs/inline-labels/components.inputs.inline-labels.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Inline Labels</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n\n	<ion-list>\n\n		<ion-item>\n			<ion-label>Username</ion-label>\n			<ion-input type="text" value=""></ion-input>\n		</ion-item>\n\n		<ion-item>\n			<ion-label>Password</ion-label>\n			<ion-input type="password" value=""></ion-input>\n		</ion-item>\n\n	</ion-list>\n\n	<div padding>\n		<button ion-button color="primary" block>Sign In</button>\n	</div>\n\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/inputs/inline-labels/components.inputs.inline-labels.html"*/
        })
    ], ComponentsInputsInlineLabelsPage);
    return ComponentsInputsInlineLabelsPage;
}());

//# sourceMappingURL=components.inputs.inline-labels.page.js.map

/***/ }),

/***/ 251:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsInputsFloatingLabelsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsInputsFloatingLabelsPage = (function () {
    function ComponentsInputsFloatingLabelsPage() {
    }
    ComponentsInputsFloatingLabelsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/inputs/floating-labels/components.inputs.floating-labels.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Floating Labels</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n\n	<ion-list>\n\n		<ion-item>\n			<ion-label floating>Username</ion-label>\n			<ion-input type="text" value=""></ion-input>\n		</ion-item>\n\n		<ion-item>\n			<ion-label floating>Password</ion-label>\n			<ion-input type="password" value=""></ion-input>\n		</ion-item>\n\n	</ion-list>\n\n	<div padding>\n		<button ion-button color="primary" block>Sign In</button>\n	</div>\n\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/inputs/floating-labels/components.inputs.floating-labels.html"*/
        })
    ], ComponentsInputsFloatingLabelsPage);
    return ComponentsInputsFloatingLabelsPage;
}());

//# sourceMappingURL=components.inputs.floating-labels.page.js.map

/***/ }),

/***/ 252:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsInputsFixedLabelsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsInputsFixedLabelsPage = (function () {
    function ComponentsInputsFixedLabelsPage() {
    }
    ComponentsInputsFixedLabelsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/inputs/fixed-labels/components.inputs.fixed-labels.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Fixed Labels</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n\n	<ion-list>\n\n		<ion-item>\n			<ion-label fixed>Username</ion-label>\n			<ion-input type="text"></ion-input>\n		</ion-item>\n\n		<ion-item>\n			<ion-label fixed>Password</ion-label>\n			<ion-input type="password"></ion-input>\n		</ion-item>\n\n	</ion-list>\n\n	<div padding>\n		<button ion-button color="primary" block>Sign In</button>\n	</div>\n\n\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/inputs/fixed-labels/components.inputs.fixed-labels.html"*/
        })
    ], ComponentsInputsFixedLabelsPage);
    return ComponentsInputsFixedLabelsPage;
}());

//# sourceMappingURL=components.inputs.fixed-labels.page.js.map

/***/ }),

/***/ 253:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsInputsListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__fixed_labels_components_inputs_fixed_labels_page__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__floating_labels_components_inputs_floating_labels_page__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__inline_labels_components_inputs_inline_labels_page__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__inset_labels_components_inputs_inset_labels_page__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__placeholder_labels_components_inputs_placeholder_labels_page__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__stacked_labels_components_inputs_stacked_labels_page__ = __webpack_require__(247);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var ComponentsInputsListPage = (function () {
    function ComponentsInputsListPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ComponentsInputsListPage.prototype.fixedLabelsTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__fixed_labels_components_inputs_fixed_labels_page__["a" /* ComponentsInputsFixedLabelsPage */]);
    };
    ComponentsInputsListPage.prototype.floatingLabelsTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__floating_labels_components_inputs_floating_labels_page__["a" /* ComponentsInputsFloatingLabelsPage */]);
    };
    ComponentsInputsListPage.prototype.inlineLabelsTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__inline_labels_components_inputs_inline_labels_page__["a" /* ComponentsInputsInlineLabelsPage */]);
    };
    ComponentsInputsListPage.prototype.insetLabelsTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__inset_labels_components_inputs_inset_labels_page__["a" /* ComponentsInputsInsetLabelsPage */]);
    };
    ComponentsInputsListPage.prototype.placeholderLabelsTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__placeholder_labels_components_inputs_placeholder_labels_page__["a" /* ComponentsInputsPlaceholderLabelsPage */]);
    };
    ComponentsInputsListPage.prototype.stackedLabelsTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__stacked_labels_components_inputs_stacked_labels_page__["a" /* ComponentsInputsStackedLabelsPage */]);
    };
    ComponentsInputsListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/inputs/components.inputs-list.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Inputs</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content padding>\n	<ion-list>\n		<ion-item (click)="fixedLabelsTapped()">\n			Fixed Labels\n		</ion-item>\n		<ion-item (click)="floatingLabelsTapped()">\n			Floating Labels\n		</ion-item>\n		<ion-item (click)="inlineLabelsTapped()">\n			Inline Labels\n		</ion-item>\n		<ion-item (click)="insetLabelsTapped()">\n			Inset Labels\n		</ion-item>\n		<ion-item (click)="placeholderLabelsTapped()">\n			Placeholder Labels\n		</ion-item>\n		<ion-item (click)="stackedLabelsTapped()">\n			Stacked Labels\n		</ion-item>\n	</ion-list>\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/inputs/components.inputs-list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */]])
    ], ComponentsInputsListPage);
    return ComponentsInputsListPage;
}());

//# sourceMappingURL=components.inputs-list.page.js.map

/***/ }),

/***/ 254:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsIconsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsIconsPage = (function () {
    function ComponentsIconsPage() {
    }
    ComponentsIconsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/icons/components.icons.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Icons</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content text-center class="icons-page">\n\n	<ion-row>\n		<ion-col>\n			<ion-icon name="ionic" color="primary"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="logo-angular"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="heart" color="danger"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="ionitron" color="primary"></ion-icon>\n		</ion-col>\n\n		<ion-col>\n			<ion-icon name="happy" color="vibrant"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="people"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="person"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="contact"></ion-icon>\n		</ion-col>\n\n		<ion-col>\n			<ion-icon name="apps"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="lock"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="key" color="bright"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="unlock"></ion-icon>\n		</ion-col>\n\n		<ion-col>\n			<ion-icon name="map" color="secondary"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="navigate"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="pin"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="locate"></ion-icon>\n		</ion-col>\n\n		<ion-col>\n			<ion-icon name="mic"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="musical-notes" color="vibrant"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="volume-up"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="microphone"></ion-icon>\n		</ion-col>\n\n		<ion-col>\n			<ion-icon name="cafe" color="bright"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="calculator"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="bus"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="wine" color="danger"></ion-icon>\n		</ion-col>\n\n		<ion-col>\n			<ion-icon name="camera"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="image" color="secondary"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="star" color="bright"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="pin"></ion-icon>\n		</ion-col>\n\n		<ion-col>\n			<ion-icon name="arrow-dropup-circle" color="vibrant"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="arrow-back"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="arrow-dropdown"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="arrow-forward"></ion-icon>\n		</ion-col>\n\n		<ion-col>\n			<ion-icon name="cloud"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="sunny" color="bright"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="umbrella"></ion-icon>\n		</ion-col>\n		<ion-col>\n			<ion-icon name="rainy" color="primary"></ion-icon>\n		</ion-col>\n	</ion-row>\n\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/icons/components.icons.html"*/
        })
    ], ComponentsIconsPage);
    return ComponentsIconsPage;
}());

//# sourceMappingURL=components.icons.page.js.map

/***/ }),

/***/ 255:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsGridPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsGridPage = (function () {
    function ComponentsGridPage() {
    }
    ComponentsGridPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/grid/components.grid.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Grid</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content class="grid-page">\n	<ion-row>\n		<ion-col>\n			<div>col</div>\n		</ion-col>\n		<ion-col>\n			<div>col</div>\n		</ion-col>\n		<ion-col>\n			<div>col</div>\n		</ion-col>\n		<ion-col>\n			<div>\n				col<br>\n				3 lines<br>\n				of text<br>\n			</div>\n		</ion-col>\n	</ion-row>\n\n	<ion-row center>\n		<ion-col>\n			<div>col</div>\n		</ion-col>\n		<ion-col>\n			<div>col</div>\n		</ion-col>\n		<ion-col>\n			<div>col</div>\n		</ion-col>\n		<ion-col>\n			<div>\n				col<br>\n				3 lines<br>\n				center<br>\n			</div>\n		</ion-col>\n	</ion-row>\n\n	<ion-row center>\n		<ion-col offset-25>\n			<div>col</div>\n		</ion-col>\n		<ion-col>\n			<div>col</div>\n		</ion-col>\n		<ion-col>\n			<div>\n				col<br>\n				3 lines<br>\n				center<br>\n			</div>\n		</ion-col>\n	</ion-row>\n\n	<ion-row baseline>\n		<ion-col offset-50>\n			<div>col</div>\n		</ion-col>\n		<ion-col>\n			<div>\n				col<br>\n				3 lines<br>\n				baseline<br>\n			</div>\n		</ion-col>\n	</ion-row>\n\n	<ion-row baseline>\n		<ion-col offset-75>\n			<div>\n				col<br>\n				2 lines<br>\n			</div>\n		</ion-col>\n	</ion-row>\n\n\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/grid/components.grid.html"*/
        })
    ], ComponentsGridPage);
    return ComponentsGridPage;
}());

//# sourceMappingURL=components.grid.page.js.map

/***/ }),

/***/ 256:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsGesturesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsGesturesPage = (function () {
    function ComponentsGesturesPage() {
        this.press = 0;
        this.pan = 0;
        this.swipe = 0;
        this.tap = 0;
    }
    ComponentsGesturesPage.prototype.pressEvent = function (e) {
        this.press++;
    };
    ComponentsGesturesPage.prototype.panEvent = function (e) {
        this.pan++;
    };
    ComponentsGesturesPage.prototype.swipeEvent = function (e) {
        this.swipe++;
    };
    ComponentsGesturesPage.prototype.tapEvent = function (e) {
        this.tap++;
    };
    ComponentsGesturesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/gestures/components.gestures.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Gestures</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n\n	<ion-card (tap)="tapEvent($event)">\n		<ion-item>\n			Tapped: {{tap}} times\n		</ion-item>\n	</ion-card>\n\n	<ion-card (press)="pressEvent($event)">\n		<ion-item>\n			Pressed: {{press}} times\n		</ion-item>\n	</ion-card>\n\n	<ion-card (pan)="panEvent($event)">\n		<ion-item>\n			Panned: {{pan}} times\n		</ion-item>\n	</ion-card>\n\n	<ion-card (swipe)="swipeEvent($event)">\n		<ion-item>\n			Swiped: {{swipe}} times\n		</ion-item>\n	</ion-card>\n\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/gestures/components.gestures.html"*/
        })
    ], ComponentsGesturesPage);
    return ComponentsGesturesPage;
}());

//# sourceMappingURL=components.gestures.page.js.map

/***/ }),

/***/ 257:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsFloatingActionButtonsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsFloatingActionButtonsPage = (function () {
    function ComponentsFloatingActionButtonsPage() {
    }
    ComponentsFloatingActionButtonsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/floating-action-buttons/components.floating-action-buttons.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>\n			FABs\n		</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n\n	<ion-fab top right edge>\n		<button ion-fab color="vibrant" mini>\n			<ion-icon name="add"></ion-icon>\n		</button>\n		<ion-fab-list>\n			<button ion-fab>\n				<ion-icon name="logo-facebook"></ion-icon>\n			</button>\n			<button ion-fab>\n				<ion-icon name="logo-twitter"></ion-icon>\n			</button>\n			<button ion-fab>\n				<ion-icon name="logo-vimeo"></ion-icon>\n			</button>\n			<button ion-fab>\n				<ion-icon name="logo-googleplus"></ion-icon>\n			</button>\n		</ion-fab-list>\n	</ion-fab>\n\n	<ion-fab right bottom>\n		<button ion-fab color="light">\n			<ion-icon name="arrow-dropleft"></ion-icon>\n		</button>\n		<ion-fab-list side="left">\n			<button ion-fab>\n				<ion-icon name="logo-facebook"></ion-icon>\n			</button>\n			<button ion-fab>\n				<ion-icon name="logo-twitter"></ion-icon>\n			</button>\n			<button ion-fab>\n				<ion-icon name="logo-vimeo"></ion-icon>\n			</button>\n			<button ion-fab>\n				<ion-icon name="logo-googleplus"></ion-icon>\n			</button>\n		</ion-fab-list>\n	</ion-fab>\n\n	<ion-fab left top>\n		<button ion-fab color="secondary">\n			<ion-icon name="arrow-dropright"></ion-icon>\n		</button>\n		<ion-fab-list side="right">\n			<button ion-fab>\n				<ion-icon name="logo-facebook"></ion-icon>\n			</button>\n			<button ion-fab>\n				<ion-icon name="logo-twitter"></ion-icon>\n			</button>\n			<button ion-fab>\n				<ion-icon name="logo-vimeo"></ion-icon>\n			</button>\n			<button ion-fab>\n				<ion-icon name="logo-googleplus"></ion-icon>\n			</button>\n		</ion-fab-list>\n	</ion-fab>\n\n	<ion-fab left bottom>\n		<button ion-fab color="dark">\n			<ion-icon name="arrow-dropup"></ion-icon>\n		</button>\n		<ion-fab-list side="top">\n			<button ion-fab>\n				<ion-icon name="logo-facebook"></ion-icon>\n			</button>\n			<button ion-fab>\n				<ion-icon name="logo-twitter"></ion-icon>\n			</button>\n			<button ion-fab>\n				<ion-icon name="logo-vimeo"></ion-icon>\n			</button>\n			<button ion-fab>\n				<ion-icon name="logo-googleplus"></ion-icon>\n			</button>\n		</ion-fab-list>\n	</ion-fab>\n\n	<ion-fab center middle>\n		<button ion-fab color="danger">\n			<ion-icon name="md-share"></ion-icon>\n		</button>\n		<ion-fab-list side="top">\n			<button ion-fab color="primary">\n				<ion-icon name="logo-vimeo"></ion-icon>\n			</button>\n		</ion-fab-list>\n		<ion-fab-list side="bottom">\n			<button ion-fab color="secondary">\n				<ion-icon name="logo-facebook"></ion-icon>\n			</button>\n		</ion-fab-list>\n		<ion-fab-list side="left">\n			<button ion-fab color="light">\n				<ion-icon name="logo-googleplus"></ion-icon>\n			</button>\n		</ion-fab-list>\n		<ion-fab-list side="right">\n			<button ion-fab color="dark">\n				<ion-icon name="logo-twitter"></ion-icon>\n			</button>\n		</ion-fab-list>\n	</ion-fab>\n\n	<ion-fab right middle>\n		<button ion-fab color="danger">\n			<ion-icon name="add"></ion-icon>\n		</button>\n	</ion-fab>\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/floating-action-buttons/components.floating-action-buttons.html"*/
        })
    ], ComponentsFloatingActionButtonsPage);
    return ComponentsFloatingActionButtonsPage;
}());

//# sourceMappingURL=components.floating-action-buttons.page.js.map

/***/ }),

/***/ 258:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsCheckboxPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsCheckboxPage = (function () {
    function ComponentsCheckboxPage() {
    }
    ComponentsCheckboxPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/checkbox/components.checkbox.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Checkbox</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n	<ion-list>\n		<ion-list-header>\n			Items List\n		</ion-list-header>\n\n		<ion-item>\n			<ion-label>Item 1</ion-label>\n			<ion-checkbox color="dark" checked="true"></ion-checkbox>\n		</ion-item>\n\n		<ion-item>\n			<ion-label>Item 2</ion-label>\n			<ion-checkbox></ion-checkbox>\n		</ion-item>\n\n		<ion-item>\n			<ion-label>Item 3</ion-label>\n			<ion-checkbox value="item 3" disabled="true"></ion-checkbox>\n		</ion-item>\n	</ion-list>\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/checkbox/components.checkbox.html"*/
        })
    ], ComponentsCheckboxPage);
    return ComponentsCheckboxPage;
}());

//# sourceMappingURL=components.checkbox.page.js.map

/***/ }),

/***/ 259:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsCardsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsCardsPage = (function () {
    function ComponentsCardsPage() {
    }
    ComponentsCardsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/cards/components.cards.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Cards</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n	<ion-card>\n		<ion-card-content>\n			This is just your basic card with some text to boot.\n		</ion-card-content>\n	</ion-card>\n\n	<ion-card>\n		<ion-card-header>\n			Header\n		</ion-card-header>\n		<ion-card-content>\n			This is a card with some text and a header.\n		</ion-card-content>\n	</ion-card>\n\n	<ion-card>\n		<ion-card-header>\n			List In Card\n		</ion-card-header>\n\n		<ion-list>\n			<button ion-item>\n				<ion-icon name=\'cart\' item-left></ion-icon>\n				Shopping\n			</button>\n\n			<button ion-item>\n				<ion-icon name=\'medical\' item-left></ion-icon>\n				Hospital\n			</button>\n\n			<button ion-item>\n				<ion-icon name=\'cafe\' item-left></ion-icon>\n				Cafe\n			</button>\n\n			<button ion-item>\n				<ion-icon name=\'paw\' item-left></ion-icon>\n				Dog Park\n			</button>\n\n			<button ion-item>\n				<ion-icon name=\'beer\' item-left></ion-icon>\n				Pub\n			</button>\n\n			<button ion-item>\n				<ion-icon name=\'planet\' item-left></ion-icon>\n				Space\n			</button>\n		</ion-list>\n	</ion-card>\n\n	<ion-card>\n		<img src="assets/img/bjork-live.jpg"/>\n		<ion-card-content>\n			<ion-card-title>\n				Björk\n			</ion-card-title>\n			<p>\n				Björk first came to prominence as one of the lead vocalists of the avant pop Icelandic sextet the\n				Sugarcubes, but when...\n			</p>\n		</ion-card-content>\n		<ion-row no-padding>\n			<ion-col>\n				<button ion-button clear small color="danger" icon-left>\n					<ion-icon name=\'star\'></ion-icon>\n					Favorite\n				</button>\n			</ion-col>\n			<ion-col text-center>\n				<button ion-button clear small color="danger" icon-left>\n					<ion-icon name=\'musical-notes\'></ion-icon>\n					Listen\n				</button>\n			</ion-col>\n			<ion-col text-right>\n				<button ion-button clear small color="danger" icon-left>\n					<ion-icon name=\'share-alt\'></ion-icon>\n					Share\n				</button>\n			</ion-col>\n		</ion-row>\n	</ion-card>\n	<div class="card-background-page">\n		<ion-card>\n			<img src="assets/img/bjork-live.jpg"/>\n			<div class="card-title">Björk</div>\n			<div class="card-subtitle">9 Albums</div>\n		</ion-card>\n	</div>\n	<ion-card>\n		<ion-item>\n			<ion-avatar item-left>\n				<img src="assets/img/marty-avatar.png">\n			</ion-avatar>\n			<h2>Marty McFly</h2>\n			<p>November 5, 1955</p>\n		</ion-item>\n\n		<img src="assets/img/advance-card-bttf.png">\n\n		<ion-card-content>\n			<p>Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a\n				DeLorean?! Whoa. This is heavy.</p>\n		</ion-card-content>\n\n		<ion-row no-padding>\n			<ion-col>\n				<button ion-button clear small color="primary" icon-left>\n					<ion-icon name=\'thumbs-up\'></ion-icon>\n					12 Likes\n				</button>\n			</ion-col>\n			<ion-col text-center>\n				<button ion-button clear small color="primary" icon-left>\n					<ion-icon name=\'text\'></ion-icon>\n					4 Comments\n				</button>\n			</ion-col>\n			<ion-col center text-center>\n				<ion-note>\n					11h ago\n				</ion-note>\n			</ion-col>\n		</ion-row>\n	</ion-card>\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/cards/components.cards.html"*/
        })
    ], ComponentsCardsPage);
    return ComponentsCardsPage;
}());

//# sourceMappingURL=components.cards.page.js.map

/***/ }),

/***/ 260:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsButtonsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsButtonsPage = (function () {
    function ComponentsButtonsPage() {
    }
    ComponentsButtonsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/buttons/components.buttons.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Buttons</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content padding>\n	<div>\n		<button ion-button color="light">Light</button>\n	</div>\n	<div>\n		<button ion-button>Default</button>\n	</div>\n	<div>\n		<button ion-button color="secondary">Secondary</button>\n	</div>\n	<div>\n		<button ion-button color="danger">Danger</button>\n	</div>\n	<div>\n		<button ion-button color="dark">Dark</button>\n	</div>\n	<div>\n		<button ion-button color="light" outline>Light</button>\n	</div>\n	<div>\n		<button ion-button outline>Default</button>\n	</div>\n	<div>\n		<button ion-button color="secondary" outline>Secondary</button>\n	</div>\n	<div>\n		<button ion-button color="danger" outline>Danger</button>\n	</div>\n	<div>\n		<button ion-button color="dark" outline>Dark</button>\n	</div>\n	<div>\n		<button ion-button color="light" clear>Light</button>\n	</div>\n	<div>\n		<button ion-button clear>Default</button>\n	</div>\n	<div>\n		<button ion-button color="secondary" clear>Secondary</button>\n	</div>\n	<div>\n		<button ion-button color="danger" clear>Danger</button>\n	</div>\n	<div>\n		<button ion-button color="dark" clear>Dark</button>\n	</div>\n	<div>\n		<button ion-button color="light" round>Light</button>\n	</div>\n	<div>\n		<button ion-button round>Default</button>\n	</div>\n	<div>\n		<button ion-button color="secondary" round>Secondary</button>\n	</div>\n	<div>\n		<button ion-button color="danger" round>Danger</button>\n	</div>\n	<div>\n		<button ion-button color="dark" round>Dark</button>\n	</div>\n	<div>\n		<button ion-button color="light" block>Light</button>\n	</div>\n	<div>\n		<button ion-button block>Default</button>\n	</div>\n	<div>\n		<button ion-button color="secondary" block>Secondary</button>\n	</div>\n	<div>\n		<button ion-button color="danger" block>Danger</button>\n	</div>\n	<div>\n		<button ion-button color="dark" block>Dark</button>\n	</div>\n	<div>\n		<button ion-button color="light" full>Light</button>\n	</div>\n	<div>\n		<button ion-button full>Default</button>\n	</div>\n	<div>\n		<button ion-button color="secondary" full>Secondary</button>\n	</div>\n	<div>\n		<button ion-button color="danger" full>Danger</button>\n	</div>\n	<div>\n		<button ion-button color="dark" full>Dark</button>\n	</div>\n	<div>\n		<button ion-button color="light" small>Light Small</button>\n	</div>\n	<div>\n		<button ion-button small>Default Small</button>\n	</div>\n	<div>\n		<button ion-button color="secondary">Secondary Medium</button>\n	</div>\n	<div>\n		<button ion-button color="danger" medium>Danger Medium</button>\n	</div>\n	<div>\n		<button ion-button color="dark" large>Dark Large</button>\n	</div>\n	<div>\n		<button ion-button color="dark" round icon-left>\n			<ion-icon name=\'construct\'></ion-icon>\n			Tools\n		</button>\n		<button ion-button color="dark" clear icon-only>\n			<ion-icon name=\'hammer\'></ion-icon>\n		</button>\n	</div>\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/buttons/components.buttons.html"*/
        })
    ], ComponentsButtonsPage);
    return ComponentsButtonsPage;
}());

//# sourceMappingURL=components.buttons.page.js.map

/***/ }),

/***/ 261:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsBadgesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var ComponentsBadgesPage = (function () {
    function ComponentsBadgesPage() {
    }
    ComponentsBadgesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/badges/components.badges.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Badges</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content>\n\n	<ion-card>\n\n		<img src="assets/img/bjork-live.jpg"/>\n\n		<ion-card-content>\n			<h2 class="card-title">\n				Björk\n			</h2>\n			<p>\n				Björk first came to prominence as one of the lead vocalists of the avant pop Icelandic sextet the\n				Sugarcubes, but when...\n			</p>\n		</ion-card-content>\n\n		<ion-item>\n			<ion-icon name=\'musical-notes\' item-left style="color: #d03e84"></ion-icon>\n			Albums\n			<ion-badge item-right>9</ion-badge>\n		</ion-item>\n\n		<ion-item>\n			<ion-icon name=\'logo-twitter\' item-left style="color: #55acee"></ion-icon>\n			Followers\n			<ion-badge item-right>260k</ion-badge>\n		</ion-item>\n\n	</ion-card>\n\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/badges/components.badges.html"*/
        })
    ], ComponentsBadgesPage);
    return ComponentsBadgesPage;
}());

//# sourceMappingURL=components.badges.page.js.map

/***/ }),

/***/ 262:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsAlertsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ComponentsAlertsPage = (function () {
    function ComponentsAlertsPage(alertCtrl) {
        this.alertCtrl = alertCtrl;
    }
    ComponentsAlertsPage.prototype.doAlert = function () {
        var alert = this.alertCtrl.create({
            title: 'Alert!',
            message: 'This is some important information!',
            buttons: ['Ok']
        });
        alert.present();
    };
    ComponentsAlertsPage.prototype.doPrompt = function () {
        var prompt = this.alertCtrl.create({
            title: 'Password',
            message: 'Enter your password to login',
            inputs: [
                {
                    name: 'password',
                    placeholder: 'Password'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Login',
                    handler: function (data) {
                        console.log('Login clicked');
                    }
                }
            ]
        });
        prompt.present();
    };
    ComponentsAlertsPage.prototype.doConfirmation = function () {
        var confirmation = this.alertCtrl.create({
            title: 'Confirmation',
            message: 'Are you sure you want to delete this item?',
            buttons: [
                {
                    text: 'No',
                    handler: function () {
                        console.log('No clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: function () {
                        console.log('Yes clicked');
                    }
                }
            ]
        });
        confirmation.present();
    };
    ComponentsAlertsPage.prototype.doRadioAlert = function () {
        var _this = this;
        var radioAlert = this.alertCtrl.create();
        radioAlert.setTitle('Select color');
        radioAlert.addInput({
            type: 'radio',
            label: 'Blue',
            value: 'blue',
            checked: true
        });
        radioAlert.addInput({
            type: 'radio',
            label: 'Green',
            value: 'green'
        });
        radioAlert.addInput({
            type: 'radio',
            label: 'Red',
            value: 'red'
        });
        radioAlert.addInput({
            type: 'radio',
            label: 'Yellow',
            value: 'yellow'
        });
        radioAlert.addInput({
            type: 'radio',
            label: 'Purple',
            value: 'purple'
        });
        radioAlert.addInput({
            type: 'radio',
            label: 'White',
            value: 'white'
        });
        radioAlert.addInput({
            type: 'radio',
            label: 'Black',
            value: 'black'
        });
        radioAlert.addButton('Cancel');
        radioAlert.addButton({
            text: 'Ok',
            handler: function (data) {
                console.log('Radio data:', data);
                _this.testRadioOpen = false;
                _this.testRadioResult = data;
            }
        });
        radioAlert.present().then(function () {
            _this.testRadioOpen = true;
        });
    };
    ComponentsAlertsPage.prototype.doCheckboxAlert = function () {
        var _this = this;
        var checkboxAlert = this.alertCtrl.create();
        checkboxAlert.setTitle('Which fruits you like?');
        checkboxAlert.addInput({
            type: 'checkbox',
            label: 'Apple',
            value: 'apple',
            checked: true
        });
        checkboxAlert.addInput({
            type: 'checkbox',
            label: 'Banana',
            value: 'banana'
        });
        checkboxAlert.addInput({
            type: 'checkbox',
            label: 'Kiwi',
            value: 'kiwi'
        });
        checkboxAlert.addInput({
            type: 'checkbox',
            label: 'Strawberry',
            value: 'strawberry'
        });
        checkboxAlert.addInput({
            type: 'checkbox',
            label: 'Pineapple',
            value: 'pineapple'
        });
        checkboxAlert.addButton('Cancel');
        checkboxAlert.addButton({
            text: 'Okay',
            handler: function (data) {
                console.log('Checkbox data:', data);
                _this.testCheckboxOpen = false;
                _this.testCheckboxResult = data;
            }
        });
        checkboxAlert.present().then(function () {
            _this.testCheckboxOpen = true;
        });
    };
    ComponentsAlertsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/alerts/components.alerts.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Alerts</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content padding>\n	<button ion-button color="dark" block (click)="doAlert()">\n		Show Basic Alert\n	</button>\n	<button ion-button color="secondary" block (click)="doPrompt()">\n		Show Prompt Alert\n	</button>\n	<button ion-button color="danger" block (click)="doConfirmation()">\n		Show Confirmation Alert\n	</button>\n	<button ion-button color="light" block (click)="doRadioAlert()">\n		Show Radio Alert\n	</button>\n	<button ion-button color="primary" block (click)="doCheckboxAlert()">\n		Show Checkbox Alert\n	</button>\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/alerts/components.alerts.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */]])
    ], ComponentsAlertsPage);
    return ComponentsAlertsPage;
}());

//# sourceMappingURL=components.alerts.page.js.map

/***/ }),

/***/ 263:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsActionSheetPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var ComponentsActionSheetPage = (function () {
    function ComponentsActionSheetPage(platform, actionsheetCtrl) {
        this.platform = platform;
        this.actionsheetCtrl = actionsheetCtrl;
    }
    ComponentsActionSheetPage.prototype.openActionSheet = function () {
        var actionSheet = this.actionsheetCtrl.create({
            title: 'Select an action',
            buttons: [
                {
                    text: 'Delete',
                    role: 'destructive',
                    icon: !this.platform.is('ios') ? 'trash' : null,
                    handler: function () {
                        console.log('Delete clicked');
                    }
                },
                {
                    text: 'Share',
                    icon: !this.platform.is('ios') ? 'share' : null,
                    handler: function () {
                        console.log('Share clicked');
                    }
                },
                {
                    text: 'Play',
                    icon: !this.platform.is('ios') ? 'arrow-dropright-circle' : null,
                    handler: function () {
                        console.log('Play clicked');
                    }
                },
                {
                    text: 'Favorite',
                    icon: !this.platform.is('ios') ? 'heart-outline' : null,
                    handler: function () {
                        console.log('Favorite clicked');
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel',
                    icon: !this.platform.is('ios') ? 'close' : null,
                    handler: function () {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    };
    ComponentsActionSheetPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/actionsheet/components.actionsheet.html"*/'<ion-header>\n	<ion-navbar>\n		<ion-title>Action Sheet</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content padding>\n	<button ion-button block (click)="openActionSheet()">\n		Show Action Sheet\n	</button>\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/actionsheet/components.actionsheet.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */]])
    ], ComponentsActionSheetPage);
    return ComponentsActionSheetPage;
}());

//# sourceMappingURL=components.actionsheet.page.js.map

/***/ }),

/***/ 264:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(265);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_module__ = __webpack_require__(287);



Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 287:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__agm_core__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ultimate_ngxerrors__ = __webpack_require__(292);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_status_bar__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__config__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_components_components_module__ = __webpack_require__(396);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_google_maps_google_maps_module__ = __webpack_require__(398);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_home_home_module__ = __webpack_require__(399);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_slide_box_slide_box_module__ = __webpack_require__(400);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_wordpress_wordpress_module__ = __webpack_require__(401);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__app_component__ = __webpack_require__(405);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_angularfire2__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_angularfire2_auth__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_login_login__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__services_auth_service__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_signup_signup__ = __webpack_require__(207);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




















var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_13__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_16__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_signup_signup__["a" /* SignupPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["f" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_13__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/login/login.module#LoginPageModule', name: 'LoginPage', segment: 'login', priority: 'low', defaultHistory: [] }
                    ]
                }),
                __WEBPACK_IMPORTED_MODULE_0__agm_core__["a" /* AgmCoreModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_14_angularfire2__["a" /* AngularFireModule */].initializeApp(__WEBPACK_IMPORTED_MODULE_7__config__["b" /* firebaseConfig */].fire),
                __WEBPACK_IMPORTED_MODULE_8__pages_components_components_module__["a" /* ComponentsModule */],
                __WEBPACK_IMPORTED_MODULE_3__ultimate_ngxerrors__["a" /* NgxErrorsModule */],
                __WEBPACK_IMPORTED_MODULE_9__pages_google_maps_google_maps_module__["a" /* GoogleMapsModule */],
                __WEBPACK_IMPORTED_MODULE_10__pages_home_home_module__["a" /* HomeModule */],
                __WEBPACK_IMPORTED_MODULE_11__pages_slide_box_slide_box_module__["a" /* SlideBoxModule */],
                __WEBPACK_IMPORTED_MODULE_12__pages_wordpress_wordpress_module__["a" /* WordpressModule */]
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_6_ionic_angular__["d" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_13__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_16__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_signup_signup__["a" /* SignupPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_7__config__["a" /* Config */],
                __WEBPACK_IMPORTED_MODULE_5__ionic_native_status_bar__["a" /* StatusBar */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["e" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_15_angularfire2_auth__["a" /* AngularFireAuth */],
                __WEBPACK_IMPORTED_MODULE_17__services_auth_service__["a" /* AuthService */]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 335:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WordpressService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__config__ = __webpack_require__(98);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var WordpressService = (function () {
    function WordpressService(http, config) {
        this.http = http;
        this.config = config;
    }
    WordpressService.prototype.getPosts = function () {
        var _this = this;
        return this.http.get(this.config.wordpressApiUrl)
            .map(function (x) { return x.json(); })
            .map(function (response) {
            _this.articles = response.posts.map(function (item) { return _this.createArticle(item); });
            return _this.articles;
        });
    };
    WordpressService.prototype.createArticle = function (item) {
        var imageUrl = item.attachments.length > 0 ? item.attachments[0].images.full.url : null;
        var tags = item.tags.map(function (x) { return x.title; });
        var contentIndex = item.content.indexOf('</p>') + 4;
        var content = contentIndex === -1 ? item.content : item.content.substring(contentIndex);
        return {
            id: item.id,
            title: item.title,
            brief: item.excerpt,
            image: imageUrl,
            date: item.date,
            content: content,
            author: item.author.name,
            tags: tags,
            url: this.config.wordpressApiUrl
        };
    };
    WordpressService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */], __WEBPACK_IMPORTED_MODULE_2__config__["a" /* Config */]])
    ], WordpressService);
    return WordpressService;
}());

//# sourceMappingURL=wordpress.service.js.map

/***/ }),

/***/ 336:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return data; });
var data = {
    facebook: 'https://www.facebook.com/ionicframework',
    phoneNumber: '+306973216110',
    email: {
        to: 'skounis@gmail.com',
        subject: 'Cordova Icons',
        body: 'How are you? Nice greetings from Leipzig'
    },
    officeLocation: '37.7736854,-122.421034'
};
//# sourceMappingURL=home-data.js.map

/***/ }),

/***/ 396:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__inputs_stacked_labels_components_inputs_stacked_labels_page__ = __webpack_require__(247);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__inputs_placeholder_labels_components_inputs_placeholder_labels_page__ = __webpack_require__(248);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__inputs_inset_labels_components_inputs_inset_labels_page__ = __webpack_require__(249);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__inputs_inline_labels_components_inputs_inline_labels_page__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__inputs_floating_labels_components_inputs_floating_labels_page__ = __webpack_require__(251);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__inputs_fixed_labels_components_inputs_fixed_labels_page__ = __webpack_require__(252);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__inputs_components_inputs_list_page__ = __webpack_require__(253);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__icons_components_icons_page__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__grid_components_grid_page__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__gestures_components_gestures_page__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__floating_action_buttons_components_floating_action_buttons_page__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__checkbox_components_checkbox_page__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__cards_components_cards_page__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__buttons_components_buttons_page__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__badges_components_badges_page__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__alerts_components_alerts_page__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__actionsheet_components_actionsheet_page__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__list_components_list_page__ = __webpack_require__(397);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




















var ComponentsModule = (function () {
    function ComponentsModule() {
    }
    ComponentsModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            imports: [__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["f" /* IonicModule */]],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_19__list_components_list_page__["a" /* ComponentsListPage */],
                __WEBPACK_IMPORTED_MODULE_18__actionsheet_components_actionsheet_page__["a" /* ComponentsActionSheetPage */],
                __WEBPACK_IMPORTED_MODULE_17__alerts_components_alerts_page__["a" /* ComponentsAlertsPage */],
                __WEBPACK_IMPORTED_MODULE_16__badges_components_badges_page__["a" /* ComponentsBadgesPage */],
                __WEBPACK_IMPORTED_MODULE_15__buttons_components_buttons_page__["a" /* ComponentsButtonsPage */],
                __WEBPACK_IMPORTED_MODULE_14__cards_components_cards_page__["a" /* ComponentsCardsPage */],
                __WEBPACK_IMPORTED_MODULE_13__checkbox_components_checkbox_page__["a" /* ComponentsCheckboxPage */],
                __WEBPACK_IMPORTED_MODULE_12__floating_action_buttons_components_floating_action_buttons_page__["a" /* ComponentsFloatingActionButtonsPage */],
                __WEBPACK_IMPORTED_MODULE_11__gestures_components_gestures_page__["a" /* ComponentsGesturesPage */],
                __WEBPACK_IMPORTED_MODULE_10__grid_components_grid_page__["a" /* ComponentsGridPage */],
                __WEBPACK_IMPORTED_MODULE_9__icons_components_icons_page__["a" /* ComponentsIconsPage */],
                __WEBPACK_IMPORTED_MODULE_8__inputs_components_inputs_list_page__["a" /* ComponentsInputsListPage */],
                __WEBPACK_IMPORTED_MODULE_7__inputs_fixed_labels_components_inputs_fixed_labels_page__["a" /* ComponentsInputsFixedLabelsPage */],
                __WEBPACK_IMPORTED_MODULE_6__inputs_floating_labels_components_inputs_floating_labels_page__["a" /* ComponentsInputsFloatingLabelsPage */],
                __WEBPACK_IMPORTED_MODULE_5__inputs_inline_labels_components_inputs_inline_labels_page__["a" /* ComponentsInputsInlineLabelsPage */],
                __WEBPACK_IMPORTED_MODULE_4__inputs_inset_labels_components_inputs_inset_labels_page__["a" /* ComponentsInputsInsetLabelsPage */],
                __WEBPACK_IMPORTED_MODULE_3__inputs_placeholder_labels_components_inputs_placeholder_labels_page__["a" /* ComponentsInputsPlaceholderLabelsPage */],
                __WEBPACK_IMPORTED_MODULE_2__inputs_stacked_labels_components_inputs_stacked_labels_page__["a" /* ComponentsInputsStackedLabelsPage */]
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_19__list_components_list_page__["a" /* ComponentsListPage */],
                __WEBPACK_IMPORTED_MODULE_18__actionsheet_components_actionsheet_page__["a" /* ComponentsActionSheetPage */],
                __WEBPACK_IMPORTED_MODULE_17__alerts_components_alerts_page__["a" /* ComponentsAlertsPage */],
                __WEBPACK_IMPORTED_MODULE_16__badges_components_badges_page__["a" /* ComponentsBadgesPage */],
                __WEBPACK_IMPORTED_MODULE_15__buttons_components_buttons_page__["a" /* ComponentsButtonsPage */],
                __WEBPACK_IMPORTED_MODULE_14__cards_components_cards_page__["a" /* ComponentsCardsPage */],
                __WEBPACK_IMPORTED_MODULE_13__checkbox_components_checkbox_page__["a" /* ComponentsCheckboxPage */],
                __WEBPACK_IMPORTED_MODULE_12__floating_action_buttons_components_floating_action_buttons_page__["a" /* ComponentsFloatingActionButtonsPage */],
                __WEBPACK_IMPORTED_MODULE_11__gestures_components_gestures_page__["a" /* ComponentsGesturesPage */],
                __WEBPACK_IMPORTED_MODULE_10__grid_components_grid_page__["a" /* ComponentsGridPage */],
                __WEBPACK_IMPORTED_MODULE_9__icons_components_icons_page__["a" /* ComponentsIconsPage */],
                __WEBPACK_IMPORTED_MODULE_8__inputs_components_inputs_list_page__["a" /* ComponentsInputsListPage */],
                __WEBPACK_IMPORTED_MODULE_7__inputs_fixed_labels_components_inputs_fixed_labels_page__["a" /* ComponentsInputsFixedLabelsPage */],
                __WEBPACK_IMPORTED_MODULE_6__inputs_floating_labels_components_inputs_floating_labels_page__["a" /* ComponentsInputsFloatingLabelsPage */],
                __WEBPACK_IMPORTED_MODULE_5__inputs_inline_labels_components_inputs_inline_labels_page__["a" /* ComponentsInputsInlineLabelsPage */],
                __WEBPACK_IMPORTED_MODULE_4__inputs_inset_labels_components_inputs_inset_labels_page__["a" /* ComponentsInputsInsetLabelsPage */],
                __WEBPACK_IMPORTED_MODULE_3__inputs_placeholder_labels_components_inputs_placeholder_labels_page__["a" /* ComponentsInputsPlaceholderLabelsPage */],
                __WEBPACK_IMPORTED_MODULE_2__inputs_stacked_labels_components_inputs_stacked_labels_page__["a" /* ComponentsInputsStackedLabelsPage */]
            ]
        })
    ], ComponentsModule);
    return ComponentsModule;
}());

//# sourceMappingURL=components.module.js.map

/***/ }),

/***/ 397:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ComponentsListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__actionsheet_components_actionsheet_page__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__alerts_components_alerts_page__ = __webpack_require__(262);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__badges_components_badges_page__ = __webpack_require__(261);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__buttons_components_buttons_page__ = __webpack_require__(260);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__cards_components_cards_page__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__checkbox_components_checkbox_page__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__floating_action_buttons_components_floating_action_buttons_page__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__gestures_components_gestures_page__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__grid_components_grid_page__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__icons_components_icons_page__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__inputs_components_inputs_list_page__ = __webpack_require__(253);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};













var ComponentsListPage = (function () {
    function ComponentsListPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    ComponentsListPage.prototype.actionsheetTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__actionsheet_components_actionsheet_page__["a" /* ComponentsActionSheetPage */]);
    };
    ComponentsListPage.prototype.alertsTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__alerts_components_alerts_page__["a" /* ComponentsAlertsPage */]);
    };
    ComponentsListPage.prototype.badgesTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__badges_components_badges_page__["a" /* ComponentsBadgesPage */]);
    };
    ComponentsListPage.prototype.buttonsTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__buttons_components_buttons_page__["a" /* ComponentsButtonsPage */]);
    };
    ComponentsListPage.prototype.cardsTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__cards_components_cards_page__["a" /* ComponentsCardsPage */]);
    };
    ComponentsListPage.prototype.checkboxTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__checkbox_components_checkbox_page__["a" /* ComponentsCheckboxPage */]);
    };
    ComponentsListPage.prototype.floatingActionButtonsTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__floating_action_buttons_components_floating_action_buttons_page__["a" /* ComponentsFloatingActionButtonsPage */]);
    };
    ComponentsListPage.prototype.gesturesTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_9__gestures_components_gestures_page__["a" /* ComponentsGesturesPage */]);
    };
    ComponentsListPage.prototype.gridTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__grid_components_grid_page__["a" /* ComponentsGridPage */]);
    };
    ComponentsListPage.prototype.iconsTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__icons_components_icons_page__["a" /* ComponentsIconsPage */]);
    };
    ComponentsListPage.prototype.inputsTapped = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_12__inputs_components_inputs_list_page__["a" /* ComponentsInputsListPage */]);
    };
    ComponentsListPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/list/components.list.html"*/'<ion-header>\n	<ion-navbar>\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Components</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content padding>\n	<ion-list>\n		<ion-item (click)="actionsheetTapped()">\n			Action Sheet\n		</ion-item>\n		<ion-item (click)="alertsTapped()">\n			Alerts\n		</ion-item>\n		<ion-item (click)="badgesTapped()">\n			Badges\n		</ion-item>\n		<ion-item (click)="buttonsTapped()">\n			Buttons\n		</ion-item>\n		<ion-item (click)="cardsTapped()">\n			Cards\n		</ion-item>\n		<ion-item (click)="checkboxTapped()">\n			Checkbox\n		</ion-item>\n		<ion-item (click)="floatingActionButtonsTapped()">\n			Floating Action Buttons\n		</ion-item>\n		<ion-item (click)="gesturesTapped()">\n			Gestures\n		</ion-item>\n		<ion-item (click)="gridTapped()">\n			Grid\n		</ion-item>\n		<ion-item (click)="iconsTapped()">\n			Icons\n		</ion-item>\n		<ion-item (click)="inputsTapped()">\n			Inputs\n		</ion-item>\n	</ion-list>\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/components/list/components.list.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */]])
    ], ComponentsListPage);
    return ComponentsListPage;
}());

//# sourceMappingURL=components.list.page.js.map

/***/ }),

/***/ 398:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GoogleMapsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__google_maps_page__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__agm_core__ = __webpack_require__(133);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




var GoogleMapsModule = (function () {
    function GoogleMapsModule() {
    }
    GoogleMapsModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [__WEBPACK_IMPORTED_MODULE_2__google_maps_page__["a" /* GoogleMapsPage */]],
            entryComponents: [__WEBPACK_IMPORTED_MODULE_2__google_maps_page__["a" /* GoogleMapsPage */]],
            imports: [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* IonicModule */], __WEBPACK_IMPORTED_MODULE_3__agm_core__["a" /* AgmCoreModule */]]
        })
    ], GoogleMapsModule);
    return GoogleMapsModule;
}());

//# sourceMappingURL=google-maps.module.js.map

/***/ }),

/***/ 399:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_email_service__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__services_call_service__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_page__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_in_app_browser_service__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_maps_service__ = __webpack_require__(195);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







var HomeModule = (function () {
    function HomeModule() {
    }
    HomeModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            imports: [__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["f" /* IonicModule */]],
            declarations: [__WEBPACK_IMPORTED_MODULE_4__home_page__["a" /* HomePage */]],
            entryComponents: [__WEBPACK_IMPORTED_MODULE_4__home_page__["a" /* HomePage */]],
            providers: [
                __WEBPACK_IMPORTED_MODULE_2__services_email_service__["a" /* EmailService */],
                __WEBPACK_IMPORTED_MODULE_3__services_call_service__["a" /* CallService */],
                __WEBPACK_IMPORTED_MODULE_5__services_in_app_browser_service__["a" /* InAppBrowserService */],
                __WEBPACK_IMPORTED_MODULE_6__services_maps_service__["a" /* MapsService */]
            ]
        })
    ], HomeModule);
    return HomeModule;
}());

//# sourceMappingURL=home.module.js.map

/***/ }),

/***/ 400:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SlideBoxModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__slide_box_page__ = __webpack_require__(191);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var SlideBoxModule = (function () {
    function SlideBoxModule() {
    }
    SlideBoxModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            imports: [__WEBPACK_IMPORTED_MODULE_0_ionic_angular__["f" /* IonicModule */]],
            declarations: [__WEBPACK_IMPORTED_MODULE_2__slide_box_page__["a" /* SlideBoxPage */]],
            entryComponents: [__WEBPACK_IMPORTED_MODULE_2__slide_box_page__["a" /* SlideBoxPage */]]
        })
    ], SlideBoxModule);
    return SlideBoxModule;
}());

//# sourceMappingURL=slide-box.module.js.map

/***/ }),

/***/ 401:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return WordpressModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__pipes_pipes_module__ = __webpack_require__(402);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__item_wordpress_item_page__ = __webpack_require__(190);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__list_wordpress_list_page__ = __webpack_require__(189);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var WordpressModule = (function () {
    function WordpressModule() {
    }
    WordpressModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            imports: [
                __WEBPACK_IMPORTED_MODULE_0_ionic_angular__["f" /* IonicModule */],
                __WEBPACK_IMPORTED_MODULE_2__pipes_pipes_module__["a" /* PipesModule */]
            ],
            declarations: [
                __WEBPACK_IMPORTED_MODULE_3__item_wordpress_item_page__["a" /* WordpressItemPage */],
                __WEBPACK_IMPORTED_MODULE_4__list_wordpress_list_page__["a" /* WordpressListPage */]
            ],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_3__item_wordpress_item_page__["a" /* WordpressItemPage */],
                __WEBPACK_IMPORTED_MODULE_4__list_wordpress_list_page__["a" /* WordpressListPage */]
            ]
        })
    ], WordpressModule);
    return WordpressModule;
}());

//# sourceMappingURL=wordpress.module.js.map

/***/ }),

/***/ 402:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PipesModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__trim_html_pipe__ = __webpack_require__(403);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__truncate_pipe__ = __webpack_require__(404);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var PipesModule = (function () {
    function PipesModule() {
    }
    PipesModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__truncate_pipe__["a" /* TruncatePipe */],
                __WEBPACK_IMPORTED_MODULE_1__trim_html_pipe__["a" /* TrimHtmlPipe */]
            ],
            exports: [
                __WEBPACK_IMPORTED_MODULE_2__truncate_pipe__["a" /* TruncatePipe */],
                __WEBPACK_IMPORTED_MODULE_1__trim_html_pipe__["a" /* TrimHtmlPipe */]
            ]
        })
    ], PipesModule);
    return PipesModule;
}());

//# sourceMappingURL=pipes.module.js.map

/***/ }),

/***/ 403:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TrimHtmlPipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var TrimHtmlPipe = (function () {
    function TrimHtmlPipe() {
    }
    TrimHtmlPipe.prototype.transform = function (value) {
        return this.htmlToPlainText(value);
    };
    TrimHtmlPipe.prototype.htmlToPlainText = function (html) {
        return String(html).replace(/<[^>]+>/gm, '');
    };
    TrimHtmlPipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["S" /* Pipe */])({
            name: 'trimHtml'
        })
    ], TrimHtmlPipe);
    return TrimHtmlPipe;
}());

//# sourceMappingURL=trim-html.pipe.js.map

/***/ }),

/***/ 404:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TruncatePipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var TruncatePipe = (function () {
    function TruncatePipe() {
    }
    TruncatePipe.prototype.transform = function (value, limit) {
        return value.length > limit ? value.substring(0, limit) + '...' : value;
    };
    TruncatePipe = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["S" /* Pipe */])({
            name: 'truncate'
        })
    ], TruncatePipe);
    return TruncatePipe;
}());

//# sourceMappingURL=truncate.pipe.js.map

/***/ }),

/***/ 405:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_status_bar__ = __webpack_require__(146);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__pages_home_home_page__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_auth_service__ = __webpack_require__(56);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var MyApp = (function () {
    function MyApp(app, platform, menu, statusBar, auth) {
        this.statusBar = statusBar;
        this.auth = auth;
        this.menu = menu;
        this.app = app;
        this.platform = platform;
        this.initializeApp();
        // set our app's page
    }
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.statusBar.styleDefault();
        });
        this.auth.afAuth.authState
            .subscribe(function (user) {
            if (user) {
                _this.rootPage = __WEBPACK_IMPORTED_MODULE_3__pages_home_home_page__["a" /* HomePage */];
            }
            else {
                _this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */];
            }
        }, function () {
            _this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */];
        });
    };
    MyApp.prototype.login = function () {
        this.menu.close();
        this.auth.signOut();
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */]);
    };
    MyApp.prototype.logout = function () {
        this.menu.close();
        this.auth.signOut();
        this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_3__pages_home_home_page__["a" /* HomePage */]);
    };
    MyApp.prototype.openPage = function (page) {
        this.menu.close();
        this.nav.setRoot(page.component);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["i" /* Nav */])
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/app/app.html"*/'<ion-menu id="leftMenu" [content]="content" type="overlay">\n\n    <ion-header>\n\n        <ion-toolbar>\n\n            <ion-title>Opciones</ion-title>\n\n        </ion-toolbar>\n\n    </ion-header>\n\n\n\n    <ion-content>\n\n        <ion-list>\n\n\n\n            <ion-list-header *ngIf="auth.getEmail()">{{auth.getEmail()}}</ion-list-header>\n\n\n\n            <ion-item (click)="logout()" *ngIf="auth.authenticated">\n\n                <ion-icon name="log-out" item-left></ion-icon>\n\n                Log out\n\n            </ion-item>\n\n\n\n            <ion-item (click)="login()" *ngIf="!auth.authenticated">\n\n                <ion-icon name="log-in" item-left></ion-icon>\n\n                Log in\n\n            </ion-item>\n\n        </ion-list>\n\n\n\n    </ion-content>\n\n\n\n</ion-menu>\n\n\n\n<ion-nav id="nav" [root]="rootPage" #content swipe-back-enabled="false"></ion-nav>'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/app/app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* App */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* Platform */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* MenuController */], __WEBPACK_IMPORTED_MODULE_1__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_5__services_auth_service__["a" /* AuthService */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 55:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__wordpress_list_wordpress_list_page__ = __webpack_require__(189);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__slide_box_slide_box_page__ = __webpack_require__(191);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__google_maps_google_maps_page__ = __webpack_require__(192);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_email_service__ = __webpack_require__(193);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_call_service__ = __webpack_require__(194);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__services_maps_service__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__services_in_app_browser_service__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__home_data__ = __webpack_require__(336);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var HomePage = (function () {
    function HomePage(emailService, callService, mapsService, browserService, nav) {
        this.emailService = emailService;
        this.callService = callService;
        this.mapsService = mapsService;
        this.browserService = browserService;
        this.nav = nav;
        this.initTiles();
    }
    HomePage.prototype.navigateTo = function (tile) {
        this.nav.setRoot(tile.component);
    };
    HomePage.prototype.getDirections = function () {
        this.mapsService.openMapsApp(__WEBPACK_IMPORTED_MODULE_9__home_data__["a" /* data */].officeLocation);
    };
    HomePage.prototype.sendEmail = function () {
        this.emailService.sendEmail(__WEBPACK_IMPORTED_MODULE_9__home_data__["a" /* data */].email);
    };
    HomePage.prototype.openFacebookPage = function () {
        this.browserService.open(__WEBPACK_IMPORTED_MODULE_9__home_data__["a" /* data */].facebook);
    };
    HomePage.prototype.callUs = function () {
        this.callService.call(__WEBPACK_IMPORTED_MODULE_9__home_data__["a" /* data */].phoneNumber);
    };
    HomePage.prototype.initTiles = function () {
        this.tiles = [[{
                    title: 'Wordpress',
                    path: 'wordpress-articles',
                    icon: 'logo-wordpress',
                    component: __WEBPACK_IMPORTED_MODULE_2__wordpress_list_wordpress_list_page__["a" /* WordpressListPage */]
                }, {
                    title: 'Slides',
                    path: 'slides',
                    icon: 'swap',
                    component: __WEBPACK_IMPORTED_MODULE_3__slide_box_slide_box_page__["a" /* SlideBoxPage */]
                }], [{
                    title: 'Map',
                    path: 'map',
                    icon: 'map',
                    component: __WEBPACK_IMPORTED_MODULE_4__google_maps_google_maps_page__["a" /* GoogleMapsPage */]
                }]];
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/home/home.html"*/'<ion-header>\n	<ion-navbar>\n		<button ion-button menuToggle>\n			<ion-icon name="menu"></ion-icon>\n		</button>\n		<ion-title>Supermodular 2</ion-title>\n	</ion-navbar>\n</ion-header>\n\n<ion-content class="getting-started">\n	<div class="home-hello">\n		<img src="http://lorempixel.com/g/640/480/technics" />\n\n		<div class="hello-title" text-wrap>\n			<h1>ABC Corp Inc.</h1>\n			50 Market Street, San Francisco, California 94103, United States\n		</div>\n	</div>\n\n	<ion-row *ngFor="let tilePair of tiles">\n		<ion-col *ngFor="let tile of tilePair">\n			<ion-card class="tile" (click)="navigateTo(tile)">\n				<ion-card-content>\n					<ion-item>\n						<h1><ion-icon [name]="tile.icon"></ion-icon></h1>\n						<h2>{{tile.title}}</h2>\n					</ion-item>\n				</ion-card-content>\n			</ion-card>\n		</ion-col>\n	</ion-row>\n\n	<ion-row>\n		<ion-card class="quick-action" (click)="callUs()">\n			<ion-card-content>\n				<ion-icon name="phone-portrait"></ion-icon>\n				<span>Call us</span>\n			</ion-card-content>\n		</ion-card>\n	</ion-row>\n\n	<ion-row>\n		<ion-card class="quick-action" (click)="sendEmail()">\n			<ion-card-content>\n				<ion-icon name="mail"></ion-icon>\n				<span>Send us and Email</span>\n			</ion-card-content>\n		</ion-card>\n	</ion-row>\n\n	<ion-row>\n		<ion-card class="quick-action" (click)="getDirections()">\n			<ion-card-content>\n				<ion-icon name="compass"></ion-icon>\n				<span>Find us / Get directions</span>\n			</ion-card-content>\n		</ion-card>\n	</ion-row>\n\n	<ion-row>\n		<ion-card class="quick-action" (click)="openFacebookPage()">\n			<ion-card-content>\n				<ion-icon name="logo-facebook"></ion-icon>\n				<span>Visit us on Facebook</span>\n			</ion-card-content>\n		</ion-card>\n	</ion-row>\n\n</ion-content>\n'/*ion-inline-end:"/Users/davidbarrero/Desktop/100/47 Ionic 4 Firebase /Ionic-4-firebase/Ionic-4-firebase/src/pages/home/home.html"*/,
            providers: []
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__services_email_service__["a" /* EmailService */],
            __WEBPACK_IMPORTED_MODULE_6__services_call_service__["a" /* CallService */],
            __WEBPACK_IMPORTED_MODULE_7__services_maps_service__["a" /* MapsService */],
            __WEBPACK_IMPORTED_MODULE_8__services_in_app_browser_service__["a" /* InAppBrowserService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* Nav */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.page.js.map

/***/ }),

/***/ 56:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_auth__ = __webpack_require__(197);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase_app__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_firebase_app__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var AuthService = (function () {
    function AuthService(afAuth) {
        var _this = this;
        this.afAuth = afAuth;
        afAuth.authState.subscribe(function (user) {
            _this.user = user;
        });
    }
    AuthService.prototype.signInWithEmail = function (credentials) {
        console.log('Sign in with email');
        return this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
    };
    AuthService.prototype.signUp = function (credentials) {
        return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
    };
    Object.defineProperty(AuthService.prototype, "authenticated", {
        get: function () {
            return this.user !== null;
        },
        enumerable: true,
        configurable: true
    });
    AuthService.prototype.getEmail = function () {
        return this.user && this.user.email;
    };
    AuthService.prototype.signOut = function () {
        return this.afAuth.auth.signOut();
    };
    AuthService.prototype.signInWithGoogle = function () {
        console.log('Sign in with google');
        return this.oauthSignIn(new __WEBPACK_IMPORTED_MODULE_2_firebase_app__["auth"].GoogleAuthProvider());
    };
    AuthService.prototype.oauthSignIn = function (provider) {
        var _this = this;
        if (!window.cordova) {
            return this.afAuth.auth.signInWithPopup(provider);
        }
        else {
            return this.afAuth.auth.signInWithRedirect(provider)
                .then(function () {
                return _this.afAuth.auth.getRedirectResult().then(function (result) {
                    // This gives you a Google Access Token.
                    // You can use it to access the Google API.
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
                    console.log(token, user);
                }).catch(function (error) {
                    // Handle Errors here.
                    alert(error.message);
                });
            });
        }
    };
    AuthService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_angularfire2_auth__["a" /* AngularFireAuth */]])
    ], AuthService);
    return AuthService;
}());

//# sourceMappingURL=auth.service.js.map

/***/ }),

/***/ 98:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Config; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return firebaseConfig; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var Config = (function () {
    function Config() {
        this.wordpressApiUrl = 'http://demo.titaniumtemplates.com/wordpress/?json=1';
    }
    Config = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])()
    ], Config);
    return Config;
}());

var firebaseConfig = {
    fire: {
        apiKey: 'AIzaSyBBwjIYNbZjQeDzSxNWYjEz6sBXSXJEfts',
        authDomain: 'ionic4firebase-st.firebaseapp.com',
        databaseURL: 'https://ionic4firebase-st.firebaseio.com',
        projectId: 'ionic4firebase-st',
        storageBucket: 'ionic4firebase-st.appspot.com',
        messagingSenderId: '5463921528'
    }
};
//# sourceMappingURL=config.js.map

/***/ })

},[264]);
//# sourceMappingURL=main.js.map