import { Component, OnInit } from "@angular/core";
// import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from "@angular/router";

import { AuthenticationService } from "../../services/authentication.service";
import { AppConfig } from "../../AppConfig";
import { NgxPermissionsService } from "ngx-permissions";
import { AppComponent } from "app/app.component";

@Component({
  templateUrl: "login.component.html"
})

export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  message: string;
  userrole: string;
  public messageflag: boolean = false;
  public IsValidLogin: boolean;
  validUser: boolean = false;
  // url = "campaignmanager/quick"
  // url = "reports/detailed"
  url = "usermanagement/user"
  userurl = "reports/cdrdetails"

  constructor(
    private router: Router, private appComp: AppComponent,
    private authService: AuthenticationService, private route: ActivatedRoute,
    private appConfig: AppConfig, private permissionsService: NgxPermissionsService) {
  }

  ngOnInit() {
    console.log("LoginComponent:init:");
    // reset login status
    this.authService.logout();
    const redirectUrl = this.route.snapshot.queryParams["returnUrl"];
    if (redirectUrl) {
      this.url = redirectUrl;
      console.log("LoginComponent:Redirected URL : --> ", this.url)
    }
  }

  onSearchChange(searchValue: string) {
    this.messageflag = false;
  }

  login() {
    this.loading = true;

    console.log("LoginComponent:login:");

    // console.log("LoginComponent:login:" + this.appConfig.getUsersList());

    // for (let i = 0; i < this.appConfig.getUsersList().length; i++) { // Configure users validation

    //   if (this.appConfig.getUsersList()[i].username === this.model.username) {

    //     this.userrole = this.appConfig.getUsersList()[i].userrole;
    //     const permissions = [this.userrole];
    //     console.log("UserRole Authentication :::::: " + permissions);
    //     this.permissionsService.loadPermissions(permissions);
    //     this.validUser = true;
    //     break;
    //   } else {
    //     this.validUser = false;
    //   }
    // }

    // console.log("LoginComponent:validUser :" + this.validUser);

    // if (this.validUser) {

    this.authService.login(this.model.username, this.model.password)
      .subscribe(result => {
        console.log("Result ::: ."+result);
        if (result === true) {
          console.log("User Authenticated Successfully.");
          console.log("Role ::: " + this.authService.role);
          // this.router.navigate(["dashboard"]);
          if (this.authService.role === "admin") {
            this.router.navigate([this.url]);
          } else {
            this.router.navigate([this.userurl]);
          }


        } else {
          console.log("Not Authenticated.");
          this.messageflag = true;
          this.message = "Invalid Login Credentials.";
          this.loading = false;
          this.router.navigate(["/"]);
        }
      },
        error => {
          console.log("Error:User not Authenticated.");
          console.log(error);
          this.messageflag = true;
          this.loading = false;
          this.message = "Invalid Login Credentials.";
        });

    // } else {
    //   console.log("Error:Username not Autherised.");
    //   this.messageflag = true;
    //   this.loading = false;
    //   this.message = "Invalid username Credentials.";
    // }

  }

}
