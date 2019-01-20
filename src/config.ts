import { Injectable } from '@angular/core';

@Injectable()
export class Config {
	public wordpressApiUrl = 'http://demo.titaniumtemplates.com/wordpress/?json=1';
}

export const firebaseConfig = {
	fire: {
		apiKey: 'AIzaSyBBwjIYNbZjQeDzSxNWYjEz6sBXSXJEfts',
		authDomain: 'ionic4firebase-st.firebaseapp.com',
		databaseURL: 'https://ionic4firebase-st.firebaseio.com',
		projectId: 'ionic4firebase-st',
		storageBucket: 'ionic4firebase-st.appspot.com',
		messagingSenderId: '5463921528'
	}
};
