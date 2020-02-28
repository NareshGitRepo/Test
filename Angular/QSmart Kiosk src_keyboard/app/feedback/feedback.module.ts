import { FeedbackRoutes, customLayouts } from './feedback.router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_KEYBOARD_LAYOUTS, MatKeyboardModule } from '@ngx-material-keyboard/core';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatRadioModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSliderModule,
  MatSnackBarModule,
  MatTableModule,
  MatTabsModule,
} from '@angular/material';

import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback.component';
import { FeedbackService } from './_service/feedback.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';
import { PerfectScrollbarModule } from '../../../node_modules/ngx-perfect-scrollbar';
import {  globalFilterPipeModule } from '../_pipes/pipe.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FeedbackRoutes),
    FlexLayoutModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTableModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatKeyboardModule,
    HttpClientModule,
    // NgVirtualKeyboardModule,
    TranslateModule,
    sharedDirectiveModule,
    PerfectScrollbarModule,
    globalFilterPipeModule
  ],
  providers: [
    FeedbackService,
    { provide: MAT_KEYBOARD_LAYOUTS, useValue: customLayouts }
  ],
  entryComponents: [],
  declarations: [FeedbackComponent]
})
export class FeedbackModule { }
