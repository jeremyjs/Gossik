import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

	user: firebase.User;
	
  constructor(
  	public afAuth: AngularFireAuth,
  	) { 
  		afAuth.authState.subscribe(user => {
			this.user = user;
		});
  	}

  	signInWithEmail(credentials) {
  		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
			 credentials.password);
	}

	signUp(credentials) {
		return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
	}

	signOut(): Promise<void> {
		return this.afAuth.auth.signOut();
	}

	sendPasswordResetEmail(email: string) {
		return this.afAuth.auth.sendPasswordResetEmail(email);
	}


	get checkLoggedIn() {
		return this.user !== null;
	}

	get userid() {
		return this.user.uid;
	}
}
