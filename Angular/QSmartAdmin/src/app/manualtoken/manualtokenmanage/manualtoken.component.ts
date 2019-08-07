import * as _ from 'lodash';

import { ActionType, AlertMessageService, AlertType } from '../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../_helpers/app.config';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Department, Doctor, ICreateManual, IDepartmentList, IPrinter, IResponse, Service } from '../_model/manulaToken.model';
import { Form, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';

import { ManualTokenService } from '../_service/manualtokenService';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-manualtoken',
  templateUrl: './manualtoken.component.html',
  styleUrls: ['./manualtoken.component.scss']
})
export class ManualtokenComponent implements OnInit {
  @ViewChild(FormGroupDirective) formDirective: FormGroupDirective;
  manualTokenform: FormGroup;
  loading: boolean = false;
  deptDoctorsList: Department[];
  departementsData: IDepartmentList;
  servicesList: Service[];
  serviceData: Service;
  doctorsData: Doctor[];
  doctorsList: Doctor;
  _tokenInfo: IUserUpdateDto;
  manualTemplate: IResponse;
  floorId: number;
  orgId: number;
  tokenNo: string;
  tokenFlag: boolean = false;
  PrinterData: IPrinter[] = [];
  PrinterId: number = 0;

  constructor(private fb: FormBuilder, private manualService: ManualTokenService,
    private translate: TranslateService, private appconfig: AppConfig,
    private alertMessage: AlertMessageService, private router: Router) {
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      this.floorId = this._tokenInfo.levelId;
      this.orgId = this._tokenInfo.orgId;
      console.log("floorId =>", this.floorId);
    }

  }

  ngOnInit() {
    this.manualTokenform = this.fb.group({
      tokenmrn: [null],
      tokenfname: [null],
      tokenlname: [null],
      tokendept: [null, Validators.required],
      tokenservice: [null, Validators.required],
      tokendoctrs: [null, Validators.required]
    });
    this.getDeptAndServicesByUserId();
    this.getPrintersByFloorId();
  }

  getDeptAndServicesByUserId() {
    this.loading = true;
    this.manualService.getDeptAndServicesByUserId().subscribe((response: Department[]) => {
      this.deptDoctorsList = response;
      console.log('response=>', response)
      this.loading = false;
    }, err => {
      let message = err.error.messages as string
      let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
      console.log("Failed :: ", JSON.stringify(err));
      this.showAlert(errorMessage, ActionType.ERROR, err.status);
      this.loading = false;
    });
  }

  getPrintersByFloorId() {
    this.manualService.getPrintersByFloorId().subscribe((response: IPrinter[]) => {
      this.PrinterData = response;
      console.log('printer response=>', response)
    }, err => {
      this.PrinterData = [];
      let message = err.error.messages as string
      let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
      console.log("Failed :: ", JSON.stringify(err));
      this.showAlert(errorMessage, ActionType.ERROR, err.status);
    });
  }
 
  getAllDoctorsByServiceId() {
    this.loading = true;
    let serviceId: number;
    serviceId = (this.manualTokenform.value.tokenservice).serviceId;
    console.log('doctors service=>', this.manualTokenform.value.tokenservice,'serviceId=>', serviceId);
    if (this.manualTokenform.value.tokenservice)
      this.manualService.getAllDoctorsByServiceId(serviceId).subscribe((response: Doctor[]) => {
        this.doctorsData = response
        console.log('doctor response=>', response)
        this.loading = false;
      }, err => {
        let message = err.error.messages as string
        let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
        console.log("Failed :: ", JSON.stringify(err));
        this.showAlert(errorMessage, ActionType.ERROR, err.status);
        this.loading = false;
      });
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  changeDepartement() {
    if (this.manualTokenform.value.tokendept) {
      this.departementsData = this.manualTokenform.value.tokendept;  console.log('this.departementsData',this.departementsData);
      this.servicesList = this.departementsData.services;  console.log('serviceList',this.servicesList);
    }
    this.manualTokenform.get('tokenservice').setValue(null);
    this.manualTokenform.get('tokendoctrs').setValue(null);
    this.doctorsData = null;
  }
  changeService() {
    if (this.manualTokenform.value.tokenservice) {
      this.serviceData = this.manualTokenform.value.tokenservice as Service;   console.log('serviceData',this.serviceData);
      this.doctorsData = this.serviceData.doctors;     console.log('doctorsData',this.doctorsData);
    }
    this.manualTokenform.get('tokendoctrs').setValue(null);
    this.getAllDoctorsByServiceId();
  }

  changeDoctor() {
    if (this.manualTokenform.value.tokendoctrs) {
      this.doctorsList = this.manualTokenform.value.tokendoctrs as Doctor;     console.log('doctorList 135::',this.doctorsList);
    }
  }

  generateManualToken() {
      this.tokenFlag = true;
      let resdat: IResponse;
      this.manualTemplate = resdat;
      this.loading = true;
      let manualTokenData = {
        deptId: this.departementsData.deptId,
        drFstName: this.doctorsList.firstname,
        drLstName: this.doctorsList.lastname,
        drId: this.doctorsList.userId,
        floorId: this.floorId,
        mrnNo: this.manualTokenform.value.tokenmrn ? (this.manualTokenform.value.tokenmrn as string).trim() : '',
        ptFstName: this.manualTokenform.value.tokenfname ? (this.manualTokenform.value.tokenfname as string).trim() : '',
        ptLstName: this.manualTokenform.value.tokenlname ? (this.manualTokenform.value.tokenlname as string).trim() : '',
        orgId: this.orgId,
        serviceId: this.serviceData.serviceId,
        serviceType: this.serviceData.serviceType

      } as ICreateManual;

      console.log('ManualToken=>', manualTokenData);
      if (manualTokenData) {
        this.manualService.generateManualToken(manualTokenData).subscribe((response: IResponse) => {
          if (response.status == true) {
            this.servicesList = [];
            this.doctorsData = [];

            this.formDirective.resetForm();
            this.manualTemplate = response; //.template; 
            console.log('this.manualTemplate',this.manualTemplate);
            let innertext=this.manualTemplate.template.split('<body>');
            this.manualTemplate.innertemplate=innertext.length>1? "<html><body>"+innertext[1]:this.manualTemplate.template;
            console.log('ManualToken=>', this.manualTemplate,'this.manualTemplate.innertemplate',this.manualTemplate.innertemplate,'innertext',innertext);
            if (response.tokenId) {
              this.tokenNo = response.tokenNo;
              this.tokenFlag = true;
            }
            else {
              this.tokenFlag = false;
              this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
            }

          }
          else {
            this.alertMessage.showAlert(response.messages, ActionType.FAILED, AlertType.ERROR);
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
    
  }
  print(): void {
    if (this.PrinterId == 0) {
      let printContents, popupWin;
      printContents = this.manualTemplate.template;
      popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
      popupWin.document.open();
      popupWin.document.write(`
<html>
  <head>
    <title>Print tab</title>
    <style>
    //........Customized style.......
    </style>
  </head>
<body onload="window.print();window.close()">${printContents}</body>
</html>`
      );
      popupWin.document.close();
      // this.loading = false;
      // this.tokenFlag = false;
      console.log('printContents',printContents);
      
    }
    else {
      this.loading = true;

        this.manualService.printToken(this.PrinterId, this.manualTemplate.tokenId).subscribe((response: IResponse) => {
          if (response.status)
          this.showAlert(response.messages, ActionType.SUCCESS);
          else
          this.showAlert(response.messages, ActionType.ERROR);
          this.loading = false;
        }, err => {
          let message = err.error.messages as string
          let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
          console.log("Failed :: ", JSON.stringify(err));
          this.showAlert(errorMessage, ActionType.ERROR, err.status);
          this.loading = false;
        });
    }
  }
  clearToken() {
    let resdat: IResponse;
    this.manualTemplate = resdat;
    this.tokenFlag = false;
  }
}
