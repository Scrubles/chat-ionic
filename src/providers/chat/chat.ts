import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase/app';
import { AngularFireDatabase, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';

import { BaseProvider } from "../base";
import { AuthProvider } from './../auth/auth';
import { Chat } from './../../models/chat';

@Injectable()
export class ChatProvider extends BaseProvider {

  chats: FirebaseListObservable<Chat[]>;

  constructor(public http: Http, public db: AngularFireDatabase,
    public authProvider: AuthProvider) {
    super();
    this.setChats();
  }

  private setChats(): void {
    this.authProvider.user.subscribe((auth) => {
      if (auth) {
        this.chats = <FirebaseListObservable<Chat[]>> this.db.list(`/chats/${auth.uid}`, {
          query: {
            orderByChild: 'timestamp'
          }
        }).map((chats: Chat[]) => {
          return chats.reverse();
        }).catch(this.handleObservableError);
      }
    });
  }

  create(chat: Chat, userId1: string, userId2: string): firebase.Promise<void> {
    return this.db.object(`/chats/${userId1}/${userId2}`).set(chat).catch(this.handlePromiseError);
  }

  getDeepChat(userId1: string, userId2: string): FirebaseObjectObservable<Chat> {
    return <FirebaseObjectObservable<Chat>> this.db.object(`/chats/${userId1}/${userId2}`).catch(this.handleObservableError);
  }

  updatePhoto(chat: FirebaseObjectObservable<Chat>, chatPhoto: string, recipientUserPhoto: string): firebase.Promise<void> {
    if(chatPhoto != recipientUserPhoto)
      return chat.update({
        photo: recipientUserPhoto
      }).catch(this.handlePromiseError);
      
    return Promise.resolve();
  }
}
