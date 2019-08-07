import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { ApiResponse, ApproveData, CheckerData, ICheckerData } from '../_model/approvals.model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';

import { ApprovalsService } from '../_service/approvals.service';
import { ConfirmApprovalComponent } from '../_model/approvalAlert';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-approvalsconfirm',
  templateUrl: './approvalsconfirm.component.html',
  styleUrls: ['./approvalsconfirm.component.scss']
})
export class ApprovalsconfirmComponent implements OnInit {
  approvalsForm: FormGroup;
  approveData: ApproveData;

  ApprovalsList: ICheckerData;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private dialog: MatDialog, public dialogRef: MatDialogRef<ApprovalsconfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public _checkerData: CheckerData, private checkerService: ApprovalsService,
    private alertMessage: AlertMessageService, private translate : TranslateService) {
    console.log("data for approval:::", this._checkerData);
  }

  ngOnInit() {
    this.approvalsForm = this.fb.group({
      moduleName: ['', Validators.required],
      info: ['', Validators.required],
      rejectReason: ['', Validators.required]
    });

    if (this._checkerData != null) {
      this.approvalsForm.patchValue(this._checkerData);
    }
    this.getApprovalsInfo();
  }

  getApprovalsInfo() {
    this.loading = true;
    this.checkerService.getApprovalsInfo(this._checkerData).subscribe((result: ICheckerData) => {
      if (result) {
        this.ApprovalsList = result;
        console.log("ApprovalsList:::::", this.ApprovalsList);
      }
      else {
        this.ApprovalsList = null;
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getApprovalsInfo==>", JSON.stringify(error));
      this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }


  approveGroup() {
    const dialogRef = this.dialog.open(ConfirmApprovalComponent, {
      width: '500px',
      data: this.translate.instant('DashBoardModule.approval.confirmMessageApproval') + this.approvalsForm.value.moduleName //+ "\" ?"
    });

    console.log("this._checkerData.checkId", this._checkerData.checkId);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading=true;
        this.approveData = {
          checkId: this._checkerData.checkId,
          reason: '',
          status: 1
        }
        console.log("this.approveData Approve ", this.approveData);
        this.checkerService.approveData(this.approveData).subscribe((response: ApiResponse) => {
          if (response) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            this.dialogRef.close(response);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading=false;
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-approveGroup==>", JSON.stringify(error));
          this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading=false;
        })
      }
    });
  }
  rejectGroup() {
    const dialogRef = this.dialog.open(ConfirmApprovalComponent, {
      width: '500px',
      data: this.translate.instant('DashBoardModule.approval.confirmMessageReject') + this.approvalsForm.value.moduleName //+ "\" ?"
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading=true;
        this.approveData = {
          checkId: this._checkerData.checkId,
          reason: this.approvalsForm.value.rejectReason,
          status: 0
        }
        console.log(" this.approveData Reject ", this.approveData);
        this.checkerService.approveData(this.approveData).subscribe((response: ApiResponse) => {
          if (response) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            this.dialogRef.close(response);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading=false;
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-rejectGroup==>", JSON.stringify(error));
          this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading=false;
        })
      }
    });
  }
}
