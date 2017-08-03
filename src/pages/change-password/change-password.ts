import { Component } from '@angular/core';
import {  NavController, NavParams, ToastController,LoadingController  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { FormBuilder, Validators,FormGroup} from '@angular/forms';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

	passwordForm: FormGroup;  
	submitAttempt:boolean = false;
	token:any;
	formErrors = {
	  'oldPassword': [],
	  'newPassword': [],
	  'repeatPassword': [],

	};
	validationMessages = {
	  
	  'oldPassword': {
		'required':      'Current Password is required.',
		'minlength':     'Current Password must be at least 8 characters long.',
		
	  },
	  'newPassword': {
		'required':      'New Password is required.',
		'minlength':     'New Password must be at least 8 characters long.',
		
	  },
	  'repeatPassword': {
		'required':      'Repeat Password is required.',
		'minlength':     'Repeat Password must be at least 8 characters long.',
		'validateEqual' : 'Repeat Password must match the new password',
	  },
	  
	}

	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public fb: FormBuilder, 
		public apiService: ApiServiceProvider,
		public loadingCtrl: LoadingController, 
		public storage:Storage,
		public toastCtrl: ToastController,
	) {
		this.passwordForm = fb.group({  
			'oldPassword': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
			'newPassword': ['', Validators.compose([Validators.required, Validators.minLength(8)])],
			'repeatPassword':['', Validators.compose([Validators.required, Validators.minLength(8)])],
		
		});   
		this.passwordForm.valueChanges
			//.debounceTime(400)
			.subscribe(data => this.onValueChanged(data));
	}

	ionViewDidLoad() {
		let me = this;
		this.storage.get('loggedinuser').then(function (user){
			me.token = user.whoseme_token;
		});
	}
	
	back() {
		this.navCtrl.pop();
	}
	
	submitInfo() {
		this.submitAttempt = true;
		let me = this;
		if(this.passwordForm.valid) {
			let loadingCtrl = this.loadingCtrl;
			let apiService = this.apiService;
			let toastCtrl = this.toastCtrl;
			
			let loading = loadingCtrl.create({
				content: 'Please wait ...'
			});
			
			loading.present();
			let formData = me.passwordForm.value;
			let token = me.token;
			apiService.changePassword(formData, token)
				.then(function(data){
					loading.dismiss();
					let response = JSON.parse(JSON.stringify(data));
					if(response.status == "success") 
					{
						let toast = toastCtrl.create({
						  message: response.message,
						  duration: 3000,
						  cssClass: 'toast-success',
						  position:'top',
						});
						toast.present();	
					} 
					else 
					{
						let toast = toastCtrl.create({
						  message: response.message,
						  duration: 3000,
						  cssClass: 'toast-error',
						  position:'top',
						});
						toast.present();
						
					}
				}, function(error){
					loading.dismiss();
					alert(error);
				});
			
		} else {
			const form = this.passwordForm;
			for (const field in this.formErrors) {
			// clear previous error message
				this.formErrors[field] = [];
				this.passwordForm[field] = '';
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
		if (!this.passwordForm) { return; }
		const form = this.passwordForm;
		for (const field in this.formErrors) {
		// clear previous error message
			this.formErrors[field] = [];
			this.passwordForm[field] = '';
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
