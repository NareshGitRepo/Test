import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TruncateModule } from 'ng2-truncate';
import { FileUploadModule } from 'ng2-file-upload';
import { FileHelpersModule } from 'ngx-file-helpers';
// import { QUILL_CONFIG } from 'ngx-quill-wrapper';
// import { QuillConfigInterface } from 'ngx-quill-wrapper';

import { sharedDirectiveModule } from '../../_directives/sharedDirectives';

import { MaterialModule } from '../../_shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { SMStoEmailRoutes } from './smstoemail.router';
import { SmstoemailComponent } from './manage/smstoemail.component';
import { CreatesmstoemailComponent } from './create/createsmstoemail.component';
import { SmstoemaildetailsComponent } from './details/smstoemaildetails.component';
import { SmstoEmailFilterPipe } from '../smstoemail/_pipe/smstoemailFilterPipe';
import { SmsToEmailConfirm } from './_model/smstoemailConfirm';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    TruncateModule,
    sharedDirectiveModule,
    MaterialModule,
    TranslateModule,
    RouterModule.forChild(SMStoEmailRoutes),
    ReactiveFormsModule,
    PerfectScrollbarModule,
    FormsModule,
    FileHelpersModule,
    FileUploadModule,
   
  ],

  declarations: [
    SmstoemailComponent,
    CreatesmstoemailComponent,
    SmstoemaildetailsComponent,
    SmstoEmailFilterPipe,
    SmsToEmailConfirm
  ],

  entryComponents: [SmsToEmailConfirm,CreatesmstoemailComponent,SmstoemaildetailsComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})

export class SMStoEmailModule { }
