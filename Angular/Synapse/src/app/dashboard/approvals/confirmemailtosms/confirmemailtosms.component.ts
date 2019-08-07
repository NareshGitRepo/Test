import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDialog } from '@angular/material';
import { ApprovalsService } from '../_service/approvals.service';
import { CheckerData, ICheckerData, ApproveData, ApiResponse } from '../_model/approvals.model';
import { AlertMessageService,ActionType } from '../../../_services/AlertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmApprovalComponent } from '../_model/approvalAlert';

@Component({
  selector: 'app-confirmemailtosms',
  templateUrl: './confirmemailtosms.component.html',
  styleUrls: ['./confirmemailtosms.component.scss']
})
export class ConfirmemailtosmsComponent implements OnInit {
  emailtoSmsForm:FormGroup;
  ApprovalsList: ICheckerData;
  loading: boolean = false;
  approveData: ApproveData;
  constructor(private fb:FormBuilder,public dialogRef:MatDialogRef<ConfirmemailtosmsComponent>,@Inject(MAT_DIALOG_DATA)  public _checkerData: CheckerData,
  private checkerService: ApprovalsService,private alertMessage: AlertMessageService,private translate: TranslateService, private dialog: MatDialog,) { }
  ngOnInit() {
    this.emailtoSmsForm = this.fb.group({
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
  
approveEmailtoSMS()
{
  console.log("this.ApprovalsList ", JSON.stringify(this.ApprovalsList));

  const dialogRef = this.dialog.open(ConfirmApprovalComponent, {
    width: '500px',
    data: this.translate.instant('ApprovalModule.confirmMessageApproval')  + this.ApprovalsList.name
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
        let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse")  : message ? message : error.message;
        console.error("E-approveDepartment==>", JSON.stringify(error));
        this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading=false;
      })
    }
  });
}
  rejectEmailtoSMS()
  {
    const dialogRef = this.dialog.open(ConfirmApprovalComponent, {
      width: '500px',
      data: this.translate.instant('ApprovalModule.confirmMessageReject') + this.ApprovalsList.name
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading=true;
        this.approveData = {
          checkId: this._checkerData.checkId,
          reason: this.emailtoSmsForm.value.rejectReason,
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
          let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
          console.error("E-rejectDepartment==>", JSON.stringify(error));
          this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading=false;
        })
      }
    });

  }
  


 
}

