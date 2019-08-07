// forms module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
// for international phone number with flags
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { ProfileRoutes } from './profile.router';
import { ProfileService } from './_service/profile.service';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';
import { MaterialModule } from '../_shared/material.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProfileRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    InternationalPhoneModule,
    MaterialModule,
    TranslateModule,
    sharedDirectiveModule,
  ],
  declarations: [ProfileComponent],
  providers: [ProfileService]

})
export class ProfileModule { }
