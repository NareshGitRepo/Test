import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';


// forms module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroupRoutes } from './group.router';
import { GroupAlertComponent } from './_model/group.alert';
import { TranslateModule } from '@ngx-translate/core';
import { GroupFilterPipe } from './_pipe/group.filters';
import { GroupComponent } from './managegroup/group.component';
import { CreateGroupComponent } from './creategroup/creategroup.component';
import { GroupDetailsComponent } from './groupdetails/groupdetails.component';
import { AvatarModule } from 'ngx-avatar';
import { MaterialModule } from '../../_shared/material.module';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(GroupRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    sharedDirectiveModule,
    TranslateModule,
    AvatarModule
  ],
  declarations: [GroupComponent, CreateGroupComponent, GroupDetailsComponent, GroupFilterPipe, GroupAlertComponent],
  entryComponents: [CreateGroupComponent, GroupAlertComponent,GroupDetailsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class GroupModule { }
