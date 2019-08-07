import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { AlertMessageService, ActionType, AlertType } from '../../../_services/AlertMessageService';
import { SenderService } from '../services/sender.service';
import { Isender, IsenderRes } from '../model/sender.model';
import { CreatesendersComponent } from '../create/createsenders.component';
import { Confirmsendercomponent } from '../model/sender.confirm';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-senders',
  templateUrl: './senders.component.html',
  styleUrls: ['./senders.component.scss']
})
export class SendersComponent implements OnInit {
  initPage = 0;
  listPage = 0;
  _filterType = '';
  pageSize = environment.pageSize;
  senderlist: Isender[] = [];
  loadTotalsender: Isender[] = [];
  filterListsenders: Isender[] = [];
  filtersenders: Isender[] = [];
  displayedColumns = ['senderName', 'status', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();
  searchdata: string = '';
  listflag: boolean = false;
  loading: boolean = false;

  order: number = 1; // 1 asc, -1 desc;
  constructor(private dialog: MatDialog, private alertmessage: AlertMessageService, private senderservice: SenderService, private translate: TranslateService) { }

  ngOnInit() {
    this.getsenders();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();

    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: Isender, filter: string) => data.senderName.toLowerCase().indexOf(filter.toLowerCase()) > -1

  }

  getsenders() {
    this.loading = true;
    this.senderservice.getsenders().subscribe((result: Isender[]) => {
      console.log("result=>", result);
      if (result) {
        this.senderlist = result;
        this.loadTotalsender = result;
        this.dataSource = new MatTableDataSource(this.senderlist);
        this.initPage = 0;
        this.listPage = 0;
        console.log(this.dataSource);
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      } else {
        this.senderlist = [];
        this.loadTotalsender = [];
      }
      this.loading = false;
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getsenders==>", JSON.stringify(error));
        this.alertmessage.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;

      });
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filtersenders = this.senderlist.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
    console.log("UserData::" + JSON.stringify(this.senderlist));
  }

  ngAfterViewInit() {
    setTimeout(() => { this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator });
  }

  loadList() {
    this.listPage = 0;
    this.listflag = true;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: Isender, filter: string) => data.senderName.toLowerCase().indexOf(filter.toLowerCase()) > -1
  }

  loadGrid() {
    this.initPage = 0;
    this.listflag = false;
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
  }

  getDialogConfig(data?: Isender): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '35vw';
    dialogConfig.height = '95.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    if (data)
      dialogConfig.data = data;

    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.sender=>", this.senderlist);

    this.filterListsenders = this.senderlist.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListsenders);
    if (this.searchdata != '') {
      this.dataSource = new MatTableDataSource(this.senderlist);
      this.dataSource.filter = this.searchdata.toLowerCase().trim();
    }
    this.listPage = obj.pageIndex;
  }
  addsender() {
    const dialogRef = this.dialog.open(CreatesendersComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getsenders();
      }
    });
  }

  editsender(senderData: Isender) {
    const dialogRef = this.dialog.open(CreatesendersComponent, this.getDialogConfig(senderData));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getsenders();
      }
    });
  }
  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  applyFilterStatus(sender: Isender, status: number) {

    let data: any = status ? this.translate.instant('SenderModule.sendermanage.activate') + '\"' + sender.senderName + '\" ...?' : this.translate.instant('SenderModule.sendermanage.deActivate') + '\"' + sender.senderName + '\" ...?';
    const dialogRef = this.dialog.open(Confirmsendercomponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        sender.status = status;
        this.senderservice.updateSenderStatus(status, sender.senderId)
          .subscribe((result: IsenderRes) => {
            if (result.status) {
              this.alertmessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getsenders();
            }
            else {
              this.alertmessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-applyFilterStatus==>", JSON.stringify(error));
            this.alertmessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }
    });
  }
  searchFilter(value) {
    this._filterType = value;
    this.searchdata = '';
    this.initPage = 0;
    this.listPage = 0;
    switch (value) {
      case '1':
        this.senderlist = this.loadTotalsender.filter(data => data.status == 1);
        console.log('interface=>', this.senderlist);
        if (this.senderlist.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filtersenders = [];
          this.dataSource = new MatTableDataSource(this.filtersenders);
        }
        break;
      case '0':
        this.senderlist = this.loadTotalsender.filter(data => data.status == 0);
        console.log('interface=>', this.senderlist);
        if (this.senderlist.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filtersenders = [];
          this.dataSource = new MatTableDataSource(this.filtersenders);
        }
        break;
      default:
        this.senderlist = this.loadTotalsender;
        console.log('interface=>', this.senderlist);
        if (this.senderlist.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize })
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filtersenders = [];
          this.dataSource = new MatTableDataSource(this.filtersenders);
        }
        break;
    }
  }

  sortData() {
    this.dataSource.sort = this.sort
  }

  // deletesender(delsender:Isender){
  //   let data: any ="Do u want to delete"
  //   const dialogRef = this.dialog.open(ConfirmInterfaceComponent, this.getStatusConfig(data));
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.senderservice.deleteInterface(delsender.senderName)
  //         .subscribe(responce => {
  //           if (responce.status) {
  //             this.alertmessage.showAlert(responce.message, ActionType.SUCCESS, AlertType.SUCCESS);
  //             this.getsenders();
  //           } else {
  //             this.alertmessage.showAlert(responce.message, ActionType.FAILED, AlertType.ERROR);
  //           }
  //         }, error => {
  //           let message = error.error.messages as string
  //           let errorMessage = error.status == 404 ? "Failed for you request" : message ? message : error.message;
  //           console.log("Failed :: ", JSON.stringify(error));
  //           this.alertmessage.showAlert(errorMessage, ActionType.ERROR,error.status);
  //         });
  //     }
  //   });
  // }
}


