import { Component } from '@angular/core';
import { ViewController, NavController, NavParams, LoadingController  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

	userId:any;
	user_type_id:any;
	token:any;
	verificationData:any;
	user:any;
	userDetails:any;
	userCertifications:any = [];
	userWorkingDays:any = [];
	userSkills:any = [];
	
	
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public loadingCtrl: LoadingController, 	  
		public apiService: ApiServiceProvider,
		public storage: Storage,
		public viewCtrl: ViewController, 
	) {
		this.userId = this.navParams.get('id');
		this.user_type_id = this.navParams.get('user_type_id');
		
	}

	ionViewDidEnter() {
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		let me = this;
		this.storage.get('loggedinuser').then(function (user){
			
			me.token = user.whoseme_token;
			me.apiService.getUserProfileData(me.token, me.userId)
			.then(function(data){
				loading.dismiss();
				let response = JSON.parse(JSON.stringify(data));
				if(response.status == "success") {
					
					me.user = response.data.user;
					me.userDetails = response.data.userDetails;
					me.verificationData = response.data.verificationData;
					me.userCertifications = response.data.userCertifications;
					me.userSkills = response.data.userSkills.split(",");
					me.userWorkingDays = response.data.userWorkingDays.split(",");
					console.log(me.userCertifications);
				}
			}, function(error){
				alert(error);
				loading.dismiss();
				
			});
		});		
	}
	cancel(){
		this.viewCtrl.dismiss();
	}

}
