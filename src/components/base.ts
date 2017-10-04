// import { OnInit } from '@angular/core';
import { App, AlertController, MenuController, NavController } from 'ionic-angular';

import { SignInPage } from './../pages/signin/signin';
import { AuthProvider } from './../providers/auth/auth';

export class BaseComponent {

  protected navCtrl: NavController;

  constructor(
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public app: App,
    public menuCtrl: MenuController
  ) {
  
  }

  ngOnInit(): void {
    this.navCtrl = this.app.getActiveNav();
  }

  onLogout(): void {
    this.alertCtrl.create({
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.authProvider.signOut().then(() => {
              this.navCtrl.setRoot(SignInPage);
              this.menuCtrl.enable(false, 'user-menu');
            })
          }
        },
        {
          text: 'No'
        }
      ]
    }).present();
  }
}
