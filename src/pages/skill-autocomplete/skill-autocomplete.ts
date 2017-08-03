import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';
import { ApiServiceProvider } from '../../providers/api-service/api-service';

/**
 * Generated class for the SkillAutocompletePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-skill-autocomplete',
  templateUrl: 'skill-autocomplete.html',
})
export class SkillAutocompletePage {

	autocompleteItems:any;
	autocomplete:any;
	skills:any = [];
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public apiService: ApiServiceProvider,
	) {
		this.autocompleteItems = [];
		this.autocomplete = {
			query: ''
		};
	}
	
	dismiss() {
		this.viewCtrl.dismiss(this.skills);
	}
	
	cancel(){
		this.viewCtrl.dismiss(this.skills);
	}
	
	chooseItem(item: any) {
		//this.viewCtrl.dismiss(item);
		this.skills.push(item.name);
		this.autocomplete.query = ''
		this.autocompleteItems = [];
	}
	
	updateSearch() {
		if (this.autocomplete.query == '') {
			this.autocompleteItems = [];
			return;
		}
		let me = this;
		this.apiService.getSkillsAutoComplete(this.autocomplete.query)
			.then(function(data){
				me.autocompleteItems = []; 
				let response = JSON.parse(JSON.stringify(data));
				me.autocompleteItems = response.data.skills;
			});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SkillAutocompletePage');
	}

}
