import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { SignInPage } from './../pages/signin/signin';
import { AuthProvider } from './../providers/auth/auth';
import { UserProvider } from './../providers/user/user';
import { User } from './../models/user';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any = SignInPage;
  currentUser: User;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    authProvider: AuthProvider, userProvider: UserProvider) {

    authProvider.user.subscribe((auth) => {
      if (auth) {
        userProvider.currentUser.subscribe((user: User) => {
          this.currentUser = user;
        });
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}

