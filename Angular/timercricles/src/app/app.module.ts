import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SvgcricleComponent } from './svgcricle/svgcricle.component';
import { AngularGaugeComponent } from './angular-gauge/angular-gauge.component';
import { TimePipe } from './timepipe';
import { GaugeModule } from 'angular-gauge';

@NgModule({
  declarations: [
    AppComponent,
    SvgcricleComponent,
    AngularGaugeComponent,
    TimePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GaugeModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
