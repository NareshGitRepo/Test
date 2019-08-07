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
import { OnlinealertsComponent } from './manage/onlinealerts.component';
import { OnlineAlertsRoutes } from './onlinealerts.router';
import { CreateonlinealertComponent } from './create/createonlinealert.component';
import { OnlinealertdetailsComponent } from './details/onlinealertdetails.component';
import { OnlineAlertsFilterPipe, ProfileFilterPipe } from './_pipe/onlineFilterPipe';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ProfiledetailsComponent } from './detailsprofile/profiledetails.component';
import { CreateDBprofileComponent } from './createprofile/createdbprofile.component';
import { AvatarModule } from 'ngx-avatar';
import { AlertConfirmComponent } from './_model/alertconfirm';
import { TranslateModule } from '@ngx-translate/core';
import { ProfilemanageComponent } from './profilemanage/profilemanage.component';

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
    RouterModule.forChild(OnlineAlertsRoutes),
    NgxMaterialTimepickerModule,
    AvatarModule,
    TranslateModule
  ],
  declarations: [
    OnlinealertsComponent,
    CreateonlinealertComponent,
    OnlinealertdetailsComponent,
    OnlineAlertsFilterPipe,
    ProfileFilterPipe,
    ProfiledetailsComponent,
    CreateDBprofileComponent,
    AlertConfirmComponent,
    ProfilemanageComponent
  ],
  entryComponents: [CreateonlinealertComponent, OnlinealertdetailsComponent, ProfiledetailsComponent, CreateDBprofileComponent, AlertConfirmComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
  ]
})
export class OnlineAlertsModule { }
