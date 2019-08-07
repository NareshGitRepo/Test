import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApprovalsService } from '../_service/approvals.service';
import { ApproveData, ICheckerData, CheckerData, ApiResponse } from '../_model/approvals.model';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmApprovalComponent } from '../_model/approvalAlert';

@Component({
  selector: 'app-confirmsmstoemail',
  templateUrl: './confirmsmstoemail.component.html',
  styleUrls: ['./confirmsmstoemail.component.scss']
})
export class ConfirmsmstoemailComponent implements OnInit {
  smstoemailform:FormGroup;
  ApprovalsList: ICheckerData;
  loading: boolean = false;
  approveData: ApproveData;
  constructor(private fb:FormBuilder,public checkerService: ApprovalsService,public dialogRef:MatDialogRef<ConfirmsmstoemailComponent>, @Inject(MAT_DIALOG_DATA) public _checkerData: CheckerData, private Snackbar:MatSnackBar,private alertMessage: AlertMessageService,  private translate: TranslateService, private dialog: MatDialog) { }

  ngOnInit() {
    this.smstoemailform = this.fb.group({
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
  approveSmstoEmail()
  {
    console.log("this.ApprovalsList ", JSON.stringify(this.ApprovalsList));

    const dialogRef = this.dialog.open(ConfirmApprovalComponent, {
      width: '500px',
      data: this.translate.instant('ApprovalModule.confirmMessageApproval') + this.ApprovalsList.smsToEmailName
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
            // this.dialogRef.close(this.approveData);
            this.dialogRef.close(response);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading=false;
        }, error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
          console.error("E-approveSpam==>", JSON.stringify(error));
          this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading=false;
        })
      }
    });
    
  }
  rejectSmstoEmail()
  {
    const dialogRef = this.dialog.open(ConfirmApprovalComponent, {
      width: '500px',
      data: this.translate.instant('ApprovalModule.confirmMessageReject') + this.ApprovalsList.smsToEmailName
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading=true;
        this.approveData = {
          checkId: this._checkerData.checkId,
          reason: this.smstoemailform.value.rejectReason,
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
          let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse"): message ? message : error.message;
          console.error("E-rejectSpam==>", JSON.stringify(error));
          this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading=false;
        })
      }
    });

  }
  }


