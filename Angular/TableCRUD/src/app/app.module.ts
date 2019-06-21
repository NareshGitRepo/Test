import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import{MatTableModule,MatPaginatorModule, MatInputModule, MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CrudComponent } from './crud/crud.component';
import { FormComponent } from './form/form.component';
import { EditdataComponent } from './editdata/editdata.component';

@NgModule({
  declarations: [
    AppComponent,
    CrudComponent,
    FormComponent,
    EditdataComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [FormComponent,EditdataComponent]
})
export class AppModule { }
