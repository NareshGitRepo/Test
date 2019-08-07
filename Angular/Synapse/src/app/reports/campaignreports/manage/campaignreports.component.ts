import * as XLSX from 'xlsx';
import * as _ from 'lodash';

import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto, userType } from '../../../_helpers/app.config';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Department, ICampaignReport, User, Idate, dateType, usersType } from '../_model/campaignreports.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import { CampaignReportsService } from '../_service/campaignreports.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { ArabicTtfValue } from '../../../_helpers/ArabicTtfValue';
declare var jsPDF: any;
@Component({
  selector: 'app-campaignreports',
  templateUrl: './campaignreports.component.html',
  styleUrls: ['./campaignreports.component.scss']
})
export class CampaignreportsComponent implements OnInit {
  public initPage = 0;
  public listPage = 0;
  public pageSize = environment.pageSize;
  DateType = [
    { id: 0, type: "Today" },
    { id: 1, type: "Date Range" }];
  campaignReportsForm: FormGroup;
  campaignReportList: ICampaignReport[] = [];
  filterListCampaigns: ICampaignReport[] = [];
  departmentWithUsersList: Department[] = [];
  filtercampaignReportList: ICampaignReport[] = [];
  dataSource: MatTableDataSource<ICampaignReport>;
  usersList: User[] = [];
  globalUsers: User[];
  displayedColumns = ['Date', 'CampaignId', 'CampaignName', 'Department', 'UserName', 'Uploaded', 'Sent', 'Delivered', 'Failed'];
  loginInfo: IUserUpdateDto;
  _roleCode: string = '';
  loading: boolean = false;
  DisplayString: string = "";
  deptName: string = '';
  userName: string = '';
  campaignFromDate: Date;
  campaignToDate: Date;
  gridLoad = false;
  dateFormatFlag = false;
  isToday: boolean = false;
  tokenInfo: ITokenInfo;
  currentDateDate: Idate;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private campaigReportService: CampaignReportsService,
    private alertMessage: AlertMessageService, private appconfig: AppConfig, private fb: FormBuilder, private arabicTTF: ArabicTtfValue,
    private translate: TranslateService, private router: Router, private datePipe: DatePipe) {
    this.tokenInfo = this.appconfig.getTokenInfo() as ITokenInfo;
    if (this.tokenInfo) {
      this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      console.log("rolename::::", this._roleCode);
    }
    else {
      this.router.navigate(['401']);
    }
  }

  ngOnInit() {
    this.campaignReportsForm = this.fb.group({
      typeOfUsers: [usersType.Deptusers, Validators.required],
      campaignDepartment: [null, Validators.required],
      dateType: [null, Validators.required],
      campaignUser: [null, Validators.required],
      campaignFromDate: ['', Validators.required],
      campaignToDate: ['', Validators.required],
    });
    if (this.tokenInfo) {
      this.getCurrentDate();
    }
  }
  getCurrentDate() {
    this.loading = true;
    this.campaigReportService.getCurrentDate().subscribe((result: Idate) => {
      if (result) {
        this.currentDateDate = result;
      }
      this.AfterCurrentDateLoading();
    }, error => {
      this.loading = false;
      this.departmentWithUsersList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onSubmit==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      let currentDateFrom = new Date();
      let currentDateTo = new Date();
      this.campaignToDate = new Date(currentDateTo.setDate(currentDateTo.getDate() - 1));
      this.campaignFromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      console.log("currentDate==>", currentDateTo, currentDateFrom);
      this.AfterCurrentDateLoading();
    });
  }
  AfterCurrentDateLoading() {
    this.loading = true;
    this.campaignReportsForm.get('dateType').setValue(dateType.Today);
    if (userType.NormalUser != this._roleCode)
      this.getDetails(true);
    else {
      this.campaignReportsForm.patchValue({
        campaignDepartment: this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0,
        campaignUser: [this.loginInfo.userId]

      });
      this.DateSelection(this.campaignReportsForm.value.dateType)
    }
  }
  userTypeSelection() {
    console.log(this.campaignReportsForm.value.typeOfUsers);
    this.campaignReportsForm.get('campaignDepartment').setValue(null);
    this.campaignReportsForm.get('campaignUser').setValue(null);
    if (this.campaignReportsForm.value.typeOfUsers == usersType.Deptusers) {
      this.campaignReportsForm.get('campaignDepartment').setValidators([Validators.required]);
      this.campaignReportsForm.get('campaignDepartment').updateValueAndValidity();
    }
    else {
      this.campaignReportsForm.get('campaignDepartment').clearValidators();
      this.campaignReportsForm.get('campaignDepartment').updateValueAndValidity();
    }
  }
  DateSelection(selectedType) {
    console.log("selectedDateType==>", selectedType)
    if (selectedType == dateType.Today) {
      this.isToday = false;
      if (this.currentDateDate) {
        this.campaignFromDate = this.campaignToDate = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        console.log("this.campaignFromDate:::::", this.campaignFromDate);
        console.log("this.campaignToDate:::::", this.campaignToDate);
      }
      else {
        this.campaignFromDate = new Date();
        console.log("this.campaignFromDate:::::", this.campaignFromDate);
        this.campaignToDate = new Date();
        console.log("this.campaignToDate:::::", this.campaignToDate);
      }
      this.campaignReportsForm.get('campaignToDate').clearValidators();
      this.campaignReportsForm.get('campaignToDate').updateValueAndValidity();
      this.campaignReportsForm.get('campaignFromDate').clearValidators();
      this.campaignReportsForm.get('campaignFromDate').updateValueAndValidity();
      this.campaignReportsForm.get('campaignFromDate').setValue(this.campaignFromDate + '')
      this.campaignReportsForm.get('campaignToDate').setValue(this.campaignToDate + '');
    }
    else {
      this.isToday = true;
      this.campaignReportsForm.get('campaignToDate').setValidators(Validators.required);
      this.campaignReportsForm.get('campaignToDate').updateValueAndValidity();
      this.campaignReportsForm.get('campaignFromDate').setValidators(Validators.required);
      this.campaignReportsForm.get('campaignFromDate').updateValueAndValidity();
      this.campaignReportsForm.get('campaignFromDate').setValue(null);
      this.campaignReportsForm.get('campaignToDate').setValue(null);
      if (this.currentDateDate) {
        let currentDateFrom = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        let currentDateTo = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        this.campaignToDate = new Date(currentDateTo.setDate(currentDateTo.getDate() - 1));
        this.campaignFromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      }
      else {
        let tdy = new Date();
        this.campaignFromDate = new Date(tdy.setMonth(tdy.getMonth() - 3));
        let tdy1 = new Date();
        this.campaignToDate = new Date(tdy1.setDate(tdy1.getDate() - 1));
      }
    }
    this.loading = false;
  }
  onSubmit() {
    this.loading = true;
    this.dateFormatFlag = false;
    let fromdate = this.datePipe.transform(this.campaignReportsForm.value.campaignFromDate, "yyyy-MM-dd");
    let todate = this.datePipe.transform(this.campaignReportsForm.value.campaignToDate, "yyyy-MM-dd");
    fromdate = fromdate + " 00:00:00";
    todate = todate + " 23:59:59";
    let searchData = {
      "fromDate": fromdate,
      "toDate": todate,
      "selectionType": this.campaignReportsForm.value.dateType,
      "users": this.campaignReportsForm.value.campaignUser
    };

    console.log('searchData', JSON.stringify(searchData));
    this.loading = true;
    this.campaigReportService.getCampReport(searchData).subscribe((result: ICampaignReport[]) => {
      if (result) {
        if (result.length > 0) {
          console.log("Response==>Active", result)
          this.campaignReportList = result;
          this.dataSource = new MatTableDataSource(this.campaignReportList);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
          this.gridLoad = false;
        } else {
          this.campaignReportList = [];
          this.filterListCampaigns = [];

          this.gridLoad = true;
        }
      }
      this.loading = false;
    }, error => {
      this.departmentWithUsersList = [];
      this.usersList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onSubmit==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  sortData() {
    this.dataSource.sort = this.sort;
  }
  getListData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filtercampaignReportList = this.campaignReportList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    console.log("filtercampaignReportList==>" + JSON.stringify(this.filtercampaignReportList));
    this.dataSource = new MatTableDataSource(this.filtercampaignReportList);
    this.gridLoad = false;
  }
  getGlobalUsersByRoleId() {
    this.campaigReportService.getGlobalUsersByRoleId().subscribe((result: User[]) => {
      if (result) {
        this.globalUsers = result;
        console.log("Response==>globalUsers", result)
      }
      this.loading = false;
    }, error => {
      this.globalUsers = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getGlobalUsersByRoleId==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  getDetails(action?: boolean) {
    this.loading = true;
    this.campaigReportService.getDepartmentswithUser().subscribe((result: Department[]) => {
      if (result) {
        console.log("Response==>Active", result)
        this.departmentWithUsersList = result;
        console.log('departmentWithUsersList=>', this.departmentWithUsersList, this.loginInfo);
        if (userType.DepartementAdmin == this._roleCode) {
          this.campaignReportsForm.get('campaignDepartment').setValue(this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0);
          let index = this.departmentWithUsersList.findIndex(x => x.deptId == (this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0));
          if (index != -1) {
            this.usersList = this.departmentWithUsersList[index].users;
          }
        }
      }
      if (action) {
        this.DateSelection(this.campaignReportsForm.value.dateType);
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
        this.DateSelection(this.campaignReportsForm.value.dateType)
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
    console.log("campaignDepartment=>", this.campaignReportsForm.value.campaignDepartment);
    this.usersList = [];
    let deptData = this.campaignReportsForm.value.campaignDepartment;
    if (this.campaignReportsForm.value.campaignDepartment.length > 0) {
      let findex = this.departmentWithUsersList.findIndex(y => y.deptId == deptData[0].deptId);
      if (findex != -1) {
        this.deptName = this.departmentWithUsersList[findex].deptName;
      }
      let filterdeptList = this.departmentWithUsersList.filter(x => deptData.findIndex(y => y.deptId == x.deptId) != -1);
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
      if (filterdeptList.length > 0 && this.campaignReportsForm.value.campaignUser != null) {
        let userSelected: number[] = [];
        userSelected = this.campaignReportsForm.value.campaignUser;
        let userselect = userSelected.filter(x => this.usersList.findIndex(y => y.userId + '' == x + '') != -1);
        this.campaignReportsForm.get('campaignUser').setValue(userselect);
        this.UserSelection();
      }
    }
    else {
      this.campaignReportsForm.get('campaignUser').setValue(null);
    }
  }
  UserSelection() {
    this.userName = '';
    let userSelected: number[] = [];
    userSelected = this.campaignReportsForm.value.campaignUser;
    console.log("userSelected==>", userSelected, this.campaignReportsForm.value.campaignUser);
    if (userSelected.length > 0) {
      if (this.campaignReportsForm.value.typeOfUsers == usersType.Deptusers) {
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

  ExportTOExcel() {

    if (!this.dateFormatFlag) {
      this.dateFormatFlag = true;
      this.campaignReportList.forEach(n => {

        n.Date = n.Date == null ? '' : this.datePipe.transform(new Date((n.Date).replace(/\s/g, "T")), "yyyy-MM-dd");
        // n.Uploaded=n.Uploaded==null?'':n.Uploaded;
        return n;

      });
    }
    //const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.campaignReportList.map(data => _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    XLSX.writeFile(wb, 'Campaign_Reports_' + dateDownload + '.xlsx');

  }
  convertData(value) {
    return value == null ? '' : new Date((value).replace(/\s/g, "T"));
  }
  ExportTOCsv() {
    if (!this.dateFormatFlag) {
      this.dateFormatFlag = true;
      this.campaignReportList.forEach(n => {
        n.Date = n.Date == null ? '' : this.datePipe.transform(new Date((n.Date).replace(/\s/g, "T")), "yyyy-MM-dd");
        // n.Uploaded = n.Uploaded == null ? '' : n.Uploaded;
        return n;
      });
    }
    console.log("campaignReportList==>", JSON.stringify(this.campaignReportList));
    // console.log("this.menuInfo", this.reportsList[0]);
    // console.log("this.menuInfo", Object.keys(this.reportsList[0]));
    var options = {
      noDownload: false,
      headers: this.displayedColumns,
    };
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    new Angular5Csv(this.campaignReportList.map(data => _.pick(data, this.displayedColumns)), 'Campaign_Reports_' + dateDownload, options);
  }
  ExportTOPdf() {
    let doc = new jsPDF('l', 'pt');
    let headers = [this.displayedColumns];
    let rows = [];
    let temp = [];
    if (!this.dateFormatFlag) {
      this.dateFormatFlag = true;
      this.campaignReportList.forEach(n => {
        n.Date = n.Date == null ? '' : this.datePipe.transform(new Date((n.Date).replace(/\s/g, "T")), "yyyy-MM-dd");
        // n.Uploaded=n.Uploaded==null?'':n.Uploaded;
        return n;
      });
    }
    this.campaignReportList.forEach(element => {
      temp = [];
      headers[0].forEach(y => {
        temp.push(element[y + ''])
      });
      console.log('temp==>', temp);
      rows.push(temp);
      console.log(headers, rows);
    });
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
    doc.save('Campaign_Reports_' + dateDownload + '.pdf');
  }
}