import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GroupManagementRoutes } from './groupmanagement.router';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface }
  from 'ngx-perfect-scrollbar';
import { TruncateModule } from 'ng2-truncate';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { CreategroupComponent } from './create/creategroup.component';
import { GroupusersComponent } from './groupusers/groupusers.component';
import { GroupdetailsComponent } from './details/groupdetails.component';
import { GroupFilterPipe, GroupDisableFilterPipe } from './_pipe/groupFilterPipe';
import { ManageGroupComponent } from './manage/managegroup.component';
import { ConfirmGroupDeleteComponent } from './_model/groupconfirm.component';
import { MaterialModule } from '../../_shared/material.module';
import { TranslateModule } from '@ngx-translate/core';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};
@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    FormsModule,
    TruncateModule,
    sharedDirectiveModule,
    MaterialModule,
    TranslateModule,
    RouterModule.forChild(GroupManagementRoutes),
  ],
  declarations: [
    ManageGroupComponent,
    CreategroupComponent,
    GroupFilterPipe,
    GroupusersComponent,
    GroupdetailsComponent,
    ConfirmGroupDeleteComponent,
    GroupDisableFilterPipe
  ],
  entryComponents: [CreategroupComponent, GroupusersComponent, GroupdetailsComponent, ConfirmGroupDeleteComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    ]
})
export class GroupManagementModule { }
