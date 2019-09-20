import * as _ from 'lodash';

import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActionType, AlertMessageService } from '../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto, userType } from '../../_helpers/app.config';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { Department, DepartmentCollection, Doctor, Floor, IClients, ICreateUsers, IDepartment, IDoctorList, IGetUser, IGroups, IHospitals, IResActiveUser, IRoles, IService, IUser, IUserResponse } from '../_model/IUsers';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';

import { DualListComponent } from 'angular-dual-listbox';
import { EncriptAndDecriptService } from '../../_helpers/encriptAndDecript';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UsersService } from '../_service/users.service';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})
export class CreateuserComponent implements OnInit {

  usersForm: FormGroup;
  deprtmntflag: boolean = false;
  groupflag: boolean = false;
  clientflag: boolean = false;
  facilityFlag: boolean = false;
  _roledata: IRoles[];
  totalClients: IClients[];
  totalGroups: IGroups[];
  totalHospitals: IHospitals[];
  totalDepartements: IDepartment[] = [];
  totalServices: IService[] = [];
  totalServicesWithDept: IDepartment[] = [];
  totalDepartementsList: any;
  depData: any;
  orgData: any;
  doctData: any;
  usersData: ICreateUsers;
  _roleName: string;
  roleid: number;
  _deptAction = false;
  __hospAction = false;
  _doctorAction = false;
  _expandFlag = false;
  levelflag: boolean = false;
  serviceflag: boolean = false;
  _orgid: number;
  _tokenInfo: IUserUpdateDto;
  DoctorsList: IDoctorList[] = [];
  newDoctorsList: IDoctorList[] = [];
  selectDoctorList: IUser[] = [];
  key: string = 'firstname';
  display: any;
  format: any = DualListComponent.DEFAULT_FORMAT;
  country: string;
  loading: boolean = false;
  totalLevels: Floor[] = [];
  verifyButton: boolean = true;
  loginFlag: boolean;
  loginDisableFalg: boolean;
  ldapError: string = '';
  resourseEmailValudation: boolean = true;
  resoursemobileValudation: boolean = true;
  segmentCodeFlag: boolean = false;;
  segmentCodeValdnFlag: boolean = false;
  segmentCodeErrorFlag: boolean = false;
  _roleEditable:boolean = false;

  constructor(public dialogRef: MatDialogRef<CreateuserComponent>,
    private fb: FormBuilder, private usersService: UsersService,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public _editUserdata: IGetUser, private translate: TranslateService,
    private alertMessage: AlertMessageService, private cdref: ChangeDetectorRef, private appconfig: AppConfig,
    private router: Router, private encriptAndDecriptService: EncriptAndDecriptService) {
    this.country = this.appconfig.getCountry();
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;

    if (this._tokenInfo && tokenData) {
      this._roleName = this._tokenInfo.roles[0].roleName;
      if (this._roleName != userType.SuperAdmin)
        this._orgid = this._tokenInfo.orgId;

    }
    else
      this.router.navigate(['401']);
  }

  ngOnInit() {
    this.usersForm = this.fb.group({
      firstname: [null, [Validators.required,Validators.minLength(1)],[this.appconfig.UserMinValidator(1)]],
      validateuserName: [null, [Validators.required]],
      lastname: [null, [Validators.required,Validators.minLength(1)],[this.appconfig.UserMinValidator(1)]],
      login: [null,  [Validators.required, Validators.minLength(5)]],
      password: [null, [Validators.required]],
      contactNo: [null, Validators.compose([Validators.required, Validators.minLength(8)])],
      emailId: [null, [Validators.required, Validators.pattern("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$")]],
      client: [null],
      groups: [null],
      hospitals: [null],
      role: [null, Validators.required],
      drSegmentId: [null],
      department: [null],
      level: [null,],
      service: [null],
      doctor: [null],
      userType: ['0']
    });
    this.getRolesInfo();
    if (this._editUserdata) {
      console.log("_editUserdata=>", this._editUserdata);
      let serviceedit = []
      this._editUserdata.services.forEach(x => {
        if (x.serviceId != 0)
          serviceedit.push(x.serviceId);
      });
      this.usersForm.patchValue({
        firstname: this._editUserdata.firstname,
        lastname: this._editUserdata.lastname,
        login: this._editUserdata.login,
        password: this._editUserdata.hashedPassword,
        contactNo: this._editUserdata.contactNo,
        emailId: this._editUserdata.emailId,
        userType: this._editUserdata.userType,
        role: this._editUserdata.roles.length > 0 ? this._editUserdata.roles[0].roleId : null,
        level: this._editUserdata.levelId + '',
      });

      this.usersForm.get('password').clearValidators();
      this.usersForm.get('password').updateValueAndValidity();
      this.usersForm.get('role').setValue(this._editUserdata.roles[0].roleName);
      let orgid = this._editUserdata.orgId ? this._editUserdata.orgId : 0;
      let deptid: any;
      deptid = this._editUserdata.depts.length > 0 ? this._editUserdata.depts[0].deptId : 0;


      if (this._editUserdata.roles[0].roleName === userType.ClientAdmin && orgid != 0) {
        this.usersForm.get('client').setValue(orgid + '');
      }
      else if (this._editUserdata.roles[0].roleName === userType.GroupAdmin && orgid != 0) {
        this.usersForm.get('groups').setValue(orgid + '');
      }
      else if (this._editUserdata.roles[0].roleName === userType.FacilityAdmin && orgid != 0) {
        this.usersForm.get('hospitals').setValue(orgid + '');
      }
      else {
        console.log("deptid=>", deptid);

       if (this._editUserdata.orgId) {
          if (orgid != 0) {
            this.usersForm.get('hospitals').setValue(orgid + '');
            this.selectHospital(this._editUserdata.orgId, true);
          }
        }
      }

      console.log(this.usersForm.value.role);
      this.roleid = this._editUserdata.roles[0].roleId;
      console.log(this.usersForm.value.client);
      this.usersForm.get('validateuserName').clearValidators();
      this.usersForm.get('validateuserName').clearAsyncValidators();
      this.usersForm.get('validateuserName').updateValueAndValidity();
    }
    this.usersForm.get('drSegmentId').valueChanges.subscribe(x=>{

      if(this.segmentCodeFlag)
      {
        this.segmentCodeValdnFlag=true;
        this.segmentCodeErrorFlag=false;
      }

    });
    // else {
    //   if (this._roleName == userType.FacilityAdmin)
    //     this.getLevelsInfo();
    // }
    this.cdref.detectChanges();
  }
  // private stationLabel(item: any) {
  //   return item.firstname;
  // }

  verifyName() {
    this.loginDisableFalg = false;
    this.loginFlag = false;
    this.loading = true;
    this.usersForm.get('validateuserName').setValue(null);
    if (this.verifyButton) {


      if (this.usersForm.value.userType == '0') {
        this.usersForm.get('password').setValidators([Validators.required,Validators.minLength(5)]);
        this.usersForm.get('password').updateValueAndValidity();
        let validlogin = this.usersForm.value.validateuserName != null ? (this.usersForm.value.validateuserName as string).trim() : '';
        if ((this.usersForm.value.login as string).trim() != validlogin) {
          this.usersForm.get('validateuserName').setValue(null);
          this.loading = true;
          this.usersService.isLogInIdExits((this.usersForm.value.login as string).trim()).subscribe((response: IUserResponse) => {
            if (response.status) {
              this.usersForm.get('validateuserName').setValue((this.usersForm.value.login as string).trim());
              this.verifyButton = false;
              this.loginFlag = true;
              console.log('status=>', response.status);
            }
            else {
              this.loginDisableFalg = true;
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
          this.verifyButton = false;
          this.loginFlag = true;
          this.loading = false;
        }
      }
      else {
        this.usersForm.get('password').clearValidators();
        this.usersForm.get('password').updateValueAndValidity();

        this.usersService.getUsersFromDirectory(this.usersForm.value.login).subscribe((response: IResActiveUser) => {
          console.log("ActiveUsers==>", response);
          if (response.status) {
            this.usersForm.get('validateuserName').setValue((this.usersForm.value.login as string).trim());
            if (response.users.length > 0) {
              this.loginFlag = true;
              this.verifyButton = false;
              this.usersForm.patchValue({
                firstname: response.users[0].firstName != null ? response.users[0].firstName : '',
                lastname: response.users[0].lastName != null ? response.users[0].lastName : '',
                contactNo: response.users[0].phoneNumber != null ? response.users[0].phoneNumber : '',
                emailId: response.users[0].email != null ? response.users[0].email : '',
              });
            }
          }
          else {
            this.loginDisableFalg = true;
            this.ldapError = response.message;
            // this.alertMessage.showAlert(this.translate.instant('usersModule.createuser.lDapUserError'), ActionType.FAILED);
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
    else {
      this.verifyButton = true;
      if (this.usersForm.value.userType == '1') {
        this.usersForm.patchValue({
          firstname: null,
          lastname: null,
          contactNo: null,
          emailId: null,

        });
      }
      this.loading = false;
    }
  }
  changeUserType() {
    console.log("Change User==>", this.usersForm.value.userType);
    this.verifyButton = true;
    this.loginFlag = false;
    this.usersForm.patchValue({
      firstname: null,
      lastname: null,
      contactNo: null,
      emailId: null,
      validateuserName: null,
    });
  }
  getRolesInfo() {
    this.loading = true;
    this.usersService.getRolesByUserRoleId()
      .subscribe((response: IRoles[]) => {
        console.log('_roledata', response);
        if (response.length != 0) {
          this._roledata = response;

          if (this._roledata.length > 0) {
            if (this._roledata.length == 1 && !this._editUserdata) {
              this.roleValidation(this._roledata[0].roleName, false);

              this.usersForm.get('role').setValue(this._roledata[0].roleName);
            }
            else if (this._editUserdata) {
              this.roleValidation(this._editUserdata.roles[0].roleName, false);
            }
          }
          else {
            this.alertMessage.showAlert(this.translate.instant('usersModule.createuser.noAccessError'), ActionType.FAILED);
            this.dialogRef.close();
          }
          this.loading = false;
          if (this.usersForm.value.role === userType.ClientAdmin) {
            this.usersForm.get('role').setValue(response[0].roleName);
            this.roleid = this._roledata.filter(x => x.roleName == this.usersForm.value.role)[0].roleId;
            this.usersForm.get('client').setValidators(Validators.required);
            this.usersForm.get('client').updateValueAndValidity();
            this.getClientsInfo();
          }
        } else {
          this.alertMessage.showAlert(this.translate.instant('usersModule.createuser.noAccessError'), ActionType.FAILED);

          this.dialogRef.close();
        }

        this.loading = false;
        console.log("12345", this._roleName, userType.FacilityAdmin);

        if (this._roleName == userType.FacilityAdmin)
          this.getLevelsInfo();
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }

  roleValidation(value: string, action: boolean) {
    if(!this._roleEditable)
    {
    console.log('rolevalue=>', value);
    if (action)
      this.usersForm.get('department').setValue(null);
    this.__hospAction = false;
    this._deptAction = false;
    this.deprtmntflag = false;
    this.facilityFlag = false;
    this.groupflag = false;
    this.clientflag = false;
    this.levelflag = false;
    this.serviceflag = false;
    this.segmentCodeErrorFlag=false;
    this.usersForm.get('client').clearValidators();
    this.usersForm.get('client').updateValueAndValidity();
    this.usersForm.get('groups').clearValidators();
    this.usersForm.get('groups').updateValueAndValidity();
    this.usersForm.get('department').clearValidators();
    this.usersForm.get('department').updateValueAndValidity();

    this.usersForm.get('hospitals').clearValidators();
    this.usersForm.get('hospitals').updateValueAndValidity();
    this.usersForm.get('level').clearValidators();
    this.usersForm.get('level').updateValueAndValidity();
    this.usersForm.get('service').clearValidators();
    this.usersForm.get('service').updateValueAndValidity();
    this.usersForm.get('doctor').clearValidators();
    this.usersForm.get('doctor').updateValueAndValidity();


    switch (value) {
      case userType.ClientAdmin:
        this.usersForm.get('client').setValidators(Validators.required);
        this.usersForm.get('client').updateValueAndValidity();
        this.usersForm.get('hospitals').setValue(null);
        this.usersForm.get('groups').setValue(null);
        this.usersForm.get('department').setValue(null);
        this.clientflag = true;
        this.getClientsInfo();
        break;
      case userType.GroupAdmin:
        this.usersForm.get('groups').setValidators(Validators.required);
        this.usersForm.get('groups').updateValueAndValidity();
        this.usersForm.get('hospitals').setValue(null);
        this.usersForm.get('client').setValue(null);
        this.usersForm.get('department').setValue(null);
        this.groupflag = true;
        this.getGroupsInfo();
        break;
      case userType.FacilityAdmin:
        this.usersForm.get('hospitals').setValidators(Validators.required);
        this.usersForm.get('hospitals').updateValueAndValidity();
        this.usersForm.get('groups').setValue(null);
        this.usersForm.get('client').setValue(null);
        this.usersForm.get('department').setValue(null);
        this.facilityFlag = true;
        this.getHospitalsInfo();
        break;
      // case userType.Pharmacist:


      default:
        switch (this._roleName) {
          case userType.ClientAdmin:
            this.usersForm.get('hospitals').setValidators(Validators.required);
            this.usersForm.get('hospitals').updateValueAndValidity();
            this.usersForm.get('groups').setValue(null);
            this.usersForm.get('client').setValue(null);
            this.facilityFlag = true;
            if (action) {
              this.usersForm.get('hospitals').setValue(null);
              this.usersForm.get('department').setValue(null);
            }
            else if (this._editUserdata) {
              this.deprtmntflag = true;
              this.getDepartementsInfo(this._editUserdata.orgId);
            }
            this.usersForm.get('department').setValidators(Validators.required);
            this.usersForm.get('department').updateValueAndValidity();
            this.__hospAction = true;

            this._deptAction = true;
            this.getHospitalsInfo();

            break;
          default:
            if(value==userType.Resource || value==userType.Doctor)
            {

              if(action)
              {
              this.segmentCodeValdnFlag = true;
              this.usersForm.get('drSegmentId').setValue(null);
              }
              else
              {
                this.usersForm.get('drSegmentId').setValue(this._editUserdata.drSegmentId);
                this._roleEditable = true;
                  this.isRoleEditable();
              }
            this.usersForm.get('drSegmentId').setValidators([Validators.required,Validators.minLength(5),Validators.maxLength(10)]);
            this.usersForm.get('drSegmentId').updateValueAndValidity();
            this.segmentCodeFlag = true;
            }else{
              this.segmentCodeFlag = false;
              this.segmentCodeValdnFlag = false;
              this.usersForm.get('drSegmentId').clearValidators();
              this.usersForm.get('drSegmentId').updateValueAndValidity();
              this.usersForm.get('drSegmentId').setValue(null);
            }

            this.usersForm.get('level').setValidators(Validators.required);
            this.usersForm.get('level').updateValueAndValidity();
            this.keyupemail(this.usersForm.value.emailId);
            this.keyupmobile(this.usersForm.value.contactNo);

            if (action) {
              this.usersForm.get('groups').setValue(null);
              this.usersForm.get('client').setValue(null);
              this.usersForm.get('hospitals').setValue(null);
              this.usersForm.get('level').setValue(null);
              this.usersForm.get('service').setValue(null);
              this.usersForm.get('doctor').setValue(null);
            }
            else {
              this.deprtmntflag = true;
            }
            this.levelflag = true;
            break;
        };
        break;
    };
    this.cdref.detectChanges();
  }
    else
    {
     this.usersForm.get('role').setValue(this._editUserdata.roles[0].roleName);
     this.showAlert(this.translate.instant('usersModule.createuser.roleEditMsg'), ActionType.ALERT);
    }
  }
  isRoleEditable(){
    this.usersService.isRoleEditable(this._editUserdata.userId).subscribe((response: IUserResponse) => {
      console.log("isRoleEditable=>",response);

      if (response.status) {
        this._roleEditable = false;
      }
      else {
        this._roleEditable = true;
      }
    }, error => {
      this._roleEditable = true;
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);


  });
  }
  selectHospital(value, action) {
    if (this.__hospAction)
      if (action) {
        this.getLevelsInfo(value);
        this.deprtmntflag = true;
      }
      else {
        this.deprtmntflag = false;
      }
  }
  keyupmobile(event) {
    if (this.usersForm.value.role == userType.Resource) {
      if (!this.resoursemobileValudation && event != null && event != '') {
        this.usersForm.get('contactNo').setValidators(Validators.compose([Validators.required, Validators.minLength(8)]));
        this.usersForm.get('contactNo').updateValueAndValidity();
        this.resoursemobileValudation = true;
      }
      else if (this.resoursemobileValudation && (event == null || event == '')) {
        this.usersForm.get('contactNo').clearValidators();
        this.usersForm.get('contactNo').updateValueAndValidity();
        this.resoursemobileValudation = false;
      }
    }
    else if (!this.resoursemobileValudation) {
      this.usersForm.get('contactNo').setValidators(Validators.compose([Validators.required, Validators.minLength(8)]));
      this.usersForm.get('contactNo').updateValueAndValidity();
      this.resoursemobileValudation = true;
    }
  }
  keyupemail(event) {
    if (this.usersForm.value.role == userType.Resource) {
      if (!this.resourseEmailValudation && event != null && event != '') {
        this.usersForm.get('emailId').setValidators([Validators.required, Validators.pattern("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$")]);
        this.usersForm.get('emailId').updateValueAndValidity();
        this.resourseEmailValudation = true;
      }
      else if (this.resourseEmailValudation && (event == null || event == '')) {
        console.log("keyupmobile=>", event, this.resourseEmailValudation);
        this.usersForm.get('emailId').clearValidators();
        this.usersForm.get('emailId').updateValueAndValidity();
        this.resourseEmailValudation = false;
      }
    }
    else if (!this.resourseEmailValudation) {
      this.usersForm.get('emailId').setValidators([Validators.required, Validators.pattern("^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$")]);
      this.usersForm.get('emailId').updateValueAndValidity();
      this.resourseEmailValudation = true;
    }
  }
  getGroupsInfo() {
    this.loading = true;
    this.usersService.getGroupsInfo()
      .subscribe((response: IGroups[]) => {
        if (response) {
          this.groupflag = true;
          this.totalGroups = response;
        }
        else {
          this.totalGroups = [];
        }
        this.loading = false;
      },
        error => {
          this.totalGroups = [];
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.log("Failed :: ", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
  }
  getClientsInfo() {
    this.loading = true;
    this.usersService.getClientsInfo()
      .subscribe((response: IClients[]) => {
        if (response.length != 0) {
          this.clientflag = true;
          this.totalClients = response;
          console.log('clients', this.totalClients);
        }
        else {
          this.totalClients = [];
          this.alertMessage.showAlert(this.translate.instant('usersModule.createuser.noClientSelectionError'), ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        this.totalClients = [];
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }

  getHospitalsInfo() {
    this.loading = true;
    this.usersService.getHospitalsInfo()
      .subscribe((response: IHospitals[]) => {
        if (response.length != 0) {
          this.facilityFlag = true;
          this.totalHospitals = response;
        }
        else {
          this.totalHospitals = [];
          this.alertMessage.showAlert(this.translate.instant('usersModule.createuser.noHospitalsError'), ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        this.totalHospitals = [];
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }
  getLevelsInfo(value?: number) {
    this.loading = true;
    this.usersService.getFloorsInfo().subscribe((result: Floor[]) => {
      if (result.length != 0) {
        this.totalLevels = result;
        if (this._editUserdata) {
          this.levelSelection(this._editUserdata.levelId, false);
        }
        console.log("totalLevels=>", this.totalLevels);
      }
      else {
        this.totalLevels = [];
        this.alertMessage.showAlert(this.translate.instant('usersModule.createuser.noDataLevelError'), ActionType.FAILED);
      }
      this.loading = false;
    }, err => {
      this.totalLevels = [];
      let message = err.error.messages as string
      let errorMessage = err.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : err.message;
      console.log("Failed :: ", JSON.stringify(err));
      this.showAlert(errorMessage, ActionType.ERROR, err.status);
      this.loading = false;
    });

  }
  levelSelection(value, action: boolean) {
    console.log('rolevalue=>', value);
    this.usersForm.get('department').setValue(null);
    this.usersForm.get('service').setValue(null);
    this.serviceflag = false;
    this._doctorAction = false;
    this.deprtmntflag = true;
    if (action) {
      // this.getLevelsInfo();
      this.getDepartementsInfo(value, true);
      this.usersForm.get('department').setValidators(Validators.required);
      this.usersForm.get('department').updateValueAndValidity();
    }
    else
      this.getDepartementsInfo(value, false);

    this.cdref.detectChanges();
  }

  SelectDepartMent(value, action: boolean) {
    console.log("department selected::::", value);
    if (this.usersForm.value.role.toLowerCase() == 'nurse' || this.usersForm.value.role.toLowerCase() == 'serviceresource') {

      this._doctorAction = true;
      this.doctorsList(action);
      this.usersForm.get('doctor').setValidators(Validators.required);
      this.usersForm.get('doctor').updateValueAndValidity();

      this.cdref.detectChanges();
    }
    else if (this.usersForm.value.role.toLowerCase() == 'doctor' || this.usersForm.value.role.toLowerCase() == 'resource') {
      this.usersForm.get('service').setValidators(Validators.required);
      this.usersForm.get('service').updateValueAndValidity();
      // this.usersForm.get('service').setValue(null);
      this.serviceflag = true;
      let servicedata = [];
      console.log("this.usersForm.value.service", this.usersForm.value.service);
      // this.totalServices = this.totalDepartements.filter(x => x.deptId == value)[0].services;
      if (action) {
        this.totalServicesWithDept = this.totalDepartements.filter(x => value.findIndex(y => y == x.deptId) != -1);
        if (this.usersForm.value.service) {
          servicedata = this.usersForm.value.service;
          servicedata = servicedata.filter(x => this.totalServicesWithDept.findIndex(y => y.services.findIndex(z => z.serviceId == x) != -1) != -1);
          servicedata.length > 0 ? this.usersForm.get('service').setValue(servicedata) : this.usersForm.get('service').setValue(null)
        }
        console.log("services=>", this.totalServicesWithDept, this.totalServicesWithDept, servicedata);
      }
      else {
        this.totalServicesWithDept = this.totalDepartements.filter(x => this._editUserdata.depts.findIndex(y => y.deptId == x.deptId) != -1);
        console.log("services=>", this.totalServicesWithDept, this.totalServicesWithDept, value);
      }
      if (!action) {
        let serviceedit = []
        this._editUserdata.services.forEach(x => {
          if (x.serviceId != 0)
            serviceedit.push(x.serviceId);
        });
        this.usersForm.get('service').setValue(serviceedit);
      }
      this.cdref.detectChanges();
    }

  }
  getDepartementsInfo(value?: number, action?: boolean) {
    this.usersForm.get('department').setValue(null);
    this.loading = true;
    this.deprtmntflag = true;

    this.totalDepartementsList = this.totalLevels.filter(x => x.floorId == value)[0].departments.filter(y => y.status == 1);
    switch (this.usersForm.value.role) {
      case userType.Pharmacist:
        let pharmarcyidex = this.totalDepartementsList.findIndex(x => x.deptName == 'Pharmacy');
        if (pharmarcyidex != -1) {
          let pharmarcy = this.totalDepartementsList[pharmarcyidex].deptId;
          this.usersForm.get("department").setValue([pharmarcy]);
        }
        else
          this.showAlert(this.translate.instant('usersModule.createuser.noPharmacyError'), ActionType.FAILED);

        this.totalDepartements = this.totalLevels.filter(x => x.floorId == value)[0].departments.filter(y => y.status == 1 && y.deptType == 0);
        console.log("total Departments:::::", this.totalDepartements);

        break;
      case userType.LabTechnician:
        let labidex = this.totalDepartementsList.findIndex(x => x.deptName == 'Laboratory');
        if (labidex != -1) {
          let lab = this.totalDepartementsList[labidex].deptId;
          this.usersForm.get("department").setValue([lab]);
        }
        else
          this.showAlert(this.translate.instant('usersModule.createuser.noPharmacyError'), ActionType.FAILED);

        this.totalDepartements = this.totalLevels.filter(x => x.floorId == value)[0].departments.filter(y => y.status == 1 && y.deptType == 0);
        break;
      case userType.Clerk:
        let clerkidex = this.totalDepartementsList.findIndex(x => x.deptName == 'Registration');
        if (clerkidex != -1) {
          let clerk = this.totalDepartementsList[clerkidex].deptId;
          this.usersForm.get("department").setValue([clerk]);
        }
        else
          this.showAlert(this.translate.instant('usersModule.createuser.noRegisError'), ActionType.FAILED);

        this.totalDepartements = this.totalLevels.filter(x => x.floorId == value)[0].departments.filter(y => y.status == 1 && y.deptType == 0);
        break;
      default:
        this.totalDepartements = this.totalLevels.filter(x => x.floorId == value)[0].departments.filter(y => y.status == 1 && y.deptType != 0);
        break;
    }
    if (!action) {
      let docl = [];
      this._editUserdata.depts.forEach(x => {
        docl.push(x.deptId);
      });
      this.usersForm.get('department').setValue(this._editUserdata.depts.length > 0 ? docl : null);

      this.SelectDepartMent(this._editUserdata.depts.length > 0 ? docl : [0], false);
    }
    this.cdref.detectChanges();
    this.loading = false;
  }
  doctorsList(action?: boolean) {

    if (this._doctorAction === true) {
      this.loading = true;
      this.usersService.getDoctorsByMultipleDepartments(this.usersForm.value.department).subscribe((response: IDoctorList[]) => {
        console.log("DoctorList=>", response);

        if (response.length != 0) {
          this.DoctorsList = response.filter(x=> this._editUserdata ? x.userId!=this._editUserdata.userId : true );
          if (!action) {
            let docl = [];
            this._editUserdata.doctors.forEach(x => {
              docl.push(x.userId);
            })
            this.usersForm.get('doctor').setValue(this._editUserdata.doctors.length > 0 ? docl : null);
          }
          else {
            let selecteddoctors = this.usersForm.value.doctor != null ? (this.usersForm.value.doctor) as number[] : [];
            if (selecteddoctors.length > 0) {
              let filiterdoctor = selecteddoctors.filter(x => this.DoctorsList.findIndex(y => y.userId == x) != -1);
              this.usersForm.get('doctor').setValue(filiterdoctor.length > 0 ? filiterdoctor : null);
            }
          }
        } else {
          this.DoctorsList = [];
          this.usersForm.get('doctor').setValue(null);
          this.alertMessage.showAlert(this.translate.instant('usersModule.createuser.nodoctFound'), ActionType.FAILED);

        }
        this.loading = false;
      }, error => {
        this.DoctorsList = [];
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
  }
  validateDoctorList() {
    this._doctorAction = true;
    this._expandFlag = false;
  }
  createUser() {
    this.loading = true;
    this.roleid = this._roledata.filter(x => x.roleName == this.usersForm.value.role)[0].roleId;
    let departmentCollections: DepartmentCollection[] = [];
    let doctorCollection: Doctor[] = [];
    switch (this.usersForm.value.role) {
      case userType.GroupAdmin:
        this.orgData = this.usersForm.value.groups;
        this.depData = [];
        this.doctData = [];
        break;
      case userType.ClientAdmin:
        this.orgData = this.usersForm.value.client;
        this.depData = [];
        this.doctData = [];

        break;
      case userType.FacilityAdmin:
        this.orgData = this.usersForm.value.hospitals;
        this.depData = [];
        this.doctData = [];

        break;
      default:
        switch (this._roleName) {
          case userType.ClientAdmin:
            this.orgData = this.usersForm.value.hospitals;
            if ((this.usersForm.value.role as string).toLowerCase() === 'nurse' || (this.usersForm.value.role as string).toLowerCase() === 'serviceresource') {
              this.doctData = doctorCollection;
            } else {
              this.depData = [{ deptId: this.usersForm.value.department }];
              this.doctData = [];

            }
            break;
          default:
            this.orgData = this._orgid;
            break;
        };
        break;
    }

    if (!this._editUserdata) {
      let serviceid = 0;
      if (this.usersForm.value.department != null && this.usersForm.value.level != null && this.usersForm.value.service == null) {
        let depList = this.totalLevels.filter(x => x.floorId == this.usersForm.value.level)[0].departments.filter(y => y.deptId == this.usersForm.value.department);
        if (depList.length > 0) {
        if(depList[0].services.length>0)
          serviceid = depList[0].services[0].serviceId;
        }
      }
      this.usersData = {
        userId: 0,
        contactNo: ((this.usersForm.value.contactNo == null ? '' : this.usersForm.value.contactNo) as string).trim(),
        depts: this.usersForm.value.department == null ? [0] : this.usersForm.value.department,
        doctors: this.usersForm.value.doctor == null ? [0] : this.usersForm.value.doctor,
        firstname: (this.usersForm.value.firstname as string).trim(),
        hashedPassword: this.usersForm.value.userType == '0' ? this.encriptAndDecriptService.encryptPassword(this.usersForm.value.password) : '',
        levelId: this.usersForm.value.level == null ? 0 : this.usersForm.value.level,
        lastname: (this.usersForm.value.lastname as string).trim(),
        login: (this.usersForm.value.login as string).trim(),
        orgId: this.orgData,
        roles: [{ roleId: this.roleid }] as any,
        services: this.usersForm.value.service == null ? [serviceid] : this.usersForm.value.service,
        userType: this.usersForm.value.userType,
        emailId: this.usersForm.value.emailId,
        drSegmentId: (this.usersForm.value.role == userType.Resource || this.usersForm.value.role == userType.Doctor) ? this.usersForm.value.drSegmentId : ''
      }
      console.log('Data' + JSON.stringify(this.usersData));
      this.usersService.isLogInIdExits((this.usersForm.value.login as string).trim()).subscribe((response: IUserResponse) => {
        if (response.status == true) {
          console.log(response.status)
          this.usersService.createUser(this.usersData).subscribe((response: IUserResponse) => {
            if (response) {
              this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
              this.dialogRef.close(this.usersData);
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
      });
    }
    else {
      let serviceid = 0;
      if (this.usersForm.value.department != null && this.usersForm.value.level != null && this.usersForm.value.service == null) {
        let depList = this.totalLevels.filter(x => x.floorId == this.usersForm.value.level)[0].departments.filter(y => y.deptId == this.usersForm.value.department);
        if (depList.length > 0) {
          serviceid = depList[0].services[0].serviceId;
        }
      }

      this.usersData = {
        userId: this._editUserdata.userId,
        contactNo: (this.usersForm.value.contactNo as string).trim(),
        depts: this.usersForm.value.department == null ? [0] : this.usersForm.value.department,
        doctors: this.usersForm.value.doctor == null ? [0] : this.usersForm.value.doctor,
        firstname: (this.usersForm.value.firstname as string).trim(),
        hashedPassword: this.usersForm.value.userType == '0' ? this.usersForm.value.password : '',
        levelId: this.usersForm.value.level == null ? 0 : this.usersForm.value.level,
        lastname: (this.usersForm.value.lastname as string).trim(),
        login: (this.usersForm.value.login as string).trim(),
        orgId: this.orgData,
        roles: [{ roleId: this.roleid }] as any,
        services: this.usersForm.value.service == null ? [serviceid] : this.usersForm.value.service,
        isactive: 1,
        userType: this.usersForm.value.userType,
        emailId: this.usersForm.value.emailId,
        drSegmentId: (this.usersForm.value.role == userType.Resource || this.usersForm.value.role == userType.Doctor) ? this.usersForm.value.drSegmentId : ''
      }
      console.log('Data=>', JSON.stringify(this.usersData));
      this.usersService.updateUser(this.usersData).subscribe((response: IUserResponse) => {
        if (response) {
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close(this.usersData);
        } else {
          this.alertMessage.showAlert(response.messages, ActionType.FAILED);
          this.loading = false;
        }
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
    this.cdref.detectChanges();
  }
  check() {
    console.log("form=>", this.usersForm);
    console.log("form=>", this.usersForm.value);
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  //By vaijayanthi
  validateSegmentCode() {
    this.loading = true;
    let validflag=true;
    validflag= this._editUserdata ? this._editUserdata.drSegmentId != this.usersForm.value.drSegmentId:true;
    if (validflag) {
      console.log('validation');

      this.usersService.validateDoctorSegment(this.usersForm.value.drSegmentId).subscribe((response: IUserResponse) => {
        if (response.status) {
         this.segmentCodeValdnFlag=false;
        } else {
          this.segmentCodeErrorFlag=true;
          this.segmentCodeValdnFlag=true;
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }else{
      this.segmentCodeValdnFlag = false;
      this.loading = false;
    }
  }

}

export function UserValidator(service: UsersService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value != null ? service.isLogInIdExits((control.value as string).trim())
      .map(response => {
        console.log(response.status)
        return !response.status ? { invalid: true } : null
      }) : null;
  };
}
