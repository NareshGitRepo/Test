import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PlatformQuotaRoutes } from './platformquota.router';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { TruncateModule } from 'ng2-truncate';
import { FileUploadModule } from 'ng2-file-upload';
import { FileHelpersModule } from 'ngx-file-helpers';


import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { MaterialModule } from '../../_shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { PlatformquotamanageComponent } from './manage/platformquotamanage.component';
import { PlatformquotasetlimitComponent } from './setlimit/platformquotasetlimit.component';
import { PlatformquotaFilterPipe } from './_pipe/platformquotafilterpipe';

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
    RouterModule.forChild(PlatformQuotaRoutes),
    TranslateModule
  ],

  declarations: [
    PlatformquotamanageComponent,
    PlatformquotasetlimitComponent,
    PlatformquotaFilterPipe
  ],

  entryComponents: [PlatformquotasetlimitComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },DatePipe
   ]
})

export class PlatformQuotaModule { }
