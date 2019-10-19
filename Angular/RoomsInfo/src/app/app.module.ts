import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetRoomsByFloorIdComponent } from './get-rooms-by-floor-id/get-rooms-by-floor-id.component';
import {MatGridListModule, MatCardModule, MatSnackBarModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule} from '@angular/material';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { UpdateRoomInfoComponent } from './update-room-info/update-room-info.component';
import { ValidateMrnNoComponent } from './validate-mrn-no/validate-mrn-no.component';
@NgModule({
  declarations: [
    AppComponent,
    GetRoomsByFloorIdComponent,
    RoomDetailsComponent,
    UpdateRoomInfoComponent,
    ValidateMrnNoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [RoomDetailsComponent,UpdateRoomInfoComponent]
})
export class AppModule { }
