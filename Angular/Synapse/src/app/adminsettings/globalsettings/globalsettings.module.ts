import { NgModule } from '@angular/core';
import { GlobalsettingsComponent } from './manage/globalsettings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { globalsettingsrouts } from './globalsettings.router';
import { MaterialModule } from '../../_shared/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GetKeyData, GetTypePipe } from './pipe/pipe';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { PopoverModule } from 'ngx-bootstrap';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  imports: [
    FormsModule,
    RouterModule.forChild(globalsettingsrouts),
    MaterialModule,
    sharedDirectiveModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TimepickerModule.forRoot(), PopoverModule.forRoot(),
  ],
  declarations: [GlobalsettingsComponent,GetTypePipe,GetKeyData],
  entryComponents: [],
  providers: [DatePipe]
  
})
export class GlobalSettingModule { }