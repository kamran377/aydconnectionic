import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { OneSignal} from '@ionic-native/onesignal';
import { HomePage } from '../pages/home/home';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { Storage } from '@ionic/storage';
import { NavController } from 'ionic-angular';
import { LoaderPage } from '../pages/loader/loader';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoaderPage;
	 @ViewChild('nav') nav: NavController;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private _OneSignal: OneSignal, public storage : Storage ) {
		
		
	platform.ready().then(() => {
		// Okay, so the platform is ready and our plugins are available.
		// Here you can do any higher level native things you might need.
		var iosSettings = {};
		iosSettings["kOSSettingsKeyAutoPrompt"] = true;
		iosSettings["kOSSettingsKeyInAppLaunchURL"] = false;
		this._OneSignal.startInit("e6606300-f2de-4a7c-a84c-8db24c6e6944", "994841299241").iOSSettings(iosSettings);
		this._OneSignal.inFocusDisplaying(this._OneSignal.OSInFocusDisplayOption.Notification);
		this._OneSignal.setSubscription(true);
		this._OneSignal.handleNotificationReceived().subscribe(() => {
		// handle received here how you wish.
		});
		this._OneSignal.handleNotificationOpened().subscribe(() => {
		// handle opened here how you wish.
		});
		this._OneSignal.endInit(); 
		statusBar.styleDefault();
		let env = this;
		this.storage.get('loggedinuser').then(function (user){
			splashScreen.hide();
			if(user == null) {
				env.nav.setRoot(HomePage);
			} else {
				env.nav.setRoot(DashboardPage);
			}
			
		});
		
    });
  }
  
  
}

