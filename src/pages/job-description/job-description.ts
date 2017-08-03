import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { App } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';

/**
 * Generated class for the JobDescriptionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-job-description',
  templateUrl: 'job-description.html',
})
export class JobDescriptionPage {

	jobID:any;
	job:any;
	token:any;
	user:any;
	
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public storage : Storage,
		public loadingCtrl: LoadingController,
		public apiService: ApiServiceProvider,
		public toastCtrl: ToastController,
		public app:App,
		
		
	) {
		
	}

	back() {
		this.app.getRootNav().setRoot(DashboardPage);
	}
	ionViewDidEnter() {
		
		let me = this;
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		this.storage.get('loggedinuser').then(function (user){
			me.token = user.whoseme_token;
			me.storage.get('jobID')
			.then(function (jobId){
				me.jobID = jobId;
				me.apiService.getJobDetails(me.token, me.jobID)
				.then(function(data){
					loading.dismiss();
					let response = JSON.parse(JSON.stringify(data));
					me.job = response.data.job;
				}, function(error){
					alert(error);
					loading.dismiss();
				});
			});
				
		});
			
	}

}
