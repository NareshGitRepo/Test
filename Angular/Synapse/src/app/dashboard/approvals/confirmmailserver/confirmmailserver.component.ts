import { Component, OnInit, Inject } from '@angular/core';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { ICheckerData, ApproveData, CheckerData, ApiResponse } from '../_model/approvals.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApprovalsService } from '../_service/approvals.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-confirmmailserver',
  templateUrl: './confirmmailserver.component.html',
  styleUrls: ['./confirmmailserver.component.scss']
})
export class ConfirmmailserverComponent implements OnInit {
  ApprovalsList: ICheckerData;
  loading: boolean = false;
  approveData: ApproveData;
  mailserverform: FormGroup;

  constructor(private fb: FormBuilder, private dialog: MatDialog, public dialogRef: MatDialogRef<ConfirmmailserverComponent>,
    @Inject(MAT_DIALOG_DATA) public _checkerData: CheckerData, private checkerService: ApprovalsService,
     private alertMessage: AlertMessageService, private translate: TranslateService) { }

  ngOnInit() {
    this.mailserverform = this.fb.group({
      rejectReason: ['', Validators.required]
    });
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
      let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse")  : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  approveMailServer() {
    console.log("this.ApprovalsList ", JSON.stringify(this.ApprovalsList));

    const dialogRef = this.dialog.open(ConfirmmailserverComponent, {
      width: '500px',
      data: this.translate.instant('ApprovalModule.confirmMessageApproval') + this.ApprovalsList.senderName
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
          console.error("E=>approveData :: ", JSON.stringify(error));
          this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading=false;
        })
      }
    });
  }
  rejectMailServer() {
    const dialogRef = this.dialog.open(ConfirmmailserverComponent, {
      width: '500px',
      data: this.translate.instant('ApprovalModule.confirmMessageReject') + this.ApprovalsList.senderName
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading=true;
        this.approveData = {
          checkId: this._checkerData.checkId,
          reason: this.mailserverform.value.rejectReason,
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
          let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse")  : message ? message : error.message;
          console.error("E=>approveData :: ", JSON.stringify(error));
          this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading=false;
        })
      }
    });

  }

}
