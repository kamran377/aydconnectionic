import { Component, NgZone } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

declare var google; 
/**
 * Generated class for the AddressAutocompletePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-address-autocomplete',
  templateUrl: 'address-autocomplete.html',
})

export class AddressAutocompletePage {

	autocompleteItems;
	autocomplete;
	service = new google.maps.places.AutocompleteService();
	cities:any;
	label:any = "Enter Address";
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController, 
		private zone: NgZone
	) {
		this.autocompleteItems = [];
		this.autocomplete = {
			query: ''
		};
		this.cities = navParams.get('cities');
		if(this.cities == true) {
			this.label = "Enter Locations(City/State)";
		}
	}
	
	dismiss() {
		this.viewCtrl.dismiss();
	}

	chooseItem(item: any) {
		this.viewCtrl.dismiss(item);
	}
	
	updateSearch() {
		if (this.autocomplete.query == '') {
			this.autocompleteItems = [];
			return;
		}
		let me = this;
		let options = {
			input: this.autocomplete.query,
			componentRestrictions: {country: 'US'} 
		};
		if(this.cities == true) {
			let options = {
				input: this.autocomplete.query,
				types: ['(cities)'], 
				componentRestrictions: {country: 'US'} 
			};
		}
		this.service.getPlacePredictions(options, function (predictions, status) {
			me.autocompleteItems = []; 
			me.zone.run(function () {
				predictions.forEach(function (prediction) {
					me.autocompleteItems.push(prediction);
				});
			});
		});
	}


	ionViewDidLoad() {
		console.log('ionViewDidLoad AddressAutocompletePage');
	}

}
