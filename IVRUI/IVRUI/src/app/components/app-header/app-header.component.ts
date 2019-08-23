import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "app/services/authentication.service";

@Component({
  selector: "app-header",
  templateUrl: "./app-header.component.html"
})
export class AppHeaderComponent implements OnInit {

  public username: string;
  public time: string;

  constructor(private authService: AuthenticationService) {

  }

  ngOnInit(): void {
    console.log("AppHeaderComponent:ngOnInit:");
    // this.username = this.authService.username;
    this.username = this.authService.getUser();
    this.time = this.authService.getTime();
  }


 }
