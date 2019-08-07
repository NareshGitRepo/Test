import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { AppConfig, ILoginDtos, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { ContactGroupUser, GroupDept, GroupsWithContactGlobal, IContactDept, IContactGlobal, IContactUser, ISmartResponse, IUDeptContact, IUpdateGlobalContact, IuserContact, editList, selectType, userType, IBulkContact } from '../_model/smartdirectort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Papa } from 'ngx-papaparse';
import { ReadMode } from 'ngx-file-helpers';
import { Router } from '@angular/router';
import { SmartDirectoryService } from '../_services/smartdirectoryservice';
import { TranslateService } from '@ngx-translate/core';
type AOA = Array<Array<any>>;

@Component({
  selector: "app-createsmartcontact",
  templateUrl: "./createsmartcontact.component.html",
  styleUrls: ["./createsmartcontact.component.scss"]
})
export class CreatesmartcontactComponent implements OnInit {

  smartContactForm: FormGroup;
  tokenInfo: ITokenInfo;
  loginDtos: ILoginDtos;
  loginInfo: IUserUpdateDto;
  globalGroup: GroupsWithContactGlobal[];
  departementGroup: GroupDept[];
  normalGroup: ContactGroupUser[];
  fileList: FileList;
  _selectedFile: File;
  excelSheetData: XLSX.Sheet[] = [];
  _excelSheetNames: string[] = [];
  groupname: string = "";
  _count: number;
  mailFlag: boolean = false;
  showpopup: boolean = false;
  loading: boolean = false;
  globalFlag: boolean = false;
  departementFlag: boolean = false;
  normalFalag: boolean = false;
  public readMode = ReadMode.dataURL;
  mailpattern = /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/;
  selectheaders = [];
  bulkContacts: IBulkContact;
  constructor(public dialog: MatDialog, private dialogRef: MatDialogRef<CreatesmartcontactComponent>,
    private fb: FormBuilder, private appConfig: AppConfig, private router: Router, private smartdirectoryService: SmartDirectoryService,
    private translate: TranslateService, @Inject(MAT_DIALOG_DATA) public editData: editList, private alertMessage: AlertMessageService,
    private cdrRef: ChangeDetectorRef, private papa: Papa) {
    this.tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
    if (this.tokenInfo) {
      let newLoginDtos: ILoginDtos;
      this.loginDtos = this.tokenInfo ? (this.tokenInfo.tokenInfo as ILoginDtos) : newLoginDtos;
      this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? (JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto) : undefined;
    } else {
      this.router.navigate(["401"]);
    }
  }

  forGroupCount(globalList: any) {
    console.log("globalList", globalList);
    if (globalList.length > 0) {
      let userSelected: number[] = [];
      userSelected = this.smartContactForm.value.group;
      if (userSelected.length > 0) {
        let findex = this.globalGroup.findIndex(
          y => y.cntGroupId == userSelected[0]
        );
        if (findex != -1) {
          this.groupname = this.globalGroup[findex].cntGroupName;
        }
      }
    }
  }

  forDepartmentCount(departmentList: any) {
    console.log("forDepartmentCount", departmentList);
    if (departmentList.length > 0) {
      let userSelected: number[] = [];
      userSelected = this.smartContactForm.value.group;
      if (userSelected.length > 0) {
        let findex = this.departementGroup.findIndex(
          y => y.groupDeptId == userSelected[0]
        );
        if (findex != -1) {
          this.groupname = this.departementGroup[findex].groupName;
        }
      }
    }
  }

  forUSerCount(usersList: any) {
    if (usersList.length > 0) {
      let userSelected: number[] = [];
      userSelected = this.smartContactForm.value.group;
      if (userSelected.length > 0) {
        let findex = this.normalGroup.findIndex(
          y => y.groupUserId == userSelected[0]
        );
        if (findex != -1) {
          this.groupname = this.normalGroup[findex].groupName;
        }
      }
    }
    console.log("Group name ", this.groupname);
  }

  getGlobalAllgroups(action?: boolean) {
    console.log("getGlobalAllgroups");
    this.loading = true;
    this.smartdirectoryService.getAllGroupsWithContactsGlobal().subscribe(
      (response: GroupsWithContactGlobal[]) => {
        if (response) {
          this.globalGroup = response;
          console.log("Response==>Global", response);
          this.loading = false;
        }
      },
      error => {
        let message = error.error.messages as string;
        let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
        console.error("E-getGlobalAllgroups==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      }
    );
  }

  getDptAllgroups() {
    console.log("getDptAllgroups");
    this.loading = true;
    this.smartdirectoryService
      .getAllGroupsWithContactsDept(this.loginInfo.depts[0].deptId).subscribe((response: GroupDept[]) => {
        if (response) {
          this.departementGroup = response;
          console.log("Response==>Dept", response);
          this.loading = false;
        }
      },
        error => {
          let message = error.error.messages as string;
          let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
          console.error("E-getDptAllgroups==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        }
      );
  }

  getUserAllgroups() {
    console.log("getUserAllgroups", JSON.stringify(this.loginInfo));
    this.loading = true;
    // this.smartdirectoryService.getGroupsWithContactsUser().subscribe((response: ContactGroupUser[]) => { // commented by jagan
    this.smartdirectoryService
      .getGroupsWithContactsUser(this.loginInfo.userId)
      .subscribe(
        (response: ContactGroupUser[]) => {
          if (response) {
            this.normalGroup = response;
            console.log("Response==>Users", response);
            this.loading = false;
          }
        },
        error => {
          let message = error.error.messages as string;
          let errorMessage =
            error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
          console.error("E-getUserAllgroups==>", JSON.stringify(error));
          this.showAlert(errorMessage, ActionType.ERROR, error.status);
          this.loading = false;
        }
      );
  }

  ngOnInit() {
    this.smartContactForm = this.fb.group({
      inputType: ['1', Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      mobileNo: [null, Validators.required],
      emailId: [null],
      group: [null, Validators.required],
      userId: [null],
      cntUserId: [null],
      selectSheet: [null],
      firstNameField: [null],
      lastNameField: [null],
      mobileNumberField: [null],
      emailAddressField: [null],
      fileType: [null],
      filename: [null]
    });

    if (this.editData != null) {
      console.log("this.editData==>", this.editData);
      this.smartContactForm.get("group").clearValidators();
      this.smartContactForm.get("group").updateValueAndValidity();
      if (this.editData.type == selectType.Global) {
        this.smartContactForm.patchValue(this.editData.data);
      } else if (this.editData.type == selectType.Departement) {
        this.smartContactForm.patchValue(this.editData.data);
      } else {
        this.smartContactForm.patchValue(this.editData.data);
      }
    }

    switch (this.loginInfo.roles[0].roleCode) {
      case userType.PlatFormAdmin:
        this.getGlobalAllgroups();
        this.globalFlag = true;
        break;
      case userType.SuperAdmin:
        this.getGlobalAllgroups();
        this.globalFlag = true;
        break;
      case userType.DepartementAdmin:
        this.departementFlag = true;
        this.getDptAllgroups();
        break;
      default:
        this.normalFalag = true;
        this.getUserAllgroups();
    }
    console.log("smartContactForm =>", this.smartContactForm);

    this.cdrRef.detectChanges();
  }
  mailValidation() {
    console.log("mailValidation=>");
    if (this.smartContactForm.value.emailId != null && this.smartContactForm.value.emailId != '' && !this.mailFlag) {
      this.smartContactForm.get('emailId').setValidators([Validators.required, Validators.pattern(this.mailpattern)]);
      this.smartContactForm.get('emailId').updateValueAndValidity();
      this.mailFlag = true;
    }
    else if ((this.smartContactForm.value.emailId == '' || this.smartContactForm.value.emailId == null) && this.mailFlag) {
      this.smartContactForm.get('emailId').clearAsyncValidators();
      this.smartContactForm.get('emailId').clearValidators();
      this.smartContactForm.get('emailId').updateValueAndValidity();
      this.mailFlag = false;
    }
  }
  createContact() {
    this.loading = true;
    if (this.smartContactForm.value.inputType == '1') {
      switch (this.loginInfo.roles[0].roleCode) {
        case userType.NormalUser:
          let ICreateUser = {
            address: "",
            emailId: this.smartContactForm.value.emailId,
            firstName: this.smartContactForm.value.firstName,
            lastName: this.smartContactForm.value.lastName,
            mobileNo: this.smartContactForm.value.mobileNo,
            contactgroups: this.smartContactForm.value.group,
            userId: this.loginInfo.userId
          } as IContactUser;
          console.log("ICreateUser=>" + JSON.stringify(ICreateUser));
          this.smartdirectoryService.createContactUser(ICreateUser).subscribe(
            (response: ISmartResponse) => {
              if (response.status) {
                this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
                this.dialogRef.close(ICreateUser);
              } else {
                this.alertMessage.showAlert(response.message, ActionType.FAILED);
              }
              this.loading = false;
            },
            error => {
              let message = error.error.message as string;
              let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
              console.error("E-createContact==>", JSON.stringify(error));
              this.showAlert(errorMessage, ActionType.ERROR, error.status);
              this.loading = false;
            }
          );
          break;
        case userType.DepartementAdmin:
          let ICreateDept = {
            address: "",
            emailId: this.smartContactForm.value.emailId,
            firstName: this.smartContactForm.value.firstName,
            lastName: this.smartContactForm.value.lastName,
            mobileNo: this.smartContactForm.value.mobileNo,
            groups: this.smartContactForm.value.group,
            deptId: this.loginInfo.depts[0].deptId
          } as IContactDept;
          console.log("ICreateDept=>" + JSON.stringify(ICreateDept));
          this.smartdirectoryService.createDepartmentContact(ICreateDept).subscribe((response: ISmartResponse) => {
            console.log("response=>", response);
            if (response.status) {
              this.alertMessage.showAlert(
                response.message,
                ActionType.SUCCESS
              );
              this.dialogRef.close(ICreateDept);
            } else {
              this.alertMessage.showAlert(
                response.message,
                ActionType.FAILED
              );
            }
            this.loading = false;
          },
            error => {
              let message = error.error.message as string;
              let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
              console.error("E-createContact==>", JSON.stringify(error));
              this.showAlert(errorMessage, ActionType.ERROR, error.status);
              this.loading = false;
            }
          );
          break;
        default:
          let ICreateGlobal = {
            address: "",
            emailId: this.smartContactForm.value.emailId,
            firstName: this.smartContactForm.value.firstName,
            lastName: this.smartContactForm.value.lastName,
            mobileNo: this.smartContactForm.value.mobileNo,
            globelGroupIds: this.smartContactForm.value.group
          } as IContactGlobal;
          console.log("ICreateGlobal=>" + JSON.stringify(ICreateGlobal));
          this.smartdirectoryService.createContactGlobal(ICreateGlobal).subscribe(
            (response: ISmartResponse) => {
              if (response.status) {
                this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
                this.dialogRef.close(ICreateGlobal);
              } else {
                this.alertMessage.showAlert(response.message, ActionType.FAILED);
              }
              this.loading = false;
            },
            error => {
              let message = error.error.message as string;
              let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
              console.error("E-createContact==>", JSON.stringify(error));
              this.showAlert(errorMessage, ActionType.ERROR, error.status);
              this.loading = false;
            }
          );
          break;
      }
    } else {
      console.log("Bulk==>");
      let groupType = 1;
      let deptId = 0;
      let userId = 0;
      switch (this.loginInfo.roles[0].roleCode) {
        case userType.NormalUser:
          groupType = 3;
          userId = this.loginInfo.userId;
          break;
        case userType.DepartementAdmin:
          deptId = this.loginInfo.depts[0].deptId
          groupType = 2;
          break;
        case userType.PlatFormAdmin:
        case userType.SuperAdmin:
        default:
          groupType = 1;
          break;
      }
      let bulkContact = {
        addressColumn: '',
        deptId: deptId,
        emailIdColumn: this.smartContactForm.value.emailAddressField,
        fileType: this.smartContactForm.value.fileType,
        firstNameColumn: this.smartContactForm.value.firstNameField,
        groupIds: this.smartContactForm.value.group,
        groupType: groupType,
        header: true,
        headers: this.selectheaders.join('#'),
        lastNameColumn: this.smartContactForm.value.lastNameField,
        mobileColumn: this.smartContactForm.value.mobileNumberField,
        sheetName: this.smartContactForm.value.selectSheet,
        userId: userId
      } as IBulkContact;
      const formData = new FormData();
      formData.append("file", this._selectedFile);
      formData.append("contactDto", new Blob([JSON.stringify(bulkContact)], { type: "application/json" }));
      console.log("bulkContact=>", bulkContact);
      this.smartdirectoryService.createBulkContact(formData).subscribe((response: ISmartResponse) => {
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

  updateContact() {
    this.loading = true;
    console.log("Role Type", this.loginInfo.roles[0].roleCode, JSON.stringify(this.editData));
    switch (this.loginInfo.roles[0].roleCode) {
      case userType.NormalUser:
        let IUpdateUser = {
          address: "",
          emailId: this.smartContactForm.value.emailId,
          firstName: this.smartContactForm.value.firstName,
          lastName: this.smartContactForm.value.lastName,
          mobileNo: this.smartContactForm.value.mobileNo,
          cntUserId: this.editData.data.cntUserId,
          userId: this.editData.data.userId
        } as IuserContact;
        console.log("ICreateUser=>" + JSON.stringify(IUpdateUser));
        this.smartdirectoryService.updateContactUser(IUpdateUser).subscribe((response: ISmartResponse) => {
          if (response.status) {
            this.editData.data.cntUserId = IUpdateUser.cntUserId;
            this.editData.data.userId = IUpdateUser.userId;
            this.editData.data.emailId = this.smartContactForm.value.emailId;
            this.editData.data.firstName = this.smartContactForm.value.firstName;
            this.editData.data.lastName = this.smartContactForm.value.lastName;
            this.editData.data.mobileNo = this.smartContactForm.value.mobileNo;
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            this.dialogRef.close(this.editData);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        },
          error => {
            let message = error.error.message as string;
            let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
            console.error("E-updateContact==>", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          }
        );
        break;
      case userType.DepartementAdmin:
        let IUpdateDept = {
          address: "",
          emailId: this.smartContactForm.value.emailId,
          firstName: this.smartContactForm.value.firstName,
          lastName: this.smartContactForm.value.lastName,
          mobileNo: this.smartContactForm.value.mobileNo,
          cntDeptId: this.editData.data.cntDeptId,
          deptId: this.editData.data.deptId
        } as IUDeptContact;
        console.log("ICreateDept=>" + JSON.stringify(IUpdateDept));
        this.smartdirectoryService.updateDepartmentContact(IUpdateDept).subscribe((response: ISmartResponse) => {
          if (response.status) {
            this.editData.data.emailId = this.smartContactForm.value.emailId;
            this.editData.data.firstName = this.smartContactForm.value.firstName;
            this.editData.data.lastName = this.smartContactForm.value.lastName;
            this.editData.data.mobileNo = this.smartContactForm.value.mobileNo;
            this.alertMessage.showAlert(
              response.message,
              ActionType.SUCCESS
            );
            this.dialogRef.close(this.editData);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        },
          error => {
            let message = error.error.message as string;
            let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
            console.error("E-updateContact==>", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          }
        );
        break;
      default:
        let IUpdateGlobal = {
          address: "",
          emailId: this.smartContactForm.value.emailId,
          firstName: this.smartContactForm.value.firstName,
          lastName: this.smartContactForm.value.lastName,
          mobileNo: this.smartContactForm.value.mobileNo,
          cntGlobalId: this.editData.data.cntGlobalId
        } as IUpdateGlobalContact;
        console.log("IupdateGlobal=>" + JSON.stringify(IUpdateGlobal));
        this.smartdirectoryService.updateContactGlobal(IUpdateGlobal).subscribe((response: ISmartResponse) => {
          if (response.status) {
            this.alertMessage.showAlert(response.message, ActionType.SUCCESS);
            this.editData.data.emailId = this.smartContactForm.value.emailId;
            this.editData.data.firstName = this.smartContactForm.value.firstName;
            this.editData.data.lastName = this.smartContactForm.value.lastName;
            this.editData.data.mobileNo = this.smartContactForm.value.mobileNo;
            this.dialogRef.close(this.editData);
          } else {
            this.alertMessage.showAlert(response.message, ActionType.FAILED);
          }
          this.loading = false;
        },
          error => {
            let message = error.error.message as string;
            let errorMessage = error.status == 404 ? this.translate.instant("ActionNames.errorResponse") : message ? message : error.message;
            console.error("E-updateContact==>", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          }
        );
        break;
    }
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401) this.router.navigate(["401"]);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  close() {
    this.dialogRef.close();
  }
  onFileUpload(event) {
    console.log("inputData=>", this.smartContactForm.value.inputType);
    if (event.target) {
      this.smartContactForm.get('selectSheet').setValue(null);
      this.excelSheetData = [] as XLSX.Sheet[];
      let fcount: number
      this._count = fcount;
      const fileList: FileList = event.target.files;
      console.log("frmData=>1", event.target.files);
      if (fileList.length > 0) {
        const file: File = fileList[0];
        let extension = (file.name as string).split('.').pop();
        this.selectheaders = [];
        this.smartContactForm.get('firstNameField').setValue(null);
        this.smartContactForm.get('lastNameField').setValue(null);
        this.smartContactForm.get('mobileNumberField').setValue(null);
        this.smartContactForm.get('emailAddressField').setValue(null);
        this.smartContactForm.get('selectSheet').setValue(null);
        this.smartContactForm.get('filename').setValue(null);
        this.smartContactForm.get('fileType').setValue(null);
        if (extension == "xlsx" || extension == "xls" || extension == "txt" || extension == "csv") {
          this._selectedFile = null;
          this.smartContactForm.get('filename').setValue(file.name);
          this.smartContactForm.get('fileType').setValue(extension);
          if (extension == "xlsx" || extension == "xls") {
            this._selectedFile = fileList[0];
            this.smartContactForm.get('selectSheet').setValidators(Validators.required);
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
                console.log('sheet1');
                this.smartContactForm.get('selectSheet').setValue(this._excelSheetNames[0])
                if (this.excelSheetData) {
                  let columndata = this.excelSheetData.filter(x => x.viewValue == this._excelSheetNames[0])[0].value;
                  this._count = columndata.length - 1;
                  console.log('count', this._count);
                  let keysData = this._count > 0 ? columndata[0] : [];
                  keysData = keysData.filter(x => (x + '').trim() != '');
                  let columnsCount: number = keysData.length;
                  if (this._count > 0 && columnsCount >= 3) {
                    this.selectheaders = keysData;
                  }
                  else {
                    this.showAlert(this.translate.instant('smartDirectoryModule.createsmartcontact.invalidFile'), ActionType.FAILED);
                  }
                }
                else
                  this.alertMessage.showAlert(this.translate.instant('smartDirectoryModule.createsmartcontact.fileError'), ActionType.FAILED);
              }
              console.log("excelSheetData=>", this.excelSheetData);
            };
            reader.readAsArrayBuffer(target.files[0]);
          }
          else if (extension == "txt" || extension == "csv") {
            this._excelSheetNames = [];
            this.excelSheetData = [];
            this.smartContactForm.get('selectSheet').clearValidators();
            this.smartContactForm.get('selectSheet').updateValueAndValidity();
            this._selectedFile = fileList[0];
            this.papa.parse(file, {
              delimiter: ',', header: false, newline: '\r\n',
              beforeFirstChunk: (chunk: string) => {
                return chunk
              },
              complete: (results) => {
                console.log("results=>", results);
                if (results.data.length > 1) {
                  let _fileText = results.data;
                  console.log("columns=>", _fileText[0].filter(x => (x + '').trim() != ''));
                  this._count = _fileText.length - 1
                  let keysData = _fileText[0];
                  keysData = keysData.filter(x => (x + '').trim() != '');
                  let columnsCount: number = keysData.length;
                  if (this._count > 0 && columnsCount >= 3) {
                    this.selectheaders = keysData;
                  }
                  else {
                    this.showAlert(this.translate.instant('smartDirectoryModule.createsmartcontact.invalidFile'), ActionType.FAILED);
                  }
                }
                else {
                  this.alertMessage.showAlert(this.translate.instant('smartDirectoryModule.createsmartcontact.invalidFile'), ActionType.FAILED);
                }
              }
            });
          }
          this.smartContactForm.get('inputType').setValue('2');
          this.smartContactForm.updateValueAndValidity();
        }
        else {
          this.alertMessage.showAlert(this.translate.instant('smartDirectoryModule.createsmartcontact.acceptFiles'), ActionType.FAILED);
          this.smartContactForm.get('fileType').setValue(null);
        }
      }
      event.srcElement.value = null;
    }
    this.smartContactForm.get('firstNameField').setValidators([Validators.required]);
    this.smartContactForm.get('firstNameField').updateValueAndValidity();
    this.smartContactForm.get('lastNameField').setValidators([Validators.required]);
    this.smartContactForm.get('lastNameField').updateValueAndValidity();
    this.smartContactForm.get('mobileNumberField').setValidators([Validators.required]);
    this.smartContactForm.get('mobileNumberField').updateValueAndValidity();
    this.smartContactForm.get('emailAddressField').updateValueAndValidity();
    this.smartContactForm.get('firstName').setValue(null);
    this.smartContactForm.get('firstName').clearValidators();
    this.smartContactForm.get('firstName').updateValueAndValidity();
    this.smartContactForm.get('lastName').setValue(null);
    this.smartContactForm.get('lastName').clearValidators();
    this.smartContactForm.get('lastName').updateValueAndValidity();
    this.smartContactForm.get('mobileNo').setValue(null);
    this.smartContactForm.get('mobileNo').clearValidators();
    this.smartContactForm.get('mobileNo').updateValueAndValidity();
    this.smartContactForm.get('emailId').setValue(null);
    this.smartContactForm.get('emailId').clearValidators();
    this.smartContactForm.get('emailId').clearAsyncValidators();
    this.smartContactForm.get('emailId').updateValueAndValidity();
    this.smartContactForm.get('fileType').setValidators([Validators.required]);
    this.smartContactForm.get('filename').setValidators([Validators.required]);
    this.smartContactForm.get('fileType').updateValueAndValidity();
    this.smartContactForm.get('filename').updateValueAndValidity();
  }

  selectSheet(event) {
    console.log('select sheet');
    this.selectheaders = [];
    this.smartContactForm.get('firstNameField').setValue(null);
    this.smartContactForm.get('lastNameField').setValue(null);
    this.smartContactForm.get('mobileNumberField').setValue(null);
    this.smartContactForm.get('emailAddressField').setValue(null);
    if (this.excelSheetData) {
      let columndata = this.excelSheetData.filter(x => x.viewValue == event.value)[0].value;
      console.log("columndata", columndata);
      this._count = columndata.length - 1;
      let keysData = this._count > 0 ? columndata[0] : [];
      keysData = keysData.filter(x => (x + '').trim() != '');
      let columnsCount: number = keysData.length;
      if (this._count > 0 && columnsCount >= 3) {
        this.selectheaders = keysData;
      }
      else {
        this.showAlert(this.translate.instant('smartDirectoryModule.createsmartcontact.invalidFile'), ActionType.FAILED);
      }
    }
  }
  singleContact() {
    this.excelSheetData = [];
    this._excelSheetNames = [];
    this.selectheaders = [];
    this._selectedFile = null;
    let fcount: number;
    this._count = fcount;
    this.smartContactForm.get('selectSheet').setValue(null);
    this.smartContactForm.get('selectSheet').clearValidators();
    this.smartContactForm.get('selectSheet').updateValueAndValidity();
    this.smartContactForm.get('firstNameField').setValue(null);
    this.smartContactForm.get('firstNameField').clearValidators();
    this.smartContactForm.get('firstNameField').updateValueAndValidity();
    this.smartContactForm.get('lastNameField').setValue(null);
    this.smartContactForm.get('lastNameField').clearValidators();
    this.smartContactForm.get('lastNameField').updateValueAndValidity();
    this.smartContactForm.get('mobileNumberField').setValue(null);
    this.smartContactForm.get('mobileNumberField').clearValidators();
    this.smartContactForm.get('mobileNumberField').updateValueAndValidity();
    this.smartContactForm.get('emailAddressField').setValue(null);
    this.smartContactForm.get('emailAddressField').updateValueAndValidity();
    this.smartContactForm.get('firstName').setValue(null);
    this.smartContactForm.get('firstName').setValidators([Validators.required]);
    this.smartContactForm.get('firstName').updateValueAndValidity();
    this.smartContactForm.get('lastName').setValue(null);
    this.smartContactForm.get('lastName').setValidators([Validators.required]);
    this.smartContactForm.get('lastName').updateValueAndValidity();
    this.smartContactForm.get('mobileNo').setValue(null);
    this.smartContactForm.get('mobileNo').setValidators([Validators.required]);
    this.smartContactForm.get('mobileNo').updateValueAndValidity();
    this.smartContactForm.get('emailId').setValue(null);
    this.smartContactForm.get('emailId').clearAsyncValidators();
    this.smartContactForm.get('emailId').clearValidators();//setValidators([Validators.required, Validators.pattern(this.patternEmail)]);
    this.smartContactForm.get('emailId').updateValueAndValidity();
    this.smartContactForm.get('filename').setValue(null);
    this.smartContactForm.get('fileType').setValue(null);
    this.smartContactForm.get('fileType').clearValidators()
    this.smartContactForm.get('filename').clearValidators()
    this.smartContactForm.get('fileType').updateValueAndValidity();
    this.smartContactForm.get('filename').updateValueAndValidity();
    this.fileList = null;
    console.log("FileList in single:::::", this.fileList);
  }
}