import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

	loginForm: FormGroup;
	loginError: string;
	pageCtrl: string;
	forgotPasswordForm: FormGroup;
	signUpForm: FormGroup;
	signUpError: string;

	constructor(
		public fb: FormBuilder,
		public translate: TranslateService
		) {
		this.pageCtrl = '';
		this.loginForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});
		this.forgotPasswordForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])]
		});
		this.signUpForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});
	}

  	login() {
		let data = this.loginForm.value;
		if (!data.email) {
			return;
		}
		let credentials = {
			email: data.email,
			password: data.password
		};
		/*this.auth.signInWithEmail(credentials)
			.then(
				() => {
					this.afDatabase.database.goOnline();
					this.navCtrl.setRoot(HomePage);
				},
				error => this.loginError = error.message
			);
		*/
  	} 

  	goToSignUp(){
		this.pageCtrl = 'signUp';
	}

	signUp() {
		let data = this.signUpForm.value;
		let credentials = {
			email: data.email,
			password: data.password
		};
		/*this.auth.signUp(credentials).then(user =>  {console.log('done');this.db.createUser(user.user.uid, user.user.email)}).then(
			() => this.pageCtrl = '',
			error => this.signUpError = error.message
		);
		*/
  	}
	
	goToForgotPassword() {
		this.pageCtrl = 'forgotPassword';
	}

	resetPassword() {
		let email = this.forgotPasswordForm.value.email;
		if (!email) {
			return;
		}
		/*
		this.auth.sendPasswordResetEmail(email)
			.then(
				() => this.navCtrl.setRoot(LoginPage)
				);
		*/
	}
}