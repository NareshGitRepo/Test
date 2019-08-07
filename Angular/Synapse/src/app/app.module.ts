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
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { OrderModule } from 'ngx-order-pipe';
import { AgmCoreModule } from '@agm/core';
import { TruncateModule } from 'ng2-truncate';
import { FileUploadModule } from 'ng2-file-upload';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BidiModule } from '@angular/cdk/bidi';
import { MenuComponent, HeaderComponent, SidebarComponent, NotificationComponent, OptionsComponent, AdminLayoutComponent, AuthLayoutComponent } from './core';
import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { AppConfig } from './_helpers/app.config';
import { SigninComponent } from './login/signin/signin.component';
import { ToastrModule } from 'ngx-toastr';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { LoadApiUrls } from './_helpers/api.urls';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from '../app/core/index';
import { FileHelpersModule } from 'ngx-file-helpers';
import { SignupComponent } from './login/signup/signup.component';
import { InternationalPhoneModule } from 'ng4-country-phone-select';
import { UtilsModule } from './_utilities/UtilsModule';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { sharedDirectiveModule } from './_directives/sharedDirectives';
import { MaterialModule } from './_shared/material.module';
import { ChangepasswordComponent } from './login/changepassword/manage/changepassword.component';
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
    SigninComponent,
    SignupComponent,
    ChangepasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes, {
      useHash: true,
      preloadingStrategy: PreloadAllModules
    }),
    FormsModule,
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
    OrderModule,
    FileUploadModule,
    FileHelpersModule,
    FlexLayoutModule,
    BidiModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyB3HQ_Gk_XRt6KitPdiHQNGpVn0NDwQGMI' }),
    PerfectScrollbarModule,
    TruncateModule,
    ToastrModule.forRoot({ positionClass: 'toast-top-right' }),
    Ng2SearchPipeModule,
    InternationalPhoneModule,
    NgxChartsModule,
    UtilsModule,
    NgxMaterialTimepickerModule,
    sharedDirectiveModule,
    MaterialModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: loadAppConfig, deps: [AppConfig], multi: true },
    LoadApiUrls,
    { provide: APP_INITIALIZER, useFactory: loadApiUrlsConfig, deps: [LoadApiUrls], multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }