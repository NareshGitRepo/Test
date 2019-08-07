import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsersRoutes } from './users.router';
import { CreateuserComponent } from './createuser/createuser.component';
import { AvatarModule } from 'ngx-avatar';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import { UserAlertComponent } from './_model/userAlert';
import { TranslateModule } from '@ngx-translate/core';
import { UserManageComponent } from './usermanage/usermanage.component';
import { UserFilterPipe } from './_pipe/UserFilterPipe';
import { MaterialModule } from '../_shared/material.module';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';
import { UserdetailsComponent } from './userdetails/userdetails.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { AssigndoctorsComponent } from './assigndoctors/assigndoctors.component';
import { AmazingTimePickerModule } from 'amazing-time-picker';

import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ManualtokencreateComponent } from './manualtokencreate/manualtokencreate.component';

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(UsersRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AvatarModule,
    InternationalPhoneModule,
    TranslateModule,
    MaterialModule,
    AngularDualListBoxModule,
    sharedDirectiveModule,
    AmazingTimePickerModule,
    TimepickerModule.forRoot(), PopoverModule.forRoot(),
  ],
  declarations: [UserFilterPipe, ManualtokencreateComponent,UserManageComponent,UserdetailsComponent,AssigndoctorsComponent, CreateuserComponent,UserAlertComponent, AssigndoctorsComponent],
  entryComponents: [ManualtokencreateComponent,CreateuserComponent,UserAlertComponent,UserdetailsComponent,AssigndoctorsComponent], 
})
export class UsersModule { }