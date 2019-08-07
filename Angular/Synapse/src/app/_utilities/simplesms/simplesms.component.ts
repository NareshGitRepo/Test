import * as _ from 'lodash';

import { ActionType, AlertMessageService } from '../../_services/AlertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../_helpers/app.config';
import { ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { ErrorStateMatcher, MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { IDeptGroup, IGlobalGroup, ISender, ISmsCreate, ISmsResponse, IUserGroup, ISimpleSmsData } from '../_models/sms.model';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UtilityService } from '../_services/utility.service';

@Component({
  selector: 'simplesms',
  templateUrl: './simplesms.component.html',
  styleUrls: ['./simplesms.component.scss']
})

export class SimpleSMSComponent implements OnInit {
  simpleSMSForm: FormGroup;
  // filteredSenderInfo: Observable<any[]>;
  //userValid: any;

  loading: boolean = false;
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
  templateData: any = [];
  sendersList: ISender[] = [];
  globalGroupsList: IGlobalGroup[] = [];
  deptGroupsList: IDeptGroup[] = [];
  userGroupsList: IUserGroup[] = [];
  _tokenInfo: IUserUpdateDto;
  _rolename: string;
  userTypes = ['Global'];
  selUserTypes = [];
  textBoxFlag: boolean = true;
  isChecked: boolean = false;
  global_user: boolean = false;
  groupCount: number = 0;
  departCount: number = 0;
  userCount: number = 0;
  groupname: string = '';
  deptname: string = '';
  username: string = '';
  oldmessage: string = '';
  contactValid: boolean = true;
  smsKeys: string[] = [];
  globalGroup:string='';
  recipientNumber:string='';
  smsDeptGroup:string='';
  smsUserGroup:string='';
  allowcreditsFlag:boolean=true;

  constructor(private dialogRef: MatDialogRef<SimpleSMSComponent>, private fb: FormBuilder,
    public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public sendSMSData: ISimpleSmsData,
    private utilityService: UtilityService, private appconfig: AppConfig,
    public snackbar: MatSnackBar, private translate: TranslateService, private cdRef: ChangeDetectorRef,
                                    private alertMessage: AlertMessageService, private router: Router) {
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    this.allowcreditsFlag=this.appconfig.getAllowcredits();       
    console.log("allowcreditsFlag=>",this.allowcreditsFlag);
    
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;

    if (this._tokenInfo && tokenData) {
      this._rolename = this._tokenInfo.roles[0].roleName;    console.log('this._rolename',this._rolename) 
    }
  }
  ngOnInit() {
    this.simpleSMSForm = this.fb.group({
      contactNumbers: [null, Validators.required],
      Senderid: [null, Validators.required],
      // messages: this.fb.array([this._sms]),
      userType: [null],
      global_groups: [null],
      department_groups: [null],
      user_groups: [null],
      addressBook: ['1'],
      // messages: this.fb.array([this.createItem1()]),
      //  selectcolumnlist: [[]],
      msgtxt: [null, Validators.required],
      iscustom: [false],
      editGroupName: [null]
    });

    if (this.sendSMSData.groupId) {
      console.log("this.sendSMSData===>", this.sendSMSData);
      this.simpleSMSForm.get('contactNumbers').setValue(null);
      this.simpleSMSForm.get('contactNumbers').clearValidators();
      this.simpleSMSForm.get('contactNumbers').updateValueAndValidity();
      this.simpleSMSForm.get('addressBook').setValue(this.sendSMSData.sendBaseType ==4?'1':'2');  
      console.log('this.sendSMSData.sendBaseType',this.sendSMSData.sendBaseType)
      //this.smsKeys=Object.keys(this.sendSMSData);
      //console.log("sms Keys===>",this.smsKeys);
    }
    this.getAllGroupsWithContacts();
    this.simpleSMSForm.controls.msgtxt.valueChanges.subscribe((smsText) => {    console.log('smsText',smsText)
      this.messageCount(smsText);
    });
    if (this.simpleSMSForm.value.msgtxt != null)
      this.messageCount(this.simpleSMSForm.value.msgtxt);
    // console.log("smsFormGroup=>", this.type.nativeElement.value);
  }
  changecontact(value: string) {

    this.contactValid = true;
    let contactlist = value.split(',');
    let contact = contactlist.length == 1 ? contactlist[0] : contactlist.length > 1 ? contactlist[contactlist.length - 1] : '';
    if (contact.length > 15 || contact.length < 12)
      this.contactValid = false;
    else
      this.contactValid = true;
   // console.log("value=>", value, this.contactValid);
  }
  getAllContacts() {
    this.groupCount = 0;
    this.departCount = 0;
    this.userCount = 0;
    this.selUserTypes = [];
    console.log(this.userTypes);
    this.textBoxFlag = false;
    this.isChecked = true;
    this.contactValid = true;
    this.simpleSMSForm.get('userType').setValue(null);
    this.simpleSMSForm.get('userType').setValidators(Validators.required);
    this.simpleSMSForm.get('userType').updateValueAndValidity();
    this.simpleSMSForm.get('global_groups').setValue(null);
    this.simpleSMSForm.get('global_groups').setValidators(Validators.required);
    this.simpleSMSForm.get('global_groups').updateValueAndValidity();
    this.simpleSMSForm.get('department_groups').setValue(null);
    this.simpleSMSForm.get('department_groups').setValidators(Validators.required);
    this.simpleSMSForm.get('department_groups').updateValueAndValidity();
    this.simpleSMSForm.get('user_groups').setValue(null);
    this.simpleSMSForm.get('user_groups').setValidators(Validators.required);
    this.simpleSMSForm.get('user_groups').updateValueAndValidity();
    this.simpleSMSForm.get('contactNumbers').setValue(null);
    this.simpleSMSForm.get('contactNumbers').clearValidators();
    this.simpleSMSForm.get('contactNumbers').updateValueAndValidity();
  }
  getRecipients() {
    this.selUserTypes = [];
    this.textBoxFlag = true;
    this.isChecked = false;
    this.contactValid = true;
    this.simpleSMSForm.get('contactNumbers').setValue(null);
    this.simpleSMSForm.get('contactNumbers').setValidators(Validators.required);
    this.simpleSMSForm.get('contactNumbers').updateValueAndValidity();
    this.simpleSMSForm.get('userType').setValue(null);
    this.simpleSMSForm.get('global_groups').setValue(null);
    this.simpleSMSForm.get('department_groups').setValue(null);
    this.simpleSMSForm.get('user_groups').setValue(null);
    this.simpleSMSForm.get('userType').clearValidators();
    this.simpleSMSForm.get('global_groups').clearValidators();
    this.simpleSMSForm.get('department_groups').clearValidators();
    this.simpleSMSForm.get('user_groups').clearValidators();
    this.simpleSMSForm.get('userType').updateValueAndValidity();
    this.simpleSMSForm.get('global_groups').updateValueAndValidity();
    this.simpleSMSForm.get('department_groups').updateValueAndValidity();
    this.simpleSMSForm.get('user_groups').updateValueAndValidity();
  }
  loadGroups(value) {
    let data = this.simpleSMSForm.value.userType;
    if (data.findIndex(x => x == 'Global') == -1) {
      this.global_user = false;
      this.simpleSMSForm.get('global_groups').setValue(null);
      this.simpleSMSForm.get('global_groups').clearValidators();
      this.simpleSMSForm.get('global_groups').updateValueAndValidity();
    }
    else {
      this.global_user = true;
      this.simpleSMSForm.get('global_groups').setValidators(Validators.required);
      this.simpleSMSForm.get('global_groups').updateValueAndValidity();
    }
    if (data.findIndex(x => x == 'Departments') == -1) {
      this.global_user = false;
      this.simpleSMSForm.get('department_groups').setValue(null);
      this.simpleSMSForm.get('department_groups').clearValidators();
      this.simpleSMSForm.get('department_groups').updateValueAndValidity();
    }
    else {
      this.simpleSMSForm.get('department_groups').setValidators(Validators.required);
      this.simpleSMSForm.get('department_groups').updateValueAndValidity();
    }
    if (data.findIndex(x => x == 'Users') == -1) {
      this.simpleSMSForm.get('user_groups').setValue(null);
      this.simpleSMSForm.get('user_groups').clearValidators();
      this.simpleSMSForm.get('user_groups').updateValueAndValidity();
    }
    else {
      this.simpleSMSForm.get('user_groups').setValidators(Validators.required);
      this.simpleSMSForm.get('user_groups').updateValueAndValidity();
    }
    console.log(value)
    this.selUserTypes = data;
  }

  forGroupCount(globalList: any) {
    console.log('globalList=>', globalList);

    this.groupCount = 0;
    this.groupname = '';
    let groupSelected: number[] = [];
    //Selected Multiple items with + others
    groupSelected = this.simpleSMSForm.value.global_groups;
    if (groupSelected.length > 0) {
      let filtergroup = this.globalGroupsList.filter(x => groupSelected.findIndex(y => y == x.cntGroupId) != -1);
      console.log('filtergroup',filtergroup)
      this.groupname = filtergroup.length > 0 ? filtergroup[0].cntGroupName : '';
      filtergroup.forEach(element => {
        if (element.contactGlobals)
          this.groupCount += element.contactGlobals.length;    console.log('this.groupCount',this.groupCount)
      })
    }
  }

  forDepartmentCount(departmentList: any) {

    console.log("this.deptGroupsList", JSON.stringify(this.deptGroupsList));

    this.deptname = '';
    this.departCount = 0;
    let deptSelected: number[] = [];
    //Selected Multiple items with + others
    deptSelected = this.simpleSMSForm.value.department_groups;
    if (deptSelected.length > 0) {
      let filtergroup = this.deptGroupsList.filter(x => deptSelected.findIndex(y => y == x.groupDeptId) != -1);
      this.deptname = filtergroup.length > 0 ? filtergroup[0].groupName : '';
      filtergroup.forEach(element => {
        if (element.contactDepts)
          this.departCount += element.contactDepts.length;
      })
    }
  }

  forUSerCount(usersList: any) {


    let userSelected: number[] = [];
    //Selected Multiple items with + others
    userSelected = this.simpleSMSForm.value.user_groups;
    if (userSelected.length > 0) {
      let filtergroup = this.userGroupsList.filter(x => userSelected.findIndex(y => y == x.groupUserId) != -1);
      this.username = filtergroup.length > 0 ? filtergroup[0].groupName : '';
      filtergroup.forEach(element => {
        if (element.contactUsers)
          this.userCount += element.contactUsers.length;
      });


    }
  }
  getAllSenders() {
    this.loading = true;
    this.utilityService.getAllSenders().subscribe((result: ISender[]) => {
      console.log('result :: ', result)
      if (result != undefined) {
        this.sendersList = result.filter(x => x.status == 1 && x.senderType != 2);    console.log('this.sendersList',this.sendersList)
        if (this.sendersList.length > 0) {
          this.simpleSMSForm.get('Senderid').setValue(this.sendersList[0].senderName);
        }
        //   this.sendersList = result;
        this.loading = false;
        // } else {
        //this.groupsList = [];
        console.log('Senders list ::', this.sendersList);
      }
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getAllSenders==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }


  getAllGroupsWithContacts() {
    this.loading = true;
    this.utilityService.getAllGroupsWithContacts().subscribe((result: IGlobalGroup[]) => {
    console.log('result',result)
      if (result != undefined) {
        this.globalGroupsList = result.filter(x => x.contactGlobals.length > 0);
        console.log('globalGroupsList ', this.globalGroupsList);

      } else {
        this.globalGroupsList = [];
      }
      console.log(this._rolename);
      this.getAllSenders();
      if (this._rolename == 'Department Admin' || this._rolename == 'User') {
        this.userTypes.push("Departments");
        if (this._rolename == 'User') {
          this.userTypes.push("Users");
        }

        console.log(this.userTypes);
        // this.loading = false;
        this.getGroupsWithContactsByDeptId();
      } else {
        this.loading = false;
      }
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getAllGroupsWithContacts==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getGroupsWithContactsByDeptId() {
    this.utilityService.getGroupsWithContactsByDeptId().subscribe((result: IDeptGroup[]) => {
      console.log('dept result ', result);
      if (result != undefined) {
        this.deptGroupsList = result.filter(x => x.contactDepts.length > 0);
        console.log('deptGroupsList ', this.deptGroupsList);

      } else {
        this.deptGroupsList = [];
      }
      if (this._rolename == 'User') {
        // this.userTypes.push("Users");
        console.log(this.userTypes);
        this.getGroupsWithContacts();
      }
      else
        this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getGroupsWithContactsByDeptId==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  getGroupsWithContacts() {
    this.utilityService.getGroupsWithContacts().subscribe((result: IUserGroup[]) => {

      if (result != undefined) {
        this.userGroupsList = result.filter(x => x.contactUsers.length > 0);
        console.log('userGroupsList ', this.userGroupsList);
        if (result.length > 0) {
          this.loading = false;
        }
      } else {
        this.userGroupsList = [];

      }
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getGroupsWithContacts==.", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }


  messageCount(smsText) {
    if (smsText) {
      // this.msgPlaceHolder = this._arabic.test(smsText) ? 'Message (Arabic)' : (this._unicode.test(smsText) ? 'Message (Unicode)' : 'Message (English)');
      this.msgPlaceHolder = this._arabic.test(smsText) ? 'MessageArbic' : (this._unicode.test(smsText) ? 'MessageUnicode' : 'MessageEnglish');

      this.charcount = smsText.length;
      if (this._unicode.test(smsText)) {
        this.msgCount = Math.ceil((this.charcount > 70 ? this.charcount : 67) / 67);  
        this.msglength = this.arbLength;
        if (this.charcount > this.arbLength)
          this.simpleSMSForm.get('msgtxt').setValue(this.simpleSMSForm.value.msgtxt);
      }
      else {
        let formCahr = smsText.match(this.format);  console.log('formCahr',formCahr)
        this.charcount += formCahr == null ? 0 : formCahr.length;      console.log('this.charcount',this.charcount)
        this.msgCount = Math.ceil((this.charcount > 160 ? this.charcount : 153) / 153);      console.log('this.msgCount',this.msgCount)
        this.msglength = this.engLength - (formCahr == null ? 0 : formCahr.length);       console.log('this.msglength',this.msglength)
        if (this.charcount > this.engLength)
          this.simpleSMSForm.get('msgtxt').setValue(this.simpleSMSForm.value.msgtxt);
      }
      if (this.msgCount > 12) {
        this.simpleSMSForm.get('msgtxt').setValue(this.oldmessage);
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
  removeLastComma(value) {
    //this.simpleSMSForm.get('contactNumbers').setValue(value.replace(/,\s*$/, ""));
  }

  sendGroupSMS() {
    this.loading = true;
    //let deptGroup = _.map(this.simpleSMSForm.value.department_groups).join(',');
    if (this.sendSMSData.groupId) {
      if (this.sendSMSData.sendBaseType==1) {
        this.globalGroup= this.sendSMSData.groupId+'';
      }
      if (this.sendSMSData.sendBaseType==2) {
        this.smsDeptGroup= this.sendSMSData.groupId+'';
      }
      if (this.sendSMSData.sendBaseType==3) {
        this.smsUserGroup= this.sendSMSData.groupId+'';
      }
      if (this.sendSMSData.sendBaseType==4) {
        this.recipientNumber= this.sendSMSData.contactNo;
      }
    }else{
      this.globalGroup= _.map(this.simpleSMSForm.value.global_groups).join(',');
      this.smsDeptGroup=_.map(this.simpleSMSForm.value.department_groups).join(',');
      this.smsUserGroup = _.map(this.simpleSMSForm.value.user_groups).join(',');
      this.recipientNumber= this.simpleSMSForm.value.contactNumbers as string;
    }

    //let globalGroup = _.map(this.simpleSMSForm.value.global_groups).join(',');
    //let userGroup = _.map(this.simpleSMSForm.value.user_groups).join(',');
    console.log("submit1==>", this.smsDeptGroup, this.simpleSMSForm.value.department_groups);
    console.log("Action ==>", this.simpleSMSForm.value.addressBook);
    // let source : string;
    // if(this.simpleSMSForm.value.addressBook == 1){
    //   source ='recipient';
    // }else{
    //   source ='groups';
    // }
    
    let senderId: number;
    let index = this.sendersList.findIndex(x => x.senderName == this.simpleSMSForm.value.Senderid);
    if (index != -1) {
      senderId = this.sendersList[index].senderId;
    }
    let smsData = {
      deptGroupId: this.smsDeptGroup,
      globalGroupId: this.globalGroup,
      recipient: this.recipientNumber,
      userGroupId: this.smsUserGroup,
      source: this.simpleSMSForm.value.addressBook,
      message: this.simpleSMSForm.value.msgtxt,
      senderId: senderId
    } as ISmsCreate;

    console.log("CREATE==>", smsData);
    this.utilityService.createSimpleSms(smsData).subscribe((response: ISmsResponse) => {
      if (response) {
        this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
        this.dialogRef.close(smsData);
      } else {
        this.alertMessage.showAlert(response.message, ActionType.FAILED);
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-sendGroupSMS==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  sendContactSMS() {
    this.loading = true;
    if (this.sendSMSData.groupId) {
      this.sendGroupSMS();
    } else {
      // console.log('Before :: ', this.simpleSMSForm.value);
      this.simpleSMSForm.get('contactNumbers').setValue(this.simpleSMSForm.value.contactNumbers.replace(/,\s*$/, ""));
      // console.log('After :: ', this.simpleSMSForm.value);
      this.sendGroupSMS();
    }

  }


  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  closeDialog(): void {
    this.dialogRef.close();
  }



}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
    return (invalidCtrl || invalidParent);
  }
}
