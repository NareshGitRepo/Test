import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { SmsTemplateFilterPipe } from './_pipe/smstemplateFilterPipe';
import { MaterialModule } from '../../_shared/material.module';
import { SmsTemplateComponent } from './manage/smstemplate.component';
import { SmsTemplateRoutes } from './smstemplate.router';
import { CreateSmsTemplateComponent } from './create/createsmstemplate.component';
import { SmsTempaltedetailsComponent } from './details/smatemplatedetails.component';
import { ConfirmSmsTemplateComponent } from './manage/smstemplateconfirm.component';
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
    sharedDirectiveModule,
    MaterialModule,
    TranslateModule,
    RouterModule.forChild(SmsTemplateRoutes),
  ],
  declarations: [
    SmsTemplateComponent,
    CreateSmsTemplateComponent,
    SmsTemplateFilterPipe,
    SmsTempaltedetailsComponent,
    ConfirmSmsTemplateComponent
  ],

  entryComponents: [CreateSmsTemplateComponent, SmsTempaltedetailsComponent, ConfirmSmsTemplateComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})

export class SmsTemplateModule { }
