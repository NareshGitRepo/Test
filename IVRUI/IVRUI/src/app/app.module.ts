import { BrowserModule } from "@angular/platform-browser";
import { NgModule, APP_INITIALIZER } from "@angular/core";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
// File Upload Module
import { NgUploaderModule } from "ngx-uploader";
// import { CommonModule } from '@angular/common';
import { AuthGuard } from "./guards/auth.guard";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { CommonModule, LocationStrategy, HashLocationStrategy } from "@angular/common";
import { AppComponent } from "./app.component";
import { AuthenticationService } from "./services/authentication.service";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { TokenInterceptor } from "../app/services/token.interceptor";
import { DatePipe } from "@angular/common";
import { DateInfo } from "./beans/date";

// Import routing module
import { AppRoutingModule } from "./app.routing";

// Import 3rd party components
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from "ngx-bootstrap/tabs";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { FormsModule } from "@angular/forms";

import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { LoadingModule } from "ngx-loading";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppConfig } from "./AppConfig";

import { NgSelectModule, NG_SELECT_DEFAULT_CONFIG } from '@ng-select/ng-select';

import { NgxPermissionsModule } from 'ngx-permissions';
import { CustomFormsModule } from 'ng2-validation';


import { SummaryService } from "./services/reports/summary.service";
import { DetailedService } from "./services/reports/detailed.service";
import { CallTrackingService } from "./services/reports/calltracking.service";

import { LoginComponent } from './login/login.component';

// Import containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent,
} from "./containers";

const APP_CONTAINERS = [
  FullLayoutComponent,
  SimpleLayoutComponent
]

// Import components
import {
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
} from "./components";

const APP_COMPONENTS = [
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
]

// Import directives
import {
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from "./directives";




const APP_DIRECTIVES = [
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
]


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ConfirmationPopoverModule.forRoot({
      focusButton: "confirm"
    }),
    ChartsModule,
    HttpClientModule,
    NgxDatatableModule,
    NgUploaderModule,
    LoadingModule,
    NgSelectModule,
    BrowserAnimationsModule,
    NgxPermissionsModule.forRoot(),
    ToastrModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES,
    LoginComponent,

  ],
  providers: [
    AppConfig,
    { provide: APP_INITIALIZER, useFactory: (config: AppConfig) => () => config.load(), deps: [AppConfig], multi: true },
    AuthenticationService,
    SummaryService,
    DetailedService,
    CallTrackingService,
    DateInfo,
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    AuthGuard,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  public myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
}
