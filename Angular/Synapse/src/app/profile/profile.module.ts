import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InternationalPhoneModule } from 'ng4-country-phone-select';
import { ProfileRoutes } from './profile.router';
import { ProfileService } from './_service/profileService';
import { MaterialModule } from '../_shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';
import { ProfileComponent } from './manage/profile.component';
import { ProfileConfirmComponent } from './_model/profileconfirm.component';

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
    sharedDirectiveModule
  ],
  declarations: [ProfileComponent,ProfileConfirmComponent],
  entryComponents:[ProfileConfirmComponent],
  providers:[ProfileService]
})
export class ProfileModule { }
