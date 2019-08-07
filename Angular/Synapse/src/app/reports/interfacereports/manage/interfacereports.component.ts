import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { IInterfaceReport, InterfaceInfo, Idate } from '../_model/interfacereports.model';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { InterfaceReportsService } from '../_service/interfacereports.service';
import { AlertMessageService, ActionType } from '../../../_services/AlertMessageService';
import * as _ from "lodash";
import { Angular5Csv } from 'angular5-csv/dist/Angular5-csv';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { dateType } from '../../departmentreports/_model/departmentreports.model';
import { Router } from '@angular/router';
import { ArabicTtfValue } from '../../../_helpers/ArabicTtfValue';
declare let jsPDF;

@Component({
  selector: 'app-interfacereports',
  templateUrl: './interfacereports.component.html',
  styleUrls: ['./interfacereports.component.scss']
})
export class InterfacereportsComponent implements OnInit {
  interfaceReportsForm: FormGroup;
  interfaceReportsList: IInterfaceReport[] = [];
  dataSource: MatTableDataSource<IInterfaceReport>;
  public listPage = 0;
  pageSize = environment.pageSize;
  currentDateDate: Idate;
  displayedColumns = ['Interface', 'Date', 'Sent', 'Delivered', 'Failed'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  DateType = [
    { id: 0, type: "Today" },
    { id: 1, type: "Date Range" }];
  interfaceList: InterfaceInfo[] = [];
  filterinterfaceReportsList: IInterfaceReport[] = [];
  loading: boolean = false;
  submittedData: any;
  interfaceFromDate: Date;
  interfaceToDate: Date;
  interfaceReportsFlag: boolean = false;
  dateFormatFlag: boolean = false;
  isToday: boolean = false;
  interfaceName: string = '';
  constructor(private fb: FormBuilder, private interfaceService: InterfaceReportsService, private translate: TranslateService,
    private alertMessage: AlertMessageService, private arabicTTF: ArabicTtfValue, private datePipe: DatePipe, private router: Router) {
  }

  ngOnInit() {
    this.interfaceReportsForm = this.fb.group({
      interfaceName: [null, Validators.required],
      dateType: [null, Validators.required],
      interfaceFromDate: [null, Validators.required],
      interfaceToDate: [null, Validators.required]
    });
    this.getcurrentdate();
    this.getInterfaces();
    this.interfaceReportsForm.get('dateType').setValue(dateType.Today);
    this.DateSelection(this.interfaceReportsForm.value.dateType)
    console.log("Tracking List", this.interfaceReportsList);
    this.dataSource = new MatTableDataSource(this.interfaceReportsList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getcurrentdate() {
    this.loading = true;
    this.interfaceService.getCurrentDate().subscribe((result: Idate) => {
      if (result) {
        this.currentDateDate = result;
      } this.loading = false
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onSubmit==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      let currentDateFrom = new Date();
      let currentDateTo = new Date();
      this.interfaceToDate = new Date(currentDateTo.setDate(currentDateTo.getDate() - 1));
      this.interfaceFromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      console.log("currentDate==>", currentDateTo, currentDateFrom);
      this.loading = false
    });
  }
  getInterfaces() {
    this.loading = true;
    this.interfaceService.getInterfaces().subscribe((result: InterfaceInfo[]) => {
      console.log("Result", result)
      if (result) {
        console.log("Result", result)
        this.interfaceList = result;
        this.dataSource.paginator = this.paginator;
      }
      else {
        this.interfaceList = [];
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getInterfaces==>", JSON.stringify(error));
      this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  DateSelection(selectedType) {
    console.log("selectedDateType==>", selectedType)
    if (selectedType == dateType.Today) {
      this.isToday = true;
      if (this.currentDateDate) {
        this.interfaceFromDate = this.interfaceToDate = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        console.log("interfaceFromDate==>", this.interfaceFromDate);
        console.log("interfaceToDate==>", this.interfaceToDate);
      } else {
        this.interfaceFromDate = new Date();
        console.log("interfaceFromDate==>", this.interfaceFromDate);
        this.interfaceToDate = new Date();
        console.log("interfaceToDate==>", this.interfaceToDate);
      }
      this.interfaceReportsForm.get('interfaceToDate').clearValidators();
      this.interfaceReportsForm.get('interfaceToDate').updateValueAndValidity();
      this.interfaceReportsForm.get('interfaceFromDate').clearValidators();
      this.interfaceReportsForm.get('interfaceFromDate').updateValueAndValidity();
      this.interfaceReportsForm.get('interfaceFromDate').setValue(this.interfaceFromDate + '')
      this.interfaceReportsForm.get('interfaceToDate').setValue(this.interfaceToDate + '');
    }
    else {
      this.isToday = false;
      this.interfaceReportsForm.get('interfaceToDate').setValidators(Validators.required);
      this.interfaceReportsForm.get('interfaceToDate').updateValueAndValidity();
      this.interfaceReportsForm.get('interfaceFromDate').setValidators(Validators.required);
      this.interfaceReportsForm.get('interfaceFromDate').updateValueAndValidity();
      this.interfaceReportsForm.get('interfaceFromDate').setValue(null);
      this.interfaceReportsForm.get('interfaceToDate').setValue(null);
      if (this.currentDateDate) {
        let currentDateFrom = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        let currentDateTo = new Date((this.currentDateDate.dateTime).replace(/\s/g, "T"));
        this.interfaceToDate = new Date(currentDateTo.setDate(currentDateTo.getDate()));
        this.interfaceFromDate = new Date(currentDateFrom.setMonth(currentDateFrom.getMonth() - 3));
      }
      else {
        let tdy = new Date();
        this.interfaceFromDate = new Date(tdy.setMonth(tdy.getMonth() - 3));
        let tdy1 = new Date();
        this.interfaceToDate = new Date(tdy1.setDate(tdy1.getDate()));
      }
    }
  }

  getListData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filterinterfaceReportsList = this.interfaceReportsList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    console.log("IemailSmsReportsList==>" + JSON.stringify(this.filterinterfaceReportsList));
    this.dataSource = new MatTableDataSource(this.filterinterfaceReportsList);
  }

  ExportTOExcel() {
    if (!this.dateFormatFlag) {
      this.dateFormatFlag = true;
      this.interfaceReportsList.forEach(n => {
        n.Date = n.Date == null ? '' : this.datePipe.transform(new Date((n.Date).replace(/\s/g, "T")), "yyyy-MM-dd");
        return n;
      });
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.interfaceReportsList.map(data => _.pick(data, this.displayedColumns)));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    XLSX.writeFile(wb, 'Interface_Reports_' + dateDownload + '.xlsx');
  }

  ExportTOPdf() {
    let doc = new jsPDF('l', 'pt');
    let getColumnHeaders = [['Interface', 'Date', 'Sent', 'Delivered', 'Failed']];
    let groupedDataRows = [];
    if (!this.dateFormatFlag) {
      this.dateFormatFlag = true;
      this.interfaceReportsList.forEach(n => {
        n.Date = n.Date == null ? '' : this.datePipe.transform(new Date((n.Date).replace(/\s/g, "T")), "yyyy-MM-dd");
        return n;
      });
    }
    this.interfaceReportsList.forEach(item => {
      let temp = [item.Interface,
      item.Date,
      item.Sent,
      item.Delivered, item.Failed];
      groupedDataRows.push(temp);
    });
    console.log("Interface reports groupedDataRows==>", groupedDataRows);
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
    doc.save('Interface_Reports' + dateDownload + '.pdf');
  }
  sortData() {
    this.dataSource.sort = this.sort
  }
  convertData(value) {
    return value == null ? '' : new Date((value).replace(/\s/g, "T"));
  }
  ExportTOCsv() {
    if (!this.dateFormatFlag) {
      this.dateFormatFlag = true;
      this.interfaceReportsList.forEach(n => {
        n.Date = n.Date == null ? '' : this.datePipe.transform(new Date((n.Date).replace(/\s/g, "T")), "yyyy-MM-dd");
        return n;
      });
    }
    console.log("interfaceReportsList==>", JSON.stringify(this.interfaceReportsList));
    var options = {
      noDownload: false,
      headers: this.displayedColumns,
    };
    let tdy = new Date();
    let dateDownload = (this.datePipe.transform(tdy, "yyyy MM dd h mm ss")).replace(/\s/g, "");
    new Angular5Csv(this.interfaceReportsList.map(data => _.pick(data, this.displayedColumns)), 'Interface_Reports_' + dateDownload, options);
  }

  onSubmit() {
    this.loading = true;
    console.log("hxrhfhzd====>", this.interfaceReportsForm);
    // this.dateFormatFlag = false;
    let fromdate = this.datePipe.transform(this.interfaceReportsForm.value.interfaceFromDate, "yyyy-MM-dd");
    let todate = this.datePipe.transform(this.interfaceReportsForm.value.interfaceToDate, "yyyy-MM-dd");
    fromdate = fromdate + " 00:00:00";
    todate = todate + " 23:59:59";
    let interfaceData: any[] = [];
    this.interfaceReportsForm.value.interfaceName.forEach(x => {
      interfaceData.push(x.interfaceCode)
    })
    this.submittedData = {
      "fromDate": fromdate,
      "selectionType": this.interfaceReportsForm.value.dateType,
      "interfaces": interfaceData,
      "toDate": todate,
    }
    console.log("this.submittedData:::::", this.submittedData);
    this.interfaceService.getInterfaceReports(this.submittedData).subscribe((result: IInterfaceReport[]) => {
      console.log("Result", result);
      if (result.length > 0) {
        this.interfaceReportsList = result;
        this.dataSource = new MatTableDataSource(this.interfaceReportsList);
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      }
      else {
        this.interfaceReportsList = [];
        this.interfaceReportsFlag = true;
      }
      this.loading = false;
    }, error => {
      this.interfaceReportsList = [];
      this.interfaceReportsFlag = true;
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-onSubmit==>", JSON.stringify(error));
      this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  interfaceChange() {
    let interfaceSelected = this.interfaceReportsForm.value.interfaceName;
    if (interfaceSelected.length > 0) {

      let findex = this.interfaceList.findIndex(y => y.interfaceId == interfaceSelected[0].interfaceId);
      if (findex != -1) {
        this.interfaceName = this.interfaceList[findex].interfaceName;
      }
    }
  }
}
