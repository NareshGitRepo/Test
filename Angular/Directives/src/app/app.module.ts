import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ColorDirective } from './color.directive';
import { sharedDirectiveModule } from './_directives/sharedDirectives';

@NgModule({
  declarations: [
    AppComponent,
    ColorDirective,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    sharedDirectiveModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
