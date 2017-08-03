import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { App } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';

/**
 * Generated class for the JobBidsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-job-bids',
  templateUrl: 'job-bids.html',
})
export class JobBidsPage {

	user:any;
	token:any;
	bids:any = [];
	jobID:any;
	job:any;
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public storage : Storage,
		public loadingCtrl: LoadingController,
		public apiService: ApiServiceProvider,
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
				loading.dismiss();
				me.apiService.getJobBidsDetails(me.token, me.jobID)
				.then(function(data){
					loading.dismiss();
					let response = JSON.parse(JSON.stringify(data));
					me.bids = response.data.bids;
					me.job = response.data.job;
					console.log(me.bids);
				}, function(error){
					alert(error);
					loading.dismiss();
				});
			});
				/**/
		});
			
	}

}
