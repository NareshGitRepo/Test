import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {MatIconModule, MatStepperModule, MatButtonModule, MatInputModule, MatFormFieldModule, MatTableModule,
   MatCardModule, MatRadioModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatGridListModule, MatListModule} from '@angular/material';

import { RegformComponent } from './regform/regform.component';
import { LoginComponent } from './login/login.component';
import { ResponsemsgComponent } from './responsemsg/responsemsg.component';
import { ValidpageComponent } from './validpage/validpage.component';
import { InvalidpageComponent } from './invalidpage/invalidpage.component';

@NgModule({
  declarations: [
    AppComponent,
    RegformComponent,
    LoginComponent,
    ResponsemsgComponent,
    ValidpageComponent,
    InvalidpageComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatStepperModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatTableModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatListModule,
    MatCardModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
