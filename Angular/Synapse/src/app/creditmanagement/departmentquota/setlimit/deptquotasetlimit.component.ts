import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { Component, Inject, OnInit } from '@angular/core';
import { ErrorStateMatcher, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { IDepartment, IResponse, IUpdateCredit } from '../_model/departmentquota.model';
import { CreditManagementService } from '../_service/departmentquota.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return (invalidCtrl || invalidParent);
  }
}
@Component({
  selector: 'app-deptquotasetlimit',
  templateUrl: './deptquotasetlimit.component.html',
  styleUrls: ['./deptquotasetlimit.component.scss']
})
export class DeptquotasetlimitComponent implements OnInit {

  deptQuotaSetlimitForm: FormGroup;
  prepaidFlag: boolean = false;
  postPaidFlag: boolean = false;
  loading: boolean = false;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<DeptquotasetlimitComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: IDepartment, private alertMessage: AlertMessageService,
    private creditService: CreditManagementService, private translate: TranslateService,
    private router: Router) { }

  ngOnInit() {
    this.deptQuotaSetlimitForm = this.fb.group({
      accountType: ['', Validators.required],
      availableBalance: ['', Validators.required],
      adjustmentType: ['', Validators.required],
      credits: ['', Validators.required],
      currentThresholdLimit: ['', Validators.required],
      AvailableThresholds: ['', Validators.required]
    });

    if (this.editData != null) {
      console.log('editData=>', this.editData);
      if (this.editData.creditType.creditCode == "POP") {
        this.postPaidFlag = true;
        this.deptQuotaSetlimitForm.patchValue({
          accountType: this.editData.creditType.creditName,
          currentThresholdLimit: this.editData.deptcredit ? this.editData.deptcredit.availableCredit : [],
          AvailableThresholds: this.editData.deptcredit ? this.editData.deptcredit.thresoldLimit : ''
        });
        this.deptQuotaSetlimitForm.get('availableBalance').clearValidators();
        this.deptQuotaSetlimitForm.updateValueAndValidity();
      }
      else {
        this.deptQuotaSetlimitForm.get('currentThresholdLimit').clearValidators();
        this.deptQuotaSetlimitForm.get('AvailableThresholds').clearValidators();
        this.deptQuotaSetlimitForm.updateValueAndValidity();
        this.prepaidFlag = true;
        this.deptQuotaSetlimitForm.patchValue({
          accountType: this.editData.creditType.creditName,
          currentThresholdLimit: this.editData.deptcredit ? this.editData.deptcredit.availableCredit : [],
          availableBalance: this.editData.deptcredit ? this.editData.deptcredit.thresoldLimit : ''
        });
      }
      // this.deptQuotaSetlimitForm.patchValue(this.editData);
    }
  }

  addCredits() {
    this.loading = true;
    let transactionType = 0;
    if (this.deptQuotaSetlimitForm.value.adjustmentType == 'topup') {
      transactionType = 1;
    } else {
      transactionType = 2;
    }
    let availableBalance;
    if (this.editData.creditType.creditCode == "POP") {
      availableBalance = this.deptQuotaSetlimitForm.value.AvailableThresholds;
    } else {
      availableBalance = this.deptQuotaSetlimitForm.value.availableBalance;
    }
    let ICreatedept = {
      deptId: this.editData.deptId,
      availableCredit: availableBalance,
      creditTypeId: this.editData.creditType.creditTypeId,
      deptCreditId: this.editData.deptcredit.deptCreditId,
      thresoldLimit: this.deptQuotaSetlimitForm.value.currentThresholdLimit,
      modifiedCredit: this.deptQuotaSetlimitForm.value.credits,
      transactionType: transactionType
    } as IUpdateCredit;
    console.log('ICreatedept=>', ICreatedept);
    this.creditService.updateDeptCreditNew(ICreatedept).subscribe((response: IResponse) => {
      console.log('response=>', response);
      if (response.status) {
        this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
        this.dialogRef.close(ICreatedept);
      } else {
        this.alertMessage.showAlert(response.message, ActionType.FAILED);
      }
      this.loading = false;
    }, error => {
      let message = error.error.message as string;
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-addCredits==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
}