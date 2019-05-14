import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms'
import { AppComponent } from './app.component';
import { from } from 'rxjs';
import { ListComponent } from './list/list.component';
import { TableComponent } from './table/table.component';
import { AttributesComponent } from './attributes/attributes.component';
import { DomComponent } from './DOM Manipulation/dom.component';
import { HttpClientModule } from '@angular/common/http';
import { Homeservice } from './service/home.service';



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
    HttpClientModule
  ],
  providers: [Homeservice],
  bootstrap: [AppComponent,ListComponent,TableComponent,AttributesComponent,DomComponent]
})
export class AppModule { }
