import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ApiServiceProvider } from '../../providers/api-service/api-service';
import { AddressAutocompletePage } from '../address-autocomplete/address-autocomplete';
import { SkillAutocompletePage } from '../skill-autocomplete/skill-autocomplete';
import { ProfilePage } from '../profile/profile';

/**
 * Generated class for the SearchTalentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
declare var google;
 @Component({
  selector: 'page-search-talent',
  templateUrl: 'search-talent.html',
})
export class SearchTalentPage {

	token:any;
	user:any;
	address:any;
	skill:any;
	addresses:any= [];
	skills:any = [];
	placedetails:any;
	map: any;
    markers = [];
	@ViewChild('map') mapElement: ElementRef;
	placesService:any;
	identityVerified:boolean = false;
	talents:any = [];
	show:boolean = true;
	neighbourhood:any;
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public loadingCtrl: LoadingController,
		public storage:Storage,
		public apiService: ApiServiceProvider,
		public toastCtrl: ToastController,
		private modalCtrl: ModalController,
	) {
  
	}

	ionViewDidEnter() {
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
	
	viewProfile(id, user_type_id) {
		let modal = this.modalCtrl.create(ProfilePage, {
			'id': id,
			'user_type_id':user_type_id
		});
		
		modal.present();
	}

	applyFilter() {
		console.log(this.addresses);
		console.log(this.skills);
		console.log(this.identityVerified);
		
		var formData = {
			'skills':[],
			'addresses' : [],
			'identityVerified' : 1
		};
		
		formData.skills = this.skills;
		formData.addresses = this.addresses;
		formData.identityVerified = this.identityVerified ? 2 : 1;
		
		let me = this;
		let loading = this.loadingCtrl.create({
			content: 'Please wait ...'
		});
		loading.present();
		
		me.apiService.searchTalents(formData, me.token,0)
		.then(function(data){
			loading.dismiss();
			let response = JSON.parse(JSON.stringify(data));
			me.talents = response.data.talents;
			me.show = false;
		}, function(error){
			loading.dismiss();
			alert(error);
			
		});
		
	}
    
	doInfinite(infiniteScroll) {
		console.log('Begin async operation');
		let offset = this.talents.length;
		let me = this;
		var formData = {
			'skills':[],
			'addresses' : [],
			'identityVerified' : 1
		};
		
		formData.skills = this.skills;
		formData.addresses = this.addresses;
		formData.identityVerified = this.identityVerified ? 2 : 1;
		me.apiService.searchTalents(formData, me.token,offset)
		.then(function(data){
			let response = JSON.parse(JSON.stringify(data));
			if(response.data.jobs) {
				me.talents = me.talents.concat(response.data.talents);
			}
			console.log('Async operation has ended');
			infiniteScroll.complete();
		}, function(error){
			alert(error);
			infiniteScroll.complete();
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
		self.neighbourhood = "";
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
						self.neighbourhood = place.address_components[i]['long_name'];
					}
					
					if(addressType == "locality") {
						if(!self.neighbourhood) {
							self.placedetails.neighbourhood = place.address_components[i]['long_name'];
							self.neighbourhood = place.address_components[i]['long_name'];
						}
					}
				}
				if(self.neighbourhood)
					self.addresses.push(self.neighbourhood); 
				//self.jobForm.get("address").setValue(self.placedetails.neighbourhood);
            }else{
                
            }
        }
	}
	
	showSkillsModal() {
		// reset 
        let modal = this.modalCtrl.create(SkillAutocompletePage);
		modal.onDidDismiss(data => {
			if(data){
                this.skills = this.talents.concat(data);
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

}
