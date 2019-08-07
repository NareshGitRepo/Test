import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatPaginator, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { AlertMessageService, ActionType, AlertType } from '../../../_services/AlertMessageService';
import { OnlineAlertsService } from '../_service/onlinealerts.service';
import { TranslateService } from '@ngx-translate/core';
import { CreateDBprofileComponent } from '../createprofile/createdbprofile.component';
import { IGDbProfileInfo } from '../_model/onlinealerts.model';
import { environment } from '../../../../environments/environment';
import { ProfiledetailsComponent } from '../detailsprofile/profiledetails.component';
import { AlertConfirmComponent } from '../_model/alertconfirm';
import { AppConfig, ITokenInfo, IUserUpdateDto } from '../../../_helpers/app.config';

@Component({
  selector: 'app-profilemanage',
  templateUrl: './profilemanage.component.html',
  styleUrls: ['./profilemanage.component.scss']
})
export class ProfilemanageComponent implements OnInit {

  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;
  listflag: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = ['profileName', 'dbType', 'dbname', 'serverIp', 'username', 'port', 'connectivity', 'status', 'actions'];
  loading: boolean = false;
  searchdata: string = '';
  _filterType = '';
  profilesList: IGDbProfileInfo[] = [];
  filterProfileList: IGDbProfileInfo[] = [];
  loadTotalProfiles: IGDbProfileInfo[] = [];
  filterListProfile: IGDbProfileInfo[] = [];
  dataSource = new MatTableDataSource<IGDbProfileInfo>();
  loginInfo: IUserUpdateDto;
  _roleCode: string;
  constructor(private dialog: MatDialog, private onlineAlertService: OnlineAlertsService, private translate: TranslateService,
    private router: Router, private alertMessage: AlertMessageService, private appconfig: AppConfig) {
    let tokenInfo = this.appconfig.getTokenInfo() as ITokenInfo;
    if (tokenInfo) {
      this.loginInfo = (tokenInfo.tokenInfo as any).sub ? JSON.parse((tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
      console.log("loginInfo=>", this.loginInfo);
      this._roleCode = this.loginInfo.roles[0].roleCode;
      console.log("rolename::::", this._roleCode);
      this.getonlineProfileData();
    }
    else {
      this.router.navigate(['401']);
    }
  }

  ngOnInit() {

  }
  getonlineProfileData() {
    this.loading = true;
    this.onlineAlertService.getAllProfiles(this._roleCode).subscribe((response: IGDbProfileInfo[]) => {
      if (response) {
        console.log("ProfileResponse==>", response);
        this.profilesList = response;
        this.loadTotalProfiles = response;
        this.dataSource = new MatTableDataSource(this.profilesList);
        this.initPage = 0;
        this.listPage = 0;
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        // this.dataSource.paginator = this.paginator;
      } else {
        this.profilesList = [];
        this.loadTotalProfiles = [];
      }
      this.loading = false;
    }, error => {
      let message = error.error.messages as string
      let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
      console.error("E-getonlineProfileData==>", JSON.stringify(error));
      this.showAlert(errorMessage, ActionType.ERROR, error.status);
      this.loading = false;
    });
  }
  loadList() {
    this.listPage = 0;
    this.listflag = true;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: IGDbProfileInfo, filter: string) => data.profileName.indexOf(filter.toLowerCase()) > -1;
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }
  loadGrid() {
    this.initPage = 0;
    this.listflag = false;
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
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
  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.filterProfileList = this.profilesList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
  }
  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;
    console.log("this.profilesList=>", this.profilesList);

    this.filterListProfile = this.profilesList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListProfile);
    if(this.searchdata!=''){
      this.dataSource = new MatTableDataSource(this.profilesList);
      this.dataSource.filter = this.searchdata.toLowerCase().trim();
    }
    this.listPage = obj.pageIndex;
  }

  ngAfterViewInit() {
    setTimeout(() => { this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator });
  }

  showAlert(error: any, action: ActionType, status: number = 0) {
    if (status == 401)
      this.router.navigate(['401']);
    else setTimeout(() => this.alertMessage.showAlert(error, action));
  }
  addProfile() {
    const dialogRef = this.dialog.open(CreateDBprofileComponent, this.getDialogConfig());
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getonlineProfileData();
      }
    });
  }
  editProfile(profileData) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '40vw'; dialogConfig.height = '92%'; dialogConfig.panelClass = 'rightdailog'; dialogConfig.position = { right: '0px' };
    dialogConfig.disableClose = true;
    dialogConfig.data = profileData;
    const dialogRef = this.dialog.open(CreateDBprofileComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getonlineProfileData();
      }
    });
  }
  profileDetails(profdetails) {
    this.dialog.open(ProfiledetailsComponent, this.getDialogConfig(profdetails));
  }
  profileActiveDialog(profile: IGDbProfileInfo, status: number, ) {
    let data: any = status ? this.translate.instant('OnlineAlertsModule.profilemanage.activateProfile') + " " + "\"" + profile.profileName + "\" ?"
      : this.translate.instant('OnlineAlertsModule.profilemanage.deActivateProfile') + " " + "\"" + profile.profileName + "\" ?"
    const dialogRef = this.dialog.open(AlertConfirmComponent, this.getStatusConfig(data));
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.onlineAlertService.updateProfileStatus(profile.dbProfileId, status)
          .subscribe((result: any) => {
            if (result.status) {
              this.alertMessage.showAlert(result.message, ActionType.SUCCESS, AlertType.SUCCESS);
              this.getonlineProfileData();
            }
            else {
              this.alertMessage.showAlert(result.message, ActionType.FAILED, AlertType.ERROR);
            }
            this.loading = false;
          }, error => {
            let message = error.error.messages as string
            let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
            console.error("E-profileActiveDialog==>", JSON.stringify(error));
            this.alertMessage.showAlert(errorMessage, ActionType.ERROR, error.status);
            this.loading = false;
          });
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
  searchFilter(value) {
    this._filterType = value;
    this.searchdata = '';
    this.initPage=0;
    this.listPage=0;
    switch (value) {
      case '1':
        this.profilesList = this.loadTotalProfiles.filter(data => data.status == 1);
        console.log('profilesList=>', this.profilesList);
        if (this.profilesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterProfileList = [];
          this.dataSource = new MatTableDataSource(this.filterProfileList);
        }
        break;
      case '0':
        this.profilesList = this.loadTotalProfiles.filter(data => data.status == 0);
        console.log('profilesList=>', this.profilesList);
        if (this.profilesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else {
          this.filterProfileList = [];
          this.dataSource = new MatTableDataSource(this.filterProfileList);
        }
        break;
      default:
        this.profilesList = this.loadTotalProfiles;
        console.log('profilesList=>', this.profilesList);
        if (this.profilesList.length > 0) {
          this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
          this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
        }
        else
          this.filterProfileList = [];
        this.dataSource = new MatTableDataSource(this.filterProfileList);
        break;
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.toLowerCase().trim();

    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    this.dataSource.filterPredicate =
      (data: IGDbProfileInfo, filter: string) => data.profileName.indexOf(filter.toLowerCase()) > -1;
  }

  sortData() {
    this.dataSource.sort = this.sort
  }
}