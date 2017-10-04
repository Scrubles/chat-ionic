import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { ChatPage } from './../chat/chat';
import { UserProvider } from './../../providers/user/user';
import { AuthProvider } from './../../providers/auth/auth';
import { ChatProvider } from './../../providers/chat/chat';
import { User } from './../../models/user';
import { Chat } from './../../models/chat';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  view: string = 'chats';
  users: FirebaseListObservable<User[]>;
  chats: FirebaseListObservable<Chat[]>;

  constructor(
    public navCtrl: NavController,
    public userProvider: UserProvider, 
    public menuCtrl: MenuController,
    public authProvider: AuthProvider,
    public chatProvider: ChatProvider) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewWillLoad() {
    this.users = this.userProvider.users;
    this.chats = this.chatProvider.chats;
    this.menuCtrl.enable(true, 'user-menu');
  }

  filterItems(event: any): void {
    let searchTerm: string = event.target.value;
    this.users = this.userProvider.users;
    this.chats = this.chatProvider.chats;
    if(searchTerm) {
      searchTerm = searchTerm.toLowerCase();
      switch(this.view) {
        case 'chats':
          this.chats = <FirebaseListObservable<Chat[]>> this.chats.map((chats: Chat[]) => {
            return chats.filter((chat: Chat) => {
              return chat.title.toLowerCase().indexOf(searchTerm) != -1;
            });
          });
          break;
        case 'users':
          this.users = <FirebaseListObservable<User[]>> this.users.map((users: User[]) => {
            return users.filter((user: User) => {
              return user.name.toLowerCase().indexOf(searchTerm) != -1;
            });
          });
          break;
      }
    }
  }

  chatWith(user: User): void {
    this.userProvider.currentUser.first().subscribe((currentUser: User) => {
      this.chatProvider.getDeepChat(currentUser.$key, user.$key).first().subscribe((chat: Chat) => {
        if (chat.hasOwnProperty('$value')) {
          let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;
          this.chatProvider.create(new Chat('', timestamp, user.name, ''),
            currentUser.$key, user.$key);
          this.chatProvider.create(new Chat('', timestamp, currentUser.name, ''),
            user.$key, currentUser.$key);
        }
      });
    });
    this.navCtrl.push(ChatPage, {
      recipientUser: user
    });
  }

  open(chat: Chat): void {
    let recipientUserId: string = chat.$key;
    this.userProvider.get(recipientUserId).first().subscribe((user: User) => {
      this.navCtrl.push(ChatPage, {
        recipientUser: user
      });
    })
  }
}
