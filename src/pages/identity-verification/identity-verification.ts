import { Component } from '@angular/core';
import { Platform, NavController, NavParams, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
/**
 * Generated class for the AddressVerificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-identity-verification',
  templateUrl: 'identity-verification.html',
})

export class IdentityVerificationPage {

	token:any;
	imageStr:any;
	submitAttempt:boolean = false;
  
	cameraOptions: CameraOptions = {
		quality: 50,
		targetWidth:500,
		targetHeight:500,
		allowEdit:true,
		destinationType: this.camera.DestinationType.DATA_URL,
		encodingType: this.camera.EncodingType.PNG,
		mediaType: this.camera.MediaType.PICTURE
	};
	
	galleryOptions: CameraOptions = {
		quality: 50,
		targetWidth:500,
		targetHeight:500,
		allowEdit:true,
		destinationType: this.camera.DestinationType.DATA_URL,
		encodingType: this.camera.EncodingType.PNG,
		mediaType: this.camera.MediaType.PICTURE,
		sourceType : this.camera.PictureSourceType.PHOTOLIBRARY
	}

	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public actionSheetCtrl: ActionSheetController,
		public loadingCtrl: LoadingController,
		public storage:Storage,
		public apiService: ApiServiceProvider,
		public toastCtrl: ToastController,
		public camera: Camera, 	
		public platform: Platform,
	) {
		
	}

	ionViewDidLoad() {
		let me = this;
		this.storage.get('loggedinuser').then(function (user){
			me.token = user.whoseme_token;
		});
	}
	
	back() {
		this.navCtrl.pop();
	}
	
	presentPictureSource() {
		let me = this;
		let actionSheet = this.actionSheetCtrl.create({
		  title: 'Select Picture from',
		  buttons: [
			{
			  text: 'Camera',
			  icon: !this.platform.is('ios') ? 'camera' : null,
			  handler: () => {
				me.camera.getPicture(me.cameraOptions).then((imageData) => {
				// imageData is a base64 encoded string
					me.imageStr = imageData;
				}, (err) => {
					console.log(err);
				});
			  }
			},{
			  text: 'Gallery',
			  icon: !this.platform.is('ios') ? 'albums' : null,
			  handler: () => {
				me.camera.getPicture(me.galleryOptions).then((imageData) => {
				// imageData is a base64 encoded string
					me.imageStr = imageData;
				}, (err) => {
					console.log(err);
				});
			  }
			},{
			  text: 'Cancel',
			  role: 'cancel',
			  icon: !this.platform.is('ios') ? 'close' : null,
			  handler: () => {
				console.log('Cancel clicked');
			  }
			}
		  ]
		});
		actionSheet.present();
	}
	submitInfo() {
		let toastCtrl = this.toastCtrl;
		if(this.imageStr) {
			let me = this;
			let loadingCtrl = this.loadingCtrl;
			let loading = loadingCtrl.create({
				content: 'Please wait ...'
			});
			
			loading.present();
			me.apiService.saveIdentityVerificationRequest(me.imageStr, me.token)
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
						me.navCtrl.pop();
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
		} else if(!this.imageStr) {
			let toast = toastCtrl.create({
				message: "Select picture of driver's license to continue",
				duration: 3000,
				cssClass: 'toast-error',
				position:'top',
			});
			toast.present();
		}
	}

}
