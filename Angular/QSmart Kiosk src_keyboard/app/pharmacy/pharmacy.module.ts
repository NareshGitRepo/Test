import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PharmacyComponent } from './pharmacy.component';
import { PharmacyRoutes, customLayouts } from './pharmacy.router';
import { PharmacyService } from './_service/pharmacy.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardService } from '../dashboard/_service/dashboard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatButtonModule, MatOptionModule, MatSelectModule, MatCheckboxModule, MatSnackBar, MatSnackBarModule } from '@angular/material';
import { MAT_KEYBOARD_LAYOUTS, MatKeyboardModule } from '@ngx-material-keyboard/core';
import { PerfectScrollbarModule } from '../../../node_modules/ngx-perfect-scrollbar';
import {  globalFilterPipeModule } from '../_pipes/pipe.module';
import { SvgcircleModule } from '../svgcircle/svgcircle.module';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PharmacyRoutes),
    TranslateModule,
    FlexLayoutModule,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatKeyboardModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    PerfectScrollbarModule,
    MatSnackBarModule,
    globalFilterPipeModule,
    SvgcircleModule,
    sharedDirectiveModule
  ],
  providers: [
    PharmacyService,
    DashboardService,
    {
      provide: MAT_KEYBOARD_LAYOUTS, useValue: customLayouts
    }
  ],
  declarations: [PharmacyComponent]
})
export class PharmacyModule { }
