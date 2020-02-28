import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LaboratoryComponent } from './laboratory.component';
import { LaboratoryRoutes } from './laboratory.router';
import { LaboratoryService } from './_service/laboratory.service';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DashboardService } from '../dashboard/_service/dashboard.service';
import { globalFilterPipeModule } from '../_pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LaboratoryRoutes),
    TranslateModule,
    FlexLayoutModule,
    globalFilterPipeModule
  ],
  providers: [
    LaboratoryService,
    DashboardService
  ],
  declarations: [LaboratoryComponent]
})
export class LaboratoryModule { }
