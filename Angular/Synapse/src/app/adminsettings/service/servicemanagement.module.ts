import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule }
  from 'ngx-perfect-scrollbar';
import { ConfirmServiceDeleteComponent } from './manage/serviceconfirm.component';
import { CreateServiceComponent } from './create/createservice.component';
import { FileHelpersModule } from 'ngx-file-helpers';
import { FileUploadModule } from 'ng2-file-upload';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ServiceManagementRouts } from './servicemanagement.routing';
import { ServicedetailsComponent } from './details/servicedetails.component';
import { ServicemanagementComponent } from './manage/servicemanagement.component';
import { ServicesFilterPipe } from './_pipe/userFilterPipe';
import { TruncateModule } from 'ng2-truncate';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
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
    FileHelpersModule,
    FileUploadModule,
    TruncateModule,
    sharedDirectiveModule,
    MaterialModule,
    TranslateModule,
    RouterModule.forChild(ServiceManagementRouts),
  ],

  declarations: [
    ServicemanagementComponent,
    CreateServiceComponent,
    ServicedetailsComponent,
    ServicesFilterPipe,
    ConfirmServiceDeleteComponent
  ],

  entryComponents: [CreateServiceComponent,ServicedetailsComponent,ConfirmServiceDeleteComponent],

  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    // {
    //   provide: QUILL_CONFIG,
    //   useValue: DEFAULT_QUILL_CONFIG
    // }
  ]

})
export class ServiceManagementModule { }
