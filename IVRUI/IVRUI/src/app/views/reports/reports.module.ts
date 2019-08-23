// Angular
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";

// File Upload Module
import { NgUploaderModule } from "ngx-uploader";
// Components Routing
import { ReportsRoutingModule } from "./reports-routing.module";
// Services
import { AuthenticationService } from "../../services/authentication.service";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { LoadingModule, ANIMATION_TYPES } from "ngx-loading";

import { SummaryComponent } from "./summary.component";
import { DetailedComponent } from "./detailed.component";
import { CallTrackingComponent } from "./calltracking.component";
import { CdrDetailComponent } from "./cdrdetail.component";


import { Component } from "@angular/core";
import { OWL_DATE_TIME_LOCALE, OwlDateTimeIntl } from "ng-pick-datetime";
import { DateTimeAdapter } from "ng-pick-datetime";
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from "ng-pick-datetime";
import { Injectable } from "@angular/core";
import { OwlMomentDateTimeModule } from "ng-pick-datetime-moment";

import { NgSelectModule } from '@ng-select/ng-select';
import { RoleService } from "../../services/usermanagement/role.service";
import { SummaryService } from "../../services/reports/summary.service";
import { DetailedService } from "../../services/reports/detailed.service";
import { CallTrackingService } from "../../services/reports/calltracking.service";
import { FileService } from "../../services/campaignmanager/file.service";
import { CdrDetailService } from "../../services/reports/cdrdetail.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReportsRoutingModule,
    BsDropdownModule,
    ReactiveFormsModule,
    NgUploaderModule,
    LoadingModule,
    ConfirmationPopoverModule.forRoot({
      focusButton: "confirm"
    }),
    ChartsModule,
    NgxDatatableModule,
    OwlDateTimeModule,
    NgSelectModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  declarations: [
    SummaryComponent,
    DetailedComponent,
    CallTrackingComponent,
    CdrDetailComponent,
  ],
  providers: [AuthenticationService, FileService, RoleService, DatePipe, SummaryService, DetailedService, CallTrackingService, CdrDetailService]
})

export class ReportsManagerModule { }
