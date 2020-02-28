import { Component, OnInit, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { RegisterService } from './_service/register.service';
import { Router } from '@angular/router';
import { IRegistration } from './_model/IRegistration';
import { DashboardService } from '../dashboard/_service/dashboard.service';
import { UserIdleService } from 'angular-user-idle';
import { AppConfig, menuType } from '../_helpers/app.config';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, OnDestroy {

  setTimeout: number;
  errorMessage: boolean = false;
  public apiResponse: IRegistration;
  messages: string;
  timeoutconfig: number = 60;
  timeoutValue: number = 0;

  constructor(private register: RegisterService, private dashboard: DashboardService, private appconfig: AppConfig,
    public router: Router, private userIdle: UserIdleService) {
    if (this.appconfig.getMenus()) {
      this.userIdle.resetTimer();
      this.timeoutconfig = this.appconfig.getTimeoutforToken();
      this.userIdle.setConfigValues({ idle: -1, timeout: this.timeoutconfig, ping: 1 });

      this.userIdle.onTimerStart().subscribe(count=>{
        this.timeoutValue=count;
      });
      this.getRegisterToken();
    } else if (localStorage.getItem('kioskid')) {
      this.router.navigate(['/'], { queryParams: { kioskid: localStorage.getItem('kioskid') } });
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    console.log("Registration ngOnInit() ::", new Date());
    //Start watching for user inactivity.
    this.userIdle.startWatching();
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      this.router.navigate(['/'], { queryParams: { kioskid:  this.appconfig.getKiosk() } });
    });
  }
  
  getRegisterToken(){
    this.register.getRegisterToken().subscribe((result: IRegistration) => {
      console.log("Response::" + JSON.stringify(result));
      if (result) {
        this.apiResponse = result;
        if (result.status) {
          let template = this.apiResponse.template; //'Successfully message sent to printer';
          this.dashboard.generateTokenPrinterPost("Registration", "Registration", result.tokenNo, menuType.RG, template);
        } else {
          console.log("Invalid token");
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
    console.log("Registration Destroy .....");
    this.userIdle.stopWatching();
  }

}

