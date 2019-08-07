import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule }
  from 'ngx-perfect-scrollbar';

import { CalendarModule } from 'primeng/calendar';

import { FileHelpersModule } from 'ngx-file-helpers';
import { FileUploadModule } from 'ng2-file-upload';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { PopoverModule } from 'ngx-bootstrap';
import { RouterModule } from '@angular/router';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TruncateModule } from 'ng2-truncate';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { SegmentManagementComponent } from './manage/segment-management.component';
import { segmentRoutes } from './segment-management.routing';
import { AvatarModule } from 'ngx-avatar';
import { SegementFilterPipe } from './_pipe/segmentFilterPipe';
import { ConfirmSegmentComponent } from './segment-manageConfirm.component';
import { AddsegmentComponent } from './segment/segmentCreate/addsegment.component';
import { CreateCustomerComponent } from './customer-profile/createCustomer/createprofile.component';
import { SegmentDetailsComponent } from './segment/details/segment-details.component';
import { CustomerdetailsComponent } from './customer-profile/details/customerdetails.component';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../_shared/material.module';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};
@NgModule({
  imports: [
    CommonModule,
    AvatarModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    FormsModule,
    MaterialModule,
    FileHelpersModule,
    FileUploadModule,
    TruncateModule,
    TranslateModule,
    RouterModule.forChild(segmentRoutes),
    CalendarModule, sharedDirectiveModule,
    TimepickerModule.forRoot(), PopoverModule.forRoot(),
  ],
  declarations: [
    SegmentManagementComponent,
    AddsegmentComponent,
    SegementFilterPipe,
    ConfirmSegmentComponent,
    CreateCustomerComponent,
    SegmentDetailsComponent,
    CustomerdetailsComponent
  ],
  entryComponents: [SegmentDetailsComponent, CustomerdetailsComponent, ConfirmSegmentComponent, AddsegmentComponent, CreateCustomerComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    }, DatePipe]
})
export class SegmentManagementModule { }
