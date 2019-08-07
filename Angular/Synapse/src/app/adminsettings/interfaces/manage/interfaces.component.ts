import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { InterfaceInfo, IInterfaceRes } from '../_model/interfaces.model';
import { InterfacesService } from '../_service/interfaces.service';
import { MatDialogConfig, MatDialog, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { CreateinterfaceComponent } from '../create/createinterface.component';
import { environment } from '../../../../environments/environment';
import { ActionType, AlertType, AlertMessageService } from '../../../_services/AlertMessageService';
import { ConfirmInterfaceComponent } from '../_model/interfaceconfirm';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-interfaces',
  templateUrl: './interfaces.component.html',
  styleUrls: ['./interfaces.component.scss']
})
export class InterfacesComponent implements OnInit, AfterViewInit {
  public page = 0;
  // public size = 6;
  selectedPage: any;
  initPage = 0;
  listPage = 0;
  _filterType = '';
  pageSize = environment.pageSize;
  loadTotalInterface: InterfaceInfo[] = [];
  interfacesList: InterfaceInfo[] = [];
  filterInterfaces: InterfaceInfo[] = [];
  filterListinterfaces: InterfaceInfo[] = [];
  order: number = 1; // 1 asc, -1 desc;
  listflag: boolean = false;
  loading: boolean = false

  displayedColumns = ['interfaceCode', 'interfaceDesc', 'interfaceName', 'status', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();
  searchdata: string = '';

  constructor(private dialog: MatDialog, private interfacesService: InterfacesService, private alertmessage: AlertMessageService, private translate: TranslateService) { }

  ngOnInit() {
    this.getInterfaces();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();

    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: InterfaceInfo, filter: string) => data.interfaceName == null ? false : data.interfaceName.toLowerCase().indexOf(filter.toLowerCase()) > -1;

  }

  getInterfaces() {
    this.loading = true;
    this.interfacesService.getInterfaces().subscribe((result: InterfaceInfo[]) => {
      console.log("result=>", result);
      if (result) {
        this.interfacesList = result;
        this.loadTotalInterface = result;
        this.dataSource = new MatTableDataSource(this.interfacesList);
        this.initPage = 0;
        this.listPage = 0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      } else {
        this.interfacesList = [];
        this.loadTotalInterface = [];
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getInterfaces==>", JSON.stringify(error));
      this.alertmessage.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;

    });
  }
  ngAfterViewInit() {
    setTimeout(() => { this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator });
  }

  loadList() {
    this.listPage = 0;
    this.listflag = true;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: InterfaceInfo, filter: string) => data.interfaceName == null ? false : data.interfaceName.toLowerCase().indexOf(filter.toLowerCase()) > -1;
  }

  loadGrid() {
    this.initPage = 0;
    this.listflag = false;
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });

  }

  getDialogConfig(data?: InterfaceInfo): MatDialogConfig {
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

  addInterface() {
    const dialogRef = this.dialog.open(CreateinterfaceComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getInterfaces();
      }

    });
  }

  editInterface(InterfaceData: InterfaceInfo) {

    const dialogRef = this.dialog.open(CreateinterfaceComponent, this.getDialogConfig(InterfaceData));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getInterfaces();
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

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;

    this.filterInterfaces = this.interfacesList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
    console.log("UserData::" + JSON.stringify(this.interfacesList));
  }

  sortData() {
    this.dataSource.sort = this.sort
  }

  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.Interface=>", this.interfacesList);

    this.filterListinterfaces = this.interfacesList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListinterfaces);
    if (this.searchdata != '') {
      this.dataSource = new MatTableDataSource(this.interfacesList);
      this.dataSource.filter = this.searchdata.toLowerCase().trim();
    }
    this.listPage = obj.pageIndex;
  }

  applyFilterStatus(Interface: InterfaceInfo, status: number) {

    let data: any = status ? this.translate.instant('InterfacesModule.interfacemanage.activate') + ' \"' + Interface.interfaceName + ' \" ...?' : this.translate.instant('InterfacesModule.interfacemanage.deActivate') + ' \"' + Interface.interfaceName + ' \" ...?';
    const dialogRef = this.dialog.open(ConfirmInterfaceComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        Interface.status = status;
        this.interfacesService.UpdateInterfaceStatus(status, Interface.interfaceId)
          .subscribe((result: IInterfaceRes) => {
            if (result.status) {
              this.alertmessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getInterfaces();
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
        this.interfacesList = this.loadTotalInterface.filter(data => data.status == 1);
        console.log('interface=>', this.interfacesList);
        if (this.interfacesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterInterfaces = [];
          this.dataSource = new MatTableDataSource(this.filterInterfaces);
        }
        break;
      case '0':
        this.interfacesList = this.loadTotalInterface.filter(data => data.status == 0);
        console.log('interface=>', this.interfacesList);
        if (this.interfacesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterInterfaces = [];
          this.dataSource = new MatTableDataSource(this.filterInterfaces);
        }
        break;
      default:
        this.interfacesList = this.loadTotalInterface;
        console.log('interface=>', this.interfacesList);
        if (this.interfacesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize })
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterInterfaces = [];
          this.dataSource = new MatTableDataSource(this.filterInterfaces);
        }
        break;
    }
  }

  deleteInterfacebyId(interfaces: InterfaceInfo) {

    let data: any = this.translate.instant('InterfacesModule.interfacemanage.delete') + ' \"' + interfaces.interfaceName + ' \" ...?'
    const dialogRef = this.dialog.open(ConfirmInterfaceComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.interfacesService.deleteInterface(interfaces.interfaceId)
          .subscribe(responce => {
            if (responce.status) {
              this.alertmessage.showAlert(responce.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getInterfaces();
            } else {
              this.alertmessage.showAlert(responce.message, ActionType.FAILED, AlertType.ERROR);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-deleteInterfacebyId==>", JSON.stringify(error));
            this.alertmessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
      }
    });
  }

}
