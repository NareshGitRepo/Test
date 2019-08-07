import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors }
  from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ISmsTemplate, ApiResponse, ISmsUpdate } from '../_model/smstemplate.model';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SmsTemplateService } from '../_service/smstemplate.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-createsmstemplate',
  templateUrl: './createsmstemplate.component.html',
  styleUrls: ['./createsmstemplate.component.scss']
})

export class CreateSmsTemplateComponent implements OnInit {

  smstemplateFrom: FormGroup;
  smsModel: ISmsUpdate = {} as any;
  loading: boolean = false;
  _arabic = /[\u0621-\u064A]/;
  msgPlaceHolder: string = 'Message';
  charcount = 0;
  _unicode = /[^\u0000-\u007F]+/;
  format = /[~^\[\]{}|\\]/g;
  language: string;
  msgCount: number;
  engLength: number = 1848;
  arbLength: number = 804;
  msglength: number = this.engLength;
  oldmessage: string = '';
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CreateSmsTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public _editSmsdata: ISmsUpdate
    , private smsTemplateService: SmsTemplateService, private alertMessage: AlertMessageService, private router: Router,
    private translate: TranslateService) {
    console.log("edit data::::", this._editSmsdata);
  }

  ngOnInit() {
    this.smstemplateFrom = this.fb.group({
      templateName: [null, Validators.required],
      validateSmsTemplate: [null, [Validators.required], [SmsTemplateValidator(this.smsTemplateService)]],
      description: [null, Validators.required],
      templateType: [0, Validators.required],
      message: [null, Validators.required],
    });
    this.smstemplateFrom.controls.message.valueChanges.subscribe((smsText) => {
      this.messageCount(smsText);
    });
    if (this.smstemplateFrom.value.message != null)
      this.messageCount(this.smstemplateFrom.value.message);
    if (this._editSmsdata != null || this._editSmsdata != undefined) {
      this.smsModel = this._editSmsdata
      console.log("form data::::", this._editSmsdata);
      this.smstemplateFrom.patchValue({
        templateName: this._editSmsdata.templateName,
        description: this._editSmsdata.description,
        message: this._editSmsdata.message,
      });
      this.smstemplateFrom.get('templateType').setValue(this._editSmsdata.templateType);
      this.smstemplateFrom.get('validateSmsTemplate').clearValidators();
      this.smstemplateFrom.get('validateSmsTemplate').clearAsyncValidators();
      this.smstemplateFrom.get('validateSmsTemplate').updateValueAndValidity();
    }
  }

  messageCount(smsText) {
    console.log("form data::::", this._arabic.test(smsText));
    if (smsText) {
      if (!this._arabic.test(smsText)) {
        this.language = '0';
      } else {
        this.language = '8';
      }
      // this.msgPlaceHolder = this._arabic.test(smsText) ? 'Message (Arabic)' : (this._unicode.test(smsText) ? 'Message (Unicode)' : 'Message (English)');
      this.msgPlaceHolder = this._arabic.test(smsText) ? 'MessageArbic' : (this._unicode.test(smsText) ? 'MessageUnicode' : 'MessageEnglish');
      this.charcount = smsText.length;
      if (this._unicode.test(smsText)) {
        this.msgCount = Math.ceil((this.charcount > 70 ? this.charcount : 67) / 67);
        this.msglength = this.arbLength;
        if (this.charcount > this.arbLength)
          this.smstemplateFrom.get('message').setValue(this.smstemplateFrom.value.message);
      }
      else {
        let formCahr = smsText.match(this.format);
        this.charcount += formCahr == null ? 0 : formCahr.length;
        this.msgCount = Math.ceil((this.charcount > 160 ? this.charcount : 153) / 153);
        this.msglength = this.engLength - (formCahr == null ? 0 : formCahr.length);
        if (this.charcount > this.engLength)
          this.smstemplateFrom.get('message').setValue(this.smstemplateFrom.value.message);
      }
      if (this.msgCount > 12) {
        this.smstemplateFrom.get('message').setValue(this.oldmessage);
      } else
        this.oldmessage = smsText;
    }
    else {
      this.oldmessage = '';
      this.msgCount = 0;
      this.charcount = 0;
      this.msgPlaceHolder = 'Message';
    }
  }

  createSmsTemplate() {
    this.loading = true;
    if (!this._editSmsdata) {
      let templateData = {
        params: 'NA',
        templateName: this.smstemplateFrom.value.templateName as string,
        description: this.smstemplateFrom.value.description as string,
        templateType: this.smstemplateFrom.value.templateType as number,
        message: this.smstemplateFrom.value.message as string,
        language: this.language
      } as ISmsTemplate;
      console.log("CreateTemplate==>" + JSON.stringify(templateData));
      if (templateData) {
        this.smsTemplateService.validateSmsTemplateName((this.smstemplateFrom.value.templateName as string).trim()).subscribe((response: ApiResponse) => {
          this.smsTemplateService.createSmsTemplate(templateData).subscribe((response: ApiResponse) => {
            if (response) {
              this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
              this.dialogRef.close(templateData);
            } else {
              this.alertMessage.showAlert(response.message, ActionType.FAILED);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-createSmsTemplate==>", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
        });
      }
    }
    else {
      let templateUpdateData = {
        smsTemplateId: this._editSmsdata.smsTemplateId,
        params: 'NA',
        templateName: this.smstemplateFrom.value.templateName as string,
        description: this.smstemplateFrom.value.description as string,
        templateType: this.smstemplateFrom.value.templateType as number,
        message: this.smstemplateFrom.value.message as string,
        language: this.language
      } as ISmsUpdate;
      this.smsTemplateService.updateSmsTemplate(templateUpdateData).subscribe((response: ApiResponse) => {
        if (response) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(templateUpdateData);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createSmsTemplate==>", JSON.stringify(error));
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

export function SmsTemplateValidator(service: SmsTemplateService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value != null ? service.validateSmsTemplateName((control.value as string).trim())
      .map(response => {
        console.log(response.status)
        return !response.status ? { invalid: true } : null
      }) : null;
  };
}