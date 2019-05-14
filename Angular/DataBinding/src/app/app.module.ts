import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import { AppComponent } from './app.component';
import { from } from 'rxjs';
import { ListComponent } from './list/list.component';
import { TableComponent } from './table/table.component';
import { AttributesComponent } from './attributes/attributes.component';
import { DomComponent } from './DOM Manipulation/dom.component';




@NgModule({
  declarations: [
    AppComponent,
    ListComponent,
    TableComponent,
    AttributesComponent,
    DomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent,ListComponent,TableComponent,AttributesComponent,DomComponent]
})
export class AppModule { }
