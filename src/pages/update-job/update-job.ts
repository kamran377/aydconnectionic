import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { App } from 'ionic-angular';
import { JobDescriptionPage} from '../job-description/job-description';
import { JobBidsPage} from '../job-bids/job-bids';
import { JobFilesPage } from '../job-files/job-files';


/**
 * Generated class for the UpdateJobPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-update-job',
  templateUrl: 'update-job.html',
})
export class UpdateJobPage {

	token:any;
	jobId:any;
	
	tab1Title = "Description";
	tab2Title = "Applicants";
	tab3Title = "Files";
	
	tab1Root = JobDescriptionPage;
	tab2Root = JobBidsPage;
	tab3Root = JobFilesPage;
	
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public storage : Storage,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public apiService: ApiServiceProvider,
		public toastCtrl: ToastController,
		public app:App	
	) {
		
	}

	ionViewDidEnter() {
		/*let me = this;
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		this.storage.get('loggedinuser').then(function (user){
			me.token = user.whoseme_token;
			me.storage.get('jobID').then(function (jobID){
				me.apiService.getEmployerJobs(me.token)
				.then(function(data){
					loading.dismiss();
					let response = JSON.parse(JSON.stringify(data));
					me.job = response.data.job;
				});
			});
			
		});*/
	}

}
