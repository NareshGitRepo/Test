import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn, AbstractControl, ValidationErrors, ValidatorFn, FormArray, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IAlertDetail, ISenderList, ApiResponse, IPlatformAlert, IupdateColumnData } from '../_model/setnotification.model';
import { SetNotificationService } from '../_service/setnotification.service';
import { Observable } from 'rxjs';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { id } from '@swimlane/ngx-charts/release/utils';

@Component({
  selector: 'app-createnotification',
  templateUrl: './createnotification.component.html',
  styleUrls: ['./createnotification.component.scss']
})
export class CreatenotificationComponent implements OnInit {
  _updateDetails: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  msgCount: number;
  msgCount1: number;
  engLength: number = 1848;
  arbLength: number = 804;
  msglength: number = this.engLength;
  charcount = 0;
  charcount1 = 0;
  msgPlaceHolder: string = 'Message';
  oldmessage: string = '';
  _arabic = /[\u0621-\u064A]/;
  _unicode = /[^\u0000-\u007F]+/;
  format = /[~^\[\]{}|\\]/g;
  createObj: IPlatformAlert;
  senderslist: ISenderList[] = [];
  patternEmail = /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/;
  alertslist: IupdateColumnData[] = [];
  loading: boolean = false;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<CreatenotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public _editnotifydata: IPlatformAlert, private translate: TranslateService,
    private service: SetNotificationService, private cdRef: ChangeDetectorRef, private router: Router, private alertMessage: AlertMessageService) {
    console.log("_editnotifydata==>", _editnotifydata);
  }

  ngOnInit() {
    this.firstFormGroup = this.fb.group({
      notificationName: [null],
      validatePlatformAlertName: [this._editnotifydata != null ? this._editnotifydata.alertsName : null, [Validators.required],[AlertNameValidator(this.service)]],
      Channels: [null, Validators.required],
      smsFlag: [false],
      emailFlag: [false],
      senderList: [null],
      days: [null, Validators.required],
      smstext: [null, Validators.required],
      creditsbelow: [null, Validators.required],
      credittext: [null, Validators.required]
    });
    this._updateDetails = this.fb.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.pattern(this.patternEmail)]],
      phone: [null, Validators.required],
    });
    this.secondFormGroup = this.fb.group({
      updateDetails: this._updateDetails,
      tableData: [null, Validators.required]
    });

    if (this._editnotifydata) {
      this.firstFormGroup.get('validatePlatformAlertName').clearAsyncValidators();
      this.firstFormGroup.get('validatePlatformAlertName').clearValidators();
      this.firstFormGroup.get('validatePlatformAlertName').updateValueAndValidity();
      this.firstFormGroup.patchValue({
        notificationName: this._editnotifydata.alertsName,
        emailFlag: (this._editnotifydata.channels == '2' || this._editnotifydata.channels == "3") ? true : false,
        smsFlag: (this._editnotifydata.channels == "1" || this._editnotifydata.channels == "3") ? true : false,
        Channels: this._editnotifydata.channels,
        days: this._editnotifydata.expiringInDays,
        smstext: this._editnotifydata.expiringMessage,
        creditsbelow: this._editnotifydata.creditsBelow,
        credittext: this._editnotifydata.creditsMessage
      });
      this.addTableData(false);
    }
    this.firstFormGroup.controls.smstext.valueChanges.subscribe((smsText) => {
      this.messageCount(smsText);
    });
    this.firstFormGroup.controls.credittext.valueChanges.subscribe((credittext) => {
      this.messageCount1(credittext);
    });
    if (this.firstFormGroup.value.smstext != null) {
      this.messageCount(this.firstFormGroup.value.smstext);
    }
    if (this.firstFormGroup.value.credittext != null) {
      this.messageCount1(this.firstFormGroup.value.credittext);
    }
    this.getSenders();
  }

  smsChannelSelection() {
    if (this.firstFormGroup.value.smsFlag == true && this.firstFormGroup.value.emailFlag == true) {
      this.firstFormGroup.get('senderList').setValidators([Validators.required]);
      this.firstFormGroup.get('senderList').updateValueAndValidity();
      this.firstFormGroup.get('Channels').setValue('3');
    }
    else if (this.firstFormGroup.value.emailFlag == true && this.firstFormGroup.value.smsFlag == false) {
      this.firstFormGroup.get('senderList').setValue(null);
      this.firstFormGroup.get('senderList').clearValidators();
      this.firstFormGroup.get('senderList').updateValueAndValidity();
      this.firstFormGroup.get('Channels').setValue('2');
    }
    else if (this.firstFormGroup.value.emailFlag == false && this.firstFormGroup.value.smsFlag == true) {
      this.firstFormGroup.get('senderList').setValidators([Validators.required]);
      this.firstFormGroup.get('senderList').updateValueAndValidity();
      this.firstFormGroup.get('Channels').setValue('1');
    }
    else {
      this.firstFormGroup.get('Channels').setValue(null);
    }
  }
  messageCount(smsText) {
    if (smsText) {
      this.msgPlaceHolder = this._arabic.test(smsText) ? 'MessageArbic' : (this._unicode.test(smsText) ? 'MessageUnicode' : 'MessageEnglish');
      this.charcount = smsText.length;
      if (this._unicode.test(smsText)) {
        this.msgCount = Math.ceil((this.charcount > 70 ? this.charcount : 67) / 67);
        this.msglength = this.arbLength;
        if (this.charcount > this.arbLength)
          this.firstFormGroup.get('smstext').setValue(this.firstFormGroup.value.smstext);
      }
      else {
        let formCahr = smsText.match(this.format);
        this.charcount += formCahr == null ? 0 : formCahr.length;
        this.msgCount = Math.ceil((this.charcount > 160 ? this.charcount : 153) / 153);
        this.msglength = this.engLength - (formCahr == null ? 0 : formCahr.length);
        if (this.charcount > this.engLength)
          this.firstFormGroup.get('smstext').setValue(this.firstFormGroup.value.smstext);
      }
      if (this.msgCount > 12) {
        this.firstFormGroup.get('smstext').setValue(this.oldmessage);
      }
      else
        this.oldmessage = smsText;
    }
    else {
      this.oldmessage = '';
      this.msgCount = 0;
      this.charcount = 0;
      this.msgPlaceHolder = 'Message';
    }
    this.cdRef.detectChanges();
  }
  messageCount1(creditText) {
    if (creditText) {
      this.msgPlaceHolder = this._arabic.test(creditText) ? 'MessageArbic' : (this._unicode.test(creditText) ? 'MessageUnicode' : 'MessageEnglish');
      this.charcount1 = creditText.length;
      if (this._unicode.test(creditText)) {
        this.msgCount1 = Math.ceil((this.charcount1 > 70 ? this.charcount1 : 67) / 67);
        this.msglength = this.arbLength;
        if (this.charcount1 > this.arbLength)
          this.firstFormGroup.get('credittext').setValue(this.firstFormGroup.value.credittext);
      }
      else {
        let formCahr = creditText.match(this.format);
        this.charcount1 += formCahr == null ? 0 : formCahr.length;
        this.msgCount1 = Math.ceil((this.charcount1 > 160 ? this.charcount1 : 153) / 153);
        this.msglength = this.engLength - (formCahr == null ? 0 : formCahr.length);
        if (this.charcount1 > this.engLength)
          this.firstFormGroup.get('credittext').setValue(this.firstFormGroup.value.credittext);
      }
      if (this.msgCount1 > 12) {
        this.firstFormGroup.get('credittext').setValue(this.oldmessage);
      }
      else
        this.oldmessage = creditText;
    }
    else {
      this.oldmessage = '';
      this.msgCount1 = 0;
      this.charcount1 = 0;
      this.msgPlaceHolder = 'Message';
    }
    this.cdRef.detectChanges();
  }
  addTableData(action?: boolean) {
    
    if (action) { 
      let id = this.alertslist.length > 0 ? this.alertslist[this.alertslist.length - 1].id : 0 
      let canAdd: number=0;
      this.alertslist.forEach(obj => {
        if (obj.name != this._updateDetails.value.name && obj.emailId != this._updateDetails.value.email && obj.mobileNo != this._updateDetails.value.phone) {
          canAdd++;
        }
        else {
          // canAdd = false;
          this.showAlert(this.translate.instant('CreditManagementModule.setNotification.create.duplicateData'), ActionType.ERROR)
        }
      });
      console.log(canAdd,this.alertslist.length);
      
      if (canAdd==this.alertslist.length || this.alertslist.length == 0) {
        console.log(id);
        this.alertslist.push({ id:id+ 1, name: this._updateDetails.value.name, emailId: this._updateDetails.value.email, mobileNo: this._updateDetails.value.phone });
        this._updateDetails.get('name').setValue(null);
        this._updateDetails.get('email').setValue(null);
        this._updateDetails.get('phone').setValue(null);
        this.secondFormGroup.get('tableData').setValue(this.alertslist);
      }
    }
    else {
      console.log("this.alertslist==>",this.alertslist);
      let id=0;
      this._editnotifydata.alertDetails.forEach(x => {
        this.alertslist.push({ id: id++, name: x.name, mobileNo: x.mobileNo, emailId: x.emailId })
      });
      this._updateDetails.get('name').setValue(null);
      this._updateDetails.get('email').setValue(null);
      this._updateDetails.get('phone').setValue(null);
      this.secondFormGroup.get('tableData').setValue(this.alertslist);
    }
    console.log("this.alertslist==>",this.alertslist);
    
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  deleteTableData(alertslist: IupdateColumnData) {
    console.log("alertslist",alertslist);
    let index: number = this.alertslist.findIndex(x => x.id == alertslist.id);
    if (index !== -1) {
      this.alertslist.splice(index, 1);
    }
    if (this.alertslist.length == 0) {
      this.secondFormGroup.get('tableData').setValue(null)
    }
  }
  getSenders() {
    this.loading = true;
    this.service.getAllActiveSenders().subscribe((result: ISenderList[]) => {
      if (result) {
        console.log("data", result);
        this.senderslist = result.filter(x => x.status == 1 && x.senderType != 2);
        console.log('senderslist=>', this.senderslist);
        if (this._editnotifydata) {
          if (this._editnotifydata.channels == "1" || this._editnotifydata.channels == "1,2") {
            let index = this.senderslist.findIndex(x => x.senderId == this._editnotifydata.senderId);
            if (index != -1)
              this.firstFormGroup.get('senderList').setValue(this._editnotifydata.senderId);
            else {
              this.firstFormGroup.get('senderList').setValue(null);
              this.showAlert(this.translate.instant('CreditManagementModule.setNotification.create.deactivateSender'), ActionType.ALERT);
            }
          }
        }
      }
      this.loading = false;
    }, error => {
      this.senderslist = [];
      this.loading = false;
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getSenders==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
    });
  }

  createnotification() {
    this.loading = true;
    let alertsRefData: any[] = [];
    this.alertslist.forEach(x => {
      alertsRefData.push({ name: x.name, emailId: x.emailId, mobileNo: x.mobileNo } as IAlertDetail)
    });
    this.createObj = {
      alertsName: this.firstFormGroup.value.notificationName,
      alertDetails: alertsRefData,
      channels: this.firstFormGroup.value.Channels,
      creditsBelow: this.firstFormGroup.value.creditsbelow,
      creditsMessage: this.firstFormGroup.value.credittext,
      expiringInDays: this.firstFormGroup.value.days,
      expiringMessage: this.firstFormGroup.value.smstext,
      senderId: this.firstFormGroup.value.senderList,
    }
    if (!this._editnotifydata) {
      console.log("submitted Data:::", JSON.stringify(this.createObj));
      this.service.validatePlatformAlertName((this.firstFormGroup.value.notificationName as string).trim() ).subscribe((result:ApiResponse)=>{
        if(result.status){
        this.service.createPlatformAlert(this.createObj).subscribe((response: ApiResponse) => {
        console.log("response=>", response);
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(response.status);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        this.loading = false;
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-createPlatformAlert==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
      });
    }
    // else{
    //   this.loading=false;
    //   this.alertMessage.showAlert(result.message, ActionType.FAILED);
    // }
    });
  
    }
    else {
      this.createObj.platformAlertsId = this._editnotifydata.platformAlertsId;
      this.createObj.status = this._editnotifydata.status;
      console.log("submitted Data:::", JSON.stringify(this.createObj));
      this.service.updatePlatformAlert(this.createObj).subscribe((response: ApiResponse) => {
        console.log("response=>", response);
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(response.status);
        } else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        }
        this.loading = false;
      }, error => {
        this.loading = false;
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-updatePlatformAlert==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
      });
    }
  }
}

export function AlertNameValidator(service: SetNotificationService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    console.log(control.value);
    return control.value != null ? service.validatePlatformAlertName((control.value as string).trim())
      .map(response => {
        console.log(response.status)
        return !response.status ? { invalid: true } : null
      }) : null;
  };
}
