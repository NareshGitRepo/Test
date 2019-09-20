import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ManageFacilityComponent } from './managefacility/managefacility.component';
import { UpdateFacilityComponent } from './updatefacility/updatefacility.component';
import { FacilityRoutes } from './facility.router';
import { sharedDirectiveModule } from '../../_directives/sharedDirectives';
import { TranslateModule } from '@ngx-translate/core';
import { FacilityFilterPipe } from './_pipe/facilityFilterPipe';
import { MaterialModule } from '../../_shared/material.module';
import { FacilityAlertComponent } from './_model/facilityAlert';
import { InternationalPhoneModule } from 'ng4-intl-phone';
import { AvatarModule } from 'ngx-avatar';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FacilityRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    sharedDirectiveModule,
    TranslateModule,
    MaterialModule,
    InternationalPhoneModule,
    AvatarModule
  ],
  declarations: [ManageFacilityComponent, FacilityAlertComponent, UpdateFacilityComponent, FacilityFilterPipe],
  entryComponents: [UpdateFacilityComponent, FacilityAlertComponent]
})
export class FacilityModule { }
