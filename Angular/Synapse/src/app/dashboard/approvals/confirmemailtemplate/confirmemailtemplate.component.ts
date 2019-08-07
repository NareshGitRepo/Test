import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { ApproveData, CheckerData, ICheckerData } from '../_model/approvals.model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';

import { ApiResponse } from '../../../adminsettings/spam/_model/filterkey.model';
import { ApprovalsService } from '../_service/approvals.service';
import { ConfirmApprovalComponent } from '../_model/approvalAlert';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmemailtemplate',
  templateUrl: './confirmemailtemplate.component.html',
  styleUrls: ['./confirmemailtemplate.component.scss']
})
export class ConfirmemailtemplateComponent implements OnInit {
  emailTemplateForm:FormGroup;
  ApprovalsList: ICheckerData;
  loading: boolean = false;
  approveData: ApproveData;

  constructor(private fb: FormBuilder, private dialog: MatDialog, public dialogRef: MatDialogRef<ConfirmemailtemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public _checkerData: CheckerData, private checkerService: ApprovalsService, private translate: TranslateService,
    private alertMessage: AlertMessageService) { }
  ngOnInit() {
    this.emailTemplateForm = this.fb.group({
      rejectReason:['',Validators.required]
    });
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
      let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
      console.error("E-getApprovalsInfo==>", JSON.stringify(error));
      this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  approveEmailTemplate() {
    console.log("this.ApprovalsList ", JSON.stringify(this.ApprovalsList));

    const dialogRef = this.dialog.open(ConfirmApprovalComponent, {
      width: '500px',
      data: this.translate.instant('ApprovalModule.confirmMessageApproval') + this.ApprovalsList.templateName
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
        console.log("this.approveData Approve", this.approveData);
        this.checkerService.approveData(this.approveData).subscribe((response: ApiResponse) => {
          if (response) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            // this.dialogRef.close(this.approveData);
            this.dialogRef.close(response);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading=false;
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
          console.error("E-approveEmailTemplate==>", JSON.stringify(error));
          this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading=false;
        })
      }
    });
  }

  rejectEmailTemplate() {
    const dialogRef = this.dialog.open(ConfirmApprovalComponent, {
      width: '500px',
      data: this.translate.instant('ApprovalModule.confirmMessageReject') + this.ApprovalsList.templateName
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading=true;
        this.approveData = {
          checkId: this._checkerData.checkId,
          reason: this.emailTemplateForm.value.rejectReason,
          status: 0
        }
        console.log("this.approveData Reject ", this.approveData);
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
          let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
          console.error("E-rejectEmailTemplate==>", JSON.stringify(error));
          this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading=false;
        })
      }
    });

  }

}

