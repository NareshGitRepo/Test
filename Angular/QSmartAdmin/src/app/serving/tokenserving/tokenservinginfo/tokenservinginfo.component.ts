import { Component, OnInit, Inject } from '@angular/core';
import { ActionType, AlertMessageService } from '../../../_services/alertMessageService';
import { IResponse, IToken, ICTokensAndRooms, ICToken, ICRoom } from '../../_model/tokenmodel';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { TokenService } from '../../_service/tokenService';
import { Router } from '@angular/router';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';
import { TokenAlertComponent } from '../tokensurve/tokenalert';

@Component({
  selector: 'app-tokenservinginfo',
  templateUrl: './tokenservinginfo.component.html',
  styleUrls: ['./tokenservinginfo.component.scss']
})
export class TokenservinginfoComponent implements OnInit {
  tokenInfo: ICToken[] = [];
  rooms: ICRoom[] = [];
  loading: boolean = false;
  endFlag: boolean = false;
  _tokenInfo: IUserUpdateDto;
  displayedColumns = ['tokenNo', 'checkinTime', 'roomId', 'actions'];
  dataSource: any;// = new MatTableDataSource<Element>(ELEMENT_DATA);
  constructor(@Inject(MAT_DIALOG_DATA) public Data: any,
    private dialogRef: MatDialogRef<TokenservinginfoComponent>, private dialog: MatDialog, private tokenService: TokenService,
    private alertMessage: AlertMessageService, private translate: TranslateService, private router: Router, private appconfig: AppConfig) {
    console.log("data=>", Data);
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;

    if (!this._tokenInfo && !tokenData)
      this.router.navigate(['401']);
  }

  ngOnInit() {
    this.loading = true;
    this.tokenService.getWaitingTokens(this.Data.serviceId).subscribe((response: ICTokensAndRooms) => {
      if (response && response != null) {
        console.log("data=>", response);
        this.tokenInfo = response.tokens;
        this.rooms = response.rooms;
        this.dataSource = new MatTableDataSource<ICToken>(this.tokenInfo);
        if (this.rooms.length == 0)
          this.showAlert(this.translate.instant('TokenServingModule.roomError'), ActionType.ERROR);
      }
      else {
        this.tokenInfo = [];
        this.rooms = [];
      }
      this.loading = false;
    }, error => {
      this.tokenInfo = [];
      this.rooms = [];
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.log("Failed :: ", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  serveToken(row: ICToken) {
    this.loading = true;
    row.serveUserId = this._tokenInfo.userId;
    row.orgId = this._tokenInfo.orgId;
    // let roomtype=row.roomtype;
    let roomData = this.rooms.findIndex(x => x.roomId == row.roomId);
    if (roomData != -1) {
      row.roomNo = this.rooms[roomData].roomNumber;
      row.roomtype = this.rooms[roomData].roomType;
      // row.roomId = this.rooms[roomData].roomId;
      this.tokenService.CcallTokenForServing(row).subscribe((response: IResponse) => {
        if (response.status) {
          this.showAlert(response.messages, ActionType.SUCCESS);
          this.dialogRef.close(true);
        }
        else {
          // row.roomtype=roomtype;
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
    console.log('row', row);
  }
  endToken(row: IToken) {
    let data: string = this.translate.instant('TokenServingModule.tokensurve.endAlert');
    data = data.replace('{Token}', row.tokenNo);
    const dialogRef = this.dialog.open(TokenAlertComponent, this.getStatusConfigAlert(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;

        let tokenIndex = this.tokenInfo.findIndex(x => x.ticketId == row.ticketId);
        if (tokenIndex != -1) {
          this.tokenService.CendTokenInfo(row.ticketId).subscribe((response: IResponse) => {
            if (response.status) {
              this.endFlag = true;
              this.tokenInfo.splice(tokenIndex, 1);
              this.dataSource = new MatTableDataSource<ICToken>(this.tokenInfo);
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
          this.showAlert(this.translate.instant('TokenServingModule.tokenservinginfo.noTokensError'), ActionType.FAILED);
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
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

}