import { Component } from '@angular/core';
import { Platform, ActionSheetController, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { App } from 'ionic-angular';
import { DashboardPage } from '../dashboard/dashboard';
import { FileTransfer,FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
declare var cordova: any;

/**
 * Generated class for the JobFilesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-job-files',
  templateUrl: 'job-files.html',
})
export class JobFilesPage {

	user:any;
	token:any;
	files:any;
	job:any;
	jobID:any;
	imageStr:any;
	fileTransfer: FileTransferObject; 
	storageDirectory: string = '';

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
		public storage : Storage,
		public loadingCtrl: LoadingController,
		public apiService: ApiServiceProvider,
		public app:App,
		private transfer: FileTransfer, 
		private file: File,
		public platform: Platform,
		public toastCtrl: ToastController,
		public camera: Camera, 	
		public actionSheetCtrl: ActionSheetController,
		public alertCtrl: AlertController,
		
		
	) {
		this.fileTransfer = this.transfer.create();
		if (this.platform.is('ios')) {
			this.storageDirectory = cordova.file.documentsDirectory;
		  }
		  else if(this.platform.is('android')) {
			this.storageDirectory = cordova.file.externalApplicationStorageDirectory + '/Download';
		  }
	}

	takePicture() {
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
					me.uploadImage();
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
					me.uploadImage();
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
	
	uploadImage (){
		let me = this;
		let toastCtrl = this.toastCtrl;
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		me.apiService.uploadJobFiles(me.token, me.jobID, me.imageStr)
		.then(function(data){
			let response = JSON.parse(JSON.stringify(data));
			loading.dismiss();
			
			if(response.status == "success") {
				me.files = response.data.files;
				let toast = toastCtrl.create({
					message: response.message,
					duration: 3000,
					cssClass: 'toast-success',
					position:'top',
				});
				toast.present();
			} else {
				let toast = toastCtrl.create({
					message: response.message,
					duration: 3000,
					cssClass: 'toast-error',
					position:'top',
				});
				toast.present();
			}
			
		}, function(error){
			alert(error);
			loading.dismiss();
		});
	}
	
	deleteFile(id) {
		let me = this;
		let toastCtrl = this.toastCtrl;
		
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		let alert1 = this.alertCtrl.create({
			title: 'Confirm Delete',
			message: 'Do you really want to delete this image?',
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
						me.apiService.deleteJobFile(id, me.token)
						.then(function(data){
							loading.dismiss();
							let response = JSON.parse(JSON.stringify(data));
							if(response.status == "success") 
							{
								me.files = response.data.files;
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
			]
		});
		alert1.present();
	}
	
	download(url, name) {
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		let path = this.storageDirectory + name + '.png';
		this.fileTransfer.download(url, path).then((entry) => {
			loading.dismiss();
			alert('File downloaded in download folder');
		}, (error) => {
			loading.dismiss();
			alert(JSON.stringify(error));
		});
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
				me.apiService.getJobFiles(me.token, me.jobID)
				.then(function(data){
					let response = JSON.parse(JSON.stringify(data));
					me.files = response.data.files;
					me.job = response.data.job;
					loading.dismiss();
					
				}, function(error){
					alert(error);
					loading.dismiss();
				});
			});
				/**/
		});
			
	}
}
