import { ActionType, AlertMessageService } from '../../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IDashboardFacility, IFacilityApptsAndCheckin, IFacilityDashboard, IFacilityWaiting, IQueues, ITokens, facilityData } from '../_model/dashboardModel';

import { DashBoardService } from '../_service/dashboardService';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-fdashboard',
  templateUrl: './fdashboard.component.html',
  styleUrls: ['./fdashboard.component.scss']
})
export class FDashboardComponent implements OnInit, OnDestroy {
  _userName: string = '';
  _queueData: IQueues;
  _tokenData: ITokens;
  _orgid: number;
  _tokenInfo: IUserUpdateDto;
  _strtdate: any;
  facilityDashboardData:IFacilityDashboard;
  subscription: any;
  intervalValue: number = 60;
  refreshActionD: boolean = true;
  refreshActionC: boolean = true;
  refreshActionQ: boolean = true;
  loading: boolean = false;
  constructor(private dasboardService: DashBoardService, private datePipe: DatePipe, private appconfig: AppConfig, private translate: TranslateService, private alertMessage: AlertMessageService,
    private router: Router) {
      let dval = this.appconfig.getdashboardInterval();
    this.intervalValue = dval != null ? (dval < 5 ? 5 : dval) : 60;
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;

    if (this._tokenInfo && tokenData) {
      this._orgid = this._tokenInfo.orgId;
      this._userName = this._tokenInfo.orgName;
    }
    this._strtdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  }
  ngOnInit() {
    this.getDashBoardByFacilityId(true);
    this.getCurservingTokens();
    this.getQueues();
    this.subscription = Observable.interval(this.intervalValue * 1000).subscribe(data => {
      if (this.refreshActionD)
        this.getDashBoardByFacilityId(false);
      if (this.refreshActionC)
        this.getCurservingTokens();
      if (this.refreshActionQ)
        this.getQueues();
    });
  }

  getCurservingTokens() {
    this.refreshActionC = false;
    this.dasboardService.getCurservingTokens().subscribe((response: ITokens) => {
      console.log('getCurservingTokens', response);
      if (response) {
        this._tokenData = response;
      } else {
        this._tokenData = null;
      }
      this.refreshActionC = true;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.refreshActionC = true;
    });
  }

  getQueues() {
    this.refreshActionQ = false;
    this.dasboardService.getQueues().subscribe((response: IQueues) => {
      console.log('responsequeue::', response);
      if (response)
        this._queueData = response;
      else
        this._queueData = null;
      this.refreshActionQ = true;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.refreshActionQ = true;
    });
  }


  getDashBoardByFacilityId(action:boolean) {
    this.loading=action;
    this.refreshActionD = false;
    console.log(this._strtdate)
    let facilityData: facilityData = {
      submitDate: this._strtdate,
      facilityId: this._orgid
    };
    console.log(facilityData)
    this.dasboardService.getDashBoardAptsByFacilityId(facilityData).subscribe((result1: IFacilityApptsAndCheckin) => {
      console.log("Result from Server::::::::", result1);
      if (result1) {
        this.dasboardService.getDashBoardWaitingByFacilityId(this._orgid).subscribe((result: IFacilityWaiting) => {
          console.log("Result from Server::::::::", result);
          if (result) {
            this.facilityDashboardData = {
              waitingTime: result.waitingTime!=null?(result.waitingTime>0?result.waitingTime:0):0,
              waitingtokens: result.waitingtokens!=null?result.waitingtokens:0,
              totalAppts: result1.totalAppts!=null?result1.totalAppts:0,
              totalCheckin: result1.totalCheckin!=null?result1.totalCheckin:0
            } as IFacilityDashboard;


          } else {
            this.facilityDashboardData= null;
          }
        }, error => {
          console.log("Failed :: " + JSON.stringify(error));
          this.showAlert(error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : error.message, ActionType.ERROR, error.status);

        });
        } else {
          this.facilityDashboardData= null;
      }
      this.refreshActionD = true;
      this.loading=false;
    }, error => {
      console.log("Failed :: " + JSON.stringify(error));
      this.showAlert(error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : error.message, ActionType.ERROR, error.status);
      this.refreshActionD = true;
      this.loading=false;
    });
    // this.dasboardService.getDashBoardByFacilityId(facilityData).subscribe((result: IDashboardFacility) => {
    //   console.log("Result from Server::::::::", result);
    //   if (result) {
    //     this._facilityDisplay = result;
    //     this._patientwaiting = this._facilityDisplay.totalCheckin - (this._facilityDisplay.totalServed+this._facilityDisplay.totalServing);
    //     this._patientwaiting = this._patientwaiting < 0 ? 0 : this._patientwaiting;
    //     this._facilityDisplay.avgWaiting = this._facilityDisplay.avgWaiting < 0 ? 0 : this._facilityDisplay.avgWaiting;
    //   } else {
    //     this._facilityDisplay = null;
    //     this._patientwaiting = null;
    //   }
    //   this.refreshActionD = true;
    // }, error => {
    //   console.log("Failed :: " + JSON.stringify(error));
    //   this.showAlert(error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : error.message, ActionType.ERROR, error.status);
    //   this.refreshActionD = true;
    // });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}
