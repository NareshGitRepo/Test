import { ActionType, AlertMessageService } from '../../../../_services/AlertMessageService';
import { ApiResponse, SegementCustomerData } from '../../_model/segement-manage.model';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { SegmentManageService } from '../../_service/segment-manage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-addsegment',
  templateUrl: './addsegment.component.html',
  styleUrls: ['./addsegment.component.scss']
})
export class AddsegmentComponent implements OnInit {
  action: string = "Add";
  segmentsForm: FormGroup;
  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public _editSegdata: SegementCustomerData, private translate: TranslateService, private alertMessage: AlertMessageService, private customerSegmentSrvice: SegmentManageService, public dialogRef: MatDialogRef<AddsegmentComponent>, private Snackbar: MatSnackBar) { }
  segmentOptions: SegementCustomerData;
  isEdit: Boolean = false;
  public useStatus = false;
  loading: boolean = false;
  ngOnInit() {
    this.segmentsForm = this.fb.group({
      segmentCode: ['', Validators.required],
      segmentPrecedence: ['', Validators.required],
      segmentName: ['', Validators.required],
      segmentDesc: ['', Validators.required],
      // segmentStatus: [true]
    });

    if (this._editSegdata != null) {
      this.action = "Edit";
      this.segmentsForm.patchValue(this._editSegdata);
      // this.segmentsForm.get('segmentDescription').setValue(this._editSegdata.segmentDesc);
      this.isEdit = true;
    }

  }
  createSegment() {
    this.loading = true;
    if (!this._editSegdata) {
      this.segmentOptions = {
        segmentCode: this.segmentsForm.value.segmentCode,
        segmentDesc: this.segmentsForm.value.segmentDesc,
        segmentName: this.segmentsForm.value.segmentName,
        segmentPrecedence: this.segmentsForm.value.segmentPrecedence,
      }
      console.log("object", this.segmentOptions)
      this.customerSegmentSrvice.createSegmentMaster(this.segmentOptions).subscribe((response: ApiResponse) => {
        if (response) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.segmentOptions);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      },
        error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-createSegment==>", JSON.stringify(error));
          this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
    }
    else {
      this.segmentOptions = {
        segmentCode: this.segmentsForm.value.segmentCode,
        segmentDesc: this.segmentsForm.value.segmentDesc,
        segmentName: this.segmentsForm.value.segmentName,
        segmentPrecedence: this.segmentsForm.value.segmentPrecedence,
        segmentId: this._editSegdata.segmentId
      }
      this.customerSegmentSrvice.updateSegmentMasterInfo(this.segmentOptions).subscribe((response: ApiResponse) => {
        if (response) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.segmentOptions);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createSegment==>", JSON.stringify(error));
        this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
  }
}