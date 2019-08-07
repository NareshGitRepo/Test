import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
// forms module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// for international phone number with flags
import { InternationalPhoneModule } from 'ng4-country-phone-select';
import { ManualtokenComponent } from './manualtokenmanage/manualtoken.component';
import { ManualtokenRoutes } from './manualtoken.router';
import { TranslateModule } from '@ngx-translate/core';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';
import { MaterialModule } from '../_shared/material.module';

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forChild(ManualtokenRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    InternationalPhoneModule,
    TranslateModule,
    sharedDirectiveModule,
    MaterialModule
  ],
  declarations: [ManualtokenComponent],
  entryComponents: []
})
export class ManualtokenModule { }
