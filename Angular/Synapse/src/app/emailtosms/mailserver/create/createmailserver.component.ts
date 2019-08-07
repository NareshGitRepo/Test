import { Component, OnInit, Inject, AfterViewChecked } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatCheckbox, MatCheckboxChange, MatRadioChange } from '@angular/material';
import { FormBuilder, Validators, FormGroup, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { IMailServer, IResponse, ICreateMailServer, MailBoxTypes } from '../_model/mailserver.model';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { MailServerService } from '../_service/mailserver.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-createmailserver',
  templateUrl: './createmailserver.component.html',
  styleUrls: ['./createmailserver.component.scss']
})
export class CreatemailserverComponent implements OnInit {
  mailserverForm: FormGroup;
  intervalNum: string[] = ['5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60'];

  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  portPattern = /^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/;
  ipPattern = /^([a-zA-Z0-9.]+)$/;
  loading: boolean = false;
  constructor(private fb: FormBuilder, private mailBoxService: MailServerService, public dialogRef: MatDialogRef<CreatemailserverComponent>,
    @Inject(MAT_DIALOG_DATA) public _editmaildata: ICreateMailServer, private alertMessage: AlertMessageService, private translate: TranslateService) { }

  ngOnInit() {

    this.mailserverForm = this.fb.group({
      serverName: [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      email: [null, Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      serverip: [null, Validators.compose([Validators.required, Validators.pattern(this.ipPattern)])],
      port: [null, Validators.compose([Validators.required, Validators.pattern(this.portPattern), Validators.minLength(2)])],
      checkedSSL: [],
      mailboxtype: ['3'],
      interval: [null, Validators.required],
      validateServerNameTemplate: [null, [Validators.required], [mailTemplateValidator(this.mailBoxService)]]
    });
    console.log("editmaildata=>", this._editmaildata);

    if (this._editmaildata != null) {
      console.log("Status==>", this._editmaildata.status);
      console.log("interval==>", this._editmaildata.checkInterval);
      this.mailserverForm.patchValue({
        password: this._editmaildata.emailPassword,
        serverName: this._editmaildata.emailServerName,
        email: this._editmaildata.emailFromId,
        serverip: this._editmaildata.serverIp,
        port: this._editmaildata.serverPort,
        checkedSSL: this._editmaildata.emailSsl,
        mailboxtype: this._editmaildata.emailBoxType + ''
      });

      this.mailserverForm.get('validateServerNameTemplate').clearAsyncValidators();
      this.mailserverForm.get('validateServerNameTemplate').clearValidators();
      this.mailserverForm.get('validateServerNameTemplate').updateValueAndValidity();

      if (this._editmaildata.emailBoxType == MailBoxTypes.IMAP) {
        this.mailserverForm.get('interval').setValue(this._editmaildata.checkInterval + '');

      } else if (this._editmaildata.emailBoxType == MailBoxTypes.POP3) {
        this.mailserverForm.get('interval').setValue(this._editmaildata.checkInterval + '');

      } else if (this._editmaildata.emailBoxType == MailBoxTypes.SMTP) {

        this.mailserverForm.get('interval').clearValidators();
        this.mailserverForm.get('interval').updateValueAndValidity();
      }
    }
  }


  showAlert(error: any, action: ActionType) {
    setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  callMailBoxTypeOnChange(event: MatRadioChange) {
    if (event.value != 1) {
      this.mailserverForm.get('interval').setValidators(Validators.required);
      this.mailserverForm.get('interval').updateValueAndValidity();
    } else {
      this.mailserverForm.get('interval').clearValidators();
      this.mailserverForm.get('interval').updateValueAndValidity();
    }
  }

  crateAndUpdateAction() {
    this.loading = true;
    if (this._editmaildata != null) {
      let mail: ICreateMailServer = {
        emailServerId: this._editmaildata.emailServerId,
        emailServerName: this.mailserverForm.value.serverName,
        emailFromId: this.mailserverForm.value.email,
        emailPassword: this.mailserverForm.value.password,
        serverIp: this.mailserverForm.value.serverip,
        serverPort: +this.mailserverForm.value.port,
        emailBoxType: +this.mailserverForm.value.mailboxtype,
        emailSsl: this.mailserverForm.value.checkedSSL == true ? 1 : 0,
        checkInterval: +this.mailserverForm.value.mailboxtype == 1 ? 0 : +this.mailserverForm.value.interval
      }
      this.mailBoxService.updateMailSettings(mail).subscribe(response => {
        if (response.status === true) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.mailserverForm.value);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.log("Failed :: ", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR);
        this.loading = false;
      });
    }
    else {
      let mail: ICreateMailServer = {
        emailServerName: this.mailserverForm.value.serverName,
        emailFromId: this.mailserverForm.value.email,
        emailPassword: this.mailserverForm.value.password,
        serverIp: this.mailserverForm.value.serverip,
        serverPort: +this.mailserverForm.value.port,
        emailBoxType: +this.mailserverForm.value.mailboxtype,
        emailSsl: this.mailserverForm.value.checkedSSL == true ? 1 : 0,
        checkInterval: +this.mailserverForm.value.mailboxtype == 1 ? 0 : +this.mailserverForm.value.interval
      }
      console.log("JSON===>", JSON.stringify(mail));
      if (this.mailserverForm != null) {
        this.mailBoxService.createMailSettings(mail).subscribe((response: IResponse) => {
          if (response.status === true) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            this.dialogRef.close(this.mailserverForm.value);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        },
          error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.log("Failed :: ", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR);
            this.loading = false;
          });
      }
    }
  }
}

export function mailTemplateValidator(service: MailServerService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value != null ? service.validateServerNameTemplate((control.value as string).trim())
      .map(response => {
        console.log(response.status)
        return !response.status ? { invalid: true } : null
      }) : null;
  };
}