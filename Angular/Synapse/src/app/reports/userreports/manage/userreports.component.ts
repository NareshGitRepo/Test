import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto, userType } from '../../../_helpers/app.config';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { UserreportsService } from '../_service/userreports.service';
import { UserReport, Department, User, Idate, dateType, IuserType } from '../_model/userreport.model';
import { environment } from '../../../../environments/environment';
import { ArabicTtfValue } from '../../../_helpers/ArabicTtfValue';
declare let jsPDF;

@Component({
  selector: 'app-userreports',
  templateUrl: './userreports.component.html',
  styleUrls: ['./userreports.component.scss']
})
export class UserreportsComponent implements OnInit {
  dataSource: MatTableDataSource<UserReport>;
  displayedColumns = ['Department', 'UserName', 'Date', 'Sent', 'Delivered', 'Failed'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  userReportsFlag: boolean = false;
  userReportsForm: FormGroup;
  userReportsList: UserReport[] = [];
  filteruserReportsList: UserReport[] = [];
  loading: boolean = false;
  loginInfo: IUserUpdateDto;
  sourceDate: Date = new Date();
  departmentWithUsersList: Department[] = [];
  globalUsers: User[];
  usersList: User[] = [];
  _roleCode: string = "";
  submittedData: any;
  public listPage = 0;
  pageSize = environment.pageSize;
  fromDate: Date;
  toDate: Date;
  isToday: boolean = false;
  tokenInfo: ITokenInfo;
  currentDateDate: Idate;
  deptName: string = '';
  userName: string = '';
  DateType = [
    { id: 0, type: "Today" },
    { id: 1, type: "Date Range" }];
  dateFormatFlag: boolean = false;
  constructor(private fb: FormBuilder, private router: Router, private alertMessage: AlertMessageService, private translate: TranslateService,
    private _service: UserreportsService, private appconfig: AppConfig, private arabicTTF: ArabicTtfValue,
    private datePipe: DatePipe) {
    this.tokenInfo = this.appconfig.getTokenInfo() as ITokenInfo;
    if (this.tokenInfo) {
      this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      console.log("rolename::::", this._roleCode);
    } else {
      this.router.navigate(['401']);
    }
  }

  ngOnInit() {
    this.userReportsForm = this.fb.group({
      userType: ['1', Validators.required],
      department: [null, Validators.required],
      dateType: [null, Validators.required],
      user: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });

    if (this.tokenInfo) {
      this.loading = true;
      this.getCurrentDate();
    }
  }
  getCurrentDate() {
    this._service.getCurrentDate().subscribe((result: Idate) => {
      if (result) {
        this.currentDateDate = result;
      }
      this.AfterCurrentDateLoading();
    }, error => {
      this.loading = false;
      this.departmentWithUsersList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      console.error("E-onSubmit==>", JSON.stringify(error));
      let currentDateFrom = new Date();
      let currentDateTo = new Date();
      this.toDate = new Date(currentDateTo.setDate(currentDateTo.getDate() - 1));
      this.fromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      console.log("currentDate==>", currentDateTo, currentDateFrom);
      this.AfterCurrentDateLoading();
    });
  }
  changeUserType() {
    console.log("Change User==>", this.userReportsForm.value.userType);
    this.userReportsForm.get('department').setValue(null);
    this.userReportsForm.get('user').setValue(null);
    if (this.userReportsForm.value.userType == IuserType.globalUser) {
      this.userReportsForm.get('department').clearValidators();
      this.userReportsForm.get('department').updateValueAndValidity();
    } else {
      this.userReportsForm.get('department').setValidators(Validators.required);
      this.userReportsForm.get('department').updateValueAndValidity();
    }

  }

  getGlobalUsersByRoleId() {
    console.log("entered getGlobalUsersByRoleId");

    this._service.getGlobalUsers().subscribe((response: User[]) => {
      if (response) {
        console.log("getGlobalUsers Response==>", response);
        this.globalUsers = response;
      } else {
        this.globalUsers = [];
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getAllUsers==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  AfterCurrentDateLoading() {
    this.loading = true;
    this.userReportsForm.get('dateType').setValue(dateType.Today);
    if (userType.NormalUser != this._roleCode)
      this.getDetails(true);
    else {
      this.userReportsForm.patchValue({
        department: this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0,
        user: [this.loginInfo.userId]

      });
      console.log("userReportsForm==>", this.userReportsForm);
      this.DateSelection(this.userReportsForm.value.dateType)
    }
  }

  getDetails(action?: boolean) {
    this.loading = true;
    this._service.getDepartmentswithUser().subscribe((result: Department[]) => {
      if (result) {
        console.log("Response==>Active", result)
        this.departmentWithUsersList = result;
        console.log('departmentWithUsersList=>', this.departmentWithUsersList);
        if (userType.DepartementAdmin == this._roleCode) {
          this.userReportsForm.get('department').setValue(this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0);
          let index = this.departmentWithUsersList.findIndex(x => x.deptId == (this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0));
          if (index != -1) {
            this.usersList = this.departmentWithUsersList[index].users;
            console.log("usersList=>", this.usersList);
          }
        }
      }
      if (action) {
        this.DateSelection(this.userReportsForm.value.dateType)
      }
      else
        this.loading = false;

      if (!this.globalUsers)
        this.getGlobalUsersByRoleId();
    }, error => {
      this.departmentWithUsersList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getDetails==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      if (action) {
        this.DateSelection(this.userReportsForm.value.dateType)
      }
      else
        this.loading = false;
    });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }


  departSelected() {
    console.log("groupDepartment==>", this.userReportsForm.value.department);
    this.deptName = ''
    this.usersList = [];
    let deptSelected = this.userReportsForm.value.department;
    if (deptSelected.length > 0) {
      let findex = this.departmentWithUsersList.findIndex(y => y.deptId == deptSelected[0].deptId);
      if (findex != -1) {
        this.deptName = this.departmentWithUsersList[findex].deptName;
      }
      let filterdeptList = this.departmentWithUsersList.filter(x => deptSelected.findIndex(y => y.deptId == x.deptId) != -1);
      //console.log("filterdeptList===>",filterdeptList);

      filterdeptList.forEach(y => {
        if (y.users.length > 0) {
          y.users.forEach(z => {
            this.usersList.push(z);
          });
        }
      });
      if (filterdeptList.length > 0 && this.userReportsForm.value.user != null) {
        let userSelected: number[] = [];
        userSelected = this.userReportsForm.value.user;
        let userselect = userSelected.filter(x => this.usersList.findIndex(y => y.userId + '' == x + '') != -1);
        this.userReportsForm.get('user').setValue(userselect);
        this.UserSelection();
      }
      else
        this.userReportsForm.get('user').setValue(null);
    }
  }
  UserSelection() {
    console.log("userSelected==>", this.userReportsForm.value.user);
    this.userName = '';
    let userSelected: number[] = [];
    userSelected = this.userReportsForm.value.user;
    console.log("userSelected==>", this.userReportsForm.value.user);
    if (userSelected.length > 0) {
      if (this.userReportsForm.value.userType == IuserType.deptUser) {
        let findex = this.usersList.findIndex(y => y.userId == userSelected[0]);
        if (findex != -1) {
          this.userName = this.usersList[findex].login;
        }
      }
      else {
        let findex = this.globalUsers.findIndex(y => y.userId == userSelected[0]);
        if (findex != -1) {
          this.userName = this.globalUsers[findex].login;
        }
      }
    }
  }
  DateSelection(selectedType) {
    console.log("selectedDateType==>", selectedType)
    if (selectedType == dateType.Today) {
      this.isToday = false;
      if (this.currentDateDate) {
        this.fromDate = this.toDate = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        console.log("FromDate:::::", this.fromDate);
        console.log("toDate==>", this.toDate);
      }
      else {
        this.fromDate = new Date();
        console.log("FromDate===>", this.fromDate);
        this.toDate = new Date();
        console.log("toDate==>", this.toDate);
      }
      this.userReportsForm.get('toDate').clearValidators();
      this.userReportsForm.get('toDate').updateValueAndValidity();
      this.userReportsForm.get('fromDate').clearValidators();
      this.userReportsForm.get('fromDate').updateValueAndValidity();
      this.userReportsForm.get('fromDate').setValue(this.fromDate + '')
      this.userReportsForm.get('toDate').setValue(this.toDate + '');
    }
    else {
      this.isToday = true;
      this.userReportsForm.get('toDate').setValidators(Validators.required);
      this.userReportsForm.get('toDate').updateValueAndValidity();
      this.userReportsForm.get('fromDate').setValidators(Validators.required);
      this.userReportsForm.get('fromDate').updateValueAndValidity();
      this.userReportsForm.get('fromDate').setValue(null);
      this.userReportsForm.get('toDate').setValue(null);
      if (this.currentDateDate) {
        let currentDateFrom = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        let currentDateTo = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        this.toDate = new Date(currentDateTo.setDate(currentDateTo.getDate() - 1));
        this.fromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      }
      else {
        let tdy = new Date();
        this.fromDate = new Date(tdy.setMonth(tdy.getMonth() - 3));
        let tdy1 = new Date();
        this.toDate = new Date(tdy1.setDate(tdy1.getDate() - 1));
      }
    }
    this.loading = false;
  }

  onSubmit() {
    this.loading = true;
    this.dateFormatFlag = false;
    let fromdate = this.datePipe.transform(this.userReportsForm.value.fromDate, "yyyy-MM-dd");
    let toDate = this.datePipe.transform(this.userReportsForm.value.toDate, "yyyy-MM-dd");
    fromdate = fromdate + " 00:00:00";
    toDate = toDate + " 23:59:59";
    this.submittedData = {
      "selectionType": '' + this.userReportsForm.value.dateType,
      "fromDate": fromdate,
      "toDate": toDate,
      "users": this.userReportsForm.value.user
    }
    console.log("GetReport==>" + JSON.stringify(this.submittedData), this.userReportsForm.value.user);
    this._service.getUserReport(this.submittedData).subscribe((response: UserReport[]) => {
      console.log("response=>", response);
      if (response.length > 0) {
        this.userReportsList = response;
        this.dataSource = new MatTableDataSource(this.userReportsList);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      }
      else {
        this.userReportsList = [];
        this.userReportsFlag = true;
      }
      this.loading = false;
    }, error => {
      this.userReportsList = [];
      this.userReportsFlag = true;
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onSubmit==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getListData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filteruserReportsList = this.userReportsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    console.log("filteruserReportsList==>" + JSON.stringify(this.filteruserReportsList));
    this.dataSource = new MatTableDataSource(this.filteruserReportsList);
  }

  ExportTOExcel() {
    if (!this.dateFormatFlag) {
      this.dateFormatFlag = true;
      this.userReportsList.forEach(n => {
        n.Date = n.Date == null ? '' : this.datePipe.transform(new Date((n.Date).replace(/\s/g, "T")), "yyyy-MM-dd");
        return n;
      });
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.userReportsList.map(data => _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    XLSX.writeFile(wb, 'User_Reports_' + dateDownload + '.xlsx');
  }
  convertData(value) {
    return value == null ? '' : new Date((value).replace(/\s/g, "T"));
  }
  ExportTOCsv() {
    if (!this.dateFormatFlag) {
      this.dateFormatFlag = true;
      this.userReportsList.forEach(n => {
        n.Date = n.Date == null ? '' : this.datePipe.transform(new Date((n.Date).replace(/\s/g, "T")), "yyyy-MM-dd");
        return n;
      });
    }
    console.log("userReportsList==>", JSON.stringify(this.userReportsList));
    var options = {
      noDownload: false,
      headers: ['Department', 'UserName', 'Date', 'Sent', 'Delivered', 'Failed']//this.displayedColumns,
    };
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    new Angular5Csv(this.userReportsList.map(data => _.pick(data, this.displayedColumns)), 'User_Reports_' + dateDownload, options);
  }
  ExportTOPdf() {
    let t1 = performance.now();
    let doc = new jsPDF('l', 'pt');
    let getColumnHeaders = [['Department', 'UserName', 'Date', 'Sent', 'Delivered', 'Failed']];
    let groupedDataRows = [];

    if (!this.dateFormatFlag) {
      this.dateFormatFlag = true;
      this.userReportsList.forEach(n => {
        n.Date = n.Date == null ? '' : this.datePipe.transform(new Date((n.Date).replace(/\s/g, "T")), "yyyy-MM-dd");
        return n;
      });
    }

    this.userReportsList.forEach(item => {
      let temp = [item.Department,
      item.UserName,
      item.Date,
      item.Sent,
      item.Delivered,
      item.Failed];
      groupedDataRows.push(temp);
    });
    console.log("User reports groupedDataRows==>", groupedDataRows);
    const isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent);
    if (!isIEOrEdge) {
      doc.addFileToVFS('Amiri-Regular.ttf', this.arabicTTF.arbicTtfString);
      doc.addFont('Amiri-Regular.ttf', 'arabicfont', 'normal');
      doc.addFont('Amiri-Regular.ttf', 'arabicfont', 'bold');
      doc.setFont('arabicfont');
    }
    doc.autoTable({
      head: getColumnHeaders,
      body: groupedDataRows,
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
        overflow: 'linebreak', cellWidth: 'wrap',font: "arabicfont",
        fontSize: 10,
        cellPadding: 8, overflowColumns: 'linebreak'
      },
    });
    let t2 = performance.now();
    console.log("Call to doSomething took " + (t2 - t1) + " milliseconds.");
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    doc.save('UserWise_Reports_' + dateDownload + '.pdf');
  }

  sortData() {
    this.dataSource.sort = this.sort
  }
}