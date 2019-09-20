import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DashBoardService } from '../../fdashboard/_service/dashboardService';
import { DatePipe } from '@angular/common';
import { AppConfig } from '../../../_helpers/app.config';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertMessageService, ActionType, AlertType } from '../../../_services/alertMessageService';
import { IAlert, IAlertRes } from '../_model/mdashboard.model';
import { MDashBoardService } from '../_service/mdashboardservice';
import * as _ from 'lodash';

@Component({
  selector: 'app-alertdashboard',
  templateUrl: './alertdashboard.component.html',
  styleUrls: ['./alertdashboard.component.scss']
})
export class AlertdashboardComponent implements OnInit {
  subscription: any;
  intervalValue: number = 60;
  loading: boolean = false;
  alert: IAlert[] = [];
  alertdata: IAlert[] = [];
  recordflag: boolean = true;
  refreshAction: boolean = true;
  constructor(private mdasboardService: MDashBoardService, private datePipe: DatePipe, private appconfig: AppConfig, private translate: TranslateService, private alertMessage: AlertMessageService,
    private router: Router) { }
  ngOnInit() {
    this.getAlertsByOrgId(true);
    this.subscription = Observable.interval(this.intervalValue * 1000).subscribe(data => {
      if (this.refreshAction) {
        this.getAlertsByOrgId(false);
      }
    });

  }
  getAlertsByOrgId(action: boolean) {
    this.loading = action;
    this.mdasboardService.getAlertsByOrgId().subscribe((result: IAlert[]) => {
      if (result.length > 0) {
        console.log('2222222');
        this.recordflag = true;
        if (!_.isEqual(this.alertdata, result)) {
          this.alertdata = result;
        }
      }
      else {
        this.alertdata = result;
        this.recordflag = false
        console.log("1231111111");
        this.alertdata = [];
        this.refreshAction = true;
      }
      this.loading = false;
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.refreshAction = true;
        this.loading = false

      });
  }
  delele(alertdata: IAlert) {
    this.loading = true;
    console.log("delete");
    this.mdasboardService.updateAlertInDB(alertdata.id).subscribe((result: IAlertRes) => {
      console.log("result updateAlertInDB==>", result);
      if (result.status) {
        this.alertMessage.showAlert(result.messages, ActionType.SUCCESS, AlertType.SUCCESS);
        let index = this.alertdata.findIndex(x => x.id == alertdata.id);
        if (index != -1)
          this.alertdata.splice(index, 1);
      }
      else {
        this.alertMessage.showAlert(result.messages, ActionType.FAILED, AlertType.ERROR);
      }
      if (this.alertdata.length == 0) {
        console.log("deleteelse");
        this.recordflag = false;
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false

    })

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
