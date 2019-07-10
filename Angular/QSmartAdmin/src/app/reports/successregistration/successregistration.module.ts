import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { successRegRoutes } from './successregistration.router';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'ngx-avatar';
import { MaterialModule } from '../../_shared/material.module';
import { SuccessmanageComponent } from './successmanage/successmanage.component';

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(successRegRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
    AvatarModule
  ],
  declarations: [SuccessmanageComponent],
  providers: [DatePipe, SuccessmanageComponent]
})
export class SuccessRegModule { 
  }