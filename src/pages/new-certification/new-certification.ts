import { Component } from '@angular/core';
import { Platform, ActionSheetController, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { FormBuilder, Validators,FormGroup} from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
/**
 * Generated class for the NewCertificationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-new-certification',
  templateUrl: 'new-certification.html',
})
export class NewCertificationPage {

	token:any;
	imageStr:any;
	submitAttempt:boolean = false;
  
	certificationForm: FormGroup;  
	
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
	
	formErrors = {
		'name': [],
	
	};
	validationMessages = {
		'name': {
			'required':      'Certification Title is required',
		},
			  
	}
  
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public storage:Storage,
		public apiService: ApiServiceProvider,
		public toastCtrl: ToastController,
		public fb: FormBuilder,
		public camera: Camera, 	
		public actionSheetCtrl: ActionSheetController,
		public platform: Platform,
				
	) {
		this.certificationForm = fb.group({  
			'name': ['', Validators.compose([Validators.required])],
		});
		//let storage = this.storage;
		this.certificationForm.valueChanges
		.subscribe(data => this.onValueChanged(data));
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
	
	onValueChanged(data?: any) {
		if (!this.certificationForm) { return; }
		const form = this.certificationForm;
		for (const field in this.formErrors) {
		// clear previous error message
			this.formErrors[field] = [];
			this.certificationForm[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field].push(messages[key]);
				}
			}
		}
	}
	submitInfo() {
		this.submitAttempt = true;
		let toastCtrl = this.toastCtrl;
		if(this.certificationForm.valid && this.imageStr) {
			let me = this;
			let loadingCtrl = this.loadingCtrl;
			let loading = loadingCtrl.create({
				content: 'Please wait ...'
			});
			
			loading.present();
			let formData = me.certificationForm.value;
			formData.imageStr = me.imageStr;
			me.apiService.saveCertification(formData, me.token)
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
				message: "Select certification image to continue",
				duration: 3000,
				cssClass: 'toast-error',
				position:'top',
			});
			toast.present();
		}
	}
}
