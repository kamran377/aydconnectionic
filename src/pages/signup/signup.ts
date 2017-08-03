import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import {FormBuilder, Validators,FormGroup} from '@angular/forms';
import {EmailValidator} from '../../validators/email-validator';
import "rxjs/Rx";
import { OneSignal } from '@ionic-native/onesignal';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard';

/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [ApiServiceProvider]
  
})
export class SignupPage {

	
	authForm: FormGroup;  
	submitAttempt:boolean = false;
	formErrors = {
	  'email': [],
	  'password': [],
	  'confirmPassword': [],
	  'firstName': [],
	  'lastName': [],
	  'userType': [],
	};
	validationMessages = {
	  'email': {
		'required':      'Email is required.',
		'invalidEmail':     'Must be a valid email address',
	  },
	  'password': {
		'required':      'Password is required.',
		'minlength':     'Password must be at least 8 characters long.',
		
	  },
	  'confirmPassword': {
		'required':      'Confirm Password is required.',
		'minlength':     'Confirm Password must be at least 8 characters long.',
		'validateEqual' : 'Confirm Password must match the password',
	  },
	  'firstName': {
		'required':      'First Name is required.',
	  },
	  'lastName': {
		'required':      'Last Name is required.',
	  },
	  'userType': {
		'required':      'User Type is required.',
	  },
	}
	
  constructor(public navCtrl: NavController, 
		public navParams: NavParams, 
		public fb: FormBuilder, 
		public apiService: ApiServiceProvider,
		public loadingCtrl: LoadingController, 
		public storage:Storage,
		public alertCtrl: AlertController,
		public oneSignal: OneSignal) {
	  
	this.authForm = fb.group({  
		'email': ['', Validators.compose([Validators.required,EmailValidator.isValid])],
		'password': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
		'confirmPassword':['', Validators.compose([Validators.required, Validators.minLength(8)])],
		'firstName':['',Validators.compose([Validators.required])],
		'lastName':['',Validators.compose([Validators.required])],
		'userType':['',Validators.compose([Validators.required])],
		
	});   
	this.authForm.valueChanges
		.debounceTime(400)
		.subscribe(data => this.onValueChanged(data));
		//.subscribe(data => this.register());
	
  }
  
  
  backToLogin() {
	  this.navCtrl.pop();
  }
  
	register() { 
		this.submitAttempt = true;
		if(this.authForm.valid) {
			let me = this;
			let oneSignal = this.oneSignal;
			let loadingCtrl = this.loadingCtrl;
			let alertCtrl = this.alertCtrl;
			let nav = this.navCtrl;
			let apiService = this.apiService;
			let storage = this.storage;
		
			let loading = loadingCtrl.create({
				content: 'Please wait ...'
			});
			oneSignal.getIds().then(function(ids) {
				let formData = me.authForm.value;
				formData.gcm_id = ids.userId;
				loading.present();
				apiService.signup(formData)
					.then(function(data){
						loading.dismiss();
						let response = JSON.parse(JSON.stringify(data));
						
						if(response.status == "success") {
							let dUser = response.data.user;
							let dUserDetails = response.data.userDetails;
							storage.set('loggedinuser',{
								'whoseme_token' : dUser.whoseme_token,
								'first_name' : dUserDetails.first_name,
								'last_name' : dUserDetails.last_name,
								'social_service' : dUser.social_service,
								'social_service_id' : dUser.social_service_id,
								'gcm_id' : dUser.gcm_id,
								'user_type_id' : dUserDetails.user_type_id,			
							}).then(function (){
								let alert2 = alertCtrl.create({
									title: 'Congratulations!',
									subTitle: "You have successfully signed up for AYD Connect.",
									buttons: ['OK']
								});
								alert2.present();
								nav.setRoot(DashboardPage);
							});
						} else {
							let alert1 = alertCtrl.create({
								title: 'Error!',
								subTitle: response.message,
								buttons: ['OK']
							});
							alert1.present();
							
						}
					}, function(error){
						loading.dismiss();
						alert(error);
					});
			});
			
		} else {
			
			const form = this.authForm;
			for (const field in this.formErrors) {
			// clear previous error message
				this.formErrors[field] = [];
				this.authForm[field] = '';
				const control = form.get(field);
				if (control && (control.dirty || this.submitAttempt) && !control.valid) {
					const messages = this.validationMessages[field];
					for (const key in control.errors) {
						this.formErrors[field].push(messages[key]);
					}
				}
			}
		}
	}

	
	onValueChanged(data?: any) {
		if (!this.authForm) { return; }
		const form = this.authForm;
		for (const field in this.formErrors) {
		// clear previous error message
			this.formErrors[field] = [];
			this.authForm[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field].push(messages[key]);
				}
			}
		}
	}

}
