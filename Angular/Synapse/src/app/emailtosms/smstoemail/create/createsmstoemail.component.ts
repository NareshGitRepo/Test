import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SMStoEmailService } from '../_service/smstoemail.service';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ISmsToEmail, ISenderInfo, ApiResponse, IEmailTemplate, IEmailServer } from '../_model/smstoemail.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-createsmstoemail',
  templateUrl: './createsmstoemail.component.html',
  styleUrls: ['./createsmstoemail.component.scss']
})
export class CreatesmstoemailComponent implements OnInit {

  smstoEmailForm: FormGroup;
  senderdata: ISenderInfo[] = []
  smstoemailData: any;
  emailtemplateData: IEmailTemplate[] = []
  emailServer: IEmailServer[] = [];
  loading: boolean = false;
  smstoemailNameValid: boolean = false;
  mailccFlag: boolean = false;
  mailpattern = /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/;
  constructor(private fb: FormBuilder, private translate: TranslateService,
    private service: SMStoEmailService, private alertMessage: AlertMessageService, private router: Router, public dialogRef: MatDialogRef<CreatesmstoemailComponent>,
    @Inject(MAT_DIALOG_DATA) public _editSMStoemaildata: ISmsToEmail) { }

  ngOnInit() {
    this.getsenders();
    this.smstoEmailForm = this.fb.group({
      smsToEmailName: [null, [Validators.required, Validators.minLength(5)]],
      validatesmsName: [null, [Validators.required], [SmsToEmailValidator(this.service)]],
      senders: [null, Validators.required],
      mailServer: [null, Validators.required],
      mailTemplate: [null, Validators.required],
      mailTo: [null, [Validators.required, Validators.pattern(this.mailpattern)]],
      mailCC: [null],
      subject: [null, [Validators.required]],
      smsToEmailId: [null]
    });

    if (this._editSMStoemaildata != null) {
      console.log('_editSMStoemaildata ', this._editSMStoemaildata);
      console.log(this._editSMStoemaildata.emailServer.emailServerId);
      this.smstoEmailForm.patchValue({
        smsToEmailName: this._editSMStoemaildata.smsToEmailName,
        subject: this._editSMStoemaildata.subject,
        mailTo: this._editSMStoemaildata.toEmail,
      });
      if (this._editSMStoemaildata.ccEmail != null && this._editSMStoemaildata.ccEmail != '') {
        this.mailccFlag = true;
        this.smstoEmailForm.get('mailCC').setValue(this._editSMStoemaildata.ccEmail);
        this.smstoEmailForm.get('mailCC').setValidators([Validators.required, Validators.pattern(this.mailpattern)]);
        this.smstoEmailForm.get('mailCC').updateValueAndValidity();
      }
      else {
        this.smstoEmailForm.get('mailCC').setValue(null);
        this.smstoEmailForm.get('mailCC').clearValidators();
        this.smstoEmailForm.get('mailCC').updateValueAndValidity();
      }
      this.smstoEmailForm.get('validatesmsName').clearValidators();
      this.smstoEmailForm.get('validatesmsName').clearAsyncValidators();
      this.smstoEmailForm.get('validatesmsName').updateValueAndValidity();
    }
  }
  getsenders() {
    this.loading = true;
    this.service.getsenders().subscribe((result: ISenderInfo[]) => {
      console.log("result=>", result);
      if (result)
        if (result.length > 0) {
          this.senderdata = result.filter(x => x.status == 1 && x.senderType != 1);
          if (this._editSMStoemaildata != null) {
            let senderindex = this.senderdata.findIndex(x => x.senderId == this._editSMStoemaildata.senderInfo.senderId)
            if (senderindex != -1) {
              this.smstoEmailForm.get('senders').setValue(this._editSMStoemaildata.senderInfo.senderId);
            }
            else {
              this.showAlert(this.translate.instant('smstoemail.create.statusofsender'), ActionType.ERROR)
            }
          }
        }
      this.getEmailServer();
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getsenders==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }
  getEmailServer() {
    this.service.getEmailServer().subscribe((result: IEmailServer[]) => {
      console.log("result=>", result);
      if (result)
        if (result.length > 0) {
          this.emailServer = result.filter(x => x.emailBoxType != 2);
          if (this._editSMStoemaildata != null) {
            let mailserverindex = this.emailServer.findIndex(x => x.emailServerId == this._editSMStoemaildata.emailServer.emailServerId)
            if (mailserverindex != -1) {

              this.smstoEmailForm.get('mailServer').setValue(this._editSMStoemaildata.emailServer.emailServerId);
            }
            else {
              this.showAlert(this.translate.instant('smstoemail.create.statusofmailserver'), ActionType.ERROR)
            }
          }
        }
      this.getEmailTemplate();
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getEmailServer==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
  }
  getEmailTemplate() {
    this.service.getEmailTemplate().subscribe((result: IEmailTemplate[]) => {
      console.log("result=>", result);
      if (result.length > 0) {
        this.emailtemplateData = result.filter(x => x.status == 1);
        if (this._editSMStoemaildata != null) {

          let mailtemplateindex = this.emailtemplateData.findIndex(x => x.emailTemplateId == this._editSMStoemaildata.emailTemplate)
          if (mailtemplateindex != -1) {
            this.smstoEmailForm.get('mailTemplate').setValue(this._editSMStoemaildata.emailTemplate);
          }
          else {
            this.showAlert(this.translate.instant('smstoemail.create.statusofmailtemplate'), ActionType.ERROR)
          }
        }
      }
      this.loading = false;
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getEmailTemplate==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
      });
  }

  mailCCValidation() {
    if (this.smstoEmailForm.value.mailCC != null && this.smstoEmailForm.value.mailCC != '' && !this.mailccFlag) {
      this.smstoEmailForm.get('mailCC').setValidators([Validators.required, Validators.pattern(this.mailpattern)]);
      this.smstoEmailForm.get('mailCC').updateValueAndValidity();
      this.mailccFlag = true;
    }
    else if (this.smstoEmailForm.value.mailCC == '' && this.mailccFlag) {
      this.smstoEmailForm.get('mailCC').clearValidators();
      this.smstoEmailForm.get('mailCC').updateValueAndValidity();
      this.mailccFlag = false;
    }
  }

  createSmsToEmail() {
    this.loading = true;
    console.log('this.smstoEmailForm.value.senders :: ', this.smstoEmailForm.value.senders);
    let serverInfo = this.emailServer.filter(x => x.emailServerId == this.smstoEmailForm.value.mailServer);
    console.log("serverInfo : ", serverInfo);
    let sernderInfo = {};
    sernderInfo = this.senderdata.filter(x => x.senderId == this.smstoEmailForm.value.senders);
    console.log("sernderInfo : ", sernderInfo);
    this.smstoemailData =
      {
        ccEmail: this.smstoEmailForm.value.mailCC,
        emailServer: {
          emailServerId: serverInfo[0].emailServerId,
          emailServerName: serverInfo[0].emailServerName
        },
        emailTemplate: parseInt(this.smstoEmailForm.value.mailTemplate),
        smsToEmailName: this.smstoEmailForm.value.smsToEmailName,
        subject: this.smstoEmailForm.value.subject,
        toEmail: this.smstoEmailForm.value.mailTo,
        senderInfo: sernderInfo[0],
        sms2emailId: this.smstoEmailForm.value.smsToEmailId != '' ? parseInt(this.smstoEmailForm.value.smsToEmailId) : 0,
        //   status:0
      };
    console.log("object", JSON.stringify(this.smstoemailData));
    if (!this._editSMStoemaildata) {
      this.service.createSmsToEmail(this.smstoemailData).subscribe((response: ApiResponse) => {
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.smstoemailData);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createSmsToEmail==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
    else {
      console.log("this.smstoemailData::::", this.smstoemailData);
      this.smstoemailData.sms2emailId = this._editSMStoemaildata.sms2emailId;
      this.service.updateSmsToEmail(this.smstoemailData).subscribe((response: ApiResponse) => {
        console.log("response", response);
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.smstoemailData);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-updateSmsToEmail==>", JSON.stringify(error));
        this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });

    }
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

}

export function SmsToEmailValidator(service: SMStoEmailService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value != null ? service.validateSmsToEmailName((control.value as string).trim())
      .map(response => {
        console.log(response.status)
        return !response.status ? { invalid: true } : null
      }) : null;
  };
}