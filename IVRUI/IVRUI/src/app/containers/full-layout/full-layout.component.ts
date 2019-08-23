import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "app/services/authentication.service";
import * as moment from "moment-timezone";

import { DatePipe } from "@angular/common";
import { SummaryService } from "../../services/reports/summary.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./full-layout.component.html"
})

export class FullLayoutComponent implements OnInit {

  time: any;
  moment = moment();
  public timeInterval: NodeJS.Timer;

  constructor(private authService: AuthenticationService, private service: SummaryService) {
  }

  ngOnInit(): void {
    console.log("FallLayoutComponent:ngOnInit:");
    clearInterval(this.timeInterval);
    this.authService.getDates().subscribe(data => {
      console.log("Banner DateTime  : ", data.currentdate);
      var dt = new Date(data.currentdate);
      this.time = moment(dt).format('DD-MM-YYYY HH:mm:ss');
      this.timeInterval = setInterval(() => {
        this.time = moment(dt).format('DD-MM-YYYY HH:mm:ss');
        dt.setSeconds(dt.getSeconds() + 1);
      }, 1000);

    });
  }
}
