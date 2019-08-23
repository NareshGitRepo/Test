import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { P401Component } from "./401.component";
import { P404Component } from "./404.component";
import { P500Component } from "./500.component";
import { P599Component } from "./599.component";
import { LoginComponent } from "./login.component";
import { RegisterComponent } from "./register.component";
import { PagesRoutingModule } from "./pages-routing.module";
import { AuthenticationService } from "../../services/authentication.service";


// import { AuthenticationService } from './services/index';

@NgModule({
  imports: [CommonModule, PagesRoutingModule, FormsModule],
  declarations: [
    P401Component,
    P404Component,
    P500Component,
    P599Component,
    LoginComponent,
    RegisterComponent
  ],
  providers: [AuthenticationService]
})
export class PagesModule { }
