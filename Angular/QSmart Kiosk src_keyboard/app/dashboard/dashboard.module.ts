import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardService } from './_service/dashboard.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { globalFilterPipeModule } from '../_pipes/pipe.module';
import { SvgcircleModule } from '../svgcircle/svgcircle.module';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    TranslateModule,
    FlexLayoutModule,
    globalFilterPipeModule,
    SvgcircleModule
  ],
  providers: [
    DashboardService,
  ],
  declarations: [DashboardComponent]


})

export class DashboardModule { }
