import { DFormatTimePipe, DFormatTimePipeWithSec } from '../_pipe/filterpipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AvatarModule } from 'ngx-avatar';
import { CommonModule } from '@angular/common';
import { DoctorAlertComponent } from './doctorservice/doctoralert';
import { DoctorServingRoutes } from './doctorserving.router';
import { DoctorserviceComponent } from './doctorservice/doctorservice.component';
import { DoctortokentransferComponent } from './doctortokentransfer/doctortokentransfer.component';
import { DoctortokenviewComponent } from './doctortokenview/doctortokenview.component';
import { DpatientjourneyComponent } from './dpatientjourney/dpatientjourney.component';
import { DtokentimeviewComponent } from './dtokentimeview/dtokentimeview.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../_shared/material.module';
import { NgModule } from '@angular/core';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DoctorServingRoutes),
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
  declarations: [DoctorserviceComponent,DFormatTimePipe, DFormatTimePipeWithSec, DoctortokenviewComponent, DtokentimeviewComponent,DoctorAlertComponent, DoctortokentransferComponent, DpatientjourneyComponent],
  entryComponents: [DtokentimeviewComponent,DoctortokenviewComponent,DoctorAlertComponent,DoctortokentransferComponent,DpatientjourneyComponent],
  providers: []
})
export class DoctorServingModule { }
