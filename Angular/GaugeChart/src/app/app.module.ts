import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { GaugeChartModule } from 'angular-gauge-chart';
import { GuageChartType1Component } from './guage-chart-type1/guage-chart-type1.component';
import { GuageChartType2Component } from './guage-chart-type2/guage-chart-type2.component';
import { GuageChartType3Component } from './guage-chart-type3/guage-chart-type3.component';
import { GuageChartType4Component } from './guage-chart-type4/guage-chart-type4.component'
@NgModule({
  declarations: [
    AppComponent,
    GuageChartType1Component,
    GuageChartType2Component,
    GuageChartType3Component,
    GuageChartType4Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GaugeChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
