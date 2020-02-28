import { CheckinRoutes, customLayouts } from './checkin.router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_KEYBOARD_LAYOUTS, MatKeyboardModule } from '@ngx-material-keyboard/core';
import {
  MatButtonModule,
  MatDialogModule,
  MatDialogRef,
  MatInputModule,
  MatTableModule,
} from '@angular/material';

import { CheckinComponent } from './checkin.component';
import { CheckinService } from './_service/checkin.service';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../dashboard/_service/dashboard.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { RegisterService } from '../registration/_service/register.service';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';
import { PerfectScrollbarModule } from '../../../node_modules/ngx-perfect-scrollbar';
import { globalFilterPipeModule } from '../_pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CheckinRoutes),
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatKeyboardModule,
    // NgVirtualKeyboardModule,
    sharedDirectiveModule,
    TranslateModule,
    PerfectScrollbarModule,
    globalFilterPipeModule
  ],
  providers: [
    CheckinService,
    RegisterService,
    DashboardService,
    {
      provide: MAT_KEYBOARD_LAYOUTS, useValue: customLayouts
    }
  ],
  declarations: [CheckinComponent],
})

export class CheckinModule { }
