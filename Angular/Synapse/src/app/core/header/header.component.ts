import { Component, EventEmitter, Output, OnDestroy, OnInit, Input, AfterViewChecked } from '@angular/core';

import * as screenfull from 'screenfull';
import { MatDialog, MatDialogConfig }
  from "@angular/material";
import { Router } from '@angular/router';
import { AppConfig, ITokenInfo, IUserUpdateDto, ICredit } from '../../_helpers/app.config';
import { LoginService } from '../../login/_service/login.service';
import { Observable } from 'rxjs';
import { SimpleSMSComponent } from '../../_utilities/simplesms/simplesms.component';
import { logoutResponse } from '../../login/_models/login';
import { ActionType, AlertMessageService } from '../../_services/AlertMessageService';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit,AfterViewChecked, OnDestroy {

  @Output() toggleSidenav = new EventEmitter<void>();
  //@Output() toggleNotificationSidenav = new EventEmitter<void>();
  @Output() LangChangeEvent = new EventEmitter<string>();
  @Input() currentLangVal:string;
  _rolename: string;
  _rolecode: string = '';
  _tokenInfo: IUserUpdateDto;
  _firstname: string;
  notificationIntervel: number;
  creditsInterval:number;
  subscription: any;
  creditsSubscription: any;
  ApprovalsCount: number = 0;
  currentLang:string='en';
  availableCredits:number;
  displayCreditFlag:boolean=false;
  constructor(public dialog: MatDialog, public router: Router, private appconfig: AppConfig, private logservice: LoginService,
    private alertMessage: AlertMessageService, private translate: TranslateService) {
      // this.currentLang=this.currentLangVal;
      // console.log("currentLang=>",this.currentLang);
      
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    this.notificationIntervel = this.appconfig.getnotificationInterval();
    this.creditsInterval=this.appconfig.getcreditsInterval();
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;

    if (this._tokenInfo && tokenData) {

      this._firstname = this._tokenInfo.firstname;    console.log('this._firstname',this._firstname)
      this._firstname = this._firstname.substring(0, this._firstname.length > 20 ? 20 : this._firstname.length);

      this._rolename = this._tokenInfo.roles[0].roleName;     console.log('this._rolename',this._rolename)
      this._rolecode = this._tokenInfo.roles[0].roleCode;      console.log('this._rolecode',this._rolecode)

    }
    else
      this.router.navigate(['401']);
  }
  ngAfterViewChecked(){
    if(this.currentLang!=this.currentLangVal)
    this.currentLang=this.currentLangVal;
  }

  fullScreenToggle(): void {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }
changeLangEvent(lang:string)
{
  this.LangChangeEvent.emit(lang);
  this.currentLang=lang
}

  getDialog(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '35vw';
    dialogConfig.height = '95.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  openSmsComponent() {
    let data: any = { type: 'group' };
    this.dialog.open(SimpleSMSComponent, this.getDialog(data));
  }
  actionCall(val: string, action: boolean) {
    console.log('val',val, 'action',action)
    if (action) {
      this.logservice.logout().subscribe((x: logoutResponse) => {
        if (x.status) {
          localStorage.clear();
          this.appconfig.clearTokenInfo();
          this.router.navigate([val]);
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
      this.router.navigate([val]);
  }

  ngOnInit() {
    if (this._tokenInfo) {
      this.logservice.getCreditCount().subscribe((result: ICredit) => {
        console.log("TotalCredits==>",result);
        if (result && result.creditType) {
          if(result.creditType.creditCode.toUpperCase()=='PEP')
          {
            this.displayCreditFlag=true;
            this.availableCredits=result.userCredit.availableCredit ? result.userCredit.availableCredit:0;
            this.appconfig.setallowCredits(this.availableCredits>0?true:false);
            this.creditsSubscription = Observable.interval(this.creditsInterval * 1000).subscribe(data => {
              this.getCredits();
            });
            
          }
          else{
            this.displayCreditFlag=false;
          this.availableCredits=0;
          this.appconfig.setallowCredits(true);
          }
         
        } else {
          this.appconfig.setallowCredits(true);
          this.displayCreditFlag=false;
          this.availableCredits=0;
        }
      }, error => {
        this.displayCreditFlag=true;
        this.availableCredits=0;
        this.appconfig.setallowCredits(false);
        console.error("E-getCredits==>", JSON.stringify(error));
  
      });
    this.getApprovals();
    
    if (this._tokenInfo.checker == 1)
      this.subscription = Observable.interval(this.notificationIntervel * 1000).subscribe(data => {
        this.getApprovals();
      });
    }
  }
  getApprovals() {
    this.logservice.getApprovals(this._rolecode).subscribe((result: any[]) => {
      if (result)
        this.ApprovalsCount = result.length;
      else
        this.ApprovalsCount = 0;
    }, error => {
      this.ApprovalsCount = 0;
      console.error("E-getApprovals==>", JSON.stringify(error));

    });

  }
  getCredits() {
    this.logservice.getCreditCount().subscribe((result: ICredit) => {
      console.log("TotalCredits==>",result);
      if (result && result.creditType) {
        if(result.creditType.creditCode.toUpperCase()=='PEP')
        {
          this.displayCreditFlag=true;
          this.availableCredits=result.userCredit.availableCredit ? result.userCredit.availableCredit:0;
          
          this.appconfig.setallowCredits(this.availableCredits>0?true:false);
        }
        else{
          this.appconfig.setallowCredits(true);
          this.displayCreditFlag=false;
        this.availableCredits=0;
        }
      } else {
        this.appconfig.setallowCredits(true);
        this.displayCreditFlag=false;
        this.availableCredits=0;
      }
    }, error => {
      this.displayCreditFlag=true;
        this.availableCredits=0;
        this.appconfig.setallowCredits(false);
      console.error("E-getCredits==>", JSON.stringify(error));

    });
  }
  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
      if(this.creditsSubscription)
      this.creditsSubscription.unsubscribe();
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}
