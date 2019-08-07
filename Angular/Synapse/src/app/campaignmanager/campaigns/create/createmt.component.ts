import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Papa } from 'ngx-papaparse';
import { DatePipe } from '@angular/common';
import * as XLSX from 'xlsx';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { ReadMode } from 'ngx-file-helpers';
import * as _ from 'lodash';
import { userType, IUserUpdateDto, ITokenInfo, AppConfig } from '../../../_helpers/app.config';
import { CampaignService } from '../_service/campaignService';
import {
  Isender, IGlobalGroups, IDeptGroup, IGroupUser, ICampaignDataModel, ICampaignInfo,
  IResponse, Sheet, ECampInputType, ISmsTemplate, Idate
} from '../_model/campaignModel';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ConfirmDeleteComponent } from '../delete/confirmdelete.component';

type AOA = Array<Array<any>>;

@Component({
  selector: 'app-createmt',
  templateUrl: './createmt.component.html',
  styleUrls: ['./createmt.component.scss']
})
export class CreatemtComponent implements OnInit, OnDestroy {
  regexStr = new RegExp(/^([a-zA-Z0-9 _-]+)$/);
  userType: userType;
  senderdata: Isender[];
  globalGroups: IGlobalGroups[] = [];
  deptGroup: IDeptGroup[] = [];
  groupUser: IGroupUser[] = [];
  _selectedFile: File;
  totaldir: string[] = ['Global'];
  selglobal: boolean = false;
  seldept: boolean = false;
  seluser: boolean = false;
  loading: boolean = false;
  _roleCode: string = '';
  loginInfo: IUserUpdateDto;
  excelSheetData: Sheet[] = [];
  _excelSheetNames: string[] = [];
  _count: number = 0;
  replacedColumnData: any;
  _countValue: number;
  //* formgroup area
  _inputData: FormGroup;
  _campData: FormGroup;
  _sms: FormGroup;
  _camaDetails: FormGroup;
  _senderName: string = '';
  oldmessage: string = '';
  showpopup: boolean = false;
  //SMSCOMPOSE AREA

  msgCount: number;
  engLength: number = 1848;
  arbLength: number = 804;
  msglength: number = this.engLength;
  charcount = 0;
  msgPlaceHolder: string = 'Message';
  _smsCompose: FormGroup;
  _arabic = /[\u0621-\u064A]/;
  _unicode = /[^\u0000-\u007F]+/;
  format = /[~^\[\]{}|\\]/g;
  @ViewChild('message') type: ElementRef;
  SmsTemplatesList: ISmsTemplate[] = [];
  globalGroup: string = '';
  globalDepts: string = '';
  globalUser: string = '';
  campaignDataModel: ICampaignDataModel = {} as ICampaignDataModel;
  campaignInfo: ICampaignInfo = {} as ICampaignInfo;
  currentTimesubscription: any;
  today = new Date();
  public readMode = ReadMode.dataURL;
  myTimeout: any;
  todayTimeCheck: boolean = true;
  promotionalMinDate = new Date();;
  minitcounter: number = 0;
  sTime: number = 915;
  eTime: number = 2115;
  myFilter = (d: Date): boolean => {
    let cminite = d.getMinutes() + '';
    let ctime = +(d.getHours() + (cminite.length == 1 ? '0' + cminite : cminite));
    return window["tran"] ? true : (ctime >= this.sTime && ctime <= this.eTime);
  }
  constructor(private _formBuilder: FormBuilder, private translate: TranslateService,
    private papa: Papa, private router: Router, private appConfig: AppConfig,
    private campaignService: CampaignService,
    public datePipe: DatePipe, public dialog: MatDialog,
    private alertMessage: AlertMessageService, private dialogRef: MatDialogRef<CreatemtComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICampaignDataModel,
    private cdRef: ChangeDetectorRef) {

    let tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenInfo) {
      this.loading = true;            console.log('window["tran"]',window["tran"])
      window["tran"] = false;   
      this.loginInfo = (tokenInfo.tokenInfo as any).sub ? JSON.parse((tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      this.sTime = +(window["startTime"]).replace(':', '');
      this.eTime = +(window["endTime"]).replace(':', '');
      console.log('data=>', data, this.sTime, this.eTime);

      if (this.data != null) {    console.log('this.data',this.data)
        if (this.data.status == 2) {
          this.minitcounter = data.timeDiff;
          if (this.minitcounter <= 0) {
            this.alertMessage.showAlert(this.translate.instant('campaigns.create.campError'), ActionType.SUCCESS)
            this.dialogRef.close(true);
          }
          this.myTimeout = Observable.interval(60000).subscribe(data => {
            this.minitcounter--;
            if (this.minitcounter <= 0) {
              this.alertMessage.showAlert(this.translate.instant('campaigns.create.campError'), ActionType.SUCCESS)
              this.dialogRef.close(true);
            }
            console.log("minitcounter=>", this.minitcounter);

          });
        }
      }
      this.campaignService.getCurrentDate().subscribe((result: Idate) => {
        console.log("current Date==>", result);

        if (result) {
          this.today = new Date((result.dateTime).replace(/\s/g, "T"));
          this.today.setSeconds(0);
          this.today.setMilliseconds(0);    console.log('this.today.getMinutes()',this.today.getMinutes())
          this.today.setMinutes(this.today.getMinutes() + 2);        console.log('this.today.getMinutes()+2',this.today.getMinutes()+2)
          this.promotionalMinDate = new Date((result.dateTime).replace(/\s/g, "T"));
          this.promotionalMinDate.setSeconds(0);
          this.promotionalMinDate.setMilliseconds(0);
          this.promotionalMinDate.setMinutes(this.promotionalMinDate.getMinutes() + 2);
          let promotionaltime = +(result.hours + result.minutes);    console.log('promotionaltime',promotionaltime)
          promotionaltime = promotionaltime + 2;      console.log('promotionaltime',promotionaltime,'this.sTime',this.sTime)
          if (promotionaltime < this.sTime) {
            this.promotionalMinDate.setHours(window["startTime"].split(':')[0]);
            this.promotionalMinDate.setMinutes(window["startTime"].split(':')[1]);
            console.log("newminDate==>", this.promotionalMinDate);
          }
          else if (promotionaltime > this.eTime) {                  console.log('promotionaltime',promotionaltime,'this.eTime')
            this.promotionalMinDate.setDate(this.promotionalMinDate.getDate() + 1);
            this.promotionalMinDate.setHours(window["startTime"].split(':')[0]);
            this.promotionalMinDate.setMinutes(window["startTime"].split(':')[1]);
            console.log("newminDate==>", this.promotionalMinDate);
          }
          console.log("resultdate=>", result, this.today);
          this.currentTimesubscription = Observable.interval(60000).subscribe(x => {
            this.today.setMinutes(this.today.getMinutes() + 1);
            this.promotionalMinDate.setMinutes(this.promotionalMinDate.getMinutes() + 1);
            console.log("resultdate1=>", this.today, this.promotionalMinDate);
          });
        }
      }, error => {
        this.loading = false;
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getsenders==>", JSON.stringify(errorMessage));
        this.today = new Date();
        this.today.setSeconds(0);
        this.today.setMilliseconds(0);               console.log('this.today.getMinutes()',this.today.getMinutes())
        this.today.setMinutes(this.today.getMinutes() + 2);           console.log('this.today.getMinutes()+2',this.today.getMinutes()+2)
        this.promotionalMinDate = new Date();  
        this.promotionalMinDate.setSeconds(0);                       console.log('this.promotionalMinDate',this.promotionalMinDate)
        this.promotionalMinDate.setMilliseconds(0);               
        let promotionaltime = +(this.promotionalMinDate.getHours() + this.promotionalMinDate.getMinutes());
        promotionaltime = promotionaltime + 2;         console.log('promotionaltime',promotionaltime,'this.sTime',this.sTime)
        if (promotionaltime < this.sTime) {   
          this.promotionalMinDate.setHours(window["startTime"].split(':')[0]);
          this.promotionalMinDate.setMinutes(window["startTime"].split(':')[1]);
          console.log("newminDate==>", this.promotionalMinDate);

        }
        else if (promotionaltime > this.eTime) {
          this.promotionalMinDate.setDate(this.promotionalMinDate.getDate() + 1);
          this.promotionalMinDate.setHours(window["startTime"].split(':')[0]);
          this.promotionalMinDate.setMinutes(window["startTime"].split(':')[1]);
          console.log("newminDate==>", this.promotionalMinDate);
        }
        this.currentTimesubscription = Observable.interval(60000).subscribe(x => {
          this.today.setMinutes(this.today.getMinutes() + 1);

          console.log("resultdate=>", this.today);
        });
      });

    }
    else {
      this.router.navigate(['401']);
    }

  }   //constructor

  ngOnInit() {
    this.getSmsTemplate();
    
    this._campData = this._formBuilder.group({
      campName: [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      validatecampName: [null, [Validators.required], [CampaignValidator(this.campaignService)]],
      campType: ['0', Validators.required],
      inputData: this._inputData,
    });

    this._inputData = this._formBuilder.group({
      inputType: [null, Validators.required],
      groupTypes: [null],
      globalgroupId: [null],
      deptgroupId: [null],
      usergroupId: [null],
      mobileColumn: [null],
      filename: [null],
      fileType: [null],
      selectSheet: [null],
      columns: [[]],
      isHeader: [true],
    });

    this._camaDetails = this._formBuilder.group({
      campMode: ['0'],
      priority: ['11'],
      scheduletype: ['0'],
      campSchedule: [null]
    });

    this._sms = this._formBuilder.group({
      selectcolumnlist: [[]],
      msgtxt: [null, Validators.required],
      customfield: [null],
      usetemplate: [false],
      seltemplate: [null],
      senderId: [null, Validators.required]
    });
    this._sms.controls.msgtxt.valueChanges.subscribe((smsText) => {
      this.messageCount(smsText);
    });
    this._sms.controls.senderId.valueChanges.subscribe((senderId) => {


      if (senderId != null) {
        let index = this.senderdata.findIndex(x => x.senderId == senderId);
        //console.log("senderId=>",senderId,index,this.senderdata);
        if (index != -1)
          this._senderName = this.senderdata[index].senderName;
        else
          this._senderName = '';
      }
      else
        this._senderName = '';
    });
    if (this.data != null) {
      //this.getsenders();//

      this._inputData.get('inputType').setValue(this.data.sourceType + '');
      this._campData.get('campName').setValue(this.data.campName);
      this._campData.get('campType').setValue(this.data.campType + '');

      this._campData.get('validatecampName').clearValidators();
      this._campData.get('validatecampName').clearAsyncValidators();
      this._campData.get('validatecampName').updateValueAndValidity();

      if (this.data.sourceType == 2) {
        this._count = this._countValue = this.data.campaignInfo.validcount;
        let groupTypes: string[] = [];
        if (this.data.campaignInfo.globalGroups != '' && this.data.campaignInfo.globalGroups != null) {
          groupTypes.push('Global');

        }
        if (this.data.campaignInfo.deptGroups != '' && this.data.campaignInfo.deptGroups != null)
          groupTypes.push('Departments');
        if (this.data.campaignInfo.userGroups != '' && this.data.campaignInfo.userGroups != null)
          groupTypes.push('Users');

        if (groupTypes.length > 0) {
          this._inputData.get('groupTypes').setValue(groupTypes);
          this._inputData.get('groupTypes').setValidators(Validators.required);
          this.getsenders(groupTypes)
        } else {
          this.getsenders()
        }
      }
      else {
        if(this.data.campaignInfo.customMessage !=null && this.data.campaignInfo.customMessage!='')
        this.replacedColumnData=JSON.parse(this.data.campaignInfo.customMessage);
        this._countValue = this.data.campaignInfo.validcount;
        this._count = this.data.campaignInfo.header == 1 ? this._countValue + 1 : this._countValue;
        this._inputData.get('isHeader').setValue(true);
        let colmuns = this.data.campaignInfo.headerColumn != null ? this.data.campaignInfo.headerColumn.split('#') : [];
        this._inputData.patchValue({
          groupTypes: null,
          globalgroupId: null,
          deptgroupId: null,
          usergroupId: null,
          mobileColumn: this.data.campaignInfo.mobilenoColumn,
          filename: this.data.campaignInfo.filename,
          fileType: this.data.campaignInfo.fileType,
          selectSheet: (this.data.campaignInfo.fileType == "xlsx" || this.data.campaignInfo.fileType == "xls") ? this.data.campaignInfo.sheetname : null,
          columns: colmuns,
          isHeader: true,
        });

        this._inputData.get('filename').setValidators(Validators.required);
        this._inputData.get('fileType').setValidators(Validators.required);
        if (this.data.campaignInfo.fileType == "xlsx" || this.data.campaignInfo.fileType == "xls") {
          this._excelSheetNames.push(this.data.campaignInfo.sheetname);
          this._inputData.get('selectSheet').setValidators(Validators.required);
        }
        let str = [];
        if (this.data.campaignInfo.header == 1) {
          this._sms.get('selectcolumnlist').setValue(colmuns);
        }
        else {
          _.times(colmuns.length, function (e) { str.push('C' + e) });
          this._sms.get('selectcolumnlist').setValue(colmuns.length == 1 ? ['C0'] : str);
        }
        this.getsenders()
      }
      this._sms.get('msgtxt').setValue(this.data.message);
      this.messageCount(this.data.message);
      this._camaDetails.get('campMode').setValue(this.data.campMode + '');
      if (this.data.campMode == 1) {

        this.todayTimeCheck = false;
        window["tran"] = true;
      }
      this._camaDetails.get('priority').setValue(this.data.priority + '');
      this._camaDetails.get('scheduletype').setValue(this.data.scheduleType + '');
      if (this.data.scheduleType != 0)
        this._camaDetails.get('campSchedule').setValue(this.data.campStartTime != null && this.data.campStartTime != '' ? new Date(this.data.campStartTime.replace(' ', 'T')) : null);
      this._camaDetails.get('campSchedule').setValidators(Validators.required);
      console.log("_camaDetails=>", this._camaDetails);

    }
    else
      this.getsenders();

  } //ngoninit

  onCampaignTypeSelection() {
    console.log("onCampaignTypeSelection==>");

    if (this._camaDetails.value.campMode == '0') {
      if (this._camaDetails.value.campSchedule) {
        let selectDate = (this._camaDetails.value.campSchedule) as Date;
        let selectTime = +(selectDate.getHours() + '' + selectDate.getMinutes());
        if (selectTime < this.sTime || selectTime > this.eTime)
          this._camaDetails.get('campSchedule').setValue(null);
      }
      window["tran"] = false;
      this.todayTimeCheck = true;
    }
    else {
      window["tran"] = true;
      this.todayTimeCheck = false;
    }
  }

  getsenders(groupTypes?: string[]) {
    this.loading = true;
    this.campaignService.getsenders().subscribe((result: Isender[]) => {
      console.log("result=>", result);
      if (result)
        if (result.length > 0) {
          this.senderdata = result.filter(x => x.status == 1 && x.senderType != 2);
          console.log("this.senderdata:::", this.senderdata);

          if (this.data != null) {
            this._sms.get('senderId').setValue(this.data.senderId + '');
          }
          else {
            this._sms.get('senderId').setValue(this.senderdata.length > 0 ? this.senderdata[0].senderId + '' : null);
          }
        }
      this.getAllGroupsWithContactsGlobal(groupTypes);
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getsenders==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;

      });
  }

  getAllGroupsWithContactsGlobal(groupTypes?: string[]) {
    this.loading = true;
    this.campaignService.getAllGroupsWithContactsGlobal().subscribe((result: IGlobalGroups[]) => {
      console.log("result=>", result);
      if (result)
        if (result.length > 0) {
          this.globalGroups = result.filter(x => x.contactGlobals.length > 0);
          if (groupTypes) {
            let index = groupTypes.findIndex(x => x == 'Global');
            if (index != -1) {
              this.selglobal = true;
              let groupids = this.data.campaignInfo.globalGroups.split(',');
              this._inputData.get('globalgroupId').setValue(groupids);
              this._inputData.get('globalgroupId').setValidators(Validators.required);
              this.globalGroup = '';
              let findex = this.globalGroups.findIndex(y => y.cntGroupId == +groupids[0]);
              if (findex != -1) {
                this.globalGroup = this.globalGroups[findex].cntGroupName;
              }
            }
          }
        }
      if (userType.DepartementAdmin == this._roleCode || userType.NormalUser == this._roleCode)
        this.getGroupsWithContactsByDeptId(groupTypes)
      else
        this.loading = false;
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getAllGroupsWithContactsGlobal==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;

      });
  }
  getGroupsWithContactsByDeptId(groupTypes?: string[]) {
    this.totaldir.push('Departments');
    this.loading = true;
    this.campaignService.getGroupsWithContactsByDeptId().subscribe((result: IDeptGroup[]) => {
      console.log("result=>", result);
      if (result)
        if (result.length > 0) {
          this.deptGroup = result.filter(x => x.contactDepts.length > 0);
          if (groupTypes) {
            let index = groupTypes.findIndex(x => x == 'Departments');
            if (index != -1) {
              this.seldept = true;
              let groupids = this.data.campaignInfo.deptGroups.split(',');
              this._inputData.get('deptgroupId').setValue(groupids);
              this._inputData.get('deptgroupId').setValidators(Validators.required);
              this.globalDepts = '';
              let findex = this.deptGroup.findIndex(y => y.deptId == +groupids[0]);
              if (findex != -1) {
                this.globalDepts = this.deptGroup[findex].groupName;
              }
            }
          }
        }
      if (userType.NormalUser == this._roleCode)
        this.getGroupsWithContactsUser(groupTypes)
      else
        this.loading = false;
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getGroupsWithContactsByDeptId==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;

      });
  }
  getGroupsWithContactsUser(groupTypes?: string[]) {
    this.totaldir.push('Users');
    this.loading = true;
    this.campaignService.getGroupsWithContactsUser().subscribe((result: IGroupUser[]) => {
      console.log("result=>", result);
      if (result)
        if (result.length > 0) {
          this.groupUser = result.filter(x => x.contactUsers.length > 0);;
          if (groupTypes) {
            let index = groupTypes.findIndex(x => x == 'Users');
            if (index != -1) {
              this.seluser = true;
              let groupids = this.data.campaignInfo.userGroups.split(',');
              this._inputData.get('usergroupId').setValue(groupids);
              this._inputData.get('usergroupId').setValidators(Validators.required);
              this.globalUser = '';
              let findex = this.groupUser.findIndex(y => y.groupUserId == +groupids[0]);
              if (findex != -1) {
                this.globalUser = this.groupUser[findex].groupName;
              }
            }
          }
        }

      this.loading = false;
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getGroupsWithContactsUser==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;

      });
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  
  getSmsTemplate() {
    this.campaignService.getSmsTemplates().subscribe((result: ISmsTemplate[]) => {
      console.log('sms template result',result)
      if (result) {
        this.SmsTemplatesList = result.filter(x => x.status == 1);
        console.log("this.SmsTemplatesList==>", this.SmsTemplatesList);
      }
    },
      error => {
        this.loading = false;
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getSmsTemplates==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR);
      });
  }

  messageCount(smsText) {
    if (smsText) {
      this.msgPlaceHolder = this._arabic.test(smsText) ? 'MessageArbic' : (this._unicode.test(smsText) ? 'MessageUnicode' : 'MessageEnglish');

      this.charcount = smsText.length;
      if (this._unicode.test(smsText)) {
        this.msgCount = Math.ceil((this.charcount > 70 ? this.charcount : 67) / 67);
        this.msglength = this.arbLength;
        if (this.charcount > this.arbLength)
          this._sms.get('msgtxt').setValue(this._sms.value.msgtxt);
      }
      else {
        let formCahr = smsText.match(this.format);
        this.charcount += formCahr == null ? 0 : formCahr.length;
        this.msgCount = Math.ceil((this.charcount > 160 ? this.charcount : 153) / 153);
        this.msglength = this.engLength - (formCahr == null ? 0 : formCahr.length);
        if (this.charcount > this.engLength)
          this._sms.get('msgtxt').setValue(this._sms.value.msgtxt);
      }
      if (this.msgCount > 12) {
        this._sms.get('msgtxt').setValue(this.oldmessage);
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
  addCustomField(): void {
    let oldMessage = this.type.nativeElement.value.trim();
    let element = this.type.nativeElement;
    this.type.nativeElement.focus();
    console.log("oldMessage::" + oldMessage);
    let startPos = element.selectionStart;
    let endPos = element.selectionEnd;
    let ddlText = " <$" + this._sms.get('customfield').value + "$> ";
    let msg = oldMessage.substring(0, startPos) + ddlText + oldMessage.substring(endPos, element.value.length);
    this._sms.get('msgtxt').setValue(msg);
    element.setSelectionRange(endPos + ddlText.length, endPos + ddlText.length);
    console.log("Mesage1::::::::" + this._sms.get('msgtxt').value);
    this.cdRef.detectChanges();
  }


  onFileUpload(event) {
    console.log("inputData=>", this._inputData.value.inputType);
    console.log('event',event)
    if (event.target) {
      this._inputData.get('selectSheet').setValue(null);
      this._sms.get('customfield').setValue(null);
      this.excelSheetData = [] as Sheet[];
      let countNumber: number;
      this._countValue = countNumber;
      const fileList: FileList = event.target.files;
      console.log("frmData=>1", event.target.files);
      if (fileList.length > 0) {
        const file: File = fileList[0];
        let extension = (file.name as string).split('.').pop();

        if (extension == "xlsx" || extension == "xls" || extension == "txt" || extension == "csv") {
          let replaceobj:any;
          this.replacedColumnData = replaceobj;
          this._inputData.get('fileType').setValue(extension);
          this._inputData.get('mobileColumn').setValue(null);
          this._inputData.get('filename').setValue(file.name);
          if (extension == "xlsx" || extension == "xls") {
            this._inputData.get('selectSheet').setValue(null);
            this._inputData.get('selectSheet').setValidators(Validators.required);
            this._selectedFile = fileList[0];
            const target: DataTransfer = <DataTransfer>(event.target);
            const reader: FileReader = new FileReader();
            reader.onload = (e: any) => {
              const arrayBuffer = e.target.result,
                data = new Uint8Array(arrayBuffer),
                arr = new Array();
              for (let i = 0; i !== data.length; ++i) {
                arr[i] = String.fromCharCode(data[i]);
              }
              /* read workbook */
              const bstr: string = arr.join('');
              const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
              this._excelSheetNames = [];
              this.excelSheetData = [];
              wb.SheetNames.forEach(element => {
                this._excelSheetNames.push(element);
                let wsname: string = element;
                let ws: XLSX.WorkSheet = wb.Sheets[wsname];
                let data1 = (<AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 })));
                this.excelSheetData.push({ value: data1, viewValue: wsname });
              });
              if (this._excelSheetNames.length == 1) {
                this._inputData.get('selectSheet').setValue(this._excelSheetNames[0])
                if (this.excelSheetData) {
                  let columndata = this.excelSheetData.filter(x => x.viewValue == this._excelSheetNames[0])[0].value;
                  this._count = columndata.length;
                  if ((this._count > 1 && this._inputData.value.isHeader) || (this._count > 0 && !this._inputData.value.isHeader)) {
                    let keysData = this._count > 0 ? columndata[0] : [];
                    this._inputData.get('columns').setValue(keysData.filter(x => (x + '').trim() != ''));
                    let columnsCount: number = keysData.length;

                    if (this._inputData.value.isHeader == true) {
                      let index1 = keysData.findIndex(x => x == null);
                      if (index1 != -1) {
                        this._countValue = 0;
                        this._sms.get('selectcolumnlist').setValue(null);
                        this._inputData.get('mobileColumn').setValue(null);
                        this.showAlert(this.translate.instant('campaigns.create.emptyColumnsError'), ActionType.ERROR);
                      }
                      else {
                        let index = keysData.findIndex(x => x.length > 15);
                        this._countValue = this._count ? this._count - 1 : 0;
                        if (index != -1) {
                          this._countValue = 0;
                          this._sms.get('selectcolumnlist').setValue(null);
                          this._inputData.get('mobileColumn').setValue(null);
                          this.showAlert(this.translate.instant('campaigns.create.mobileHeadeRestriction'), ActionType.ERROR);
                        }
                        else if (keysData.length > 15) {
                          this._countValue = 0;
                          this._sms.get('selectcolumnlist').setValue(null);
                          this._inputData.get('mobileColumn').setValue(null);
                          this.showAlert(this.translate.instant('campaigns.create.fileHeaderError'), ActionType.ERROR);
                        }
                        else {
                          let colmdatas = keysData.filter(x => this.regexStr.test(x));
                          if (colmdatas.length == 0) {
                            this._sms.get('selectcolumnlist').setValue(null);
                            this._inputData.get('mobileColumn').setValue(null);
                            this.showAlert(this.translate.instant('campaigns.create.headerColumnsError'), ActionType.ERROR);
                            this._countValue = 0;
                          }
                          else {
                            this._inputData.get('mobileColumn').setValue(columnsCount == 1 ? keysData[0] : null);
                            this._sms.get('selectcolumnlist').setValue(colmdatas);
                            if(columndata.length>1)
                            {
                              this.replacedColumnData=_.zipObject(columndata[0], columndata[1]);
                            }
                            console.log("columndata=>", this.replacedColumnData,columndata);
                          }
                        }
                      }
                    }
                    else {
                      this._countValue = this._count;
                      let str = [];
                      _.times(columnsCount, function (e) { str.push('C' + e) });
                      this._sms.get('selectcolumnlist').setValue(columnsCount == 1 ? ['C0'] : str);
                      this._inputData.get('mobileColumn').setValue(columnsCount == 1 ? 'C0' : null);
                    }
                  }
                  else {
                    this.restInput();
                    this._inputData.get('columns').setValue([]);
                  }
                }
                else
                  this.alertMessage.showAlert(this.translate.instant('campaigns.create.fileError'), ActionType.FAILED);
              }
              else {
                this._sms.get('selectcolumnlist').setValue([]);
                this._inputData.get('mobileColumn').setValue([]);
              }
              console.log("excelSheetData=>", this.excelSheetData)
              // this._extension = extension;
              this._inputData.get('fileType').setValue(extension);
            };
            reader.readAsArrayBuffer(target.files[0]);
          }
          else if (extension == "txt" || extension == "csv") {
            this._inputData.get('selectSheet').setValue(null);
            this._inputData.get('selectSheet').clearValidators();
            this._inputData.get('selectSheet').updateValueAndValidity();
            this._selectedFile = fileList[0];

            this.papa.parse(file, {
              delimiter: ',', header: false, newline: '\r\n',
              beforeFirstChunk: (chunk: string) => {
                return chunk
              },
              complete: (results) => {
                console.log("results=>", results);

                if (results.data.length > 0) {
                  let _fileText = results.data;
                  console.log("columns=>", _fileText[0].filter(x => (x + '').trim() != ''));
                  this._count = _fileText.length
                  let keysData = _fileText[0];
                  let columnsCount: number = this._inputData.value.isHeader ? keysData.length - 1 : keysData.length;
                  this._inputData.get('columns').setValue(keysData);
                  this._inputData.get('mobileColumn').setValue(null)
                  if (this._inputData.value.isHeader) {
                    this._countValue = this._count ? this._count - 1 : 0;
                    let index1 = keysData.findIndex(x => x == null);
                    if (index1 != -1) {
                      this._sms.get('selectcolumnlist').setValue(null);
                      this._inputData.get('mobileColumn').setValue(null);
                      this.showAlert(this.translate.instant('campaigns.create.emptyColumnsError'), ActionType.ERROR);
                    }
                    else {
                      let index = keysData.findIndex(x => x.length > 15);
                      if (index != -1) {
                        this._countValue = 0;
                        this._sms.get('selectcolumnlist').setValue(null);
                        this._inputData.get('mobileColumn').setValue(null);
                        this.showAlert(this.translate.instant('campaigns.create.mobileHeadeRestriction'), ActionType.ERROR);
                      }
                      else if (keysData.length > 15) {
                        this._countValue = 0;
                        this._sms.get('selectcolumnlist').setValue(null);
                        this._inputData.get('mobileColumn').setValue(null);
                        this.showAlert(this.translate.instant('campaigns.create.fileHeaderError'), ActionType.ERROR);
                      }
                      else {
                        let colmdatas = keysData.filter(x => this.regexStr.test(x));
                        if (colmdatas.length == 0) {
                          this._countValue = 0;
                          this._sms.get('selectcolumnlist').setValue(null);
                          this._inputData.get('mobileColumn').setValue(null);
                          this.showAlert(this.translate.instant('campaigns.create.headerColumnsError'), ActionType.ERROR);
                        } else {
                          this._inputData.get('mobileColumn').setValue(columnsCount == 1 ? keysData[0] : null);
                          this._sms.get('selectcolumnlist').setValue(colmdatas);
                          if(_fileText.length>1)
                          {
                            this.replacedColumnData=_.zipObject(_fileText[0], _fileText[1]);
                          }
                        }
                      }
                    }
                  }
                  else {
                    let str = [];
                    _.times(columnsCount, function (e) { str.push('C' + e) });
                    this._countValue = this._count;
                    this._sms.get('selectcolumnlist').setValue(columnsCount == 1 ? ['C0'] : str);
                    this._inputData.get('mobileColumn').setValue(columnsCount == 1 ? 'C0' : null);
                  }
                }
                else {
                  this._count = 0;
                  this.restInput();
                  this._inputData.get('columns').setValue([]);
                }
              }
            });
          }

          this._inputData.get('inputType').setValue(ECampInputType.File);
          this._inputData.updateValueAndValidity();
        }
        else {
          this.alertMessage.showAlert(this.translate.instant('campaigns.create.acceptFiles'), ActionType.FAILED);
          this._inputData.get('fileType').setValue(null);
        }
        console.log("inputType", this._inputData.value.inputType);
      }
      event.srcElement.value = null;
    }

  }
  // FileUpload(event, action) {
  //   let fileList1: FileList;
  //   this.fileList1 = fileList1;
  //   if (event.target) {
  //     this.fileList1 = event.target.files;
  //     console.log("frmData=>1", event.target.files, this.fileList1[0], event);
  //   }
  //   // event.srcElement.value = null;
  // }
  next() {
    console.log("inputType", this._inputData, this._campData);
  }
  isHeadersPresent(id: number) {
    console.log("Columnns=>", this._inputData.value.columns);

    let headerCheck = this._inputData.value.isHeader;
    let keysData = this._inputData.value.columns != null ? this._inputData.value.columns : [];
    let columnsCount: number = keysData.length;
    if (this._inputData.value.fileType == 'xlsx' || this._inputData.value.fileType == 'xls') {
      let sheetname = this._inputData.value.selectSheet;
      console.log('read file =>', sheetname, this._inputData);
      if (sheetname && sheetname != null) {
        if ((this._count > 0 && !headerCheck) || (this._count > 1 && headerCheck)) {

          if (headerCheck) {
            this._countValue = this._count > 0 ? this._count - 1 : 0;
            let index = keysData.findIndex(x => x.length > 15);
            if (index != -1) {
              this._countValue = 0;
              this._sms.get('selectcolumnlist').setValue(null);
              this._inputData.get('mobileColumn').setValue(null);
              this.showAlert(this.translate.instant('campaigns.create.headerLength10'), ActionType.ERROR);
            }
            else {
              this._sms.get('selectcolumnlist').setValue(keysData);
              if (id == 2) this._inputData.get('mobileColumn').setValue(columnsCount == 1 ? keysData[0] : null);
            }
          }
          else {
            if (id == 2) this._inputData.get('mobileColumn').setValue(columnsCount == 1 ? 'C0' : null);
            this._countValue = this._count;
            let str = [];
            _.times(columnsCount, function (e) { str.push('C' + e) });
            this._sms.get('selectcolumnlist').setValue(columnsCount == 1 ? ['C0'] : str);
          }
        }
        else
          this.restInput();
      }
    }
    else if (this._inputData.value.fileType == 'txt' || this._inputData.value.fileType == 'csv') {
      if ((this._count > 0 && !headerCheck) || (this._count > 1 && headerCheck)) {
        if (headerCheck) {
          this._countValue = this._count > 0 ? this._count - 1 : 0;
          let index = keysData.findIndex(x => x.length > 10);
          if (index != -1) {
            this._sms.get('selectcolumnlist').setValue(null);
            this._inputData.get('mobileColumn').setValue(null);
            this.showAlert(this.translate.instant('campaigns.create.headerLength10'), ActionType.ERROR);
          }
          else {
            this._sms.get('selectcolumnlist').setValue(keysData);
            if (id == 2)
              this._inputData.get('mobileColumn').setValue(columnsCount == 1 ? keysData[0] : null);
          }
        }
        else {
          this._countValue = this._count;
          if (id == 2)
            this._inputData.get('mobileColumn').setValue(columnsCount == 1 ? 'C0' : null);
          this._countValue = this._count;
          let str = [];
          _.times(columnsCount, function (e) { str.push('C' + e) });
          this._sms.get('selectcolumnlist').setValue(columnsCount == 1 ? ['C0'] : str);
        }
      }
      else
        this.restInput();
    }

  }
  restInput() {
    this._countValue = 0;
    this._sms.get('selectcolumnlist').setValue([]);
    // this._inputData.get('mobileColumn').setValue(null);
  }
  selectSheet(event) {
    let headerCheck = this._inputData.value.isHeader;
    let replaceobj:any;
    this.replacedColumnData=replaceobj;
    if (this.excelSheetData) {
      let columndata = this.excelSheetData.filter(x => x.viewValue == event.value)[0].value;
      this._count = columndata.length;
      if ((this._count > 0 && !headerCheck) || (this._count > 1 && headerCheck)) {
        let keysData = this._count > 0 ? columndata[0] : [];
        this._inputData.get('columns').setValue(keysData.filter(x => (x + '').trim() != ''));
        let columnsCount: number = keysData.length;

        if (this._inputData.value.isHeader == true) {
          let index1 = keysData.findIndex(x => x == null);
          if (index1 != -1) {
            this._countValue = 0;
            this._sms.get('selectcolumnlist').setValue(null);
            this._inputData.get('mobileColumn').setValue(null);
            this.showAlert(this.translate.instant('campaigns.create.emptyColumnsError'), ActionType.ERROR);
          }
          else {
            this._countValue = this._count ? this._count - 1 : 0;
            let index = keysData.findIndex(x => x.length > 15);
            if (index != -1) {
              this._countValue = 0;
              this._sms.get('selectcolumnlist').setValue(null);
              this._inputData.get('mobileColumn').setValue(null);
              this.showAlert(this.translate.instant('campaigns.create.mobileHeadeRestriction'), ActionType.ERROR);
            }
            else if (keysData.length > 15) {
              this._countValue = 0;
              this._sms.get('selectcolumnlist').setValue(null);
              this._inputData.get('mobileColumn').setValue(null);
              this.showAlert(this.translate.instant('campaigns.create.fileHeaderError'), ActionType.ERROR);
            }
            else {
              let colmdatas = keysData.filter(x => this.regexStr.test(x));
              if (colmdatas.length == 0) {
                this._sms.get('selectcolumnlist').setValue(null);
                this._inputData.get('mobileColumn').setValue(null);
                this.showAlert(this.translate.instant('campaigns.create.headerColumnsError'), ActionType.ERROR);
                this._countValue = 0;
              }
              else {
                this._inputData.get('mobileColumn').setValue(columnsCount == 1 ? keysData[0] : null)
                this._sms.get('selectcolumnlist').setValue(colmdatas);
                if(columndata.length>1)
                {
                  this.replacedColumnData=_.zipObject(columndata[0], columndata[1]);
                  console.log("replacedColumnData=>",this.replacedColumnData,columndata[0], columndata[1]);
                  
                }
              }

            }
          }
        }
        else {
          this._countValue = this._count;
          let str = [];
          _.times(columnsCount, function (e) { str.push('C' + e) });
          this._sms.get('selectcolumnlist').setValue(columnsCount == 1 ? ['C0'] : str);
          this._inputData.get('mobileColumn').setValue(columnsCount == 1 ? 'C0' : null);
        }
      }
      else {
        this.restInput();
        this._inputData.get('columns').setValue([]);
      }
    }
  }
  necxtclick() {
    console.log("necxtclick=>", this._inputData);
  }
  validationMethod(value) {
    console.log("validationMethod=>", value);

    let s: number;
    this._countValue = s;     console.log('this._countValue',this._countValue)
    this._count = 0;
    switch (value) {
      case ECampInputType.File:
        this._inputData.get('groupTypes').clearValidators();
        this._inputData.get('groupTypes').setValue(null);
        this._inputData.get('groupTypes').updateValueAndValidity();
        this.onChange();
        this._inputData.get('mobileColumn').setValidators(Validators.required);
        this._inputData.get('filename').setValidators(Validators.required);
        this._inputData.get('fileType').setValidators(Validators.required);
        this._inputData.get('fileType').updateValueAndValidity();
        this._inputData.get('filename').updateValueAndValidity();
        this._inputData.get('mobileColumn').updateValueAndValidity();
        this._inputData.updateValueAndValidity();
        break;
      case ECampInputType.Address:
        this._campData.get('campType').setValue('0');
        this._selectedFile = null;
        let replaceobj:any;
          this.replacedColumnData = replaceobj;
        this._inputData.get('groupTypes').setValidators(Validators.required);
        this._inputData.get('groupTypes').setValue(null);
        this._inputData.get('groupTypes').updateValueAndValidity();
        this.onChange();
        this._inputData.get('fileType').clearValidators();
        this._inputData.get('fileType').setValue(null);
        this._inputData.get('filename').clearValidators();
        this._inputData.get('filename').setValue(null);
        this._inputData.get('selectSheet').clearValidators();
        this._inputData.get('selectSheet').setValue(null);
        this._inputData.get('selectSheet').updateValueAndValidity();
        this._inputData.get('fileType').updateValueAndValidity();
        this._inputData.get('filename').updateValueAndValidity();
        this._inputData.get('columns').setValue([]);
        this._sms.get('selectcolumnlist').setValue([]);
        this._inputData.get('mobileColumn').clearValidators();
        this._inputData.get('mobileColumn').setValue(null);
        this._inputData.get('mobileColumn').updateValueAndValidity();
        break;
      default:
        break;
    }
  }

  // segmenthandler(event) {
  //   let segementData = this._segments.filter(x => x.segmentId == event.value)
  //   if (segementData.length > 0) {
  //     this._countValue = '' + (segementData.length > 0 ? segementData[0].segmentCnt : 0);
  //     this._sms.get('selectcolumnlist').setValue(JSON.parse(segementData[0].fileInfo).colNames);
  //     this._inputData.get('mobileColumn').setValue(segementData[0].mobileColumn);
  //   }
  // }
  // grouphandler(event) {
  //   console.log("grouphandler=>", event.value);
  //   let cont = 0;
  //   for (let s of event.value) {
  //     let groupData = this._groupsData.filter(x => x.groupId == s);
  //     cont += groupData.length > 0 ? groupData[0].groupCount : 0;
  //   }
  //   this._countValue = cont + '';
  // }

  changeScheduleType() {
    console.log("scheduletype=>", this._camaDetails.value.scheduletype);
    if (this._camaDetails.value.scheduletype == "0") {
      this._camaDetails.get('campSchedule').clearValidators();
      this._camaDetails.get('campSchedule').setValue(null);
      this._camaDetails.get('campSchedule').updateValueAndValidity();
    } else {

      this._camaDetails.get('campSchedule').setValidators(Validators.required);
      this._camaDetails.get('campSchedule').setValue(null);
      this._camaDetails.get('campSchedule').updateValueAndValidity();

    }

  }
  onChange(value?: any) {
    console.log("groupTypes=>", this._inputData.value.groupTypes, value);
    if (this._inputData.value.groupTypes != null) {
      if (value)
        this._countValue = 0;
      let selectGroupTypes = (this._inputData.value.groupTypes) as string[];
      if (selectGroupTypes.findIndex(x => x == "Global") != -1) {
        this.selglobal = true;
        this._inputData.get('globalgroupId').setValidators(Validators.required);
        if (!value)
          this._inputData.get('globalgroupId').setValue(null);
        this._inputData.get('globalgroupId').updateValueAndValidity();
        if (this._inputData.value.globalgroupId != null) {
          let groupdata = this._inputData.value.globalgroupId as number[];
          console.log("GloableGroups=>", this.globalGroups.filter(x => groupdata.findIndex(y => y == x.cntGroupId) != -1), groupdata);
          this.globalGroup = '';
          this.globalGroups.filter(x => groupdata.findIndex(y => y == x.cntGroupId) != -1).forEach(z => {
            this.globalGroup = this.globalGroup == '' ? z.cntGroupName : this.globalGroup;
            this._countValue += z.contactGlobals.length;

          });
        }
      } else {
        this.selglobal = false;
        this._inputData.get('globalgroupId').clearValidators();
        this._inputData.get('globalgroupId').setValue(null);
        this.globalGroup = '';
        this._inputData.get('globalgroupId').updateValueAndValidity();
      }
      if (selectGroupTypes.findIndex(x => x == "Departments") != -1) {
        this.seldept = true;
        this._inputData.get('deptgroupId').setValidators(Validators.required);
        if (!value)
          this._inputData.get('deptgroupId').setValue(null);
        this._inputData.get('deptgroupId').updateValueAndValidity();
        if (this._inputData.value.deptgroupId != null) {
          let groupdata = this._inputData.value.deptgroupId as number[];
          this.globalDepts = '';
          this.deptGroup.filter(x => groupdata.findIndex(y => y == x.groupDeptId) != -1).forEach(z => {
            this.globalDepts = this.globalDepts == '' ? z.groupName : this.globalDepts;
            this._countValue += z.contactDepts.length;
          });
        }
      }
      else {
        this.seldept = false;
        this._inputData.get('deptgroupId').clearValidators();
        this._inputData.get('deptgroupId').setValue(null);
        this.globalDepts = '';
        this._inputData.get('deptgroupId').updateValueAndValidity();
      }
      if (selectGroupTypes.findIndex(x => x == "Users") != -1) {
        this.seluser = true;
        this._inputData.get('usergroupId').setValidators(Validators.required);
        if (!value)
          this._inputData.get('usergroupId').setValue(null);
        this._inputData.get('usergroupId').updateValueAndValidity();
        if (this._inputData.value.usergroupId != null) {

          let groupdata = this._inputData.value.usergroupId as number[];
          this.globalUser = '';
          this.groupUser.filter(x => groupdata.findIndex(y => y == x.groupUserId) != -1).forEach(z => {
            this.globalUser = this.globalUser == '' ? z.groupName : this.globalUser;
            this._countValue += z.contactUsers.length;
          });
        }
      } else {
        this.seluser = false;
        this._inputData.get('usergroupId').clearValidators();
        this._inputData.get('usergroupId').setValue(null);
        this.globalUser = '';
        this._inputData.get('usergroupId').updateValueAndValidity();
      }
    }
    else {
      let s: number;
      this._countValue = s;
      this.selglobal = false;
      this._inputData.get('globalgroupId').clearValidators();
      this._inputData.get('globalgroupId').setValue(null);
      this._inputData.get('globalgroupId').updateValueAndValidity();
      this.seldept = false;
      this._inputData.get('deptgroupId').clearValidators();
      this._inputData.get('deptgroupId').setValue(null);
      this._inputData.get('deptgroupId').updateValueAndValidity();
      this.seluser = false;
      this._inputData.get('usergroupId').clearValidators();
      this._inputData.get('usergroupId').setValue(null);
      this._inputData.get('usergroupId').updateValueAndValidity();
    }
  }

  templateSelection() {
    console.log("Message1==>", this._sms.value.seltemplate)
    this._sms.get('msgtxt').setValue(this._sms.value.seltemplate);
    // this._sms.get('msgTxt').setValue(this._sms.value.msgTxt);
  }
  usetemplate(value) {
    if (value == false) {
      this._sms.get('seltemplate').clearValidators();
      this._sms.get('seltemplate').setValue(null);
      this._sms.get('seltemplate').updateValueAndValidity();
    } else {
      this._sms.get('seltemplate').setValidators(Validators.required);
    }
  }
  submitCampaign() {
    this.loading = true;
    this.campaignDataModel.campDesc = '';
    this.campaignDataModel.campMode = +this._camaDetails.value.campMode;
    this.campaignDataModel.campName = this._campData.value.campName;
    this.campaignDataModel.campStartTime = this._camaDetails.value.scheduletype == '1' ? this.datePipe.transform(this._camaDetails.value.campSchedule, "yyyy-MM-dd HH:mm:ss") : '';
    this.campaignDataModel.startTime = this._camaDetails.value.scheduletype == '1' ? this.datePipe.transform(this._camaDetails.value.campSchedule, "yyyy-MM-dd HH:mm:ss") : '';
    this.campaignDataModel.campType = +this._campData.value.campType;
    this.campaignDataModel.charCount = this.charcount;
    this.campaignDataModel.credits = this.msgCount;
    this.campaignDataModel.dndStatus = 0;
    this.campaignDataModel.language = this._arabic.test(this._sms.value.msgtxt) ? 8 : 0;
    this.campaignDataModel.message = this._sms.value.msgtxt;
    this.campaignDataModel.priority = +this._camaDetails.value.priority;
    this.campaignDataModel.scheduleType = +this._camaDetails.value.scheduletype;
    this.campaignDataModel.senderId = +this._sms.value.senderId;
    this.campaignDataModel.sourceType = +this._inputData.value.inputType;
    this.campaignInfo.header = this._inputData.value.isHeader == true ? 1 : 0;

    let deptGroups = '';
    if (this._inputData.value.deptgroupId != null) {
      let deptGroupsData = (this._inputData.value.deptgroupId) as number[];
      // deptGroupsData.forEach(x => {
      //   deptGroups = deptGroups == '' ? x + '' : deptGroups + ',' + x;
      // });
      deptGroups = deptGroupsData.join(',');
    }
    this.campaignInfo.deptGroups = deptGroups;
    this.campaignInfo.fileType = this._inputData.value.fileType;
    this.campaignInfo.filename = this._inputData.value.filename;
    let globelGroups = '';
    if (this._inputData.value.globalgroupId != null) {
      let globelGroupsData = (this._inputData.value.globalgroupId) as number[];
      globelGroups = globelGroupsData.join(',');
    }
    this.campaignInfo.globalGroups = globelGroups;
    let headerData = (this._inputData.value.columns) as string[];
    let headerString = '';
    headerString = headerData.join('#');
    this.campaignInfo.headerColumn = headerString;
    this.campaignInfo.invalidcount = 0;
    this.campaignInfo.mobilenoColumn = +this._inputData.value.inputType == 1 ? this._inputData.value.mobileColumn : '';
    this.campaignInfo.sheetname = this._inputData.value.selectSheet;
    this.campaignInfo.customMessage=this.replacedColumnData? JSON.stringify(this.replacedColumnData):'';
    let usersGroups = '';
    if (this._inputData.value.usergroupId != null) {
      let usersGroupsData = (this._inputData.value.usergroupId) as number[];
      usersGroups = usersGroupsData.join(',');
    }
    this.campaignInfo.userGroups = usersGroups;
    this.campaignInfo.validcount = this._countValue;
    if (this.data == null) {
      this.campaignDataModel.campaignInfo = this.campaignInfo;
      console.log("campaignDataModel=>", this.campaignDataModel, headerString);
      const formData = new FormData();
      formData.append("file", this._selectedFile);
      formData.append("data", new Blob([JSON.stringify(this.campaignDataModel)], { type: "application/json" }));
      this.campaignService.createCampaign(formData).subscribe((response: IResponse) => {
        console.log("response=>", response);
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS)
          this.dialogRef.close(response.status);
        }
        else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
          this.loading = false;
        }
      },
        error => {
          this.loading = false;
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-submit==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR);
        });
    }
    else {
      this.campaignDataModel.campId = this.data.campId;
      this.campaignInfo.id = this.data.campaignInfo.id;
      this.campaignDataModel.campaignInfo = this.campaignInfo;
      console.log("campaignDataModel=>1", this.campaignDataModel, this._selectedFile);
      const formData = new FormData();
      formData.append("file", this._selectedFile);
      formData.append("data", new Blob([JSON.stringify(this.campaignDataModel)], { type: "application/json" }));
      this.campaignService.updateCampaign(formData).subscribe((response: IResponse) => {
        console.log("response=>", response);
        if (response.status) {
          this.alertMessage.showAlert(response.message, ActionType.SUCCESS)
          this.dialogRef.close(response.status);
        }
        else {
          this.alertMessage.showAlert(response.message, ActionType.FAILED);
          this.loading = false;
        }
      },
        error => {
          this.loading = false;
          let message = error.error.messages as string
          let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
          console.error("E-submit==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR);
        });
    }
  }
  submit() {
    this.loading = true;
    let scheduleTimecheck: boolean = true;
    let promatinalAutoCheck: boolean = false;
    if (this._camaDetails.value.scheduletype == '1') {
      if (this._camaDetails.value.campSchedule < this.today)
        scheduleTimecheck = false;
      else {
        if (this._camaDetails.value.campMode == '0') {
          let selectDate = (this._camaDetails.value.campSchedule) as Date;
          let selectMinite = selectDate.getMinutes() + '';
          let selectTime = +(selectDate.getHours() + (selectMinite.length == 1 ? '0' + selectMinite : selectMinite));
          if (selectTime < this.sTime || selectTime > this.eTime) {
            scheduleTimecheck = false;
          }
        }
      }
    }
    else {
      if (this._camaDetails.value.campMode == '0') {
        let selectMinite = this.today.getMinutes() + '';
        let selectTime = +(this.today.getHours() + (selectMinite.length == 1 ? '0' + selectMinite : selectMinite));
        console.log("selectMinite==>", selectMinite, selectTime, this.sTime, this.eTime);

        if (selectTime < this.sTime || selectTime > this.eTime) {
          scheduleTimecheck = false;
          promatinalAutoCheck = true;
        }

      }
    }
    if (scheduleTimecheck || promatinalAutoCheck) {
      if (promatinalAutoCheck) {
        let autoScheduleTime = this.datePipe.transform(this.promotionalMinDate, "yyyy-MM-dd HH:mm");
        const dialogRef = this.dialog.open(ConfirmDeleteComponent, {
          width: '500px',
          data: this.translate.instant('campaigns.create.promotionalALert') + autoScheduleTime
        });
        dialogRef.afterClosed().subscribe(result => {

          if (result) {
            console.log("result=>", result);
            this.loading = true;
            this._camaDetails.get('scheduletype').setValue('1');
            this._camaDetails.get('campSchedule').setValue(this.promotionalMinDate);
            console.log("campSchedule==>", this._camaDetails.value.campSchedule);
            this.submitCampaign();
          }
          else
            this.loading = false;
        });
      }
      else {
        this.submitCampaign();
      }
    } else {
      this._camaDetails.get('campSchedule').setValue(null);
      this.alertMessage.showAlert(this.translate.instant('campaigns.create.errortime'), ActionType.ALERT)
      this.loading = false;
    }
  }

  ngOnDestroy() {
    if (this.myTimeout)
      this.myTimeout.unsubscribe();
    if (this.currentTimesubscription)
      this.currentTimesubscription.unsubscribe();
  }
}

export function CampaignValidator(service: CampaignService): AsyncValidatorFn {
  return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return control.value != null ? service.validateCampName((control.value as string).trim())
      .map(response => {
        console.log(response.status)
        return !response.status ? { invalid: true } : null
      }) : null;
  };
}