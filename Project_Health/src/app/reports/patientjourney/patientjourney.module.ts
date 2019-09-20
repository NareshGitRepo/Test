import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PatientjourneymanageComponent } from './patientjourneymanage/patientjourneymanage.component';
import { PatientJourneyRoutes } from './patientjourney.router';
import { PatientcompletejourneyComponent } from './patientcompletejourney/patientcompletejourney.component';
import { DFormatTimePipe } from './_pipe/filterPipe';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { MaterialModule } from '../../_shared/material.module';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PatientJourneyRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    sharedDirectiveModule,
    MaterialModule
  ],
  declarations: [PatientjourneymanageComponent, PatientcompletejourneyComponent,DFormatTimePipe],
  entryComponents: [PatientcompletejourneyComponent]
})
export class PatientJourneyModule { }
