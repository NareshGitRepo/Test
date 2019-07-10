import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { LiveReportsComponent } from './livereportsmanage/livereports.component';
import { LiveReportsDetailsComponent } from './live-reports-details/live-reports-details.component';
import { MaterialModule } from '../../_shared/material.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { routes } from './livereports.router';
import { LimitPipeLive } from './_pipe/limitPipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    FormsModule      ,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule
  ],
  declarations: [LiveReportsComponent,LiveReportsDetailsComponent,LimitPipeLive],
  entryComponents: [LiveReportsDetailsComponent],
  providers:[DatePipe]
})
export class LiveReportsModule { }
