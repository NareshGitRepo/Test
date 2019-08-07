import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CreatesmartgroupComponent } from '../createsmartgroup/createsmartgroup.component';
import { CreatesmartcontactComponent } from '../createsmartcontact/createsmartcontact.component';
import { SmartDirectoryService } from '../_services/smartdirectoryservice';
import { GroupsWithContactGlobal, ContactGlobal, IDepartment, GroupDept, ContactDept, User, IUsersList, ContactUser, ContactUserL, userType, selectType, Department, ISmartResponse, ISimpleSmsData, ISendBaseType } from '../_model/smartdirectort';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IUserUpdateDto, ILoginDtos, ITokenInfo, AppConfig } from '../../../_helpers/app.config';
import { SmartDirectoryConfirmComponent } from '../_model/smartdirectory.confirm';
import { SimpleSMSComponent } from '../../../_utilities/simplesms/simplesms.component';

@Component({
  selector: 'app-smartdirectory',
  templateUrl: './smartdirectory.component.html',
  styleUrls: ['./smartdirectory.component.scss']
})
export class SmartdirectoryComponent implements OnInit {
  users: boolean = false;
  department: boolean = false;
  global: boolean = true;
  loading: boolean = false;
  globalGroup: GroupsWithContactGlobal[];
  initPage = 0;
  initDeptPage = 0;
  initUserPage = 0;
  pageSize = environment.pageSize;
  contactsData: ContactGlobal[] = [];
  deptData: ContactDept[] = [];
  public filterGroups: GroupsWithContactGlobal[] = [];
  public filterDepartement: GroupDept[] = [];
  departementForm: FormGroup;
  // deptList: IDepartment[] = [];
  deptList: IDepartment[] = [];
  departementGroup: GroupDept[];
  departementusers: any;
  userList: User[];
  userGroup: IUsersList[];
  filteruserGroup: IUsersList[] = [];
  tokenInfo: ITokenInfo;
  loginDtos: ILoginDtos;
  loginInfo: IUserUpdateDto;
  selected: string;
  deptDisplay: boolean = false;
  normalDisplay: boolean = false;
  DisplayString: string = '';
  contactsUsersData: ContactUserL[] = [];
  searchdata: string = '';
  searchdept: string = '';
  searchuser: string = '';
  constructor(private dialog: MatDialog,
    private smartdirectoryService: SmartDirectoryService, private translate: TranslateService,
    private router: Router, private alertMessage: AlertMessageService, private appConfig: AppConfig,
    private fb: FormBuilder) {
    this.tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
    if (this.tokenInfo) {
      let newLoginDtos: ILoginDtos
      this.loginDtos = this.tokenInfo ? (this.tokenInfo.tokenInfo as ILoginDtos) : newLoginDtos;
      this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;

      console.log('loginInfo=>', this.loginInfo);

    }
    else {
      this.router.navigate(['401']);
    }
  }


  ngOnInit() {

    this.users = false;
    this.department = false;
    this.global = true;
    this.deptDisplay = false;
    this.normalDisplay = false;
    console.log('roles=>', this.loginInfo.roles);

    switch (this.loginInfo.roles[0].roleCode) {
      case userType.NormalUser:
        this.DisplayString = userType.NormalUser;
        break;
      case userType.DepartementAdmin:
        this.DisplayString = userType.DepartementAdmin;
        break;
      default:
      case userType.PlatFormAdmin:
        this.DisplayString = userType.PlatFormAdmin;
        break;
    };

    this.getGlobalAllgroups();
    this.departementForm = this.fb.group({
      deptName: [null],
      userId: [null]
    });
  }

  sendSmsFromGlobalGroup(globalGroupData:GroupsWithContactGlobal)
  {
    let sendSmsData={
      sendBaseType:ISendBaseType.global,
    groupId:globalGroupData.cntGroupId,
    groupName:globalGroupData.cntGroupName,
    contactNo:''
    } as ISimpleSmsData;
    console.log('sendSmsFromGlobalGroup=>', globalGroupData,sendSmsData);
    const dialogRef = this.dialog.open(SimpleSMSComponent, this.getDialogConfig(sendSmsData));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("result editSMS===>",result);
        this.getGlobalAllgroups();
      }
    });
  }
  sendSmsFromGlobalContact(globalContact:ContactGlobal){
    let sendSmsData={
      sendBaseType:ISendBaseType.recepients,
    groupId:globalContact.cntGlobalId,
    groupName:'',
    contactNo:globalContact.mobileNo
    } as ISimpleSmsData;
    console.log('sendSmsFromGlobalContact=>', globalContact,sendSmsData);
    const dialogRef = this.dialog.open(SimpleSMSComponent, this.getDialogConfig(sendSmsData));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("result editSMS===>",result);
        this.getGlobalAllgroups();
      }
    });
  }
  sendSmsFromDeptGroup(departement: GroupDept){
    let sendSmsData={
      sendBaseType:ISendBaseType.department,
    groupId:departement.groupDeptId,
    groupName:departement.groupName,
    contactNo:''
    } as ISimpleSmsData;
    console.log('sendSmsFromDeptGroup=>', departement,sendSmsData);
    const dialogRef = this.dialog.open(SimpleSMSComponent, this.getDialogConfig(sendSmsData));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("result sendSmsFromDeptGroup===>",result);
        this.getGlobalAllgroups();
      }
    });

  }
  sendSmsFromDeptContact(deptContact:ContactDept){
    let sendSmsData={
      sendBaseType:ISendBaseType.recepients,
    groupId:deptContact.cntDeptId,
    groupName:'',
    contactNo:deptContact.mobileNo
    } as ISimpleSmsData;
    console.log('sendSmsFromDeptContact=>', deptContact,sendSmsData);
    const dialogRef = this.dialog.open(SimpleSMSComponent, this.getDialogConfig(sendSmsData));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("result sendSmsFromDeptContact===>",result);
        this.getGlobalAllgroups();
      }
    });
  }
  sendSmsFromUserGroup(userGroupData:IUsersList)
  {
    let sendSmsData={
      sendBaseType:ISendBaseType.users,
    groupId:userGroupData.groupUserId,
    groupName:userGroupData.groupName,
    contactNo:''
    } as ISimpleSmsData;
    console.log('sendSmsFromUserGroup=>', userGroupData,sendSmsData);
    const dialogRef = this.dialog.open(SimpleSMSComponent, this.getDialogConfig(sendSmsData));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("result sendSmsFromUserGroup===>",result);
        this.getGlobalAllgroups();
      }
    });
  }
  sendSmsFromUserContact(userContact:ContactUserL){
    let sendSmsData={
      sendBaseType:ISendBaseType.recepients,
    groupId:userContact.cntUserId,
    groupName:'',
    contactNo:userContact.mobileNo
    } as ISimpleSmsData;
    console.log('sendSmsFromUserContact=>', userContact,sendSmsData);
    const dialogRef = this.dialog.open(SimpleSMSComponent, this.getDialogConfig(sendSmsData));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log("result sendSmsFromUserContact===>",result);
        this.getGlobalAllgroups();
      }
    });
  }
  editGlobal(group: GroupsWithContactGlobal) {
    console.log('group=>', group);
    let data = { data: group, type: selectType.Global };
    const dialogRef = this.dialog.open(CreatesmartgroupComponent, this.getDialogConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let index = this.filterGroups.findIndex(x => x.cntGroupId == result.data.cntGroupId);
        if (index != -1) {
          this.filterGroups[index].cntGroupName = result.data.cntGroupName;
          let index1 = this.globalGroup.findIndex(y => y.cntGroupId == result.data.cntGroupId);
          if (index1 != -1) {
            this.globalGroup[index1] = this.filterGroups[index];
          }
        }
      }
    });
  }
  deleteGlobalGroup(group: GroupsWithContactGlobal) {
    console.log("delete group", group);

    const dialogRef = this.dialog.open(SmartDirectoryConfirmComponent, {
      width: '500px',
      data: 'Do you want to Delete ' + ' \"' + group.cntGroupName + ' \" ...?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.smartdirectoryService.deleteGlobalGroupWithContact(group.cntGroupId).subscribe((response: ISmartResponse) => {
          console.log("response==>123", response);
          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            // this.getGlobalAllgroups();
            console.log("before splice:::", this.globalGroup);
            let index: number = this.globalGroup.findIndex(x => x.cntGroupId == group.cntGroupId);
            if (index !== -1) {
              this.globalGroup.splice(index, 1);
              let cgData: ContactGlobal[];
              this.contactsData = cgData;
              this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
            }

          }
          else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-deleteGlobalGroupWithContact==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        })
      }
    });
  }
  deleteContactGlobal(globalcontact: ContactGlobal) {
    console.log("globalcontact==>", globalcontact);
    const dialogRef = this.dialog.open(SmartDirectoryConfirmComponent, {
      width: '500px',
      data: this.translate.instant('smartDirectoryModule.delete') + ' \"' + globalcontact.firstName + ' \" ...?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.smartdirectoryService.deleteGobalContact(globalcontact.cntGlobalId).subscribe((response: ISmartResponse) => {
          console.log("response==>123", response);
          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            // this.getGlobalAllgroups();
            console.log("before splice:::", this.globalGroup);
            let index: number = this.contactsData.findIndex(x => x.cntGlobalId == globalcontact.cntGlobalId);
            if (index !== -1) {
              this.contactsData.splice(index, 1);
            }
            this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          }
          else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-deleteGlobalGroupWithContact==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        })
      }
    });
  }

  editDepartement(departement: GroupDept) {
    let data = { data: departement, type: selectType.Departement };
    const dialogRef = this.dialog.open(CreatesmartgroupComponent, this.getDialogConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let index = this.filterDepartement.findIndex(x => x.groupDeptId == result.data.groupDeptId);
        if (index != -1) {
          this.filterDepartement[index].groupName = result.data.groupName;
          let index1 = this.departementGroup.findIndex(y => y.groupDeptId == result.data.groupDeptId);
          if (index1 != -1) {
            this.departementGroup[index1] = this.filterDepartement[index];
          }
        }
      }
    });
  }

  deleteDepartementGroup(groupDept: GroupDept) {
    console.log("delete group", groupDept);

    const dialogRef = this.dialog.open(SmartDirectoryConfirmComponent, {
      width: '500px',
      data: this.translate.instant('smartDirectoryModule.delete')  + ' \"' + groupDept.groupName + ' \" ...?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.smartdirectoryService.deleteDeptGroupWithContact(groupDept.groupDeptId).subscribe((response: ISmartResponse) => {
          console.log("response==>123", response);
          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            console.log("before splice:::", this.departementGroup);
            let index: number = this.departementGroup.findIndex(x => x.groupDeptId == groupDept.groupDeptId);
            console.log("index==>", index);
            if (index !== -1) {
              let cgData: ContactDept[];
              this.deptData = cgData;
              this.departementGroup.splice(index, 1);
            }
            this.getDepartementData({ pageIndex: this.initDeptPage, pageSize: this.pageSize });
            console.log("after splice:::", this.departementGroup);
          }
          else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-deleteGlobalGroupWithContact==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        })
      }
    });
  }
  deleteContactDept(deptcontact: ContactDept) {
    console.log("delete group", deptcontact);
    const dialogRef = this.dialog.open(SmartDirectoryConfirmComponent, {
      width: '500px',
      data: this.translate.instant('smartDirectoryModule.delete')  + ' \"' + deptcontact.firstName + ' \" ...?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.smartdirectoryService.deleteDeptContact(deptcontact.cntDeptId).subscribe((response: ISmartResponse) => {
          console.log("response==>123", response);
          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            console.log("before splice:::", this.departementGroup);
            let index: number = this.deptData.findIndex(x => x.cntDeptId == deptcontact.cntDeptId);
            console.log("index==>", index);
            if (index !== -1) {
              this.deptData.splice(index, 1);
            }
            this.getDepartementData({ pageIndex: this.initDeptPage, pageSize: this.pageSize });
            console.log("after splice:::", this.departementGroup);
          }
          else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-deleteGlobalGroupWithContact==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        })
      }
    });
  }
  editUser(user: IUsersList) {
    let data = { data: user, type: selectType.NormalUser };
    const dialogRef = this.dialog.open(CreatesmartgroupComponent, this.getDialogConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let index = this.filteruserGroup.findIndex(x => x.groupUserId == result.data.groupUserId);
        if (index != -1) {
          this.filteruserGroup[index].groupName = result.data.groupName;
          let index1 = this.userGroup.findIndex(y => y.groupUserId == result.data.groupUserId);
          if (index1 != -1) {
            this.userGroup[index1] = this.filteruserGroup[index];
          }
        }
      }
    });
  }
  deleteUserGroup(userGroup: IUsersList) {
    console.log("delete group", userGroup);

    const dialogRef = this.dialog.open(SmartDirectoryConfirmComponent, {
      width: '500px',
      data: this.translate.instant('smartDirectoryModule.delete')  + ' \"' + userGroup.groupName + ' \" ...?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.smartdirectoryService.deleteUserGroupWithContact(userGroup.groupUserId).subscribe((response: ISmartResponse) => {
          console.log("response==>123", response);
          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            console.log("before splice===>", this.userGroup);
            let index: number = this.userGroup.findIndex(x => x.groupUserId == userGroup.groupUserId);
            if (index !== -1) {
              let cuData: ContactUserL[];
              this.contactsUsersData = cuData;
              this.userGroup.splice(index, 1);
            }
            this.getUserData({ pageIndex: this.initUserPage, pageSize: this.pageSize });
            console.log("after splice===>", this.userGroup);
          }
          else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-deleteGlobalGroupWithContact==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        })
      }
    });
  }

  deleteContactUser(usercontact: ContactUserL) {
    console.log("delete group", usercontact);

    const dialogRef = this.dialog.open(SmartDirectoryConfirmComponent, {
      width: '500px',
      data: this.translate.instant('smartDirectoryModule.delete')  + ' \"' + usercontact.firstName + ' \" ...?'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.smartdirectoryService.deleteUserContact(usercontact.cntUserId).subscribe((response: ISmartResponse) => {
          console.log("response==>123", response);
          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            console.log("before splice===>", this.userGroup);
            let index: number = this.contactsUsersData.findIndex(x => x.cntUserId == usercontact.cntUserId);
            if (index !== -1) {
              this.contactsUsersData.splice(index, 1);
            }
            this.getUserData({ pageIndex: this.initUserPage, pageSize: this.pageSize });
            console.log("after splice===>", this.userGroup);
          }
          else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-deleteGlobalGroupWithContact==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        })
      }
    });
  }

  departementUserSelect() {
    if (this.departementForm.getRawValue().deptName) {
      this.departementForm.get('userId').setValue(null);
      let deptData = this.departementForm.getRawValue().deptName as IDepartment;
      this.userList = deptData.users;
    }
    let userg: IUsersList[];
    this.userGroup = userg;
  }

  editContactGlobal(globalcontact: ContactGlobal) {
    let data = { data: globalcontact, type: selectType.Global };
    const dialogRef = this.dialog.open(CreatesmartcontactComponent, this.getDialogConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result=>', result, this.contactsData);
        this.filterGroups.forEach(element => {
          let index = element.contactGlobals.findIndex(x => x.cntGlobalId == result.data.cntGlobalId);
          if (index != -1) {
            element.contactGlobals[index] = result.data;
            let index1 = this.globalGroup.findIndex(y => y.cntGroupId == element.cntGroupId);
            if (index1 != -1)
              this.globalGroup[index1] = element;
          }
        });
      }
    });
  }


  editContactDept(deptcontact: ContactDept) {
    let data = { data: deptcontact, type: selectType.Global };
    const dialogRef = this.dialog.open(CreatesmartcontactComponent, this.getDialogConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result=>', result, this.contactsData);
        this.filterDepartement.forEach(element => {
          let index = element.contactDepts.findIndex(x => x.cntDeptId == result.data.cntDeptId);
          if (index != -1) {
            element.contactDepts[index] = result.data;
            let index2 = this.departementGroup.findIndex(y => y.groupDeptId == element.groupDeptId);
            if (index2 != -1)
              this.departementGroup[index2] = element;
          }
        });
      }
    });
  }

  editContactUser(usercontact: User) {
    let data = { data: usercontact, type: selectType.Global };
    const dialogRef = this.dialog.open(CreatesmartcontactComponent, this.getDialogConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('result=>', result);
        this.filteruserGroup.forEach(element => {
          let index = element.contactUsers.findIndex(x => x.cntUserId == result.data.cntUserId);
          if (index != -1) {
            element.contactUsers[index] = result.data;
            let index3 = this.userGroup.findIndex(y => y.groupUserId == element.groupUserId);
            if (index3 != -1)
              this.userGroup[index3] = element;
          }
        });
      }
    });
  }
  selectTab(selectvalue: string) {
    console.log('this.DisplayString=>', this.DisplayString);
    this.deptDisplay = false;
    this.normalDisplay = false;
    this.users = false;

    this.department = false;
    this.global = false;
    //this.userGroup = [];

    switch (selectvalue) {
      case selectType.NormalUser:
        let userg: IUsersList[];
        this.userGroup = userg;
        console.log('normal', this.DisplayString);
        this.users = true;
        if (this.DisplayString == userType.NormalUser) {
          this.departementForm.get('deptName').setValue(JSON.stringify(this.loginInfo.depts[0].deptId));
          this.departementForm.get('userId').setValue(JSON.stringify(this.loginInfo.userId));
          this.getGroupsWithContactsByUserId();
        }
        else if (this.DisplayString == userType.DepartementAdmin) {
          this.userList = [];
          this.departementForm.get('deptName').setValue(JSON.stringify(this.loginInfo.depts[0]));
          console.log('platform Normal users1');
          this.getAllDepartements(true);

          this.normalDisplay = true;
          this.deptDisplay = false;
          console.log('deptList=>', this.deptList, this.loginInfo.depts[0]);
          console.log('userList=>', this.userList);
        }
        else {
          this.userList = [];
          this.deptDisplay = true;
          this.normalDisplay = true;
          console.log('platform Normal users');
          this.getAllDepartements();
        }
        break;
      case selectType.Departement:
        console.log('departement');
        let deplist: GroupDept[];
        this.departementGroup = deplist;
        this.department = true;
        if (this.DisplayString == userType.NormalUser) {
          console.log('getDptAllgroups=>1');
          this.departementForm.get('deptName').setValue(JSON.stringify(this.loginInfo.depts[0].deptId));
          this.departementForm.get('userId').setValue(JSON.stringify(this.loginInfo.userId));
          this.getDptAllgroups();
        }
        else if (this.DisplayString == userType.DepartementAdmin) {
          this.departementForm.get('deptName').setValue(JSON.stringify(this.loginInfo.depts[0].deptId));
          this.departementForm.get('userId').setValue(JSON.stringify(this.loginInfo.userId));
          console.log('getDptAllgroups=>2');
          this.getDptAllgroups();
          // this.getAllDepartements();
        }
        else {
          console.log('getDptAllgroups=>3');
          this.deptDisplay = true;
          this.normalDisplay = false;
          this.getAllDepartements(false, true);
        }
        break;
      default:
      case selectType.Global:
        // this.getAllDepartements();
        this.global = true;
        console.log('global=>', this.global);
        this.getGlobalAllgroups();
        break;

    }
  }


  userSelect() {
    let userg: IUsersList[];
    this.userGroup = userg;
    this.filteruserGroup = [];
    if (this.departementForm.getRawValue().userId) {
      this.getGroupsWithContactsByUserId();
    }

  }


  assignuserContacts(userData) {
    if (userData.contactUsers.length > 0)
      this.loading = true;
    if (userData.contactUsers.length > 0) {
      this.contactsUsersData = userData.contactUsers;
      this.loading = false;
    }
    else {
      this.loading = false;
      this.contactsUsersData = [];
      // this.alertMessage.showAlert("No contacts are created", ActionType.FAILED);
    }
  }
  getGroupsWithContactsByUserId(action?: boolean) {
    this.loading = true;
    this.smartdirectoryService.getGroupsWithContactsByUserId(this.departementForm.getRawValue().userId).subscribe((response: IUsersList[]) => {
      if (response) {
        this.userGroup = response;

        console.log('response=>userGroup', this.userGroup);
        if (this.userGroup.length > 0) {

          this.getUserData({ pageIndex: this.initUserPage, pageSize: this.pageSize });
          console.log("Response==>Dept", response);
          this.loading = false;
        }
        else {
          // this.departementGroup = [];
          // this.filterDepartement = [];
          // this.deptData = [];
          // this.alertMessage.showAlert("No groups are created", ActionType.FAILED);
          this.loading = false;
        }

      }
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getGroupsWithContactsByUserId==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getGlobalAllgroups() {
    this.loading = true;
    this.smartdirectoryService.getAllGroupsWithContactsGlobal().subscribe((response: GroupsWithContactGlobal[]) => {
      if (response) {
        this.globalGroup = response;
        console.log("this.globalGroup length ", this.globalGroup.length);
        if (this.globalGroup.length > 0) {
          this.contactsData = this.globalGroup[0].contactGlobals;
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          console.log("Response==>Global", response);
        } else {
          console.log("Not found contact global");
        }
        this.loading = false;
      }
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getGlobalAllgroups==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  departementSelect() {
    if (this.departementForm.getRawValue().deptName) {
      this.getDptAllgroups();
    }
    else {
      let deplist: GroupDept[];
      this.departementGroup = deplist;
    }
  }
  getAllDepartements(action?: boolean, actionD?: boolean) {
    this.loading = true;
    if (this.deptList.length > 0) {
      console.log('deptList=>', this.deptList);
      if (action) {
        this.userList = this.deptList ? this.deptList.filter(x => x.deptId == this.loginInfo.depts[0].deptId)[0].users.filter(y => y.roles.length > 0 ? y.roles[0].roleCode == userType.NormalUser : false) : [];
        console.log('platform users=>Normal');
        // this.userList = this.deptList?this.deptList.filter(x => x.deptId == this.loginInfo.depts[0].deptId)[0].users:[];
        // this.userList = response[0].users;
        if (this.userList.length > 0) {
          this.departementForm.get('userId').setValue(JSON.stringify(this.userList[0].userId));
          this.getGroupsWithContactsByUserId(true);
        }
      }
      else {
        console.log('deptList=>1', this.deptList);
        if ((this.DisplayString == userType.PlatFormAdmin || this.DisplayString == userType.SuperAdmin) && this.deptDisplay && this.deptList.length > 0 && !actionD) {
          if (this.deptList.length > 0) {
            this.departementForm.get('deptName').setValue(this.deptList[0]);
            this.userList = this.deptList[0].users;
            this.departementForm.get('userId').setValue(this.deptList[0].users.length > 0 ? this.deptList[0].users[0].userId + '' : '');
          }
          this.userSelect();
        }
        else {
          if (this.deptList.length > 0) {
            this.departementForm.get('deptName').setValue(JSON.stringify(this.deptList[0].deptId));
          }

          // this.departementForm.get('userId').setValue(JSON.stringify(this.deptList[0].users[0].userId));
          this.departementSelect();
        }
      }
      this.loading = false;
    }
    else {
      this.smartdirectoryService.getActiveDepartments().subscribe((response: IDepartment[]) => {
        if (response) {
          console.log("Response==>Active", response)
          this.deptList = response;
          console.log('deptList=>', this.deptList);
          if (action) {
            this.userList = this.deptList ? this.deptList.filter(x => x.deptId == this.loginInfo.depts[0].deptId)[0].users.filter(y => y.roles.length > 0 ? y.roles[0].roleCode == userType.NormalUser : false) : [];
            // this.userList = this.deptList?this.deptList.filter(x => x.deptId == this.loginInfo.depts[0].deptId)[0].users:[];
            // this.userList = response[0].users;
            if (this.userList.length > 0) {
              this.departementForm.get('userId').setValue(JSON.stringify(this.userList[0].userId));
              this.getGroupsWithContactsByUserId();
            }
          }
          else {

            if ((this.DisplayString == userType.PlatFormAdmin || this.DisplayString == userType.SuperAdmin) && this.deptDisplay && this.deptList.length > 0 && !actionD) {
              if (this.deptList.length > 0) {
                this.departementForm.get('deptName').setValue(this.deptList[0]);
                this.userList = this.deptList[0].users;
                this.departementForm.get('userId').setValue(this.deptList[0].users.length > 0 ? this.deptList[0].users[0].userId + '' : '');
              }
              this.userSelect();
            }
            else {
              if (this.deptList.length > 0) {
                this.departementForm.get('deptName').setValue(JSON.stringify(this.deptList[0].deptId));
                // this.departementForm.get('userId').setValue(JSON.stringify(this.deptList[0].users[0].userId));
              }
              this.departementSelect();
            }
          }
        }
        this.loading = false;
      }, error => {
        this.deptList = [];
        this.userList = [];
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getAllDepartements==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
  }
  getDptAllgroups() {
    this.loading = true;
    this.smartdirectoryService.getAllGroupsWithContactsDept(this.departementForm.getRawValue().deptName).subscribe((response: GroupDept[]) => {
      if (response) {

        console.log('response=>', response);
        if (response.length > 0) {
          this.departementGroup = response;
          this.deptData = response.length > 0 ? response[0].contactDepts : [];
          this.getDepartementData({ pageIndex: this.initDeptPage, pageSize: this.pageSize });
          console.log("Response==>Dept", response);
          this.loading = false;
        }
        else {
          this.departementGroup = [];
          this.filterDepartement = [];
          this.deptData = [];
          // this.alertMessage.showAlert("No groups are created", ActionType.FAILED);
          this.loading = false;
        }

      }
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getDptAllgroups==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  assignContacts(group: GroupsWithContactGlobal) {
    this.loading = true;
    if (group.contactGlobals.length > 0) {
      this.loading = false;
      this.contactsData = group.contactGlobals;
    }
    else {
      this.loading = false;
      this.contactsData = [];
      // this.alertMessage.showAlert("No contacts are created", ActionType.FAILED);
    }
  }

  assigndeptContacts(departement: GroupDept) {
    this.loading = true;
    if (departement.contactDepts.length > 0) {
      this.loading = false;
      this.deptData = departement.contactDepts;
    }
    else {
      this.loading = false;
      this.deptData = [];
      // this.alertMessage.showAlert("No contacts are created", ActionType.FAILED);
    }
  }
  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filterGroups = this.globalGroup.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  getUserData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filteruserGroup = this.userGroup.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }
  getDepartementData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filterDepartement = this.departementGroup.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw';
    dialogConfig.height = '95.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  addGroup() {
    const dialogRef = this.dialog.open(CreatesmartgroupComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      console.log("result=>", result);

      if (result) {
        if (this.users)
          this.selectTab(selectType.NormalUser);
        else if (this.department)
          this.selectTab(selectType.Departement);
        else
          this.selectTab(selectType.Global);
      }
    });
  }

  addContact() {
    const dialogRef = this.dialog.open(CreatesmartcontactComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.users)
          this.selectTab(selectType.NormalUser);
        else if (this.department)
          this.selectTab(selectType.Departement);
        else
          this.selectTab(selectType.Global);
      }
    });

  }
}
