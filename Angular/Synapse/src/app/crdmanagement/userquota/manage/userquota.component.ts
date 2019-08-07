import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { IUserQuota } from '../_model/userquota.model';
import { UserQuotaService } from '../_service/userquota.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserquotasetlimitComponent } from '../setlimit/userquotasetlimit.component';
import { UserquotadetailsComponent } from '../details/userquotadetails.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-userquota',
  templateUrl: './userquota.component.html',
  styleUrls: ['./userquota.component.scss']
})
export class UserquotaComponent implements OnInit {
  listflag: boolean = false;
  displayedColumns: string[] = ['userName','deptName','platformCredits', 'accountType', 'currentThresholdLimit','departmentCredit','availableBalance', 'expirydate', 'actions'];
  historyDisplayedColumns: string[] = ['txnDateTime','userName', 'deptName','platformCredits','adjustmentType', 'accountType', 'departmentCredit', 'availableBalance','credits', 'expiryDate'];
  userQuotaList:IUserQuota[]=[];
  filterUserQuota:IUserQuota[]=[];
  filterListUserQuota:IUserQuota[]=[];
  searchdata:any;
  public page = 0;
  public size = 9;
  public pageSize = environment.pageSize;
  selectedPage:any;
  isEdit:boolean = false;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  dataSource = new MatTableDataSource<any>();
  historyDataSource = new MatTableDataSource<any>();
  histroyForm: FormGroup;
  constructor(private dialog: MatDialog, private userquotaService:UserQuotaService, private fb: FormBuilder) { }

  ngOnInit() {
      this.userQuotaList = this.userquotaService.getUsertQuotaList();
      this.getData({ pageIndex: this.page, pageSize: this.size });
      this.dataSource = new MatTableDataSource(this.userQuotaList);
      this.historyDataSource = new MatTableDataSource(this.userQuotaList);
      this.dataSource.paginator = this.paginator;
      this.histroyForm = this.fb.group({
        fromDate:[''],
        toDate:[''],
        accountType:[''],
        adjustmentType:[''],
        creditsFrom:[''],
        creditsUpto:['']
      });
  }

  loadList() {
    this.listflag = true;
    this.getListData({ pageIndex: this.page, pageSize: this.size });
  }

  loadGrid() {
    this.listflag = false;
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

  getData(_pageData) {
    let index = 0;
    let startingIndex = _pageData.pageIndex * _pageData.pageSize;
    let endingIndex = startingIndex + _pageData.pageSize;
    this.selectedPage = _pageData.pageIndex;

    this.filterUserQuota = this.userQuotaList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  getListData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;

    this.filterListUserQuota = this.userQuotaList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
    this.dataSource = new MatTableDataSource(this.filterListUserQuota);
  }

  setLimit(){
    this.dialog.open(UserquotasetlimitComponent, this.getDialogConfig());
  }

  updateQuotaDetails(creditDetails){
    this.isEdit = true;
    creditDetails.isEdit = true;
    this.dialog.open(UserquotasetlimitComponent, this.getDialogConfig(creditDetails));
  }

   userQuotaDetails(quotaDetails) {
     this.dialog.open(UserquotadetailsComponent, this.getDialogConfig(quotaDetails));
   }


}

