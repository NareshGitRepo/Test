import { Component, OnInit, Inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActionType, AlertMessageService } from '../../_services/alertMessageService';
import { IDeptResponse, IcreateDept, IDepartment } from '../_model/levelModel';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { ITokenInfo, AppConfig } from '../../_helpers/app.config';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LevelService } from '../_service/levelService';

@Component({
  selector: 'app-departementscreate',
  templateUrl: './departementscreate.component.html',
  styleUrls: ['./departementscreate.component.scss']
})
export class DepartementscreateComponent implements OnInit {

  departmentForm: FormGroup;
  editData: any;
  orgId: number;
  _tokenInfo: any;
  createDeptObj: IcreateDept
  loading: boolean = false;

  constructor(private fb: FormBuilder, public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public Data: IDepartment, private appconfig: AppConfig, private router: Router,
    private dialogRef: MatDialogRef<DepartementscreateComponent>, private translate: TranslateService,
    private alertMessage: AlertMessageService, private _levelService: LevelService) {
    console.log("data is::", this.Data);
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;
    if (this._tokenInfo && tokenData) {
      this.orgId = this._tokenInfo.orgId;
    }
    // if (Data) {
    //   console.log("data is::", Data);
    //   //this.editData = Data;
    // }
  }

  ngOnInit() {
    this.departmentForm = this.fb.group({
      floorId: [this.Data.floorId],
      deptName: [null, Validators.required],
      deptArbName: [null, Validators.required],
      tokenCheck: [false, Validators.required],
    });
    if (this.Data != null) {
      this.departmentForm.patchValue({
        deptName: this.Data.deptName,
        deptArbName: this.Data.deptArbName,
        tokenCheck: this.Data.dept_Multiple_Token == 1 ? true : false
      })
      //this.departmentForm.get('validateDeptName').setValue(this.Data.deptName);

    }

  }

  onSubmit() {
    this.loading = true;

    if (this.Data.deptId) {
      this.createDeptObj = {
        deptId: this.Data.deptId,
        deptName: (this.departmentForm.value.deptName as string).trim(),
        floorId: this.departmentForm.value.floorId,
        deptArbName: (this.departmentForm.value.deptArbName as string).trim(),
        orgId: this.orgId,
        dept_Multiple_Token: this.departmentForm.value.tokenCheck ? 1 : 0
      } as IcreateDept;
      console.log('updateDeptObj=>' + JSON.stringify(this.createDeptObj));
      this._levelService.updateDepartment(this.createDeptObj).subscribe((response: IDeptResponse) => {
        if (response.status) {
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close(this.createDeptObj);
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
    } else {
      this.createDeptObj = {
        deptName: (this.departmentForm.value.deptName as string).trim(),
        floorId: this.departmentForm.value.floorId,
        deptArbName: (this.departmentForm.value.deptArbName as string).trim(),
        orgId: this.orgId,
        dept_Multiple_Token: this.departmentForm.value.tokenCheck ? 1 : 0
      } as IcreateDept;
      console.log('createDeptObj=>' + JSON.stringify(this.createDeptObj));
      this._levelService.createDepartment(this.createDeptObj).subscribe((response: IDeptResponse) => {
        if (response.status) {
          this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close(this.createDeptObj);
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

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}

export function DeptnameValidator(service: LevelService, floorId): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value != null ? service.validateDept((control.value as string).trim(), floorId)
      .map(response => {
        console.log(response.status)
        return !response.status ? { invalid: true } : null
      }) : null;
  };
}