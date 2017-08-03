import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AddressVerificationStatusPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-identity-verification-status',
  templateUrl: 'identity-verification-status.html',
})
export class IdentityVerificationStatusPage {

	identityVerificationRequest:any;
	userDetails:any;
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController, 
	) {
		this.userDetails = this.navParams.get('userDetails');
		this.identityVerificationRequest = this.navParams.get('identityVerificationRequest');
	}

	back() {
		this.viewCtrl.dismiss(false);
	}
	
	resendRequest() {
		this.viewCtrl.dismiss(true);
		
	}
	
	
	ionViewDidLoad() {
		console.log('ionViewDidLoad AddressVerificationStatusPage');
	}

}
