import { ActionType, AlertMessageService } from "../../../_services/AlertMessageService";
import { AppConfig, ITokenInfo, IUserUpdateDto } from "../../../_helpers/app.config";
import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { IAlertDataModel, IAlertRes, IService, IntervalType, Isender } from "../_model/offlineModel";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

import { OfflineService } from "../_service/offlineservice";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

type AOA = Array<Array<any>>;

@Component({
  selector: "app-createalert",
  templateUrl: "./createofflinealert.component.html",
  styleUrls: ["./createofflinealert.component.scss"]
})
export class CreatealertComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  loading: boolean = false;
  _roleCode: string = "";
  senderdata: Isender[] = [];
  columnsList = [];
  msgPlaceHolder: string = "Message";
  _smsCompose: FormGroup;
  _arabic = /[\u0621-\u064A]/;
  _unicode = /[^\u0000-\u007F]+/;
  format = /[~^\[\]{}|\\]/g;
  msgCount: number;
  engLength: number = 1848;
  arbLength: number = 804;
  msglength: number = this.engLength;
  charcount = 0;
  oldmessage: string = "";
  serviceList: IService[] = [];
  columnsInvalid: boolean = false;
  _senderName: string = "";
  _serviceCode: string = "";
  loginInfo: IUserUpdateDto;
  intervalTypeList: IntervalType[] = [];
  alertNameValid: boolean = false;
  offlineAlertDataModel: IAlertDataModel = {} as IAlertDataModel;
  deptId: number;
  Time: number[] = [];
  showDelimiter: boolean = false;
  showpopup: boolean = false;

  @ViewChild("message") type: ElementRef;

  constructor(
    private _fb: FormBuilder,
    private _service: OfflineService,
    private dialogRef: MatDialogRef<CreatealertComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IAlertDataModel,
    private alertMessage: AlertMessageService,
    private router: Router,
    private appConfig: AppConfig,
    private cdRef: ChangeDetectorRef,private translate : TranslateService
  ) {
    let tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenInfo) {
      this.loginInfo = (tokenInfo.tokenInfo as any).sub
        ? (JSON.parse((tokenInfo.tokenInfo as any).sub) as IUserUpdateDto)
        : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      console.log("data=>", data);
      this.deptId =
        this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0;
    }
  }

  ngOnInit() {
    this.firstFormGroup = this._fb.group({
      offlineAlertName: ["", Validators.compose([Validators.required])],
      filepath: ["", Validators.compose([Validators.required])],
      movePath: ["", Validators.compose([Validators.required])],
      filetype: ["", Validators.compose([Validators.required])],
      filePattern: ["", Validators.compose([Validators.required, Validators.maxLength(25)])],
      header: ["", Validators.compose([Validators.required, Validators.minLength(1)])],
      mobileColumn: ["", Validators.compose([Validators.required])],
      delimiter: [null]
    });
    this.secondFormGroup = this._fb.group({
      senderId: ["", Validators.required],
      messageType: [false],
      customfield: [null],
      message: ["", Validators.compose([Validators.required])],
      interval: ["", Validators.required],
      intervalTime: [null, Validators.required],
      esecond: [null],
      eminutes: [null],
      ehours: [null],
      serviceId: ["", Validators.required]
    });

    this.secondFormGroup.controls.message.valueChanges.subscribe(smsText => {
      this.messageCount(smsText);
    });
    this.secondFormGroup.controls.senderId.valueChanges.subscribe(senderId => {
      if (senderId != null) {
        let index = this.senderdata.findIndex(x => x.senderId == senderId);
        //console.log("senderId=>",senderId,index,this.senderdata);
        if (index != -1) this._senderName = this.senderdata[index].senderName;
        else this._senderName = "";
      } else this._senderName = "";
    });
    this.secondFormGroup.controls.serviceId.valueChanges.subscribe(templateId => {
      if (templateId != null) {
        let index = this.serviceList.findIndex(x => x.templateId == templateId);
        //console.log("senderId=>",senderId,index,this.senderdata);
        if (index != -1) this._serviceCode = this.serviceList[index].serviceCode;
        else this._serviceCode = "";
      } else this._serviceCode = "";
    });
    this.firstFormGroup.controls.filetype.valueChanges.subscribe(type => {
      if (type == 'csv' || type == 'txt') {
        this.showDelimiter = true;
        this.firstFormGroup.get('delimiter').setValidators(Validators.required);
        this.firstFormGroup.get('delimiter').updateValueAndValidity();

      } else {
        this.showDelimiter = false;
        this.firstFormGroup.get('delimiter').setValue(null);
        this.firstFormGroup.get('delimiter').clearValidators();
        this.firstFormGroup.get('delimiter').updateValueAndValidity();
      }
    });


    this.getsenders();

    console.log("Data :  ", this.data);



  }

  getsenders() {
    this.loading = true;
    this._service.getsenders().subscribe((result: Isender[]) => {
      console.log("result=>", result);
      if (result) {
        if (result.length > 0) {
          this.senderdata = result.filter(x => x.status == 1 && x.senderType != 2);
          console.log("this.senderdata::::", this.senderdata);

        }
      }
      this.getIntervalType();
    },
      error => {
        this.senderdata = [];
        let message = error.error.messages as string;
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse'): message ? message : error.message;
        console.error("E-getsenders==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      }
    );
  }
  getIntervalType() {
    this._service.getIntervalType().subscribe((result: IntervalType[]) => {
      console.log("result=>", result);
      if (result)
        if (result.length > 0) {
          this.intervalTypeList = result;
        }
      this.getAllServiceInfo();
    },
      error => {
        let message = error.error.messages as string;
        let errorMessage = error.status == 404 ?this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getIntervalType==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      }
    );
  }
  getAllServiceInfo() {
    this.loading = true;
    this._service.getAllServiceInfo().subscribe(
      (result: IService[]) => {
        console.log("result=>", result);
        if (result)
          if (result.length > 0) {
            this.serviceList = result;
            if (this.data != null) {

              this.firstFormGroup.patchValue(this.data);
              this.secondFormGroup.patchValue(this.data);

              this.splitColumns();

              this.secondFormGroup.get("interval").setValue(this.data.intervalType.intervalTypeId);
              if (this.data.intervalType.intervalTypeId == 1)
                this.secondFormGroup.get("esecond").setValue(this.data.intervalValue);
              else if (this.data.intervalType.intervalTypeId == 2)
                this.secondFormGroup.get("eminutes").setValue(this.data.intervalValue);
              else if (this.data.intervalType.intervalTypeId == 3)
                this.secondFormGroup.get("ehours").setValue(this.data.intervalValue);

              let index1 = this.senderdata.findIndex(x => x.senderId == '' + this.data.senderId);
              if (index1 != -1) {
                this.secondFormGroup.get('senderId').setValue(this.data.senderId);
              }
              else {
                this.showAlert(this.translate.instant('OfflineAlertManager.createOfflineAlert.senderAlert'), ActionType.ERROR);
              }


              this.secondFormGroup.get("serviceId").setValue(this.data.serviceId);
              this.scheduletime(false);

            } else {
              this.secondFormGroup.get("serviceId").setValue(this.serviceList[0].templateId);
              this.secondFormGroup.get('senderId').setValue(this.senderdata.length > 0 ? this.senderdata[0].senderId : null);
            }
          }
        this.loading = false;
      },
      error => {
        let message = error.error.messages as string;
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getAllServiceInfo==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      }
    );
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401) this.router.navigate(["401"]);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  messageCount(smsText) {
    if (smsText) {
      this.msgPlaceHolder = this._arabic.test(smsText) ? 'MessageArbic': this._unicode.test(smsText) ? 'MessageUnicode' : 'MessageEnglish';
      this.charcount = smsText.length;
      if (this._unicode.test(smsText)) {
        this.msgCount = Math.ceil(
          (this.charcount > 70 ? this.charcount : 67) / 67
        );
        this.msglength = this.arbLength;
        if (this.charcount > this.arbLength)
          this.secondFormGroup.get("message").setValue(this.secondFormGroup.value.message);
      } else {
        let formCahr = smsText.match(this.format);
        this.charcount += formCahr == null ? 0 : formCahr.length;
        this.msgCount = Math.ceil(
          (this.charcount > 160 ? this.charcount : 153) / 153
        );
        this.msglength =
          this.engLength - (formCahr == null ? 0 : formCahr.length);
        if (this.charcount > this.engLength)
          this.secondFormGroup.get("message").setValue(this.secondFormGroup.value.message);
      }
      if (this.msgCount > 12) {
        this.secondFormGroup.get("message").setValue(this.oldmessage);
      } else this.oldmessage = smsText;
    } else {
      this.oldmessage = "";
      this.msgCount = 0;
      this.charcount = 0;
      this.msgPlaceHolder = "Message";
    }
    this.cdRef.detectChanges();

  }

  addCustomField(): void {
    let oldMessage = this.type.nativeElement.value.trim();
    let element = this.type.nativeElement;
    this.type.nativeElement.focus();
    console.log("oldMessage::" + oldMessage);
    let startPos = element.selectionStart;
    let endPos = element.selectionEnd;
    let ddlText = " <$" + this.secondFormGroup.get('customfield').value + "$> ";
    let msg = oldMessage.substring(0, startPos) + ddlText + oldMessage.substring(endPos, element.value.length);
    this.secondFormGroup.get('message').setValue(msg);
    element.setSelectionRange(endPos + ddlText.length, endPos + ddlText.length);
    console.log("Mesage1::::::::" + this.secondFormGroup.get('message').value);
    this.cdRef.detectChanges();
  }

  customMessage(value) {
    if (value == false) {
      // this.secondFormGroup.get("customfield").clearValidators();
      this.secondFormGroup.get("customfield").setValue(null);
      // this.secondFormGroup.get("customfield").updateValueAndValidity();
    }
  }

  splitColumns() {

    if (this.firstFormGroup.value.header.length != 0) {
      if (this.firstFormGroup.value.header[this.firstFormGroup.value.header.length - 1] == ',') {
        this.columnsInvalid = true;
        this.columnsList = [];
        this.firstFormGroup.get('mobileColumn').setValue(null);
      } else {
        this.columnsInvalid = false;
        let selectcolumnlist = this.firstFormGroup.value.header.split(",");
        console.log("selectcolumnlist : ", selectcolumnlist);
        this.columnsList = selectcolumnlist;
        console.log('columnsList.length ', this.columnsList.length);
        console.log("value=>", this.firstFormGroup.value.header, this.columnsInvalid);
        if (this.data != null)
          this.firstFormGroup.get('mobileColumn').setValue(this.data.mobileColumn);
      }
    } else {
      this.columnsInvalid = true;
      this.columnsList = [];
      this.firstFormGroup.get('mobileColumn').setValue(null);
    }
  }

  scheduletime(action?: boolean) {
    if (this.secondFormGroup.value.interval == 1 || this.secondFormGroup.value.interval == 2) {
      this.Time = [];
      for (var i = 1; i < 60; i++) {
        this.Time.push(i);
      }
    }
    if (this.secondFormGroup.value.interval == 3) {
      this.Time = [];
      for (var i = 1; i < 24; i++) {
        this.Time.push(i);
      }
    }
    if (!action)
      this.secondFormGroup.get('intervalTime').setValue(+this.data.intervalValue);
    else
      this.secondFormGroup.get('intervalTime').setValue(null);
  }


  validateAlertName() {
    let alertName = this.firstFormGroup.value.offlineAlertName;
    console.log('alertName ', alertName);
    if (alertName != '') {
      this._service.validateAlertName(alertName).subscribe((result: IAlertRes) => {
        console.log("result=>", result);
        if (result.status) this.alertNameValid = true;
        else this.alertNameValid = false;
      },
        error => {
          let message = error.error.messages as string;
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-validateAlertName==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        }
      );
    }
  }

  submit() {
    this.loading = true;
    let index = this.intervalTypeList.findIndex(x => x.intervalTypeId == this.secondFormGroup.value.interval);
    let intervalName = "";
    if (index != -1) intervalName = this.intervalTypeList[index].intervalName;
    this.offlineAlertDataModel.offlineAlertName = this.firstFormGroup.value.offlineAlertName;
    this.offlineAlertDataModel.deptId = this.deptId;
    this.offlineAlertDataModel.filepath = this.firstFormGroup.value.filepath;
    this.offlineAlertDataModel.movePath = this.firstFormGroup.value.movePath;
    this.offlineAlertDataModel.filetype = this.firstFormGroup.value.filetype;
    this.offlineAlertDataModel.filePattern = this.firstFormGroup.value.filePattern;
    this.offlineAlertDataModel.header = this.firstFormGroup.value.header;
    this.offlineAlertDataModel.mobileColumn = this.firstFormGroup.value.mobileColumn;
    if (this.showDelimiter)
      this.offlineAlertDataModel.delimiter = this.firstFormGroup.value.delimiter;
    else
      this.offlineAlertDataModel.delimiter = "";
    this.offlineAlertDataModel.senderId = parseInt(this.secondFormGroup.value.senderId);
    this.offlineAlertDataModel.messageType = this.secondFormGroup.value.messageType ? 1 : 0;
    this.offlineAlertDataModel.message = this.secondFormGroup.value.message;
    this.offlineAlertDataModel.intervalType = {
      intervalTypeId: this.secondFormGroup.value.interval,
      intervalName: intervalName
    };
    this.offlineAlertDataModel.intervalValue = this.secondFormGroup.value.intervalTime;
    this.offlineAlertDataModel.serviceId = parseInt(this.secondFormGroup.value.serviceId);
    console.log("offlineAlertDataModel : ", JSON.stringify(this.offlineAlertDataModel));
    if (this.data == null) {
      this._service.createOfflineAlert(this.offlineAlertDataModel).subscribe((response: IAlertRes) => {
        console.log("response=>", response);
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
          this.dialogRef.close(response.status);
        } else
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
        this.loading = false;
      },
        error => {
          let message = error.error.messages as string;
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-submit==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        }
      );
    } else {
      this.offlineAlertDataModel.alertOfflineId = this.data.alertOfflineId;
      console.log(
        "In edit, offlineAlertDataModel ::  ",
        JSON.stringify(this.offlineAlertDataModel)
      );
      this._service.updateOfflineAlert(this.offlineAlertDataModel).subscribe(
        (response: IAlertRes) => {
          console.log("response=>", response);
          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            this.dialogRef.close(response.status);
          } else
            this.alertMessage.showAlert(response.message, ActionType.FAILED);

          this.loading = false;
        },
        error => {
          let message = error.error.messages as string;
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-submit==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        });
    }
  }
}
