import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatCardModule, MatButtonModule, MatListModule, MatProgressBarModule, MatMenuModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { FDashboardRoutes } from './fdashboard.routing';
import { TranslateModule } from '@ngx-translate/core';
import { FDashboardComponent } from './fdashboard/fdashboard.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FDashboardRoutes),
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatProgressBarModule,
    MatMenuModule,
    FlexLayoutModule,
    PerfectScrollbarModule,
    ChartsModule,
    TranslateModule
  ],
  declarations: [ FDashboardComponent ]
})

export class FDashboardModule {}
