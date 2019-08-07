import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { InternationalPhoneModule } from 'ng4-country-phone-select';

import { TranslateModule } from '@ngx-translate/core';
import { UsermanagementComponent } from './manage/usermanagement.component';
import { UserRoutes } from './user.routing';
import { UsercreateComponent } from './create/usercreate.component';

import { UserdetailsComponent } from './details/userdetails.component';
import { UserActionsComponent } from './actions/useractions.component';
import { UserFilterPipe } from './_model/userFilterPipe';
import { MaterialModule } from '../../_shared/material.module';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(UserRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    Ng2SearchPipeModule,
    InternationalPhoneModule,
    TranslateModule,
    MaterialModule,
    sharedDirectiveModule
  ],
  declarations: [UsermanagementComponent, UsercreateComponent, UserFilterPipe, UserdetailsComponent,
    UserActionsComponent],
  entryComponents: [UsermanagementComponent, UsercreateComponent, UserdetailsComponent,
    UserActionsComponent],
  providers: [

  ]
})

export class UserModule {

}
