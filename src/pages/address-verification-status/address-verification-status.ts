import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the AddressVerificationStatusPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-address-verification-status',
  templateUrl: 'address-verification-status.html',
})
export class AddressVerificationStatusPage {

	addressVerificationRequest:any;
	placedetails:any;
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController, 
	) {
		this.placedetails = this.navParams.get('placedetails');
		this.addressVerificationRequest = this.navParams.get('addressVerificationRequest');
		
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
