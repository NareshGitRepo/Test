import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DepartmentQuotaRoutes } from './departmentquota.router';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TruncateModule } from 'ng2-truncate';
import { FileUploadModule } from 'ng2-file-upload';
import { FileHelpersModule } from 'ngx-file-helpers';

import { DepartmentquotamanageComponent } from './manage/departmentquotamanage.component';
import { DeptquotasetlimitComponent } from './setlimit/deptquotasetlimit.component';
import { DeptquotadetailsComponent } from './details/deptquotadetails.component';
import { DeptquotahistoryComponent } from './history/deptquotahistory.component';
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
    RouterModule.forChild(DepartmentQuotaRoutes),
    TranslateModule
  ],

  declarations: [
    DepartmentquotamanageComponent,
    DeptquotasetlimitComponent,
    DeptquotadetailsComponent,
    DeptquotahistoryComponent,
  ],

  entryComponents: [DeptquotasetlimitComponent,DeptquotadetailsComponent,DeptquotahistoryComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
   ]
})

export class DepartmentQuotaModule { }
