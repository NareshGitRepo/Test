import * as _ from 'lodash';

import { ActionType, AlertMessageService } from '../../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IDeptList, IDoctorAndService, IDoctorInfo, IDoctro, IRequestForNext, IResponse, IResponseForNext, IRoom, IService, IServingTokenN, IServingTokenNData, IServingTokens, IToken, docnurse } from '../../_model/tokenmodel';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { NurseAlertComponent } from './nursealert';
import { NursetokenviewComponent } from '../nursetokenview/nursetokenview.component';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ServingtokenviewComponent } from '../servingtokenview/servingtokenview.component';
import { TokenService } from '../../_service/tokenService';
import { TokentransformComponent } from '../tokentransform/tokentransform.component';
import { TranslateService } from '@ngx-translate/core';
import { identifierModuleUrl } from '@angular/compiler';
import { VitalservingComponent } from '../vitalserving/vitalserving.component';

@Component({
  selector: 'app-nursemanage',
  templateUrl: './nursemanage.component.html',
  styleUrls: ['./nursemanage.component.scss']
})
export class NursemanageComponent implements OnInit, OnDestroy {
  // doctorData:IDoctorInfo[]=[];
  // vitalData:IDoctorInfo[]=[];
  loading: boolean = false;
  Sloading: boolean = false;
  deptList: IDeptList[] = [];
  doctorList: IDoctro[] = [];
  vaitalCount=0;
  ServiceList: IService[] = [];
  servingTokens: IServingTokens[] = [];
  _tokenInfo: IUserUpdateDto;
  tokenLoading: boolean = false;
  refreshDAction: boolean = true;
  refreshTAction: boolean = true;
  refreshSTAction: boolean = true;
  subscription: any;
  intervalValue: number = 60;
  servingTokenData: IServingTokenNData[] = [];
  constructor(private tokenService: TokenService, private dialog: MatDialog, private alertMessage: AlertMessageService, private translate: TranslateService,
    private router: Router, private appconfig: AppConfig) {
    this.intervalValue = this.appconfig.gettokenInterval();
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;

    if (!this._tokenInfo && !tokenData)
      this.router.navigate(['401']);
    else
      this.getTransferServicesByFloorId();

  }
  getTransferServicesByFloorId() {
    this.Sloading = true;
    this.tokenService.getTransferServicesByFloorId(this._tokenInfo.levelId).subscribe((response: IDeptList[]) => {
      if (response && response != null) {
        console.log("data=>", response);
        this.deptList = response;
      }
      else {
        this.deptList = [];
      }
      this.Sloading = false;
    }, error => {
      this.deptList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.Sloading = false;
    });
  }
  gettime(event, sTokens: IServingTokens) {
    // console.log("event=>",event,sTokens.uservingTime);
    sTokens.uservingTime = event;

  }
  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'nurstknview';
    dialogConfig.width = "80vw";
    dialogConfig.height = '70%';
    //dialogConfig.position = { right: '0px', bottom: '0' };
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  getTransfer(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.panelClass = 'transferdialog';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  openServingTokenView(data:IServingTokenNData)
  {
    const dialogRef = this.dialog.open(ServingtokenviewComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result)
        this.getServingTokensOtherResource(false);
    });
  }
  openTokenView(doctor: IDoctro) {
    console.log("12345");
    const dialogRef = this.dialog.open(NursetokenviewComponent, this.getStatusConfig({ doctorId: doctor.doctorId, drName: doctor.drName }));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.refreshDAction)
          this.getDoctroAndServiceInfo(true);
        if (this.refreshTAction)
          this.getServingTokenByNurseId(true);
      }
    });

  }


  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  ngOnInit() {
    this.getDoctroAndServiceInfo(true);
    this.getServingTokenByNurseId(true);
    this.getServingTokensOtherResource(true);
    if (this._tokenInfo) {
      this.subscription = Observable.interval(this.intervalValue * 1000).subscribe(data => {
        if (this.refreshDAction)
          this.getDoctroAndServiceInfo(false);
        if (this.refreshTAction)
          this.getServingTokenByNurseId(false);
        if (this.refreshSTAction)
          this.getServingTokensOtherResource(false);
      });
    }

  }
  getServingTokensOtherResource(action: boolean) {
    this.refreshSTAction = false;
    this.tokenService.getServingTokensOtherResource().subscribe((response: IServingTokenN[]) => {
      this.servingTokenData = [];
      if (response && response != null) {

        let servingTokenData = _.groupBy(response, 'deptName');
        Object.keys(servingTokenData).forEach(x => {
          this.servingTokenData.push({ deptname: x, ServingTokenNData: servingTokenData[x] } as IServingTokenNData)
        });
        console.log("IServingTokenN=>", response, this.servingTokenData);
      }
      // else {
      //   this.doctorList = [];
      //   this.ServiceList = [];
      // }
      this.refreshSTAction = true;
    }, error => {
      this.servingTokenData = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.refreshSTAction = true;
    });
  }
  getDoctroAndServiceInfo(action: boolean) {
    this.tokenLoading = action;
    this.refreshDAction = false;
    this.vaitalCount=0;
    this.tokenService.getDoctroAndServiceInfo().subscribe((response: IDoctorAndService) => {
      if (response && response != null) {
        console.log("data=>", response);
        this.doctorList = response.doctros;
         this.doctorList.forEach(element=>{
           this.vaitalCount+=element.sumOfwaitingTokens
         })
        this.ServiceList = response.services;
      }
      else {
        this.doctorList = [];
        this.ServiceList = [];
      }
      this.tokenLoading = false;
      this.refreshDAction = true;
    }, error => {
      this.doctorList = [];
      this.ServiceList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.tokenLoading = false;
      this.refreshDAction = true;
    });
  }
  getServingTokenByNurseId(action: boolean) {
    this.loading = action;
    this.refreshTAction = false;
    this.tokenService.getServingTokenByNurseId().subscribe((response: IServingTokens[]) => {
      if (response && response != null) {
        console.log("data=>", response);
        this.servingTokens = response;
      }
      else {
        this.servingTokens = [];
      }
      this.loading = false;
      this.refreshTAction = true;
    }, error => {
      this.servingTokens = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
      this.refreshTAction = true;
    });
  }
  recycling(ticketId: number) {
    this.loading = true;
    this.tokenService.recycleToken(ticketId).subscribe((response: IResponse) => {
      if (response.status) {
        this.ticketSpliceOfData(ticketId);
        this.vaitalCount++
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

  Transfer(ticketData : IServingTokens ){
    const dialogRef = this.dialog.open(TokentransformComponent, this.getTransfer(ticketData));
    dialogRef.afterClosed().subscribe(response=>{
        if(response){
          let index = this.servingTokens.findIndex(x=>x.ticketId == ticketData.ticketId);
          if(index!=-1)
          this.servingTokens.splice(index,1);

        }
    });
  }

  Recall(ticketId: number) {
    this.loading = true;
    this.tokenService.reCallNurseToken(ticketId).subscribe((response: IResponseForNext) => {
      if (response.status) {
        console.log("response=>", response);
        let serveIndex = this.servingTokens.findIndex(x => x.ticketId == ticketId);
        if (serveIndex != -1) {

          this.servingTokens.splice(serveIndex, 1, response.data);
         // this.vaitalCount++
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
    this.tokenService.noShowToken(ticketId).subscribe((response: IResponse) => {
      if (response.status) {
        this.ticketSpliceOfData(ticketId);
        this.vaitalCount++
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
    let data: string = this.translate.instant('DoctorServingModule.endAlert');
    data = data.replace('{Token}', tokenNo);
    const dialogRef = this.dialog.open(NurseAlertComponent, this.getStatusConfigAlert(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.tokenService.servingEndToken(ticketId).subscribe((response: IResponse) => {
          if (response.status) {
            let serveIndex = this.servingTokens.findIndex(x => x.ticketId == ticketId);
            if (serveIndex != -1) {
              this.servingTokens.splice(serveIndex, 1);
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
    let serveIndex = this.servingTokens.findIndex(x => x.ticketId == ticketId);
    if (serveIndex != -1) {
      let doctorIndex = this.doctorList.findIndex(x => x.doctorId == this.servingTokens[serveIndex].doctorId);
      if (doctorIndex != -1) {
        this.doctorList[doctorIndex].sumOfwaitingTokens = this.doctorList[doctorIndex].sumOfwaitingTokens + 1;
      }
      let serviceIndex = this.ServiceList.findIndex(x => x.serviceEngName == this.servingTokens[serveIndex].serviceEngName);
      if (serviceIndex != -1) {
        this.ServiceList[serviceIndex].sumOfwaitingTokens = this.ServiceList[serviceIndex].sumOfwaitingTokens + 1;
      }
      this.servingTokens.splice(serveIndex, 1);
    }
  }
  callNextServingTOken(tokenServe: IServingTokens) {
    let data: string = this.translate.instant('DoctorServingModule.nextAlert');
    data = data.replace('{Token}', tokenServe.tokenNo);
    const dialogRef = this.dialog.open(NurseAlertComponent, this.getStatusConfigAlert(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        let serveNext = {
          doctorId: tokenServe.doctorId,
          endToken: tokenServe.ticketId,
          orgId: this._tokenInfo.orgId,
          roomId: tokenServe.roomId,
          roomNo: tokenServe.roomNo,
          roomtype: tokenServe.roomType,
          serveUserId: this._tokenInfo.userId
        } as IRequestForNext;
        this.tokenService.callNextServingTOken(serveNext).subscribe((response: IResponseForNext) => {
          if (response.status) {
            console.log("response=>", response);
            let serveIndex = this.servingTokens.findIndex(x => x.ticketId == tokenServe.ticketId);
            if (serveIndex != -1) {
              if (response.data) {
                let doctorIndex = this.doctorList.findIndex(x => x.doctorId == this.servingTokens[serveIndex].doctorId);
                if (doctorIndex != -1) {
                  let docNo = this.doctorList[doctorIndex].sumOfwaitingTokens;
                  this.doctorList[doctorIndex].sumOfwaitingTokens = docNo > 0 ? docNo - 1 : 0;
                }
                let serviceIndex = this.ServiceList.findIndex(x => x.serviceEngName == this.servingTokens[serveIndex].serviceEngName);
                if (serviceIndex != -1) {
                  let serviceNo = this.ServiceList[serviceIndex].sumOfwaitingTokens;
                  this.ServiceList[serviceIndex].sumOfwaitingTokens = serviceNo > 0 ? serviceNo - 1 : 0;
                }
                this.servingTokens.splice(serveIndex, 1, response.data);
              }
              else
                this.servingTokens.splice(serveIndex, 1);
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
        let serveIndex = this.servingTokens.findIndex(x => x.ticketId == ticketId);
        if (serveIndex != -1) {
          this.servingTokens.splice(serveIndex, 1);
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

  openVitalTokenView() {
    console.log("12345", this._tokenInfo.userId);
    let doctotal=[];
    this.doctorList.forEach(data=>{
      doctotal.push(+data.doctorId)
    });
    let data:docnurse={
      doctors:doctotal,
      nurseId:this._tokenInfo.userId

    };
    console.log('data',JSON.stringify(data))
    const dialogRef = this.dialog.open(VitalservingComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {   
      if (result) {
        if (this.refreshDAction)
          this.getDoctroAndServiceInfo(true);
        if (this.refreshTAction)
          this.getServingTokenByNurseId(true);
      }
    });
  }
}
