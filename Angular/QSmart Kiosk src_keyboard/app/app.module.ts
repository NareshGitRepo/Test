import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatInputModule } from '@angular/material/input';
import { AgmCoreModule } from '@agm/core';
import { UserIdleModule } from 'angular-user-idle';

import {
  MatSidenavModule,
  MatCardModule,
  MatMenuModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatTabsModule,
  MatListModule,
  MatSlideToggleModule,
  MatSelectModule,
  MatProgressBarModule,
  MatDividerModule,
  MatCheckboxModule
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';
import { BidiModule } from '@angular/cdk/bidi';

import { HeaderComponent, AdminLayoutComponent } from './core';
import { AppConfig } from './_helpers/app.config';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';

import { MatGridListModule } from '@angular/material/grid-list';
import { DatePipe, registerLocaleData } from '@angular/common';
import { LoadApiUrls } from './_helpers/api.urls';

import arSaLocale from '@angular/common/locales/ar-SA';
import { coreService } from './core/_service/core.service';
import { globalFilterPipeModule } from './_pipes/pipe.module';
import { SvgcircleModule } from './svgcircle/svgcircle.module';
import { sharedDirectiveModule } from './_directives/sharedDirectives';
// import { AuthLayoutComponent } from './core/auth-layout/auth-layout.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json?t='+new Date().getTime());
}

export function loadApiUrlsConfig(config: LoadApiUrls) {
  return () => config.load();
}
export function loadAppConfig(config: AppConfig) {
  return () => config.load();
}

registerLocaleData(arSaLocale);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AdminLayoutComponent,
    // AuthLayoutComponent,
    
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true
    }),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatGridListModule,
    SvgcircleModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    LoadingBarRouterModule,
    MatSidenavModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTabsModule,
    MatListModule,
    MatInputModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatProgressBarModule,
    FlexLayoutModule,
    BidiModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyB3HQ_Gk_XRt6KitPdiHQNGpVn0NDwQGMI' }),
    PerfectScrollbarModule,
    MatDividerModule,
    globalFilterPipeModule,
    UserIdleModule.forRoot({ idle: -1, timeout: 30, ping: 1 }),
    sharedDirectiveModule
  ],
  providers: [
    DatePipe,
    LoadApiUrls,
    coreService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadApiUrlsConfig,
      deps: [LoadApiUrls],
      multi: true
    },
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: loadAppConfig, deps: [AppConfig], multi: true }
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
