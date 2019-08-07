import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { IdashBoard } from '../dashboardmodel.ts/dashboardmodel';
import { AppConfig, IUserUpdateDto, ITokenInfo } from '../../../_helpers/app.config';
import { Router } from '@angular/router';
import { DashBoardService } from '../_service/dashboardservice';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns = ['PriorityName', 'Incoming', 'Pending', 'Outgoing', 'Delivered'];
  dataSource: MatTableDataSource<IdashBoard>;
  dashBoard: IdashBoard[] = [];
  loginInfo: IUserUpdateDto;
  _roleCode: string = '';
  constructor(private appConfig: AppConfig, private router: Router,private translate:TranslateService, private dashBoardService: DashBoardService, private alertMessage: AlertMessageService) {
    let tokenInfo = this.appConfig.getTokenInfo() as ITokenInfo;
    if (tokenInfo) {
      this.loginInfo = (tokenInfo.tokenInfo as any).sub ? JSON.parse((tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      this.getDashboardUser();
    }
    else {
      this.router.navigate(['401']);
    }
  }
  getDashboardUser() {
    this.dashBoardService.getDashboardUser(this._roleCode).subscribe((result: IdashBoard[]) => {
      console.log("result=>", result);
      if (result.length > 0) {
        this.dashBoard = result;
        let delivered: number = 0;
        let incoming: number = 0;
        let outgoing: number = 0;
        let pending: number = 0;
        this.dashBoard.forEach(x => {
          delivered += x.Delivered;
          incoming += x.Incoming;
          outgoing += x.Outgoing;
          pending += x.Pending;
        });
        let dashBoardData = { Delivered: delivered, Incoming: incoming, Outgoing: outgoing, Pending: pending, PriorityName: 'Total', PriorityId: -1 } as IdashBoard
        this.dashBoard.push(dashBoardData)
        this.dataSource = new MatTableDataSource(this.dashBoard);

      } else {
        this.dashBoard = [];
        this.dataSource = new MatTableDataSource(this.dashBoard);
      }
    },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("E-getDashboardUser==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.dashBoard = [];
        this.dataSource = new MatTableDataSource(this.dashBoard);
      });
  }
  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  ngOnInit() {
  }


}
