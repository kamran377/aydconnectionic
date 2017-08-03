import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController ,ModalController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { NewJobPage } from '../new-job/new-job';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { App } from 'ionic-angular';
import { ProjectsFilterPage } from '../projects-filter/projects-filter';
import { UpdateJobPage } from '../update-job/update-job';

/**
 * Generated class for the ProjectsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-projects',
  templateUrl: 'projects.html',
})
export class ProjectsPage {
	user:any;
	token:any;
	jobs:any = [];
	projectType:any;
	filterText:any = [];
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public storage : Storage,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public apiService: ApiServiceProvider,
		public toastCtrl: ToastController,
		public app:App,
		private modalCtrl: ModalController,	
		
	) {
		this.projectType = 1;
		this.filterText[1] = 'Open Jobs';
		this.filterText[2] = 'Jobs in progress';
		this.filterText[3] = 'Completed Jobs';
		this.filterText[4] = 'Archived Jobs';
		this.filterText[10] = 'All Jobs';
		
		
	}
	goToNewProject() { 
		this.navCtrl.push(NewJobPage);
	}
	
	viewJob(id) {
		let me = this;
		this.storage.set('jobID',id).then(function (){
			//me.app.getRootNav().setRoot(HomePage);
		});
		
	}
  
	displayFilter() {
		// reset 
		let me = this;
		let modal = this.modalCtrl.create(ProjectsFilterPage, {'projectType':this.projectType});
		modal.onDidDismiss(data => {
			if(data){
				me.projectType = data;	
				me.loadProjects();
            }  		
		});
		modal.present();
	}
  
	deleteJob(id) {
		let toastCtrl = this.toastCtrl;
		let me = this;
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		
		let alert1 = this.alertCtrl.create({
			title: 'Confirm Delete',
			message: 'Do you really want to delete this job?',
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
						me.apiService.deleteJob(id, me.token)
							.then(function(data){
								loading.dismiss();
								let response = JSON.parse(JSON.stringify(data));
								if(response.status == "success") 
								{
									me.jobs = response.data.jobs;
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
							}, function(error){
								loading.dismiss();
								let toast = toastCtrl.create({
									message: 'An error occurred processing your request, please try again later',
									duration: 3000,
									cssClass: 'toast-error',
									position:'top',
								});
								toast.present();	
							});
					}
				}
			]
		});
		alert1.present();
		
		
	}
  
	ionViewDidEnter() {
		let me = this;
		
		this.storage.get('loggedinuser').then(function (user){
			me.token = user.whoseme_token;
			me.user = user;
			me.loadProjects();
		});
	}

	manageJob(id) {
		let me = this;
		this.storage.set('jobID',id).then(function (){
			me.app.getRootNav().setRoot(UpdateJobPage);
		});
	}
	loadProjects() {
		let me = this;
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		if(this.user.user_type_id == 1) {
			this.apiService.getEmployerJobs(me.token, me.projectType)
			.then(function(data){
				loading.dismiss();
				let response = JSON.parse(JSON.stringify(data));
				me.jobs = response.data.jobs;
			}, function(error){
				loading.dismiss();
				alert(error);
				
			});
		}
		else 
		{
			this.apiService.getTalentJobs(me.token, me.projectType)
			.then(function(data){
				loading.dismiss();
				let response = JSON.parse(JSON.stringify(data));
				me.jobs = response.data.jobs;
			}, function(error){
				loading.dismiss();
				alert(error);
				
			});
		}
	}
	
	ionViewDidLoad() {
		console.log('ionViewDidLoad ProjectsPage');
	}

}
