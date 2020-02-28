import { Component, OnInit, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { AppConfig, menuType } from '../_helpers/app.config';
import { LaboratoryService } from './_service/laboratory.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ILaboratory } from './_model/ILaboratory';
import { DashboardService } from '../dashboard/_service/dashboard.service';
import { UserIdleService } from 'angular-user-idle';

@Component({
  selector: 'app-laboratory',
  templateUrl: './laboratory.component.html',
  styleUrls: ['./laboratory.component.scss']
})
export class LaboratoryComponent implements OnInit {

  setTimeout: number;
  errorMessage: boolean = false;
  public apiResponse: ILaboratory;
  messages: string;
  timeoutconfig: number = 60;
  timeoutValue: number = 0;

  constructor(private laboratory: LaboratoryService, private dashboard: DashboardService,
    private appconfig: AppConfig, public router: Router, public route: ActivatedRoute, private userIdle: UserIdleService) {
    if (this.appconfig.getMenus()) {
      this.userIdle.resetTimer();
      this.timeoutconfig = this.appconfig.getTimeoutforToken();
      this.userIdle.setConfigValues({ idle: -1, timeout: this.timeoutconfig, ping: 1 });
      this.userIdle.onTimerStart().subscribe(count=>{
        this.timeoutValue=count;
      });
      this.getLaboratoryToken();
    } else if (localStorage.getItem('kioskid')) {
      this.router.navigate(['/'], { queryParams: { kioskid: localStorage.getItem('kioskid') } });
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    console.log("Laboratory  ngOnInit() ::", new Date());
    this.userIdle.startWatching();
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      this.router.navigate(['/'], { queryParams: { kioskid: this.appconfig.getKiosk() } });
    });
  }
  
  getLaboratoryToken() {
    this.laboratory.getLaboratoryToken().subscribe((result: ILaboratory) => {
      console.log("Response::" + JSON.stringify(result));
      if (result) {
        this.apiResponse = result;
        if (result.status) {
          let template = this.apiResponse.template; //'Successfully message sent to printer';
          this.dashboard.generateTokenPrinterPost("Laboratory", "Laboratory", result.tokenNo, menuType.LB, template);
        } else {
          console.log("Invalid Token");
        }
      } else {
        console.log("Response not received");
      }

    }, err => {
      console.log("Error ..." + JSON.stringify(err));
      this.errorMessage = true;
      this.messages = err.message;
    });
  }



  ngOnDestroy() {
    console.log("Laboratory Destroy .....");
    this.userIdle.stopWatching();
  }

}

