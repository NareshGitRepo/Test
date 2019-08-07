import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../_shared/material.module';
import { TranslateModule } from '@ngx-translate/core';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';

import { AvatarModule } from 'ngx-avatar';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RoommanageComponent } from './roommanage/roommanage.component';
import { RoomcreateComponent } from './roomcreate/roomcreate.component';
import { RoomsRoutes } from './room.router';
import { RoomdetailsComponent } from './roomdetails/roomdetails.component';
import { AddroomComponent } from './addroom/addroom.component';
import { RoomFilterPipe } from './_pipe/RoomFilterPipe';
import { RemoveroomComponent } from './removeroom/removeroom.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(RoomsRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    sharedDirectiveModule,
    MaterialModule,
    TranslateModule,
    PerfectScrollbarModule,
	      AvatarModule,
  ],
  declarations: [ RoomcreateComponent,RoommanageComponent, RoomdetailsComponent, AddroomComponent,RoomFilterPipe,RemoveroomComponent],
  entryComponents: [RoomcreateComponent,RoomdetailsComponent,AddroomComponent,RemoveroomComponent]
})
export class RoomsModule { }
