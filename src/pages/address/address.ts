import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, ToastController  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { FormBuilder, Validators,FormGroup} from '@angular/forms';
import { AddressAutocompletePage } from '../address-autocomplete/address-autocomplete';
import { AddressVerificationPage } from '../address-verification/address-verification';
import { AddressVerificationStatusPage } from '../address-verification-status/address-verification-status';

/**
 * Generated class for the AddressPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google;
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {

	token:any;
	userAddress:any;
	addressVerificationRequest:any;
	addressForm: FormGroup;  
	submitAttempt:boolean = false;
	@ViewChild('map') mapElement: ElementRef;
	
    address:any = {
        place: '',
        set: false,
    };
    placesService:any;
    map: any;
    markers = [];
    placedetails: any;
	
	formErrors = {
	  'fullAddress': [],
	  'street': [],
	  'neighbourhood': [],
	  'postalCode': [],
	  'city': [],
	  'state': [],
	  'lat': [],
	  'lng': [],
	  
	};
	validationMessages = {
	  'fullAddress': {
		'required':      'fullAddress is required.',
	  },
	  'street': {
		'required':      'Street Address is required.',
	  },
	  'neighbourhood': {
		'required':      'Neighbourhood is required.',
	  },
	  'postalCode': {
		'required':      'Postal Code is required.',
	  },
	  'city': {
		'required':      'City is required.',
	  },
	  'state': {
		'required':      'State is required.',
	  },
	  'lat': {
		'required':      'Latitude is required.',
	  },
	  'lng': {
		'required':      'Longitude is required.',
	  },
	  
	}
	
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public storage:Storage,
		public fb: FormBuilder, 	  
		public loadingCtrl: LoadingController, 	  
		public apiService: ApiServiceProvider,
		private modalCtrl: ModalController,
		public toastCtrl: ToastController,
	) {
	
		//this.countries.push({'id':"","name":"Select Country"});
		this.addressForm = fb.group({  
			'fullAddress': ['', Validators.compose([Validators.required])],
			'street': ['', Validators.compose([Validators.required])],
			'neighbourhood': ['', Validators.compose([Validators.required])],
			'postalCode': ['', Validators.compose([Validators.required])],
			'city': ['', Validators.compose([Validators.required])],
			'state': ['', Validators.compose([Validators.required])],
			'lat': ['', Validators.compose([Validators.required])],
			'lng': ['', Validators.compose([Validators.required])],
		});
		//let storage = this.storage;
		this.addressForm.valueChanges
		.subscribe(data => this.onValueChanged(data));
	}

	isReadonly() {
		return (this.addressVerificationRequest  && this.addressVerificationRequest.status_id != 3) ? true : false;   //return true/false 
	}
	ionViewDidEnter() {
		
		let me = this;
		let apiService = this.apiService;
		
        this.initPlacedetails();
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		this.storage.get('loggedinuser').then(function (user){
			me.token = user.whoseme_token;
			apiService.getAddressData(me.token)
				.then(function(data){
					loading.dismiss();
					
					let response = JSON.parse(JSON.stringify(data));
					let addressData = response.data.userAddress;
					me.addressVerificationRequest = response.data.addressVerificationRequest;
					
					me.placedetails.address = addressData.address;
					me.placedetails.lat = addressData.lat;
					me.placedetails.lng = addressData.lng;
					me.placedetails.components['route'].set = true;
                    me.placedetails.components['route'].long = addressData.street;
					me.placedetails.components['sublocality_level_1'].set = true;
                    me.placedetails.components['sublocality_level_1'].long = addressData.suburb;
					me.placedetails.components['postal_code'].set = true;
                    me.placedetails.components['postal_code'].long = addressData.zip;
					me.placedetails.components['locality'].set = true;
                    me.placedetails.components['locality'].long = addressData.city;
					me.placedetails.components['administrative_area_level_1'].set = true;
                    me.placedetails.components['administrative_area_level_1'].long = addressData.state;
					
					me.address.set = addressData.address ? true : false;
					me.addressForm.get("fullAddress").setValue(addressData.address);
					me.addressForm.get("street").setValue(addressData.street);
					me.addressForm.get("neighbourhood").setValue(addressData.suburb);
					me.addressForm.get("postalCode").setValue(addressData.zip);
					me.addressForm.get("city").setValue(addressData.city);
					me.addressForm.get("state").setValue(addressData.state);
					me.addressForm.get("lat").setValue(addressData.lat);
					me.addressForm.get("lng").setValue(addressData.lng);
					me.initMap();
				});
		});
	}
	
	
	showModal() {
		// reset 
        this.reset();
		let modal = this.modalCtrl.create(AddressAutocompletePage, { 'cities': false });
		modal.onDidDismiss(data => {
			if(data){
                this.address.place = data.description;
                // get details
				
                this.getPlaceDetail(data.place_id);
            }  		
		});
		modal.present();
	}
	
	private reset() {
        this.initPlacedetails();
        this.address.place = '';
        this.address.set = false;
		
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
                console.log('page > getPlaceDetail > place > ', place);
                // set full address
                self.placedetails.address = place.formatted_address;
                self.placedetails.lat = place.geometry.location.lat();
                self.placedetails.lng = place.geometry.location.lng();
                for (var i = 0; i < place.address_components.length; i++) {
                    let addressType = place.address_components[i].types[0];
                    
                    if(self.placedetails.components[addressType]) {
                        self.placedetails.components[addressType].set = true;
                        self.placedetails.components[addressType].short = place.address_components[i]['short_name'];
                        self.placedetails.components[addressType].long = place.address_components[i]['long_name'];
                    }                                     
                }                  
                // set place in map
                self.map.setCenter(place.geometry.location);
                self.createMapMarker(place);
                // populate
                self.address.set = true;
                
				self.addressForm.get("fullAddress").setValue(self.placedetails.address);
				self.addressForm.get("street").setValue(self.placedetails.components.street_number.long + ' ' + self.placedetails.components.route.long);
				self.addressForm.get("neighbourhood").setValue(self.placedetails.components.sublocality_level_1.long);
				self.addressForm.get("postalCode").setValue(self.placedetails.components.postal_code.long + ' ' + self.placedetails.components.postal_code_suffix.long);
				self.addressForm.get("city").setValue(self.placedetails.components.locality.long);
				self.addressForm.get("state").setValue(self.placedetails.components.administrative_area_level_1.long);
				self.addressForm.get("lat").setValue(self.placedetails.lat);
				self.addressForm.get("lng").setValue(self.placedetails.lng);
				
				console.log('page > getPlaceDetail > details > ', self.placedetails);
            }else{
                console.log('page > getPlaceDetail > status > ', status);
            }
        }
    }

    private initMap() {
        
		if( this.address.set = true) {
			let me = this;
			
			var point = google.maps.LatLng(this.placedetails.lat, this.placedetails.lng); 
			let divMap = (<HTMLInputElement>document.getElementById('map'));
			setTimeout(function(){
				me.map = new google.maps.Map(divMap, {
					center: point,
					zoom: 15,
					disableDefaultUI: true,
					draggable: false,
					zoomControl: true
				});
			}, 1000);
			
		}
		
    }

	
    private createMapMarker(place:any):void {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: this.map,
          position: placeLoc
        });    
        this.markers.push(marker);
    }

    private initPlacedetails() {
        this.placedetails = {
            address: '',
            lat: '',
            lng: '',
            components: {
                route: { set: false, short:'', long:'' },                           // calle 
                street_number: { set: false, short:'', long:'' },                   // numero
                sublocality_level_1: { set: false, short:'', long:'' },             // barrio
                locality: { set: false, short:'', long:'' },                        // localidad, ciudad
                administrative_area_level_2: { set: false, short:'', long:'' },     // zona/comuna/partido 
                administrative_area_level_1: { set: false, short:'', long:'' },     // estado/provincia 
                country: { set: false, short:'', long:'' },                         // pais
                postal_code: { set: false, short:'', long:'' },                     // codigo postal
                postal_code_suffix: { set: false, short:'', long:'' },              // codigo postal - sufijo
            }    
        };        
    }    
	
	back() {
		this.navCtrl.pop();
	}
	
	verifyAddress() {
		this.navCtrl.push(AddressVerificationPage);
	}
	
	viewStatus() {
		let modal = this.modalCtrl.create(AddressVerificationStatusPage, {
			'addressVerificationRequest': this.addressVerificationRequest,
			'placedetails' : this.placedetails
		});
		modal.onDidDismiss(data => {
			if(data){
                this.navCtrl.push(AddressVerificationPage);
            }  		
		});
		
		modal.present();
		/*this.navCtrl.push(AddressVerificationStatusPage,{
			'addressVerificationRequest': this.addressVerificationRequest,
			'placedetails' : this.placedetails
		});*/
	}
	
	submitInfo() {
		let me = this;
		let toastCtrl = this.toastCtrl;
			
		if(this.isReadonly()) {
			let toast = toastCtrl.create({
			  message: "You cannot change your address while verification request is under review",
			  duration: 3000,
			  cssClass: 'toast-error',
			  position:'top',
			});
			toast.present();
			return;
		}
		if(this.addressForm.valid)  {
			let loadingCtrl = this.loadingCtrl;
			let apiService = this.apiService;
			
			let loading = loadingCtrl.create({
				content: 'Please wait ...'
			});
			
			loading.present();
			
			let formData = me.addressForm.value;
			apiService.saveAddressInfo(formData, this.token)
				.then(function(data){
					loading.dismiss();
					
					let response = JSON.parse(JSON.stringify(data));
					if(response.status == "success") 
					{
						me.addressVerificationRequest =response.data.addressVerificationRequest;
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
		} else {
			const form = this.addressForm;
			for (const field in this.formErrors) {
			// clear previous error message
				this.formErrors[field] = [];
				this.addressForm[field] = '';
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
		if (!this.addressForm) { return; }
		const form = this.addressForm;
		for (const field in this.formErrors) {
		// clear previous error message
			this.formErrors[field] = [];
			this.addressForm[field] = '';
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
