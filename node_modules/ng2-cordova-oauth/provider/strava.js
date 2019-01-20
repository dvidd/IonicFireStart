"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var provider_1 = require("../provider");
var Strava = (function (_super) {
    __extends(Strava, _super);
    function Strava() {
        _super.apply(this, arguments);
        this.authUrl = 'https://www.strava.com/oauth/authorize';
        this.defaults = {
            responseType: 'code'
        };
    }
    return Strava;
}(provider_1.OAuthProvider));
exports.Strava = Strava;
