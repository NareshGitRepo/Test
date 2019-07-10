// forms module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
// for international phone number with flags
import { NgModule } from '@angular/core';
import { AboutComponent } from './about.component';
import { AboutRoutes } from './about.router';
//import { AboutService } from './_service/profile.service';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';
import { MaterialModule } from '../_shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AboutRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    InternationalPhoneModule,
    MaterialModule,
    TranslateModule,
    sharedDirectiveModule,
  ],
  declarations: [AboutComponent],
  providers: []

})
export class AboutModule { }
