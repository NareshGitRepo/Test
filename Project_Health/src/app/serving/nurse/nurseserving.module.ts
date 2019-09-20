import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { AvatarModule } from 'ngx-avatar';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NurseServingRoutes } from './nurseserving.router';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { MaterialModule } from '../../_shared/material.module';
import { NursemanageComponent } from './nursemanage/nursemanage.component';
import { FormatTimePipe, FormatTimePipeWithSec, IgetRoomFilter } from '../_pipe/filterpipe';
import { NursetokenviewComponent } from './nursetokenview/nursetokenview.component';
import { TokentimeviewComponent } from './tokentimeview/tokentimeview.component';
import { NurseAlertComponent } from './nursemanage/nursealert';
import { ServingtokenviewComponent } from './servingtokenview/servingtokenview.component';
import { TokentransformComponent } from './tokentransform/tokentransform.component';
import { PatientjourneyComponent } from './patientjourney/patientjourney.component';
import { VitalservingComponent } from './vitalserving/vitalserving.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(NurseServingRoutes),
    NgxMaterialTimepickerModule.forRoot(),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    sharedDirectiveModule,
    PerfectScrollbarModule,
    MaterialModule,
    TranslateModule,
    AvatarModule
  ],
  declarations: [ NursemanageComponent,FormatTimePipe,FormatTimePipeWithSec,NursetokenviewComponent, TokentimeviewComponent,NurseAlertComponent,  ServingtokenviewComponent, TokentransformComponent, PatientjourneyComponent, VitalservingComponent,IgetRoomFilter],
  entryComponents: [NursetokenviewComponent,TokentimeviewComponent,NurseAlertComponent,ServingtokenviewComponent, TokentransformComponent,PatientjourneyComponent, VitalservingComponent],
  providers: []
})
export class NurseServingModule { }
