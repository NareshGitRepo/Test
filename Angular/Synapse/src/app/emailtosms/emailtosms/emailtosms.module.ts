import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TruncateModule } from 'ng2-truncate';
import { FileUploadModule } from 'ng2-file-upload';
import { FileHelpersModule } from 'ngx-file-helpers';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';

import { MaterialModule } from '../../_shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { EmailtosmsComponent } from './manage/emailtosms.component';
import { EmailRoutestoSMS } from './emailtosms.router';
import { CreateemailtosmsComponent } from './create/createemailtosms.component';
import { EmailtosmsdetailsComponent } from './details/emailtosmsdetails.component';
import { MatCheckboxModule } from '@angular/material';
import { EmailtoSmsFilterPipe } from '../emailtosms/_pipe/emailtosmsFiterPipe';
import { EmailToSmsConfirmComponent } from './_model/emailtosms.confirm';
import { AvatarModule } from 'ngx-avatar';

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
    MatCheckboxModule,
    sharedDirectiveModule,
    MaterialModule,
    TranslateModule,
    AvatarModule,
    RouterModule.forChild(EmailRoutestoSMS),
  ],

  declarations: [
    EmailtosmsComponent,
    CreateemailtosmsComponent,
    CreateemailtosmsComponent,
    EmailtosmsdetailsComponent,
    EmailtosmsdetailsComponent,
    EmailtoSmsFilterPipe,
    EmailToSmsConfirmComponent
  ],

  entryComponents: [CreateemailtosmsComponent, EmailtosmsdetailsComponent,EmailToSmsConfirmComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})

export class EmailtoSMSModule { }
