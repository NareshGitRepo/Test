import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FailedregistrationRoutes } from './failedregistration.router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FailedregistrationmanageComponent } from '../failedregistration/failedregistrationmanage/failedregistrationmanage.component';
import { MaterialModule } from '../../_shared/material.module';
import { FailedRegistrationService } from './_service/failedRegistrationServie';
import { TranslateModule } from '@ngx-translate/core';
import { LimitPipe } from './_pipe/limitPipe';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FailedregistrationRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule
  ],
  declarations: [FailedregistrationmanageComponent,LimitPipe],
  providers: [DatePipe, FailedRegistrationService]
})
export class FailedregistrationModule { }
