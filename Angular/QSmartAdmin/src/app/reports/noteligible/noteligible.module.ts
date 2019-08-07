import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../_shared/material.module';
import { NgModule } from '@angular/core';
import { NoteligibleComponent } from './noteligiblemanage/noteligible.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { routes } from './noteligible.router';
import { NotLimitPipe } from './_pipe/notlimitPipe';

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
  declarations: [NoteligibleComponent,NotLimitPipe],
  providers:[DatePipe]
})
export class NoteligibleModule { }
