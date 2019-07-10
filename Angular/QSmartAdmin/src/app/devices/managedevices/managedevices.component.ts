import { Component, OnInit, ViewChild, } from '@angular/core';
import { MatDialogConfig, MatTabChangeEvent } from '@angular/material';
import { MatDialog } from '@angular/material';

import * as _ from 'lodash';
import { ActionType, AlertMessageService, AlertType } from '../../_services/alertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { DevicesService } from '../_service/deviceService';
import { CreatedevicesComponent } from '../createdevices/createdevices.component';
import { DeviceAlertComponent } from '../_model/deviceAlert';
import { IKiosk, IKioskStatus, IPrinterStatus, IDisplayStatus, IPrinter, deviceType, displaybyIndex, IDisplayBoard, DisplayBoard } from '../_model/devicesModel';
import { UrlAlertComponent } from '../_model/urlAlert';
import { Router } from '@angular/router';

@Component({
  selector: 'app-managedevices',
  templateUrl: './managedevices.component.html',
  styleUrls: ['./managedevices.component.scss']
})

export class ManageDevicesComponent implements OnInit {

  @ViewChild('matgroup') matgroup;
  searchdata: string;
  selectedTab: any;
  kioskList: IKiosk[] = [];
  filterKiosks: IKiosk[] = [];
  displayboardsList: IDisplayBoard[] = [];
  filterDisplayBoards: IDisplayBoard[] = [];
  filterPrinters: IPrinter[] = [];
  printersList: IPrinter[] = [];
  displaystatus: IDisplayStatus;
  printstatus: IPrinterStatus;
  kioskstatus: IKioskStatus;
  initPage = 0;
  pageSize = environment.pageSize;
  urlMessage: string;
  loading: boolean = false;

  constructor(private dialog: MatDialog, private _deviceservice: DevicesService,
    private alertMessage: AlertMessageService, private translate: TranslateService, private router: Router) { }



  ngOnInit() {
    this.getKiosks();
  }

  applyFilterStatus(filterValue: string) {
    console.log("applyFilterStatus:" + filterValue);
    if (filterValue != "") {
      if (this.kioskList) {
        this.filterKiosks = this.kioskList;
        let obj = _.filter(this.filterKiosks, function (dataObj) {
          return dataObj.status + "" == filterValue;
        });
        this.filterKiosks = obj;
      }
      if (this.displayboardsList) {
        this.filterDisplayBoards = this.displayboardsList;
        let obj = _.filter(this.filterDisplayBoards, function (dataObj) {
          return dataObj.status + "" == filterValue;
        });
        this.filterDisplayBoards = obj;
      }
      if (this.printersList) {
        this.filterPrinters = this.printersList;
        let obj = _.filter(this.filterPrinters, function (dataObj) {
          return dataObj.status + "" == filterValue;
        });
        this.filterPrinters = obj;
      }
    }
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;

    switch (this.matgroup.selectedIndex) {
      case 0:
        this.filterKiosks = this.kioskList.filter(() => {
          index++;
          return (index > startingIndex && index <= endingIndex) ? true : false;
        });
      case 1:
        this.filterDisplayBoards = this.displayboardsList.filter(() => {
          index++;
          return (index > startingIndex && index <= endingIndex) ? true : false;
        });
      case 2:
        this.filterPrinters = this.printersList.filter(() => {
          index++;
          return (index > startingIndex && index <= endingIndex) ? true : false;
        });
    }
    this.initPage = _pageData.pageIndex;
  }

  createDevice() {
    const dialogRef = this.dialog.open(CreatedevicesComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      console.log("result9999", result, deviceType.DisplayBoards);
      if (result) {
        switch (result) {
          case deviceType.Kiosks:
            this.getKiosks();
            this.selectedTab = 0;
            break;
          case deviceType.DisplayBoards:
            this.getDisplayBoards();
            this.selectedTab = 1;
            break;
          default:
            this.getPrintersData();
            this.selectedTab = 2;
            break;
        }
      }

    });
  }

  getDialogConfig(data?: any, type?: string): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw';
    dialogConfig.height = '92.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = { type: type, data: data } : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  urlGenerate(event: any, type: string) {
    if (type == 'kiosk') {
      this._deviceservice.getKioskUrl(event.kioskId).subscribe(response => {
        console.log('response', response.messages);
        if (response.messages)
          this.urlMessage = response.messages;
        const dialogRef = this.dialog.open(UrlAlertComponent, this.getStatusConfig(this.urlMessage));
      });
    }
    else {
      this._deviceservice.getDisplayUrl(event.displayId).subscribe(response => {
        console.log('response', response.messages);
        if (response.messages)
          this.urlMessage = response.messages;
        const dialogRef = this.dialog.open(UrlAlertComponent, this.getStatusConfig(this.urlMessage));
      });
    }

  }

  displayStatusChange(device, status: number) {

    let data: any = status ? this.translate.instant('DevicesModule.activeStatus') : this.translate.instant('DevicesModule.deActiveStatus');
    const dialogRef = this.dialog.open(DeviceAlertComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        device.status = status;
        this.displaystatus = {
          displayId: device.displayId,
          status: device.status
        }
        console.log("this.displaystatus::;" + JSON.stringify(this.displaystatus));

        this._deviceservice.updateStatusByDisplayId(this.displaystatus)
          .subscribe(responce => {
            if (responce.status) {
              this.alertMessage.showAlert(responce.messages, ActionType.SUCCESS, AlertType.SUCCESS);

            } else {
              this.alertMessage.showAlert(responce.messages, ActionType.FAILED, AlertType.ERROR);
            }
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.log("Failed :: ", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
          });
      }
    });
  }

  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '400px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  printerStatusChange(printer, status: number) {
    let data: any = status ? this.translate.instant('DevicesModule.activeStatus') : this.translate.instant('DevicesModule.deActiveStatus');
    const dialogRef = this.dialog.open(DeviceAlertComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        printer.status = status;
        this.printstatus = {
          printId: printer.printId,
          status: printer.status
        }
        console.log('status=>', this.printstatus);
        this._deviceservice.updateStatusByPrinterId(this.printstatus)
          .subscribe(responce => {
            if (responce.status) {
              this.alertMessage.showAlert(responce.messages, ActionType.SUCCESS, AlertType.SUCCESS);

            } else {
              this.alertMessage.showAlert(responce.messages, ActionType.FAILED, AlertType.ERROR);
            }
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.log("Failed :: ", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
          });
      }
    });
  }

  kioskStatusChange(kiosk, status: number) {
    let data: any = status ? this.translate.instant('DevicesModule.activeStatus') : this.translate.instant('DevicesModule.deActiveStatus');
    const dialogRef = this.dialog.open(DeviceAlertComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        kiosk.status = status;
        this.kioskstatus = {
          kioskId: kiosk.kioskId,
          status: kiosk.status
        }
        console.log('status=>', this.printstatus);
        this._deviceservice.updateStatusByKioskId(this.kioskstatus)
          .subscribe(responce => {
            if (responce.status) {
              this.alertMessage.showAlert(responce.messages, ActionType.SUCCESS, AlertType.SUCCESS);

            } else {
              this.alertMessage.showAlert(responce.messages, ActionType.FAILED, AlertType.ERROR);
            }
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.log("Failed :: ", JSON.stringify(error));
            this.showAlert(errorMessage, ActionType.ERROR, error.status);
          });
      }
    });
  }


  onEditKiosk(editData: IKiosk) {
    if (editData) {
      let type = "Kiosks"
      const dialogRef = this.dialog.open(CreatedevicesComponent, this.getDialogConfig(editData, type));
      dialogRef.afterClosed().subscribe(data => {
        if (data)
          this.getKiosks();
        this.selectedTab = 0;
      });
    }
  }

  onEditDisplay(editData: DisplayBoard) {

    let editObj = {
      orgId: editData.orgId,
      displayId: editData.displayId,
      floorId: editData.floorId,
      floorName: editData.floorName,
      displayName: editData.displayName,
      displayArea: editData.displayArea,
      displayType: editData.displayType,
      departments: editData.departments,
      services: editData.services,
    } as DisplayBoard;
    if (editData) {
      console.log("Selected row is ......" + JSON.stringify(editObj));
      let type = "DisplayBoards";
      const dialogRef = this.dialog.open(CreatedevicesComponent, this.getDialogConfig(editObj, type));
      dialogRef.afterClosed().subscribe(data => {
        if (data)
          this.getDisplayBoards();
        this.selectedTab = 1;
      });
    }
  }

  onEditPrinter(editData: IPrinter) {
    if (editData) {
      let type = "Printers";
      console.log("Selected row is ......" + JSON.stringify(editData));
      const dialogRef = this.dialog.open(CreatedevicesComponent, this.getDialogConfig(editData, type));
      dialogRef.afterClosed().subscribe(data => {
        if (data)
          this.getPrintersData();
        this.selectedTab = 2;
      });
    }
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }


  getKiosks() {
    this.loading = true;
    this._deviceservice.getKioskbyOrgid().subscribe((response: IKiosk[]) => {
      console.log("response", response);
      if (response) {
        this.kioskList = response;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      } else {
        console.log("KIOSK not found");
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getDisplayBoards() {
    this.loading = true;
    // this._deviceservice.getAllDisplayBoardsByOrgid().subscribe((response: IDisplayResponse[]) => {
    this._deviceservice.getAllDisplayBoardsByOrgid().subscribe((response: IDisplayBoard[]) => {
      console.log("responseDisplay", response);
      if (response) {
        this.displayboardsList = response;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      } else {
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  getPrintersData() {
    this.loading = true;
    this._deviceservice.getPrintersbyOrgid().subscribe((response: IPrinter[]) => {
      if (response) {
        this.printersList = response;
        console.log('getPrintersData=>' + JSON.stringify(this.printersList));
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
      } else {
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }

  onTabChange(tabChangeEvent: MatTabChangeEvent) {
    switch (tabChangeEvent.index) {
      case displaybyIndex.Kiosks:
        this.getKiosks();
        break;
      case displaybyIndex.DisplayBoards:
        this.getDisplayBoards();
        break;
      default:
        this.getPrintersData();
        break;
    }
  }
}



