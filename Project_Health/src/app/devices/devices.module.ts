import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http'
// forms module
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { sharedDirectiveModule } from '../_directives/sharedDirectives';
import { MaterialModule } from '../_shared/material.module';
import { KioskComponent } from './kiosk/kiosk.component';
import { PrintersComponent } from './printers/printers.component';
import { DisplayFilterPipe, KisokFilterPipe, PrinterFilterPipe } from './_pipe/DeviceFilterPipe';
import { DevicesRoutes } from './devices.router';
import { ManageDevicesComponent } from './managedevices/managedevices.component';
import { CreatedevicesComponent } from './createdevices/createdevices.component';
import { DeviceAlertComponent } from './_model/deviceAlert';
import { DevicesService } from './_service/deviceService';
import { DisplayBoardComponent } from './display-board/display-board.component';
import { UrlAlertComponent } from './_model/urlAlert';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DevicesRoutes),
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    HttpClientModule,
    sharedDirectiveModule,
    ClipboardModule,
    MaterialModule
  ],
  declarations: [ManageDevicesComponent, CreatedevicesComponent,UrlAlertComponent, DeviceAlertComponent, KioskComponent, DisplayBoardComponent, PrintersComponent,
  DisplayFilterPipe,KisokFilterPipe,PrinterFilterPipe],
  entryComponents: [CreatedevicesComponent,UrlAlertComponent,DeviceAlertComponent],
  providers: [DevicesService]
})
export class DevicesModule { }
