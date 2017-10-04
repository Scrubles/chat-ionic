import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { BaseProvider } from "../base";
import { Message } from './../../models/message';

@Injectable()
export class MessageProvider extends BaseProvider {

  constructor(public http: Http, public db: AngularFireDatabase) {
    super();
  }

  create(message: Message, messages: FirebaseListObservable<Message[]>): firebase.Promise<void> {
    return messages.push(message).catch(this.handlePromiseError);
  }

  getMessages(userId1: string, userId2): FirebaseListObservable<Message[]> {
    return <FirebaseListObservable<Message[]>> this.db.list(`/messages/${userId1}-${userId2}`, {
      query: {
        limitToLast: 5,
        orderByChild: 'timestamp'
      }
    }).catch(this.handleObservableError);
  }
}
