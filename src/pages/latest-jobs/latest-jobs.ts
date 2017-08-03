import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { ModalListPage } from '../modal-list/modal-list';

/**
 * Generated class for the LatestJobsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-latest-jobs',
  templateUrl: 'latest-jobs.html',
})
export class LatestJobsPage {

	jobs:any = [];
	user:any;
	token:any;
	query:any;
	skills:any = [];
	skill:any;
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public modalCtrl: ModalController,
		public storage : Storage,
		public apiService: ApiServiceProvider,
	) {
  
	}

	ionViewDidEnter() {
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		let me = this;
		
		this.storage.get('loggedinuser').then(function (user){
			me.token = user.whoseme_token;
			me.user = user;
			me.apiService.recommendedJobs(me.token, 0,"")
			.then(function(data){
				loading.dismiss();
				let response = JSON.parse(JSON.stringify(data));
				me.jobs = response.data.jobs;
			}, function(error){
				loading.dismiss();
				alert(error);
				
			});
		});
	}
	
	updateSearch() {
		if (this.query == '') {
			this.skills = [];
			return;
		}
		let me = this;
		this.apiService.getSkillsAutoComplete(this.query)
		.then(function(data){
			me.skills = []; 
			let response = JSON.parse(JSON.stringify(data));
			me.skills = response.data.skills;
			let modal = me.modalCtrl.create(ModalListPage, { 'skills': me.skills });
			modal.onDidDismiss(data => {
				if(data){
					me.skill = data;
					me.query = me.skill.name;
					let loading = this.loadingCtrl.create({
						content: 'Please wait ...'
					});
					loading.present();
		
					me.apiService.recommendedJobs(me.token, 0, me.query)
					.then(function(data){
						loading.dismiss();
						let response = JSON.parse(JSON.stringify(data));
						me.jobs = response.data.jobs;
					}, function(error){
						loading.dismiss();
						alert(error);
						
					});
				}  		
			});
			modal.present();
		});
	}
	
	doInfinite(infiniteScroll) {
		console.log('Begin async operation');
		let offset = 1; //this.jobs.length;
		let me = this;
		me.apiService.recommendedJobs(me.token, offset, me.query)
		.then(function(data){
			let response = JSON.parse(JSON.stringify(data));
			if(response.data.jobs) {
				me.jobs = me.jobs.concat(response.data.jobs);
			}
			console.log('Async operation has ended');
			infiniteScroll.complete();
		}, function(error){
			alert(error);
			infiniteScroll.complete();
		});
		
	}

}
