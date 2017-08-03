import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { NewPaymentMethodPage } from '../new-payment-method/new-payment-method';

/**
 * Generated class for the PaymentMethodsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-payment-methods',
  templateUrl: 'payment-methods.html',
})
export class PaymentMethodsPage {

	paymentMethods:any = [];
	token:any;
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public storage:Storage,
		public alertCtrl: AlertController,
		public apiService: ApiServiceProvider,
		public toastCtrl: ToastController,	
	) {
		
	}

	deleteMethod(id) {
		let toastCtrl = this.toastCtrl;
		let me = this;
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		
		let alert = this.alertCtrl.create({
			title: 'Confirm Delete',
			message: 'Do you really want to delete this payment method?',
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Delete',
					handler: () => {
						loading.present();
						me.apiService.deletePaymentMethods(id, me.token)
							.then(function(data){
								loading.dismiss();
								let response = JSON.parse(JSON.stringify(data));
								if(response.status == "success") 
								{
									me.paymentMethods = response.data.paymentMethods;
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
							});
					}
				}
			]
		});
		alert.present();
		
		
	}
	ionViewDidEnter() {
		let me = this;
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		this.storage.get('loggedinuser').then(function (user){
			me.token = user.whoseme_token;
			me.apiService.getPaymetMethods(me.token)
				.then(function(data){
					loading.dismiss();
					let response = JSON.parse(JSON.stringify(data));
					me.paymentMethods = response.data.paymentMethods;
				});
		});
	}
	back() {
		this.navCtrl.pop();
	}
	ionViewDidLoad() {
		
	}
	newPayment() {
		this.navCtrl.push(NewPaymentMethodPage);
	}

}
