import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogConfig, MatDialog, MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { PlatformquotasetlimitComponent } from '../setlimit/platformquotasetlimit.component';
import { PlatformquotaService } from '../_service/platformquota.service';
import { IPlatformCredit } from '../_model/platformquota.model';
import { Router } from '@angular/router';
import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig, IUserUpdateDto, ITokenInfo } from '../../../_helpers/app.config';

@Component({
  selector: 'app-platformquotamanage',
  templateUrl: './platformquotamanage.component.html',
  styleUrls: ['./platformquotamanage.component.scss']
})
export class PlatformquotamanageComponent implements OnInit {
  loading: boolean = false;
  displayedColumns: string[] = ['availableBalance', 'creditType', 'credits', 'expiryDate', 'actions'];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource();
  initPage = 0;
  listPage = 0;
  platformCredit: IPlatformCredit[] = [];
  filterplatformQuota: IPlatformCredit[] = [];
  searchdata: string ='';
  listflag: boolean = false;
  selectedPage: any;
  pageSize = environment.pageSize;
  tokenInfo: ITokenInfo;
  _roleCode: string = "";
  loginInfo: IUserUpdateDto;
  constructor(private dialog: MatDialog, private _service: PlatformquotaService,private router:Router,private appconfig: AppConfig,
    private alertMessage: AlertMessageService,private translate:TranslateService) { 
      this.tokenInfo = this.appconfig.getTokenInfo() as ITokenInfo;
      if (this.tokenInfo) {
        this.loginInfo = (this.tokenInfo.tokenInfo as any).sub ? JSON.parse((this.tokenInfo.tokenInfo as any).sub) as IUserUpdateDto : undefined;
        console.log("loginInfo=>", this.loginInfo);
        this._roleCode = this.loginInfo.roles[0].roleCode;
        console.log("rolename::::", this._roleCode);
        if(this._roleCode!='SA')
        {
          let index=this.displayedColumns.findIndex(x=>x=='actions');
          if(index!=-1)
          this.displayedColumns.splice(index,1);
        }
      }
      else
        this.router.navigate(['401'])
  
    }

  ngOnInit() {
    this.getPlatformCredits();
  }

  getPlatformCredits() {
    this.loading = true;
    this._service.getPlatformCreditsDetails().subscribe((response: IPlatformCredit[]) => {
      if (response) {
        console.log("Response==>", response);
        this.platformCredit = response;
        this.dataSource = new MatTableDataSource(this.platformCredit);
        this.listPage = 0;
        this.initPage = 0;
        this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });
        this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
      }
       this.loading = false;
         },
      error => {
        let message = error.error.messages as string
        let errorMessage = error.status == 404 ? this.translate.instant('ActionNames.errorResponse') : message ? message : error.message;
        console.error("platformquotamanage==>", JSON.stringify(error));
        this.showAlert(errorMessage, ActionType.ERROR, error.status);
        this.loading = false;
      });
    }
    showAlert(error: any, action: ActionType, status: number = 0) {
      if (status == 401)
        this.router.navigate(['401']);
      else setTimeout(() => this.alertMessage.showAlert(error, action));
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
  
  sortData() {
    this.dataSource.sort = this.sort
  }

  getListData(obj) {
    let index = 0,
    startingIndex = obj.pageIndex * obj.pageSize,
    endingIndex = startingIndex + obj.pageSize;
  console.log("this.platformCredit=>", this.platformCredit);
  this.filterplatformQuota = this.platformCredit.filter(() => {
    index++;
    return (index > startingIndex && index <= endingIndex) ? true : false;
  });
  this.dataSource = new MatTableDataSource(this.filterplatformQuota);
  if(this.searchdata!=''){
    this.dataSource = new MatTableDataSource(this.platformCredit);
    this.dataSource.filter = this.searchdata.toLowerCase().trim();
  }
  this.listPage = obj.pageIndex;
  }
 ngAfterViewInit() {
    setTimeout(() => { this.dataSource.sort = this.sort, this.dataSource.paginator = this.paginator });
  }
  loadGrid() {
    this.initPage=0;
    this.listflag = false;
    this.getData({ pageIndex: this.initPage, pageSize: this.pageSize });

  }
  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.selectedPage = _pageData.pageIndex;
    this.filterplatformQuota = this.platformCredit.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.initPage = _pageData.pageIndex;
    console.log("platformCredit::" + JSON.stringify(this.platformCredit));
  }
  
  loadList() {
    this.listPage=0;
     this.listflag = true;
    this.getListData({ pageIndex: this.listPage, pageSize: this.pageSize });
    
  }
  convertData(value) {
    return value == null ? '' : new Date((value).replace(/\s/g, "T"));
  }
  setLimit(quotaDetails) {

    let dialogRef = this.dialog.open(PlatformquotasetlimitComponent, this.getDialogConfig(quotaDetails));
    dialogRef.afterClosed().subscribe(result => {
      console.log("result ", result);
      if (result) {
        this.getPlatformCredits();
      }
    });

    //  this.dialog.open(DeptquotasetlimitComponent, this.getDialogConfig(quotaDetails));
    // this.getDepartmentsWithCredit();
  }

}
    