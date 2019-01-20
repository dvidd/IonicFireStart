import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	public wordpressApiUrl = 'http://demo.titaniumtemplates.com/wordpress/?json=1';
}

export const firebaseConfig = {
	fire: {
		apiKey: "AIzaSyDW6woVw3gDQVvKtreZ4g9igRW92knq4Sg",
		authDomain: "supermodular-c9b81.firebaseapp.com",
		databaseURL: "https://supermodular-c9b81.firebaseio.com",
		projectId: "supermodular-c9b81",
		storageBucket: "supermodular-c9b81.appspot.com",
		messagingSenderId: "374150420031"
	}
};
