import { ActionType, AlertMessageService } from '../../../_services/alertMessageService';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { Component, Inject, OnInit } from '@angular/core';
import { IDoctro, IResponse, IRoom, IServingTokenN, IServingTokenNData, IToken, ITokenAndRooms, ItokenservingRes } from '../../_model/tokenmodel';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef, MatTableDataSource } from '@angular/material';

import { NurseAlertComponent } from '../nursemanage/nursealert';
import { PatientjourneyComponent } from '../patientjourney/patientjourney.component';
import { Router } from '@angular/router';
import { ServingtokenviewComponent } from '../servingtokenview/servingtokenview.component';
import { TokenService } from '../../_service/tokenService';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-nursetokenview',
  templateUrl: './nursetokenview.component.html',
  styleUrls: ['./nursetokenview.component.scss']
})
export class NursetokenviewComponent implements OnInit {
  selected: any;
  displayedColumns = ['tokenNo', 'mrnNo', 'apptDate', 'waitingTime', 'roomId', 'actions', 'vitalStatus', 'journey'];
  dataSource: any;// = new MatTableDataSource<Element>(ELEMENT_DATA);
  rooms: IRoom[] = [];
  tokens: IToken[] = [];
  loading: boolean = false;
  _tokenInfo: IUserUpdateDto;
  endFlag: boolean = false;
  refreshDAction: boolean = true;
  refreshTAction: boolean = true;
  constructor(private dialogRef: MatDialogRef<NursetokenviewComponent>, @Inject(MAT_DIALOG_DATA) public doctor: IDoctro,
    private tokenService: TokenService, private dialog: MatDialog, private alertMessage: AlertMessageService, private translate: TranslateService,
    private router: Router, private appconfig: AppConfig) {
    console.log("doctorId=>", doctor);
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;

    if (!this._tokenInfo && !tokenData)
      this.router.navigate(['401']);
  }

  ngOnInit() {

    this.getTokenAndRoomsInfoByDoctor();
  }
  getTokenAndRoomsInfoByDoctor() {
    this.loading = true;
    this.tokenService.getTokenAndRoomsInfoByDoctor(this.doctor.doctorId).subscribe((response: ITokenAndRooms) => {
      if (response && response != null) {
        console.log("data=>", response);
        this.rooms = response.rooms;
        this.tokens = response.tokens;
        this.dataSource = new MatTableDataSource<IToken>(this.tokens);
        if (this.rooms.length == 0)
          this.showAlert(this.translate.instant('DoctorServingModule.roomError'), ActionType.ERROR);
      }
      else {
        this.rooms = [];
        this.tokens = [];
      }
      this.loading = false;
    }, error => {
      this.rooms = [];
      this.tokens = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  serveToken(row: IToken) {
    this.loading = true;
    row.serveUserId = this._tokenInfo.userId;
    row.orgId = this._tokenInfo.orgId;
    // let roomtype=row.roomtype;
    let roomData = this.rooms.findIndex(x => x.roomId == row.roomId);
    if (roomData != -1) {
      row.roomNo = this.rooms[roomData].roomNumber;
      row.roomtype = this.rooms[roomData].roomType;
      row.serveUserId=this._tokenInfo.userId;
      // row.roomId = this.rooms[roomData].roomId;
      this.tokenService.callTokenForServing(row).subscribe((response: ItokenservingRes) => {
        console.log("response=>", response,row,this._tokenInfo.userId);

        if (response.status) {
          this.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close(true);
        }
        else {
          // row.roomtype=roomtype;
          this.showAlert(response.messages, ActionType.FAILED);
          let servingTokens= response.servingTokens.filter(x=>x.nurseId!=this._tokenInfo.userId);
          if (servingTokens.length>0) {
            let tokensdata={deptname:'',ServingTokenNData:servingTokens} as IServingTokenNData;
            const dialogRef = this.dialog.open(ServingtokenviewComponent, this.getStatusConfig(tokensdata));
            dialogRef.afterClosed().subscribe(result => {
              if (result)
                this.getTokenAndRoomsInfoByDoctor();
            });
          }

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
    console.log('row', row);
  }



  getStatusConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'nurstknview';
    dialogConfig.width = "80vw";
    dialogConfig.height = '70%';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  getJourneyConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = 'nurstknview';
    dialogConfig.width = "70vw";
    dialogConfig.height = '70%';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  endToken(row: IToken) {
    let data: string = this.translate.instant('DoctorServingModule.endAlert');
    data = data.replace('{Token}', row.tokenNo);
    const dialogRef = this.dialog.open(NurseAlertComponent, this.getStatusConfigAlert(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;

        let tokenIndex = this.tokens.findIndex(x => x.ticketId == row.ticketId);
        if (tokenIndex != -1) {
          this.tokenService.endTokenInfo(row.ticketId).subscribe((response: IResponse) => {
            if (response.status) {
              this.endFlag = true;
              this.tokens.splice(tokenIndex, 1);
              this.dataSource = new MatTableDataSource<IToken>(this.tokens);
              this.showAlert(response.messages, ActionType.SUCCESS);

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
        else {
          this.showAlert(this.translate.instant('DoctorServingModule.noTokensError'), ActionType.FAILED);
          this.loading = false;
        }
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
  close() {
    this.dialogRef.close(this.endFlag);
  }

  servejourney(row: IToken){
    console.log("row=>",row);

    const dialogRef = this.dialog.open(PatientjourneyComponent, this.getJourneyConfig(row));
  }
}
