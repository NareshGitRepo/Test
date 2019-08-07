import { ActionType, AlertMessageService, AlertType } from '../../../_services/AlertMessageService';
import { ApiResponse, Filterkeyword } from '../_model/filterkey.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { CreatefilterkeyComponent } from '../create/createfilterkey.component';
import { FilterConfirmComponent } from '../_model/filterkeyconfirm';
import { FilterkeyService } from '../_service/filterkey.service';
import { FilterkeydetailsComponent } from '../details/filterkeydetails.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-filterkey',
  templateUrl: './filterkey.component.html',
  styleUrls: ['./filterkey.component.scss']
})
export class FilterkeyComponent implements OnInit {
  totalkeywordList: Filterkeyword[] = [];
  filteredKeywordList: Filterkeyword[] = [];
  loadTotalfilterkeyword: Filterkeyword[] = [];
  public initPage = 0;
  public listPage = 0;
  searchdata: string = '';
  public pageSize = environment.pageSize;
  selectedPage: any;
  dataSource = new MatTableDataSource<Filterkeyword>();
  loading: boolean = false;
  _filterType = '';
  displayedColumns = ['keywordName', 'status', 'actions'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  listflag: boolean = false;
  constructor(private keyService: FilterkeyService, private dialog: MatDialog, private router: Router, private alertMessage: AlertMessageService, private translate: TranslateService) { }

  ngOnInit() {
    this.getfilterkeywords();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();

    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: Filterkeyword, filter: string) => data.keywordName.toLowerCase().indexOf(filter.toLowerCase()) > -1
  
  }

  getfilterkeywords() {
    this.loading = true;
    this.keyService.getFilterKeywords().subscribe((result: Filterkeyword[]) => {
      if (result) {
        console.log("Result", result)
        this.totalkeywordList = result
        this.loadTotalfilterkeyword = result;
        console.log("this.totalkeywordList:::::", this.totalkeywordList);
        if (result) {
          this.initPage = 0;
          this.listPage = 0;
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
          this.dataSource.paginator = this.paginator;
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        }
      }
      else {
        this.totalkeywordList = [];
        this.loadTotalfilterkeyword = [];
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getfilterkeywords==>", JSON.stringify(error));
      this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    }
    );
  }
  sortData() {
    this.dataSource.sort = this.sort
  }
  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.keywordlist=>", this.totalkeywordList);
    this.filteredKeywordList = this.totalkeywordList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filteredKeywordList);
    if(this.searchdata!=''){
      this.dataSource = new MatTableDataSource(this.totalkeywordList);
      this.dataSource.filter = this.searchdata.toLowerCase().trim();
    }
    this.listPage = obj.pageIndex;
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.selectedPage = _pageData.pageIndex;
    this.filteredKeywordList = this.totalkeywordList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
    console.log("totalkeywordList data::" + JSON.stringify(this.totalkeywordList));
  }

  loadList() {
    this.listPage = 0;
    this.listflag = true;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
  }

  loadGrid() {
    this.initPage = 0;
    this.listflag = false;
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: Filterkeyword, filter: string) => data.keywordName.toLowerCase().indexOf(filter.toLowerCase()) > -1
  }

  addKeyword() {
    console.log("Create keyword:");
    const dialogRef = this.dialog.open(CreatefilterkeyComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getfilterkeywords();
      }
    });
  }

  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '35vw';
    dialogConfig.height = '95.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  searchFilter(value) {
    this._filterType = value;
    this.searchdata = '';
    this.initPage=0;
    this.listPage=0;
    switch (value) {
      case '1':
        this.totalkeywordList = this.loadTotalfilterkeyword.filter(data => data.status == 1);
        console.log('totalkeywordList=>', this.totalkeywordList);
        if (this.totalkeywordList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filteredKeywordList = [];
          this.dataSource = new MatTableDataSource(this.filteredKeywordList);
        }
        break;
      case '0':
        this.totalkeywordList = this.loadTotalfilterkeyword.filter(data => data.status == 0);
        console.log('totalkeywordList=>', this.totalkeywordList);
        if (this.totalkeywordList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filteredKeywordList = [];
          this.dataSource = new MatTableDataSource(this.filteredKeywordList);
        }
        break;
      default:
        this.totalkeywordList = this.loadTotalfilterkeyword;
        console.log('totalkeywordList=>', this.totalkeywordList);
        if (this.totalkeywordList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filteredKeywordList = [];
          this.dataSource = new MatTableDataSource(this.filteredKeywordList);
        }
        break;
    }
  }

  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  editKeyword(keywordData: Filterkeyword) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
    dialogConfig.disableClose = true;
    dialogConfig.data = keywordData;
    const dialogRef = this.dialog.open(CreatefilterkeyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getfilterkeywords();
      }

    });
  }

  keywordDetails(keyword: Filterkeyword) {
    const dialogRef = this.dialog.open(FilterkeydetailsComponent, this.getDialogConfig(keyword));
    dialogRef.afterClosed().subscribe(response => {
      if (response) {
        this.getfilterkeywords();
      }
    });
  }

  applyFilterStatus(keyword: Filterkeyword, status: number) {

    let data: any = status ? this.translate.instant('FilterKeyModule.filterkey.activate') + '\"' + keyword.keywordName + '\" ...?' : this.translate.instant('FilterKeyModule.filterkey.deActivate') + '\"' + keyword.keywordName + '\" ...?';
    const dialogRef = this.dialog.open(FilterConfirmComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        keyword.status = status;
        this.keyService.updatekeywordstatus(keyword.keywordId, keyword.status)
          .subscribe((result: ApiResponse) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getfilterkeywords();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-applyFilterStatus==>", JSON.stringify(error));
            this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }
    });
  }

  deleteKeyword(keyword: Filterkeyword) {
    console.log("deleteKeyword :");

    const dialogRef = this.dialog.open(FilterConfirmComponent, {
      width: '400px',

      data: this.translate.instant('FilterKeyModule.filterkey.delete') + '\"' + keyword.keywordName + '\" ...?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        // keyword.status = status;
        this.keyService.deleteKeyword(keyword.keywordId)
          .subscribe((result: ApiResponse) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getfilterkeywords();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-deleteKeyword==>", JSON.stringify(error));
            this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }
    });
  }
}
