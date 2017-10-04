import { NgModule } from '@angular/core';
import { MessageBoxComponent } from './message-box/message-box';
import { UserInfoComponent } from './user-info/user-info';
import { UserMenuComponent } from './user-menu/user-menu';
import { ProgressBarComponent } from './progress-bar/progress-bar';
@NgModule({
	declarations: [MessageBoxComponent,
    UserInfoComponent,
    UserMenuComponent,
    ProgressBarComponent],
	imports: [],
	exports: [MessageBoxComponent,
    UserInfoComponent,
    UserMenuComponent,
    ProgressBarComponent]
})
export class ComponentsModule {}
