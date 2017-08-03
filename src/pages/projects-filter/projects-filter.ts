import { Component } from '@angular/core';
import { ViewController, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ProjectsFilterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-projects-filter',
  templateUrl: 'projects-filter.html',
})
export class ProjectsFilterPage {

	projectType:any;
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public viewCtrl: ViewController, 
		
	) {
		this.projectType = navParams.get("projectType");
		if(!this.projectType) {
			this.projectType = 1;
		}
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ProjectsFilterPage');
	}
	
	applyFilter() {
		this.viewCtrl.dismiss(this.projectType);
	}

}
