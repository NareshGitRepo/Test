import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatTableDataSource, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material';
import { IServingTokenN, IResponse, IServingTokenNData } from '../../_model/tokenmodel';
import { TokenService } from '../../_service/tokenService';
import { ActionType, AlertMessageService } from '../../../_services/alertMessageService';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AppConfig } from '../../../_helpers/app.config';
import { NurseAlertComponent } from '../nursemanage/nursealert';
import * as _ from "lodash";

@Component({
  selector: 'app-servingtokenview',
  templateUrl: './servingtokenview.component.html',
  styleUrls: ['./servingtokenview.component.scss']
})
export class ServingtokenviewComponent implements OnInit {
  displayedColumns = ['tokenNo', 'mrnNo', 'apptDate', 'roomNo', 'nurseName', 'actions'];
  loading: boolean = false;
  serviceArray: IServingTokenN[] = [];
  dataSource: any;
  removeFlag: boolean = false;
  roomno: string;
  roomData: string[] = [];
  constructor(private dialogRef: MatDialogRef<ServingtokenviewComponent>, @Inject(MAT_DIALOG_DATA) private serviceInfo: IServingTokenNData,
    private _service: TokenService, private dialog: MatDialog, private alertMessage: AlertMessageService, private translate: TranslateService, private router: Router, private appconfig: AppConfig) {
    if (this.serviceInfo.deptname == '') {
      this.serviceArray = this.serviceInfo.ServingTokenNData;
      console.log("serviceArray=>", this.serviceArray, this.serviceInfo);

      this.dataSource = new MatTableDataSource<IServingTokenN>(this.serviceArray);
    }
    else {
      this.roomData = Object.keys(_.groupBy(this.serviceInfo.ServingTokenNData, 'roomNo'));
    }
  }

  ngOnInit() {

  }
  roomChange() {
    this.serviceArray = this.serviceInfo.ServingTokenNData.filter(x => x.roomNo == this.roomno);
    this.dataSource = new MatTableDataSource<IServingTokenN>(this.serviceArray);
  }
  endToken(row: IServingTokenN) {
    let data: string = this.translate.instant('DoctorServingModule.endAlert');
    data = data.replace('{Token}', row.tokenNo);
    const dialogRef = this.dialog.open(NurseAlertComponent, this.getStatusConfigAlert(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this._service.servingEndTokenOtherResource(row.ticketId).subscribe((response: IResponse) => {
          if (response.status) {
            this.showAlert(response.messages, ActionType.SUCCESS);
            let index = this.serviceArray.findIndex(x => x.ticketId == row.ticketId);
            if (index != -1) {
              this.serviceArray.splice(index, 1);
              let index1 = this.serviceInfo.ServingTokenNData.findIndex(x => x.ticketId == row.ticketId);
              if (index1 != -1) {
                this.serviceInfo.ServingTokenNData.splice(index1, 1);
              }
              this.dataSource = new MatTableDataSource<IServingTokenN>(this.serviceArray);
            }
            if (this.serviceArray.length == 0 && this.serviceInfo.ServingTokenNData.length == 0)
              this.dialogRef.close();
          }
          else {
            this.showAlert(response.messages, ActionType.FAILED);
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
    });
  }

  returnToQueue(row: IServingTokenN) {
    let data: string = this.translate.instant('DoctorServingModule.returnAlert');
    data = data.replace('{Token}', row.tokenNo);
    const dialogRef = this.dialog.open(NurseAlertComponent, this.getStatusConfigAlert(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this._service.recycleTokenOtherResource(row.ticketId).subscribe((response: IResponse) => {
          if (response.status) {
            this.showAlert(response.messages, ActionType.SUCCESS);
            this.removeFlag = true;
            let index = this.serviceArray.findIndex(x => x.ticketId == row.ticketId);
            if (index != -1) {
              this.serviceArray.splice(index, 1);
              let index1 = this.serviceInfo.ServingTokenNData.findIndex(x => x.ticketId == row.ticketId);
              if (index1 != -1) {
                this.serviceInfo.ServingTokenNData.splice(index1, 1);
              }
              this.dataSource = new MatTableDataSource<IServingTokenN>(this.serviceArray);
            }
            if (this.serviceArray.length == 0 && this.serviceInfo.ServingTokenNData.length == 0)
              this.dialogRef.close(this.removeFlag);
          }
          else {
            this.showAlert(response.messages, ActionType.FAILED);
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
    });
  }
  getStatusConfigAlert(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '300px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  close() {
    this.dialogRef.close();
  }
}

