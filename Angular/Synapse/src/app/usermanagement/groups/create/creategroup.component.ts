import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { IDepartment, IGCreate, IGroupResponse, User, Group, IGUpdate } from '../_model/groupmanagement.model';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { GroupManagementService } from '../_service/groupmanagement.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-creategroup',
  templateUrl: './creategroup.component.html',
  styleUrls: ['./creategroup.component.scss']
})
export class CreategroupComponent implements OnInit {

  groupsForm: FormGroup;
  deptList: IDepartment[] = [];
  GroupModel: IGCreate = {} as any;
  loading: boolean = false;
  userName: string = '';
  deptName: string = '';
  userList: User[] = [];
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CreategroupComponent>, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: Group, private service: GroupManagementService, private alertMessage: AlertMessageService,
    private translate: TranslateService) {
    console.log("EDITDATA=>", this.data)
  }

  ngOnInit() {
    this.groupsForm = this.fb.group({
      groupName: [null, Validators.required],
      description: [null, Validators.required],
      department: [null, Validators.required],
      groupUsers: [null, Validators.required],
      validategroupName: [null, [Validators.required], [GroupValidator(this.service)]],
      groupId: [null],
    });
    this.getAllDepartements();
    if (this.data != null || this.data != undefined) {
      this.GroupModel = this.data;
      this.groupsForm.patchValue({
        groupId: this.data.groupId,
        description: this.data.description,
        groupName: this.data.groupName
      });
      this.groupsForm.get('validategroupName').clearValidators();
      this.groupsForm.get('validategroupName').clearAsyncValidators();
      this.groupsForm.get('validategroupName').updateValueAndValidity();
    }
  }

  getAllDepartements() {
    this.loading = true;
    this.service.getActiveDepartments().subscribe((response: IDepartment[]) => {
      if (response) {
        console.log("Response==>", response)
        this.deptList = response;
        if (this.data != null || this.data != undefined) {
          let filterdata = this.deptList.filter(x => x.users.findIndex(y => this.data.users.findIndex(z => z.userId == y.userId) != -1) != -1);
          console.log("filterdata=>", filterdata);
          if (filterdata.length > 0) {
            let deptSelected: number[] = [];
            filterdata.forEach(x => {
              deptSelected.push(x.deptId);
            });
            this.groupsForm.get('department').setValue(deptSelected);
            this.DepartmentSelection(false);
          }
        }
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getAllDepartements==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  DepartmentSelection(action: boolean) {
    console.log("groupDepartment==>", this.groupsForm.value.department);
    this.deptName = ''
    this.userList = [];
    let deptSelected: number[] = [];
    deptSelected = this.groupsForm.value.department;
    if (deptSelected.length > 0) {
      let findex = this.deptList.findIndex(y => y.deptId == deptSelected[0]);
      if (findex != -1) {
        this.deptName = this.deptList[findex].deptName;
      }
      let filterdeptList = this.deptList.filter(x => deptSelected.findIndex(y => y == x.deptId) != -1);
      filterdeptList.forEach(y => {
        if (y.users.length > 0) {
          y.users.forEach(z => {
            this.userList.push(z);
          });
        }
      });
      if (!action && filterdeptList.length > 0) {
        let userSelected: number[] = [];
        this.data.users.forEach(x => {
          userSelected.push(x.userId);
        })
        this.groupsForm.get('groupUsers').setValue(userSelected);
        this.UserSelection(false);
      }
      else if (action && filterdeptList.length > 0 && this.groupsForm.value.groupUsers != null) {
        let userSelected: number[] = [];
        userSelected = this.groupsForm.value.groupUsers;
        let userselect = userSelected.filter(x => this.userList.findIndex(y => y.userId + '' == x + '') != -1);
        this.groupsForm.get('groupUsers').setValue(userselect);
        this.UserSelection(true);
      }
      else
        this.groupsForm.get('groupUsers').setValue(null);
    }
  }
  UserSelection(action: boolean) {
    this.userName = ''
    let userSelected: number[] = [];
    userSelected = this.groupsForm.value.groupUsers;
    if (userSelected.length > 0) {
      let findex = this.userList.findIndex(y => y.userId == userSelected[0]);
      if (findex != -1) {
        this.userName = this.userList[findex].login;
      }
    }
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  groupCreation() {
    this.loading = true;
    console.log("Submit==>" + JSON.stringify(this.groupsForm.value.groupUsers));
    let userSelected: number[] = [];
    userSelected = this.groupsForm.value.groupUsers
    let SelectUserData = [];
    userSelected.forEach(x => {
      SelectUserData.push({ userId: x });
    })
    if (!this.data) {
      let IGroupCreate = {
        description: (this.groupsForm.value.description as string).trim(),
        groupName: (this.groupsForm.value.groupName as string).trim(),
        users: SelectUserData
      } as IGCreate;
      console.log('CreateGroup=>', JSON.stringify(IGroupCreate));
      if (IGroupCreate) {
        this.service.createGroup(IGroupCreate).subscribe((response: IGroupResponse) => {
          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            this.dialogRef.close(IGroupCreate);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-groupCreation==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
      }
    }
    else {
      let IGroupUpdate = {
        description: (this.groupsForm.value.description as string).trim(),
        groupName: (this.groupsForm.value.groupName as string).trim(),
        groupId: this.groupsForm.value.groupId,
        status: this.data.status,
        users: SelectUserData
      } as IGUpdate;
      console.log('UpdateGroup=>', JSON.stringify(IGroupUpdate));
      this.service.updateGroup(IGroupUpdate).subscribe((response: IGroupResponse) => {
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(IGroupUpdate);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-groupCreation==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }

  }
}

export function GroupValidator(service: GroupManagementService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value != null ? service.validateGroupName((control.value as string).trim())
      .map(response => {
        console.log(response.status)
        return !response.status ? { invalid: true } : null
      }) : null;
  };
}