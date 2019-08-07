import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IDepartment, ApiResponse, ICreditTypes } from '../_model/department.model';
import { DepartmentService } from '../_service/department.service';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-createdepartment',
  templateUrl: './createdepartment.component.html',
  styleUrls: ['./createdepartment.component.scss']
})

export class CreatedepartmentComponent implements OnInit {
  departmentsForm: FormGroup;
  departData: IDepartment;
  public useStatus = false;
  creditTypes: ICreditTypes[] = [];
  loading: boolean = false;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CreatedepartmentComponent>, @Inject(MAT_DIALOG_DATA) public _editDeptdata: IDepartment
    , private deptService: DepartmentService, private alertMessage: AlertMessageService, private router: Router, private translate: TranslateService) {
    console.log("edit data::::", this._editDeptdata);
  }

  ngOnInit() {
    this.departmentsForm = this.fb.group({
      deptName: ['', Validators.required],
      validateDepartmentName: [this._editDeptdata != null ? this._editDeptdata.deptName : null, [Validators.required], [DepartmentValidator(this.deptService, this._editDeptdata != null ? this._editDeptdata.deptName : '', this._editDeptdata != null ? true : false)]],
      description: ['', Validators.required],
      creditType: ['', Validators.required],
    });
    console.log("Create department .................");

    this.getCreditTypes();
    // if (this._editDeptdata != null) {
    //   // this.departmentsForm.patchValue(this._editDeptdata);
    //   // this.departmentsForm.get('creditType').setValue(this._editDeptdata.creditType.creditTypeId);
    //   this.departmentsForm.get('validateDepartmentName').clearValidators();
    //   this.departmentsForm.get('validateDepartmentName').clearAsyncValidators();
    //   this.departmentsForm.get('validateDepartmentName').updateValueAndValidity();
    // }
  }
  getCreditTypes() {
    this.loading = true;
    this.deptService.getCreditTypes().subscribe((result: ICreditTypes[]) => {
      if (result) {
        console.log("result CreditTypes", result);
        this.creditTypes = result;

        if (this._editDeptdata != null) {
          this.departmentsForm.get('deptName').setValue(this._editDeptdata.deptName);
          this.departmentsForm.get('description').setValue(this._editDeptdata.description);
          this.departmentsForm.get('creditType').setValue(this._editDeptdata.creditType.creditTypeId);
        } else {
          if (this.creditTypes.length == 1) {
            this.departmentsForm.get('creditType').setValue(this.creditTypes[0].creditTypeId);
          }
        }
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-createDepartment==>", JSON.stringify(error));
      this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
    });

  }

  createDepartment() {
    this.loading = true;
    console.log("form data::::", this.departmentsForm.value);
    if (!this._editDeptdata) {
      this.departData = {
        deptName: (this.departmentsForm.value.deptName as string).trim(),
        description: (this.departmentsForm.value.description as string),
        creditType: { "creditTypeId": (this.departmentsForm.value.creditType as number) }
      }
      this.deptService.createDepartment(this.departData).subscribe((response: ApiResponse) => {
        if (response) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.departData);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createDepartment==>", JSON.stringify(error));
        this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
    else {
      this.departData = {
        deptId: this._editDeptdata.deptId,
        deptName: (this.departmentsForm.value.deptName as string),
        description: (this.departmentsForm.value.description as string),
        creditType: { "creditTypeId": (this.departmentsForm.value.creditType as number) },
        status: this._editDeptdata.status
      }
      this.deptService.updateDepartment(this.departData).subscribe((response: ApiResponse) => {
        if (response) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.departData);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createDepartment==>", JSON.stringify(error));
        this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }

  }
}

export function DepartmentValidator(service: DepartmentService, name: string, action?: boolean): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (action && name == (control.value as string).trim())
      return control.value != null ? service.validateDepartmentName1()
        .map(response => {
          console.log(response.status)
          return !response.status ? { invalid: true } : null
        }) : null;
    else
      return control.value != null ? service.validateDepartmentName((control.value as string).trim())
        .map(response => {
          console.log(response.status)
          return !response.status ? { invalid: true } : null
        }) : null;
  };
}