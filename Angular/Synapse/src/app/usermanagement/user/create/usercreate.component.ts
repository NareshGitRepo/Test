import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { AdminModule, ICreditType, IAllModules, ICreateUser, IDepartment, IResponse, IUser, IUserRole, Module, userType, IResActiveUser } from '../_model/usermodel';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatCheckboxChange } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../_services/_user.service';

@Component({
  selector: 'app-usercreate',
  templateUrl: './usercreate.component.html',
  styleUrls: ['./usercreate.component.scss']
})
export class UsercreateComponent implements OnInit {
  loading: boolean = false;
  usersForm: FormGroup;
  _roledata: IUserRole[];
  _deptdata: IDepartment[];
  _adminData: AdminModule[];
  _userData: AdminModule[];
  creditTypes: ICreditType[] = [];
  departementflag: boolean = false;
  departementnotfoundflag: boolean = false;
  creditflag: boolean = false;
  labelPosition = 'before';
  creditData: ICreditType;
  adminData: AdminModule[];
  userData: AdminModule[] = [];
  loginInfo: IUserUpdateDto;
  _roleCode: string = '';
  verifyButton: boolean = true;
  loginFlag: boolean;
  loginDisableFalg: boolean;
  ldapError: string = '';
  creditFlag: boolean = false;
  patternEmail = /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/;
  constructor(private fb: FormBuilder, private userService: UserService,
    private dialogRef: MatDialogRef<UsercreateComponent>, private translate: TranslateService,
    private router: Router, private alertMessage: AlertMessageService,
    @Inject(MAT_DIALOG_DATA) public editData: IUser, private cdkref: ChangeDetectorRef, private appConfig: AppConfig) {

    let tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenInfo) {
      this.loginInfo = (tokenInfo.tokenInfo as any).sub ? JSON.parse((tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
    }
    else {
      this.router.navigate(['401']);
    }

    this.usersForm = this.fb.group({
      login: [null, Validators.required],
      firstname: [null, Validators.required],
      lastname: [null],
      mobileNo: [null, Validators.required],
      role: [null, Validators.required],
      checker: [false],
      userType: [0],
      departements: [null],
      creditType: [null],
      selectAll: [null],
      adminPrevilages: this.fb.array([], Validators.required),
      userPrevilages: this.fb.array([], Validators.required),
      validateUserName: [null, [Validators.required]],
      emailId: [null, [Validators.required, Validators.pattern(this.patternEmail)]]
    });
  }

  ngOnInit() {
    // this.getAllModules();
    this.userService.getCreditTypes().subscribe((result: ICreditType[]) => {
      if (result)
        console.log("result CreditTypes", result);
      this.creditTypes = result;
      this.getAllRoles();
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getAllRoles==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      // this.loading = false;
    });

    if (this.editData) {
      this.usersForm.patchValue(this.editData);
      this.usersForm.get('checker').setValue(this.editData.checker == 1 ? true : false);
      console.log('editData=>', this.editData, this.usersForm.value);
      this.usersForm.get('validateUserName').clearValidators();
      this.usersForm.get('validateUserName').clearAsyncValidators();
      this.usersForm.get('validateUserName').updateValueAndValidity();
    }

  }

  getAllRoles() {
    this.loading = true;
    this.userService.getRolesByUserRoleId().subscribe((response: IUserRole[]) => {
      if (response) {
        console.log("Response==>", response)
        // this.loading = false;
        this._roledata = response;
        if (this.editData) {
          this.usersForm.get('role').setValue(this.editData.roles[0].roleCode);
          this.getAllModulesByRoleId(false);
        } else
          this.loading = false;
        // if (this.editData)
        //   this.getAllModulesByRoleId(false);
      } else
        this.loading = false;
      this.cdkref.detectChanges();
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getAllRoles==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      // this.loading = false;
    });
  }

  getAllDepartements() {
    this.loading = true;
    this.userService.getActiveDepartments().subscribe((response: IDepartment[]) => {
      if (response) {
        this.loading = false;
        this._deptdata = response;

        if (this.editData && this.editData.depts.length > 0) {
          console.log("Response==>", response, this.editData.depts);
          let index = response.findIndex(data => data.deptId == this.editData.depts[0].deptId);
          if (index == -1) {
            this.usersForm.get('departements').setValidators(Validators.required);
            this.usersForm.get('departements').updateValueAndValidity();
            //  this.alertMessage.showAlert('Department inactive for this user', ActionType.FAILED);
            this.departementflag = true;
            this.creditflag = true;
            this.departementnotfoundflag = true;
          }
          else {
            this.usersForm.get('departements').setValue(this.editData.depts[0].deptName);
            let creditTypelist = this.editData.creditType ? this.editData.creditType.creditName : null;
            if (creditTypelist == "PrePaid" || creditTypelist == "Prepaid") {
              this.usersForm.get('creditType').setValue(creditTypelist);
              this.usersForm.get('creditType').disable();
            }
            else {
              this.usersForm.get('creditType').setValue(creditTypelist);
              this.usersForm.get('creditType').enable();
            }
            this.departementflag = true;
            this.creditflag = true;
            this.departementnotfoundflag = false;
          }
          this.cdkref.detectChanges();
        }
        else if (this._roleCode == userType.DepartementAdmin) {
          this.usersForm.get('departements').setValue(this.loginInfo.depts[0].deptName);
          this.cdkref.detectChanges();
          this.departementSelection();
        }
      }
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getAllDepartements==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  verifyName() {
    this.loginDisableFalg = false;
    this.loginFlag = false;
    this.loading = true;
    this.usersForm.get('validateUserName').setValue(null);
    if (this.verifyButton) {
      if (this.usersForm.value.userType == '0') {
        let validlogin = this.usersForm.value.validateUserName != null ? (this.usersForm.value.validateUserName as string).trim() : '';
        if ((this.usersForm.value.login as string).trim() != validlogin) {
          this.usersForm.get('validateUserName').setValue(null);
          this.loading = true;
          this.userService.validateUserName((this.usersForm.value.login as string).trim()).subscribe((response: IResponse) => {
            if (response.status) {
              this.usersForm.get('validateUserName').setValue((this.usersForm.value.login as string).trim());
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
            console.error("E-verifyName==>", JSON.stringify(error));
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
        this.userService.getUsersFromDirectory(this.usersForm.value.login).subscribe((response: IResActiveUser) => {
          console.log("ActiveUsers==>", response);
          if (response.status) {
            this.usersForm.get('validateUserName').setValue((this.usersForm.value.login as string).trim());
            if (response.users.length > 0) {
              this.loginFlag = true;
              this.verifyButton = false;
              this.usersForm.patchValue({
                firstname: response.users[0].firstName != null ? response.users[0].firstName : '',
                lastname: response.users[0].lastName != null ? response.users[0].lastName : '',
                mobileNo: response.users[0].phoneNumber != null ? response.users[0].phoneNumber : '',
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
          console.error("E-verifyName==>", JSON.stringify(error));
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
          mobileNo: null,
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
      mobileNo: null,
      emailId: null,
      validateuserName: null,
    });
  }
  get checkedForms() {
    return <FormArray>this.usersForm.get('userPrevilages');
  }

  get adminCheckedForms() {
    return <FormArray>this.usersForm.get('adminPrevilages');
  }
  getAllModulesByRoleId(action?: boolean) {
    let loadingFlad = true;
    this._adminData = [];
    this._userData = [];
    let selectAllCount: number = 0;
    console.log("getAllModulesByRoleId==>", this.usersForm.value.role)
    this.loading = true;
    let index = this._roledata.findIndex(x => x.roleCode == this.usersForm.value.role);
    if (index != -1) {
      let roleId = this._roledata[index].roleId;
      this.userService.getAllModulesByRoleId(roleId).subscribe((response: IAllModules) => {
        if (response) {
          console.log("Response==>", response)
          this._adminData = response.adminModules;
          this._userData = response.userModules;
          // this.getAllRoles();
          if (this.editData && !action) {
            // this.usersForm.get('role').setValue(this.editData.roles[0].roleCode);
            if (this.editData.roles[0].roleCode == userType.NormalUser) {
              this.usersForm.get('adminPrevilages').clearValidators();
              this.usersForm.get('adminPrevilages').updateValueAndValidity();
            }
            if (this.editData.roles[0].roleCode == userType.PlatFormAdmin) {
              this.usersForm.get('checker').setValue(true);
              this.usersForm.get('checker').disable();
            }
            this._adminData.forEach(data => {
              let indexid = this.editData.modules.findIndex(x => x.moduleId == data.moduleId);
              const roomObj = this.fb.group({
                moduleId: [data.moduleId],
                modulename: [data.modulename],
                checker: [indexid != -1 ? true : (data.moduleId == 1 || (data.moduleId == 2 && (this.editData.roles[0].roleCode == userType.PlatFormAdmin || this.editData.checker)) ? true : false)]
              });
              console.log("datapush=>", data.moduleId, this.editData.checker);
              this.adminCheckedForms.push(roomObj);
            });

            this._userData.forEach(data => {
              let indexid = this.editData.modules.findIndex(x => x.moduleId == data.moduleId);
              const roomObj = this.fb.group({
                moduleId: [data.moduleId],
                modulename: [data.modulename],
                checker: [indexid != -1 ? true : false]
              });
              this.checkedForms.push(roomObj);
            });
          }
          else {
            let userLength = this.checkedForms.length;
            while (userLength > 0) {
              this.checkedForms.removeAt(userLength - 1);
              userLength--;
            }
            let adminLength = this.adminCheckedForms.length;
            while (adminLength > 0) {
              this.adminCheckedForms.removeAt(adminLength - 1);
              adminLength--;
            }
            console.log("checkedForms=>", this.checkedForms);
            switch (this.usersForm.value.role) {
              case userType.DepartementAdmin:
              case userType.NormalUser:
                this._userData.forEach(data => {
                  const roomObj = this.fb.group({
                    moduleId: [data.moduleId],
                    modulename: [data.modulename],
                    checker: [false]
                  });
                  this.checkedForms.push(roomObj);
                });
                this._adminData.forEach(data => {
                  let value = data.moduleId;
                  const roomObj = this.fb.group({
                    moduleId: [data.moduleId],
                    modulename: [data.modulename],
                    checker: [value == 1 ? true : false]
                  });
                  this.adminCheckedForms.push(roomObj);
                });
                loadingFlad = false;
                this.getAllDepartements();
                break;
              default:
                this._userData.forEach(data => {
                  const roomObj = this.fb.group({
                    moduleId: [data.moduleId],
                    modulename: [data.modulename],
                    checker: [true]
                  });

                  this.checkedForms.push(roomObj);
                });
                this._adminData.forEach(data => {
                  const roomObj = this.fb.group({
                    moduleId: [data.moduleId],
                    modulename: [data.modulename],
                    checker: [true]
                  });

                  this.adminCheckedForms.push(roomObj);
                });
                break;
            }
          }
          selectAllCount = 0;
          this.checkedForms.controls.forEach(control => {
            if (control.value.checker == true) {
              selectAllCount++;
            }
          })
          console.log(this.checkedForms.controls.length, selectAllCount);
          if (this.checkedForms.controls.length == selectAllCount) {
            this.usersForm.get('selectAll').setValue(true);
          }
          else {
            this.usersForm.get('selectAll').setValue(false);
          }
          if (loadingFlad)
            this.loading = false;
          if (this.editData && !action)
            this.getAllDepartements();
        }
        this.cdkref.detectChanges();
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getAllModulesByRoleId==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
    else {
      this.loading = false;
      this.showAlert(this.translate.instant('userModule.create.noRoleData'), ActionType.ERROR);
    }
  }
  // getAllModules() {
  //   this.loading = true;
  //   this.userService.getAllModules().subscribe((response: IAllModules) => {
  //     if (response) {
  //       console.log("Response==>", response)
  //       this._adminData = response.adminModules;
  //       this._userData = response.userModules;

  //       // this.getAllRoles();
  //       if (this.editData) {
  //         this.usersForm.get('role').setValue(this.editData.roles[0].roleCode);
  //         if (this.editData.roles[0].roleCode == userType.NormalUser) {
  //           this.usersForm.get('adminPrevilages').clearValidators();
  //           this.usersForm.get('adminPrevilages').updateValueAndValidity();
  //         }
  //         if (this.editData.roles[0].roleCode == userType.PlatFormAdmin) {
  //           this.usersForm.get('checker').setValue(true);
  //           this.usersForm.get('checker').disable();
  //         }
  //         this._adminData.forEach(data => {
  //           let indexid = this.editData.modules.findIndex(x => x.moduleId == data.moduleId);
  //           const roomObj = this.fb.group({
  //             moduleId: [data.moduleId],
  //             modulename: [data.modulename],
  //             checker: [indexid != -1 ? true : (data.moduleId == 1 || (data.moduleId == 2 && (this.editData.roles[0].roleCode == userType.PlatFormAdmin || this.editData.checker)) ? true : false)]
  //           });
  //           console.log("datapush=>", data.moduleId, this.editData.checker);
  //           this.adminCheckedForms.push(roomObj);
  //         });

  //         this._userData.forEach(data => {
  //           let indexid = this.editData.modules.findIndex(x => x.moduleId == data.moduleId);
  //           const roomObj = this.fb.group({
  //             moduleId: [data.moduleId],
  //             modulename: [data.modulename],
  //             checker: [indexid != -1 ? true : false]
  //           });
  //           this.checkedForms.push(roomObj);
  //         });
  //       }
  //       else {
  //         this._userData.forEach(data => {
  //           const roomObj = this.fb.group({
  //             moduleId: [data.moduleId],
  //             modulename: [data.modulename],
  //             checker: [false]
  //           });
  //           this.checkedForms.push(roomObj);
  //         });
  //         this._adminData.forEach(data => {
  //           const roomObj = this.fb.group({
  //             moduleId: [data.moduleId],
  //             modulename: [data.modulename],
  //             checker: [false]
  //           });
  //           this.adminCheckedForms.push(roomObj);
  //         });

  //       }
  //       this.loading = false;
  //       if (this.editData)
  //         this.getAllDepartements();
  //     }
  //     this.cdkref.detectChanges();
  //   }, error => {
  //     let message = error.error.messages as string
  //     let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
  //     console.log("Failed :: ", JSON.stringify(error));
  //     this.showAlert(errorMessage, ActionType.ERROR, error.status);
  //     this.loading = false;
  //   });
  // }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  changeChecker() {
    const adminCtrlPrevilage = <FormArray>this.usersForm.get('adminPrevilages') as FormArray;
    let index = adminCtrlPrevilage.controls.findIndex(x => x.value.moduleId == 2);
    if (index != -1)
      adminCtrlPrevilage.controls[index].get('checker').setValue(this.usersForm.value.checker);
  }

  roleSelection() {
    const adminCtrl1 = <FormArray>this.usersForm.get('userPrevilages') as FormArray;
    const adminCtrlPrevilage = <FormArray>this.usersForm.get('adminPrevilages') as FormArray;
    switch (this.usersForm.value.role) {
      case userType.DepartementAdmin:
        this.departementflag = true;
        this.usersForm.get('checker').setValue(false);
        this.usersForm.get('checker').enable();
        this.usersForm.get('departements').setValidators(Validators.required);
        this.usersForm.get('departements').updateValueAndValidity();
        this.usersForm.get('creditType').setValidators(Validators.required);
        this.usersForm.get('creditType').updateValueAndValidity();
        this.getAllModulesByRoleId(true);
        // for (let i = 0; i < adminCtrl1.controls.length; i++) {
        //   adminCtrl1.controls[i].get('checker').setValue(false);
        // }
        // for (let i = 0; i < adminCtrlPrevilage.controls.length; i++) {
        //   let value = adminCtrlPrevilage.controls[i].value.moduleId;
        //   adminCtrlPrevilage.controls[i].get('checker').setValue(value == 1 ? true : false);
        // }
        break;
      case userType.NormalUser:
        this.departementflag = true;
        this.usersForm.get('checker').setValue(false);
        // this._adminData.forEach(value => {
        //   value.checked = false;
        // });
        this.usersForm.get('departements').setValidators(Validators.required);
        this.usersForm.get('departements').updateValueAndValidity();
        this.usersForm.get('creditType').setValidators(Validators.required);
        this.usersForm.get('creditType').updateValueAndValidity();
        // this.usersForm.get('adminPrevilages').clearValidators();
        // this.usersForm.get('adminPrevilages').updateValueAndValidity();
        this.getAllModulesByRoleId(true);
        // for (let i = 0; i < adminCtrl1.controls.length; i++) {
        //   adminCtrl1.controls[i].get('checker').setValue(false);
        // }
        // for (let i = 0; i < adminCtrlPrevilage.controls.length; i++) {
        //   let value = adminCtrlPrevilage.controls[i].value.moduleId;
        //   adminCtrlPrevilage.controls[i].get('checker').setValue(value == 1 ? true : false);
        // }
        break;
      default:
        this.departementflag = false;
        this.getAllModulesByRoleId(true);
        // for (let i = 0; i < adminCtrl1.controls.length; i++) {
        //   adminCtrl1.controls[i].get('checker').setValue(true);
        // }
        // for (let i = 0; i < adminCtrlPrevilage.controls.length; i++) {
        //   adminCtrlPrevilage.controls[i].get('checker').setValue(true);
        // }
        this.usersForm.get('checker').setValue(true);
        this.usersForm.get('checker').disable();
        this.usersForm.get('departements').clearValidators();
        this.usersForm.get('departements').updateValueAndValidity();
        if (this.creditTypes.length == 1) {
          this.usersForm.get('creditType').setValue(this.creditTypes[0].creditName);
          this.creditData = this.creditTypes[0];
        }
        else {
          let index = this.creditTypes.findIndex(x => x.creditCode == "POP");
          if (index != -1) {
            this.usersForm.get('creditType').setValue(this.creditTypes[index].creditName);
            this.creditData = this.creditTypes[index];
          }
          else {
            this.usersForm.get('creditType').setValue({ creditTypeId: 1, creditName: "Postpaid", creditCode: "POP" });
            this.creditData = { creditTypeId: 1, creditName: "Postpaid", creditCode: "POP" };
          }

        }
    }
  }


  departementSelection() {
    console.log("departementSelection");
    let creditTypelist: string;
    this.creditflag = true;
    this.creditData = this._deptdata.filter(x => x.deptName == this.usersForm.value.departements)[0].creditType;
    creditTypelist = this._deptdata.filter(x => x.deptName == this.usersForm.value.departements)[0].creditType.creditName;
    console.log("creditTypelist=>", creditTypelist, this.creditTypes);
    if (creditTypelist.toLowerCase() == "prepaid" || creditTypelist == "PrePaid") {
      this.creditFlag = true;
      console.log("Prepaid ................");
      this.usersForm.get('creditType').setValue(creditTypelist);
      
    }
    else {
      this.creditFlag = false;
      console.log("Postpaid ................");
      this.usersForm.get('creditType').setValue(creditTypelist);
     

    }
  }

  creditSelect() {
    this.creditflag = true;
    console.log('_deptdata=>', this.usersForm.value.creditType);
    this.creditData = this.creditTypes.filter(x => x.creditName == this.usersForm.value.creditType)[0];
    console.log('creditType=>', this.creditData);
  }

  onUserSelectAllChange(event1: MatCheckboxChange) {

    console.log("onUserSelectAllChange");
    const accessRoleCtrl = <FormArray>this.usersForm.get('userPrevilages') as FormArray;
    for (let control of accessRoleCtrl.controls) {

      if (event1.checked) {
        control.value.checker = true;
      }
      else {
        control.value.checker = false;
    
      }
    }
  }
  onUserChange(event: MatCheckboxChange) {
    const accessRoleCtrl = <FormArray>this.usersForm.get('userPrevilages') as FormArray;
    console.log("accessRoleCtrl", accessRoleCtrl)
    let module: any = event.source.value;
    var selectAllChecker: number = 0;

    if (event.checked == true) {
      const i = accessRoleCtrl.controls.findIndex(x => x.value.moduleId === module.value.moduleId);
      console.log('event', event.checked, accessRoleCtrl.controls[i])
      let value = accessRoleCtrl.controls[i].value;
      value.checker = true;
      accessRoleCtrl.controls[i].setValue(value);
      
    }
     else {
      const i = accessRoleCtrl.controls.findIndex(x => x.value.moduleId === module.value.moduleId);
      let value = accessRoleCtrl.controls[i].value;
      console.log("value", value, accessRoleCtrl.controls[i]);
      value.checker = false;
      accessRoleCtrl.controls[i].setValue(value);
    
    }
    accessRoleCtrl.controls.forEach(control => {
      console.log(control);
      if (control.value.checker == 1) {
        selectAllChecker++;
      }
    });

    if (selectAllChecker == accessRoleCtrl.controls.length) {
      this.usersForm.get('selectAll').setValue(true);
    }
    else {
      this.usersForm.get('selectAll').setValue(false);
    }
  }

  createUser() {
    console.log('createUser creditType=>', this.creditData);
    this.loading = true;
    console.log(this.usersForm.value.adminPrevilages, this.usersForm.value.userPrevilages);
    let roleid = this._roledata.filter(x => x.roleCode == this.usersForm.value.role)[0].roleId;
    let deptid = this.usersForm.value.departements ? this._deptdata.filter(x => x.deptName == this.usersForm.value.departements)[0].deptId : null;
    if (!this.editData) {
      let modulesData: Module[] = [];
      const usercontrol = <FormArray>this.usersForm.get('userPrevilages') as FormArray;
      const adminCtrl = <FormArray>this.usersForm.get('adminPrevilages') as FormArray;
      usercontrol.controls.forEach(x => {
        if (x.value.checker) {
          console.log('admin=>', x.value);
          modulesData.push({ moduleId: x.value.moduleId });
        }
      });
      adminCtrl.controls.forEach(x => {
        if (x.value.checker) {
          console.log('admin=>', x.value);
          modulesData.push({ moduleId: x.value.moduleId });
        }
      });
      let ICreateData = {
        checker: this.usersForm.getRawValue().checker == true ? 1 : 0,
        depts: this.usersForm.value.departements ? [{ deptName: this.usersForm.value.departements, deptId: deptid }] : [],
        roles: [{ roleId: roleid }],
        emailId: (this.usersForm.value.emailId as string).trim(),
        login: (this.usersForm.value.login as string).trim(),
        lastname: (this.usersForm.value.lastname ? this.usersForm.value.lastname.trim() : "" as string),
        firstname: (this.usersForm.value.firstname as string).trim(),
        mobileNo: (this.usersForm.value.mobileNo as string).trim(),
        modules: modulesData,
        creditType: this.creditData ? this.creditData : null,
        userType: this.usersForm.value.userType
      } as ICreateUser;
      console.log('ICreateData=>', ICreateData);
      this.userService.createUser(ICreateData).subscribe((response: IResponse) => {
        console.log('response=>', response);
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS, 10);
          this.dialogRef.close(ICreateData);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED, 10);
        }
        this.loading = false;
      }, error => {
        let message = error.error.message as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createUser==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
    else {
      let modulesData: Module[] = [];
      const usercontrol = <FormArray>this.usersForm.get('userPrevilages') as FormArray;
      const adminCtrl = <FormArray>this.usersForm.get('adminPrevilages') as FormArray;
      usercontrol.controls.forEach(x => {
        if (x.value.checker || this.editData.roles[0].roleCode == userType.SuperAdmin || this.editData.roles[0].roleCode == userType.PlatFormAdmin) {
          console.log('admin=>', x.value);
          modulesData.push({ moduleId: x.value.moduleId });
        }
      });
      adminCtrl.controls.forEach(x => {
        if (x.value.checker || this.editData.roles[0].roleCode == userType.SuperAdmin || this.editData.roles[0].roleCode == userType.PlatFormAdmin) {
          console.log('admin=>', x.value);
          modulesData.push({ moduleId: x.value.moduleId });
        }
      });
      let IUpdateData = {
        checker: this.usersForm.getRawValue().checker == true ? 1 : 0,
        depts: this.usersForm.value.departements ? [{ deptName: this.usersForm.value.departements, deptId: deptid }] : [],
        roles: [{ roleId: roleid }],
        emailId: (this.usersForm.value.emailId as string).trim(),
        login: (this.usersForm.value.login as string).trim(),
        lastname: (this.usersForm.value.lastname ? this.usersForm.value.lastname.trim() : '' as string),
        firstname: (this.usersForm.value.firstname as string).trim(),
        mobileNo: (this.usersForm.value.mobileNo as string).trim(),
        modules: modulesData,
        userType: this.usersForm.value.userType,
        userId: this.editData.userId,
        creditType: this.editData.creditType ? this.editData.creditType : null,
        isactive: this.editData.isactive,
      } as ICreateUser;
      console.log('IUpdateData' + JSON.stringify(IUpdateData));
      this.userService.updateUser(IUpdateData).subscribe((response: IResponse) => {
        console.log('response=>', response);
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS, 10);
          this.dialogRef.close(IUpdateData);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED, 10);
        }
        this.loading = false;
      }, error => {
        let message = error.error.message as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createUser==> ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
  }
}