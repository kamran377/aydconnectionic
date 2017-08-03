import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController   } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { FormBuilder,FormGroup} from '@angular/forms';

/**
 * Generated class for the UserSkillsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-skills',
  templateUrl: 'user-skills.html',
})
export class UserSkillsPage {

	token:any;
	skills:any[];
	userSkills:any[];
	skillsForm: FormGroup;  
	fbargs:any;
	
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public storage:Storage,
		public loadingCtrl: LoadingController, 	  
		public apiService: ApiServiceProvider,
		public fb: FormBuilder, 	  
		public toastCtrl: ToastController,
		
	) {
		this.fbargs = {};
		//
	}

	ionViewDidLoad() {
		let me = this;
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
			
		loading.present();
		this.storage.get('loggedinuser').then(function (user){
			me.token = user.whoseme_token;
			me.apiService.getSkills(me.token).then(function(data){
				loading.dismiss();
				let response = JSON.parse(JSON.stringify(data));
				
				if(response.status == "success") {
					me.skills = response.data.skills;
					me.userSkills = response.data.userSkills;
					me.skills.forEach(skill => me.fbargs[skill.id] = [false,[]]);
					me.skillsForm = me.fb.group(me.fbargs);
					me.userSkills.forEach(skillid => me.skillsForm.get("" + skillid + "").setValue(true));
					
				}
			});
		});
	}
	
	back() {
		this.navCtrl.pop();
	}
	
	submitInfo() {
		this.userSkills = [];
		for(var i=0; i<this.skills.length; i++) {
			if(this.skillsForm.get("" + this.skills[i].id + "").value) {
				this.userSkills.push(this.skills[i].id);
			}
		}
		let loadingCtrl = this.loadingCtrl;
		let toastCtrl = this.toastCtrl;
		let loading = loadingCtrl.create({
			content: 'Please wait ...'
		});
		
		loading.present();
		this.apiService.saveUserSkills(this.userSkills, this.token)
			.then(function(data){
				loading.dismiss();
				
				let response = JSON.parse(JSON.stringify(data));
				if(response.status == "success") 
				{
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
				alert(error);
			});
	}

}
