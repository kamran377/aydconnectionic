import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController   } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { FormBuilder ,FormGroup} from '@angular/forms';

/**
 * Generated class for the WorkingDaysPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-working-days',
  templateUrl: 'working-days.html',
})
export class WorkingDaysPage {

	token:any;
	days:any[];
	userWorkingDays:any[];
	daysForm: FormGroup;  
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
			me.apiService.getDays(me.token).then(function(data){
				loading.dismiss();
				let response = JSON.parse(JSON.stringify(data));
				
				if(response.status == "success") {
					me.days = response.data.days;
					me.userWorkingDays = response.data.userWorkingDays;
					me.days.forEach(day => me.fbargs[day.id] = [false,[]]);
					me.daysForm = me.fb.group(me.fbargs);
					me.userWorkingDays.forEach(dayid => me.daysForm.get("" + dayid + "").setValue(true));
					
				}
			});
		});
	}
	
	back() {
		this.navCtrl.pop();
	}
	
	submitInfo() {
		this.userWorkingDays = [];
		for(var i=0; i<this.days.length; i++) {
			if(this.daysForm.get("" + this.days[i].id + "").value) {
				this.userWorkingDays.push(this.days[i].id);
			}
		}
		let loadingCtrl = this.loadingCtrl;
		let toastCtrl = this.toastCtrl;
		let loading = loadingCtrl.create({
			content: 'Please wait ...'
		});
		
		loading.present();
		this.apiService.saveUserWorkingDays(this.userWorkingDays, this.token)
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
