import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { MyApp } from './app.component';
import { CustomLoggedHeaderComponent } from '../components/custom-logged-header/custom-logged-header';
import { MessageBoxComponent } from './../components/message-box/message-box';
import { UserInfoComponent } from './../components/user-info/user-info';
import { UserMenuComponent } from './../components/user-menu/user-menu';
import { ProgressBarComponent } from './../components/progress-bar/progress-bar';
import { SignUpPage } from '../pages/signup/signup';
import { SignInPage } from '../pages/signin/signin';
import { HomePage } from '../pages/home/home';
import { UserProfilePage } from './../pages/user-profile/user-profile';
import { ChatPage } from './../pages/chat/chat';
import { AuthProvider } from '../providers/auth/auth';
import { UserProvider } from '../providers/user/user';
import { ChatProvider } from '../providers/chat/chat';
import { MessageProvider } from '../providers/message/message';

const firebaseAppConfig: FirebaseAppConfig = {
  apiKey: "AIzaSyBQCOObcqGqBV7mcrUmJuHsemRxu-Su_Do",
  authDomain: "ionic-chat-556a0.firebaseapp.com",
  databaseURL: "https://ionic-chat-556a0.firebaseio.com",
  storageBucket: "ionic-chat-556a0.appspot.com",
  messagingSenderId: "194804743105"
};

@NgModule({
  declarations: [
    MyApp,
    CustomLoggedHeaderComponent,
    MessageBoxComponent,
    UserInfoComponent,
    UserMenuComponent,
    ProgressBarComponent,
    SignUpPage,
    SignInPage,
    HomePage,
    UserProfilePage,
    ChatPage
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseAppConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignUpPage,
    SignInPage,
    HomePage,
    UserProfilePage,
    ChatPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    UserProvider,
    ChatProvider,
    MessageProvider
  ]
})
export class AppModule { }
