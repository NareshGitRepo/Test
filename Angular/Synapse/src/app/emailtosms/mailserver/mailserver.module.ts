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
import { MailServerFilterPipe } from './_pipe/mailServerFilterpipe';
import { MailServerRoutes } from './mailserver.router';
import { MailserverComponent } from './manage/mailserver.component';
import { CreatemailserverComponent } from './create/createmailserver.component';
import { MailserverdetailsComponent } from './details/mailserverdetails.component';
import { TranslateModule } from '@ngx-translate/core';
import { AlertConfirmComponent } from './_model/alertconfirm';

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
    sharedDirectiveModule,
    MaterialModule,
    RouterModule.forChild(MailServerRoutes),
    TranslateModule
  ],

  declarations: [
    MailserverComponent,
    MailServerFilterPipe,
    CreatemailserverComponent,
    MailserverdetailsComponent,
    AlertConfirmComponent
  ],

  entryComponents: [CreatemailserverComponent,MailserverdetailsComponent,AlertConfirmComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})

export class MailServerModule { }
