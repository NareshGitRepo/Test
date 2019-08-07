import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule }
  from 'ngx-perfect-scrollbar';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import {CalendarModule} from 'primeng/calendar';
import { FileHelpersModule } from 'ngx-file-helpers';
import { FileUploadModule } from 'ng2-file-upload';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { RouterModule } from '@angular/router';
import { TruncateModule } from 'ng2-truncate';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives'
import { AuditreportsRoutes } from './auditreports.router';
import { AuditreportsComponent } from './manage/auditreports.component';
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
    MaterialModule,
    RouterModule.forChild(AuditreportsRoutes),
    NgxMaterialTimepickerModule,
    AmazingTimePickerModule,
    CalendarModule,
    sharedDirectiveModule,
    TranslateModule,
  ],
  declarations: [
    AuditreportsComponent
  ],
  entryComponents: [],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,

    }, DatePipe]
})
export class AuditreportsModule { }
