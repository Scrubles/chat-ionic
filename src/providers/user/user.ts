import { Inject, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import "firebase/storage";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { User } from './../../models/user';
import { BaseProvider } from "../base";
import { AuthProvider } from './../auth/auth';

@Injectable()
export class UserProvider extends BaseProvider {

  users: FirebaseListObservable<User[]>;
  currentUser: FirebaseObjectObservable<User>;

  constructor(public http: Http, public db: AngularFireDatabase,
    @Inject(FirebaseApp) public firebaseApp: any, public authProvider: AuthProvider) {
    super();
    this.listenAuthState();
  }

  private setUsers(uidToExclude: string) {
    this.users = <FirebaseListObservable<User[]>> this.db.list(`/users`, {
      query: {
        orderByChild: 'name'
      }
    }).map((users: User[]) => {
      return users.filter((user: User) => user.$key !== uidToExclude);
    });
  }

  private listenAuthState(): void {
    this.authProvider.user.subscribe((auth) => {
      if (auth) {
        this.currentUser = this.db.object(`/users/${auth.uid}`);
        this.setUsers(auth.uid);
      }
    });
  }

  create(user: User, uid: string): firebase.Promise<void> {
    return this.db.object(`/users/${uid}`).set(user).catch(this.handlePromiseError);
  }

  edit(user: {name: string, username: string, photo: string}): firebase.Promise<void> {
    return this.currentUser.update(user).catch(this.handlePromiseError);
  }

  userExists(userName: string): Observable<boolean> {
    return this.db.list(`/users`, {
      query: {
        orderByChild: 'username',
        equalTo: userName
      }
    }).map((users: User[]) => {
      return users.length > 0;
    }).catch(this.handleObservableError);
  }
  
  get(userId: string): FirebaseObjectObservable<User> {
    return <FirebaseObjectObservable<User>> this.db.object(`/users/${userId}`)
      .catch(this.handleObservableError);
  }

  uploadPhoto(file: File, userId: string): firebase.storage.UploadTask {
    return this.firebaseApp.storage().ref().child(`/users/${userId}`).put(file);
  }
}
