import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, Loading, LoadingController, NavController, NavParams } from 'ionic-angular';

import { HomePage } from './../home/home';
import { AuthProvider } from './../../providers/auth/auth';
import { UserProvider } from './../../providers/user/user';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignUpPage {

  loading: Loading;
  signUpForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userProvider: UserProvider,
    public authProvider: AuthProvider) {

    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    this.signUpForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
    const user = this.signUpForm.value;
    this.userProvider.userExists(user.username).take(1).subscribe((userExists: boolean) => {
      if (userExists) {
        this.showAlertMsg(`The username ${user.username} is already in use`);
        this.loading.dismiss();
      } else
        this.createUser(user);
    });
  }

  private createUser(user): void {
    this.authProvider.signUp(user).then((response) => {
      delete user.password;
      const uid: string = response.uid;
      this.userProvider.create(user, uid).then(() => {
        this.loading.dismiss();
        this.navCtrl.setRoot(HomePage);
      }).catch((error) => {
        this.handleError(error);
      });
    }).catch((error) => {
      this.handleError(error);
    });
  }

  private showAlertMsg(message): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();
  }

  private handleError(error): void {
    this.loading.dismiss();
    this.showAlertMsg(error);
  }
}
