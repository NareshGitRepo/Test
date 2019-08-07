import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { AppConfig, ITokenInfo, ILoginDtos, IUserUpdateDto } from '../../../_helpers/app.config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn } from '@angular/forms';
import { SmartDirectoryService } from '../_services/smartdirectoryservice';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { ICGlobalGroup, userType, ICDeptGroup, IUserType, ISmartResponse, selectType, editList, IUpdateGlobalGroup, IUDeptGroup, IuserGroup } from '../_model/smartdirectort';

@Component({
  selector: 'app-createsmartgroup',
  templateUrl: './createsmartgroup.component.html',
  styleUrls: ['./createsmartgroup.component.scss']
})
export class CreatesmartgroupComponent implements OnInit {

  tokenInfo: ITokenInfo;
  loginDtos: ILoginDtos;
  loginInfo: IUserUpdateDto;
  smartdirectoryForm: FormGroup;
  loading: boolean = false;
  constructor(public dialog: MatDialog, private dialogRef: MatDialogRef<CreatesmartgroupComponent>,
    private appConfig: AppConfig, private router: Router, private fb: FormBuilder,
    private smartdirectoryService: SmartDirectoryService, @Inject(MAT_DIALOG_DATA) public editData: editList,
    private translate: TranslateService,
    private alertMessage: AlertMessageService, ) {

    this.tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
    if (this.tokenInfo) {
      let newLoginDtos: ILoginDtos
      this.loginDtos = this.tokenInfo ? (this.tokenInfo.tokenInfo as ILoginDtos) : newLoginDtos;
      this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
    }
    else {
      this.router.navigate(['401']);
    }

    this.smartdirectoryForm = this.fb.group({
      groupName: [null, Validators.required],
    });
    if (this.editData != null) {
      if (editData.type == selectType.Global) {
        console.log('editData=>', editData.data);
        this.smartdirectoryForm.get('groupName').setValue(editData.data.cntGroupName);
      }
      else if (editData.type == selectType.Departement) {
        console.log('editData=>', editData.data);
        this.smartdirectoryForm.get('groupName').setValue(editData.data.groupName);
      }
      else {
        console.log('editData=>', editData.data);
        this.smartdirectoryForm.get('groupName').setValue(editData.data.groupName);
      }
    }
  }

  ngOnInit() {
    console.log('loginInfo=>', this.loginInfo.roles[0].roleCode);
  }


  createGroup() {
    this.loading = true;

    switch (this.loginInfo.roles[0].roleCode) {

      case userType.DepartementAdmin:
        let ICreateDept = {
          deptId: this.loginInfo.depts[0].deptId,
          groupName: this.smartdirectoryForm.value.groupName,
          groupType: 0
        } as ICDeptGroup;
        this.smartdirectoryService.createContactGroupDept(ICreateDept).subscribe((response: ISmartResponse) => {
          console.log('response=>', response);
          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            this.dialogRef.close(ICreateDept);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.message as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-createGroup==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
        break;
      case userType.NormalUser:
        let ICreateUser = {
          groupName: this.smartdirectoryForm.value.groupName,
          groupType: 0
        } as IUserType;

        this.smartdirectoryService.createContactGroup(ICreateUser).subscribe((response: ISmartResponse) => {
          console.log('response=>', response);
          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            this.dialogRef.close(ICreateUser);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.message as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-createGroup==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
        break;
      default:
      case userType.PlatFormAdmin:
        let ICreateGlobal = {
          cntGroupName: this.smartdirectoryForm.value.groupName,
          groupType: 0
        } as ICGlobalGroup;
        this.smartdirectoryService.createContactGroupGlobal(ICreateGlobal).subscribe((response: ISmartResponse) => {
          console.log('response=>', response);

          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            this.dialogRef.close(ICreateGlobal);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.message as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-createGroup==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
        break;
    }

  }

  updateGroup() {
    this.loading = true;

    switch (this.loginInfo.roles[0].roleCode) {
      case userType.DepartementAdmin:
        let IUpdateDept = {
          deptId: this.editData.data.deptId,
          groupName: this.smartdirectoryForm.value.groupName,
          groupType: this.editData.data.groupType,
          groupDeptId: this.editData.data.groupDeptId
        } as IUDeptGroup;
        this.smartdirectoryService.updateContactGroupDept(IUpdateDept).subscribe((response: ISmartResponse) => {
          console.log('response=>', response);
          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            this.editData.data.deptId = this.editData.data.deptId;
            this.editData.data.groupName = this.smartdirectoryForm.value.groupName,
              this.editData.data.groupType = this.editData.data.groupType,
              this.editData.data.groupDeptId = this.editData.data.groupDeptId
            this.dialogRef.close(this.editData);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.message as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-updateGroup==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
        break;
      case userType.NormalUser:
        let IUpdateUser = {
          groupName: this.smartdirectoryForm.value.groupName,
          groupType: this.editData.data.groupType,
          groupUserId: this.editData.data.groupUserId
        } as IuserGroup;

        this.smartdirectoryService.updateContactGroupUserInfo(IUpdateUser).subscribe((response: ISmartResponse) => {
          console.log('response=>', response);
          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            this.editData.data.groupName = this.smartdirectoryForm.value.groupName,
              this.editData.data.groupType = this.editData.data.groupType,
              this.editData.data.groupUserId = this.editData.data.groupUserId
            this.dialogRef.close(this.editData);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.message as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-updateGroup==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
        break;
      default:
      case userType.PlatFormAdmin:
        let IupdateGlobal = {
          cntGroupName: this.smartdirectoryForm.value.groupName,
          groupType: this.editData.data.groupType,
          cntGroupId: this.editData.data.cntGroupId
        } as IUpdateGlobalGroup;
        this.smartdirectoryService.updateContactGroupGlobal(IupdateGlobal).subscribe((response: ISmartResponse) => {
          console.log('response=>', response);

          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            this.editData.data.cntGroupName = this.smartdirectoryForm.value.groupName;
            this.editData.data.groupType = this.editData.data.groupType,
              this.editData.data.cntGroupId = this.editData.data.cntGroupId
            this.dialogRef.close(this.editData);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        }, error => {
          let message = error.error.message as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-updateGroup==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
        break;
    }
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  close() {
    this.dialogRef.close();
  }

}


