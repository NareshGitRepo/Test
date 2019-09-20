import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FlexLayoutModule } from '@angular/flex-layout';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InternationalPhoneModule } from 'ng4-country-phone-select';
import { ErrorpageComponent } from './manageerror/manageerror.component';
import { ErrorpageRoutes } from './errorpage.router';
import { CreateErrorComponent } from './createerror/createerror.component';
import { AvatarModule } from 'ngx-avatar';
import { ErrorpageService } from './_service/errorpage.service';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorFilterPipe } from './_pipe/ErrorFilterPipe';
import { MaterialModule } from '../_shared/material.module';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ErrorpageRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    InternationalPhoneModule,
    AvatarModule,
    PerfectScrollbarModule,
    sharedDirectiveModule,
    TranslateModule,
    MaterialModule
  ],
  declarations: [ErrorFilterPipe, ErrorpageComponent, CreateErrorComponent],
  entryComponents: [CreateErrorComponent],
  providers: [ErrorpageService]
})
export class ErrorPageModule { }
