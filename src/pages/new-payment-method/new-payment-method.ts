import { Component,ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { FormBuilder, Validators,FormGroup} from '@angular/forms';

/**
 * Generated class for the NewPaymentMethodPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var Stripe;
@Component({
  selector: 'page-new-payment-method',
  templateUrl: 'new-payment-method.html',
})
export class NewPaymentMethodPage {

	card:any;
	stripe:any;
	name:any;
	token:any;
	@ViewChild('cardElement') cardElement: ElementRef;
	submitAttempt:boolean = false;
	
	accountType:any;
	bankAccountForm: FormGroup;  
	
	formErrors = {
		'routing_number': [],
		'account_number': [],
		'account_holder_name': [],
		'account_holder_type': [],
	
	};
	validationMessages = {
		'routing_number': {
			'required':      'Routing Number is required.',
		},
		'account_number': {
			'required':      'Account Number is required.',
		},
		'account_holder_name': {
			'required':      'Account Holder Name is required.',
		},
		'account_holder_type': {
			'required':      'Account Holder Type is required.',
		},	  
	}
	
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public storage:Storage,
		public apiService: ApiServiceProvider,
		public toastCtrl: ToastController,
		public fb: FormBuilder, 	  
				
		
	) {
		this.stripe = Stripe('pk_test_TwOqOrTEg8vkBuE1RX7PIL7s');
		this.bankAccountForm = fb.group({  
			'routing_number': ['', Validators.compose([Validators.required])],
			'account_number': ['', Validators.compose([Validators.required])],
			'account_holder_name': ['', Validators.compose([Validators.required])],
			'account_holder_type': ['', Validators.compose([Validators.required])],
		});
		//let storage = this.storage;
		this.bankAccountForm.valueChanges
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
	
	ionSelect() {
		
		if(this.accountType == 'card') {
			let elements = this.stripe.elements();
			this.card = elements.create('card', {
				style: {
					base: {
					  iconColor: '#fff',
					  color: '#fff',
					  lineHeight: '40px',
					  
					  '::placeholder': {
						color: '#fff',
					  },
					},
				}
			});
			let me = this;
			setTimeout(function(){me.card.mount(me.cardElement.nativeElement)},1000);
		}
		
	}
	
	onValueChanged(data?: any) {
		if (!this.bankAccountForm) { return; }
		const form = this.bankAccountForm;
		for (const field in this.formErrors) {
		// clear previous error message
			this.formErrors[field] = [];
			this.bankAccountForm[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field].push(messages[key]);
				}
			}
		}
	}
	submitAccountInfo() {
		this.submitAttempt = true;
		if(this.bankAccountForm.valid) {
			let me = this;
			let loadingCtrl = this.loadingCtrl;
			let loading = loadingCtrl.create({
				content: 'Please wait ...'
			});
			let toastCtrl = this.toastCtrl;
			loading.present();
			let formData = me.bankAccountForm.value;
			formData.country = "us";
			formData.currency = "usd";
			me.stripe.createToken('bank_account', formData)
			.then(function(result) {
			  // handle result.error or result.token
				loading.dismiss();
				if(result.error != null) {
					
					let toast = toastCtrl.create({
					  message: result.error.message,
					  duration: 3000,
					  cssClass: 'toast-error',
					  position:'top',
					});
					toast.present();
				} else {
					let stripeToken = result.token;
					me.apiService.savePaymentMethod(stripeToken.id, me.token)
						.then(function(data){
							//loading.dismiss();
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
								me.navCtrl.pop();
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
						
				}
				
			}, function(error){
				loading.dismiss();
				alert(error);
			});
		} else {	
			const form = this.bankAccountForm;
			for (const field in this.formErrors) {
			// clear previous error message
				this.formErrors[field] = [];
				this.bankAccountForm[field] = '';
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
	submitInfo() {
		
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		let toastCtrl = this.toastCtrl;
		loading.present();
		let me = this;
		this.stripe.createToken(this.card).then(function(result) {
		  // handle result.error or result.token
			loading.dismiss();
			if(result.error != null) {
				
				let toast = toastCtrl.create({
				  message: result.error.message,
				  duration: 3000,
				  cssClass: 'toast-error',
				  position:'top',
				});
				toast.present();
			} else {
				let stripeToken = result.token;
				me.apiService.savePaymentMethod(stripeToken.id, me.token)
					.then(function(data){
						//loading.dismiss();
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
							me.navCtrl.pop();
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
					
			}
			
		});
	}

}
