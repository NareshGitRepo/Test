import { Component, OnInit, ViewChild } from "@angular/core";
import { ITokenInfo, IUserUpdateDto, AppConfig, userType } from "../../../_helpers/app.config";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { IAuditReports, IglobalUser, Idate } from "../_model/audit.model";
import { MatTableDataSource, MatPaginator, MatSort } from "@angular/material";
import { User } from "../../departmentreports/_model/departmentreports.model";
import { Department } from "../../../campaignmanager/smartdirectory/_model/smartdirectort";
import { environment } from "../../../../environments/environment";
import { AuditService } from "../_service/audit.service";
import { Router } from "@angular/router";
import { AlertMessageService, ActionType } from "../../../_services/AlertMessageService";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { Angular5Csv } from "angular5-csv/dist/Angular5-csv";
import * as XLSX from 'xlsx';
import * as _ from 'lodash';
import { ArabicTtfValue } from "../../../_helpers/ArabicTtfValue";
declare let jsPDF;

@Component({
  selector: 'app-auditreports',
  templateUrl: './auditreports.component.html',
  styleUrls: ['./auditreports.component.scss']
})
export class AuditreportsComponent implements OnInit {
  auditReportsFlag: boolean = false;
  tokenInfo: ITokenInfo;
  auditReportsForm: FormGroup;
  auditReportsList: IAuditReports[] = [];
  departmentFlag: boolean = true
  filterauditReportsList: IAuditReports[] = [];
  dataSource: MatTableDataSource<IAuditReports>;
  globalUsersList: IglobalUser[]
  displayedColumns = ['userName', 'modulename', 'actionType', 'createdOn', 'sourceIp'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loginInfo: IUserUpdateDto;
  loading: boolean = false;
  _roleCode: string = "";
  fromDate: Date;
  toDate: Date;
  usersList: User[] = [];
  deptName: string = '';
  userName: string = '';
  currentDateDate: Idate

  departmentWithUsersList: Department[] = [];
  pageSize = environment.pageSize;
  public listPage = 0;
  constructor(private fb: FormBuilder, private _service: AuditService, private appconfig: AppConfig, private arabicTTF: ArabicTtfValue,
    private router: Router, private alertMessage: AlertMessageService, private translate: TranslateService, private datePipe: DatePipe) {
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
    this.auditReportsForm = this.fb.group({
      department: [null, Validators.required],
      user: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      usertype: ['0', Validators.required]
    });

    if (this.tokenInfo) {
      this.getcurrentDate()
    }

  }
  getcurrentDate() {
    this.loading = true
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
      this.departmentWithUsersList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onSubmit==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      let currentDateFrom = new Date();
      let currentDateTo = new Date();
      this.toDate = new Date(currentDateTo);
      this.fromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      console.log("currentDate==>", currentDateTo, currentDateFrom);
      this.AfterCurrentDateLoading();
      this.loading = false
    });
  }
  AfterCurrentDateLoading() {
    if (userType.NormalUser != this._roleCode)
      this.getDetails();
    else {
      this.auditReportsForm.patchValue({
        department: this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0,
        user: [this.loginInfo.userId]
      });
      this.loading = false
    }
  }
  onSubmit() {
    this.loading = true;
    let fromdate = this.datePipe.transform(this.auditReportsForm.value.fromDate, "yyyy-MM-dd");
    let todate = this.datePipe.transform(this.auditReportsForm.value.toDate, "yyyy-MM-dd");
    fromdate = fromdate + " 00:00:00";
    todate = todate + " 23:59:59";
    let searchData = {
      "fromDate": fromdate,
      "toDate": todate,
      //  "selectionType": this.auditReportsForm.value.dateType,
      "users": this.auditReportsForm.value.user
    };
    console.log('searchData', JSON.stringify(searchData));
    this.loading = true;

    this._service.getAuditReports(searchData).subscribe((result: IAuditReports[]) => {
      console.log("Response==>Active", result);
      if (result.length > 0) {
        console.log("Response==>Active", result)
        this.auditReportsList = result;
        this.dataSource = new MatTableDataSource(this.auditReportsList);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.auditReportsFlag = false;
      } else {
        this.auditReportsList = [];
        this.auditReportsFlag = true;
      }
      this.loading = false;
    }, error => {
      this.departmentWithUsersList = [];
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
    this.filterauditReportsList = this.auditReportsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    console.log("filterauditReportsList==>" + JSON.stringify(this.filterauditReportsList));
    this.dataSource = new MatTableDataSource(this.filterauditReportsList);
  }
  getDetails() {
    this.loading = true;
    this._service.getDepartmentswithUser().subscribe((result: Department[]) => {
      if (result) {
        console.log("Response==>Active", result)
        this.departmentWithUsersList = result;
        console.log('departmentWithUsersList=>', this.departmentWithUsersList, this.loginInfo);
        if (userType.DepartementAdmin == this._roleCode) {
          this.auditReportsForm.get('department').setValue(this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0);
          let index = this.departmentWithUsersList.findIndex(x => x.deptId == (this.loginInfo.depts.length > 0 ? this.loginInfo.depts[0].deptId : 0));
          if (index != -1) {
            this.usersList = this.departmentWithUsersList[index].users;
          }
        }
      }

      if (!this.globalUsersList) {
        this.getGlobalUsersByRoleId()
      }
      else
      this.loading = false;
    }, error => {
      this.departmentWithUsersList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getDetails==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  departSelected() {
    console.log("groupDepartment==>", this.auditReportsForm.value.department);
    this.deptName = ''
    this.usersList = [];
    let deptSelected = this.auditReportsForm.value.department;
    if (deptSelected.length > 0) {
      let findex = this.departmentWithUsersList.findIndex(y => y.deptId == deptSelected[0].deptId);
      if (findex != -1) {
        this.deptName = this.departmentWithUsersList[findex].deptName;
      }
      let filterdeptList = this.departmentWithUsersList.filter(x => deptSelected.findIndex(y => y.deptId == x.deptId) != -1);
      filterdeptList.forEach(y => {
        if (y.users.length > 0) {
          y.users.forEach(z => {
            this.usersList.push(z);
          });
        }
      });
      if (filterdeptList.length > 0 && this.auditReportsForm.value.user != null) {
        let userSelected: number[] = [];
        userSelected = this.auditReportsForm.value.user;
        let userselect = userSelected.filter(x => this.usersList.findIndex(y => y.userId + '' == x + '') != -1);
        this.auditReportsForm.get('user').setValue(userselect);
        this.UserSelection();
      }
      else
        this.auditReportsForm.get('user').setValue(null);
    }
  }
  getGlobalUsersByRoleId() {
    this.loading = true
    this._service.getGlobalUsersByRoleId().subscribe((result: IglobalUser[]) => {
      if (result) {
        console.log("response of global users", result)
        this.globalUsersList = result;
      }
      this.loading = false
    }, error => {
      this.globalUsersList = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getGlobalUsersByRoleId==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });

  }
  userTypeSelection() {
    console.log("userselection", this.auditReportsForm.value.usertype);

    this.auditReportsForm.get('department').setValue(null)

    this.auditReportsForm.get('user').setValue(null)
    if (this.auditReportsForm.value.usertype == 1) {

      this.auditReportsForm.get('department').clearValidators();
      this.auditReportsForm.get('department').updateValueAndValidity()

    }
    else
      this.auditReportsForm.get('department').setValidators([Validators.required]);
    this.auditReportsForm.get('department').updateValueAndValidity()
  }
  UserSelection() {
    this.userName = ''
    let userSelected: number[] = [];
    userSelected = this.auditReportsForm.value.user;
    if (userSelected.length > 0) {
      if (this.auditReportsForm.value.usertype == 0) {
        let findex = this.usersList.findIndex(y => y.userId == userSelected[0]);
        if (findex != -1) {
          this.userName = this.usersList[findex].login;
        }
      }
      else {
        let findex = this.globalUsersList.findIndex(y => y.userId == userSelected[0]);
        if (findex != -1) {
          this.userName = this.globalUsersList[findex].login;
        }
      }
    }
  }

  sortData() {
    this.dataSource.sort = this.sort;
  }
  ExportTOCsv() {
    console.log("auditReportsList==>", JSON.stringify(this.auditReportsList));
    var options = {
      noDownload: false,
      headers: this.displayedColumns
    };
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    new Angular5Csv(this.auditReportsList.map(data => _.pick(data, this.displayedColumns)), 'Audit_Reports_' + dateDownload, options);
  }

  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.auditReportsList.map(data => _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    /* save to file */
    XLSX.writeFile(wb, 'Audit_Reports_' + dateDownload + '.xlsx');

  }
  ExportTOPdf() {
    let doc = new jsPDF('l', 'pt');
    let getColumnHeaders = [['userName', 'modulename', 'actionType', 'createdOn', 'sourceIp']];
    let groupedDataRows = [];
    this.auditReportsList.forEach(item => {
      let temp = [item.userName,
      item.modulename,
      item.actionType,
      item.createdOn, item.sourceIp];
      groupedDataRows.push(temp);
    });
    console.log("Audit reports groupedDataRows==>", groupedDataRows);
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
        overflow: 'linebreak', cellWidth: 'wrap', font: "arabicfont",
        fontSize: 10,
        cellPadding: 8, overflowColumns: 'linebreak'
      },
    });
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    doc.save('Audit_Reports' + dateDownload + '.pdf');
  }
}