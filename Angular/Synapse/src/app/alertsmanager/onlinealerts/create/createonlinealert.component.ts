import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { OnlineAlertsService } from '../_service/onlinealerts.service';
import { ISenderList, IupdateColumnData, IIntervalType, DataByQuery, ISystemParams, ITableAndColumnData, ITable, IColumn, ApiResponse, AlertsRef, IGDbProfileInfo, IDbProfileData, ICreateAlert, IServiceInfo } from '../_model/onlinealerts.model';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ITokenInfo, IUserUpdateDto, AppConfig, userType } from '../../../_helpers/app.config';
import * as _ from "lodash";
@Component({
  selector: 'app-createonlinealert',
  templateUrl: './createonlinealert.component.html',
  styleUrls: ['./createonlinealert.component.scss']
})
export class CreateonlinealertComponent implements OnInit {
  _inputData: FormGroup;
  _updateData: FormGroup;
  _updateDetails: FormGroup;
  _alertDetails: FormGroup;
  msgPlaceHolder: string = 'Message';
  _arabic = /[\u0621-\u064A]/;
  _unicode = /[^\u0000-\u007F]+/;
  format = /[~^\[\]{}|\\]/g;
  charcount = 0;
  @ViewChild('message') type: ElementRef;
  msgCount: number;
  engLength: number = 1848;
  arbLength: number = 804;
  oldmessage: string = '';
  msglength: number = this.engLength;
  columnDetails: IupdateColumnData[] = [];
  Time: number[] = [];
  Columns: string[] = [];
  loading: boolean = false;
  dbProfiles: IGDbProfileInfo[] = [];
  dbProfileData: IDbProfileData[] = [];
  sendersData: ISenderList[] = [];
  ServiceList: IServiceInfo[] = [];
  systemParams: ISystemParams[] = [];
  intervalTypes: IIntervalType[] = [];
  tableData: ITable[] = [];
  columnData: IColumn[] = [];
  createObj: ICreateAlert;
  validate: boolean = false;
  loginInfo: IUserUpdateDto;
  selectQuerycount: number;
  _dbProfileName: string;
  _senderName: string;
  _intervalType: string;
  _roleCode: string;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CreateonlinealertComponent>, private service: OnlineAlertsService
    , @Inject(MAT_DIALOG_DATA) public _editAlertData: ICreateAlert, private cdref: ChangeDetectorRef,
    private router: Router, private translate: TranslateService, private alertMessage: AlertMessageService, private appConfig: AppConfig) {
    console.log("_editAlertData=>", this._editAlertData);
    let tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenInfo) {
      this.loginInfo = (tokenInfo.tokenInfo as any).sub ? JSON.parse((tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      console.log("rolename::::", this._roleCode);
    }
    else {
      this.router.navigate(['401']);
    }
  }

  ngOnInit() {
    this._inputData = this.fb.group({
      alertName: [null, [Validators.required, Validators.minLength(5)]],
      validateAlertName: [null, [Validators.required], [AlertNameValidator(this.service)]],
      connectionProfile: [null, Validators.required],
      selectStatement: [null, [Validators.required, Validators.minLength(15)]],
      selectValidate: [null, Validators.required],
      mobileField: [null, Validators.required],
    });
    this._updateDetails = this.fb.group({
      updateColumnName: [null],
      staticColumnValue: [null],
      dynamicColumnValue: [null],
      isStatic: ['0']
    });
    this._updateData = this.fb.group({
      updateTable: [null, Validators.required],
      UpdateUniqueColumn: [null, Validators.required],
      setColumnData: [null, Validators.required],
      updateDetails: this._updateDetails
    });
    this._alertDetails = this.fb.group({
      senderId: [null, Validators.required],
      isCustom: [null],
      columnName: [null],
      alertMessage: [null, Validators.required],
      intervalType: [null, Validators.required],
      intervalTime: [null, Validators.required],
      service: [null, Validators.required]
    });

    this.getProfiles();


    this._alertDetails.controls.alertMessage.valueChanges.subscribe((smsText) => {
      this.messageCount(smsText);
    });
    this._alertDetails.controls.senderId.valueChanges.subscribe((senderId) => {
      this._senderName = '';
      if (senderId != null) {
        let index = this.sendersData.findIndex(x => x.senderId == senderId);
        this._senderName = index != -1 ? this.sendersData[index].senderName : '';
      }
    });
    this._inputData.controls.connectionProfile.valueChanges.subscribe((profileId) => {
      this._dbProfileName = '';
      if (profileId != null) {
        let index = this.dbProfiles.findIndex(x => x.dbProfileId == profileId);
        this._dbProfileName = index != -1 ? this.dbProfiles[index].profileName : '';
      }
    });
    this._alertDetails.controls.intervalType.valueChanges.subscribe((intervalId) => {
      this._intervalType = '';
      if (intervalId != null) {
        let index = this.intervalTypes.findIndex(x => x.intervalTypeId == intervalId);
        this._intervalType = index != -1 ? this.intervalTypes[index].intervalName : '';
      }
    });
  }

  getProfiles() {
    this.loading = true;
    this.service.getAllProfiles(this._roleCode).subscribe((result: IGDbProfileInfo[]) => {
      if (result.length > 0) {
        console.log("Response==>Active", result)
        this.dbProfiles = result.filter(x => x.status == 1);
      
            let Dbdata = _.groupBy(this.dbProfiles, 'deptName');
            Object.keys(Dbdata).forEach(x => {
              console.log("x=>", x);
              this.dbProfileData.push({ deptName: x == 'null' ? 'Admin' : x, dbProfileInfo: Dbdata[x] } as IDbProfileData);
            });
            console.log('dbProfiles=>', this.dbProfiles, this.dbProfileData);
          
      }
      this.getSystemParams();
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getProfiles==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });

  }

  getSystemParams() {
    this.service.getSystemParams().subscribe((result: ISystemParams[]) => {
      if (result) {
        console.log("Response==>Active", result)
        this.systemParams = result;
        console.log('systemParams=>', this.systemParams);
      }
      this.getSenders();
    }, error => {
      this.systemParams = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getSystemParams==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    })
  }


  getSenders() {
    // this.loading = true;
    this.service.getAllSenders().subscribe((result: ISenderList[]) => {
      if (result) {
        console.log("Response==>Active", result)
        this.sendersData = result.filter(x => x.status == 1 && x.senderType!=2);
        console.log('sendersData=>', this.sendersData);
      }
      this.getIntervalTypes();
      // this.loading = false;
    }, error => {
      this.sendersData = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getSenders==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getIntervalTypes() {
    this.service.getIntervals().subscribe((result: IIntervalType[]) => {
      if (result) {
        console.log("Response==>Active", result)
        this.intervalTypes = result;
        console.log('intervalTypes=>', this.intervalTypes);
      }
      this.getServices();
      // this.loading = false;
    }, error => {
      this.intervalTypes = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getIntervalTypes==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getServices() {
    this.service.getServiceInfo().subscribe((result: IServiceInfo[]) => {
      if (result) {
        console.log("Response==>Active", result)
        this.ServiceList = result;
        console.log('ServiceList=>', this.ServiceList);
      }
      if (this._editAlertData != null) {
        //this.action = "Edit";
        this._inputData.patchValue({
          alertName: this._editAlertData.onlineAlertName,
          selectStatement: this._editAlertData.selectQuery
        });
        this._inputData.get('validateAlertName').clearAsyncValidators();
        this._inputData.get('validateAlertName').clearValidators();
        this._inputData.get('validateAlertName').updateValueAndValidity();
        let index = this.dbProfiles.findIndex(x => x.dbProfileId == this._editAlertData.dbProfileInfo.dbProfileId);
        if (index != -1) {
          this._inputData.get('connectionProfile').setValue(this._editAlertData.dbProfileInfo.dbProfileId);
          this.ValidateSelectQuery(false);
        }
        else {
          this.showAlert(this.translate.instant('Alert Manager.createAlert.profileDeactivatedError'), ActionType.ERROR);
        }
        this._alertDetails.patchValue({
          isCustom: this._editAlertData.messageType == 1 ? true : false,
          alertMessage: this._editAlertData.message,
          intervalType: this._editAlertData.intervalType.intervalTypeId,
          service: this._editAlertData.serviceId
        });
        let index1 = this.sendersData.findIndex(x => x.senderId == this._editAlertData.senderId);
        if (index1 != -1) {
          this._alertDetails.get('senderId').setValue(this._editAlertData.senderId);
        }
        else {
          this.showAlert(this.translate.instant('Alert Manager.createAlert.senderDeactivatedError'), ActionType.ERROR);
        }
        this.intervalTypeChange(false);
      }
      else {
        this._alertDetails.get('senderId').setValue(this.sendersData.length > 0 ? this.sendersData[0].senderId : null);
      }
      this.loading = false;
    }, error => {
      this.ServiceList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getServices==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    })
  }

  messageCount(smsText) {
    if (smsText) {
      this.msgPlaceHolder = this._arabic.test(smsText) ? 'MessageArbic' : (this._unicode.test(smsText) ? 'MessageUnicode': 'MessageEnglish');
      this.charcount = smsText.length;
      if (this._unicode.test(smsText)) {
        this.msgCount = Math.ceil((this.charcount > 70 ? this.charcount : 67) / 67);
        this.msglength = this.arbLength;
        if (this.charcount > this.arbLength)
          this._alertDetails.get('alertMessage').setValue(this._alertDetails.value.alertMessage);
      }
      else {
        let formCahr = smsText.match(this.format);
        this.charcount += formCahr == null ? 0 : formCahr.length;
        this.msgCount = Math.ceil((this.charcount > 160 ? this.charcount : 153) / 153);
        this.msglength = this.engLength - (formCahr == null ? 0 : formCahr.length);
        if (this.charcount > this.engLength)
          this._alertDetails.get('alertMessage').setValue(this._alertDetails.value.alertMessage);
      }
      if (this.msgCount > 12) {
        this._alertDetails.get('alertMessage').setValue(this.oldmessage);
      }
      else
        this.oldmessage = smsText;
    }
    else {
      this.oldmessage = '';
      this.msgCount = 0;
      this.charcount = 0;
      this.msgPlaceHolder = 'Message';
    }
    this.cdref.detectChanges();
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  ValidateSelectQuery(action?: boolean) {

    if (action) {
      let num: number
      this.selectQuerycount = num;
      this.loading = true;
      this.Columns = [];
      this.columnData=[];
      this._inputData.get('selectValidate').setValue(null);
      this._inputData.get('mobileField').setValue(null);
      this._updateData.get('updateTable').setValue(null);
      this._updateData.get('UpdateUniqueColumn').setValue(null);
      this._updateData.get('setColumnData').setValue(null);
      this._updateDetails.get('updateColumnName').setValue(null);
      this.columnDetails = [];
    }
    let selectedquery = this._inputData.value.selectStatement.toLowerCase().trim();
    console.log("selectedquery:::", selectedquery);
    if (selectedquery.startsWith('select ') && selectedquery.includes(' from ')) {

      this.service.getDataFromQuery(+this._inputData.value.connectionProfile, selectedquery).subscribe((response: DataByQuery) => {
        console.log(response);
        if (response.status) {
          this._inputData.get('selectValidate').setValue(true);
          this.validate = true;
          console.log("Response==>Active", response)
          if (response.columnsList) {
            this.Columns = Object.keys(response.columnsList);
            this.selectQuerycount = response.dataCount;
            if (!action)
              this._inputData.get('mobileField').setValue(this._editAlertData.mobilenoColumn);
            console.log('dataFromQuery=>', this.Columns);
            this.service.getTablesInfoFromQuery(+this._inputData.value.connectionProfile, selectedquery).subscribe((tableResponse: ITableAndColumnData) => {
              if (tableResponse.status) {
                this.tableData = tableResponse.tables;
                if (!action) {
                  this._updateData.get('updateTable').setValue(this._editAlertData.tableName);
                  this.tableSelection(this._editAlertData.tableName, false);
                }
              }
            }, error => {
              let message = error.error.messages as string
              let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
              console.error("E-ValidateSelectQuery==>", JSON.stringify(error));
              this.showAlert(errorMessage, ActionType.ERROR, error.status);
              this.loading = false;
            });
          }
        }
        else {
          this.showAlert(response.message, ActionType.ERROR);
        }
        if (action)
          this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-ValidateSelectQuery==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
    else {
      this.loading = false;
      this.showAlert('please enter valid Query', ActionType.ERROR);
    }

    this.cdref.detectChanges();
  }

  tableSelection(tablename, action?: boolean) {
    this.loading = true;
    this.columnData = this.tableData.filter(x => x.tableName == tablename)[0].columns;
    this._updateData.get('setColumnData').setValue(null);
    this._updateDetails.get('updateColumnName').setValue(null);
    if (action) {
      this._updateData.get('UpdateUniqueColumn').setValue(null);
      this.columnDetails = [];
    }
    else {
      this._updateData.get('UpdateUniqueColumn').setValue(this._editAlertData.uniqueColumn);
      this.addSetColumnData(false);
    }
    this.loading = false;
  }

  editSelectQuery() {
    let num: number;
    this.selectQuerycount = num;
    this.validate = false;
    this.Columns = [];
    this._inputData.get('selectValidate').setValue(null);
    this._inputData.get('mobileField').setValue(null);
  }

  ConnectionProfileChange() {
    let num: number;
    this.selectQuerycount = num;
    this.validate = false;
    this.Columns = [];
    this._inputData.get('selectValidate').setValue(null);
    this._inputData.get('selectStatement').setValue(null);
    this._inputData.get('mobileField').setValue(null);
  }

  createAlert() {
    this.loading = true;
    let alertsRefData: AlertsRef[] = [];
    this.columnDetails.forEach(x => {
      alertsRefData.push({ columnName: x.columnName, type: +x.staticvalue, value: x.UpdateValue } as AlertsRef)
    })
    this.createObj = {
      alertsRefs: alertsRefData,
      dbProfileInfo: {
        dbProfileId: this._inputData.value.connectionProfile,
        profileName: ''
      },
      deptId: this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0,
      intervalType: {
        intervalName: '',
        intervalTypeId: this._alertDetails.value.intervalType,
      },
      intervalValue: this._alertDetails.value.intervalTime,
      message: this._alertDetails.value.alertMessage,
      messageType: this._alertDetails.value.isCustom == true ? 1 : 0,
      mobilenoColumn: this._inputData.value.mobileField,
      onlineAlertName: this._inputData.value.alertName,
      selectQuery: this._inputData.value.selectStatement,
      senderId: this._alertDetails.value.senderId,
      serviceId: this._alertDetails.value.service,
      tableName: this._updateData.value.updateTable,
      uniqueColumn: this._updateData.value.UpdateUniqueColumn,
    }
    console.log("submitted Data:::", JSON.stringify(this.createObj));
    if (this._editAlertData == null) {
      this.createObj.deptId = this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0;
      this.service.createAlert(this.createObj).subscribe((response: ApiResponse) => {
        console.log("response=>", response);
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS)
          this.dialogRef.close(response.status);
        }
        else
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        this.loading = false;
      },
        error => {
          this.loading = false;
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-createAlert==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR);
        });
    }
    else {
      this.createObj.deptId = this._editAlertData.deptId;
      this.createObj.alertOnlineId = this._editAlertData.alertOnlineId
      this.service.updateAlert(this.createObj).subscribe((response: ApiResponse) => {
        console.log("response=>", response);
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS)
          this.dialogRef.close(response.status);
        }
        else
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        this.loading = false;
      },
        error => {
          this.loading = false;
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-createAlert==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR);
        });
    }
  }

  addSetColumnData(action?: boolean) {
    if (action) {
      let id = this.columnDetails.length > 0 ? this.columnDetails[this.columnDetails.length - 1].id : 0
      this.columnDetails.push({ id: id + 1, columnName: this._updateDetails.value.updateColumnName, staticvalue: this._updateDetails.value.isStatic, UpdateValue: this._updateDetails.value.isStatic == '0' ? this._updateDetails.value.staticColumnValue : this._updateDetails.value.dynamicColumnValue } as IupdateColumnData);
      this._updateDetails.get('updateColumnName').setValue(null);
      this._updateDetails.get('staticColumnValue').setValue(null);
      this._updateDetails.get('dynamicColumnValue').setValue(null);
      this._updateData.get('setColumnData').setValue(this.columnDetails);
    }
    else {
      let id = 0
      this._editAlertData.alertsRefs.forEach(x => {
        this.columnDetails.push({ id: id++, columnName: x.columnName, staticvalue: '' + x.type, UpdateValue: x.value })
      });
      this._updateDetails.get('updateColumnName').setValue(null);
      this._updateDetails.get('staticColumnValue').setValue(null);
      this._updateDetails.get('dynamicColumnValue').setValue(null);
      this._updateData.get('setColumnData').setValue(this.columnDetails);
    }
  }

  removeSetColumnData(selRow: IupdateColumnData) {
    let index: number = this.columnDetails.findIndex(x => x.id == selRow.id);
    if (index !== -1) {
      this.columnDetails.splice(index, 1);
    }
    if (this.columnDetails.length > 0) {
      this._updateData.get('setColumnData').setValue(this.columnDetails);
    }
    else
      this._updateData.get('setColumnData').setValue(null);
  }

  customSelection() {
    if (this._alertDetails.value.isCustom == false) {
      this._alertDetails.get('columnName').setValue(null);
      this._alertDetails.get('columnName').clearValidators();
      this._alertDetails.get('columnName').updateValueAndValidity()
    }
    else {
      //this._alertDetails.get('columnName').setValidators(Validators.required)
    }
  }

  addColumnFieldToMesssage(): void {
    let oldMessage = this.type.nativeElement.value.trim();
    let element = this.type.nativeElement;
    console.log("oldMessage::" + oldMessage);
    let caretPos = element.selectionStart;
    let ddlText = " <$" + this._alertDetails.value.columnName + "$> ";
    let msg = oldMessage.substring(0, caretPos) + ddlText + oldMessage.substring(caretPos);
    this._alertDetails.get('alertMessage').setValue(msg);
    console.log("Mesage1::::::::" + this._alertDetails.get('alertMessage').value);
    this.cdref.detectChanges();
  }

  intervalTypeChange(action?: boolean) {
    if (this._alertDetails.value.intervalType == 1 || this._alertDetails.value.intervalType == 2) {
      this.Time = [];
      for (var i = 1; i < 60; i++) {
        this.Time.push(i);
      }
    }
    if (this._alertDetails.value.intervalType == 3) {
      this.Time = [];
      for (var i = 1; i < 24; i++) {
        this.Time.push(i);
      }
    }
    if (!action)
      this._alertDetails.get('intervalTime').setValue(+this._editAlertData.intervalValue);
    else
      this._alertDetails.get('intervalTime').setValue(null);
  }

}

export function AlertNameValidator(service: OnlineAlertsService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value != null ? service.validateAlertName((control.value as string).trim())
      .map(response => {
        console.log(response.status)
        return !response.status ? { invalid: true } : null
      }) : null;
  };
}