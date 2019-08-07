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
import { NotificationRoutes } from './setnotification.router';
import { SetnotificationComponent } from './manage/setnotification.component';
import { CreatenotificationComponent } from './create/createnotification.component';
import { NotificationdetailsComponent } from './details/notificationdetails.component';
import { ConfirmNotificationComponent } from './manage/setnotifyconfirm.component';
import { NotifyFilterPipe } from './_pipe/notificationFiterpipe';
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
   FileHelpersModule,
    FileUploadModule,
    TruncateModule,
    sharedDirectiveModule,
    MaterialModule,
    TranslateModule,
    RouterModule.forChild(NotificationRoutes),
  ],

  declarations: [
    SetnotificationComponent,
    NotifyFilterPipe,
    CreatenotificationComponent,
    NotificationdetailsComponent,
    ConfirmNotificationComponent
  ],

  entryComponents: [CreatenotificationComponent,NotificationdetailsComponent,ConfirmNotificationComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})

export class SetNotificationModule { }
