import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AvatarModule } from 'ngx-avatar';
import { CommonModule } from '@angular/common';
import { CreatealertComponent } from './create/createofflinealert.component';
import { DetailsComponent } from './details/details.component';
import { FileHelpersModule } from 'ngx-file-helpers';
import { FileUploadModule } from 'ng2-file-upload';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../_shared/material.module';
import { NgModule } from '@angular/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { OfflineAlertsFilterPipe } from './_pipe/offlineFilterPipe';
import { OfflineAlertsRoutes } from './offlinealerts.router';
import { OfflinealertsComponent } from './manage/offlinealerts.component';
import { RouterModule } from '@angular/router';
import { TruncateModule } from 'ng2-truncate';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { OfflineAlertConfirmComponent } from './_model/offlineconfirm';
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
    RouterModule.forChild(OfflineAlertsRoutes),
    NgxMaterialTimepickerModule,
    AvatarModule,
    TranslateModule
  ],

  declarations: [
    OfflinealertsComponent,
    CreatealertComponent,
    DetailsComponent,
    OfflineAlertsFilterPipe,
    OfflineAlertConfirmComponent
  ],

  entryComponents: [CreatealertComponent,DetailsComponent,OfflineAlertConfirmComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }

   ]
})

export class OfflineAlertsModule { }
