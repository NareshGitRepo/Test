import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../_helpers/app.config';
import { Service } from '../_service/service.';
import { IServiceCreate, IServiceResponse, Floor } from '../_model/serviceModel';
import { AlertMessageService, ActionType } from '../../_services/alertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

@Component({
  selector: 'app-createservices',
  templateUrl: './createservices.component.html',
  styleUrls: ['./createservices.component.scss']
})
export class CreateservicesComponent implements OnInit {

  serviceForm: FormGroup;
  direction: boolean = false;
  serviceFlag: boolean = false;
  timeintervals: Array<any> = [];
  serviceData: IServiceCreate;
  orgId: number;
  _tokenInfo: IUserUpdateDto;
  totalLevels: Floor[];
  totalDepartments: any[];
  floorId: number;
  loading: boolean = false;
  servicePrefixFlag: boolean;
  serviceDisableFlag: boolean;
  editData: any;
  ServiceModel: IServiceCreate = {} as any;
  servicePrefixV: string = '#-1#';

  constructor(private fb: FormBuilder, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<CreateservicesComponent>, private appconfig: AppConfig, private alertMessage: AlertMessageService,
    private service: Service, private translate: TranslateService, private router: Router) {

    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      this.orgId = this._tokenInfo.orgId;
    }
  }

  ngOnInit() {
    let depinterval = this.appconfig.getDepartementIntervals();
    let definterval = this.appconfig.getDefaultInterval();
    this.timeintervals = depinterval ? depinterval : [];
    this.serviceForm = this.fb.group({
      serviceId: [null],
      serviceColor: '0',
      serviceEngName: [null, Validators.required],
      serviceArName: [null, Validators.required],
      floorId: [null, Validators.required],
      servicePrefix: [null, Validators.required],
      servicePrefixV: [null],
      npEarlyCheckin: [definterval ? definterval : 30],
      npLateCheckin: [definterval ? definterval : 30],
      startToken: [1, Validators.compose([Validators.required, Validators.maxLength(4)])],
      endToken: [1000, Validators.compose([Validators.required, Validators.maxLength(4)])],
      orgId: [this.orgId, Validators.required],
      deptId: [null, Validators.required],
    });
    this.serviceForm.get('servicePrefix').valueChanges.subscribe(event => {
      this.serviceForm.get('servicePrefix').setValue(event.toUpperCase(), { emitEvent: false });
    });
    this.getLevelInfo();
    if (this.Data.data != null || this.Data.data != undefined) {
      this.ServiceModel = this.Data;
      console.log("Service===>", this.Data.data);
      this.serviceForm.patchValue({
        serviceId: this.Data.data.serviceId,
        floorName: this.Data.data.floorName,
        serviceEngName: this.Data.data.serviceEngName,
        serviceArName: this.Data.data.serviceArName ? this.Data.data.serviceArName : '',
        servicePrefix: this.Data.data.servicePrefix,
        servicePrefixV: this.Data.data.servicePrefix,
        npEarlyCheckin: this.Data.data.npEarlyCheckin,
        npLateCheckin: this.Data.data.npLateCheckin,
        startToken: this.Data.data.startToken,
        endToken: this.Data.data.endToken,
        floorId: this.Data.data.floorId,
        orgId: this.Data.data.orgId,
      });
      this.servicePrefixV = this.Data.data.servicePrefix;
      this.servicePrefixFlag = true;
      this.serviceForm.get('deptId').disable();
      this.serviceForm.get('floorId').disable();
    }
  }
  startValidation() {
    if (this.serviceForm.value.startToken) {
      if (+this.serviceForm.value.startToken >= +this.serviceForm.value.endToken) {
        let startVal = +this.serviceForm.value.startToken + 1;
        if ((startVal + '').length > 4) {
          this.alertMessage.showAlert(this.translate.instant('serviceModule.createservice.tokenError') , ActionType.FAILED);
          this.serviceForm.get('endToken').setValue(1);
          this.serviceForm.get('startToken').setValue(1000);
        }
        else
          this.serviceForm.get('endToken').setValue(startVal);
      }
    }
    else {
      this.serviceForm.get('startToken').setValue(1);
    }
  }

  endValidation() {
    console.log('value=>', +this.serviceForm.value.endToken <= +this.serviceForm.value.startToken, this.serviceForm.value.endToken);
    if (this.serviceForm.value.endToken) {
      if (+this.serviceForm.value.endToken <= +this.serviceForm.value.startToken) {
        let startVal = +this.serviceForm.value.startToken + 1;
        if (startVal > 9999) {
          this.alertMessage.showAlert(this.translate.instant('serviceModule.createservice.tokenError'), ActionType.FAILED);
          this.serviceForm.get('endToken').setValue(1);
          this.serviceForm.get('startToken').setValue(1000);
        }
        else
          this.serviceForm.get('endToken').setValue(startVal);
      }
    }
    else {
      this.serviceForm.get('endToken').setValue(+this.serviceForm.value.startToken + 1);
    }
  }

  getLevelInfo() {
    this.loading = true;
    this.service.getLevel().subscribe((response: Floor[]) => {
      if (response) {
        this.totalLevels = response;
        console.log("totalLevels==>", this.totalLevels);
        if (this.Data.data != null || this.Data.data != undefined) {
          console.log("totals==>", this.totalLevels, this.Data.data);
          let indl = this.totalLevels.findIndex(data => data.floorId == this.Data.data.floorId);
          if (indl != -1) {
            this.totalDepartments = this.totalLevels[indl].departments;
            this.serviceForm.get('deptId').setValue(this.Data.data.deptId);
          } else
            this.alertMessage.showAlert(this.translate.instant('serviceModule.createservice.levelsError'), ActionType.FAILED);
          console.log("totalDepartments==>", this.totalDepartments, this.Data.data.deptId);
        }
      }
      else {
        this.alertMessage.showAlert(this.translate.instant('serviceModule.createservice.noLevelSelectionError'), ActionType.FAILED);
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

  floorSelection() {

    if (this.Data.data == null || !this.Data.data)
      this.serviceForm.get('servicePrefix').setValue('');
    this.floorId = this.serviceForm.value.floorId
    console.log("fllorId==>", this.totalLevels);
    this.totalDepartments = this.totalLevels.find(data => data.floorId == this.floorId).departments.filter(x => x.status == 1);
    console.log("totalDepartments==>", this.totalDepartments);
    this.totalDepartments = this.totalDepartments.filter(data => data.deptType !== 0);
    this.serviceForm.get('deptId').setValue(null);
  }

  servicePrefixExist() {
    this.loading = true;
    if (this.serviceForm.getRawValue().floorId == null) {
      this.alertMessage.showAlert(this.translate.instant('serviceModule.createservice.selectLevelError'), ActionType.FAILED);
      this.loading = false;
    }
    else {
      if (this.servicePrefixV != this.serviceForm.value.servicePrefix) {
        this.service.validServicePrefix((this.serviceForm.value.servicePrefix as string).trim(), this.serviceForm.getRawValue().floorId).subscribe((response: IServiceResponse) => {
          if (response.status) {
            this.serviceForm.get('servicePrefixV').setValue(this.serviceForm.value.servicePrefix);
            this.servicePrefixFlag = true;
            this.serviceDisableFlag = false;
          } else {
            this.servicePrefixFlag = false;
            this.serviceDisableFlag = true;
            this.serviceForm.get('servicePrefixV').setValue(null);
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
      else {
        if (this.serviceForm.value.serviceId != 0)
          this.serviceForm.get('servicePrefixV').setValue(this.servicePrefixV);
        this.loading = false;
        this.servicePrefixFlag = true;
        this.serviceDisableFlag = false;
      }
    }
  }
  onSubmit() {
    if (this.serviceForm.value.startToken && this.serviceForm.value.endToken) {
      if (this.serviceForm.value.startToken < this.serviceForm.value.endToken) {
        this.loading = true;
        this.serviceData = {
          serviceId: this.serviceForm.value.serviceId,
          deptId: this.serviceForm.getRawValue().deptId,
          serviceEngName: (this.serviceForm.value.serviceEngName as string).trim(),
          serviceArName: (this.serviceForm.value.serviceArName as string).trim(),
          servicePrefix: (this.serviceForm.value.servicePrefix as string).trim(),
          npEarlyCheckin: this.serviceForm.value.npEarlyCheckin,
          npLateCheckin: this.serviceForm.value.npLateCheckin,
          startToken: this.serviceForm.value.startToken,
          endToken: this.serviceForm.value.endToken,
          serviceColor: this.serviceForm.value.serviceColor,
          floorId: this.serviceForm.getRawValue().floorId,
          orgId: this.orgId
        };
        console.log('servicedata=>', this.serviceData)
        if (this.Data.data == null || this.Data.data == undefined) {
          // this.service.validServicePrefix((this.serviceForm.value.servicePrefix as string).trim(), this.serviceData.floorId + '').subscribe((response: IServiceResponse) => {
          //   if (response.status) {
              this.service.createService(this.serviceData).subscribe((response: IServiceResponse) => {
                console.log("createService=>",response);
                
                if (response.status) {
                  this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
                  this.dialogRef.close(this.serviceData);
                } else {
                  this.alertMessage.showAlert(response.messages, ActionType.FAILED);
                }
                this.loading = false;
              }, error => {
                let message = error.error.messages as string
                let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
                console.log("Failed :: ", JSON.stringify(error));
                this.showAlert(errorMessage, ActionType.ERROR, error.status);
                this.loading = false;
              });
          //   }
          //   else {
          //     this.alertMessage.showAlert(response.messages, ActionType.FAILED);
          //   }
          // }, error => {
          //   let message = error.error.messages as string
          //   let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          //   console.log("Failed :: ", JSON.stringify(error));
          //   this.showAlert(errorMessage, ActionType.ERROR, error.status);
          //   this.loading = false;
          // });
        }
        else {
          console.log("Submit==>" + JSON.stringify(this.serviceData), this.serviceForm.value);
          if (this.servicePrefixV != this.serviceForm.value.servicePrefix) {
            // this.service.validServicePrefix((this.serviceForm.value.servicePrefix as string).trim(), this.serviceData.floorId + '').subscribe((response: IServiceResponse) => {
            //   if (response.status) {
                this.service.updateServiceInfo(this.serviceData).subscribe((response: IServiceResponse) => {
                  if (response.status) {
                    this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
                    this.dialogRef.close(this.serviceData);
                  } else {
                    this.alertMessage.showAlert(response.messages, ActionType.FAILED);
                  }
                  this.loading = false;
                }, error => {
                  let message = error.error.messages as string
                  let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
                  console.log("Failed :: ", JSON.stringify(error));
                  this.showAlert(errorMessage, ActionType.ERROR, error.status);
                  this.loading = false;
                });
              // } else {
              //   this.alertMessage.showAlert(response.messages, ActionType.FAILED);
              // }
            // }, error => {
            //   let message = error.error.messages as string
            //   let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            //   console.log("Failed :: ", JSON.stringify(error));
            //   this.showAlert(errorMessage, ActionType.ERROR, error.status);
            //   this.loading = false;
            // });
          }
          else {
            console.log("update==>" + JSON.stringify(this.serviceData))
            this.service.updateServiceInfo(this.serviceData).subscribe((response: IServiceResponse) => {
              if (response.status) {
                this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
                this.dialogRef.close(this.serviceData);
              } else {
                this.alertMessage.showAlert(response.messages, ActionType.FAILED);
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
      }
      else
        this.showAlert(this.translate.instant('serviceModule.createservice.validTokens'), ActionType.FAILED);
    }
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}