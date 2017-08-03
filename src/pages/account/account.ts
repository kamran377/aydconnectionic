import { Component } from '@angular/core';
import { NavController, NavParams,LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { App } from 'ionic-angular';
import { InfoPage } from '../info/info';
import { AddressPage } from '../address/address';
import { ChangePasswordPage } from '../change-password/change-password';
import { UserSkillsPage } from '../user-skills/user-skills';
import { WorkingDaysPage } from '../working-days/working-days';
import { PaymentMethodsPage } from '../payment-methods/payment-methods';
import { CertificationsPage } from '../certifications/certifications';

/**
 * Generated class for the AccountPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

	user:any;
  constructor(public navCtrl: NavController, 
	public navParams: NavParams,
	private storage:Storage,
	public loadingCtrl: LoadingController,
	public app:App) {
  }

  ionViewDidLoad() {
	let me = this;
	this.storage.get('loggedinuser').then(function (user){
		me.user = user;
		
	});
  }
  
	logout() {
		let storage = this.storage;
		let app = this.app;
		storage.get('loggedinuser').then(function (user){
			storage.remove('loggedinuser').then(function (response) {
				storage.remove('user');
				app.getRootNav().setRoot(HomePage);
			});
		});
	}
	goToPersonalInfo() {
		this.navCtrl.push(InfoPage);
	}
	
	
	goToAddressInfo() {
		this.navCtrl.push(AddressPage);
	}
	
	goToChangePassword() {
		this.navCtrl.push(ChangePasswordPage);
	}
	
	goToUserSkills() {
		this.navCtrl.push(UserSkillsPage);
	}

	goToWorkingDays() {
		this.navCtrl.push(WorkingDaysPage);
	}
	
	goToPaymentMethods() {
		this.navCtrl.push(PaymentMethodsPage);
	}
	
	goToCertifications() {
		this.navCtrl.push(CertificationsPage);
	}
	
	
}
