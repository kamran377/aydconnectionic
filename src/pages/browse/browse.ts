import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import { SafeResourceUrl, DomSanitizer} from '@angular/platform-browser'; 
import { ProfilePage } from '../profile/profile';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { LatestJobsPage } from '../latest-jobs/latest-jobs';
import { SearchTalentPage } from '../search-talent/search-talent';
import { ViewJobPage } from '../view-job/view-job';

/**
 * Generated class for the BrowsePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-browse',
  templateUrl: 'browse.html',
})
export class BrowsePage {


	mapUrl: SafeResourceUrl;
	type:any= 'map';
	loading:any;
	jobs:any = [];
	user:any;
	token:any;
	constructor(public navCtrl: NavController,
		public domSanitizer: DomSanitizer,
		public navParams: NavParams,
		public modalCtrl: ModalController,
		public loadingCtrl: LoadingController,
		public storage : Storage,
		public apiService: ApiServiceProvider,
		
		
	) {
		this.mapUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('http://www.api.aydconnect.com/site/map');
		
	}

	iframeLoad() {
		
		let iframe =  (<HTMLIFrameElement>document.getElementById("mapFrame"));//.documentWindow;
		var doc = iframe.contentDocument || iframe.contentWindow.document;
    
		doc.addEventListener("click", (event) => { 
			let target = (<HTMLButtonElement>event.target);
			if (this.hasClass(target, "profileButton")) {
				let id = target.getAttribute('data-id');
				let user_type_id = target.getAttribute('data-user-type');
				let modal = this.modalCtrl.create(ProfilePage, {
					'id': id,
					'user_type_id' : user_type_id
				});
				
				modal.present();
			}
			
		});
		
	}
	
	goToLatestJobsPage() {
		this.navCtrl.push(LatestJobsPage);
	}
	
	goToSearchTalentPage() {
		this.navCtrl.push(SearchTalentPage);
	}
	
	viewJob(jobId) {
		
		this.navCtrl.push(ViewJobPage ,{'jobId':jobId});
	}
	
	hasClass(el, cls) {
		return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
	}
	ionViewDidEnter() {
		
		let me = this;
		
		this.storage.get('loggedinuser').then(function (user){
			me.token = user.whoseme_token;
			me.user = user;
		});
	}
  
	segmentSelect(segment) {
		let me = this;
		this.loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		this.loading.present();
		if(segment == 'search') {
			if(this.user.user_type_id == 2) {
				me.apiService.recommendedJobs(me.token,0, "")
				.then(function(data){
					me.loading.dismiss();
					let response = JSON.parse(JSON.stringify(data));
					me.jobs = response.data.jobs;
				}, function(error){
					me.loading.dismiss();
					alert(error);
					
				});
			} else {
				this.loading.dismiss();
			}
			
		}
	}
	
	ionSelect() {
		alert(this.type);
	}

}
