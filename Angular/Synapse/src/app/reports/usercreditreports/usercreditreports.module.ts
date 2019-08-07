import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatetimepickerModule, MatNativeDatetimeModule } from '@mat-datetimepicker/core';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule }
  from 'ngx-perfect-scrollbar';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { CalendarModule } from 'primeng/calendar';
import { FileHelpersModule } from 'ngx-file-helpers';
import { FileUploadModule } from 'ng2-file-upload';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { RouterModule } from '@angular/router';
import { TruncateModule } from 'ng2-truncate';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives'
import { MaterialModule } from '../../_shared/material.module';
import { UserCreditreportsRoutes } from './usercreditreports.router';
import { UsercreditreportsComponent } from './manage/usercreditreports.component';
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
    RouterModule.forChild(UserCreditreportsRoutes),
    NgxMaterialTimepickerModule,
    AmazingTimePickerModule,
    CalendarModule,
    sharedDirectiveModule,
    MaterialModule,
    TranslateModule
  ],
  declarations: [
    UsercreditreportsComponent
  ],
  entryComponents: [],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,

    }, DatePipe]
})
export class UsercreditreportsModule { }
