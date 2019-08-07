import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UserQuotaRoutes } from './userquota.router';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TruncateModule } from 'ng2-truncate';
import { FileUploadModule } from 'ng2-file-upload';
import { FileHelpersModule } from 'ngx-file-helpers';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { MaterialModule } from '../../_shared/material.module';
import { UserquotaComponent } from './manage/userquota.component';
//import { UserQuotaFilterPipe } from './_pipe/userquotaFilter';
// import { UserquotadetailsComponent } from './details/userquotadetails.component';
// import { UserquotahistoryComponent } from './history/userquotahistory.component';
import { TranslateModule } from '@ngx-translate/core';
import { UserquotasetlimitComponent } from './setlimit/userquotasetlimit.component';
import { UserquotadetailsComponent } from './details/userquotadetails.component';
import { UserquotaFilterPipe } from '../userquota/_pipe/userquotaFilterPipe';

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
    FileHelpersModule,
    FileUploadModule,
    TruncateModule,
    TranslateModule,
    sharedDirectiveModule,
    MaterialModule,
    RouterModule.forChild(UserQuotaRoutes),
  ],

  declarations: [
    UserquotaComponent,
    UserquotasetlimitComponent,
    UserquotadetailsComponent,
    UserquotaFilterPipe
  ],

  entryComponents: [UserquotasetlimitComponent, UserquotadetailsComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
   ]
})

export class UserQuotaModule { }
