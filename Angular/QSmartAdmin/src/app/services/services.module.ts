import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../_shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { ServicesRoutes } from './services.router';
import { CreateservicesComponent } from './createservices/createservices.component';
import { ManageservicesComponent } from './manageservices/manageservices.component';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';
import { ServiceAlertComponent } from './_model/serviceAlert';
import { RoommappingComponent } from './roommapping/roommapping.component';
import { RoomMappingDetailsComponent } from './roommapping-details/room-mapping-details.component';
import { ServiceFilterPipe, LevelFilterPipe } from './_pipe/ServiceFilterPipe';
import { AssignservicesComponent } from './assignservices/assignservices.component';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { AvatarModule } from 'ngx-avatar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ServicesRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AngularDualListBoxModule,
    sharedDirectiveModule,
    MaterialModule,
    TranslateModule,
    AvatarModule,
    PerfectScrollbarModule,
  ],
  declarations: [CreateservicesComponent,ManageservicesComponent,ServiceAlertComponent, RoommappingComponent,RoomMappingDetailsComponent,ServiceFilterPipe,LevelFilterPipe, AssignservicesComponent],
  entryComponents: [CreateservicesComponent,ManageservicesComponent,ServiceAlertComponent,RoommappingComponent,RoomMappingDetailsComponent,AssignservicesComponent]
})
export class ServicesModule { }
