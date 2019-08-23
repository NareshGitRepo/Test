// Angular
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChartsModule } from "ng2-charts/ng2-charts";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";

// File Upload Module
import { NgUploaderModule } from "ngx-uploader";
import { UserComponent } from "./user.component";
import { RoleComponent } from "./role.component";
// Components Routing
import { UserManagementRoutingModule } from "./usermanagement-routing.module";
// Services
import { AuthenticationService } from "../../services/authentication.service";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { ConfirmationPopoverModule } from "angular-confirmation-popover";
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { LoadingModule, ANIMATION_TYPES } from "ngx-loading";
// import { SelectModule } from 'ng2-select';
import { RoleService } from "../../services/usermanagement/role.service";
import { UserService } from "../../services/usermanagement/user.service";
import { FileService } from "../../services/campaignmanager/file.service";
import { NgSelectModule } from '@ng-select/ng-select';
import { CustomFormsModule } from 'ng2-validation';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    UserManagementRoutingModule,
    BsDropdownModule,
    ReactiveFormsModule,
    NgUploaderModule,
    LoadingModule,
    ConfirmationPopoverModule.forRoot({
      focusButton: "confirm"
    }),
    ChartsModule,
    NgxDatatableModule,
    // SelectModule,
    NgSelectModule,
    CustomFormsModule ,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
  ],
  declarations: [
    UserComponent,
    RoleComponent
  ],
  providers: [AuthenticationService, FileService, RoleService, UserService]
})
export class UserManagementModule { }
