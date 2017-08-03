import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { App } from 'ionic-angular';

/**
 * Generated class for the ViewJobPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-view-job',
  templateUrl: 'view-job.html',
})
export class ViewJobPage {

	jobId:any;
	job:any;
	token:any;
	user:any;
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public storage : Storage,
		public loadingCtrl: LoadingController,
		public apiService: ApiServiceProvider,
		public toastCtrl: ToastController,
	) {
		this.jobId = this.navParams.get('jobId');
		
	}

	ionViewDidEnter() {
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		let me = this;
		this.storage.get('loggedinuser').then(function (user){
			
			me.token = user.whoseme_token;
			me.apiService.getJobDetails(me.token, me.jobId)
			.then(function(data){
				loading.dismiss();
				let response = JSON.parse(JSON.stringify(data));
				if(response.status == "success") {
					me.job = response.data.job;
				}
			}, function(error){
				alert(error);
				loading.dismiss();
				
			});
		});		
	}

}
