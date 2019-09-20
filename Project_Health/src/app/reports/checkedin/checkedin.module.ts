import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckedinRoutes } from './checkedin.router';
import { CheckedinmanageComponent } from './checkedinmanage/checkedinmanage.component';
import { MaterialModule } from '../../_shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { CheckinLimitPipe } from './_pipe/checkinlimitPipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CheckedinRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule
  ],
  declarations: [ CheckedinmanageComponent,CheckinLimitPipe],
  providers: [DatePipe]
})
export class CheckedinModule { }
