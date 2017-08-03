import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ModalListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-modal-list',
  templateUrl: 'modal-list.html',
})
export class ModalListPage {

	skills:any= [];
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController,
		
	) {
		this.skills = this.navParams.get("skills");
		console.log(this.skills);
	}

	chooseItem(skill: any) {
		this.viewCtrl.dismiss(skill);
	}
  
  
}
