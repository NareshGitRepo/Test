import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { LimitPipe } from './_pipe/limitPipe';
import { MaterialModule } from '../../_shared/material.module';
import { NgModule } from '@angular/core';
import { PrioritizationActionsComponent } from './actions/prioritization-actions.component';
import { PrioritizationComponent } from './manage/prioritization.component';
import { PrioritizationRoutes } from './prioritization.router';
import { PrioritydetailsComponent } from './prioritydetails/prioritydetails.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PrioritizationRoutes),
    FlexLayoutModule,
    FormsModule      ,
    ReactiveFormsModule,
    TranslateModule,
    sharedDirectiveModule,
    MaterialModule
  ],
  declarations: [PrioritizationComponent, PrioritizationActionsComponent,LimitPipe, PrioritydetailsComponent],
  entryComponents : [PrioritizationActionsComponent,PrioritydetailsComponent],
})
export class PrioritizationModule { }
