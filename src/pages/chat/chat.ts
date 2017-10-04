import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';
import { FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

import { AuthProvider } from './../../providers/auth/auth';
import { UserProvider } from './../../providers/user/user';
import { ChatProvider } from './../../providers/chat/chat';
import { MessageProvider } from './../../providers/message/message';
import { User } from './../../models/user';
import { Chat } from './../../models/chat';
import { Message } from './../../models/message';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild(Content) content: Content;
  messages: FirebaseListObservable<Message[]>;
  pageTitle: string;
  sender: User;
  recipient: User;
  private senderChat: FirebaseObjectObservable<Chat>;
  private recipientChat: FirebaseObjectObservable<Chat>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public authProvider: AuthProvider, public userProvider: UserProvider,
    public chatProvider: ChatProvider, public messageProvider: MessageProvider) {

  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {
    this.recipient = this.navParams.get('recipientUser');
    this.pageTitle = this.recipient.name;
    this.userProvider.currentUser.first().subscribe((currentUser: User) => {
      this.sender = currentUser;
      this.senderChat = this.chatProvider.getDeepChat(currentUser.$key, this.recipient.$key);
      this.recipientChat = this.chatProvider.getDeepChat(this.recipient.$key, currentUser.$key);
      if(this.recipient.photo)
        this.senderChat.first().subscribe((chat: Chat) => {
          this.chatProvider.updatePhoto(this.senderChat, chat.photo, this.recipient.photo);
        });
      this.messages = this.messageProvider.getMessages(currentUser.$key, this.recipient.$key);
      this.messages.first().subscribe((messages: Message[]) => {
        if (messages.length === 0)
          this.messages = this.messageProvider.getMessages(this.recipient.$key, currentUser.$key);
        this.messages.subscribe(() => {
          this.scrollToBottom();
        });
      });
    });
  }

  send(message) {
    if (message) {
      let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;
      this.messageProvider.create(new Message(this.sender.$key, message, timestamp),
        this.messages).then(() => {
          this.senderChat.update({
            lastMessage: message,
            timestamp: timestamp
          });
          this.recipientChat.update({
            lastMessage: message,
            timestamp: timestamp
          });
        });
    }
  }

  private scrollToBottom(duration?: number): void {
    if(this.content)
      this.content.scrollToBottom(duration);
  }
}
