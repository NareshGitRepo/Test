import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUpdateCredit, IUserResponse, UserGet } from '../_model/userquota.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserQuotaService } from '../_service/userquotaquota.service';

@Component({
  selector: 'app-userquotasetlimit',
  templateUrl: './userquotasetlimit.component.html',
  styleUrls: ['./userquotasetlimit.component.scss']
})
export class UserquotasetlimitComponent implements OnInit {

  userQuotaSetlimitForm: FormGroup;
  loading: boolean = false;
  prepaidFlag: boolean = false;
  postPaidFlag: boolean = false;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<UserquotasetlimitComponent>,
    @Inject(MAT_DIALOG_DATA) public editUserdata: UserGet, private usrQuotaService: UserQuotaService,
    private router: Router, private alertMessage: AlertMessageService, private translate: TranslateService) {
    console.log("EDIT==>", editUserdata)
  }

  ngOnInit() {
    this.userQuotaSetlimitForm = this.fb.group({
      accountType: [null, Validators.required],
      availableBalance: [null, Validators.required],
      adjustmentType: [null, Validators.required],
      credits: [null, Validators.required],
      currentThresholdLimit: [null, Validators.required],
    });
    if (this.editUserdata != null) {
      console.log('editData=>', this.editUserdata);
      if (this.editUserdata.creditType.creditCode == "POP") {
        this.postPaidFlag = true;
        this.userQuotaSetlimitForm.patchValue({
          accountType: this.editUserdata.creditType.creditName,
          currentThresholdLimit: this.editUserdata.userCredit ? this.editUserdata.userCredit.availableCredit : 0,
        });
        this.userQuotaSetlimitForm.get('availableBalance').clearValidators();
        this.userQuotaSetlimitForm.updateValueAndValidity();
      }
      else {
        this.userQuotaSetlimitForm.get('currentThresholdLimit').clearValidators();
        this.userQuotaSetlimitForm.updateValueAndValidity();
        this.prepaidFlag = true;
        this.userQuotaSetlimitForm.patchValue({
          accountType: this.editUserdata.creditType.creditName,
          availableBalance: this.editUserdata.userCredit ? this.editUserdata.userCredit.thresoldLimit : '',
          currentThresholdLimit: this.editUserdata.userCredit ? this.editUserdata.userCredit.availableCredit : []
        });
      }
    }
  }

  addCredits() {
    this.loading = true;
    let transactionType = 0;
    if (this.userQuotaSetlimitForm.value.adjustmentType == 'topup') {
      transactionType = 1;
    } else {
      transactionType = 2;
    }
    let availableBalance;
    if (this.editUserdata.creditType.creditCode == "POP") {
      availableBalance = this.userQuotaSetlimitForm.value.currentThresholdLimit;
    } else {
      availableBalance = this.userQuotaSetlimitForm.value.availableBalance;
    }
    
    let ICreateUser = {
      availableCredit: +availableBalance,
      creditTypeId: this.editUserdata.creditType.creditTypeId,
      modifiedCredit: +(this.userQuotaSetlimitForm.value.credits),
      thresoldLimit: this.userQuotaSetlimitForm.value.currentThresholdLimit,
      transactionType: transactionType,
      userCreditId: this.editUserdata.userCredit == null ? 0 : this.editUserdata.userCredit.userCreditId,
      userId: this.editUserdata.userId
    } as IUpdateCredit;
    console.log('ICreatedept=>', ICreateUser);
    this.usrQuotaService.updateUserCredit(ICreateUser).subscribe((response: IUserResponse) => {
      console.log('response=>', response, ICreateUser);
      if (response.status) {
        this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
        this.dialogRef.close(ICreateUser);
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
