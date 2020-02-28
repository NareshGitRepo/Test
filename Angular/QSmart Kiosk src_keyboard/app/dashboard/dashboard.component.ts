import { Component, OnInit, Pipe, PipeTransform, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from './_service/dashboard.service';
import { IDashboard, Menu } from './_model/IDashboard';

import { AppConfig } from '../_helpers/app.config';
import { UserIdleService } from 'angular-user-idle';
import { IUserUpdateDto } from '../_helpers/ConsumerService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  _tokenInfo: IUserUpdateDto;
  errorMessage: boolean;
  menuInfo: Menu[] = [];
  public apiResponse: IDashboard;
  messages: any;
  setTimeout: any;
  interval: NodeJS.Timeout;
  kioskid: any;
  timeoutconfig: number = 60;
  timeoutValue: number = 0;
  radius: number = 15;
  circumference = 2 * Math.PI * this.radius;
  dashoffset: number;
  colorvalue: string;

  constructor(private dashboard: DashboardService, public router: Router,
    private appconfig: AppConfig, public translate: TranslateService,
    private route: ActivatedRoute, private userIdle: UserIdleService) {
    console.log("Dashboard....", new Date());
    //  this.getDashboardDetails();
    if (this.appconfig.getKiosk()) {      
      this.getMenuInfo();  
    } else if (localStorage.getItem('kioskid')) {
      this.appconfig.setKiosk(localStorage.getItem('kioskid'))
      this.getMenuInfo(); 
    } else {
      this.router.navigate(['/']);
    }  
  }

  ngOnInit() {
    // Start watching when user idle is starting.this.
    this.timeoutconfig = this.appconfig.getTimeoutforToken();
    this.strokeprogress(this.timeoutconfig);
    this.userIdle.setConfigValues({ idle: -1, timeout: this.timeoutconfig, ping: 1 });

    this.userIdle.onTimerStart().subscribe(count => {
      this.timeoutValue = count;
      console.log("Start Timer : " + count);
      this.strokeprogress(this.timeoutconfig-this.timeoutValue);

      // const leftTimt=this.appconfig.getTimeoutforToken()
    });
    this.userIdle.startWatching();
    
    // Start watch when time is up.
    this.userIdle.onTimeout().subscribe(() => {
      this.router.navigate(['/'], { queryParams: { kioskid: this.appconfig.getKiosk() } });
    });

 
  }

  private strokeprogress(value: number) {
    const strokeprogress = value / this.timeoutconfig;
    this.strokevalue(this.timeoutconfig-this.timeoutValue);
    this.dashoffset = this.circumference * (1 - strokeprogress);
  }
  
  strokevalue(value) {  
    if (value >5) {
      this.colorvalue = "#19b464"
    }
    else if(value<=5){
      this.colorvalue = "red"
    }
  }
  // getDashboardDetails() {

  // clearInterval(this.interval);
  // console.log("localstorage info : ", JSON.stringify(localStorage));
  // console.log("localstorage kioskid : ", localStorage.getItem("kioskid"));
  // console.log("localstorage kioskorgid : ", localStorage.getItem("kioskorgid"));
  // console.log("DefaultKioskid from Service : ", this.dashboard.defaultKioskid);

  // if (this.appconfig.getKiosk()) {
  //   this.route.queryParams.subscribe(params => {
  //     if (params['kioskid']) {
  //       if (this.appconfig.getKiosk() != params['kioskid']) {
  //         console.log("kioskid updated");
  //         this.kioskid = params['kioskid'];
  //         this.appconfig.setKiosk(params['kioskid']);
  //         this.dashboard.defaultKioskid = params['kioskid'];
  //       } else {
  //         console.log("kioskid already exist");
  //         this.kioskid = this.appconfig.getKiosk();
  //         this.dashboard.defaultKioskid = this.appconfig.getKiosk();
  //       }
  //     } else {
  //       console.log("kioskid not in url so continue with existed kioskid");
  //       this.kioskid = this.appconfig.getKiosk();
  //       this.dashboard.defaultKioskid = this.appconfig.getKiosk();
  //     }
  //     console.log("Query param kioskid ::" + this.kioskid);
  //     this.getMenuInfo();
  //   });
  // } else {
  //   console.log("kioskid is not exist .......");
  //   this.route.queryParams.subscribe(params => {
  //     this.kioskid = params['kioskid'];
  //     console.log("Query param kioskid ::" + this.kioskid);
  //     if (!this.kioskid) {
  //       console.log("DefaultKioskid from Service 2 : ", this.dashboard.defaultKioskid);
  //       this.kioskid = this.dashboard.defaultKioskid;
  //     }
  //     this.getMenuInfo();
  //   });
  // }
  //}

  getMenuInfo() {    
    console.log("getMenuInfo_Request=>",this.appconfig.getKiosk());
    this.dashboard.getMenuInfo().subscribe((response: IDashboard) => {
      console.log("menuInfo ::" + JSON.stringify(response));
      if (response) {
        console.log("menuInfo response ::");
        this.apiResponse = response;
        this.errorMessage = false;
        this.menuInfo = response.menus;
        if (response.menus.length > 0) {
          console.log("menuinfo length .....", response.menus.length);
          this.appconfig.setKioskId(response.kisokId);
          // localStorage.setItem("printerStatus", response.printerSatus);
          this.appconfig.setPrinterStatus(response.printerSatus);
          // this.menuInfo.forEach(element => {
          //   localStorage.setItem(element.type, "" + element.typeId);
          // })
          this.appconfig.setMenus(this.menuInfo);
        } else {
          console.log("menuinfo empty .....");
          this.HttpTimeoutError();
          // this.interval = setInterval(() => {
          //   this.getDashboardDetails();
          // }, 60000);
        }
      } else {
        console.log("menuinfo not available .....");
        this.HttpTimeoutError();
        // this.interval = setInterval(() => {
        //   this.getDashboardDetails();
        // }, 60000);
      }
    }, async err => {
      console.log("error :: " + JSON.stringify(err));
      this.errorMessage = true;
      this.messages = err.message;
      this.HttpTimeoutError();
      // this.interval = setInterval(() => {
      //   this.getDashboardDetails();
      // }, 60000);
    });
  }
  HttpTimeoutError() {
    this.userIdle.stopWatching();
    this.timeoutconfig = 10;
    this.userIdle.setConfigValues({ idle: -1, timeout: 10, ping: 1 });
    this.userIdle.startWatching();
    this.userIdle.onTimeout().subscribe(() => {
      this.router.navigate(['/'], { queryParams: { kioskid: this.appconfig.getKiosk() } });
    });
  }
  ngOnDestroy() {
    console.log("DashboardComponent Destroy..............");
    clearInterval(this.interval);
    this.userIdle.stopWatching();
  }

}
