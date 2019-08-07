import { ActionType, AlertMessageService } from '../../../_services/AlertMessageService';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { DeptquotadetailsComponent } from '../details/deptquotadetails.component';
import { DeptquotahistoryComponent } from '../history/deptquotahistory.component';
import { DeptquotasetlimitComponent } from '../setlimit/deptquotasetlimit.component';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { DepartmentquotaService } from '../_service/departmentquota.service';
import { IDepartmentQuota, IHistory } from '../_model/departmentquota.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-departmentquotamanage',
  templateUrl: './departmentquotamanage.component.html',
  styleUrls: ['./departmentquotamanage.component.scss']
})
export class DepartmentquotamanageComponent implements OnInit {

  listflag: boolean = false;
  displayedColumns: string[] = ['department', 'platformCredits','accountType', 'adjustmentType', 'availableBalance', 'actions'];
  historyDisplayedColumns: string[] = ['txnDateTime', 'department','platformCredits','adjustmentType', 'accountType', 'availableBalance','credits', 'expiryDate'];
  searchdata: string;
  public page = 0;
  public size = 6;
  selectedPage: any;
  departmentQuotaDetails:IDepartmentQuota[]=[]

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource = new MatTableDataSource<IDepartmentQuota>();

  historyDataSource = new MatTableDataSource<IHistory>();
  historyForm:FormGroup;
  historyDetails:IHistory[]=[];
  public loading: boolean = false;
  initPage = 0;
  listPage = 0;
  pageSize = environment.pageSize;

  constructor(private dialog: MatDialog, private departmentService:DepartmentquotaService,private fb:FormBuilder,
    private translate: TranslateService, private router: Router, private alertMessage: AlertMessageService) { }

  ngOnInit() {
     this.historyForm = this.fb.group({
      fromDate:['',Validators.required],
      toDate:['',Validators.required],
      accountType:[''],
      adjustmentType:[''],
      creditsFrom:[''],
      creditsUpto:['']
    });
   this.departmentQuotaDetails = this.departmentService.getDepartmentQuota();
   this.historyDetails = this.departmentService.getHistory();
   this.dataSource = new MatTableDataSource(this.departmentQuotaDetails);
   this.historyDataSource = new MatTableDataSource(this.historyDetails)
   console.log("quots=>>>",this.departmentQuotaDetails);
   
  }

  loadList() {
    this.listflag = true;
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
  
  setLimit() {

    let dialogRef = this.dialog.open(DeptquotasetlimitComponent, this.getDialogConfig());
    
  }

  deptQuotaDetails(quotaDetails) {
    let dialogRef = this.dialog.open(DeptquotadetailsComponent, this.getDialogConfig(quotaDetails));

  }

  updateLimit(departmentquota){
    let dialogRef = this.dialog.open(DeptquotasetlimitComponent, this.getDialogConfig(departmentquota));
 
  }

 

}
