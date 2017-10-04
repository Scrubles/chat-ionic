import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { BaseProvider } from "../base";

@Injectable()
export class AuthProvider extends BaseProvider {

  user: Observable<firebase.User>;

  constructor(public http: Http, public afAuth: AngularFireAuth) {
    super();
    this.user = afAuth.authState;
  }

  signUp(user: { email: string, password: string }): firebase.Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .catch(this.handlePromiseError);
  }

  signIn(user: { email: string, password: string }): firebase.Promise<boolean> {
    return this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password).then((response) => {
      return response != null;
    }).catch(this.handlePromiseError);
  }

  signOut(): firebase.Promise<void> {
    return this.afAuth.auth.signOut().catch(this.handlePromiseError);
  }

  get authenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.user.subscribe((auth) => {
        auth ? resolve(true) : reject(false);
      });
    });
  }
}
