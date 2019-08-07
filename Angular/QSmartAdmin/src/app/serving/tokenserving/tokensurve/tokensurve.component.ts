import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppConfig, IUserUpdateDto, ITokenInfo } from '../../../_helpers/app.config';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { TokenService } from '../../_service/tokenService';
import { AlertMessageService, ActionType } from '../../../_services/alertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ICounterInfo, RoomCollectionList, IServingToken, IToken, ITokenAServingList, ICallNextData, ITokenAServing, ICallTokenNextData, IResponse, IForwardResponse, ICServices, ICServingToken, IResponseForNext, ICRequestForNext, ICResponseForNext } from '../../_model/tokenmodel';
import { TokenservinginfoComponent } from '../tokenservinginfo/tokenservinginfo.component';
import { Router } from '@angular/router';
import { TokenAlertComponent } from './tokenalert';

@Component({
  selector: 'app-tokensurve',
  templateUrl: './tokensurve.component.html',
  styleUrls: ['./tokensurve.component.scss']
})
export class TokensurveComponent implements OnInit, OnDestroy {
  cServices: ICServices[] = [];
  cServingToken: ICServingToken[] = [];
  loading: boolean = false;
  _tokenInfo: IUserUpdateDto;
  tokenLoading: boolean = false;
  refreshSAction: boolean = true;
  refreshTAction: boolean = true;
  subscription: any;
  intervalValue: number = 60;
  constructor(private fb: FormBuilder, private appconfig: AppConfig, private dialog: MatDialog, private tokenService: TokenService,
    private alertMessage: AlertMessageService, private translate: TranslateService, private router: Router) {
    this.intervalValue = this.appconfig.gettokenInterval();
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;

    if (!this._tokenInfo && !tokenData)
      this.router.navigate(['401']);
  }

  ngOnInit() {
    this.getServicesInfo(true);
    this.getServingTokensByUserId(true);
    if (this._tokenInfo) {
      this.subscription = Observable.interval(this.intervalValue * 1000).subscribe(data => {
        if (this.refreshSAction)
          this.getServicesInfo(false);
        if (this.refreshTAction)
          this.getServingTokensByUserId(false);
      });
    }
  }
  gettime(event, sTokens: ICServingToken) {
    // console.log("event=>",event,sTokens.uservingTime);
    sTokens.uservingTime = event;

  }
  tokenView(service: ICServices) {
    const dialogRef = this.dialog.open(TokenservinginfoComponent, this.getStatusConfig({ serviceId: service.serviceId, serviceName: service.serviceEngName }));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.refreshSAction)
          this.getServicesInfo(true);
        if (this.refreshTAction)
          this.getServingTokensByUserId(true);
      }
    });
  }

  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '70vw';
    dialogConfig.height = '70%';
    dialogConfig.panelClass = 'nurstknview';
    //dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  getServicesInfo(action: boolean) {
    this.tokenLoading = action;
    this.refreshSAction = false;
    this.tokenService.getServicesInfo().subscribe((response: ICServices[]) => {
      if (response) {
        this.cServices = response;
      }
      else {
        this.cServices = [];
      }
      this.refreshSAction = true;
      this.tokenLoading = false;
    }, error => {
      this.cServices = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.refreshSAction = true;
      this.tokenLoading = false;
    });
  }
  getServingTokensByUserId(action: boolean) {
    this.loading = action;
    this.refreshTAction = false;
    this.tokenService.getServingTokensByUserId().subscribe((response: ICServingToken[]) => {
      if (response) {
        this.cServingToken = response;
      }
      else {
        this.cServingToken = [];
      }
      this.refreshTAction = true;
      this.loading = false;
    }, error => {
      this.cServingToken = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.refreshTAction = true;
      this.loading = false;
    });
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }



  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'nurstknview';
    dialogConfig.width = "70vw";
    dialogConfig.height = '70%';
    //dialogConfig.position = { right: '0px', bottom: '0' };
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  recycling(ticketId: number) {
    this.loading = true;
    this.tokenService.CrecycleToken(ticketId).subscribe((response: IResponse) => {
      if (response.status) {
        this.ticketSpliceOfData(ticketId);
        this.showAlert(response.messages, ActionType.SUCCESS);
      }
      else {
        this.showAlert(response.messages, ActionType.FAILED);
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  recall(ticketId: number) {
    this.loading = true;
    this.tokenService.Crecall(ticketId).subscribe((response: ICResponseForNext) => {
      if (response.status) {
        console.log("response=>", response);
        let serveIndex = this.cServingToken.findIndex(x => x.ticketId == ticketId);
        if (serveIndex != -1) {

          this.cServingToken.splice(serveIndex, 1, response.data);
        }
        this.showAlert(response.messages, ActionType.SUCCESS);
      }
      else {
        this.showAlert(response.messages, ActionType.FAILED);
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  noshow(ticketId: number) {
    this.loading = true;
    this.tokenService.CnoShowToken(ticketId).subscribe((response: IResponse) => {
      if (response.status) {
        this.ticketSpliceOfData(ticketId);
        this.showAlert(response.messages, ActionType.SUCCESS);
      }
      else {
        this.showAlert(response.messages, ActionType.FAILED);
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  end(ticketId: number, tokenNo: string) {
    let data: string = this.translate.instant('TokenServingModule.tokensurve.endAlert');
    data = data.replace('{Token}', tokenNo);
    const dialogRef = this.dialog.open(TokenAlertComponent, this.getStatusConfigAlert(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.tokenService.CservingEndToken(ticketId).subscribe((response: IResponse) => {
          if (response.status) {
            let serveIndex = this.cServingToken.findIndex(x => x.ticketId == ticketId);
            if (serveIndex != -1) {
              this.cServingToken.splice(serveIndex, 1);
            }
            this.showAlert(response.messages, ActionType.SUCCESS);
          }
          else {
            this.showAlert(response.messages, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.log("Failed :: ", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
      }
    });
  }
  ticketSpliceOfData(ticketId: number) {
    let serveIndex = this.cServingToken.findIndex(x => x.ticketId == ticketId);
    if (serveIndex != -1) {

      let serviceIndex = this.cServices.findIndex(x => x.serviceEngName == this.cServingToken[serveIndex].serviceEngName);
      if (serviceIndex != -1) {
        this.cServices[serviceIndex].waitingTokens = this.cServices[serviceIndex].waitingTokens + 1;
      }
      this.cServingToken.splice(serveIndex, 1);
    }
  }
  callNextServingTOken(tokenServe: ICServingToken) {
    let data: string = this.translate.instant('TokenServingModule.tokensurve.endAlert');
    data = data.replace('{Token}', tokenServe.tokeNo);
    const dialogRef = this.dialog.open(TokenAlertComponent, this.getStatusConfigAlert(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        let serveNext = {
          doctorId: 0,
          endToken: tokenServe.ticketId,
          orgId: this._tokenInfo.orgId,
          roomId: tokenServe.roomId,
          roomNo: tokenServe.roonNo,
          roomtype: tokenServe.roomType,
          serveUserId: this._tokenInfo.userId,
          serviceId: tokenServe.serviceId,
        } as ICRequestForNext;
        this.tokenService.CcallNextServingTOken(serveNext).subscribe((response: ICResponseForNext) => {
          if (response.status) {
            console.log("response=>", response);
            let serveIndex = this.cServingToken.findIndex(x => x.ticketId == tokenServe.ticketId);
            if (serveIndex != -1) {
              if (response.data) {
                let serviceIndex = this.cServices.findIndex(x => x.serviceEngName == this.cServingToken[serveIndex].serviceEngName);
                if (serviceIndex != -1) {
                  let serviceNo = this.cServices[serviceIndex].waitingTokens;
                  this.cServices[serviceIndex].waitingTokens = serviceNo > 0 ? serviceNo - 1 : 0;
                }
                this.cServingToken.splice(serveIndex, 1, response.data);
              }
              else
                this.cServingToken.splice(serveIndex, 1);
            }
            this.showAlert(response.messages, ActionType.SUCCESS);
          }
          else {
            this.showAlert(response.messages, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.log("Failed :: ", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
      }
    });
  }
  transferedToken(ticketId: number, serviceId: number) {
    this.loading = true;
    this.tokenService.transferedToken(ticketId, serviceId).subscribe((response: IResponse) => {
      if (response.status) {
        let serveIndex = this.cServingToken.findIndex(x => x.ticketId == ticketId);
        if (serveIndex != -1) {
          this.cServingToken.splice(serveIndex, 1);
        }
        this.showAlert(response.messages, ActionType.SUCCESS);
      }
      else {
        this.showAlert(response.messages, ActionType.FAILED);
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  getStatusConfigAlert(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '300px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  ngOnDestroy() {
    if (this.subscription)
      this.subscription.unsubscribe();
    // if(this.countDown)
    // this.countDown.unsubscribe();
  }

}
