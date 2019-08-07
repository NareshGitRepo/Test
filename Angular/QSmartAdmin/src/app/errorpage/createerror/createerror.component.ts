import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorpageService } from '../_service/errorpage.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IErrorInfo } from '../_model/error.interface';
import { TranslateService } from '@ngx-translate/core';
import { AlertMessageService, ActionType } from '../../_services/alertMessageService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createerror',
  templateUrl: './createerror.component.html',
  styleUrls: ['./createerror.component.scss']
})
export class CreateErrorComponent implements OnInit {

  errorForm: FormGroup;
  errorlist: IErrorInfo[];
  direction = false;
  @ViewChild('messageAr') type: ElementRef;
  pageTitle: any = "Edit Error Message";

  constructor(public dialogRef: MatDialogRef<CreateErrorComponent>, private fb: FormBuilder,
    private translate: TranslateService, private alertMessage: AlertMessageService,
    private errorservice: ErrorpageService, @Inject(MAT_DIALOG_DATA) public editData: any,
    private router:Router) { }

  ngOnInit() {
    this.errorForm = this.fb.group({
      id: [''],
      errorType: this.fb.group({ errorName: [''] }),
      messageEn: ['', Validators.required],
      messageAr: ['', Validators.required],
    });

    let arabicvalue = /[\u0621-\u064A]/;
    if (this.editData.messageAr.match(arabicvalue)) {
      this.direction = true;
    }

    if (this.editData != null) {
      console.log("Edit Messsage::", this.editData);
      this.errorForm.patchValue(this.editData);
    }
  }

  onSubmit() {
    console.log("Edit Value:", this.editData);
    let editError = {
      id: this.editData.id,
      messageEn: this.errorForm.value.messageEn,
      messageAr: this.errorForm.value.messageAr,
    }
    this.errorservice.upateErrorInfo(editError).subscribe(response => {
      if (response) {
        this.alertMessage.showAlert(response.messages, ActionType.SUCCESS);
        this.dialogRef.close(response);
      } else {
        this.alertMessage.showAlert(response.messages, ActionType.FAILED);
      }
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR,error.status);
    });
  }

  showAlert(error: any, action: ActionType,status:number=0) {
    if(status==401)
    this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  
  // pasteUrl(e) {
  //   let message = this.type.nativeElement.value + e;
  //   var arabic = /[\u0621-\u064A]/;
  //   if (message.match(arabic)) {
  //     this.direction = true;
  //   }
  //   else {
  //     this.direction = false;
  //   }
  // }

}
