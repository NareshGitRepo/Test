import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IGEmailCreate, ApiResponse, ISystemParam, IGEmailTemplate, emailHtmlType } from '../_model/emailtemplate.model';
import { Observable } from 'rxjs';
import { EmailTemplateService } from '../_service/emailtemplate.service';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createemailtemplate',
  templateUrl: './createemailtemplate.component.html',
  styleUrls: ['./createemailtemplate.component.scss']
})
export class CreateEmailTemplateComponent implements OnInit {

  @ViewChild('htmlContent') htmltype: ElementRef;
  @ViewChild('plainText') plaintype: ElementRef;
  emailTemplateForm: FormGroup;
  quillConfig: any;
  public editor;
  IEmaildata: IGEmailCreate;
  IUpdateEmaildata: IGEmailCreate;
  systemParamList: ISystemParam[] = [];
  emailEditModel: IGEmailCreate = {} as any;
  loading: boolean = false;
  msgmaxlength: number = 500;
  _arabic = /[\u0621-\u064A]/;
  _unicode = /[^\u0000-\u007F]+/;
  format = /[~^\[\]{}|\\]/g;
  constructor(private fb: FormBuilder, private elem: ElementRef, public dialogRef: MatDialogRef<CreateEmailTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public _editEmailTemplatedata: IGEmailTemplate, private service: EmailTemplateService,
    private translate: TranslateService, private router: Router, private alertMessage: AlertMessageService) {
    console.log("Edit==>", _editEmailTemplatedata);
  }

  ngOnInit() {
    this.getSystemParams();
    this.quillConfig = {
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          ['code-block'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'direction': 'rtl' }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['clean'],
        ],
      }
    }
    console.log("this.editor=>", this.editor);
    this.emailTemplateForm = this.fb.group({
      templateName: [null, [Validators.required]],
      validatetemplateName: [null, [Validators.required], [TemplateValidator(this.service)]],
      emailFormat: ['1'],
      htmlContent: [null, Validators.required],
      plainText: [null],
      emailTemplateId: [null]
    });
    if (this._editEmailTemplatedata != null || this._editEmailTemplatedata != undefined) {
      this.emailEditModel = this._editEmailTemplatedata;
      this.emailTemplateForm.patchValue({
        templateName: this._editEmailTemplatedata.templateName,
        emailFormat: this._editEmailTemplatedata.emailFormat + "",
        emailTemplateId: this._editEmailTemplatedata.emailTemplateId
      });
      if (this._editEmailTemplatedata.emailFormat == emailHtmlType.Html) {
        this.emailTemplateForm.get('htmlContent').setValue(this._editEmailTemplatedata.emailMessage);
        this.emailTemplateForm.get('htmlContent').setValidators(Validators.required);
        this.emailTemplateForm.get('plainText').clearValidators();
        this.emailTemplateForm.get('htmlContent').updateValueAndValidity();
      }
      else {
        this.emailTemplateForm.get('plainText').setValue(this._editEmailTemplatedata.emailMessage);
        this.emailTemplateForm.get('plainText').setValidators(Validators.required);
        this.emailTemplateForm.get('htmlContent').clearValidators();
        this.emailTemplateForm.get('plainText').updateValueAndValidity();
      }
      this.emailTemplateForm.get('validatetemplateName').clearValidators();
      this.emailTemplateForm.get('validatetemplateName').clearAsyncValidators();
      this.emailTemplateForm.get('validatetemplateName').updateValueAndValidity();
    }
  }
  // ngAfterViewInit() {
  //   let placeholderPickerItems = this.elem.nativeElement.querySelectorAll('.ql-placeholder .ql-picker-item');
  //   placeholderPickerItems.forEach(item => item.textContent = item.dataset.value);
  // }
  onEditorCreated(event) {
    console.log("onEditorCreated=>", event);
    this.editor = event;
  }
  onContentChange(event) {
    console.log("onContentChange=>", this.editor.container.innerHTML);
    if ((this.emailTemplateForm.value.htmlContent ? this.emailTemplateForm.value.htmlContent : '').length > this.msgmaxlength + 200) {
      event.editor.deleteText(this.msgmaxlength, event.editor.getLength());
    }
  }
  getSystemParams() {
    this.loading = true;
    this.service.getAllSystemParams().subscribe((response: ISystemParam[]) => {
      if (response) {
        console.log("systemParamList==>", response);
        this.systemParamList = response;
        console.log('systemParamList=>', this.systemParamList);
      }
      this.loading = false;
    }, error => {
      this.systemParamList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getSystemParams==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  htmlSelection() {
    if (this.emailTemplateForm.value.emailFormat == emailHtmlType.PlainText) {
      this.emailTemplateForm.get('plainText').setValidators(Validators.required);
      this.emailTemplateForm.get('htmlContent').setValue('');
      this.emailTemplateForm.get('htmlContent').clearValidators();
      this.emailTemplateForm.get('htmlContent').updateValueAndValidity();
      this.emailTemplateForm.get('plainText').updateValueAndValidity();
    } else {
      this.emailTemplateForm.get('htmlContent').setValidators(Validators.required);
      this.emailTemplateForm.get('plainText').setValue('');
      this.emailTemplateForm.get('plainText').clearValidators();
      this.emailTemplateForm.get('htmlContent').updateValueAndValidity();
      this.emailTemplateForm.get('plainText').updateValueAndValidity();
    }
  }
  createEmailTemplate() {
    this.loading = true;
    if (!this._editEmailTemplatedata) {
      this.IEmaildata = {
        templateName: this.emailTemplateForm.value.templateName.trim(),
        emailFormat: this.emailTemplateForm.value.emailFormat,
        emailMessage: this.emailTemplateForm.value.emailFormat == emailHtmlType.Html + '' ? this.emailTemplateForm.value.htmlContent : this.emailTemplateForm.value.plainText
      } as IGEmailCreate;
      console.log("CreateEmail==>", this.IEmaildata, this.emailTemplateForm.value.htmlContent, this.emailTemplateForm.value.plainText, this.emailTemplateForm.value.emailFormat);
      this.service.createEmailTemplate(this.IEmaildata).subscribe((response: ApiResponse) => {
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.IEmaildata);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createEmailTemplate==>", JSON.stringify(error));
        this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    } else {
      this.IUpdateEmaildata = {
        templateName: this.emailTemplateForm.value.templateName.trim(),
        emailFormat: this.emailTemplateForm.value.emailFormat,
        emailMessage: this.emailTemplateForm.value.emailFormat == emailHtmlType.Html + '' ? this.emailTemplateForm.value.htmlContent : this.emailTemplateForm.value.plainText,
        emailTemplateId: this._editEmailTemplatedata.emailTemplateId
      } as IGEmailCreate;
      this.service.updateEmailTemplate(this.IUpdateEmaildata).subscribe((response: ApiResponse) => {
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.IUpdateEmaildata);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createEmailTemplate==>", JSON.stringify(error));
        this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
  }
  htmlDragContent(event: any) {
    let value = event.dragData;
    let vv = '<$' + value + '$>';
    console.log("onContentChange=>1", this.editor.getLength(), this.editor.getLength() + vv.length);
    if (this.editor.getLength() + vv.length < this.msgmaxlength + 200) {
      const cursorPosition = (this.editor.getSelection()) ? this.editor.getSelection().index : 0;
      this.editor.clipboard.dangerouslyPasteHTML(cursorPosition, vv);
      this.emailTemplateForm.get('htmlContent').setValue(this.editor.root.innerHTML);
    }
    else {
      this.showAlert(this.translate.instant('emailTemplateModule.create.maxLengthError'), ActionType.FAILED);
    }
  }
  PlainDragContent(event: any) {
    let custommessage1 = this.plaintype.nativeElement.value.trim();
    console.log('element==>', custommessage1);
    console.log('event==>', this.editor);
    let value = event.dragData;
    let customText = '<$' + value + '$>';
    if ((custommessage1 + customText).length < this.msgmaxlength) {
      let element = this.plaintype.nativeElement;
      let startPos = element.selectionStart;
      let endPos = element.selectionEnd;
      element.value = element.value.substring(0, startPos) + customText + element.value.substring(endPos, element.value.length);
      this.emailTemplateForm.get('plainText').setValue(element.value);
      this.plaintype.nativeElement.focus();
      element.setSelectionRange(endPos + customText.length, endPos + customText.length);
    }
    else {
      this.showAlert(this.translate.instant('emailTemplateModule.create.maxLengthError'), ActionType.FAILED);
    }
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  removeSection(i) {
    console.log("remove==>", i);
  }
}
export function TemplateValidator(service: EmailTemplateService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value != null ? service.validateTemplateName((control.value as string).trim())
      .map(response => {
        console.log(response.status)
        return !response.status ? { invalid: true } : null
      }) : null;
  };
}