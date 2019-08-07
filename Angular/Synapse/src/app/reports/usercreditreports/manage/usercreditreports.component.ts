import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig, IUserUpdateDto, ITokenInfo, userType } from '../../../_helpers/app.config';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { UserCreditReportService } from '../_service/usercreditreport.service';
import { DeptInfo, IDepartment, Idate, User, creditmanageType, ICreditReportInfo, GlobalAuditLogInfo } from '../_model/usercredit.model';
import { ArabicTtfValue } from '../../../_helpers/ArabicTtfValue';
declare var jsPDF: any;
@Component({
  selector: 'app-usercreditreports',
  templateUrl: './usercreditreports.component.html',
  styleUrls: ['./usercreditreports.component.scss']
})
export class UsercreditreportsComponent implements OnInit {
  ecreditmanageType: creditmanageType;
  public listPage = 0;
  public pageSize = environment.pageSize;
  userCreditReportForm: FormGroup;
  deptUsersList: IDepartment[] = []
  deptCreditReportList: ICreditReportInfo[] = [];
  userCreditReportList: ICreditReportInfo[] = [];
  platFormCreditList: GlobalAuditLogInfo[] = [];
  filterUserCreditReport: ICreditReportInfo[] = [];
  filterPlatCreditReport: GlobalAuditLogInfo[] = [];
  usersList: User[] = []
  userdataSource: MatTableDataSource<ICreditReportInfo>;
  deptdataSource: MatTableDataSource<ICreditReportInfo>;
  platformdataSource: MatTableDataSource<ICreditReportInfo>;
  loginInfo: IUserUpdateDto;
  _roleCode: string = "";
  userName: string = '';
  loading: boolean = false;
  creditReportsFlag: boolean = false;
  usercreditReportsFlag: boolean = false;
  userwisedisplayColumns = ['userName', 'creditName', 'newValue', 'oldValue', 'transactionName', 'actionDoneByUser', 'updatedOn']
  deptwisedisplayColumns = ['deptName', 'creditName', 'newValue', 'oldValue', 'transactionName', 'actionDoneByUser', 'updatedOn'];
  platformwisedisplayColumns = ['creditName', 'newValue', 'oldValue', 'transactionName', 'actionDoneByUser', 'updatedOn'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  sourceDate: Date = new Date();
  minDate: Date = new Date(this.sourceDate.getFullYear(), this.sourceDate.getMonth() - 3, this.sourceDate.getDate());
  fromDate: Date;
  toDate: Date;
  tokenInfo: ITokenInfo;
  currentDateDate: Idate;
  deptName: any;
  creditlistFlag: number;
  constructor(private fb: FormBuilder, private _service: UserCreditReportService, private router: Router,
    private alertMessage: AlertMessageService, private translate: TranslateService, private arabicTTF: ArabicTtfValue,
    private appconfig: AppConfig, private datePipe: DatePipe) {
    this.tokenInfo = this.appconfig.getTokenInfo() as ITokenInfo;
    if (this.tokenInfo) {
      this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      console.log("rolename::::", this._roleCode);
    }
    else
      this.router.navigate(['401'])
  }

  ngOnInit() {
    this.userCreditReportForm = this.fb.group({
      typeWise: [creditmanageType.Departmentwise, [Validators.required]],
      departmentName: [null, [Validators.required]],
      creditUser: [null],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });

    if (this.tokenInfo) {
      this.getCurrentDate();
    }

  }
  getCurrentDate() {
    this.loading = true;
    this._service.getCurrentDate().subscribe((result: Idate) => {
      if (result) {
        this.currentDateDate = result;
        let currentDateFrom = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        let currentDateTo = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        this.toDate = new Date(currentDateTo);
        this.fromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      }
      this.AfterCurrentDateLoading();
    }, error => {
      this.loading = false;
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onSubmit==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      let currentDateFrom = new Date();
      let currentDateTo = new Date();
      this.toDate = new Date(currentDateTo.setDate(currentDateTo.getDate() - 1));
      this.fromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      console.log("currentDate==>", currentDateTo, currentDateFrom);
      this.AfterCurrentDateLoading();

    });
  }

  AfterCurrentDateLoading() {
    if (userType.SuperAdmin == this._roleCode || userType.PlatFormAdmin == this._roleCode) {
      this.getDepartments();
    }
    else {
      if (this._roleCode == userType.DepartementAdmin) {
        this.userCreditReportForm.get('typeWise').setValue(creditmanageType.Departmentwise);
        this.userCreditReportForm.patchValue({
          departmentName: this.loginInfo.depts.length > 0 ? [this.loginInfo.depts[0].deptId] : 0
        });
        this.getDepartments();
      }
      else {
        this.userCreditReportForm.get('typeWise').setValue(creditmanageType.UserWise);
        this.userCreditReportForm.get('creditUser').setValue([this.loginInfo.userId])
      }
      this.userTypeChange(false);
      this.loading = false;
    }
  }

  sortData() {
    if (this.creditlistFlag == creditmanageType.Departmentwise) {
      this.deptdataSource.sort = this.sort;
    }
    else if (this.creditlistFlag == creditmanageType.UserWise) {
      this.userdataSource.sort = this.sort;
    } else {
      this.platformdataSource.sort = this.sort;
    }
  }

  getDepartments() {
    this.loading = true;
    this._service.getDepartmentswithUser().subscribe((response: IDepartment[]) => {
      console.log("Response==>", response);
      if (response) {
        this.deptUsersList = response;
        console.log('deptUsersList=>', this.deptUsersList);
        if (userType.DepartementAdmin == this._roleCode) {
          this.userCreditReportForm.get('departmentName').setValue(this.loginInfo.depts.length > 0 ? [this.loginInfo.depts[0].deptId] : 0);
          let index = this.deptUsersList.findIndex(x => x.deptId == (this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0));
          if (index != -1) {
            this.usersList = this.deptUsersList[index].users;
          }
        }
      }
      this.loading = false;
    }, error => {
      this.deptUsersList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getDepartments==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  userTypeChange(action?: boolean) {
    if (action) {
      this.userCreditReportForm.get('creditUser').setValue(null);
      this.userCreditReportForm.get('departmentName').setValue(null);
    }
    if (!action) {
      this.userCreditReportForm.get('creditUser').clearValidators();
      this.userCreditReportForm.get('creditUser').updateValueAndValidity();
      this.userCreditReportForm.get('departmentName').clearValidators();
      this.userCreditReportForm.get('departmentName').updateValueAndValidity();
    }
    if (this.userCreditReportForm.value.typeWise == creditmanageType.Departmentwise) {
      this.userCreditReportForm.get('creditUser').clearValidators();
      this.userCreditReportForm.get('creditUser').updateValueAndValidity();
      if (this._roleCode == userType.DepartementAdmin) {
        this.userCreditReportForm.get('departmentName').setValue([this.loginInfo.depts[0].deptId]);
      }
    }
    else if (this.userCreditReportForm.value.typeWise == creditmanageType.UserWise) {
      this.userCreditReportForm.get('creditUser').setValidators([Validators.required]);
      this.userCreditReportForm.get('creditUser').updateValueAndValidity();
    } else {
      this.userCreditReportForm.get('creditUser').clearValidators();
      this.userCreditReportForm.get('creditUser').updateValueAndValidity();
      this.userCreditReportForm.get('departmentName').clearValidators();
      this.userCreditReportForm.get('departmentName').updateValueAndValidity();
    }
  }
  departmentChange() {
    console.log("departmentName=>", this.userCreditReportForm.value.departmentName);
    this.usersList = [];
    let deptData = this.userCreditReportForm.value.departmentName;
    if (this.userCreditReportForm.value.departmentName.length > 0) {
      let findex = this.deptUsersList.findIndex(y => y.deptId == deptData[0]);
      if (findex != -1) {
        this.deptName = this.deptUsersList[findex].deptName;
      }
      let filterdeptList = this.deptUsersList.filter(x => deptData.findIndex(y => y == x.deptId) != -1);
      console.log("filterdeptList==>", filterdeptList);

      filterdeptList.forEach(y => {
        if (y.users.length > 0) {
          y.users.forEach(z => {
            console.log(z);
            this.usersList.push(z);
          });
          console.log('usersList==>', this.usersList);
        }
      });
      if (filterdeptList.length > 0 && this.userCreditReportForm.value.creditUser != null) {
        let userSelected: number[] = [];
        userSelected = this.userCreditReportForm.value.creditUser;
        let userselect = userSelected.filter(x => this.usersList.findIndex(y => y.userId + '' == x + '') != -1);
        this.userCreditReportForm.get('creditUser').setValue(userselect);
        this.UserSelection();
      }
    }
    else {
      this.userCreditReportForm.get('creditUser').setValue(null);
    }
  }
  UserSelection() {
    this.userName = '';
    let userSelected: number[] = [];
    userSelected = this.userCreditReportForm.value.creditUser;
    console.log("userSelected==>", userSelected, this.userCreditReportForm.value.creditUser);
    if (userSelected.length > 0) {
      if (this.userCreditReportForm.value.typeWise == 1) {
        let findex = this.usersList.findIndex(y => y.userId == userSelected[0]);
        if (findex != -1) {
          this.userName = this.usersList[findex].login;
        }
      }
    }
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  onSubmit() {
    this.loading = true;
    this.usercreditReportsFlag = false;
    this.creditReportsFlag = false;
    let fromdate = this.datePipe.transform(this.userCreditReportForm.value.fromDate, "yyyy-MM-dd");
    let todate = this.datePipe.transform(this.userCreditReportForm.value.toDate, "yyyy-MM-dd");
    fromdate = fromdate + " 00:00:00";
    todate = todate + " 23:59:59";
    let searchdata: any;
    if (this.userCreditReportForm.value.typeWise == creditmanageType.UserWise || this.userCreditReportForm.value.typeWise == creditmanageType.Departmentwise) {
      if (this.userCreditReportForm.value.typeWise == creditmanageType.UserWise) {
        searchdata = {
          fromDate: fromdate,
          toDate: todate,
          users: this.userCreditReportForm.value.creditUser
        }
      }
      else {
        searchdata = {
          fromDate: fromdate,
          toDate: todate,
          depts: this.userCreditReportForm.value.departmentName
        }
      }
      console.log("searchdata=>", this.userCreditReportForm.value.typeWise, searchdata);
      this._service.getCreditAuditLogMutlitReport(this.userCreditReportForm.value.typeWise, searchdata).subscribe((response: ICreditReportInfo[]) => {
        if (response.length > 0) {
          console.log("UserCreditAudit==>", response);
          if (this.userCreditReportForm.value.typeWise == creditmanageType.Departmentwise) {
            this.creditlistFlag = creditmanageType.Departmentwise;
            this.deptCreditReportList = response;
            this.deptdataSource = new MatTableDataSource(this.deptCreditReportList);
            console.log('creditlistFlag', this.creditlistFlag, this.deptCreditReportList);
          }
          else {
            this.creditlistFlag = creditmanageType.UserWise;
            this.userCreditReportList = response;
            this.userdataSource = new MatTableDataSource(this.userCreditReportList);
          }
          this.listPage = 0;
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          if (this.userCreditReportForm.value.typeWise == creditmanageType.Departmentwise) {
            this.creditReportsFlag = true;
          }
          else {
            this.creditReportsFlag = true;
          }
          this.userCreditReportList = [];
          this.deptCreditReportList = [];

        }
        this.loading = false;
      }, error => {
        this.userCreditReportList = [];
        this.deptCreditReportList = [];
        this.creditReportsFlag = true;
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-onSubmit==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    } else {
      this._service.getCreditAuditLogForGlobalUsers(fromdate, todate).subscribe((response: GlobalAuditLogInfo[]) => {
        console.log("Response1=>", response);
        if (response.length > 0) {
          console.log("UserCreditAudit==>", response);
          if (this.userCreditReportForm.value.typeWise == creditmanageType.PlatformWise) {
            this.creditlistFlag = creditmanageType.PlatformWise;
            this.platFormCreditList = response;
            this.platformdataSource = new MatTableDataSource(this.platFormCreditList);
            console.log('creditlistFlag', this.creditlistFlag, this.platFormCreditList);
          }
          this.listPage = 0;
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          if (this.userCreditReportForm.value.typeWise == creditmanageType.PlatformWise) {
            this.creditReportsFlag = true;
          }
          else {
            this.creditReportsFlag = true;
          }
          this.platFormCreditList = [];
        }
        this.loading = false;
      }, error => {
        this.platFormCreditList = [];
        this.creditReportsFlag = true;
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-onSubmit==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
  }
  ExportTOExcel() {
    if (this.creditlistFlag == creditmanageType.Departmentwise) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.deptCreditReportList.map(data => _.pick(data, this.deptwisedisplayColumns)));
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      /* save to file */
      let tdy = new Date();
      let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
      XLSX.writeFile(wb, 'Department_CreditManagement_Reports_' + dateDownload + '.xlsx');
    }
    else if (this.creditlistFlag == creditmanageType.UserWise) {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.userCreditReportList.map(data => _.pick(data, this.userwisedisplayColumns)));
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      /* save to file */
      let tdy = new Date();
      let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
      XLSX.writeFile(wb, 'user_CreditManagement_Reports_' + dateDownload + '.xlsx');
    } else {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.platFormCreditList.map(data => _.pick(data, this.platformwisedisplayColumns)));
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      /* save to file */
      let tdy = new Date();
      let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
      XLSX.writeFile(wb, 'platform_CreditManagement_Reports_' + dateDownload + '.xlsx');
    }


  }

  ExportTOCsv() {
    if (this.creditlistFlag == creditmanageType.Departmentwise) {
      var options = {
        noDownload: false,
        headers: this.deptwisedisplayColumns,
      };
      let tdy = new Date();
      let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
      new Angular5Csv(this.deptCreditReportList.map(data => _.pick(data, this.deptwisedisplayColumns)), 'Department_CreditManagement_Reports_' + dateDownload, options);
    }
    else if (this.creditlistFlag == creditmanageType.UserWise) {
      var options = {
        noDownload: false,
        headers: this.userwisedisplayColumns,
      };
      let tdy = new Date();
      let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
      new Angular5Csv(this.userCreditReportList.map(data => _.pick(data, this.userwisedisplayColumns)), 'user_CreditManagement_Reports_' + dateDownload, options);
    } else {
      var options = {
        noDownload: false,
        headers: this.platformwisedisplayColumns,
      };
      let tdy = new Date();
      let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
      new Angular5Csv(this.platFormCreditList.map(data => _.pick(data, this.platformwisedisplayColumns)), 'Platform_CreditManagement_Reports_' + dateDownload, options);
    }
  }
  ExportTOPdf() {
    let doc = new jsPDF('l', 'pt');
    let headers = this.creditlistFlag == creditmanageType.Departmentwise ? [this.deptwisedisplayColumns] : (this.creditlistFlag == creditmanageType.PlatformWise ? [this.platformwisedisplayColumns] : [this.userwisedisplayColumns]);
    let rows = [];
    let temp: any;
    let pdfname: string = '';
    if (this.creditlistFlag == creditmanageType.Departmentwise) {
      this.deptCreditReportList.forEach(element => {
        temp = [element.deptName,
        element.creditName,
        element.newValue,
        element.oldValue,
        element.transactionName,
        element.actionDoneByUser,
        element.updatedOn,]
        pdfname = 'Department';
        rows.push(temp);
      });
    }
    else if (this.creditlistFlag == creditmanageType.UserWise) {
      this.userCreditReportList.forEach(element => {
        temp = [element.userName,
        element.creditName,
        element.newValue,
        element.oldValue,
        element.transactionName,
        element.actionDoneByUser,
        element.updatedOn
        ]
        rows.push(temp);
        pdfname = 'User';
        // console.log(headers, rows);
      });
    } else {
      console.log("Platform==>", this.platFormCreditList);

      this.platFormCreditList.forEach(element => {
        temp = [
          element.creditName,
          element.newValue,
          element.oldValue,
          element.transactionName,
          element.actionDoneByUser,
          element.updatedOn]
        rows.push(temp);
        pdfname = 'Platform';
      });
    }
    const isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent);
    if (!isIEOrEdge) {
      doc.addFileToVFS('Amiri-Regular.ttf', this.arabicTTF.arbicTtfString);
      doc.addFont('Amiri-Regular.ttf', 'arabicfont', 'normal');
      doc.addFont('Amiri-Regular.ttf', 'arabicfont', 'bold');
      doc.setFont('arabicfont');
    }
    doc.autoTable({
      head: headers,
      body: rows,
      startY: false, tableWidth: 'auto', cellWidth: 'wrap',
      tableLineColor: 200, tableLineWidth: 0,
      columnStyles: {
        0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' }, 2: { cellWidth: 'auto' }, 3:
          { cellWidth: 'auto' }, 4: { cellWidth: 'auto' },
        5: { cellWidth: 'auto' }, 6: { cellWidth: 'auto' }, 7: { cellWidth: 'auto' }, 8:
          { cellWidth: 'auto' }, 9: { cellWidth: 'auto' }, 10: { cellWidth: 'auto' }, 11: { cellWidth: 'auto' }, 12: { cellWidth: 'auto' }
      },
      headStyles: { theme: 'grid' },
      styles: {
        overflow: 'linebreak', cellWidth: 'wrap', font: "arabicfont",
        fontSize: 10,
        cellPadding: 8, overflowColumns: 'linebreak'
      },
    });
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    doc.save(pdfname + '_CreditManagement_Reports_' + dateDownload + '.pdf');
  }
  getListData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    if (this.creditlistFlag == creditmanageType.Departmentwise) {
      this.filterUserCreditReport = this.deptCreditReportList.filter(() => {
        index++;
        return (index > startingIndex && index <= endingIndex) ? true : false;
      });
      console.log("filterUserCreditReport==>" + JSON.stringify(this.filterUserCreditReport));
      this.deptdataSource = new MatTableDataSource(this.filterUserCreditReport);
    }
    else if (this.creditlistFlag == creditmanageType.UserWise) {
      this.filterUserCreditReport = this.userCreditReportList.filter(() => {
        index++;
        return (index > startingIndex && index <= endingIndex) ? true : false;
      });
      console.log("filterUserCreditReport==>" + JSON.stringify(this.filterUserCreditReport));
      this.userdataSource = new MatTableDataSource(this.filterUserCreditReport);
    } else {
      this.filterPlatCreditReport = this.platFormCreditList.filter(() => {
        index++;
        return (index > startingIndex && index <= endingIndex) ? true : false;
      });
      console.log("filterPlatCreditReport==>" + JSON.stringify(this.filterPlatCreditReport));
      this.platformdataSource = new MatTableDataSource(this.filterPlatCreditReport);
    }
  }
}