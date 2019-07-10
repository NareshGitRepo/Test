import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeedbackComponent } from './feedback/feedback.component';
import { FeedbackService } from './_service/feedbackService';
import { FeedbackRoutes } from './feedback.router';
import { MaterialModule } from '../../_shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { feedbackLimitPipe } from './_pipe/feedbacklimitPipe';

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(FeedbackRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule,
  ],
  declarations: [FeedbackComponent,feedbackLimitPipe],
  providers:[DatePipe,FeedbackService]
})
export class FeedbackModule { }
