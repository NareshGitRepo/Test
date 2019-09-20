import * as screenfull from "screenfull";

import { ActionType, AlertMessageService } from "../../_services/alertMessageService";
import {
  AppConfig,
  ITokenInfo,
  IUserUpdateDto,
  userType
} from "../../_helpers/app.config";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { INotification, INotificationData } from "../notification/_model/notification";
import { MatDialog, MatDialogConfig } from "@angular/material";

import { LoginService } from "../../login/_service/login.service";
import { NotificationServices } from "../notification/_service/NotificationServices";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { logoutResponse } from "../../login/_model/login";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleNotificationSidenav = new EventEmitter<INotificationData>();
  _rolename: string;
  _tokenInfo: IUserUpdateDto;
  _firstname: string;
  headrLoad: boolean = true;
  notificationIntervel: number = 1;
  subscription: any;
  ApprovalsCount: number = 0;
  notifyFlag: boolean = false;
  notificationList: INotification[] = [];
  notificationStatus: boolean = false;
  notificationCall: boolean = true;
  AuthenticatedFlag:boolean=true;

  // tslint:disable-next-line:max-line-length
  constructor(
    public dialog: MatDialog,
    public router: Router,
    private appconfig: AppConfig,
    private logservice: LoginService,
    private notificationService: NotificationServices,
    private translate: TranslateService,
    private alertMessage: AlertMessageService
  ) {

    this.headrLoad = this.appconfig.getHeaderLoads();
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    this.notificationIntervel = this.appconfig.getnotificationInterval();
    if (tokenData) this._tokenInfo = tokenData.tokenSub;
    console.log(this._tokenInfo);
    if (this._tokenInfo && tokenData) {
      this._firstname =
        this._tokenInfo.firstname + " " + this._tokenInfo.lastname;
      this._firstname = this._firstname.substring(
        0,
        this._firstname.length > 12 ? 12 : this._firstname.length
      );
      let rname = "";
      if (this._tokenInfo.orgName && this._tokenInfo.orgName != null)
        rname = this._tokenInfo.orgName + " >> ";
      if (this._tokenInfo.levelName && this._tokenInfo.levelName != null)
        rname = rname + this._tokenInfo.levelName + " >> ";
      this._tokenInfo.orgName;
      console.log("header=>", rname, this._tokenInfo);

      if (this._tokenInfo.roles[0].roleName == userType.Nurse || this._tokenInfo.roles[0].roleName == userType.ServiceResource)
        this.notifyFlag = true;

      this._rolename = this._tokenInfo.roles[0].roleName;
      this._rolename = rname + this._rolename;
      this.AuthenticatedFlag=this._tokenInfo.isAuthenticated;
    } else this.router.navigate(["401"]);
  }

  ngOnInit() {
    if (this.notifyFlag) {
      this.getNotifications();
      this.subscription = Observable.interval(this.notificationIntervel * 1000).subscribe(data => {
        if (this.notificationCall)
          this.getNotifications();
      });
    }
  }
  getNotifications() {
    this.notificationCall = false;
    this.notificationService.getNotifications().subscribe(
      (result: INotification[]) => {
        if (result.length > 0) {
          this.notificationList = result;
          if (this.notificationStatus == true) {
            let notificationData = { status: true, Data: this.notificationList } as INotificationData;
            this.toggleNotificationSidenav.emit(notificationData);
          }
        } else {
          this.notificationList = [];
        }
        this.notificationCall = true;
      },
      error => {
        console.error("Failed :: ", JSON.stringify(error));
        this.notificationCall = true;
      }
    );
  }

  notificationAction() {
    this.notificationStatus = !this.notificationStatus;
    let notificationData = { status: this.notificationStatus, Data: this.notificationList } as INotificationData;
    this.toggleNotificationSidenav.emit(notificationData);
  }

  fullScreenToggle(): void {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }
  actionCall(val: string, action: boolean) {
    if (action) {
      this.logservice.logout().subscribe((x: logoutResponse) => {
        if (x.status) {
          localStorage.clear();
          this.appconfig.clearTokenInfo();
          this.AfterChackActionCall(val);
        }
        else {
          this.showAlert(x.messages, ActionType.ALERT);
        }
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR);
      });
    }
    else
      this.AfterChackActionCall(val);
  }

  AfterChackActionCall(val: string) {
    if (val == "/") {
      if (this.appconfig.getHeaderLoads())
        this.router.navigate(["/"]);
      else
        this.router.navigate(["/"], { queryParams: { hl: 0 } });
    } else {
      this.router.navigate([val]);
    }
  }
  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}
