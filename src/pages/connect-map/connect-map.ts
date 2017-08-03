import {  Component} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SafeResourceUrl, DomSanitizer} from '@angular/platform-browser'; 

/**
 * Generated class for the ConnectMapPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-connect-map',
  templateUrl: 'connect-map.html',
})
export class ConnectMapPage {

	mapUrl: SafeResourceUrl;
	constructor(public navCtrl: NavController, 
		public domSanitizer: DomSanitizer,
		public navParams: NavParams,
		
	) {
		this.mapUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('http://www.api.aydconnect.com/site/map');
		//this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
	}

	
	
	
	ionViewDidLoad() {
		 this.displayMap();
		 
	}
	
	private displayMap() {

    }

}
