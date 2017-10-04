import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { User } from './../../models/user';
import { AuthProvider } from './../../providers/auth/auth';
import { UserProvider } from './../../providers/user/user';

@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  currentUser: User;
  canEdit: boolean = false;
  private filePhoto: File;
  uploadProgress: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public userProvider: UserProvider) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {
    this.userProvider.currentUser.subscribe((user: User) => {
      this.currentUser = user;
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if(this.filePhoto) {
      let uploadTask = this.userProvider.uploadPhoto(this.filePhoto, this.currentUser.$key);
      uploadTask.on('state_changed', (snapshot: any) => {
        this.uploadProgress = Math.round(snapshot.bytesTransferred*100 / snapshot.totalBytes);
      }, (error: Error) => {
        console.log(error);
      }, () => {
        this.editUser(uploadTask.snapshot.downloadURL);
      })
    }
    else
      this.editUser();
  }

  onChangePhoto(event: any): void {
    this.filePhoto = event.target.files[0];
  }

  private editUser(photoUrl?: string): void {
    this.userProvider.edit({
      name: this.currentUser.name,
      username: this.currentUser.username,
      photo: photoUrl || this.currentUser.photo || ''
    }).then(() => {
      this.canEdit = false;
      this.filePhoto = undefined;
      this.uploadProgress = 0;
    });
  }
}
