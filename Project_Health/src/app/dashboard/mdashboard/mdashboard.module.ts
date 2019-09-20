import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MDashboardRoutes } from './mdashboard.routing';
import { MaterialModule } from '../../_shared/material.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { DrilldowndashboardComponent } from './drilldowndashboard/drilldowndashboard.component';
import { AlertdashboardComponent } from './alertdashboard/alertdashboard.component';
import { MdashboardComponent } from './managedashboard/managedashboard.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MDashboardRoutes),
    FlexLayoutModule,
    MaterialModule,
    PerfectScrollbarModule,
    TranslateModule
  ],
  declarations: [ MdashboardComponent, DrilldowndashboardComponent, AlertdashboardComponent ]
})

export class MDashboardModule {}