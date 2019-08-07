import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IDepartment, User, ISenderData, RecipientType, IEmailTosms, IEmailServerInfo, ApiResponse, SenderInfo } from '../_model/emailtosms.model';
import { flattenStyles } from '@angular/platform-browser/src/dom/dom_renderer';
import { AppConfig, ITokenInfo, IUserUpdateDto, userType, DomainName } from '../../../_helpers/app.config';
import { Router } from '@angular/router';
import { EmailtoSmsService } from '../_service/emailtosms.service';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-createemailtosms',
  templateUrl: './createemailtosms.component.html',
  styleUrls: ['./createemailtosms.component.scss']
})
export class CreateemailtosmsComponent implements OnInit {
  emailtoSmsForm: FormGroup;
  departmentList: IDepartment[] = [];
  usersList: User[] = [];
  senderList: ISenderData[] = [];
  tagFlag: boolean = false;
  loginInfo: IUserUpdateDto;
  _roleCode: string = "";
  showpopup: boolean = false;
  showPopUp: boolean = false;
  loading: boolean = false;
  createEmailToSmsData: IEmailTosms;
  mailServerList: IEmailServerInfo[] = [];
  recipientList: RecipientType[] = [];
  patternEmail =/^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/;
  // patternEmail = /^\w+([-_.]\w+)*@\w+(\w+).\w+(\w+)(, ?\w+([-+.']\w+)*@\w+(\w+).\w+(\w+))*$/;
  patternDomain = /^@\w+(\w+).\w+(\w+)(, ?@\w+(\w+).\w+(\w+))*$/;
  constructor(private fb: FormBuilder, private appconfig: AppConfig, private translate: TranslateService, private router: Router, private alertMessage: AlertMessageService,
    public dialogRef: MatDialogRef<CreateemailtosmsComponent>, @Inject(MAT_DIALOG_DATA) public _editemailToSmsdata: IEmailTosms, private emailtoSmsService: EmailtoSmsService) {
    let tokenInfo = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenInfo) {
      this.loginInfo = (tokenInfo.tokenInfo as any).sub ? JSON.parse((tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      console.log("rolename::::", this._roleCode);
    }
  }

  ngOnInit() {
    this.emailtoSmsForm = this.fb.group({
      name: [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      validateEmailToSmsName: [null, [Validators.required], [EmailToSmsValidator(this.emailtoSmsService)]],
      department: [null, Validators.required],
      user: [null, Validators.required],
      mailBox: [null, Validators.required],
      format: [null, Validators.required],
      senderId: [null, Validators.required],
      startTag: [null],
      endTag: [null],
      whitelistMail: [null, [Validators.required, Validators.pattern(this.patternEmail)]],
      whitelistType: [DomainName.Mail, Validators.required],
      tag: [false]
    });
    if (this._editemailToSmsdata != null) {
      this.emailtoSmsForm.patchValue({
        name: this._editemailToSmsdata.name,
        startTag: this._editemailToSmsdata.startTag,
        endTag: this._editemailToSmsdata.endTag,
        whitelistMail: this._editemailToSmsdata.domain,
        whitelistType: this._editemailToSmsdata.whitelistType + '',
        tag: this._editemailToSmsdata.startTag != null || this._editemailToSmsdata.endTag != null ? true : false
      });
      this.emailtoSmsForm.get('validateEmailToSmsName').clearAsyncValidators();
      this.emailtoSmsForm.get('validateEmailToSmsName').clearValidators();
      this.emailtoSmsForm.get('validateEmailToSmsName').updateValueAndValidity();
      if (this._editemailToSmsdata.startTag != null || this._editemailToSmsdata.endTag != null) {
        this.tagFlag = true;
        this.emailtoSmsForm.get('startTag').setValidators(Validators.required);
        this.emailtoSmsForm.get('startTag').updateValueAndValidity();
        this.emailtoSmsForm.get('endTag').setValidators(Validators.required);
        this.emailtoSmsForm.get('endTag').updateValueAndValidity();
      }
      this.domainChange(true);
    }
    console.log("edit email to sms Data::::", this._editemailToSmsdata);
    if (this._roleCode != userType.NormalUser) {
      this.getDepartments();
    }
    else {
      this.getSenders();
      this.emailtoSmsForm.get('department').setValue(this._editemailToSmsdata != null ? this._editemailToSmsdata.deptId : this.loginInfo.depts[0].deptId);
      this.emailtoSmsForm.get('user').setValue(this._editemailToSmsdata != null ? this._editemailToSmsdata.userId : this.loginInfo.userId);
    }
  }

  getDepartments() {
    this.loading = true;
    this.emailtoSmsService.getAllDepartmentsWithUsers(this._roleCode).subscribe((result: IDepartment[]) => {
      if (result.length > 0) {
        this.departmentList = result.filter(x => x.status == 1);
        console.log("this.departmentList::::", this.departmentList);
        console.log(userType.DepartementAdmin + "==" + this._roleCode)
        if (this._editemailToSmsdata != null) {
          if(this._roleCode==userType.DepartementAdmin)
          {
            this.emailtoSmsForm.get('department').setValue(this._editemailToSmsdata.deptId);
            let index = this.departmentList.findIndex(x => x.deptId == this._editemailToSmsdata.deptId);
            if (index != -1) {
              this.usersList = this.departmentList[index].users;
              let index1 = this.usersList.findIndex(x => x.userId == this._editemailToSmsdata.userId);
              if (index1 != -1) {
                this.emailtoSmsForm.get('user').setValue(this._editemailToSmsdata.userId);
              }
              else{
                this.showAlert(this.translate.instant('emailToSmsModule.userDeactive'), ActionType.ERROR);
              }
            }
            else{
              this.showAlert(this.translate.instant('emailToSmsModule.departmentDeactivated'), ActionType.ERROR);
            }
          }
          else
          {
            let index = this.departmentList.findIndex(x => x.deptId == this._editemailToSmsdata.deptId);
            if (index != -1) {
              this.emailtoSmsForm.get('department').setValue(this._editemailToSmsdata.deptId);
              this.usersList = this.departmentList[index].users;
              let index1 = this.usersList.findIndex(x => x.userId == this._editemailToSmsdata.userId);
              if (index1 != -1) {
                this.emailtoSmsForm.get('user').setValue(this._editemailToSmsdata.userId);
              }
              else{
                this.showAlert(this.translate.instant('emailToSmsModule.userDeactive'), ActionType.ERROR);
              }
            }
            else{
              this.showAlert(this.translate.instant('emailToSmsModule.departmentDeactivated'), ActionType.ERROR);
            }
          }
        }
        else
        {
          if(this._roleCode==userType.DepartementAdmin)
          {
            this.emailtoSmsForm.get('department').setValue(this.loginInfo.depts.length>0?this.loginInfo.depts[0].deptId:null);
            let index = this.departmentList.findIndex(x => x.deptId == (this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0));
            if (index != -1) {
              this.usersList = this.departmentList[index].users;
            }
          }
        }
      }
      this.getSenders();
    }, error => {
      this.departmentList = [];
      let message = error.error.message as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getDepartments==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getSenders() {
    this.emailtoSmsService.getAllActiveSenders().subscribe((result: ISenderData[]) => {
      if (result.length > 0) {
        this.senderList = result.filter(x => x.status == 1 && x.senderType != 2);
        console.log("senderList::::", this.senderList);
        if (this._editemailToSmsdata != null) {
          let index1 = this.senderList.findIndex(x => x.senderId == this._editemailToSmsdata.senderInfo.senderId);
          if (index1 != -1) {
            this.emailtoSmsForm.get('senderId').setValue(this._editemailToSmsdata.senderInfo.senderId);
          }
          else {
            this.showAlert(this.translate.instant('emailToSmsModule.senderDeactivated'), ActionType.ERROR);
          }
        }
      }
      this.getmailServer();
    }, error => {
      this.senderList = [];
      let message = error.error.message as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getSenders==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getmailServer() {
    this.emailtoSmsService.getEmailServer().subscribe((result: IEmailServerInfo[]) => {
      if (result) {
        this.mailServerList = result.filter(x => x.status == 1 && x.emailBoxType != 1);
        console.log("server list::::", this.mailServerList);
        if (this._editemailToSmsdata != null) {
          let index = this.mailServerList.findIndex(x => x.emailServerId == this._editemailToSmsdata.emailServer.emailServerId);
          if (index != -1) {
            this.emailtoSmsForm.get('mailBox').setValue(this._editemailToSmsdata.emailServer.emailServerId);
          }
          else {
            this.showAlert(this.translate.instant('emailToSmsModule.mailserverDeactivated'), ActionType.ERROR);
          }
        }
      }
      this.getRecipients();
    }, error => {
      this.mailServerList = [];
      let message = error.error.message as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getmailServer==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    })
  }

  getRecipients() {
    this.emailtoSmsService.getRecipientInfo().subscribe((result: RecipientType[]) => {
      if (result) {
        this.recipientList = result;
        if (this._editemailToSmsdata != null) {
          this.emailtoSmsForm.get('format').setValue(this._editemailToSmsdata.recipientType.recipientTypeId);
        }
      }
      else {
        this.recipientList = [];
        this.loading = false;
      }
      this.loading = false;
    }, error => {
      this.recipientList = [];
      let message = error.error.message as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getRecipients==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    })
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401) this.router.navigate(["401"]);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  departmentChange(action?: boolean) {
    console.log("department=>", this.emailtoSmsForm.value.department);
    this.emailtoSmsForm.get('user').setValue(null);
    this.usersList = [];
    if (this.emailtoSmsForm.value.department != null) {
      let index = this.departmentList.findIndex(x => x.deptId == this.emailtoSmsForm.value.department);
      if (index != -1) {
        this.usersList = this.departmentList[index].users;
        if (!action)
          this.emailtoSmsForm.get('user').setValue(this._editemailToSmsdata.userId);
      }
      console.log("userlist=>", this.usersList);
    }
  }

  domainChange(action?: boolean) {
    console.log("change");
    if (!action) {
      if (this.emailtoSmsForm.value.whitelistType == DomainName.Mail) {
        this.emailtoSmsForm.get("whitelistMail").setValue(null);
        this.emailtoSmsForm.get("whitelistMail").setValidators([Validators.required, Validators.pattern(this.patternEmail)]);
        this.emailtoSmsForm.get("whitelistMail").updateValueAndValidity();
      }
      else {
        this.emailtoSmsForm.get("whitelistMail").setValue(null);
        this.emailtoSmsForm.get("whitelistMail").setValidators([Validators.required, Validators.pattern(this.patternDomain)]);
        this.emailtoSmsForm.get("whitelistMail").updateValueAndValidity();
      }
    }
    else {
      if (this._editemailToSmsdata.whitelistType + '' == DomainName.Mail) {
        this.emailtoSmsForm.get("whitelistMail").setValidators([Validators.required, Validators.pattern(this.patternEmail)]);
        this.emailtoSmsForm.get("whitelistMail").updateValueAndValidity();
      }
      else {
        this.emailtoSmsForm.get("whitelistMail").setValidators([Validators.required, Validators.pattern(this.patternDomain)]);
        this.emailtoSmsForm.get("whitelistMail").updateValueAndValidity();
      }
    }
  }

  onMessageBodyTagSelection(tagValue) {
    this.emailtoSmsForm.get("startTag").setValue(null);
    this.emailtoSmsForm.get("endTag").setValue(null);
    if (tagValue == true) {
      this.tagFlag = true;
      this.emailtoSmsForm.get("startTag").setValidators([Validators.required]);
      this.emailtoSmsForm.get("startTag").updateValueAndValidity();
      this.emailtoSmsForm.get("endTag").setValidators([Validators.required]);
      this.emailtoSmsForm.get("endTag").updateValueAndValidity();
    }
    else {
      this.tagFlag = false;
      this.emailtoSmsForm.get("startTag").clearValidators();
      this.emailtoSmsForm.get("startTag").updateValueAndValidity();
      this.emailtoSmsForm.get("endTag").clearValidators();
      this.emailtoSmsForm.get("endTag").updateValueAndValidity();
    }
  }

  onSubmit() {
    this.loading = true;
    let senderInfo: SenderInfo = this.senderList.filter(x => x.senderId == this.emailtoSmsForm.value.senderId)[0];
    console.log("senderInfo::::", senderInfo, this.emailtoSmsForm.value.senderId);

    this.createEmailToSmsData = {
      deptId: this.emailtoSmsForm.value.department,
      domain: this.emailtoSmsForm.value.whitelistMail,
      emailServer: {
        emailServerId: this.emailtoSmsForm.value.mailBox,
        emailServerName: ""
      },
      endTag: this.emailtoSmsForm.value.endTag,
      name: this.emailtoSmsForm.value.name,
      recipientType: {
        recepientName: "",
        recipientTypeId: this.emailtoSmsForm.value.format
      },
      senderInfo: senderInfo,
      startTag: this.emailtoSmsForm.value.startTag,
      userId: this.emailtoSmsForm.value.user,
      whitelistType: this.emailtoSmsForm.value.whitelistType,
    }
    if (this._editemailToSmsdata != null) {
      this.createEmailToSmsData.email2smsId = this._editemailToSmsdata.email2smsId,
        this.createEmailToSmsData.status = this._editemailToSmsdata.status
      console.log("updateEmailtosms::::", JSON.stringify(this.createEmailToSmsData));
      this.emailtoSmsService.updateEmailToSms(this.createEmailToSmsData).subscribe((response: ApiResponse) => {
        console.log('response=>', response);
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.createEmailToSmsData);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.message as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-updateEmailtoSmS==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
    else {
      console.log("createEmailtosms::::", JSON.stringify(this.createEmailToSmsData));
      this.emailtoSmsService.createEmailToSms(this.createEmailToSmsData).subscribe((response: ApiResponse) => {
        console.log('response=>', response);
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(this.createEmailToSmsData);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        let message = error.error.message as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createEmailtoSmS==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
  }
}
export function EmailToSmsValidator(service: EmailtoSmsService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value != null ? service.validateEmailToSmsName((control.value as string).trim())
      .map(response => {
        console.log(response.status)
        return !response.status ? { invalid: true } : null
      }) : null;
  };
}
