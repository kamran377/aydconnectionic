import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform, ActionSheetController, NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { FormBuilder, Validators,FormGroup} from '@angular/forms';
import { AddressAutocompletePage } from '../address-autocomplete/address-autocomplete';
import { SkillAutocompletePage } from '../skill-autocomplete/skill-autocomplete';
import { Camera, CameraOptions } from '@ionic-native/camera';

declare var google;

/**
 * Generated class for the NewJobPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-new-job',
  templateUrl: 'new-job.html',
})
export class NewJobPage {
	
	token:any;
	jobForm: FormGroup; 
	items:any;
	imageStrs:any = [];
	address:any;
	skills:any;
	placedetails:any;
	map: any;
    markers = [];
	@ViewChild('map') mapElement: ElementRef;
	placesService:any;
	submitAttempt
	formErrors = {
		'title': [],
		'jobType': [],
		'description': [],
		'address': [],
	
	};
	
	validationMessages = {
		'title': {
			'required':      'Job Title is required.',
		},
		'jobType': {
			'required':      'Job type is required.',
		},
		'description': {
			'required':      'Job Description is required.',
		},
		'address': {
			'required':      'Job Location is required.',
		},	  
	}
	
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
		public loadingCtrl: LoadingController,
		public storage:Storage,
		public apiService: ApiServiceProvider,
		public toastCtrl: ToastController,
		private modalCtrl: ModalController,
		public fb: FormBuilder, 
		public camera: Camera, 	
		public actionSheetCtrl: ActionSheetController,
		public platform: Platform,
	) {
		this.jobForm = fb.group({  
			'title': ['', Validators.compose([Validators.required])],
			'jobType': ['', Validators.compose([Validators.required])],
			'description': ['', Validators.compose([Validators.required])],
			'address': ['', Validators.compose([Validators.required])],
			'keyword': ['',[]],
		});
		//let storage = this.storage;
		this.jobForm.valueChanges
		.subscribe(data => this.onValueChanged(data));	
		this.skills = [];
	}
	
	deleteEntry(key) {
		var index = this.imageStrs.indexOf(key, 0);
		if (index > -1) {
		   this.imageStrs.splice(index, 1);
		}
	}
	
	takePicture() {
		let me = this;
		if(me.imageStrs.length >= 5) {
			let toast = this.toastCtrl.create({
			  message: "You can uplaod at max 5 images, you can add more images after the job is posted",
			  duration: 3000,
			  cssClass: 'toast-error',
			  position:'top',
			});
			toast.present();
			return;
		}
		let actionSheet = this.actionSheetCtrl.create({
		  title: 'Select Picture from',
		  buttons: [
			{
			  text: 'Camera',
			  icon: !this.platform.is('ios') ? 'camera' : null,
			  handler: () => {
				me.camera.getPicture(me.cameraOptions).then((imageData) => {
				// imageData is a base64 encoded string
					me.imageStrs.push(imageData);
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
					me.imageStrs.push(imageData);
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
	
	ionViewDidLoad() {
		let me = this;
		this.storage.get('loggedinuser').then(function (user){
			me.token = user.whoseme_token;
		});
		this.initPlacedetails();
		this.initMap();
	}
	
	private initMap() {
		let me = this;
		var point = google.maps.LatLng(this.placedetails.lat, this.placedetails.lng); 
		this.map = new google.maps.Map(me.mapElement.nativeElement, {
			center: point,
			zoom: 15,
			disableDefaultUI: true,
			draggable: false,
			zoomControl: true
		});

    }

	
    
	onChange(val){
		console.log();
	}
	
	private initPlacedetails() {
        this.placedetails = {
            lat: '',
            lng: '',
			neighbourhood:'',       
        };        
    }  
	
	private getPlaceDetail(place_id:string):void {
		var self = this;
        let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		var request = {
            placeId: place_id
        };
        this.placesService = new google.maps.places.PlacesService(this.map);
        this.placesService.getDetails(request, callback);
        function callback(place, status) {
            loading.dismiss();
			if (status == google.maps.places.PlacesServiceStatus.OK) {
                self.placedetails.lat = place.geometry.location.lat();
                self.placedetails.lng = place.geometry.location.lng(); 
				for (var i = 0; i < place.address_components.length; i++) {
					let addressType = place.address_components[i].types[0];
					if(addressType == "sublocality_level_1") {
						self.placedetails.neighbourhood = place.address_components[i]['long_name'];
					}
					
					if(addressType == "locality") {
						if(!self.placedetails.neighbourhood) {
							self.placedetails.neighbourhood = place.address_components[i]['long_name'];
						}
					}
				}
				self.jobForm.get("address").setValue(self.placedetails.neighbourhood);
            }else{
                
            }
        }
	}
	
	showModal() {
		// reset 
        let modal = this.modalCtrl.create(SkillAutocompletePage);
		modal.onDidDismiss(data => {
			if(data){
                this.skills.push(data.name);
            }  		
		});
		modal.present();
	}
	
	showAddressModal() {
		// reset 
        let modal = this.modalCtrl.create(AddressAutocompletePage, { 'cities': true });
		modal.onDidDismiss(data => {
			if(data){
                //this.skills.push(data.name);
				this.getPlaceDetail(data.place_id);
            }  		
		});
		modal.present();
	}
	
	back() {
		this.navCtrl.pop();
	}
	
	submitInfo() {
		let me = this;
		if(this.jobForm.valid)  {
			let loadingCtrl = this.loadingCtrl;
			let toastCtrl = this.toastCtrl;
			let apiService = this.apiService;
			
			let loading = loadingCtrl.create({
				content: 'Please wait ...'
			});
			
			loading.present();
			
			let formData = me.jobForm.value;
			formData.location = this.placedetails.neighbourhood;
			formData.lat = this.placedetails.lat;
			formData.lng = this.placedetails.lng;
			formData.skills = this.skills;
			formData.imageStrs = this.imageStrs;
			apiService.saveJob(formData, this.token)
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
		} else {
			const form = this.jobForm;
			for (const field in this.formErrors) {
			// clear previous error message
				this.formErrors[field] = [];
				this.jobForm[field] = '';
				const control = form.get(field);
				if (control && (control.dirty || this.submitAttempt) && !control.valid) {
					const messages = this.validationMessages[field];
					for (const key in control.errors) {
						this.formErrors[field].push(messages[key]);
					}
				}
			}
		}
	}
	
	onValueChanged(data?: any) {
		if (!this.jobForm) { return; }
		const form = this.jobForm;
		for (const field in this.formErrors) {
		// clear previous error message
			this.formErrors[field] = [];
			this.jobForm[field] = '';
			const control = form.get(field);
			if (control && control.dirty && !control.valid) {
				const messages = this.validationMessages[field];
				for (const key in control.errors) {
					this.formErrors[field].push(messages[key]);
				}
			}
		}
	}

}
