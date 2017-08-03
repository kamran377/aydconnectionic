import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GooglePlus } from '@ionic-native/google-plus';
import {Storage} from '@ionic/storage';
import { HomePage } from '../home/home';
import { UserModel } from './user.model';

@Component({
  selector: 'page-user',
  templateUrl: 'user.html'
})

export class UserPage {
  user: UserModel = new UserModel();
  
  constructor(public navCtrl: NavController,
  private storage: Storage,
  private googlePlus: GooglePlus) {}

  ionViewCanEnter(){
    let env = this;
    this.storage.get('user')
    .then(function (data){
      env.user = {
        name: data.name,
        email: data.email,
        picture: data.picture
      };
    }, function(error){
      console.log(error);
    });
  }

  doGoogleLogout(){
    let nav = this.navCtrl;
    this.googlePlus.logout()
    .then(function (response) {
      this.storage.remove('user');
      nav.push(HomePage);
    },function (error) {
      console.log(error);
    })
  }

}
