import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { MessagesPage } from '../messages/messages';
import { BrowsePage } from '../browse/browse';
import { ProjectsPage } from '../projects/projects';
import { NotificationsPage } from '../notifications/notifications';
import { AccountPage } from '../account/account';

/**
 * Generated class for the DashboardPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

	@ViewChild('tabs') tabs;
	
	tab1Root: any = MessagesPage;
	tab2Root: any = BrowsePage;
	tab3Root: any = ProjectsPage;
	tab4Root: any = NotificationsPage;
	tab5Root: any = AccountPage;
	
	tab1Title = "Messages";
	tab2Title = "Map";
	tab3Title = "Jobs";
	tab4Title = "Notifications";
	tab5Title = "Profile";
	
	
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		
	}

	ionViewDidLoad() {
		
	}

}
