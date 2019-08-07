import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { IDepartment, DataType, ICreateProfile, ITestProfile, ApiResponse } from '../_model/onlinealerts.model';
import { OnlineAlertsService } from '../_service/onlinealerts.service';
import { IUserUpdateDto, userType, AppConfig, ITokenInfo } from '../../../_helpers/app.config';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-createdbprofile',
  templateUrl: './createdbprofile.component.html',
  styleUrls: ['./createdbprofile.component.scss']
})
export class CreateDBprofileComponent implements OnInit {
  profileFormGroup: FormGroup;
  loading: boolean = false;
  loadingT: boolean = false;
  connectivityFlag: boolean = false;
  savedisable: boolean = false;
  deptList: IDepartment[] = [];
  dataTypeList: DataType[] = [];
  dataTypes: DataType;
  loginInfo: IUserUpdateDto;
  profileEditModel: ICreateProfile = {} as any;
  createProfileModel: ICreateProfile = {} as any;
  _roleCode: string = "";
  constructor(private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: ICreateProfile,
    public dialogRef: MatDialogRef<CreateDBprofileComponent>, private alertMessage: AlertMessageService,
    private translate: TranslateService, private router: Router, private service: OnlineAlertsService, private appconfig: AppConfig) {
    let tokenInfo = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenInfo) {
      this.loginInfo = (tokenInfo.tokenInfo as any).sub ? JSON.parse((tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      console.log("rolename::::", this._roleCode);
    }
    console.log("EDIT==>", data);
  }
  ngOnInit() {
    this.getDataTypes();
    this.profileFormGroup = this.formBuilder.group({
      connectionstring: [null],
      profileName: [null, Validators.required],
      validateprofileName: [null, [Validators.required], [ProfileValidator(this.service)]],
      dbType: [null, Validators.required],
      ipAddress: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      userName: [null, Validators.required],
      password: [null, Validators.required],
      port: [null, Validators.required],
      dbName: [null, Validators.required],
      oraConnectionType: [null],
      departmentName: [null, Validators.required],
      dbProfileId: [null]
    });
    this.profileFormGroup.valueChanges.subscribe((smsText) => {
      this.savedisable = false;
    });
    if (userType.SuperAdmin == this._roleCode || userType.PlatFormAdmin == this._roleCode)
      this.getDepartments();
    else {
      this.profileFormGroup.patchValue({
        departmentName: this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0
      });
    }
    if (this.data != null || this.data != undefined) {
      this.profileEditModel = this.data;
      this.profileFormGroup.patchValue({
        profileName: this.data.profileName,
        connectionstring: this.data.connectionstring,
        dbName: this.data.dbname,
        userName: this.data.username,
        password: this.data.password,
        port: this.data.port,
        ipAddress: this.data.serverIp,
        dbProfileId: this.data.dbProfileId,
        oraConnectionType: this.data.oraConnectionType,
      });
      this.profileFormGroup.get('dbType').setValue(this.data.databaseTypes.dbTypeId);
      this.profileFormGroup.get('validateprofileName').clearValidators();
      this.profileFormGroup.get('validateprofileName').clearAsyncValidators();
      this.profileFormGroup.get('validateprofileName').updateValueAndValidity();
      if(this.profileFormGroup.value.dbType === 3){
        console.log("connectivityFlag==>",this.profileFormGroup.value.dbType);
        this.connectivityFlag = true;
        }else{
        this.connectivityFlag = false;
        }
    }
  }

  getDataTypes() {
    this.loadingT = true;
    this.service.getAllDataTypes().subscribe((response: DataType[]) => {
      if (response) {
        console.log("DataType==>", response);
        this.dataTypeList = response;
        console.log('dataTypeList=>', this.dataTypeList);
      }
      this.loadingT = false;
    }, error => {
      this.dataTypeList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getDataTypes==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loadingT = false;
    });
  }
  getDepartments() {
    this.loading = true;
    this.service.getDepartmentswithUser().subscribe((response: IDepartment[]) => {
      if (response) {
        console.log("Response==>", response);
        this.deptList = response;
        console.log('deptUsersList=>', this.deptList);
        if (this.data != null || this.data != undefined) {
          this.profileFormGroup.get('departmentName').setValue(this.data.deptId);
        }
      }
      this.loading = false;
    }, error => {
      this.deptList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getDepartments==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  TestProfileConnection() {
    this.loading = true;
    let dbName = this.dataTypeList.filter(y => y.dbTypeId == this.profileFormGroup.value.dbType)[0].dbName;
    // let deptName = this.deptList.filter(x => x.deptId == this.profileFormGroup.value.departmentName)[0].deptName;
    let testProFile = {
      connectionstring: '',
      databaseTypes: { dbTypeId: this.profileFormGroup.value.dbType, dbName: dbName },
      dbname: this.profileFormGroup.value.dbName,
      deptId: this.profileFormGroup.value.departmentName,
      deptName: '',
      oraConnectionType: this.profileFormGroup.value.oraConnectionType ? this.profileFormGroup.value.oraConnectionType : '',
      oraConnectionValue: '',
      password: this.profileFormGroup.value.password,
      port: this.profileFormGroup.value.port,
      profileName: this.profileFormGroup.value.profileName,
      serverIp: this.profileFormGroup.value.ipAddress,
      username: this.profileFormGroup.value.userName
    } as ITestProfile;
    console.log("json==>" + JSON.stringify(testProFile));
    this.service.testConnection(testProFile).subscribe((response: ApiResponse) => {
      console.log(response);
      if (response.status) {
        this.savedisable = true;
        this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
      } else {
        this.savedisable = false;
        this.alertMessage.showAlert(response.message, ActionType.FAILED);
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-TestProfileConnection==>", JSON.stringify(error));
      this.savedisable = false;
      this.loading = false;
      this.showAlert(errorMessage, ActionType.ERROR);
    });
  }

  profileCreation() {
    this.loading = true;
    // let deptName = this.deptList.filter(x => x.deptId == this.profileFormGroup.value.departmentName)[0].deptName;
    let dbName = this.dataTypeList.filter(y => y.dbTypeId == this.profileFormGroup.value.dbType)[0].dbName;
    if (!this.data) {
      let profileCreate = {
        connectionstring: '',
        databaseTypes: { dbTypeId: this.profileFormGroup.value.dbType, dbName: dbName },
        dbname: this.profileFormGroup.value.dbName,
        deptId: this.profileFormGroup.value.departmentName,
        deptName: '',
        oraConnectionType: this.profileFormGroup.value.oraConnectionType ? this.profileFormGroup.value.oraConnectionType : '',
        oraConnectionValue: '',
        password: this.profileFormGroup.value.password,
        port: this.profileFormGroup.value.port,
        profileName: this.profileFormGroup.value.profileName,
        serverIp: this.profileFormGroup.value.ipAddress,
        username: this.profileFormGroup.value.userName
      } as ICreateProfile;
      console.log("ProfileModel==>" + JSON.stringify(profileCreate));
      this.service.profileCreation(profileCreate).subscribe((response: ApiResponse) => {
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(profileCreate);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.message as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-profileCreation==>", JSON.stringify(error));
        this.loading = false;
        this.showAlert(errorMessage, ActionType.ERROR);
      });
    } else {
      let IProfileUpdate = {
        dbProfileId: this.data.dbProfileId,
        connectionstring: '',
        databaseTypes: { dbTypeId: this.profileFormGroup.value.dbType, dbName: dbName },
        dbname: this.profileFormGroup.value.dbName,
        deptId: this.profileFormGroup.value.departmentName,
        deptName: '',
        oraConnectionType: this.profileFormGroup.value.oraConnectionType ? this.profileFormGroup.value.oraConnectionType : '',
        oraConnectionValue: '',
        password: this.profileFormGroup.value.password,
        port: this.profileFormGroup.value.port,
        profileName: this.profileFormGroup.value.profileName,
        serverIp: this.profileFormGroup.value.ipAddress,
        username: this.profileFormGroup.value.userName
      } as ICreateProfile;
      console.log('UpdateGroup=>', JSON.stringify(IProfileUpdate));
      this.service.updateProfile(IProfileUpdate).subscribe((response: ApiResponse) => {
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(IProfileUpdate);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-profileCreation==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
  }
  dbtypeChange(event) {
    console.log("Event==>", event);
    let dbTypeName = this.dataTypeList.filter(x => x.dbTypeId == this.profileFormGroup.value.dbType)[0].dbName
    if (dbTypeName === 'ORACLE') {
      this.connectivityFlag = true;
      this.profileFormGroup.get('oraConnectionType').setValidators(Validators.required);
      this.profileFormGroup.get('oraConnectionType').updateValueAndValidity();
    } else {
      this.connectivityFlag = false;
      this.profileFormGroup.get('oraConnectionType').clearValidators();
      this.profileFormGroup.get('oraConnectionType').clearAsyncValidators();
      this.profileFormGroup.get('oraConnectionType').updateValueAndValidity();
    }
  }
}

export function ProfileValidator(service: OnlineAlertsService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value != null ? service.validateProfileName((control.value as string).trim())
      .map(response => {
        console.log(response.status)
        return !response.status ? { invalid: true } : null
      }) : null;
  };
}