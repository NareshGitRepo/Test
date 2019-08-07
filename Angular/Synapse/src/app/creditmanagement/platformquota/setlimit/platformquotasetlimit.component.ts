import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PlatformquotaService } from '../_service/platformquota.service';
import { ICreditTypes, IPlatformCredit, IResponse, Idate } from '../_model/platformquota.model';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-platformquotasetlimit',
  templateUrl: './platformquotasetlimit.component.html',
  styleUrls: ['./platformquotasetlimit.component.scss']
})
export class PlatformquotasetlimitComponent implements OnInit {
  platformCreditsForm: FormGroup;
  creditTypes: ICreditTypes[] = [];
  loading: boolean = false;
  currentDate: Idate;
  tokenInfo: ITokenInfo;
  loginInfo: IUserUpdateDto;
  _roleCode: string = "";
  minDate: Date;
  constructor(public dialogRef: MatDialogRef<PlatformquotasetlimitComponent>, @Inject(MAT_DIALOG_DATA) public editData: IPlatformCredit, private fb: FormBuilder, private _service: PlatformquotaService, private alertMessage: AlertMessageService, private translate: TranslateService,
    private router: Router, private appconfig: AppConfig, private datePipe: DatePipe) {
    console.log("editData==>", editData);
    this.tokenInfo = this.appconfig.getTokenInfo() as ITokenInfo;
    if (this.tokenInfo) {
      this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      console.log("rolename::::", this._roleCode);
    }
    else
      this.router.navigate(['401'])
  }

  ngOnInit() {
    this.platformCreditsForm = this.fb.group({
      accountType: [null, Validators.required],
      availableBalance: [null],
      adjustmentType: [null, Validators.required],
      modifiedCredits: [null, [Validators.required]],
      expiryDate: [null],
      hasExpiry: [false]
    });
    if (this.tokenInfo) {
      this.loading = true;
      this.getCurrentDate();
    }
  }
  getCurrentDate() {
    this._service.getCurrentDate().subscribe((result: Idate) => {
      if (result) {
        this.currentDate = result;
        let currentDateFrom = new Date((this.currentDate.dateTime).replace(/\s/g, "T"));
        this.minDate = new Date(currentDateFrom.setDate(currentDateFrom.getDate() + 1));
        this.minDate.setHours(0);
        this.minDate.setMinutes(0);
        this.minDate.setSeconds(0);
        this.minDate.setMilliseconds(0);
      }
      this.getCreditTypes();

    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onSubmit==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      let currentDateFrom = new Date();
      this.minDate = new Date(currentDateFrom.setDate(currentDateFrom.getDate() + 1));
      console.log("currentDate==>", currentDateFrom);
      this.getCreditTypes();
      this.loading = false
    });
  }
  getCreditTypes() {
    this.loading = true;
    this._service.getAllCreditTypes().subscribe((result: ICreditTypes[]) => {
      if (result) {
        this.creditTypes = result;
        if (this.editData) {
          this.platformCreditsForm.get('accountType').setValue(this.editData.creditType);
          this.platformCreditsForm.get('availableBalance').setValue(this.editData.credits);
          this.platformCreditsForm.get('hasExpiry').setValue(this.editData.hasExpiryDate == 0 ? false : true);
          if (this.editData.hasExpiryDate == 1 && this.editData.expiryDate) {
            const expiry = this.editData.expiryDate.split(' ');
            const str = expiry[0].split('-');
            const year = Number(str[0]);
            const month = Number(str[1]) - 1;
            const date = Number(str[2]);
            let date1 = new Date(year, month, date)
            console.log("date1==>", date1, this.editData.expiryDate, str, year, month, date, expiry);

            this.platformCreditsForm.get('expiryDate').setValue(date1);
          }
        }
      }
      else {
        this.creditTypes = [];
      }
      this.loading = false;
    }, error => {
      this.creditTypes = [];
      let message = error.error.message as string;
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-addCredits==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    })
  }
  UpdateplatformCredit() {
    this.loading = true;
    let expirydate = this.datePipe.transform(this.platformCreditsForm.value.expiryDate, "yyyy-MM-dd hh:mm:ss");
    let updateData: IPlatformCredit = {
      availableBalance: this.platformCreditsForm.value.availableBalance,
      creditType: this.platformCreditsForm.value.accountType,
      credits: this.editData.credits,
      expiryDate: this.platformCreditsForm.value.hasExpiry == true ? expirydate : '',
      hasExpiryDate: this.platformCreditsForm.value.hasExpiry == true ? 1 : 0,
      modifiedCredits: this.platformCreditsForm.value.modifiedCredits,
      platformCreditId: this.editData.platformCreditId,
      transactionType: this.platformCreditsForm.value.adjustmentType
    }
    console.log("updateData==>", JSON.stringify(updateData));

    this._service.updatePlatformCredits(updateData).subscribe((result: IResponse) => {
      if (result.status) {
        this.alertMessage.showAlert(result.message, ActionType.SUCCESS);
        this.dialogRef.close(updateData);
      } else {
        this.alertMessage.showAlert(result.message, ActionType.FAILED);
      }
      this.loading = false;
    }, error => {
      let message = error.error.message as string;
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-UpdateplatformCredit==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  hasExpiry() {
    this.platformCreditsForm.get('expiryDate').setValue(null);
    if (this.platformCreditsForm.value.hasExpiry == false) {
      this.platformCreditsForm.get('expiryDate').clearValidators();

      this.platformCreditsForm.get('expiryDate').updateValueAndValidity();
    } else {
      this.platformCreditsForm.get('expiryDate').setValidators(Validators.required);
    }
  }

}
