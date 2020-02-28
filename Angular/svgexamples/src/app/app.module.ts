import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HoverComponent } from './hover/hover.component';
import { ClockComponent } from './clock/clock.component';
import { DesktopComponent } from './desktop/desktop.component';
import { CakeComponent } from './cake/cake.component';
import { GaugeComponent } from './gauge/gauge.component';

@NgModule({
  declarations: [
    AppComponent,
    HoverComponent,
    ClockComponent,
    DesktopComponent,
    CakeComponent,
    GaugeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
