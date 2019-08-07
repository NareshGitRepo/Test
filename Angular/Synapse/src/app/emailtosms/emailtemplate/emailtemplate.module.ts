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
import { TranslateModule } from '@ngx-translate/core';
import { EmailTemplateRoutes } from './emailtemplate.router';
import { EmailTemplateComponent } from './manage/emailtemplate.component';
import { CreateEmailTemplateComponent } from './create/createemailtemplate.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EmailTemplateDetailsComponent } from './details/emailtemplatedetails.component';
import { EmailTemplateFilterPipe } from '../emailtemplate/_pipe/emailtemplateFilterPipe';
import { QuillModule } from 'ngx-quill';
import { DndModule } from 'ng2-dnd';
import { AlertConfirmComponent } from './_model/alertconfirm';
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
    AngularEditorModule,
    QuillModule,
    DndModule.forRoot(),
    RouterModule.forChild(EmailTemplateRoutes),
  ],

  declarations: [
    EmailTemplateComponent,
    CreateEmailTemplateComponent, 
    EmailTemplateDetailsComponent,
    EmailTemplateFilterPipe,
    AlertConfirmComponent
  ],

  entryComponents: [CreateEmailTemplateComponent, EmailTemplateDetailsComponent,AlertConfirmComponent],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})

export class EmailTemplateModule { }
