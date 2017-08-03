import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import { DashboardPage } from '../dashboard/dashboard';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { AlertController } from 'ionic-angular';
import { UserModel} from '../../models/user-model';
import { Facebook } from '@ionic-native/facebook';
import { SignupPage } from '../signup/signup';
import { OneSignal } from '@ionic-native/onesignal';
import { FormBuilder, Validators,FormGroup} from '@angular/forms';
import { EmailValidator} from '../../validators/email-validator';
import "rxjs/Rx";
import { Auth, User } from '@ionic/cloud-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApiServiceProvider]
})
export class HomePage {
	
	 FB_APP_ID: number = 237004110135574;

	loginForm: FormGroup;  
	submitAttempt:boolean = false;
	formErrors = {
	  'email': [],
	  'password': [],
	};
	validationMessages = {
	  'email': {
		'required':      'Email is required.',
		'invalidEmail':     'Must be a valid email address',
	  },
	  'password': {
		'required':      'Password is required.',
		
	  },
	  
	}
  constructor(public navCtrl: NavController, 
	  public loadingCtrl: LoadingController, 
	  public storage:Storage,
	  public fb: FormBuilder, 
	  public googlePlus: GooglePlus,
	  public facebook: Facebook,
	  public apiService: ApiServiceProvider,
	  public device: Device,
	  public oneSignal: OneSignal,
	  public toastCtrl: ToastController,
	  public auth: Auth, 
	  public cloudUser: User,
	  public alertCtrl: AlertController) {
	
		this.facebook.browserInit(this.FB_APP_ID, "v2.8");
		this.loginForm = fb.group({  
			'email': ['', Validators.compose([Validators.required,EmailValidator.isValid])],
			'password': ['', Validators.compose([Validators.required])],
		});
		this.loginForm.valueChanges
		//.debounceTime(400)
		.subscribe(data => this.onValueChanged(data));
  }
  
  ionViewDidLoad() {
		/*let storage = this.storage;
		let nav = this.navCtrl;
		storage.get('loggedinuser').then(function (user){
			//
			if(user == null) {
				alert("No user");
			} else {
				alert(user.social_service);
				nav.setRoot(DashboardPage);
			}
			
		});*/
  }
  
	linkedinLogin() {
		let me = this;
		let storage = this.storage;
		let oneSignal = this.oneSignal;
		//let scopes :LinkedInLoginScopes[] = ['r_basicprofile', 'r_emailaddress'];
		this.auth.login('linkedin').then(  
			function(data) {
				console.log(data);
				console.log(me.cloudUser.social.linkedin.data.raw_data);
				let linkedinUser = me.cloudUser.social.linkedin.data.raw_data;
				
				let id = linkedinUser['id'];
				let firstName = linkedinUser['firstName'];
				let lastName = linkedinUser['lastName'];
				let email = linkedinUser['emailAddress'];
				oneSignal.getIds().then(function(ids) {
					let device_id = ids.userId;
					let user1 = new UserModel(id, firstName, lastName,email,"Linkedin",device_id,'',"2");				
					user1.imageUrl = linkedinUser['pictureUrl'];
					storage.set('user',user1).then(function (){
						//prompt1.present();
						me.handleLogin(user1);
					});
				});
				
				
			},
			function(error) {
				alert(error);
			}
		);
	}
  
    handleLogin(user) {
		let toastCtrl = this.toastCtrl;
		let loadingCtrl = this.loadingCtrl;
		let alertCtrl = this.alertCtrl;
		let apiService = this.apiService;
		let storage = this.storage;
		let nav = this.navCtrl;
		
		
		let loading = loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		this.apiService.socialLogin(user)
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
					let toast = toastCtrl.create({
						message: "You have logged in successfully",
						duration: 3000,
						cssClass: 'toast-success',
						position:'top',
					});
					toast.present();
					nav.setRoot(DashboardPage);
				});
			} else {
				loading.dismiss();
				prompt1.present();
				
			}
		}, function(error){
			loading.dismiss();
			let toast = toastCtrl.create({
				message: JSON.stringify(error),
				duration: 3000,
				cssClass: 'toast-error',
				position:'top',
			});
			toast.present();
		});
		
		let prompt1 = alertCtrl.create({
			title: 'Almost there!',
			message: "You want to join as",
			inputs: [
				{
					type: "radio",
					label: "Talent",
					value:"2"
				},
				{
					type: "radio",
					label: "Employer",
					value:"1"
				},
			],
			buttons: [
				{
					text: 'Cancel',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Login',
					handler: data => {
						let usertype = data;
						storage.get('user')
						.then(function (user1){
							let user2 = <UserModel> user1;
							user2.user_type_id = usertype;				
							let loading1 = loadingCtrl.create({
								content: 'Please wait ...'
							});
							console.log(user2);
							loading1.present();
							apiService.socialLogin(user2)
							.then(function(data){
								loading1.dismiss();
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
										let toast = toastCtrl.create({
											message: "Loggedin Successfully",
											duration: 3000,
											cssClass: 'toast-success',
											position:'top',
										});
										toast.present();
										nav.setRoot(DashboardPage);
									});
								} else {
									loading1.dismiss();
									let toast = toastCtrl.create({
										message: response.message,
										duration: 3000,
										cssClass: 'toast-error',
										position:'top',
									});
									toast.present();
									
									
								}		
							}, function(error){
								loading1.dismiss();
								let toast = toastCtrl.create({
									message: JSON.stringify(error),
									duration: 3000,
									cssClass: 'toast-error',
									position:'top',
								});
								toast.present();
							});
				
						}, function(error){
							let toast = toastCtrl.create({
								message: JSON.stringify(error),
								duration: 3000,
								cssClass: 'toast-error',
								position:'top',
							});
							toast.present();
						});
					}
				}
			]
		});
	}
	facebokLogin() {
		let permissions = new Array<string>();
		let storage = this.storage;
		let loadingCtrl = this.loadingCtrl;
		let facebook = this.facebook;
		permissions = ["public_profile","email"];
		let toastCtrl  = this.toastCtrl;
		
		let loading = loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		let oneSignal = this.oneSignal;
		let me = this;
		oneSignal.getIds().then(function(ids) {
			let device_id = ids.userId;
			facebook.login(permissions)
			.then(function(response){
				
				//let userId = response.authResponse.userID;
				let params = new Array<string>();
				//Getting name and gender properties
				facebook.api("/me?fields=id,name,link,email,verified,first_name,last_name", params)
				.then(function(user){
					loading.dismiss();
					let user1 = new UserModel(user.id, user.first_name,user.last_name,user.email,"Facebook",device_id,'',"2");
					user1.imageUrl = "https://graph.facebook.com/" + user1.social_service_id + "/picture?type=large";
					
					storage.set('user',user1).then(function (){
						me.handleLogin(user1);
					});
				}, function (error) {
					loading.dismiss();
					let toast = toastCtrl.create({
						message: JSON.stringify(error),
						duration: 3000,
						cssClass: 'toast-error',
						position:'top',
					});
					toast.present();
				})
			}, function(error){
				loading.dismiss();
				let toast = toastCtrl.create({
					message: JSON.stringify(error),
					duration: 3000,
					cssClass: 'toast-error',
					position:'top',
				});
				toast.present();
			});
		});
		
		
  }
  
	googleLogin(){
 
		let storage = this.storage;
		let loadingCtrl = this.loadingCtrl;
		let toastCtrl = this.toastCtrl;
		let loading = loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();

		
		let oneSignal = this.oneSignal;
		let me = this;
		this.googlePlus.login({
			'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
			'webClientId': '994841299241-laannr4fu4t08rn1esve3u0d4kt0am26.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
			'offline': false
		})
		.then(function (user) {	
			loading.dismiss();
			
			oneSignal.getIds().then(function(ids) {
				let device_id = ids.userId;
				let fname = user.displayName;
				let lname = '';
				if (user.displayName.match(/\s/g)){
					var array = user.displayName.split(" ");
					fname = array[0];
					lname = array[1];
				}
				
				let user1 = new UserModel(user.userId, fname,lname,user.email,"Google",device_id,'',"2");
				user1.imageUrl = user.imageUrl;
				storage.set('user',user1).then(function (){
					me.handleLogin(user1);
				});
			});
			
							
		}, function (error) {
			loading.dismiss();
			let toast = toastCtrl.create({
				message: JSON.stringify(error),
				duration: 3000,
				cssClass: 'toast-error',
				position:'top',
			});
			toast.present();
		});
		
	}
 
	login() {
		this.submitAttempt = true;
		if(this.loginForm.valid) {
			let formData = this.loginForm.value;
			let loadingCtrl = this.loadingCtrl;
			
			let loading = loadingCtrl.create({
				content: 'Please wait ...'
			});
			loading.present();
			let nav = this.navCtrl;
			let apiService = this.apiService;
			let storage = this.storage;
			let toastCtrl = this.toastCtrl;
			apiService.login(formData)
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
							let toast = toastCtrl.create({
							  message: "You have successfully logged in",
							  duration: 3000,
							  cssClass: 'toast-success',
							  position:'top',
							});
							toast.present();			
							nav.setRoot(DashboardPage);
						});
					} else {
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
			const form = this.loginForm;
			for (const field in this.formErrors) {
			// clear previous error message
				this.formErrors[field] = [];
				this.loginForm[field] = '';
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
		if (!this.loginForm) { return; }
		const form = this.loginForm;
		for (const field in this.formErrors) {
		// clear previous error message
			this.formErrors[field] = [];
			this.loginForm[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field].push(messages[key]);
				}
			}
		}
	}
 
    signup(){
		this.navCtrl.push(SignupPage);
    }
	
	

}
