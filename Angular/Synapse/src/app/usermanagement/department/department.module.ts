import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DepartmentRoutes } from './department.router';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TruncateModule } from 'ng2-truncate';
import { FileUploadModule } from 'ng2-file-upload';
import { FileHelpersModule } from 'ngx-file-helpers';
// import { QUILL_CONFIG } from 'ngx-quill-wrapper';
// import { QuillConfigInterface } from 'ngx-quill-wrapper';
import { DepartmentComponent } from './manage/department.component';
import { CreatedepartmentComponent } from './create/createdepartment.component';
import { SortDepartmentsPipe } from './_pipe/department.sorting';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { DepartmentdetailsComponent } from './details/departmentdetails.component';
import { ConfirmDepartmentComponent } from './manage/departmentconfirm.component';
import { DepartFilterPipe } from './_pipe/departFilterPipe';
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
    RouterModule.forChild(DepartmentRoutes),
  ],

  declarations: [
    DepartmentComponent,
    CreatedepartmentComponent,
    SortDepartmentsPipe,
    DepartmentdetailsComponent,
    ConfirmDepartmentComponent,
    DepartFilterPipe
  ],

  entryComponents: [CreatedepartmentComponent, DepartmentdetailsComponent, ConfirmDepartmentComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})

export class DepartmentModule { }
