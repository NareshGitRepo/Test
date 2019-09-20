import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, PreloadingStrategy, PreloadAllModules, Router } from '@angular/router';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AgmCoreModule } from '@agm/core';

import { FlexLayoutModule } from '@angular/flex-layout';
import { BidiModule } from '@angular/cdk/bidi';

import {
  MenuComponent,
  HeaderComponent,
  SidebarComponent,
  NotificationComponent,
  OptionsComponent,
  AdminLayoutComponent,
  AuthLayoutComponent
} from './core';

import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { ToastrModule } from 'ngx-toastr';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from '../app/core/index';
import { LoginComponent } from './login/login.component';
import { LoadApiUrls } from './_helpers/api.urls';
import { AppConfig } from './_helpers/app.config';
import { MaterialModule } from './_shared/material.module';

import { InternationalPhoneModule } from 'ng4-intl-phone';
import { DatePipe } from '@angular/common';
import { ReceptionareaComponent } from './displays/receptionarea/receptionarea.component';
import { DisplaysareaComponent } from './displays/displaysarea/displaysarea.component';
import { WaitingareaComponent } from './displays/waitingarea/waitingarea.component';

import { TokenalertComponent } from './displays/tokenalert/tokenalert.component';
import { sharedDirectiveModule } from './_directives/sharedDirectives';
import { DisplayerrorComponent } from './displays/displayerror/displayerror.component';
import { WaitingareaSyncComponent } from './displays/waitingarea-sync/waitingarea-sync.component';
import { BuildingmanageComponent } from './building/buildingmanage/buildingmanage.component';

// import { RegFilterPipe } from './reports/_pipe/registration.filter';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
export function loadAppConfig(config: AppConfig) {
  return () => config.load();
}
export function loadApiUrlsConfig(config: LoadApiUrls) {
  return () => config.load();
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 2,
  wheelPropagation: true,
  minScrollbarLength: 20
};

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    NotificationComponent,
    OptionsComponent,
    MenuComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    LoginComponent,
    ReceptionareaComponent,
    DisplaysareaComponent,
    WaitingareaComponent,WaitingareaSyncComponent,
    TokenalertComponent,
    DisplayerrorComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(AppRoutes, { useHash: true, preloadingStrategy: PreloadAllModules }),
    FormsModule,
    InternationalPhoneModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatGridListModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    LoadingBarRouterModule,
    FlexLayoutModule,
    BidiModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyB3HQ_Gk_XRt6KitPdiHQNGpVn0NDwQGMI' }),
    PerfectScrollbarModule,
    ToastrModule.forRoot({ positionClass: 'toast-top-right' }),
    Ng2SearchPipeModule,
    sharedDirectiveModule
  ],
  entryComponents:[TokenalertComponent],
  providers: [
    LoadApiUrls,
    {
      provide: APP_INITIALIZER,useFactory: loadApiUrlsConfig, deps: [LoadApiUrls], multi: true
    },
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: loadAppConfig, deps: [AppConfig], multi: true },
      DatePipe,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
