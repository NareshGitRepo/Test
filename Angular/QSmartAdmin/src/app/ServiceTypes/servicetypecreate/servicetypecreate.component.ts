import { ActionType, AlertMessageService, AlertType } from '../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../_helpers/app.config';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ICreateService, ILevelData, IServiceResponse, IServiceType } from '../_model/serviceModel';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { Router } from '@angular/router';
import { ServiceTypeService } from '../_service/serviceTypeservice';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-service-typecreate',
  templateUrl: './servicetypecreate.component.html',
  styleUrls: ['./servicetypecreate.component.scss']
})
export class ServiceTypecreateComponent implements OnInit {
  serviceForm: FormGroup;
  loading: boolean = false;
  orgId: number;
  _tokenInfo: IUserUpdateDto;
  levellist: ILevelData[];
  editFlag: boolean = false;
  icicNameFlag: boolean = false;
  iciclocationFlag: boolean = false;
  constructor(private fb: FormBuilder, private serviceTypeservice: ServiceTypeService,
    private dialogRef: MatDialogRef<ServiceTypecreateComponent>, private translate: TranslateService,
    private alertMessage: AlertMessageService, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public editServiceType: any, private appconfig: AppConfig,
    private router: Router, ) {
    console.log('editServiceType=>', editServiceType);
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      this.orgId = this._tokenInfo.orgId;
    }
    this.getFloorsWithDeptsByFacilitateId();
  }

  ngOnInit() {
    this.serviceForm = this.fb.group({
      serviceLevel: [null, Validators.required],
      serviceId: [null, Validators.required],
      medicalname: [null, Validators.required],
      serviceName: [null, Validators.required],
      serviceLocation: [null, Validators.required],
    });
    this.serviceForm.controls.serviceName.valueChanges.subscribe(name => {
      if (name.includes('&'))
      this.icicNameFlag = true;
    else
      this.icicNameFlag = false;
    });
    this.serviceForm.controls.serviceLocation.valueChanges.subscribe(name => {
      if (name.includes('&'))
      this.iciclocationFlag = true;
    else
      this.iciclocationFlag = false;
    });
    if (this.editServiceType != null || this.editServiceType != undefined) {
      this.serviceForm.patchValue({
        serviceLevel: this.editServiceType.floorId
      }
      )
    }
    if (this.editServiceType.data != null || this.editServiceType.data != undefined) {
      this.serviceForm.patchValue({
        serviceLevel: this.editServiceType.data.floorId,
        serviceName: this.editServiceType.data.srTypeName,
        serviceLocation: this.editServiceType.data.srTypeLocation,
        serviceId: this.editServiceType.data.svcSegmentId,
        medicalname: this.editServiceType.data.medicalService
      });
      this.editFlag = true;
    }
  }

  getFloorsWithDeptsByFacilitateId() {
    this.loading = true;
    this.serviceTypeservice.getFloorsWithDeptsByFacilitateId().subscribe((response: ILevelData[]) => {
      this.levellist = response;
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
  createService() {
    this.loading = true;


    if (!this.editServiceType.data) {
      let createService = {
        floorId: this.serviceForm.value.serviceLevel,
        orgId: this.orgId,
        srTypeLocation: (this.serviceForm.value.serviceLocation as string).trim(),
        srTypeName: (this.serviceForm.value.serviceName as string).trim(),
        svcSegmentId: this.serviceForm.value.serviceId,
        medicalService: (this.serviceForm.value.medicalname as string).trim(),
      } as ICreateService;
      console.log('createService=>' + JSON.stringify(createService));
      this.serviceTypeservice.addServiceNew(createService).subscribe((response: IServiceResponse) => {
        if (response.status == true) {
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close(createService);
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
    else if (this.editServiceType.data != null || this.editServiceType.data != undefined) {

      if (this.editServiceType.data.srTypeName == (this.serviceForm.value.serviceName as string).trim() && this.editServiceType.data.srTypeLocation == (this.serviceForm.value.serviceLocation as string).trim() && this.editServiceType.data.svcSegmentId == (this.serviceForm.value.serviceId as string).trim() && this.editServiceType.data.medicalService == (this.serviceForm.value.medicalname as string).trim()) {
        this.alertMessage.showAlert(this.translate.instant('ServiceTypeModule.createservice.updatealert'), ActionType.SUCCESS);
        this.dialogRef.close();
      }
      else {
        let updateService = {
          floorId: this.serviceForm.value.serviceLevel,
          orgId: this.orgId,
          srTypeLocation: (this.serviceForm.value.serviceLocation as string).trim(),
          srTypeName: (this.serviceForm.value.serviceName as string).trim(),
          srTypeId: this.editServiceType.data.srTypeId,
          svcSegmentId: (this.serviceForm.value.serviceId as string).trim(),
          medicalService: (this.serviceForm.value.medicalname as string).trim()
        } as IServiceType;
        console.log('updateService=>', updateService);
        this.serviceTypeservice.updateServiceTypeInfoNew(updateService).subscribe((response: IServiceResponse) => {
          if (response.status == true) {
            this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
            this.dialogRef.close(updateService);
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
  }
}

