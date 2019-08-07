import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { Component, Inject, OnInit } from '@angular/core';
import { Isender, IsenderRes } from '../model/sender.model';
import { MAT_DIALOG_DATA, MatCheckboxChange, MatDialogRef } from '@angular/material';

import { Observable } from 'rxjs';
import { SenderService } from '../services/sender.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-createsenders',
  templateUrl: './createsenders.component.html',
  styleUrls: ['./createsenders.component.scss']
})
export class CreatesendersComponent implements OnInit {

  sendersForm: FormGroup
  ISenderdata: Isender;
  isMTSelected: boolean = true;
  isMOSelected: boolean = false;
  loading: boolean = false;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CreatesendersComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private senderservice: SenderService, private alertmessage: AlertMessageService, private translate: TranslateService) { }

  ngOnInit() {
    this.sendersForm = this.fb.group({
      senderName: [null, Validators.required],
      mt: [true],
      mo: [false],
      validateSenderName: [this.data != null ? this.data.senderName : null, [Validators.required], [SenderValidator(this.senderservice, this.data != null ? this.data.senderName : '', this.data != null ? true : false)]],

    })

    if (this.data != null) {
      console.log('Edit data ', this.data)
      this.sendersForm.patchValue(this.data);
      // this.sendersForm.get('validateSenderName').clearValidators();
      // this.sendersForm.get('validateSenderName').clearAsyncValidators();
      if (this.data.senderType == 3) {

        this.sendersForm.get('mt').setValue(true);
        this.sendersForm.get('mo').setValue(true);
        this.isMTSelected = true;
        this.isMOSelected = true;

      } else if (this.data.senderType == 2) {

        this.sendersForm.get('mt').setValue(false);
        this.sendersForm.get('mo').setValue(true);
        this.isMTSelected = false;
        this.isMOSelected = true;

      } else if (this.data.emailBoxType == 1) {

        this.sendersForm.get('mt').setValue(true);
        this.isMTSelected = true;
        this.isMOSelected = false;
      }
    }
  }
  callMTChange(event: MatCheckboxChange) {

    if (event.checked) {
      this.isMTSelected = true;
    } else {
      this.isMTSelected = false;

    }

  }
  callMOChange(event: MatCheckboxChange) {

    if (event.checked) {
      this.isMOSelected = true;
    } else {
      this.isMOSelected = false;

    }

  }
  createSender() {
    this.loading = true;
    let senderType = (this.isMTSelected && this.isMOSelected) ? 3 : (this.isMTSelected) ? 1 : (this.isMOSelected) ? 2 : null;
    console.log('senderType ', senderType);

    if (!this.data) {
      this.ISenderdata = {
        senderName: (this.sendersForm.value.senderName).trim(),
        senderType: senderType
      }
      this.senderservice.createSender(this.ISenderdata).subscribe((response: IsenderRes) => {
        if (response) {
          this.alertmessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.ISenderdata);
        } else {
          this.alertmessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      },
        error => {
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-createSender==>", JSON.stringify(error));
          this.alertmessage.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
    }
    else {
      this.ISenderdata = {
        senderName: this.sendersForm.value.senderName,
        senderId: this.data.senderId,
        senderType: senderType
      }
      this.senderservice.UpdateSender(this.ISenderdata).subscribe((response: IsenderRes) => {
        if (response) {
          this.alertmessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.ISenderdata);
        } else {
          this.alertmessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createSender==>", JSON.stringify(error));
        this.alertmessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
  }
}

export function SenderValidator(service: SenderService, name: string, action?: boolean): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (action && name == (control.value as string).trim())
      return control.value != null ? service.validateSenderName1()
        .map(response => {
          console.log(response.status)
          return !response.status ? { invalid: true } : null
        }) : null;
    else
      return control.value != null ? service.validateSenderName((control.value as string).trim())
        .map(response => {
          console.log(response.status)
          return !response.status ? { invalid: true } : null
        }) : null;
  };
}
