// Angular
import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";

// File Upload Module
import { NgUploaderModule } from "ngx-uploader";
// Component
import { QuickComponent } from "./quick.component";
import { BulkComponent } from "./bulk.component";
// Components Routing
import { CampaignRoutingModule } from "./campaignmanager-routing.module";
// Services
import { AuthenticationService } from "../../services/authentication.service";

import { OWL_DATE_TIME_LOCALE, OwlDateTimeIntl } from "ng-pick-datetime";
import { DateTimeAdapter } from "ng-pick-datetime";
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from "ng-pick-datetime";
import { Injectable } from "@angular/core";
import { OwlMomentDateTimeModule } from "ng-pick-datetime-moment";

import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { LoadingModule, ANIMATION_TYPES } from "ngx-loading";
import { RoleService } from "../../services/usermanagement/role.service";
import { CampaignStatusComponent } from "./campaignstatus.component";
import { CampaignStatusService } from "../../services/campaignmanager/campaignstaus.service";
import { FileService } from "../../services/campaignmanager/file.service";
import { CampaignDetailsService } from "../../services/campaignmanager/campaigndetails.service";
import { CampaignDetailsComponent } from "./campaigndetails.component";
// import { FileService } from "../../services/file.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CampaignRoutingModule,
    BsDropdownModule,
    ReactiveFormsModule,
    NgUploaderModule,
    LoadingModule,
    ConfirmationPopoverModule.forRoot({
      focusButton: "confirm"
    }),
    ChartsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    OwlMomentDateTimeModule,
    NgxDatatableModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  declarations: [
    QuickComponent,
    BulkComponent,
    CampaignStatusComponent,
    CampaignDetailsComponent
  ],
  providers: [AuthenticationService, FileService, RoleService, DatePipe, CampaignStatusService, CampaignDetailsService]
})
export class CampaignManagerModule { }
