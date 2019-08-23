import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";

import { NgxPermissionsService } from 'ngx-permissions';
import { HttpClient } from "@angular/common/http";

import * as jwt_decode from "jwt-decode";


@Component({
  // tslint:disable-next-line
  selector: "body",
  template: "<router-outlet></router-outlet>"
})
export class AppComponent implements OnInit {

  _router: any;
  routerEventSubscription: any;
  userrole: any;

  constructor(private router: Router, private permissionsService: NgxPermissionsService) { }

  ngOnInit() {
    console.log("AppComponent:ngOnInit:");
    const token = sessionStorage.getItem('token');
    const tokenPayload = jwt_decode(token);
    console.log("User Info :::" + tokenPayload.sub);
    const jsonObj = JSON.parse(tokenPayload.sub);
    const permissions = [jsonObj.role];
    // const permissions = ['admin'];
    console.log("App component userrole permission :" + permissions);
    this.permissionsService.loadPermissions(permissions);

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
}
