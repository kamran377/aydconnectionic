import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController , ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { NewCertificationPage } from '../new-certification/new-certification';

/**
 * Generated class for the CertificationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-certifications',
  templateUrl: 'certifications.html',
})
export class CertificationsPage {

	token:any;
	certifications:any = [];
  
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public storage:Storage,
		public alertCtrl: AlertController,
		public apiService: ApiServiceProvider,
		public toastCtrl: ToastController,	
	) {
	
	}

	ionViewDidEnter() {
		let me = this;
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		this.storage.get('loggedinuser').then(function (user){
			me.token = user.whoseme_token;
			me.apiService.getCertifications(me.token)
				.then(function(data){
					loading.dismiss();
					let response = JSON.parse(JSON.stringify(data));
					me.certifications = response.data.certifications;
				});
		});
	}
	back() {
		this.navCtrl.pop();
	}
	
	newCertification() {
		this.navCtrl.push(NewCertificationPage);
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad CertificationsPage');
	}
	
	deleteCertificate(id) {
		let toastCtrl = this.toastCtrl;
		let me = this;
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		
		let alert = this.alertCtrl.create({
			title: 'Confirm Delete',
			message: 'Do you really want to delete this certification?',
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
						me.apiService.deleteCertificate(id, me.token)
							.then(function(data){
								loading.dismiss();
								let response = JSON.parse(JSON.stringify(data));
								if(response.status == "success") 
								{
									me.certifications = response.data.certifications;
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

}
