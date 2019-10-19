import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { GaugeChartModule } from 'angular-gauge-chart';
import { GuageChartType1Component } from './guage-chart-type1/guage-chart-type1.component';
import { GuageChartType2Component } from './guage-chart-type2/guage-chart-type2.component';
import { GuageChartType3Component } from './guage-chart-type3/guage-chart-type3.component';
import { GuageChartType4Component } from './guage-chart-type4/guage-chart-type4.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { GaugeChartType5Component } from './gauge-chart-type5/gauge-chart-type5.component';
import {MatButtonModule} from '@angular/material/button';
@NgModule({
  declarations: [
    AppComponent,
    GuageChartType1Component,
    GuageChartType2Component,
    GuageChartType3Component,
    GuageChartType4Component,
    GaugeChartType5Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GaugeChartModule,
    MatGridListModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
