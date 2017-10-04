import { Component, Input } from '@angular/core';
import { App, AlertController, MenuController } from 'ionic-angular';

import { BaseComponent } from '../base';
import { AuthProvider } from '../../providers/auth/auth';
import { User } from './../../models/user';

@Component({
  selector: 'custom-logged-header',
  templateUrl: 'custom-logged-header.html'
})
export class CustomLoggedHeaderComponent extends BaseComponent {

  @Input() user: User;
  @Input() title: string;

  constructor(
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public app: App,
    public menuCtrl: MenuController
  ) {
    super(alertCtrl, authProvider, app, menuCtrl);
  }
}
