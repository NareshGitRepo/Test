import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import { IGetUser, ICreateUsers } from '../_model/IUsers';
import { environment } from '../../../environments/environment';
import { UsersService } from '../_service/users.service';
import { AlertMessageService, ActionType, AlertType } from '../../_services/alertMessageService';
import { CreateuserComponent } from '../createuser/createuser.component';
import { UserAlertComponent } from '../_model/userAlert';
import { AppConfig, IUserUpdateDto, ITokenInfo } from '../../_helpers/app.config';
import { Router } from '@angular/router';
import { UserdetailsComponent } from '../userdetails/userdetails.component';
import { AssigndoctorsComponent } from '../assigndoctors/assigndoctors.component';
import { ManualtokencreateComponent } from '../manualtokencreate/manualtokencreate.component';

@Component({
  selector: 'app-usermanage',
  templateUrl: './usermanage.component.html',
  styleUrls: ['./usermanage.component.scss']
})
export class UserManageComponent implements OnInit {

  loadTotalUsers: IGetUser[] = [];
  totalUsers: IGetUser[] = [];
  filterUsers: IGetUser[] = [];
  initPage = 0;
  pageSize = environment.pageSize;
  searchdata = '';
  _filterType = '';
  _rolename: string;
  _tokenInfo: IUserUpdateDto;
  loading: boolean = false;
  constructor(private usersService: UsersService, public dialog: MatDialog,
    private alertMessage: AlertMessageService, private translate: TranslateService, private appconfig: AppConfig, private router: Router) {
    let tokenData = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenData)
      this._tokenInfo = tokenData.tokenSub;

    if (this._tokenInfo && tokenData) {
      this._rolename = this._tokenInfo.roles[0].roleName;
    }
    else
      this.router.navigate(['401']);
  }

  ngOnInit() {
    this.getUserInfo();
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }

  editDetailsUser(userdetails: any) {
    console.log("userdetails=>",userdetails);
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px', bottom: '0' };
    dialogConfig.disableClose = false;
    dialogConfig.data = userdetails;
    this.dialog.open(UserdetailsComponent, dialogConfig);
  }

  getUserInfo() {
    this.loading = true;
    this.usersService.getUsersById()
      .subscribe((response: IGetUser[]) => {
        if (response) {
          this.totalUsers = response;
          console.log("totalUsers", this.totalUsers);
          this.loadTotalUsers = response;
          if (this.totalUsers.length > 0) {
            this.getData({ pageIndex: this.initPage, pageSize: this.pageSize })
          }
          else
            this.filterUsers = [];
        }
        else {
          this.totalUsers = [];
          this.loadTotalUsers = [];
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
  manualToken(user) {
    console.log("User==>", user);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '30vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px', bottom: '0' };
    dialogConfig.disableClose = true;
    dialogConfig.data = user;
    const dialogRef = this.dialog.open(ManualtokencreateComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUserInfo();
      }
    });
  }
  searchFilter(value) {
    this._filterType = value;
    this.searchdata = '';
    switch (value) {
      case '1':
        this.totalUsers = this.loadTotalUsers.filter(data => data.isactive == 1);
        console.log('users=>', this.totalUsers);
        if (this.totalUsers.length > 0) {
          this.initPage=0;
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize })
        }
        else
          this.filterUsers = [];
        break;
      case '0':
        this.totalUsers = this.loadTotalUsers.filter(data => data.isactive == 0);
        console.log('users=>', this.totalUsers);
        if (this.totalUsers.length > 0) {
          this.initPage=0;
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize })
        }
        else
          this.filterUsers = [];
        break;
      default:
        this.totalUsers = this.loadTotalUsers;
        console.log('users=>', this.totalUsers);
        if (this.totalUsers.length > 0) {
          this.initPage=0;
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize })
        }
        else
          this.filterUsers = [];
        break;
    }
  }

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;

    this.filterUsers = this.totalUsers.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
  }

  createNewUser(): void {
    console.log("Create Role:");
    const dialogRef = this.dialog.open(CreateuserComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUserInfo();
      }
    });
  }

  assignDoctors(userdetails: IGetUser) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '35vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px', bottom: '0' };
    dialogConfig.disableClose = true;
    dialogConfig.data = userdetails;
    const dialogRef = this.dialog.open(AssigndoctorsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUserInfo();
      }
    });
  }
  editUser(userdetails: IGetUser) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '45vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px', bottom: '0' };
    dialogConfig.disableClose = true;
    dialogConfig.data = userdetails;
    const dialogRef = this.dialog.open(CreateuserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getUserInfo();
      }

    });

  }

  userActiveDialog(user: ICreateUsers, isactive: number) {
    let data: any = isactive ? this.translate.instant('usersModule.activate') : this.translate.instant('usersModule.deActivate');
    const dialogRef = this.dialog.open(UserAlertComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        user.isactive = isactive;
        this.usersService.updateUserStatus(user.userId, user.isactive)
          .subscribe(responce => {
            if (responce.status) {
              this.alertMessage.showAlert(responce.messages, ActionType.SUCCESS, AlertType.SUCCESS);
              if (this._filterType != '') {
                this.getUserInfo();
                this._filterType = '';
                this.searchdata = '';
              }
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
  resetPassword(userId: number) {
    let data: any = this.translate.instant('usersModule.resetPassword');
    const dialogRef = this.dialog.open(UserAlertComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.resetPassword(userId)
          .subscribe(response => {
            if (response) {
              this.alertMessage.showAlert(response.messages, ActionType.SUCCESS, AlertType.SUCCESS);
              if (this._filterType != '') {
                this.getUserInfo();
                this._filterType = '';
                this.searchdata = '';
              }
            } else {
              this.alertMessage.showAlert(response.messages, ActionType.FAILED, AlertType.ERROR);
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
  deleteUser(deleteid: number) {
    let data: any = this.translate.instant('usersModule.deleteuser');
    const dialogRef = this.dialog.open(UserAlertComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.deleteUserByid(deleteid)
          .subscribe(responce => {
            if (responce.status) {
              this.alertMessage.showAlert(responce.messages, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getUserInfo();
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
    dialogConfig.width = '250px';
    dialogConfig.disableClose = true;
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }

  getDialogConfig(data?: any): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '45vw';
    dialogConfig.height = '92.5%';
    dialogConfig.panelClass = 'rightdailog';
    dialogConfig.position = { right: '0px', bottom: '0' };
    data ? dialogConfig.data = data : undefined;
    dialogConfig.disableClose = true;
    return dialogConfig;
  }
}