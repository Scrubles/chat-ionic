import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';

import { HomePage } from './../home/home';
import { SignUpPage } from './../signup/signup';
import { AuthProvider } from './../../providers/auth/auth';
import { UserProvider } from './../../providers/user/user';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SignInPage {

  loading: Loading;
  signInForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider, 
    public authProvider: AuthProvider) {
      
    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    this.signInForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  
  onSubmit(): void {
    this.loading = this.loadingCtrl.create({
      content: 'Checking credentials...'
    });
    this.loading.present();
    const userCredentials = this.signInForm.value;
    this.authProvider.signIn(userCredentials).then((isLoggedIn: boolean) => {
      if(isLoggedIn)
        this.navCtrl.setRoot(HomePage);
      else
        this.showAlertMsg('There was an error signin in');
      this.loading.dismiss();
    }).catch((error) => {
      this.showAlertMsg(error);
      this.loading.dismiss();
    });
  }

  onSignUp(): void {
    this.navCtrl.push(SignUpPage);
  }
  
  private showAlertMsg(message): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }
}
